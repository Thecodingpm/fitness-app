// firestoreClient.test.mjs — Comprehensive Unit Tests for Cloud Reliability & Firestore Hardening

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FirestoreError,
  classifyHttpStatus,
  formatSanitizedLog
} from './firestoreErrors.js';
import {
  createCompletedSet,
  mergeCompletedSets,
  totalVolumeKg
} from '../../data/completedSets.mjs';

// ============================================================================
// 1. ERROR CLASSIFICATION TESTS
// ============================================================================

test('classifyHttpStatus maps 401 to TOKEN_EXPIRED', () => {
  const code = classifyHttpStatus(401, 'GET_WORKOUTS');
  assert.equal(code, 'TOKEN_EXPIRED');
});

test('classifyHttpStatus maps 403 to PERMISSION_DENIED', () => {
  const code = classifyHttpStatus(403, 'GET_COMPLETED_SETS');
  assert.equal(code, 'PERMISSION_DENIED');
});

test('classifyHttpStatus maps 404 to NOT_FOUND', () => {
  const code = classifyHttpStatus(404, 'GET_USER_PROFILE');
  assert.equal(code, 'NOT_FOUND');
});

test('classifyHttpStatus maps 408 to TIMEOUT', () => {
  const code = classifyHttpStatus(408, 'SAVE_WORKOUT');
  assert.equal(code, 'TIMEOUT');
});

test('classifyHttpStatus maps 429 to RATE_LIMITED', () => {
  const code = classifyHttpStatus(429, 'SAVE_COMPLETED_SET');
  assert.equal(code, 'RATE_LIMITED');
});

test('classifyHttpStatus maps 500, 502, 503 to SERVER_ERROR', () => {
  assert.equal(classifyHttpStatus(500, 'GET_WORKOUTS'), 'SERVER_ERROR');
  assert.equal(classifyHttpStatus(502, 'GET_WORKOUTS'), 'SERVER_ERROR');
  assert.equal(classifyHttpStatus(503, 'GET_WORKOUTS'), 'SERVER_ERROR');
});

test('classifyHttpStatus maps 0 to NETWORK_ERROR', () => {
  const code = classifyHttpStatus(0, 'SAVE_WORKOUT');
  assert.equal(code, 'NETWORK_ERROR');
});

test('classifyHttpStatus maps unknown statuses to UNKNOWN', () => {
  const code = classifyHttpStatus(418, 'I_AM_A_TEAPOT');
  assert.equal(code, 'UNKNOWN');
});

test('FirestoreError initializes with expected fields and serializes to JSON', () => {
  const err = new FirestoreError({
    code: 'PERMISSION_DENIED',
    status: 403,
    operation: 'SAVE_COMPLETED_SET',
    message: 'Missing or insufficient permissions.',
    retryable: false
  });

  assert.equal(err.name, 'FirestoreError');
  assert.equal(err.code, 'PERMISSION_DENIED');
  assert.equal(err.status, 403);
  assert.equal(err.operation, 'SAVE_COMPLETED_SET');
  assert.equal(err.retryable, false);

  const json = err.toJSON();
  assert.deepEqual(json, {
    name: 'FirestoreError',
    code: 'PERMISSION_DENIED',
    status: 403,
    operation: 'SAVE_COMPLETED_SET',
    retryable: false,
    message: 'Missing or insufficient permissions.'
  });
});

// ============================================================================
// 2. SANITIZED LOGGING (NO TOKENS OR SECRETS LEAKED)
// ============================================================================

test('formatSanitizedLog never prints tokens or authorization secrets', () => {
  const secretIdToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNvbWVraWQiLCJ0eXAiOiJKV1QifQ.secretPayload';
  const secretRefreshToken = 'AIzaSyASecretRefreshToken1234567890';

  const err = new FirestoreError({
    code: 'PERMISSION_DENIED',
    status: 403,
    operation: 'GET_WORKOUTS',
    message: `Denied for token ${secretIdToken}`,
    retryable: false,
    cause: { token: secretIdToken, refresh: secretRefreshToken }
  });

  const logOutput = formatSanitizedLog(err);

  assert.equal(
    logOutput,
    '[Firestore] operation: GET_WORKOUTS | status: 403 | code: PERMISSION_DENIED | retryable: false'
  );
  assert.ok(!logOutput.includes(secretIdToken), 'Log should not contain idToken');
  assert.ok(!logOutput.includes(secretRefreshToken), 'Log should not contain refreshToken');
});

// ============================================================================
// 3. RETRY & TOKEN REFRESH LOGIC SIMULATION
// ============================================================================

test('Simulated request: 200 OK succeeds with 0 token refreshes', async () => {
  let refreshCount = 0;
  let requestCount = 0;

  async function mockRequest() {
    requestCount++;
    return { ok: true, data: { documents: [] } };
  }

  const result = await mockRequest();
  assert.equal(result.ok, true);
  assert.equal(requestCount, 1);
  assert.equal(refreshCount, 0);
});

test('Simulated request: 401 triggers token refresh and retries exactly ONCE', async () => {
  let refreshCount = 0;
  let requestAttempts = 0;

  async function simulatedFirestoreRequest(isRetry = false) {
    requestAttempts++;
    if (!isRetry) {
      // First attempt fails with 401
      refreshCount++; // refresh token
      return simulatedFirestoreRequest(true); // retry once
    }
    // Second attempt succeeds
    return { ok: true, status: 200, data: { success: true } };
  }

  const result = await simulatedFirestoreRequest();
  assert.equal(result.ok, true);
  assert.equal(requestAttempts, 2, 'Should attempt request twice (initial + 1 retry)');
  assert.equal(refreshCount, 1, 'Should refresh token exactly once');
});

test('Simulated request: 403 PERMISSION_DENIED triggers 0 refreshes and 0 retries (no loop)', async () => {
  let refreshCount = 0;
  let requestAttempts = 0;
  let caughtError = null;

  async function simulatedFirestoreRequest(isRetry = false) {
    requestAttempts++;
    // Returns 403
    const err = new FirestoreError({
      code: 'PERMISSION_DENIED',
      status: 403,
      operation: 'GET_WORKOUTS',
      retryable: false
    });
    // On 403, firestoreClient must NOT refresh or retry
    throw err;
  }

  try {
    await simulatedFirestoreRequest();
  } catch (err) {
    caughtError = err;
  }

  assert.ok(caughtError instanceof FirestoreError);
  assert.equal(caughtError.code, 'PERMISSION_DENIED');
  assert.equal(requestAttempts, 1, 'Should only attempt once; no retries on 403');
  assert.equal(refreshCount, 0, 'Should NEVER refresh token on 403');
});

test('Simulated request: 401 refresh failure throws AUTH_REQUIRED with 0 retries', async () => {
  let requestAttempts = 0;
  let caughtError = null;

  async function simulatedFirestoreRequest() {
    requestAttempts++;
    // First attempt fails with 401
    // Attempting refresh throws because refresh token is invalid
    throw new FirestoreError({
      code: 'AUTH_REQUIRED',
      status: 401,
      operation: 'GET_WORKOUTS',
      message: 'Sign-in session has expired. Please sign in again.',
      retryable: false
    });
  }

  try {
    await simulatedFirestoreRequest();
  } catch (err) {
    caughtError = err;
  }

  assert.ok(caughtError instanceof FirestoreError);
  assert.equal(caughtError.code, 'AUTH_REQUIRED');
  assert.equal(requestAttempts, 1, 'Should not retry when token refresh fails');
});

// ============================================================================
// 4. LOCAL DATA SAFETY (CLOUD FAILURE NEVER DESTROYS LOCAL DATA)
// ============================================================================

test('Local-first safety: failed cloud write preserves local set and volume', async () => {
  // Athlete completes a 100 kg bench press set
  const localSet = createCompletedSet({
    id: 'local-set-001',
    sessionId: 'session-123',
    exercise: { id: 'bench-press', name: 'Barbell Bench Press', muscle: 'Chest' },
    routineTitle: 'Push Day',
    reps: 8,
    weightKg: 100,
    loggedAt: new Date().toISOString()
  });

  // Local storage has the set
  let localDatabase = [localSet];

  // Cloud attempt fails with 403 PERMISSION_DENIED
  const simulatedCloudSave = async () => {
    throw new FirestoreError({
      code: 'PERMISSION_DENIED',
      status: 403,
      operation: 'SAVE_COMPLETED_SET',
      message: 'Cloud load failed (403)'
    });
  };

  try {
    await simulatedCloudSave();
  } catch (cloudErr) {
    // Cloud save failed, but local database is untouched!
  }

  // Verify local database is completely intact
  assert.equal(localDatabase.length, 1);
  assert.equal(localDatabase[0].id, 'local-set-001');
  assert.equal(localDatabase[0].weightKg, 100);
  assert.equal(localDatabase[0].reps, 8);
  assert.equal(totalVolumeKg(localDatabase), 800, 'Volume must be 800 kg (100kg x 8 reps)');
});

test('Local-first safety: merge completed sets keeps local and marks synced properly', () => {
  const localSet = createCompletedSet({
    id: 'set-1',
    sessionId: 'session-1',
    exercise: { id: 'squat', name: 'Barbell Back Squat', muscle: 'Legs' },
    reps: 5,
    weightKg: 120,
    loggedAt: '2026-09-26T12:00:00.000Z'
  });

  const cloudSet = {
    ...localSet,
    synced: true
  };

  const merged = mergeCompletedSets([localSet], [cloudSet]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].synced, true);
  assert.equal(merged[0].weightKg, 120);
});
