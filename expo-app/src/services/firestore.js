import { FIREBASE_CONFIG } from '../config/firebase';

// =========================================================================
// 🗄️ LIVE FIRESTORE DATABASE SERVICE (Project: lift-e44ad)
// =========================================================================

/**
 * Save full athlete profile & onboarding data into Firestore
 */
export async function saveUserProfileToFirestore(userId, profileData) {
  if (!userId || !FIREBASE_CONFIG.projectId) return;

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${userId}?key=${FIREBASE_CONFIG.apiKey}`;

    const fields = {
      name: { stringValue: profileData.name || 'Athlete' },
      email: { stringValue: profileData.email || '' },
      unitWeight: { stringValue: profileData.unitWeight || 'kg' },
      unitDistance: { stringValue: profileData.unitDistance || 'kilometers' },
      unitBody: { stringValue: profileData.unitBody || 'cm' },
      gender: { stringValue: profileData.gender || 'male' },
      birthDay: { integerValue: String(profileData.birthDay || 23) },
      birthMonth: { stringValue: profileData.birthMonth || 'August' },
      birthYear: { integerValue: String(profileData.birthYear || 2008) },
      updatedAt: { stringValue: new Date().toISOString() }
    };

    const res = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    const data = await res.json();
    console.log('✅ Profile saved to Firestore:', data.name || data);
    return data;
  } catch (err) {
    console.log('⚠️ Firestore save error:', err);
  }
}

/**
 * Save a completed workout to Firestore under user subcollection
 */
export async function saveWorkoutToFirestore(userId, workoutData) {
  if (!userId || !FIREBASE_CONFIG.projectId) return;

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${userId}/workouts?key=${FIREBASE_CONFIG.apiKey}`;

    const fields = {
      title: { stringValue: workoutData.title || 'Workout' },
      durationSeconds: { integerValue: String(workoutData.durationSeconds || 0) },
      totalWeightLifted: { stringValue: String(workoutData.totalWeight || '0') },
      unitWeight: { stringValue: workoutData.unitWeight || 'kg' },
      completedAt: { stringValue: new Date().toISOString() }
    };

    const res = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    return await res.json();
  } catch (err) {
    console.log('⚠️ Firestore workout save error:', err);
  }
}
