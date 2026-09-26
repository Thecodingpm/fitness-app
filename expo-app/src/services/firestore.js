import { FIREBASE_CONFIG } from '../config/firebase';
import { getFirebaseIdToken } from './firebaseAuthTokens';

// =========================================================================
// 🗄️ LIVE FIRESTORE DATABASE SERVICE (Project: lift-e44ad)
// =========================================================================

const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

function completedSetFields(set) {
  return {
    id: { stringValue: set.id },
    sessionId: { stringValue: set.sessionId },
    exerciseId: { stringValue: set.exerciseId },
    exerciseName: { stringValue: set.exerciseName },
    muscle: { stringValue: set.muscle || '' },
    routineTitle: { stringValue: set.routineTitle || '' },
    reps: { integerValue: String(set.reps) },
    weightKg: { doubleValue: Number(set.weightKg) },
    loggedAt: { stringValue: set.loggedAt },
    source: { stringValue: 'completed_set' }
  };
}

export async function saveCompletedSetToFirestore(userId, set) {
  const idToken = await getFirebaseIdToken(userId);
  const url = `${BASE_FIRESTORE_URL}/users/${encodeURIComponent(userId)}/completed_sets/${encodeURIComponent(set.id)}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ fields: completedSetFields(set) })
  });
  if (!response.ok) throw new Error(`Cloud save failed (${response.status}).`);
  return true;
}

export async function getCompletedSetsFromFirestore(userId) {
  const idToken = await getFirebaseIdToken(userId);
  const sets = [];
  let pageToken = null;
  do {
    const query = pageToken ? `?pageSize=300&pageToken=${encodeURIComponent(pageToken)}` : '?pageSize=300';
    const response = await fetch(`${BASE_FIRESTORE_URL}/users/${encodeURIComponent(userId)}/completed_sets${query}`, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
    if (!response.ok) throw new Error(`Cloud load failed (${response.status}).`);
    const data = await response.json();
    for (const doc of data.documents || []) {
      const f = doc.fields || {};
      const set = {
        id: f.id?.stringValue || doc.name.split('/').pop(),
        sessionId: f.sessionId?.stringValue,
        exerciseId: f.exerciseId?.stringValue,
        exerciseName: f.exerciseName?.stringValue,
        muscle: f.muscle?.stringValue || '',
        routineTitle: f.routineTitle?.stringValue || '',
        reps: Number(f.reps?.integerValue),
        weightKg: Number(f.weightKg?.doubleValue ?? f.weightKg?.integerValue ?? 0),
        loggedAt: f.loggedAt?.stringValue,
        source: f.source?.stringValue,
        synced: true
      };
      if (set.source === 'completed_set' && Number.isInteger(set.reps) && set.reps > 0 && Number.isFinite(Date.parse(set.loggedAt))) sets.push(set);
    }
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return sets;
}

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
 * 👤 Save or update user profile in Firestore
 */
export async function saveUserProfileToFirestore(userId, profile) {
  if (!userId || !FIREBASE_CONFIG.projectId || !profile) return null;

  try {
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${userId}?key=${FIREBASE_CONFIG.apiKey}`;
    const fields = {};
    if (profile.name !== undefined) fields.name = { stringValue: String(profile.name) };
    if (profile.email !== undefined) fields.email = { stringValue: String(profile.email) };
    if (profile.gender !== undefined) fields.gender = { stringValue: String(profile.gender) };
    if (profile.weight !== undefined) fields.weight = { doubleValue: Number(profile.weight) };
    if (profile.height !== undefined || profile.heightCm !== undefined) {
      fields.height = { integerValue: String(profile.height || profile.heightCm) };
    }
    if (profile.topGoal !== undefined) fields.topGoal = { stringValue: String(profile.topGoal) };
    if (profile.trainingExperience !== undefined || profile.experience !== undefined) {
      fields.experience = { stringValue: String(profile.trainingExperience || profile.experience) };
    }
    if (profile.workoutGuidance !== undefined || profile.guidance !== undefined) {
      fields.guidance = { stringValue: String(profile.workoutGuidance || profile.guidance) };
    }
    if (profile.unitWeight !== undefined) fields.unitWeight = { stringValue: String(profile.unitWeight) };
    if (profile.unitDistance !== undefined) fields.unitDistance = { stringValue: String(profile.unitDistance) };
    if (profile.unitBody !== undefined) fields.unitBody = { stringValue: String(profile.unitBody) };
    fields.updatedAt = { stringValue: new Date().toISOString() };

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
 * 🏋️ Save completed workout to Firestore under users/{userId}/workouts
 */
export async function saveWorkoutToFirestore(userId, workoutData) {
  if (!userId || !FIREBASE_CONFIG.projectId) return;

  try {
    const idToken = await getFirebaseIdToken(userId);
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${encodeURIComponent(userId)}/workouts/${encodeURIComponent(workoutData.id)}`;

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
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ fields })
    });
    if (!res.ok) throw new Error(`Workout cloud save failed (${res.status}).`);
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
    const idToken = await getFirebaseIdToken(userId);
    const firestoreUrl = `${BASE_FIRESTORE_URL}/users/${encodeURIComponent(userId)}/workouts`;
    const res = await fetch(firestoreUrl, { headers: { Authorization: `Bearer ${idToken}` } });
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
