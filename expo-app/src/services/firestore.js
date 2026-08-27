import { FIREBASE_CONFIG } from '../config/firebase';

// =========================================================================
// 🗄️ LIVE FIRESTORE DATABASE SERVICE (Project: lift-e44ad)
// =========================================================================

const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

/**
 * 👤 Save full athlete profile & onboarding data into Firestore
 */
export async function saveUserProfileToFirestore(userId, profileData) {
  if (!userId || !FIREBASE_CONFIG.projectId) return;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}?key=${FIREBASE_CONFIG.apiKey}`;

    const fields = {
      name: { stringValue: profileData.name || profileData.userName || 'Athlete' },
      email: { stringValue: profileData.email || profileData.userEmail || '' },
      unitWeight: { stringValue: profileData.unitWeight || 'kg' },
      unitDistance: { stringValue: profileData.unitDistance || 'kilometers' },
      unitBody: { stringValue: profileData.unitBody || 'cm' },
      gender: { stringValue: profileData.gender || 'male' },
      birthDay: { integerValue: String(profileData.birthDay || 23) },
      birthMonth: { stringValue: profileData.birthMonth || 'August' },
      birthYear: { integerValue: String(profileData.birthYear || 2008) },
      weight: { doubleValue: Number(profileData.weight || 72.0) },
      height: { integerValue: String(profileData.height || 170) },
      topGoal: { stringValue: profileData.topGoal || 'build_muscle' },
      experience: { stringValue: profileData.experience || 'beginner' },
      updatedAt: { stringValue: new Date().toISOString() }
    };

    const res = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    return await res.json();
  } catch (err) {
    console.log('⚠️ Firestore saveUserProfile error:', err);
    return null;
  }
}

/**
 * 👤 Fetch user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId) {
  if (!userId || !FIREBASE_CONFIG.projectId) return null;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}?key=${FIREBASE_CONFIG.apiKey}`;
    const res = await fetch(firestoreUrl);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.fields) return null;

    const f = data.fields;
    return {
      name: f.name?.stringValue || 'Athlete',
      email: f.email?.stringValue || '',
      unitWeight: f.unitWeight?.stringValue || 'kg',
      unitDistance: f.unitDistance?.stringValue || 'kilometers',
      unitBody: f.unitBody?.stringValue || 'cm',
      gender: f.gender?.stringValue || 'male',
      birthDay: parseInt(f.birthDay?.integerValue || '23', 10),
      birthMonth: f.birthMonth?.stringValue || 'August',
      birthYear: parseInt(f.birthYear?.integerValue || '2008', 10),
      weight: f.weight?.doubleValue || 72.0,
      height: parseInt(f.height?.integerValue || '170', 10),
      topGoal: f.topGoal?.stringValue || 'build_muscle',
      experience: f.experience?.stringValue || 'beginner'
    };
  } catch (err) {
    console.log('⚠️ Firestore getUserProfile error:', err);
    return null;
  }
}

/**
 * 🏋️ Save completed workout to Firestore under users/{userId}/workouts
 */
export async function saveWorkoutToFirestore(userId, workoutData) {
  if (!userId || !FIREBASE_CONFIG.projectId) return;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}/workouts?key=${FIREBASE_CONFIG.apiKey}`;

    const fields = {
      id: { stringValue: workoutData.id || `w-${Date.now()}` },
      title: { stringValue: workoutData.routineName || workoutData.title || 'Workout' },
      routineName: { stringValue: workoutData.routineName || workoutData.title || 'Workout' },
      durationSeconds: { integerValue: String(workoutData.durationSeconds || 0) },
      exercisesCount: { integerValue: String(workoutData.exercisesCount || 3) },
      totalVolumeKg: { doubleValue: Number(workoutData.totalVolumeKg || 0) },
      date: { stringValue: workoutData.date || new Date().toISOString() },
      completedAt: { stringValue: new Date().toISOString() }
    };

    const res = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    return await res.json();
  } catch (err) {
    console.log('⚠️ Firestore saveWorkout error:', err);
    return null;
  }
}

/**
 * 🏋️ Fetch all recorded workouts for a specific user from Firestore
 */
export async function getUserWorkoutsFromFirestore(userId) {
  if (!userId || !FIREBASE_CONFIG.projectId) return [];

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}/workouts?key=${FIREBASE_CONFIG.apiKey}`;
    const res = await fetch(firestoreUrl);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];

    return data.documents.map((doc) => {
      const f = doc.fields || {};
      return {
        id: f.id?.stringValue || doc.name.split('/').pop(),
        routineName: f.routineName?.stringValue || f.title?.stringValue || 'Workout',
        durationSeconds: parseInt(f.durationSeconds?.integerValue || '0', 10),
        exercisesCount: parseInt(f.exercisesCount?.integerValue || '1', 10),
        totalVolumeKg: f.totalVolumeKg?.doubleValue || parseFloat(f.totalVolumeKg?.integerValue || '0'),
        date: f.date?.stringValue || f.completedAt?.stringValue || new Date().toISOString()
      };
    });
  } catch (err) {
    console.log('⚠️ Firestore getUserWorkouts error:', err);
    return [];
  }
}

/**
 * 📈 Save compound exercise logs (Bench, Squat, Deadlift, Press) to Firestore
 */
export async function saveExerciseLogsToFirestore(userId, logs) {
  if (!userId || !FIREBASE_CONFIG.projectId || !logs) return;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}/exercise_data/logs?key=${FIREBASE_CONFIG.apiKey}`;

    const fields = {
      jsonString: { stringValue: JSON.stringify(logs) },
      updatedAt: { stringValue: new Date().toISOString() }
    };

    const res = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    return await res.json();
  } catch (err) {
    console.log('⚠️ Firestore saveExerciseLogs error:', err);
    return null;
  }
}

/**
 * 📈 Fetch compound exercise logs from Firestore
 */
export async function getUserExerciseLogsFromFirestore(userId) {
  if (!userId || !FIREBASE_CONFIG.projectId) return null;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}/exercise_data/logs?key=${FIREBASE_CONFIG.apiKey}`;
    const res = await fetch(firestoreUrl);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.fields?.jsonString?.stringValue) {
      return JSON.parse(data.fields.jsonString.stringValue);
    }
    return null;
  } catch (err) {
    console.log('⚠️ Firestore getUserExerciseLogs error:', err);
    return null;
  }
}

/**
 * 📅 Save daily completion statuses map to Firestore
 */
export async function saveDailyStatusesToFirestore(userId, statuses) {
  if (!userId || !FIREBASE_CONFIG.projectId || !statuses) return;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}/calendar_data/statuses?key=${FIREBASE_CONFIG.apiKey}`;

    const fields = {
      jsonString: { stringValue: JSON.stringify(statuses) },
      updatedAt: { stringValue: new Date().toISOString() }
    };

    const res = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    return await res.json();
  } catch (err) {
    console.log('⚠️ Firestore saveDailyStatuses error:', err);
    return null;
  }
}

/**
 * 📅 Fetch daily completion statuses map from Firestore
 */
export async function getUserDailyStatusesFromFirestore(userId) {
  if (!userId || !FIREBASE_CONFIG.projectId) return null;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}/calendar_data/statuses?key=${FIREBASE_CONFIG.apiKey}`;
    const res = await fetch(firestoreUrl);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.fields?.jsonString?.stringValue) {
      return JSON.parse(data.fields.jsonString.stringValue);
    }
    return null;
  } catch (err) {
    console.log('⚠️ Firestore getUserDailyStatuses error:', err);
    return null;
  }
}
