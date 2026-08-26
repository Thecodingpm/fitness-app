import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@lift_user_session_v1';
const STATUSES_KEY = '@lift_daily_statuses_v1';
const HISTORY_KEY = '@lift_workout_history_v1';

/**
 * 💾 Save the full authenticated user session
 */
export async function saveUserSession(sessionData) {
  try {
    const payload = {
      ...sessionData,
      isLoggedIn: true,
      lastActiveAt: new Date().toISOString()
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch (error) {
    console.log('Error saving session:', error);
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
      // Also load persisted daily workout statuses and history if available
      const statusesJson = await AsyncStorage.getItem(STATUSES_KEY);
      const historyJson = await AsyncStorage.getItem(HISTORY_KEY);

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
 * 📊 Persist daily workout statuses map
 */
export async function persistDailyStatuses(statuses) {
  try {
    await AsyncStorage.setItem(STATUSES_KEY, JSON.stringify(statuses));
  } catch (error) {
    console.log('Error persisting daily statuses:', error);
  }
}

/**
 * 🏋️ Persist workout history array
 */
export async function persistWorkoutHistory(history) {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.log('Error persisting workout history:', error);
  }
}
