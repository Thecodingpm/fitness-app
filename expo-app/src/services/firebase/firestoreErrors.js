// firestoreErrors.js — Normalized Cloud Error Taxonomy for LIFT

export class FirestoreError extends Error {
  constructor({
    code = 'UNKNOWN',
    status = 0,
    operation = 'FIRESTORE_OP',
    message = 'An unexpected Firestore error occurred.',
    retryable = false,
    cause = null
  }) {
    super(message);
    this.name = 'FirestoreError';
    this.code = code;
    this.status = status;
    this.operation = operation;
    this.retryable = retryable;
    this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      status: this.status,
      operation: this.operation,
      retryable: this.retryable,
      message: this.message
    };
  }
}

/**
 * Classifies an HTTP status into a normalized Firestore error code.
 *
 * Supported taxonomy:
 * - AUTH_REQUIRED: Session missing, refresh token invalid or revoked
 * - TOKEN_EXPIRED: 401 from server (refreshable)
 * - PERMISSION_DENIED: 403 from server (Firestore security rules violation)
 * - NOT_FOUND: 404 document or collection does not exist
 * - RATE_LIMITED: 429 too many requests
 * - SERVER_ERROR: 500-599 backend error
 * - TIMEOUT: Request timed out
 * - NETWORK_ERROR: Network unreachable or offline
 * - INVALID_RESPONSE: Malformed payload
 * - UNKNOWN: Unclassified
 */
export function classifyHttpStatus(status, operation, serverMessage = '') {
  if (status === 401) {
    return 'TOKEN_EXPIRED';
  }
  if (status === 403) {
    return 'PERMISSION_DENIED';
  }
  if (status === 404) {
    return 'NOT_FOUND';
  }
  if (status === 408) {
    return 'TIMEOUT';
  }
  if (status === 429) {
    return 'RATE_LIMITED';
  }
  if (status >= 500 && status < 600) {
    return 'SERVER_ERROR';
  }
  if (status === 0) {
    return 'NETWORK_ERROR';
  }
  return 'UNKNOWN';
}

/**
 * Sanitizes error diagnostics so that auth tokens, passwords, and private PII
 * are NEVER printed to development or production logs.
 */
export function formatSanitizedLog(error) {
  const op = error?.operation || 'UNKNOWN';
  const st = error?.status ?? 0;
  const cd = error?.code || 'UNKNOWN';
  const rt = Boolean(error?.retryable);
  return `[Firestore] operation: ${op} | status: ${st} | code: ${cd} | retryable: ${rt}`;
}
