// syncWorker.js — Single-Worker Queue Drainer with NetInfo & AppState Integration

import {
  getPendingOperations,
  dequeueOperation,
  markOperationAttempt,
  getQueueCount
} from './syncQueue.js';
import { executeSyncOperation as defaultExecuteSyncOperation } from './syncOperations.js';
import { calculateBackoffMs, isRetryableError } from './syncBackoff.js';
import { FirestoreError } from '../firebase/firestoreErrors.js';

// Configurable operation executor (allows mocking in test environments)
let currentOperationExecutor = defaultExecuteSyncOperation;

export function setOperationExecutor(executor) {
  currentOperationExecutor = executor || defaultExecuteSyncOperation;
}

// Single-worker mutex and state
let isWorkerRunning = false;
let pendingDrainScheduled = false;
let activeDrainUserId = null;

let lastSuccessfulSyncAt = null;
let lastErrorCode = null;
const statusListeners = new Set();

// Lifecycle subscription cleanups
let netInfoUnsubscribe = null;
let appStateSubscription = null;

function notifyStatusListeners(userId) {
  if (statusListeners.size === 0) return;
  getQueueCount(userId).then((pendingCount) => {
    const status = {
      pendingCount,
      isSyncing: isWorkerRunning,
      lastSuccessfulSyncAt,
      lastErrorCode
    };
    statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (_) {}
    });
  });
}

/**
 * Returns current sync status for a user.
 */
export async function getSyncStatus(userId) {
  const pendingCount = await getQueueCount(userId);
  return {
    pendingCount,
    isSyncing: isWorkerRunning,
    lastSuccessfulSyncAt,
    lastErrorCode
  };
}

/**
 * Subscribes a listener to sync state changes. Returns an unsubscribe function.
 */
export function subscribeSyncStatus(listener) {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

/**
 * Single-worker queue drainer.
 * Guarantees only one drain pass runs concurrently per application instance.
 */
export async function requestQueueDrain(options = {}) {
  const userId = typeof options === 'string' ? options : (options?.userId || activeDrainUserId);
  if (!userId || userId === 'guest') {
    return { drained: 0, pending: 0, skipped: 0 };
  }

  activeDrainUserId = userId;

  if (isWorkerRunning) {
    pendingDrainScheduled = true;
    return { inProgress: true };
  }

  isWorkerRunning = true;
  notifyStatusListeners(userId);

  let drainedCount = 0;
  let skippedCount = 0;

  try {
    const pendingOps = await getPendingOperations(userId);
    const now = Date.now();

    for (const op of pendingOps) {
      // 1. Account isolation: verify matching UID
      if (op.userId !== userId) {
        skippedCount++;
        continue;
      }

      // 2. Exponential backoff check
      if (op.nextAttemptAt && op.nextAttemptAt > now) {
        skippedCount++;
        continue;
      }

      // 3. Skip dead-lettered permission denied operations
      if (op.lastErrorCode === 'PERMISSION_DENIED') {
        skippedCount++;
        continue;
      }

      // 4. Attempt sync execution
      try {
        await currentOperationExecutor(op);
        await dequeueOperation(op.id);
        drainedCount++;
        lastSuccessfulSyncAt = Date.now();
        lastErrorCode = null;
      } catch (err) {
        const errorCode = err instanceof FirestoreError ? err.code : (err.code || 'UNKNOWN');
        lastErrorCode = errorCode;

        if (errorCode === 'AUTH_REQUIRED') {
          // Pause queue processing immediately: do NOT delete operation
          if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.log('[SyncWorker] Authentication required. Pausing queue drain.');
          }
          break;
        }

        if (errorCode === 'PERMISSION_DENIED') {
          // Stop retrying this operation
          await markOperationAttempt(op.id, { errorCode: 'PERMISSION_DENIED', nextAttemptAt: null });
          continue;
        }

        if (isRetryableError(errorCode)) {
          const nextAttemptAt = Date.now() + calculateBackoffMs((op.attempts || 0) + 1);
          await markOperationAttempt(op.id, { errorCode, nextAttemptAt });

          if (errorCode === 'NETWORK_ERROR') {
            // Device is offline; stop processing remaining queue until connectivity returns
            break;
          }
        } else {
          // Unclassified failure
          await markOperationAttempt(op.id, { errorCode, nextAttemptAt: Date.now() + 15000 });
        }
      }
    }
  } finally {
    isWorkerRunning = false;
    notifyStatusListeners(userId);

    // If another drain was requested while working, trigger follow-up pass
    if (pendingDrainScheduled) {
      pendingDrainScheduled = false;
      setTimeout(() => requestQueueDrain({ userId }), 100);
    }
  }

  const remaining = await getQueueCount(userId);
  return { drained: drainedCount, pending: remaining, skipped: skippedCount };
}

/**
 * Initializes automatic connectivity and foreground listeners.
 */
export function startSyncLifecycleListeners(userId) {
  if (!userId || userId === 'guest') return;
  activeDrainUserId = userId;

  stopSyncLifecycleListeners();

  // 1. NetInfo connection change listener (safe dynamic import/resolve)
  try {
    const NetInfoModule = require('@react-native-community/netinfo');
    const NetInfo = NetInfoModule?.default || NetInfoModule;
    if (NetInfo && typeof NetInfo.addEventListener === 'function') {
      netInfoUnsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected && state.isInternetReachable !== false) {
          if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.log('[SyncWorker] Connectivity restored. Requesting queue drain.');
          }
          requestQueueDrain({ userId });
        }
      });
    }
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[SyncWorker] NetInfo listener setup warning:', err.message);
    }
  }

  // 2. AppState active foreground listener
  try {
    const { AppState } = require('react-native');
    if (AppState && typeof AppState.addEventListener === 'function') {
      appStateSubscription = AppState.addEventListener('change', (nextState) => {
        if (nextState === 'active') {
          requestQueueDrain({ userId });
        }
      });
    }
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[SyncWorker] AppState listener setup warning:', err.message);
    }
  }
}

/**
 * Removes lifecycle listeners upon user logout.
 */
export function stopSyncLifecycleListeners() {
  if (netInfoUnsubscribe) {
    netInfoUnsubscribe();
    netInfoUnsubscribe = null;
  }
  if (appStateSubscription && typeof appStateSubscription.remove === 'function') {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
  activeDrainUserId = null;
}
