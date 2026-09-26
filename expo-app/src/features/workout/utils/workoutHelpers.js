/**
 * workoutHelpers.js
 * Pure utility functions for the LIFT Workout feature engine.
 * Covers timer formatting, set/completion derivations, search filtering, and reordering.
 */

/**
 * Formats a duration in seconds to MM:SS string.
 * @param {number} seconds
 * @returns {string} e.g. "04:32"
 */
export function formatTimer(seconds = 0) {
  const safeSecs = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = Math.floor(safeSecs / 60);
  const secs = safeSecs % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Returns logged session sets belonging to a specific exercise.
 * @param {Array} sessionSets
 * @param {string} exerciseId
 * @returns {Array}
 */
export function getSetsForExercise(sessionSets = [], exerciseId) {
  if (!Array.isArray(sessionSets) || !exerciseId) return [];
  return sessionSets.filter(set => set.exerciseId === exerciseId);
}

/**
 * Computes completed status map, total completed exercises count, and percentage.
 * @param {Array} rawExercises
 * @param {Array} sessionSets
 * @returns {{ completedExerciseIds: Record<string, boolean>, completedCount: number, percentComplete: number }}
 */
export function calculateCompletedStats(rawExercises = [], sessionSets = []) {
  if (!Array.isArray(rawExercises)) {
    return { completedExerciseIds: {}, completedCount: 0, percentComplete: 0 };
  }

  const completedExerciseIds = {};
  for (const exercise of rawExercises) {
    if (!exercise || !exercise.id) continue;
    const logged = getSetsForExercise(sessionSets, exercise.id);
    const targetSets = exercise.sets?.length || 3;
    completedExerciseIds[exercise.id] = logged.length >= targetSets;
  }

  const completedCount = Object.values(completedExerciseIds).filter(Boolean).length;
  const exerciseCount = rawExercises.length;
  const percentComplete = Math.round((completedCount / (exerciseCount || 1)) * 100);

  return {
    completedExerciseIds,
    completedCount,
    percentComplete
  };
}

/**
 * Implements immutable array element reordering.
 * @param {Array} list
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {Array}
 */
export function reorderArray(list = [], fromIndex, toIndex) {
  if (!Array.isArray(list)) return [];
  if (
    fromIndex < 0 ||
    fromIndex >= list.length ||
    toIndex < 0 ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return [...list];
  }
  const next = [...list];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

/**
 * Filters the exercises database for the Add Exercise modal.
 * Excludes already added exercises, searches across name and muscle, limits results.
 * @param {Array} exercisesDb
 * @param {string} query
 * @param {Array} existingExercises
 * @param {number} limit
 * @returns {Array}
 */
export function filterSearchExercises(exercisesDb = [], query = '', existingExercises = [], limit = 15) {
  if (!Array.isArray(exercisesDb)) return [];
  const normalizedQuery = (query || '').trim().toLowerCase();
  const existingIds = new Set((existingExercises || []).map(e => e?.id).filter(Boolean));

  return exercisesDb
    .filter((e) => {
      if (!e || !e.id || existingIds.has(e.id)) return false;
      if (!normalizedQuery) return true;
      const searchable = `${e.name || ''} ${e.muscle || ''}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    })
    .slice(0, limit);
}

/**
 * Builds a standardized custom exercise entity.
 * @param {string} name
 * @param {string} muscle
 * @returns {Object}
 */
export function buildCustomExercise(name, muscle = 'Chest') {
  const trimmedName = (name || '').trim();
  const safeMuscle = (muscle || 'Chest').trim();
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: trimmedName,
    shortName: trimmedName.slice(0, 18),
    muscle: safeMuscle,
    equipment: 'Free Weights',
    tagline: `${safeMuscle} Move`,
    sets: [
      { num: 1, reps: 10, weight: 20, done: false },
      { num: 2, reps: 10, weight: 20, done: false },
      { num: 3, reps: 10, weight: 20, done: false }
    ]
  };
}

/**
 * Resolves the exercise sections to display for a routine.
 * @param {Object} currentRoutine
 * @param {Array} rawExercises
 * @returns {Array}
 */
export function resolveSections(currentRoutine, rawExercises = []) {
  if (currentRoutine?.sections && currentRoutine.sections.length > 0) {
    return currentRoutine.sections;
  }
  return [
    {
      name: currentRoutine?.focus || 'Main Exercises',
      icon: 'Flame',
      exercises: rawExercises
    }
  ];
}

/**
 * Filters routine sections based on active filter tab.
 * @param {Array} sections
 * @param {string} selectedFilter
 * @returns {Array}
 */
export function filterSections(sections = [], selectedFilter = 'ALL') {
  if (!Array.isArray(sections)) return [];
  if (!selectedFilter || selectedFilter === 'ALL') return sections;
  return sections.filter((s) => s.name === selectedFilter);
}

/**
 * Normalizes input set payload for logging.
 * @param {Object} params
 * @returns {Object}
 */
export function createSetPayload({ exercise, sessionId, routineTitle, reps, weightKg }) {
  return {
    exercise,
    sessionId,
    routineTitle,
    reps: String(reps ?? '').trim(),
    weightKg: String(weightKg ?? '').trim()
  };
}

/**
 * Computes summary data for a finished workout session.
 * @param {Object} params
 * @returns {Object}
 */
export function calculateFinishedWorkoutSummary({
  routineTitle,
  durationSeconds,
  completedExercises = [],
  sessionId,
  sessionSets = []
}) {
  const exercisesCount = completedExercises.length;
  const totalVolumeKg = (sessionSets || []).reduce((sum, set) => {
    const reps = Number(set.reps) || 0;
    const weight = Number(set.weightKg) || 0;
    return sum + (reps * weight);
  }, 0);

  return {
    sessionId,
    routineName: routineTitle || 'Workout Session',
    durationSeconds: Number(durationSeconds) || 0,
    exercisesCount,
    completedExercises,
    totalVolumeKg
  };
}
