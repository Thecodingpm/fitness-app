import * as SecureStore from 'expo-secure-store';
import { FIREBASE_CONFIG } from '../config/firebase';

const REFRESH_KEY = 'lift_firebase_refresh_v1';
let cached = null;

export async function rememberFirebaseTokens(uid, idToken, refreshToken, expiresIn = 3600) {
  if (!uid || !idToken || !refreshToken) throw new Error('Firebase sign-in did not return a complete session.');
  await SecureStore.setItemAsync(REFRESH_KEY, JSON.stringify({ uid, refreshToken }));
  cached = { uid, idToken, expiresAt: Date.now() + Number(expiresIn) * 1000 };
}

export async function getFirebaseIdToken(uid) {
  if (cached?.uid === uid && cached.expiresAt > Date.now() + 60000) return cached.idToken;
  const raw = await SecureStore.getItemAsync(REFRESH_KEY);
  const stored = raw ? JSON.parse(raw) : null;
  if (!stored?.refreshToken || stored.uid !== uid) throw new Error('Please sign in again to sync exercise logs.');

  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_CONFIG.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(stored.refreshToken)}`
  });
  const data = await response.json();
  if (!response.ok || !data.id_token || data.user_id !== uid) throw new Error('Your sign-in expired. Please sign in again.');
  await rememberFirebaseTokens(uid, data.id_token, data.refresh_token || stored.refreshToken, data.expires_in);
  return data.id_token;
}

export async function clearFirebaseTokens() {
  cached = null;
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
