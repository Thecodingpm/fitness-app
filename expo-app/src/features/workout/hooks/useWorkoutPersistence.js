import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { WEEKLY_ROUTINES_DB } from '../../../data/exercisesDb';
import { saveDayCustomExercises, loadDayCustomExercises } from '../../../services/sessionStorage';
import { buildCustomExercise, reorderArray } from '../utils/workoutHelpers';

/**
 * Hook managing routine selection, day tracking, and custom exercise persistence.
 *
 * @param {Object} params
 * @param {Object} [params.initialRoutine]
 * @param {boolean} [params.visible]
 * @param {string} [params.userId='guest']
 * @param {Function} [params.onSelectRoutine]
 * @returns {Object}
 */
export function useWorkoutPersistence({
  initialRoutine,
  visible = true,
  userId = 'guest',
  onSelectRoutine
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(initialRoutine?.dayIndex ?? 0);
  const [customExercises, setCustomExercises] = useState([]);

  // Sync active routine when initialRoutine prop changes or modal becomes visible
  useEffect(() => {
    if (initialRoutine && initialRoutine.dayIndex !== undefined) {
      setActiveDayIndex(initialRoutine.dayIndex);
    }
  }, [initialRoutine, visible]);

  // Load custom exercises whenever activeDayIndex or userId changes
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const loaded = await loadDayCustomExercises(activeDayIndex, userId);
        if (isMounted) setCustomExercises(loaded || []);
      } catch (err) {
        console.warn('Failed to load custom exercises for day', activeDayIndex, err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [activeDayIndex, userId]);

  // Current routine based on active day index, falling back to initialRoutine or Day 0
  const currentRoutine = WEEKLY_ROUTINES_DB[activeDayIndex] || initialRoutine || WEEKLY_ROUTINES_DB[0];

  // Raw combined exercises (base routine exercises + custom exercises)
  const rawExercises = useMemo(() => {
    const base = currentRoutine?.exercises || [];
    const customIds = new Set(customExercises.map(e => e.id));
    return [...base.filter(e => !customIds.has(e.id)), ...customExercises];
  }, [currentRoutine, customExercises]);

  const selectDay = useCallback((index) => {
    setActiveDayIndex(index);
    const routineForDay = WEEKLY_ROUTINES_DB[index];
    if (routineForDay && onSelectRoutine) {
      onSelectRoutine(routineForDay);
    }
  }, [onSelectRoutine]);

  const addExerciseToRoutine = useCallback(async (exToAdd) => {
    if (!exToAdd || !exToAdd.id) return false;
    const exists = rawExercises.some((e) => e.id === exToAdd.id);
    if (exists) {
      Alert.alert('Already Added', `${exToAdd.name} is already in this routine.`);
      return false;
    }
    const updated = [...customExercises, exToAdd];
    setCustomExercises(updated);
    try {
      await saveDayCustomExercises(activeDayIndex, updated, userId);
      Alert.alert('Exercise Added 🎉', `${exToAdd.name} added to ${currentRoutine?.dayName || 'this'} routine.`);
      return true;
    } catch (err) {
      console.warn('Failed to save custom exercises:', err);
      return true;
    }
  }, [rawExercises, customExercises, activeDayIndex, userId, currentRoutine]);

  const createAndAddCustomExercise = useCallback(async (name, muscle = 'Chest') => {
    if (!name || !name.trim()) {
      Alert.alert('Missing Name', 'Please enter an exercise name.');
      return false;
    }
    const newEx = buildCustomExercise(name, muscle);
    return await addExerciseToRoutine(newEx);
  }, [addExerciseToRoutine]);

  const reorderCustomExercises = useCallback(async (fromIndex, toIndex) => {
    const nextCustom = reorderArray(customExercises, fromIndex, toIndex);
    setCustomExercises(nextCustom);
    await saveDayCustomExercises(activeDayIndex, nextCustom, userId);
  }, [customExercises, activeDayIndex, userId]);

  return {
    activeDayIndex,
    setActiveDayIndex,
    selectDay,
    currentRoutine,
    customExercises,
    rawExercises,
    exerciseCount: rawExercises.length,
    estimatedDuration: currentRoutine?.durationMin || 45,
    addExerciseToRoutine,
    createAndAddCustomExercise,
    reorderCustomExercises
  };
}
