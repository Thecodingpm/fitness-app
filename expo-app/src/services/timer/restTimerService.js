// restTimerService.js — Pure Timestamp-Based Rest Timer & Persistence

import AsyncStorage from '@react-native-async-storage/async-storage';

export const REST_TIMER_STORAGE_KEY = '@lift/active_rest_timer_v1';

let customStorageDriver = null;

export function setRestTimerStorageDriver(driver) {
  customStorageDriver = driver;
}

function getStorage() {
  return customStorageDriver || AsyncStorage;
}

/**
 * Calculates remaining seconds from an absolute target timestamp.
 * Returns 0 if expired or invalid.
 */
export function calculateRemainingSeconds(restEndsAt, now = Date.now()) {
  if (!restEndsAt || typeof restEndsAt !== 'number') return 0;
  const diffMs = restEndsAt - now;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / 1000);
}

/**
 * Calculates absolute target timestamp given duration in seconds.
 * Returns null if duration is invalid (<= 0).
 */
export function calculateRestEndsAt(durationSeconds, fromTimestamp = Date.now()) {
  const secs = Number(durationSeconds);
  if (!Number.isFinite(secs) || secs <= 0) return null;
  return fromTimestamp + Math.round(secs * 1000);
}

/**
 * Extends or starts a rest target timestamp by adding seconds.
 * If previous timer is still running, adds to current restEndsAt.
 * If expired or non-existent, starts a new window from `now`.
 */
export function extendRestEndsAt(currentEndsAt, addSeconds, now = Date.now()) {
  const added = Number(addSeconds);
  if (!Number.isFinite(added) || added <= 0) return currentEndsAt || null;

  const isStillRunning = currentEndsAt && typeof currentEndsAt === 'number' && currentEndsAt > now;
  const base = isStillRunning ? currentEndsAt : now;
  return base + Math.round(added * 1000);
}

/**
 * Determines whether a target timestamp has passed.
 */
export function isRestTimerExpired(restEndsAt, now = Date.now()) {
  if (!restEndsAt || typeof restEndsAt !== 'number') return true;
  return now >= restEndsAt;
}

/**
 * Formats seconds into MM:SS display format.
 */
export function formatRestTimerDisplay(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Persists minimal active rest timer state to AsyncStorage.
 */
export async function saveActiveRestTimer({ restEndsAt, durationSeconds, sessionId = null }) {
  if (!restEndsAt) return;
  try {
    const payload = JSON.stringify({
      restEndsAt,
      durationSeconds: Number(durationSeconds) || 90,
      sessionId,
      savedAt: Date.now()
    });
    const storage = getStorage();
    await storage.setItem(REST_TIMER_STORAGE_KEY, payload);
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[RestTimer] Error saving active rest timer:', err.message);
    }
  }
}

/**
 * Loads active rest timer state from AsyncStorage.
 * Cleans up and returns null if already expired.
 */
export async function loadActiveRestTimer(now = Date.now()) {
  try {
    const storage = getStorage();
    const raw = await storage.getItem(REST_TIMER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.restEndsAt) return null;

    if (isRestTimerExpired(parsed.restEndsAt, now)) {
      await clearActiveRestTimer();
      return null;
    }
    return parsed;
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[RestTimer] Error loading active rest timer:', err.message);
    }
    return null;
  }
}

/**
 * Clears active rest timer from AsyncStorage.
 */
export async function clearActiveRestTimer() {
  try {
    const storage = getStorage();
    await storage.removeItem(REST_TIMER_STORAGE_KEY);
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[RestTimer] Error clearing active rest timer:', err.message);
    }
  }
}
