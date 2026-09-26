// backHandlerService.js — Centralized Priority-Based Android BackHandler Service

import { useEffect, useRef } from 'react';

export const BACK_PRIORITY = {
  CONFIRM_DIALOG: 60,
  VIDEO_MODAL: 50,
  CHILD_MODAL: 40,
  WORKOUT_MODAL: 30,
  CONSISTENCY_SCREEN: 20,
  PROFILE_MODAL: 15,
  DEFAULT: 10
};

// Resilient native module driver (allows Node tests to run without Flow syntax errors)
let customBackHandlerDriver = null;

export function setBackHandlerDriver(driver) {
  customBackHandlerDriver = driver;
}

function resolveBackHandler() {
  if (customBackHandlerDriver) return customBackHandlerDriver;
  try {
    const RN = require('react-native');
    return RN?.BackHandler || null;
  } catch (_e) {
    return null;
  }
}

// Internal list of registered handlers: [{ id, handler, priority }]
const handlerStack = [];
let globalSubscription = null;

function ensureGlobalListener() {
  if (globalSubscription) return;
  const BackHandler = resolveBackHandler();
  if (!BackHandler || typeof BackHandler.addEventListener !== 'function') return;

  globalSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
    // Process handlers in order of highest priority first
    for (let i = 0; i < handlerStack.length; i++) {
      const entry = handlerStack[i];
      try {
        const handled = entry.handler();
        if (handled === true) {
          return true; // Stop event propagation
        }
      } catch (err) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.log('[BackHandlerService] Handler execution error:', err.message);
        }
      }
    }
    return false; // Allow default OS exit behavior
  });
}

function cleanupGlobalListener() {
  if (handlerStack.length === 0 && globalSubscription) {
    if (typeof globalSubscription.remove === 'function') {
      globalSubscription.remove();
    }
    globalSubscription = null;
  }
}

/**
 * Registers an Android back press handler with a specific priority.
 * Returns an unregister function.
 */
export function registerBackHandler(handler, priority = BACK_PRIORITY.DEFAULT) {
  if (typeof handler !== 'function') return () => {};

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const entry = { id, handler, priority: Number(priority) || BACK_PRIORITY.DEFAULT };

  // Insert maintaining sorted descending order by priority
  const insertIndex = handlerStack.findIndex((item) => item.priority < entry.priority);
  if (insertIndex === -1) {
    handlerStack.push(entry);
  } else {
    handlerStack.splice(insertIndex, 0, entry);
  }

  ensureGlobalListener();

  return () => {
    const idx = handlerStack.findIndex((item) => item.id === id);
    if (idx !== -1) {
      handlerStack.splice(idx, 1);
    }
    cleanupGlobalListener();
  };
}

/**
 * React hook to register a back press handler tied to component lifecycle.
 */
export function useAndroidBackHandler(handler, priority = BACK_PRIORITY.DEFAULT, isEnabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!isEnabled) return;

    const unregister = registerBackHandler(() => {
      if (typeof handlerRef.current === 'function') {
        return handlerRef.current();
      }
      return false;
    }, priority);

    return () => {
      unregister();
    };
  }, [priority, isEnabled]);
}

/**
 * Helper to inspect stack for test assertions.
 */
export function getRegisteredHandlersForTest() {
  return [...handlerStack];
}

export function resetBackHandlerStackForTest() {
  handlerStack.length = 0;
  if (globalSubscription && typeof globalSubscription.remove === 'function') {
    globalSubscription.remove();
  }
  globalSubscription = null;
}
