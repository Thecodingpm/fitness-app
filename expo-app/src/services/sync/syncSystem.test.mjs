// syncSystem.test.mjs — Comprehensive Unit Tests for Offline Sync V2 & Persistent Queue

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SyncOperationType,
  isStateBasedOperation
} from './syncOperations.js';
import {
  calculateBackoffMs,
  isRetryableError
} from './syncBackoff.js';
import {
  loadQueue,
  saveQueue,
  enqueueOperation,
  dequeueOperation,
  markOperationAttempt,
  getPendingOperations,
  getQueueCount,
  clearQueue,
  setStorageDriver,
  QUEUE_STORAGE_KEY,
  QUEUE_SCHEMA_VERSION
} from './syncQueue.js';
import {
  requestQueueDrain,
  getSyncStatus,
  setOperationExecutor
} from './syncWorker.js';

// In-memory mock storage driver for deterministic testing
function createMockStorage() {
  const store = new Map();
  return {
    store,
    getItem: async (key) => store.get(key) || null,
    setItem: async (key, val) => store.set(key, String(val)),
    removeItem: async (key) => store.delete(key),
    clear: async () => store.clear()
  };
}

// Setup fresh mock storage before each test block
let mockStorage;
function resetMockEnvironment() {
  mockStorage = createMockStorage();
  setStorageDriver(mockStorage);
  setOperationExecutor(async () => ({ ok: true }));
}

// ============================================================================
// 1. PURE BACKOFF & RETRY CLASSIFICATION TESTS
// ============================================================================

test('calculateBackoffMs produces exponential progression', () => {
  const b0 = calculateBackoffMs(0);
  const b1 = calculateBackoffMs(1, { addJitter: false });
  const b2 = calculateBackoffMs(2, { addJitter: false });
  const b3 = calculateBackoffMs(3, { addJitter: false });
  const b6 = calculateBackoffMs(6, { addJitter: false });

  assert.equal(b0, 0);
  assert.equal(b1, 5000, 'Attempt 1 must be base delay (5s)');
  assert.equal(b2, 12500, 'Attempt 2 must be base * 2.5 (12.5s)');
  assert.equal(b3, 31250, 'Attempt 3 must be base * 2.5^2 (31.25s)');
  assert.ok(b6 <= 15 * 60 * 1000, 'Must be capped at max delay');
});

test('isRetryableError classifies error codes accurately', () => {
  assert.equal(isRetryableError('NETWORK_ERROR'), true);
  assert.equal(isRetryableError('TIMEOUT'), true);
  assert.equal(isRetryableError('RATE_LIMITED'), true);
  assert.equal(isRetryableError('SERVER_ERROR'), true);

  assert.equal(isRetryableError('PERMISSION_DENIED'), false);
  assert.equal(isRetryableError('AUTH_REQUIRED'), false);
  assert.equal(isRetryableError('NOT_FOUND'), false);
});

// ============================================================================
// 2. QUEUE PERSISTENCE & SCHEMA VERSIONING
// ============================================================================

test('Queue persistence: enqueue saves operation and survives reload', async () => {
  resetMockEnvironment();

  const op = await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_bench_01',
    userId: 'user_123',
    payload: { id: 'set_bench_01', weightKg: 100, reps: 5 }
  });

  assert.ok(op);
  assert.equal(op.entityId, 'set_bench_01');
  assert.equal(op.status, 'pending');

  // Reload queue from mock storage
  const loaded = await loadQueue();
  assert.equal(loaded.schemaVersion, QUEUE_SCHEMA_VERSION);
  assert.equal(loaded.operations.length, 1);
  assert.equal(loaded.operations[0].id, op.id);
  assert.equal(loaded.operations[0].payload.weightKg, 100);
});

// ============================================================================
// 3. SUCCESSFUL CLOUD SYNC & DEQUEUE
// ============================================================================

test('Successful sync: executed operation is dequeued automatically', async () => {
  resetMockEnvironment();

  let executedOp = null;
  setOperationExecutor(async (operation) => {
    executedOp = operation;
    return { ok: true };
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_squat_01',
    userId: 'user_123',
    payload: { id: 'set_squat_01', weightKg: 140, reps: 3 }
  });

  assert.equal(await getQueueCount('user_123'), 1);

  const result = await requestQueueDrain({ userId: 'user_123' });
  assert.equal(result.drained, 1);
  assert.equal(result.pending, 0);
  assert.equal(await getQueueCount('user_123'), 0);
  assert.equal(executedOp.entityId, 'set_squat_01');
});

// ============================================================================
// 4. NETWORK FAILURE & BACKOFF SCHEDULING
// ============================================================================

test('Failed network sync: operation remains, attempts increments, nextAttemptAt assigned', async () => {
  resetMockEnvironment();

  setOperationExecutor(async () => {
    const error = new Error('Device is offline');
    error.code = 'NETWORK_ERROR';
    throw error;
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_deadlift_01',
    userId: 'user_123',
    payload: { id: 'set_deadlift_01', weightKg: 180, reps: 1 }
  });

  const drainResult = await requestQueueDrain({ userId: 'user_123' });
  assert.equal(drainResult.drained, 0);

  const queue = await loadQueue();
  assert.equal(queue.operations.length, 1);
  const op = queue.operations[0];

  assert.equal(op.attempts, 1);
  assert.equal(op.lastErrorCode, 'NETWORK_ERROR');
  assert.ok(op.nextAttemptAt > Date.now());
});

// ============================================================================
// 5. RETRY ONCE BACKOFF EXPIRES
// ============================================================================

test('Retry succeeds after backoff window expires', async () => {
  resetMockEnvironment();

  let attemptCount = 0;
  setOperationExecutor(async () => {
    attemptCount++;
    if (attemptCount === 1) {
      const error = new Error('Temporary 503 error');
      error.code = 'SERVER_ERROR';
      throw error;
    }
    return { ok: true };
  });

  const op = await enqueueOperation({
    operationType: SyncOperationType.UPSERT_WORKOUT,
    entityId: 'workout_01',
    userId: 'user_123',
    payload: { id: 'workout_01', totalVolumeKg: 5000 }
  });

  // First drain: fails with SERVER_ERROR
  await requestQueueDrain({ userId: 'user_123' });
  assert.equal(await getQueueCount('user_123'), 1);

  // Fast-forward backoff delay (reset nextAttemptAt to past)
  await markOperationAttempt(op.id, { errorCode: 'SERVER_ERROR', nextAttemptAt: Date.now() - 1000 });

  // Second drain: succeeds
  const secondResult = await requestQueueDrain({ userId: 'user_123' });
  assert.equal(secondResult.drained, 1);
  assert.equal(await getQueueCount('user_123'), 0);
});

// ============================================================================
// 6. IDEMPOTENCY GUARANTEE
// ============================================================================

test('Idempotency: duplicate enqueue of same entityId updates payload without duplicating', async () => {
  resetMockEnvironment();

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_stable_99',
    userId: 'user_123',
    payload: { id: 'set_stable_99', weightKg: 80, reps: 10 }
  });

  // Re-enqueue same entityId with updated reps
  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_stable_99',
    userId: 'user_123',
    payload: { id: 'set_stable_99', weightKg: 80, reps: 12 }
  });

  const queue = await loadQueue();
  assert.equal(queue.operations.length, 1, 'Queue must not contain duplicate entries for same entityId');
  assert.equal(queue.operations[0].payload.reps, 12, 'Must contain updated payload');
});

// ============================================================================
// 7. STATE COMPACTION (PROFILE & STATUSES)
// ============================================================================

test('Deduplication: state-based updates compact to latest payload', async () => {
  resetMockEnvironment();

  assert.equal(isStateBasedOperation(SyncOperationType.UPDATE_PROFILE), true);

  await enqueueOperation({
    operationType: SyncOperationType.UPDATE_PROFILE,
    userId: 'user_123',
    payload: { weight: 70 }
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPDATE_PROFILE,
    userId: 'user_123',
    payload: { weight: 71 }
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPDATE_PROFILE,
    userId: 'user_123',
    payload: { weight: 72 }
  });

  const queue = await loadQueue();
  assert.equal(queue.operations.length, 1, 'Only one profile update should be pending');
  assert.equal(queue.operations[0].payload.weight, 72, 'Should hold the latest weight (72 kg)');
});

// ============================================================================
// 8. HISTORICAL WORKOUT DATA INTEGRITY
// ============================================================================

test('Historical data integrity: two different completed sets remain distinct', async () => {
  resetMockEnvironment();

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_1',
    userId: 'user_123',
    payload: { id: 'set_1', exerciseName: 'Bench Press', reps: 5 }
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_2',
    userId: 'user_123',
    payload: { id: 'set_2', exerciseName: 'Bench Press', reps: 5 }
  });

  const queue = await loadQueue();
  assert.equal(queue.operations.length, 2, 'Distinct workout sets must NEVER be collapsed together');
});

// ============================================================================
// 9. PERMISSION DENIED HANDLING (NO RAPID LOOP)
// ============================================================================

test('Permission error: PERMISSION_DENIED marks op failed with 0 rapid retries', async () => {
  resetMockEnvironment();

  let callCount = 0;
  setOperationExecutor(async () => {
    callCount++;
    const error = new Error('Permission denied');
    error.code = 'PERMISSION_DENIED';
    throw error;
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_WORKOUT,
    entityId: 'workout_denied',
    userId: 'user_123',
    payload: { id: 'workout_denied' }
  });

  // First drain attempts once and fails
  await requestQueueDrain({ userId: 'user_123' });
  assert.equal(callCount, 1);

  const queue = await loadQueue();
  assert.equal(queue.operations[0].status, 'failed');
  assert.equal(queue.operations[0].lastErrorCode, 'PERMISSION_DENIED');

  // Second drain skips it
  await requestQueueDrain({ userId: 'user_123' });
  assert.equal(callCount, 1, 'PERMISSION_DENIED operation must not be retried in a rapid loop');
});

// ============================================================================
// 10. AUTH REQUIRED PAUSES DRAIN (DATA PRESERVED)
// ============================================================================

test('Authentication: AUTH_REQUIRED preserves queued operations and pauses processing', async () => {
  resetMockEnvironment();

  setOperationExecutor(async () => {
    const error = new Error('Session expired');
    error.code = 'AUTH_REQUIRED';
    throw error;
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_auth_test',
    userId: 'user_123',
    payload: { id: 'set_auth_test' }
  });

  await requestQueueDrain({ userId: 'user_123' });

  const queue = await loadQueue();
  assert.equal(queue.operations.length, 1, 'Queued operation must NOT be deleted when auth expires');
  assert.equal(queue.operations[0].id.includes('sync_'), true);
});

// ============================================================================
// 11. ACCOUNT ISOLATION
// ============================================================================

test('Account isolation: User A operation is NOT processed when User B drains', async () => {
  resetMockEnvironment();

  let userBSynced = false;
  let userASynced = false;

  setOperationExecutor(async (op) => {
    if (op.userId === 'user_B') userBSynced = true;
    if (op.userId === 'user_A') userASynced = true;
    return { ok: true };
  });

  // Enqueue for User A
  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_A',
    userId: 'user_A',
    payload: { id: 'set_A' }
  });

  // Enqueue for User B
  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_B',
    userId: 'user_B',
    payload: { id: 'set_B' }
  });

  // User B drains
  const result = await requestQueueDrain({ userId: 'user_B' });
  assert.equal(result.drained, 1);
  assert.equal(userBSynced, true);
  assert.equal(userASynced, false, 'User A operation must NOT be executed');

  // Verify User A's operation is still safely in the queue
  const queue = await loadQueue();
  assert.equal(queue.operations.length, 1);
  assert.equal(queue.operations[0].userId, 'user_A');
});

// ============================================================================
// 12. GUEST USERS (SAFE REJECTION)
// ============================================================================

test('Guest mode: guest operations are not queued for authenticated cloud sync', async () => {
  resetMockEnvironment();

  const res = await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_guest',
    userId: 'guest',
    payload: { id: 'set_guest' }
  });

  assert.equal(res, null);
  const queue = await loadQueue();
  assert.equal(queue.operations.length, 0, 'Guest operations should not enter cloud sync queue');
});

// ============================================================================
// 13. WORKER MUTEX & CONCURRENCY LOCK
// ============================================================================

test('Single-worker lock: concurrent drain requests execute safely without collisions', async () => {
  resetMockEnvironment();

  let concurrentCount = 0;
  let maxConcurrent = 0;

  setOperationExecutor(async () => {
    concurrentCount++;
    maxConcurrent = Math.max(maxConcurrent, concurrentCount);
    await new Promise(r => setTimeout(r, 20));
    concurrentCount--;
    return { ok: true };
  });

  await enqueueOperation({
    operationType: SyncOperationType.UPSERT_COMPLETED_SET,
    entityId: 'set_conc_1',
    userId: 'user_123',
    payload: { id: 'set_conc_1' }
  });

  // Trigger multiple drains simultaneously
  const p1 = requestQueueDrain({ userId: 'user_123' });
  const p2 = requestQueueDrain({ userId: 'user_123' });
  const p3 = requestQueueDrain({ userId: 'user_123' });

  await Promise.all([p1, p2, p3]);

  assert.equal(maxConcurrent, 1, 'Only one worker execution should be active at any given moment');
  assert.equal(await getQueueCount('user_123'), 0);
});

// ============================================================================
// 14. CORRUPTED QUEUE RECOVERY
// ============================================================================

test('Corrupted queue recovery: malformed JSON returns safe empty schema without crash', async () => {
  resetMockEnvironment();

  // Inject corrupted data
  await mockStorage.setItem(QUEUE_STORAGE_KEY, '{ invalid_json_syntax %%%');

  const loaded = await loadQueue();
  assert.equal(loaded.schemaVersion, QUEUE_SCHEMA_VERSION);
  assert.deepEqual(loaded.operations, []);
});
