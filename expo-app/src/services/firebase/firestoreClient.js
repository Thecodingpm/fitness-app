// firestoreClient.js — Centralized Authenticated Firestore REST Client

import { FIREBASE_CONFIG } from '../../config/firebase.js';
import { getFirebaseIdToken, forceRefreshToken } from '../firebaseAuthTokens.js';
import { FirestoreError, classifyHttpStatus, formatSanitizedLog } from './firestoreErrors.js';

export const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

/**
 * Authenticated Firestore REST request executor.
 *
 * Guarantees:
 * 1. Obtains valid Firebase ID token.
 * 2. Employs AbortController timeout (12s).
 * 3. Safely parses response without uncaught exceptions.
 * 4. Detects 401 token expiration, refreshes token via Google SecureToken, and retries ONCE.
 * 5. Rejects 403 PERMISSION_DENIED immediately without token refresh loops.
 * 6. Emits sanitized logs omitting sensitive auth headers and tokens.
 */
export async function firestoreRequest({
  userId,
  operation = 'FIRESTORE_OP',
  method = 'GET',
  path,
  body = null,
  queryParams = null,
  timeoutMs = 12000,
  _isRetry = false
}) {
  if (!userId || userId === 'guest') {
    throw new FirestoreError({
      code: 'AUTH_REQUIRED',
      status: 401,
      operation,
      message: 'An authenticated user session is required for cloud storage.',
      retryable: false
    });
  }

  let idToken;
  try {
    idToken = await getFirebaseIdToken(userId);
  } catch (tokenErr) {
    const error = new FirestoreError({
      code: tokenErr.code === 'AUTH_REQUIRED' ? 'AUTH_REQUIRED' : 'TOKEN_EXPIRED',
      status: 401,
      operation,
      message: tokenErr.message || 'Unable to retrieve valid authentication token.',
      retryable: false,
      cause: tokenErr
    });
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(formatSanitizedLog(error));
    }
    throw error;
  }

  let queryString = '';
  if (queryParams) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(queryParams)) {
      if (v !== undefined && v !== null) {
        params.append(k, String(v));
      }
    }
    const str = params.toString();
    if (str) queryString = `?${str}`;
  }

  const url = `${BASE_FIRESTORE_URL}${path}${queryString}`;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      signal: controller?.signal
    };

    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    if (timeoutId) clearTimeout(timeoutId);

    // Safely parse response body
    let responseData = null;
    const text = await response.text();
    if (text && text.trim().length > 0) {
      try {
        responseData = JSON.parse(text);
      } catch (parseErr) {
        if (!response.ok) {
          responseData = { rawText: text };
        } else {
          throw new FirestoreError({
            code: 'INVALID_RESPONSE',
            status: response.status,
            operation,
            message: 'Server returned invalid JSON response.',
            retryable: false,
            cause: parseErr
          });
        }
      }
    }

    if (response.ok) {
      return responseData || {};
    }

    // 401: Token expired or rejected by Google Auth -> Refresh and retry ONCE
    if (response.status === 401 && !_isRetry) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(`[Firestore] operation: ${operation} | status: 401 | action: refreshing token and retrying once`);
      }
      try {
        await forceRefreshToken(userId);
        return await firestoreRequest({
          userId,
          operation,
          method,
          path,
          body,
          queryParams,
          timeoutMs,
          _isRetry: true
        });
      } catch (refreshErr) {
        const error = new FirestoreError({
          code: 'AUTH_REQUIRED',
          status: 401,
          operation,
          message: 'Sign-in session has expired. Please sign in again.',
          retryable: false,
          cause: refreshErr
        });
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.log(formatSanitizedLog(error));
        }
        throw error;
      }
    }

    // Classify non-2xx status code
    const serverMessage = responseData?.error?.message || responseData?.message || '';
    const classifiedCode = classifyHttpStatus(response.status, operation, serverMessage);

    const error = new FirestoreError({
      code: classifiedCode,
      status: response.status,
      operation,
      message: serverMessage || `Firestore request failed with status ${response.status}`,
      retryable: classifiedCode === 'RATE_LIMITED' || classifiedCode === 'SERVER_ERROR',
      cause: responseData
    });

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(formatSanitizedLog(error));
    }
    throw error;

  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);

    if (err instanceof FirestoreError) {
      throw err;
    }

    // Handle AbortError / Timeout
    if (err?.name === 'AbortError' || err?.message?.toLowerCase().includes('aborted')) {
      const error = new FirestoreError({
        code: 'TIMEOUT',
        status: 408,
        operation,
        message: `Firestore request timed out after ${timeoutMs}ms.`,
        retryable: true,
        cause: err
      });
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(formatSanitizedLog(error));
      }
      throw error;
    }

    // Network / TypeError
    const error = new FirestoreError({
      code: 'NETWORK_ERROR',
      status: 0,
      operation,
      message: err?.message || 'Network error communicating with Firestore.',
      retryable: true,
      cause: err
    });
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(formatSanitizedLog(error));
    }
    throw error;
  }
}
