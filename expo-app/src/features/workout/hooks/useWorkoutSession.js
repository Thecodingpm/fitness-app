import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, AppState } from 'react-native';
import { useRestTimer } from '../../../hooks/useRestTimer';
import {
  formatTimer,
  getSetsForExercise,
  calculateCompletedStats,
  resolveSections,
  filterSections
} from '../utils/workoutHelpers';

/**
 * Controller hook for an active workout session.
 * Manages workout lifecycle, elapsed time, set logging, rest timer, and completion flow.
 *
 * @param {Object} params
 * @param {boolean} params.visible
 * @param {Object} params.currentRoutine
 * @param {Array} params.rawExercises
 * @param {Object} [params.savedProgress]
 * @param {Array} [params.completedSets=[]]
 * @param {Function} [params.onLogSet]
 * @param {Function} [params.onLogBatchSets]
 * @param {Function} [params.onSaveProgress]
 * @param {Function} [params.onFinishWorkout]
 * @param {Function} [params.onClose]
 * @returns {Object}
 */
export function useWorkoutSession({
  visible,
  currentRoutine,
  rawExercises = [],
  savedProgress,
  completedSets = [],
  onLogSet,
  onLogBatchSets,
  onSaveProgress,
  onFinishWorkout,
  onClose
}) {
  const [workoutState, setWorkoutState] = useState('PREVIEW');
  const [sessionId, setSessionId] = useState(null);
  const [workoutStartedAt, setWorkoutStartedAt] = useState(null);
  const [loggingExerciseId, setLoggingExerciseId] = useState(null);
  const [repsInput, setRepsInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [isSavingSet, setIsSavingSet] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');

  const exerciseCount = rawExercises.length;

  // Background-Safe Rest Timer (derives remaining time from absolute timestamps)
  const {
    remainingSeconds: restTimerSeconds,
    startRest,
    skipRest
  } = useRestTimer({
    sessionId,
    autoRestore: true,
    enableNotifications: true,
    enableHaptics: true
  });

  // Restore saved progress if resuming, or initialize preview
  useEffect(() => {
    if (visible) {
      if (savedProgress && savedProgress.routineTitle === currentRoutine?.title) {
        setWorkoutState('IN_PROGRESS');
        setSessionId(savedProgress.sessionId || null);
        const startedAt = savedProgress.workoutStartedAt || (Date.now() - (savedProgress.elapsedSeconds || 0) * 1000);
        setWorkoutStartedAt(startedAt);
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
      } else {
        setWorkoutState('PREVIEW');
        setSessionId(null);
        setWorkoutStartedAt(null);
        setElapsedSeconds(0);
      }
      setSelectedSectionFilter('ALL');
      setLoggingExerciseId(null);
    }
  }, [visible, currentRoutine?.title]);

  // Elapsed Workout Timer (Derived from real timestamp + AppState recovery)
  useEffect(() => {
    if (!visible || workoutState !== 'IN_PROGRESS' || !workoutStartedAt) return;

    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - workoutStartedAt) / 1000)));
    };

    updateElapsed();
    const timer = setInterval(updateElapsed, 1000);

    const subscription = AppState.addEventListener
      ? AppState.addEventListener('change', (state) => {
          if (state === 'active') updateElapsed();
        })
      : null;

    return () => {
      clearInterval(timer);
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [visible, workoutState, workoutStartedAt]);

  // Filter session sets belonging to this specific active session
  const sessionSets = useMemo(() => {
    if (!sessionId) return [];
    return completedSets.filter(
      set => set.sessionId === sessionId && set.source === 'completed_set'
    );
  }, [completedSets, sessionId]);

  // Derived completion stats
  const { completedExerciseIds, completedCount, percentComplete } = useMemo(() => {
    return calculateCompletedStats(rawExercises, sessionSets);
  }, [rawExercises, sessionSets]);

  // Start workout action
  const startWorkoutSession = useCallback(() => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    const startedAt = Date.now();
    setSessionId(id);
    setWorkoutStartedAt(startedAt);
    setElapsedSeconds(0);
    setWorkoutState('IN_PROGRESS');
    onSaveProgress?.({
      sessionId: id,
      routineTitle: currentRoutine.title,
      completedCount: 0,
      totalCount: exerciseCount,
      percentComplete: 0,
      elapsedSeconds: 0,
      workoutStartedAt: startedAt,
      routine: currentRoutine
    });
  }, [currentRoutine, exerciseCount, onSaveProgress]);

  // Save single set
  const handleSaveSet = useCallback(async (exercise) => {
    if (isSavingSet || !sessionId || !onLogSet) return;
    setIsSavingSet(true);
    try {
      const result = await onLogSet({
        exercise,
        sessionId,
        routineTitle: currentRoutine.title,
        reps: repsInput.trim(),
        weightKg: weightInput.trim()
      });
      setRepsInput('');
      setWeightInput('');
      startRest(90);
      if (!result?.synced) {
        Alert.alert(
          'Set saved on this device',
          'Cloud sync is pending. Reopen the app when online, or sign in again if your session expired.'
        );
      }
    } catch (error) {
      Alert.alert('Set not saved', error.message || 'Please try again.');
    } finally {
      setIsSavingSet(false);
    }
  }, [isSavingSet, sessionId, onLogSet, currentRoutine?.title, repsInput, weightInput, startRest]);

  // Save batch sets (e.g. 3 sets)
  const handleSaveBatchSets = useCallback(async (exercise, setsCount = 3) => {
    if (isSavingSet || !sessionId) return;
    const reps = repsInput.trim() || String(exercise.sets?.[0]?.reps || 10);
    const weight = weightInput.trim() || String(exercise.sets?.[0]?.weight || 0);
    setIsSavingSet(true);
    try {
      if (onLogBatchSets) {
        await onLogBatchSets({
          exercise,
          sessionId,
          routineTitle: currentRoutine.title,
          setsCount,
          reps: Number(reps) || 10,
          weightKg: Number(weight) || 0
        });
      } else if (onLogSet) {
        for (let i = 0; i < setsCount; i++) {
          await onLogSet({
            exercise,
            sessionId,
            routineTitle: currentRoutine.title,
            reps,
            weightKg: weight
          });
        }
      }
      setRepsInput('');
      setWeightInput('');
      startRest(90);
    } catch (error) {
      Alert.alert('Sets not saved', error.message || 'Please try again.');
    } finally {
      setIsSavingSet(false);
    }
  }, [isSavingSet, sessionId, repsInput, weightInput, onLogBatchSets, onLogSet, currentRoutine?.title, startRest]);

  // Handle closing modal with progress save
  const handleCloseModal = useCallback(() => {
    if (workoutState === 'IN_PROGRESS') {
      const completedCountValue = Object.values(completedExerciseIds).filter(Boolean).length;
      if (onSaveProgress) {
        onSaveProgress({
          routineTitle: currentRoutine.title,
          sessionId,
          completedCount: completedCountValue,
          totalCount: exerciseCount,
          percentComplete: Math.round((completedCountValue / (exerciseCount || 1)) * 100),
          completedExerciseIds,
          elapsedSeconds,
          workoutStartedAt,
          routine: currentRoutine
        });
      }
    }
    onClose?.();
  }, [
    workoutState,
    completedExerciseIds,
    onSaveProgress,
    currentRoutine,
    sessionId,
    exerciseCount,
    elapsedSeconds,
    workoutStartedAt,
    onClose
  ]);

  // Confirm finish workout
  const handleConfirmFinish = useCallback(() => {
    setShowFinishConfirm(false);
    const completedList = rawExercises.filter(
      (ex) => getSetsForExercise(sessionSets, ex.id).length > 0
    );
    if (completedList.length === 0) {
      Alert.alert('No sets logged', 'Log at least one real set before saving this workout.');
      return;
    }

    if (onFinishWorkout) {
      onFinishWorkout({
        routineTitle: currentRoutine.title,
        durationSeconds: elapsedSeconds,
        exercisesCompleted: completedList.length,
        completedExercises: completedList,
        sessionId
      });
      skipRest();
    }
    onClose?.();
  }, [
    rawExercises,
    sessionSets,
    onFinishWorkout,
    currentRoutine?.title,
    elapsedSeconds,
    sessionId,
    skipRest,
    onClose
  ]);

  // Toggle inline set logger for an exercise
  const toggleLoggingExercise = useCallback((exerciseId) => {
    setLoggingExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
    setRepsInput('');
    setWeightInput('');
  }, []);

  // Sections and section filter
  const sectionsToRender = useMemo(() => {
    return resolveSections(currentRoutine, rawExercises);
  }, [currentRoutine, rawExercises]);

  const filteredSections = useMemo(() => {
    return filterSections(sectionsToRender, selectedSectionFilter);
  }, [sectionsToRender, selectedSectionFilter]);

  return {
    workoutState,
    sessionId,
    workoutStartedAt,
    elapsedSeconds,
    formattedElapsed: formatTimer(elapsedSeconds),
    restTimerSeconds,
    startRest,
    skipRest,
    sessionSets,
    completedExerciseIds,
    completedCount,
    percentComplete,
    exerciseCount,
    loggingExerciseId,
    toggleLoggingExercise,
    repsInput,
    setRepsInput,
    weightInput,
    setWeightInput,
    isSavingSet,
    showFinishConfirm,
    setShowFinishConfirm,
    selectedSectionFilter,
    setSelectedSectionFilter,
    sectionsToRender,
    filteredSections,
    startWorkoutSession,
    handleSaveSet,
    handleSaveBatchSets,
    handleCloseModal,
    handleConfirmFinish
  };
}
