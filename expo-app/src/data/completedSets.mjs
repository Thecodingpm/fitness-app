const LIFT_KEYS = {
  chest_1: 'bench',
  chest_2: 'pushup',
  legs_1: 'squat',
  legs_2: 'legpress',
  legs_3: 'legextension',
  back_1: 'pullup',
  back_2: 'latpulldown',
  back_3: 'deadlift',
  shoulders_1: 'press',
  arms_1: 'triceps'
};

export function createCompletedSet({ id, sessionId, exercise, routineTitle, reps, weightKg, loggedAt }) {
  const actualReps = Number(reps);
  const actualWeight = weightKg === '' || weightKg == null ? 0 : Number(weightKg);
  if (!exercise?.id || !id || !sessionId) throw new Error('Exercise session is missing. Start the workout again.');
  if (!Number.isInteger(actualReps) || actualReps < 1 || actualReps > 100) throw new Error('Enter a whole number of reps from 1 to 100.');
  if (!Number.isFinite(actualWeight) || actualWeight < 0 || actualWeight > 1000) throw new Error('Enter a weight from 0 to 1000 kg.');
  if (!Number.isFinite(Date.parse(loggedAt))) throw new Error('Invalid log time.');
  return {
    id,
    sessionId,
    exerciseId: exercise.id,
    exerciseName: exercise.shortName || exercise.name,
    muscle: exercise.muscle || '',
    routineTitle: routineTitle || '',
    reps: actualReps,
    weightKg: Math.round(actualWeight * 100) / 100,
    loggedAt,
    source: 'completed_set'
  };
}

export function mergeCompletedSets(localSets = [], cloudSets = []) {
  const byId = new Map();
  for (const item of [...localSets, ...cloudSets]) {
    if (item?.id && item.source === 'completed_set') byId.set(item.id, item);
  }
  return [...byId.values()].sort((a, b) => Date.parse(b.loggedAt) - Date.parse(a.loggedAt));
}

export function setsForExerciseSession(sets, exerciseId, sessionId) {
  return sets.filter(item => item.exerciseId === exerciseId && item.sessionId === sessionId);
}

export function analyticsPointsFromSets(sets, liftKey) {
  const normalizedKey = (liftKey || '').toLowerCase();
  return sets.filter(item => {
    if (item.source !== 'completed_set') return false;
    if (!Number.isFinite(Date.parse(item.loggedAt))) return false;
    if (!Number(item.reps) || Number(item.reps) <= 0) return false;

    // Check direct lift key match
    const mapped = LIFT_KEYS[item.exerciseId] || '';
    const idMatch = (item.exerciseId || '').toLowerCase() === normalizedKey;
    const keyMatch = mapped.toLowerCase() === normalizedKey;
    const nameMatch = (item.exerciseName || '').toLowerCase().includes(normalizedKey);
    const keyInName = normalizedKey.length > 2 && (item.exerciseName || '').toLowerCase().includes(normalizedKey.slice(0, 4));

    return idMatch || keyMatch || nameMatch || keyInName;
  }).map(item => ({
    id: item.id,
    value: Number(item.weightKg) || 0,
    reps: Number(item.reps),
    date: item.loggedAt,
    source: item.source,
    exerciseName: item.exerciseName || 'Exercise'
  }));
}

export function getUniqueExercisesWithSets(sets = []) {
  const map = new Map();
  for (const s of sets) {
    if (s.source === 'completed_set' && s.exerciseId) {
      if (!map.has(s.exerciseId)) {
        map.set(s.exerciseId, {
          id: s.exerciseId,
          name: s.exerciseName || s.exerciseId,
          muscle: s.muscle || ''
        });
      }
    }
  }
  return [...map.values()];
}

export function totalVolumeKg(sets) {
  return sets.reduce((sum, item) => sum + (Number(item.weightKg) || 0) * (Number(item.reps) || 0), 0);
}

