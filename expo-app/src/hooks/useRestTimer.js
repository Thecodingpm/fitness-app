// useRestTimer.js — Background-Safe Rest Countdown Hook with Absolute Timestamps

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  calculateRemainingSeconds,
  calculateRestEndsAt,
  extendRestEndsAt,
  isRestTimerExpired,
  saveActiveRestTimer,
  loadActiveRestTimer,
  clearActiveRestTimer
} from '../services/timer/restTimerService.js';
import {
  scheduleRestNotification,
  cancelRestNotification,
  requestNotificationPermissionIfNeeded
} from '../services/notifications/restNotificationService.js';

export function useRestTimer(options = {}) {
  const {
    sessionId = null,
    onComplete = null,
    autoRestore = false,
    enableNotifications = true,
    enableHaptics = true
  } = options;

  const [restEndsAt, setRestEndsAt] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(90);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const completedTriggeredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const triggerCompletion = useCallback(() => {
    if (completedTriggeredRef.current) return;
    completedTriggeredRef.current = true;

    setIsRunning(false);
    setIsFinished(true);
    setRemainingSeconds(0);
    setRestEndsAt(null);

    clearActiveRestTimer();
    cancelRestNotification();

    if (enableHaptics) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (_) {}
    }

    if (typeof onCompleteRef.current === 'function') {
      try {
        onCompleteRef.current();
      } catch (_) {}
    }
  }, [enableHaptics]);

  // Start a new rest timer
  const startRest = useCallback(
    async (seconds = 90) => {
      const duration = Number(seconds);
      if (!Number.isFinite(duration) || duration <= 0) return;

      completedTriggeredRef.current = false;
      const targetEndsAt = calculateRestEndsAt(duration);
      if (!targetEndsAt) return;

      setDurationSeconds(duration);
      setRestEndsAt(targetEndsAt);
      setRemainingSeconds(duration);
      setIsRunning(true);
      setIsFinished(false);

      // Persist active rest state
      await saveActiveRestTimer({
        restEndsAt: targetEndsAt,
        durationSeconds: duration,
        sessionId
      });

      // Schedule local notification for completion
      if (enableNotifications) {
        requestNotificationPermissionIfNeeded().then(() => {
          scheduleRestNotification(targetEndsAt);
        });
      }
    },
    [sessionId, enableNotifications]
  );

  // Stop / Cancel the rest timer
  const stopRest = useCallback(async () => {
    completedTriggeredRef.current = true;
    setRestEndsAt(null);
    setRemainingSeconds(0);
    setIsRunning(false);
    setIsFinished(false);

    await clearActiveRestTimer();
    await cancelRestNotification();
  }, []);

  // Skip rest is equivalent to stopping it early without firing completion haptic
  const skipRest = useCallback(async () => {
    await stopRest();
  }, [stopRest]);

  // Add time (+15s, +30s)
  const addTime = useCallback(
    async (secondsToAdd = 30) => {
      const added = Number(secondsToAdd);
      if (!Number.isFinite(added) || added <= 0) return;

      completedTriggeredRef.current = false;
      const nextEndsAt = extendRestEndsAt(restEndsAt, added);
      const nextRemaining = calculateRemainingSeconds(nextEndsAt);

      setRestEndsAt(nextEndsAt);
      setRemainingSeconds(nextRemaining);
      setIsRunning(true);
      setIsFinished(false);

      await saveActiveRestTimer({
        restEndsAt: nextEndsAt,
        durationSeconds: (durationSeconds || 0) + added,
        sessionId
      });

      if (enableNotifications) {
        await scheduleRestNotification(nextEndsAt);
      }
    },
    [restEndsAt, durationSeconds, sessionId, enableNotifications]
  );

  // Sync remaining seconds from target timestamp
  const syncFromTimestamp = useCallback(() => {
    if (!restEndsAt) {
      if (isRunning) setIsRunning(false);
      return;
    }

    const now = Date.now();
    if (isRestTimerExpired(restEndsAt, now)) {
      if (isRunning) {
        triggerCompletion();
      } else {
        setRemainingSeconds(0);
        setRestEndsAt(null);
      }
    } else {
      const remaining = calculateRemainingSeconds(restEndsAt, now);
      setRemainingSeconds(remaining);
      if (!isRunning) setIsRunning(true);
    }
  }, [restEndsAt, isRunning, triggerCompletion]);

  // Auto-restore active timer on mount if requested
  useEffect(() => {
    if (!autoRestore) return;

    loadActiveRestTimer().then((saved) => {
      if (saved && saved.restEndsAt && !isRestTimerExpired(saved.restEndsAt)) {
        const remaining = calculateRemainingSeconds(saved.restEndsAt);
        setRestEndsAt(saved.restEndsAt);
        setDurationSeconds(saved.durationSeconds || 90);
        setRemainingSeconds(remaining);
        setIsRunning(true);
        setIsFinished(false);
      }
    });
  }, [autoRestore]);

  // Lightweight UI ticker interval while running
  useEffect(() => {
    if (!isRunning || !restEndsAt) return;

    const interval = setInterval(() => {
      syncFromTimestamp();
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, restEndsAt, syncFromTimestamp]);

  // AppState listener for background -> foreground transitions
  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      if (nextState === 'active') {
        syncFromTimestamp();
      }
    };

    const subscription = AppState.addEventListener
      ? AppState.addEventListener('change', handleAppStateChange)
      : null;

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [syncFromTimestamp]);

  return {
    remainingSeconds,
    isRunning,
    isFinished,
    restEndsAt,
    durationSeconds,
    startRest,
    stopRest,
    skipRest,
    addTime
  };
}
