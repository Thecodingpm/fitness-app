// syncQueue.js — Atomic Persistent Queue Storage for LIFT Cloud Sync

import AsyncStorageModule from '@react-native-async-storage/async-storage';
import { isStateBasedOperation } from './syncOperations.js';

const defaultAsyncStorage = AsyncStorageModule?.default || AsyncStorageModule;
let storageDriver = defaultAsyncStorage;

export function setStorageDriver(driver) {
  storageDriver = driver || defaultAsyncStorage;
}

export const QUEUE_STORAGE_KEY = '@lift/pending_sync_queue_v1';
export const QUEUE_SCHEMA_VERSION = 1;
export const QUEUE_WARNING_THRESHOLD = 500;

// Internal promise chain to serialize queue mutations and prevent race conditions
let mutationChain = Promise.resolve();

function serializeMutation(fn) {
  const next = mutationChain.then(fn, fn);
  mutationChain = next.catch(() => {});
  return next;
}

/**
 * Loads the persistent queue from AsyncStorage with safe corrupted data recovery.
 */
export async function loadQueue() {
  try {
    const raw = await storageDriver.getItem(QUEUE_STORAGE_KEY);
    if (!raw) {
      return { schemaVersion: QUEUE_SCHEMA_VERSION, operations: [] };
    }

    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || !Array.isArray(parsed.operations)) {
      throw new Error('Malformed sync queue schema.');
    }

    return parsed;
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`[SyncQueue] WARNING: Failed to parse sync queue. Attempting safe recovery: ${err.message}`);
    }
    // Attempt emergency backup of raw string before resetting
    try {
      const raw = await storageDriver.getItem(QUEUE_STORAGE_KEY);
      if (raw && typeof raw === 'string') {
        await storageDriver.setItem(`@lift/corrupted_queue_backup_${Date.now()}`, raw);
      }
    } catch (_) {}

    return { schemaVersion: QUEUE_SCHEMA_VERSION, operations: [] };
  }
}

/**
 * Persists the queue object to AsyncStorage.
 */
export async function saveQueue(queue) {
  try {
    const payload = {
      schemaVersion: QUEUE_SCHEMA_VERSION,
      operations: Array.isArray(queue?.operations) ? queue.operations : []
    };

    if (payload.operations.length > QUEUE_WARNING_THRESHOLD) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(`[SyncQueue] WARNING: High queue volume (${payload.operations.length} operations).`);
      }
    }

    await storageDriver.setItem(QUEUE_STORAGE_KEY, JSON.stringify(payload));
    return payload;
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`[SyncQueue] ERROR: Could not save queue: ${err.message}`);
    }
    return null;
  }
}

/**
 * Atomically enqueues an operation with deduplication and state compaction.
 *
 * Rules:
 * - Unauthenticated or guest users are ignored (return null).
 * - State-based updates (Profile, Daily Statuses) compact into the latest payload per user.
 * - Event-based records (Completed Sets, Workouts) maintain stable entity identity and are never merged across different entity IDs.
 */
export function enqueueOperation({
  operationType,
  entityId = null,
  userId,
  payload
}) {
  if (!userId || userId === 'guest') {
    return Promise.resolve(null);
  }

  return serializeMutation(async () => {
    const queue = await loadQueue();
    const now = Date.now();
    const effectiveEntityId = entityId || payload?.id || `op_${now}_${Math.random().toString(36).slice(2, 8)}`;

    let existingIndex = -1;

    if (isStateBasedOperation(operationType)) {
      // Deduplicate state-based operations by operationType + userId
      existingIndex = queue.operations.findIndex(
        op => op.operationType === operationType && op.userId === userId
      );
    } else {
      // Deduplicate event-based operations by operationType + entityId + userId
      existingIndex = queue.operations.findIndex(
        op => op.operationType === operationType && op.entityId === effectiveEntityId && op.userId === userId
      );
    }

    const opItem = {
      id: existingIndex >= 0 ? queue.operations[existingIndex].id : `sync_${now}_${Math.random().toString(36).slice(2, 9)}`,
      operationType,
      entityId: effectiveEntityId,
      userId,
      payload,
      createdAt: existingIndex >= 0 ? queue.operations[existingIndex].createdAt : now,
      updatedAt: now,
      attempts: existingIndex >= 0 ? queue.operations[existingIndex].attempts : 0,
      nextAttemptAt: null, // Reset backoff delay when new payload arrives
      status: 'pending',
      lastErrorCode: null
    };

    if (existingIndex >= 0) {
      queue.operations[existingIndex] = opItem;
    } else {
      queue.operations.push(opItem);
    }

    await saveQueue(queue);
    return opItem;
  });
}

/**
 * Atomically removes an operation from the queue by ID upon successful cloud sync.
 */
export function dequeueOperation(opId) {
  if (!opId) return Promise.resolve(false);

  return serializeMutation(async () => {
    const queue = await loadQueue();
    const initialCount = queue.operations.length;
    queue.operations = queue.operations.filter(op => op.id !== opId);

    if (queue.operations.length !== initialCount) {
      await saveQueue(queue);
      return true;
    }
    return false;
  });
}

/**
 * Atomically updates an operation's attempt count, status, error code, and nextAttemptAt timestamp.
 */
export function markOperationAttempt(opId, { errorCode = null, nextAttemptAt = null }) {
  if (!opId) return Promise.resolve(null);

  return serializeMutation(async () => {
    const queue = await loadQueue();
    const op = queue.operations.find(o => o.id === opId);
    if (!op) return null;

    op.attempts = (op.attempts || 0) + 1;
    op.updatedAt = Date.now();
    op.lastErrorCode = errorCode;
    op.nextAttemptAt = nextAttemptAt;
    op.status = errorCode === 'PERMISSION_DENIED' ? 'failed' : 'pending';

    await saveQueue(queue);
    return op;
  });
}

/**
 * Gets pending operations filtered for a specific user ID.
 * Operations for other users are safely filtered out.
 */
export async function getPendingOperations(userId) {
  if (!userId || userId === 'guest') return [];
  const queue = await loadQueue();
  return queue.operations.filter(op => op.userId === userId);
}

/**
 * Gets the number of pending operations for a specific user.
 */
export async function getQueueCount(userId) {
  if (!userId || userId === 'guest') return 0;
  const pending = await getPendingOperations(userId);
  return pending.length;
}

/**
 * Clears operations for a specific user (e.g. account wipe) without affecting other accounts.
 */
export function clearQueue(userId) {
  return serializeMutation(async () => {
    const queue = await loadQueue();
    if (userId) {
      queue.operations = queue.operations.filter(op => op.userId !== userId);
    } else {
      queue.operations = [];
    }
    await saveQueue(queue);
    return true;
  });
}
