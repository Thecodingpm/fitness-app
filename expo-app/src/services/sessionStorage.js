import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@lift_user_session_v2';
const getStatusesKey = (uid) => `@lift_daily_statuses_v2_${uid || 'guest'}`;
const getHistoryKey = (uid) => `@lift_workout_history_v2_${uid || 'guest'}`;
const getExerciseLogsKey = (uid) => `@lift_exercise_logs_v2_${uid || 'guest'}`;
const getCompletedSetsKey = (uid) => `@lift_completed_sets_v1_${uid}`;
const getProfileKey = (uid) => `@lift_profile_v1_${uid}`;

/**
 * 💾 Save the full authenticated user session
 */
export async function saveUserSession(sessionData) {
  try {
    const existingJson = await AsyncStorage.getItem(SESSION_KEY);
    const existing = existingJson ? JSON.parse(existingJson) : null;
    const sameUser = existing &&
      (existing.firebaseUid || existing.userEmail) === (sessionData.firebaseUid || sessionData.userEmail);
    const payload = {
      ...(sameUser ? existing : {}),
      ...sessionData,
      isLoggedIn: true,
      lastActiveAt: new Date().toISOString()
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.log('Error saving session:', error);
    return null;
  }
}

/** Profile survives logout and is scoped to the authenticated account. */
export async function saveLocalUserProfile(userId, profile) {
  if (!userId || userId === 'guest') return;
  await AsyncStorage.setItem(getProfileKey(userId), JSON.stringify(profile));
}

export async function loadLocalUserProfile(userId) {
  if (!userId || userId === 'guest') return null;
  try {
    const json = await AsyncStorage.getItem(getProfileKey(userId));
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.log('Error loading local user profile:', error);
    return null;
  }
}

/**
 * 🔍 Load the existing authenticated user session on app launch
 */
export async function loadUserSession() {
  try {
    const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
    if (!sessionJson) return null;

    const session = JSON.parse(sessionJson);
    if (session && session.isLoggedIn) {
      const uid = session.firebaseUid || session.userEmail || 'guest';
      const statusesJson = await AsyncStorage.getItem(getStatusesKey(uid));
      const historyJson = await AsyncStorage.getItem(getHistoryKey(uid));

      if (statusesJson) {
        session.dailyWorkoutStatuses = JSON.parse(statusesJson);
      }
      if (historyJson) {
        session.workoutHistory = JSON.parse(historyJson);
      }

      return session;
    }
    return null;
  } catch (error) {
    console.log('Error loading session:', error);
    return null;
  }
}

/**
 * 🗑️ Clear authenticated session on Logout
 */
export async function clearUserSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.log('Error clearing session:', error);
  }
}

/**
 * 📊 Persist daily workout statuses map for specific user
 */
export async function persistDailyStatuses(statuses, userId = 'guest') {
  try {
    await AsyncStorage.setItem(getStatusesKey(userId), JSON.stringify(statuses));
  } catch (error) {
    console.log('Error persisting daily statuses:', error);
  }
}

/**
 * 📊 Load daily workout statuses map for specific user
 */
export async function loadDailyStatuses(userId = 'guest') {
  try {
    const json = await AsyncStorage.getItem(getStatusesKey(userId));
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.log('Error loading daily statuses:', error);
    return null;
  }
}

/**
 * 🏋️ Persist workout history array for specific user
 */
export async function persistWorkoutHistory(history, userId = 'guest') {
  try {
    await AsyncStorage.setItem(getHistoryKey(userId), JSON.stringify(history));
  } catch (error) {
    console.log('Error persisting workout history:', error);
  }
}

/**
 * 🏋️ Load workout history array for specific user
 */
export async function loadWorkoutHistory(userId = 'guest') {
  try {
    const json = await AsyncStorage.getItem(getHistoryKey(userId));
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.log('Error loading workout history:', error);
    return [];
  }
}

/**
 * 📈 Persist individual compound exercise logs for specific user
 */
export async function persistExerciseLogs(logs, userId = 'guest') {
  try {
    await AsyncStorage.setItem(getExerciseLogsKey(userId), JSON.stringify(logs));
  } catch (error) {
    console.log('Error persisting exercise logs:', error);
  }
}

/**
 * 🔍 Load individual compound exercise logs for specific user
 */
export async function loadExerciseLogs(userId = 'guest') {
  try {
    const logsJson = await AsyncStorage.getItem(getExerciseLogsKey(userId));
    return logsJson ? JSON.parse(logsJson) : null;
  } catch (error) {
    console.log('Error loading exercise logs:', error);
    return null;
  }
}

const getCustomExercisesKey = (uid, dayIndex) => `@lift_custom_exercises_${uid || 'guest'}_day_${dayIndex}`;

/** Source of truth: sets explicitly submitted by the user. */
export async function loadCompletedSets(userId = 'guest') {
  try {
    const uid = userId || 'guest';
    const raw = await AsyncStorage.getItem(getCompletedSetsKey(uid));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log('Error loading completed sets:', error);
    return [];
  }
}

export async function persistCompletedSets(sets, userId = 'guest') {
  try {
    const uid = userId || 'guest';
    await AsyncStorage.setItem(getCompletedSetsKey(uid), JSON.stringify(sets || []));
  } catch (error) {
    console.log('Error persisting completed sets:', error);
  }
}

/** 📝 Save custom exercises added by user to a specific day routine */
export async function saveDayCustomExercises(dayIndex, exercises, userId = 'guest') {
  try {
    const uid = userId || 'guest';
    await AsyncStorage.setItem(getCustomExercisesKey(uid, dayIndex), JSON.stringify(exercises || []));
  } catch (error) {
    console.log('Error saving custom day exercises:', error);
  }
}

/** 🔍 Load custom exercises added by user for a specific day routine */
export async function loadDayCustomExercises(dayIndex, userId = 'guest') {
  try {
    const uid = userId || 'guest';
    const json = await AsyncStorage.getItem(getCustomExercisesKey(uid, dayIndex));
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.log('Error loading custom day exercises:', error);
    return [];
  }
}

