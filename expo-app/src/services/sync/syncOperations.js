// syncOperations.js — Explicit Operation Types and Mapping to Firestore Calls

import {
  saveCompletedSetToFirestore,
  saveWorkoutToFirestore,
  saveDailyStatusesToFirestore,
  saveUserProfileToFirestore,
  saveExerciseLogsToFirestore
} from '../firestore.js';

export const SyncOperationType = {
  UPSERT_COMPLETED_SET: 'UPSERT_COMPLETED_SET',
  UPSERT_WORKOUT: 'UPSERT_WORKOUT',
  UPSERT_DAILY_STATUSES: 'UPSERT_DAILY_STATUSES',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SAVE_EXERCISE_LOGS: 'SAVE_EXERCISE_LOGS'
};

/**
 * Distinguishes state-snapshot operations (where latest payload supersedes older ones)
 * from historical event operations (where distinct workout sets must never be collapsed).
 */
export function isStateBasedOperation(operationType) {
  return (
    operationType === SyncOperationType.UPDATE_PROFILE ||
    operationType === SyncOperationType.UPSERT_DAILY_STATUSES ||
    operationType === SyncOperationType.SAVE_EXERCISE_LOGS
  );
}

/**
 * Maps a queued operation to its respective Firestore service method.
 */
export async function executeSyncOperation(operation) {
  const { operationType, userId, payload } = operation;

  if (!userId || userId === 'guest') {
    throw new Error('Cannot execute sync operation for unauthenticated user.');
  }

  switch (operationType) {
    case SyncOperationType.UPSERT_COMPLETED_SET: {
      const setData = payload?.completedSet || payload;
      return await saveCompletedSetToFirestore(userId, setData);
    }

    case SyncOperationType.UPSERT_WORKOUT: {
      const workoutData = payload?.workout || payload;
      return await saveWorkoutToFirestore(userId, workoutData);
    }

    case SyncOperationType.UPSERT_DAILY_STATUSES: {
      const statusesData = payload?.statuses || payload;
      return await saveDailyStatusesToFirestore(userId, statusesData);
    }

    case SyncOperationType.UPDATE_PROFILE: {
      const profileData = payload?.profile || payload;
      return await saveUserProfileToFirestore(userId, profileData);
    }

    case SyncOperationType.SAVE_EXERCISE_LOGS: {
      const logsData = payload?.logs || payload;
      return await saveExerciseLogsToFirestore(userId, logsData);
    }

    default:
      throw new Error(`Unknown sync operation type: ${operationType}`);
  }
}
