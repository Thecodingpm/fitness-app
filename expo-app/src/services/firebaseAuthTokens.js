import { FIREBASE_CONFIG } from '../config/firebase.js';

const REFRESH_KEY = 'lift_firebase_refresh_v1';
let cached = null;

const memoryStore = new Map();
const fallbackDriver = {
  getItemAsync: async (k) => memoryStore.get(k) || null,
  setItemAsync: async (k, v) => { memoryStore.set(k, String(v)); },
  deleteItemAsync: async (k) => { memoryStore.delete(k); }
};

let customDriver = null;

export function setSecureStoreDriver(driver) {
  customDriver = driver;
}

export function resetCachedTokensForTest() {
  cached = null;
  memoryStore.clear();
}

async function getSecureStore() {
  if (customDriver) return customDriver;
  try {
    const nativeModule = await import('expo-secure-store');
    return nativeModule;
  } catch (_e) {
    return fallbackDriver;
  }
}

export async function rememberFirebaseTokens(uid, idToken, refreshToken, expiresIn = 3600) {
  if (!uid || !idToken || !refreshToken) {
    const error = new Error('Firebase sign-in did not return a complete session.');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }
  const store = await getSecureStore();
  await store.setItemAsync(REFRESH_KEY, JSON.stringify({ uid, refreshToken }));
  cached = { uid, idToken, expiresAt: Date.now() + Number(expiresIn) * 1000 };
}

/**
 * Retrieves a valid Firebase ID token for the given user ID.
 * If forceRefresh is true, the in-memory cache is bypassed and the Google SecureToken API is invoked.
 */
export async function getFirebaseIdToken(uid, options = {}) {
  const forceRefresh = options?.forceRefresh === true;

  if (!forceRefresh && cached?.uid === uid && cached.expiresAt > Date.now() + 60000) {
    return cached.idToken;
  }

  const store = await getSecureStore();
  const raw = await store.getItemAsync(REFRESH_KEY);
  const stored = raw ? JSON.parse(raw) : null;
  if (!stored?.refreshToken || stored.uid !== uid) {
    const error = new Error('Please sign in again to sync exercise logs.');
    error.code = 'AUTH_REQUIRED';
    throw error;
  }

  try {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_CONFIG.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(stored.refreshToken)}`
    });

    const data = await response.json();
    if (!response.ok || !data.id_token || data.user_id !== uid) {
      const error = new Error(data.error?.message || 'Your sign-in expired. Please sign in again.');
      error.code = 'AUTH_REQUIRED';
      throw error;
    }

    await rememberFirebaseTokens(uid, data.id_token, data.refresh_token || stored.refreshToken, data.expires_in);
    return data.id_token;
  } catch (err) {
    if (err.code === 'AUTH_REQUIRED') {
      throw err;
    }
    const error = new Error('Could not refresh authentication token.');
    error.code = 'NETWORK_ERROR';
    error.cause = err;
    throw error;
  }
}

/**
 * Explicitly forces a fresh ID token by clearing the in-memory cache.
 */
export async function forceRefreshToken(uid) {
  cached = null;
  return getFirebaseIdToken(uid, { forceRefresh: true });
}

export async function clearFirebaseTokens() {
  cached = null;
  const store = await getSecureStore();
  await store.deleteItemAsync(REFRESH_KEY);
}
