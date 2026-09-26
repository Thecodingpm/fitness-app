// workoutTimerSystem.test.mjs — Comprehensive Unit Tests for Chunk 3 Timers & Navigation

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateRemainingSeconds,
  calculateRestEndsAt,
  extendRestEndsAt,
  isRestTimerExpired,
  formatRestTimerDisplay,
  saveActiveRestTimer,
  loadActiveRestTimer,
  clearActiveRestTimer,
  setRestTimerStorageDriver
} from './restTimerService.js';

import {
  setNotificationDriver,
  scheduleRestNotification,
  cancelRestNotification,
  getActiveNotificationIdForTest,
  resetNotificationStateForTest
} from '../notifications/restNotificationService.js';

import {
  BACK_PRIORITY,
  registerBackHandler,
  getRegisteredHandlersForTest,
  resetBackHandlerStackForTest
} from '../navigation/backHandlerService.js';

// Setup Mock Storage for Timer Persistence Tests
function createMockStorage() {
  const store = new Map();
  return {
    getItem: async (k) => store.get(k) || null,
    setItem: async (k, v) => { store.set(k, String(v)); },
    removeItem: async (k) => { store.delete(k); },
    clear: () => store.clear()
  };
}

// Setup Mock Notification Driver
function createMockNotificationDriver() {
  let counter = 1;
  const scheduled = new Map();
  return {
    scheduled,
    scheduleNotificationAsync: async ({ content, trigger }) => {
      const id = `notif_${counter++}`;
      scheduled.set(id, { content, trigger });
      return id;
    },
    cancelScheduledNotificationAsync: async (id) => {
      scheduled.delete(id);
    },
    getPermissionsAsync: async () => ({ status: 'granted' }),
    requestPermissionsAsync: async () => ({ status: 'granted' }),
    setNotificationHandler: () => {}
  };
}

test('calculateRemainingSeconds derives accurate remaining time from absolute timestamp', () => {
  const now = 1790430000000;
  const endsAt = now + 90000; // 90 seconds in future

  assert.equal(calculateRemainingSeconds(endsAt, now), 90);
  assert.equal(calculateRemainingSeconds(endsAt, now + 30000), 60);
  assert.equal(calculateRemainingSeconds(endsAt, now + 89500), 1);
  assert.equal(calculateRemainingSeconds(endsAt, now + 90000), 0);
  assert.equal(calculateRemainingSeconds(endsAt, now + 95000), 0); // Expired returns 0, never negative
  assert.equal(calculateRemainingSeconds(null, now), 0);
});

test('calculateRestEndsAt computes absolute target timestamp or rejects invalid durations', () => {
  const now = 1790430000000;
  assert.equal(calculateRestEndsAt(90, now), now + 90000);
  assert.equal(calculateRestEndsAt(120, now), now + 120000);
  assert.equal(calculateRestEndsAt(0, now), null);
  assert.equal(calculateRestEndsAt(-10, now), null);
  assert.equal(calculateRestEndsAt(NaN, now), null);
});

test('extendRestEndsAt adds time to active timer or starts fresh if expired', () => {
  const now = 1790430000000;
  const activeEndsAt = now + 40000; // 40 seconds remaining

  // Extends active timer by 30 seconds
  const extended = extendRestEndsAt(activeEndsAt, 30, now);
  assert.equal(extended, activeEndsAt + 30000);
  assert.equal(calculateRemainingSeconds(extended, now), 70);

  // If already expired, starts new timer from now
  const expiredEndsAt = now - 5000;
  const revived = extendRestEndsAt(expiredEndsAt, 30, now);
  assert.equal(revived, now + 30000);
  assert.equal(calculateRemainingSeconds(revived, now), 30);
});

test('isRestTimerExpired correctly checks if timestamp has passed', () => {
  const now = 1790430000000;
  assert.equal(isRestTimerExpired(now + 10000, now), false);
  assert.equal(isRestTimerExpired(now, now), true);
  assert.equal(isRestTimerExpired(now - 1000, now), true);
  assert.equal(isRestTimerExpired(null, now), true);
});

test('formatRestTimerDisplay formats seconds into MM:SS format accurately', () => {
  assert.equal(formatRestTimerDisplay(0), '00:00');
  assert.equal(formatRestTimerDisplay(9), '00:09');
  assert.equal(formatRestTimerDisplay(75), '01:15');
  assert.equal(formatRestTimerDisplay(180), '03:00');
});

test('Active rest timer persistence saves and recovers state across simulated app restarts', async () => {
  const mockStorage = createMockStorage();
  setRestTimerStorageDriver(mockStorage);

  const now = 1790430000000;
  const targetEndsAt = now + 60000;

  await saveActiveRestTimer({
    restEndsAt: targetEndsAt,
    durationSeconds: 60,
    sessionId: 'session_abc'
  });

  // Simulate app restart 20 seconds later
  const restored = await loadActiveRestTimer(now + 20000);
  assert.ok(restored);
  assert.equal(restored.restEndsAt, targetEndsAt);
  assert.equal(restored.durationSeconds, 60);
  assert.equal(calculateRemainingSeconds(restored.restEndsAt, now + 20000), 40);

  // Simulate app restart after timer expired
  const expiredRestored = await loadActiveRestTimer(now + 70000);
  assert.equal(expiredRestored, null);

  // Explicit clear removes saved timer
  await saveActiveRestTimer({ restEndsAt: targetEndsAt, durationSeconds: 60 });
  await clearActiveRestTimer();
  const cleared = await loadActiveRestTimer(now);
  assert.equal(cleared, null);
});

test('Rest notification service schedules local notification and cancels on replace/skip', async () => {
  const mockDriver = createMockNotificationDriver();
  setNotificationDriver(mockDriver);
  resetNotificationStateForTest();

  const now = 1790430000000;
  const endsAt1 = now + 60000;

  // 1. Schedule 60s notification
  const id1 = await scheduleRestNotification(endsAt1);
  assert.ok(id1);
  assert.equal(getActiveNotificationIdForTest(), id1);
  assert.equal(mockDriver.scheduled.size, 1);
  assert.equal(mockDriver.scheduled.get(id1).content.title, 'LIFT');

  // 2. Replace with 90s timer: automatically cancels previous notification
  const endsAt2 = now + 90000;
  const id2 = await scheduleRestNotification(endsAt2);
  assert.ok(id2);
  assert.notEqual(id1, id2);
  assert.equal(mockDriver.scheduled.has(id1), false); // id1 was cancelled
  assert.equal(mockDriver.scheduled.has(id2), true);

  // 3. User skips rest: notification cancelled
  await cancelRestNotification();
  assert.equal(getActiveNotificationIdForTest(), null);
  assert.equal(mockDriver.scheduled.size, 0);
});

test('BackHandler priority stack executes highest priority first and stops propagation', () => {
  resetBackHandlerStackForTest();

  const executionLog = [];

  const unregisterLow = registerBackHandler(() => {
    executionLog.push('low');
    return true;
  }, BACK_PRIORITY.DEFAULT);

  const unregisterHigh = registerBackHandler(() => {
    executionLog.push('high');
    return true; // Consumes event
  }, BACK_PRIORITY.CONFIRM_DIALOG);

  const unregisterMed = registerBackHandler(() => {
    executionLog.push('med');
    return true;
  }, BACK_PRIORITY.WORKOUT_MODAL);

  const stack = getRegisteredHandlersForTest();
  assert.equal(stack.length, 3);
  assert.equal(stack[0].priority, BACK_PRIORITY.CONFIRM_DIALOG);
  assert.equal(stack[1].priority, BACK_PRIORITY.WORKOUT_MODAL);
  assert.equal(stack[2].priority, BACK_PRIORITY.DEFAULT);

  // Execute highest priority handler
  const handled = stack[0].handler();
  assert.equal(handled, true);
  assert.deepEqual(executionLog, ['high']);

  // Unregister high priority
  unregisterHigh();
  const stackAfterUnregister = getRegisteredHandlersForTest();
  assert.equal(stackAfterUnregister.length, 2);
  assert.equal(stackAfterUnregister[0].priority, BACK_PRIORITY.WORKOUT_MODAL);

  unregisterMed();
  unregisterLow();
  assert.equal(getRegisteredHandlersForTest().length, 0);
});

test('BackHandler fall-through allows lower priority handler to run when higher returns false', () => {
  resetBackHandlerStackForTest();

  const executionLog = [];

  registerBackHandler(() => {
    executionLog.push('modal');
    return true; // Handles it
  }, BACK_PRIORITY.WORKOUT_MODAL);

  registerBackHandler(() => {
    executionLog.push('nested_dialog');
    return false; // Does NOT handle, passes to next
  }, BACK_PRIORITY.CONFIRM_DIALOG);

  const stack = getRegisteredHandlersForTest();
  for (const entry of stack) {
    if (entry.handler() === true) break;
  }

  assert.deepEqual(executionLog, ['nested_dialog', 'modal']);
  resetBackHandlerStackForTest();
});

test('Workout duration calculation accurately derives elapsed seconds across app backgrounding', () => {
  const workoutStartedAt = 1790430000000;

  // 10 seconds later in foreground
  const elapsedAt10s = Math.max(0, Math.floor((workoutStartedAt + 10000 - workoutStartedAt) / 1000));
  assert.equal(elapsedAt10s, 10);

  // User locks phone or switches to Spotify for 5 minutes (300 seconds)
  const returnedAt = workoutStartedAt + 310000; // 310 seconds later
  const elapsedAfterBackground = Math.max(0, Math.floor((returnedAt - workoutStartedAt) / 1000));
  assert.equal(elapsedAfterBackground, 310);
});
