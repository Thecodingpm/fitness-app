import { FIREBASE_CONFIG } from '../config/firebase';

// =========================================================================
// 🗄️ LIVE FIRESTORE DATABASE SERVICE (Project: lift-e44ad)
// =========================================================================

const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

/**
 * 👤 Fetch user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId, idToken = null) {
  if (!userId || !FIREBASE_CONFIG.projectId) return null;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}?key=${FIREBASE_CONFIG.apiKey}`;
    const res = await fetch(firestoreUrl, { headers: idToken ? { Authorization: `Bearer ${idToken}` } : {} });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.fields) return null;

    const f = data.fields;
    return {
      name: f.name?.stringValue || null,
      email: f.email?.stringValue || null,
      unitWeight: f.unitWeight?.stringValue || null,
      unitDistance: f.unitDistance?.stringValue || null,
      unitBody: f.unitBody?.stringValue || null,
      gender: f.gender?.stringValue || null,
      birthDay: f.birthDay?.integerValue ? parseInt(f.birthDay.integerValue, 10) : null,
      birthMonth: f.birthMonth?.stringValue || null,
      birthYear: f.birthYear?.integerValue ? parseInt(f.birthYear.integerValue, 10) : null,
      weight: f.weight?.doubleValue ?? (f.weight?.integerValue ? Number(f.weight.integerValue) : null),
      height: f.height?.integerValue ? parseInt(f.height.integerValue, 10) : null,
      topGoal: f.topGoal?.stringValue || null,
      experience: f.experience?.stringValue || null,
      guidance: f.guidance?.stringValue || null,
      fitnessGoals: f.fitnessGoals?.arrayValue?.values?.map(value => value.stringValue) || [],
      onboardingStatus: f.onboardingStatus?.stringValue || null,
      createdAt: f.createdAt?.stringValue || null,
      onboardingCompletedAt: f.onboardingCompletedAt?.stringValue || null,
      onboardingSkippedAt: f.onboardingSkippedAt?.stringValue || null
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
      durationSeconds: { integerValue: String(workoutData.durationSeconds ?? 0) },
      exercisesCount: { integerValue: String(workoutData.exercisesCount ?? 0) },
      date: { stringValue: workoutData.date || new Date().toISOString() },
      completedAt: { stringValue: new Date().toISOString() }
    };
    if (Number.isFinite(workoutData.totalVolumeKg)) {
      fields.totalVolumeKg = { doubleValue: workoutData.totalVolumeKg };
    }

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
        exercisesCount: parseInt(f.exercisesCount?.integerValue || '0', 10),
        totalVolumeKg: f.totalVolumeKg?.doubleValue ?? (f.totalVolumeKg?.integerValue ? parseFloat(f.totalVolumeKg.integerValue) : null),
        date: f.date?.stringValue || f.completedAt?.stringValue || null
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
