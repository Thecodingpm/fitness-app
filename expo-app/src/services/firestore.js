// firestore.js — Domain Firestore Service with Authenticated Client Integration

import { firestoreRequest } from './firebase/firestoreClient';
import { FirestoreError } from './firebase/firestoreErrors';

function completedSetFields(set) {
  return {
    id: { stringValue: set.id },
    sessionId: { stringValue: set.sessionId || '' },
    exerciseId: { stringValue: set.exerciseId || '' },
    exerciseName: { stringValue: set.exerciseName || '' },
    muscle: { stringValue: set.muscle || '' },
    routineTitle: { stringValue: set.routineTitle || '' },
    reps: { integerValue: String(set.reps ?? 0) },
    weightKg: { doubleValue: Number(set.weightKg ?? 0) },
    loggedAt: { stringValue: set.loggedAt || new Date().toISOString() },
    source: { stringValue: 'completed_set' }
  };
}

/**
 * 🏋️ Save an individual completed set to Firestore
 */
export async function saveCompletedSetToFirestore(userId, set) {
  if (!userId || userId === 'guest' || !set?.id) return false;

  const path = `/users/${encodeURIComponent(userId)}/completed_sets/${encodeURIComponent(set.id)}`;
  await firestoreRequest({
    userId,
    operation: 'SAVE_COMPLETED_SET',
    method: 'PATCH',
    path,
    body: { fields: completedSetFields(set) }
  });
  return true;
}

/**
 * 🏋️ Fetch all completed sets for a user from Firestore (with pagination)
 */
export async function getCompletedSetsFromFirestore(userId) {
  if (!userId || userId === 'guest') return [];

  const sets = [];
  let pageToken = null;

  try {
    do {
      const queryParams = { pageSize: 300 };
      if (pageToken) queryParams.pageToken = pageToken;

      const data = await firestoreRequest({
        userId,
        operation: 'GET_COMPLETED_SETS',
        method: 'GET',
        path: `/users/${encodeURIComponent(userId)}/completed_sets`,
        queryParams
      });

      for (const doc of data.documents || []) {
        const f = doc.fields || {};
        const set = {
          id: f.id?.stringValue || doc.name.split('/').pop(),
          sessionId: f.sessionId?.stringValue || '',
          exerciseId: f.exerciseId?.stringValue || '',
          exerciseName: f.exerciseName?.stringValue || '',
          muscle: f.muscle?.stringValue || '',
          routineTitle: f.routineTitle?.stringValue || '',
          reps: Number(f.reps?.integerValue ?? 0),
          weightKg: Number(f.weightKg?.doubleValue ?? f.weightKg?.integerValue ?? 0),
          loggedAt: f.loggedAt?.stringValue || '',
          source: f.source?.stringValue || 'completed_set',
          synced: true
        };
        if (set.source === 'completed_set' && Number.isInteger(set.reps) && set.reps > 0 && Number.isFinite(Date.parse(set.loggedAt))) {
          sets.push(set);
        }
      }
      pageToken = data.nextPageToken || null;
    } while (pageToken);
  } catch (err) {
    if (err instanceof FirestoreError && err.code === 'NOT_FOUND') {
      return [];
    }
    throw err;
  }

  return sets;
}

/**
 * 👤 Fetch user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId, _idToken = null) {
  if (!userId || userId === 'guest') return null;

  try {
    const data = await firestoreRequest({
      userId,
      operation: 'GET_USER_PROFILE',
      method: 'GET',
      path: `/users/${encodeURIComponent(userId)}`
    });

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
      fitnessGoals: f.fitnessGoals?.arrayValue?.values?.map(v => v.stringValue) || [],
      onboardingStatus: f.onboardingStatus?.stringValue || null,
      createdAt: f.createdAt?.stringValue || null,
      onboardingCompletedAt: f.onboardingCompletedAt?.stringValue || null,
      onboardingSkippedAt: f.onboardingSkippedAt?.stringValue || null
    };
  } catch (err) {
    if (err instanceof FirestoreError && err.code === 'NOT_FOUND') {
      return null;
    }
    throw err;
  }
}

/**
 * 👤 Save or update user profile in Firestore
 */
export async function saveUserProfileToFirestore(userId, profile) {
  if (!userId || userId === 'guest' || !profile) return null;

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

  return await firestoreRequest({
    userId,
    operation: 'SAVE_USER_PROFILE',
    method: 'PATCH',
    path: `/users/${encodeURIComponent(userId)}`,
    body: { fields }
  });
}

/**
 * 🏋️ Save completed workout to Firestore under users/{userId}/workouts/{workoutId}
 */
export async function saveWorkoutToFirestore(userId, workoutData) {
  if (!userId || userId === 'guest' || !workoutData) return null;

  const id = workoutData.id || `w-${Date.now()}`;
  const fields = {
    id: { stringValue: id },
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

  return await firestoreRequest({
    userId,
    operation: 'SAVE_WORKOUT',
    method: 'PATCH',
    path: `/users/${encodeURIComponent(userId)}/workouts/${encodeURIComponent(id)}`,
    body: { fields }
  });
}

/**
 * 🏋️ Fetch all recorded workouts for a user from Firestore
 */
export async function getUserWorkoutsFromFirestore(userId) {
  if (!userId || userId === 'guest') return [];

  try {
    const data = await firestoreRequest({
      userId,
      operation: 'GET_WORKOUTS',
      method: 'GET',
      path: `/users/${encodeURIComponent(userId)}/workouts`
    });

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
    if (err instanceof FirestoreError && err.code === 'NOT_FOUND') {
      return [];
    }
    throw err;
  }
}

/**
 * 📈 Save compound exercise logs (Bench, Squat, Deadlift, Press) to Firestore
 */
export async function saveExerciseLogsToFirestore(userId, logs) {
  if (!userId || userId === 'guest' || !logs) return null;

  const fields = {
    jsonString: { stringValue: JSON.stringify(logs) },
    updatedAt: { stringValue: new Date().toISOString() }
  };

  return await firestoreRequest({
    userId,
    operation: 'SAVE_EXERCISE_LOGS',
    method: 'PATCH',
    path: `/users/${encodeURIComponent(userId)}/exercise_data/logs`,
    body: { fields }
  });
}

/**
 * 📈 Fetch compound exercise logs from Firestore
 */
export async function getUserExerciseLogsFromFirestore(userId) {
  if (!userId || userId === 'guest') return null;

  try {
    const data = await firestoreRequest({
      userId,
      operation: 'GET_EXERCISE_LOGS',
      method: 'GET',
      path: `/users/${encodeURIComponent(userId)}/exercise_data/logs`
    });

    if (data.fields?.jsonString?.stringValue) {
      return JSON.parse(data.fields.jsonString.stringValue);
    }
    return null;
  } catch (err) {
    if (err instanceof FirestoreError && err.code === 'NOT_FOUND') {
      return null;
    }
    throw err;
  }
}

/**
 * 📅 Save daily completion statuses map to Firestore
 */
export async function saveDailyStatusesToFirestore(userId, statuses) {
  if (!userId || userId === 'guest' || !statuses) return null;

  const fields = {
    jsonString: { stringValue: JSON.stringify(statuses) },
    updatedAt: { stringValue: new Date().toISOString() }
  };

  return await firestoreRequest({
    userId,
    operation: 'SAVE_DAILY_STATUSES',
    method: 'PATCH',
    path: `/users/${encodeURIComponent(userId)}/calendar_data/statuses`,
    body: { fields }
  });
}

/**
 * 📅 Fetch daily completion statuses map from Firestore
 */
export async function getUserDailyStatusesFromFirestore(userId) {
  if (!userId || userId === 'guest') return null;

  try {
    const data = await firestoreRequest({
      userId,
      operation: 'GET_DAILY_STATUSES',
      method: 'GET',
      path: `/users/${encodeURIComponent(userId)}/calendar_data/statuses`
    });

    if (data.fields?.jsonString?.stringValue) {
      return JSON.parse(data.fields.jsonString.stringValue);
    }
    return null;
  } catch (err) {
    if (err instanceof FirestoreError && err.code === 'NOT_FOUND') {
      return null;
    }
    throw err;
  }
}
