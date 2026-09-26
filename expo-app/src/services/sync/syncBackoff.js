// syncBackoff.js — Pure Exponential Backoff & Retry Classification

export const BASE_DELAY_MS = 5000; // 5 seconds
export const BACKOFF_MULTIPLIER = 2.5;
export const MAX_BACKOFF_MS = 15 * 60 * 1000; // 15 minutes cap

/**
 * Calculates exponential retry delay with jitter.
 *
 * Example progression (base: 5s, mult: 2.5):
 * - Attempt 1: ~5s
 * - Attempt 2: ~12.5s
 * - Attempt 3: ~31.25s
 * - Attempt 4: ~78s
 * - Attempt 5: ~195s (3.2m)
 * - Attempt 6+: capped at 15m
 */
export function calculateBackoffMs(attempts, options = {}) {
  const base = options.baseDelayMs || BASE_DELAY_MS;
  const max = options.maxBackoffMs || MAX_BACKOFF_MS;
  const multiplier = options.multiplier || BACKOFF_MULTIPLIER;
  const addJitter = options.addJitter !== false;

  if (attempts <= 0) return 0;
  if (attempts === 1) return base;

  const rawDelay = base * Math.pow(multiplier, attempts - 1);
  const capped = Math.min(rawDelay, max);

  if (!addJitter) return Math.round(capped);

  // 10% random jitter to avoid thundering-herd effect
  const jitterFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  return Math.round(Math.min(capped * jitterFactor, max));
}

/**
 * Checks whether an error code from the cloud layer should be retried later.
 */
export function isRetryableError(errorCode) {
  return (
    errorCode === 'NETWORK_ERROR' ||
    errorCode === 'TIMEOUT' ||
    errorCode === 'RATE_LIMITED' ||
    errorCode === 'SERVER_ERROR'
  );
}
