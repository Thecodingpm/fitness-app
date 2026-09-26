import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTimer,
  getSetsForExercise,
  calculateCompletedStats,
  reorderArray,
  filterSearchExercises,
  buildCustomExercise,
  resolveSections,
  filterSections,
  createSetPayload,
  calculateFinishedWorkoutSummary
} from './workoutHelpers.js';

test('formatTimer formats seconds into MM:SS accurately', () => {
  assert.equal(formatTimer(0), '00:00');
  assert.equal(formatTimer(5), '00:05');
  assert.equal(formatTimer(59), '00:59');
  assert.equal(formatTimer(60), '01:00');
  assert.equal(formatTimer(75), '01:15');
  assert.equal(formatTimer(3599), '59:59');
  assert.equal(formatTimer(3600), '60:00');
  assert.equal(formatTimer(-10), '00:00');
  assert.equal(formatTimer(null), '00:00');
  assert.equal(formatTimer(undefined), '00:00');
});

test('getSetsForExercise filters sets matching exerciseId', () => {
  const sets = [
    { id: '1', exerciseId: 'bench', reps: 10 },
    { id: '2', exerciseId: 'squat', reps: 5 },
    { id: '3', exerciseId: 'bench', reps: 8 }
  ];
  const benchSets = getSetsForExercise(sets, 'bench');
  assert.equal(benchSets.length, 2);
  assert.equal(benchSets[0].id, '1');
  assert.equal(benchSets[1].id, '3');

  assert.deepEqual(getSetsForExercise([], 'bench'), []);
  assert.deepEqual(getSetsForExercise(sets, 'deadlift'), []);
  assert.deepEqual(getSetsForExercise(null, 'bench'), []);
});

test('calculateCompletedStats derives completion status, count, and percentage accurately', () => {
  const rawExercises = [
    { id: 'ex_1', sets: [{}, {}, {}] }, // 3 sets target
    { id: 'ex_2', sets: [{}, {}] },     // 2 sets target
    { id: 'ex_3', sets: [{}, {}, {}] }  // 3 sets target
  ];

  // No sets logged
  const statsEmpty = calculateCompletedStats(rawExercises, []);
  assert.equal(statsEmpty.completedCount, 0);
  assert.equal(statsEmpty.percentComplete, 0);
  assert.equal(statsEmpty.completedExerciseIds['ex_1'], false);
  assert.equal(statsEmpty.completedExerciseIds['ex_2'], false);
  assert.equal(statsEmpty.completedExerciseIds['ex_3'], false);

  // Partial sets logged for ex_1 (2/3), full for ex_2 (2/2)
  const sessionSets = [
    { id: 's1', exerciseId: 'ex_1', reps: 10 },
    { id: 's2', exerciseId: 'ex_1', reps: 10 },
    { id: 's3', exerciseId: 'ex_2', reps: 12 },
    { id: 's4', exerciseId: 'ex_2', reps: 12 }
  ];
  const statsPartial = calculateCompletedStats(rawExercises, sessionSets);
  assert.equal(statsPartial.completedExerciseIds['ex_1'], false);
  assert.equal(statsPartial.completedExerciseIds['ex_2'], true);
  assert.equal(statsPartial.completedExerciseIds['ex_3'], false);
  assert.equal(statsPartial.completedCount, 1);
  assert.equal(statsPartial.percentComplete, 33); // 1 / 3 = 33%

  // All completed
  const allSets = [
    ...sessionSets,
    { id: 's5', exerciseId: 'ex_1', reps: 10 },
    { id: 's6', exerciseId: 'ex_3', reps: 8 },
    { id: 's7', exerciseId: 'ex_3', reps: 8 },
    { id: 's8', exerciseId: 'ex_3', reps: 8 }
  ];
  const statsAll = calculateCompletedStats(rawExercises, allSets);
  assert.equal(statsAll.completedCount, 3);
  assert.equal(statsAll.percentComplete, 100);
});

test('reorderArray moves items correctly without mutating original array', () => {
  const original = ['A', 'B', 'C'];
  // Move index 2 ('C') to index 0 -> ['C', 'A', 'B']
  const result = reorderArray(original, 2, 0);
  assert.deepEqual(result, ['C', 'A', 'B']);
  // Verify immutability
  assert.deepEqual(original, ['A', 'B', 'C']);

  // Move index 0 ('A') to index 2 -> ['B', 'C', 'A']
  const result2 = reorderArray(original, 0, 2);
  assert.deepEqual(result2, ['B', 'C', 'A']);

  // Same index or out of bounds returns copy without changes
  assert.deepEqual(reorderArray(original, 1, 1), ['A', 'B', 'C']);
  assert.deepEqual(reorderArray(original, -1, 1), ['A', 'B', 'C']);
  assert.deepEqual(reorderArray(original, 0, 10), ['A', 'B', 'C']);
});

test('filterSearchExercises filters by query, excludes existing exercises, and caps to limit', () => {
  const db = [
    { id: 'db_1', name: 'Barbell Bench Press', muscle: 'Chest' },
    { id: 'db_2', name: 'Incline Dumbbell Press', muscle: 'Chest' },
    { id: 'db_3', name: 'Barbell Back Squat', muscle: 'Legs' },
    { id: 'db_4', name: 'Pull Ups', muscle: 'Back' },
    { id: 'db_5', name: 'Chest Fly', muscle: 'Chest' }
  ];

  // Search by muscle 'chest', excluding already added 'db_1'
  const existing = [{ id: 'db_1' }];
  const results = filterSearchExercises(db, 'chest', existing, 10);
  assert.equal(results.length, 2);
  assert.equal(results[0].id, 'db_2');
  assert.equal(results[1].id, 'db_5');

  // Search by name substring
  const searchBench = filterSearchExercises(db, 'bench', [], 10);
  assert.equal(searchBench.length, 1);
  assert.equal(searchBench[0].id, 'db_1');

  // Limit enforcement
  const limited = filterSearchExercises(db, '', [], 2);
  assert.equal(limited.length, 2);
});

test('buildCustomExercise creates expected structure with defaults', () => {
  const custom = buildCustomExercise('Incline Hammer Curl', 'Biceps');
  assert.equal(custom.name, 'Incline Hammer Curl');
  assert.equal(custom.shortName, 'Incline Hammer Cur');
  assert.equal(custom.muscle, 'Biceps');
  assert.equal(custom.equipment, 'Free Weights');
  assert.equal(custom.tagline, 'Biceps Move');
  assert.equal(custom.sets.length, 3);
  assert.equal(custom.sets[0].reps, 10);
  assert.equal(custom.sets[0].weight, 20);
  assert.ok(custom.id.startsWith('custom_'));
});

test('resolveSections and filterSections handle default and custom sections', () => {
  const routineWithSections = {
    title: 'Push Day',
    sections: [
      { name: 'Chest Focus', icon: 'Flame', exercises: [{ id: '1' }] },
      { name: 'Shoulders', icon: 'Zap', exercises: [{ id: '2' }] }
    ]
  };

  const sections = resolveSections(routineWithSections, []);
  assert.equal(sections.length, 2);

  const allFiltered = filterSections(sections, 'ALL');
  assert.equal(allFiltered.length, 2);

  const chestOnly = filterSections(sections, 'Chest Focus');
  assert.equal(chestOnly.length, 1);
  assert.equal(chestOnly[0].name, 'Chest Focus');

  // Fallback routine with no sections
  const fallbackRoutine = { title: 'Quick Workout', focus: 'Arms' };
  const fallbackSections = resolveSections(fallbackRoutine, [{ id: 'arm_1' }]);
  assert.equal(fallbackSections.length, 1);
  assert.equal(fallbackSections[0].name, 'Arms');
  assert.equal(fallbackSections[0].exercises.length, 1);
});

test('createSetPayload normalizes input parameters safely', () => {
  const payload = createSetPayload({
    exercise: { id: 'ex_1' },
    sessionId: 'sess_123',
    routineTitle: 'Chest Day',
    reps: ' 12 ',
    weightKg: ' 80.5 '
  });

  assert.equal(payload.sessionId, 'sess_123');
  assert.equal(payload.routineTitle, 'Chest Day');
  assert.equal(payload.reps, '12');
  assert.equal(payload.weightKg, '80.5');
  assert.equal(payload.exercise.id, 'ex_1');
});

test('calculateFinishedWorkoutSummary accurately tallies total volume, duration, and exercise count', () => {
  const sessionSets = [
    { exerciseId: 'bench', reps: 10, weightKg: 100 }, // 1000 kg
    { exerciseId: 'bench', reps: 10, weightKg: 100 }, // 1000 kg
    { exerciseId: 'incline', reps: 8, weightKg: 50 },  // 400 kg
    { exerciseId: 'pushup', reps: 20, weightKg: 0 }    // bodyweight -> 0 kg volume
  ];

  const summary = calculateFinishedWorkoutSummary({
    routineTitle: 'Upper Strength',
    durationSeconds: 2700,
    completedExercises: [{ id: 'bench' }, { id: 'incline' }],
    sessionId: 'session_777',
    sessionSets
  });

  assert.equal(summary.sessionId, 'session_777');
  assert.equal(summary.routineName, 'Upper Strength');
  assert.equal(summary.durationSeconds, 2700);
  assert.equal(summary.exercisesCount, 2);
  assert.equal(summary.totalVolumeKg, 2400); // 1000 + 1000 + 400 + 0 = 2400 kg
});

test('session lifecycle: add exercise, reorder, log sets, derive completion and finish summary', () => {
  // 1. Initial routine exercises
  const baseExercises = [
    { id: 'ex_a', name: 'Exercise A', sets: [{}, {}, {}] },
    { id: 'ex_b', name: 'Exercise B', sets: [{}, {}] }
  ];

  // 2. Add custom exercise
  const customEx = buildCustomExercise('Pull Ups', 'Back');
  let currentList = [...baseExercises, customEx];
  assert.equal(currentList.length, 3);
  assert.equal(currentList[2].name, 'Pull Ups');

  // 3. Reorder: move Pull Ups (index 2) to top (index 0)
  currentList = reorderArray(currentList, 2, 0);
  assert.equal(currentList[0].name, 'Pull Ups');
  assert.equal(currentList[1].name, 'Exercise A');
  assert.equal(currentList[2].name, 'Exercise B');

  // 4. Log sets for Pull Ups and Exercise A
  const sessionSets = [
    { id: 's1', exerciseId: currentList[0].id, reps: 10, weightKg: 0 },
    { id: 's2', exerciseId: currentList[0].id, reps: 10, weightKg: 0 },
    { id: 's3', exerciseId: currentList[0].id, reps: 10, weightKg: 0 },
    { id: 's4', exerciseId: 'ex_a', reps: 8, weightKg: 60 }
  ];

  // 5. Derive stats
  const stats = calculateCompletedStats(currentList, sessionSets);
  assert.equal(stats.completedExerciseIds[currentList[0].id], true); // 3 of 3 sets done
  assert.equal(stats.completedExerciseIds['ex_a'], false);          // 1 of 3 sets done
  assert.equal(stats.completedExerciseIds['ex_b'], false);          // 0 of 2 sets done
  assert.equal(stats.completedCount, 1);
  assert.equal(stats.percentComplete, 33);

  // 6. Finish workout summary
  const completedList = currentList.filter(ex => getSetsForExercise(sessionSets, ex.id).length > 0);
  assert.equal(completedList.length, 2);

  const summary = calculateFinishedWorkoutSummary({
    routineTitle: 'Custom Mix',
    durationSeconds: 1500,
    completedExercises: completedList,
    sessionId: 'test_session',
    sessionSets
  });

  assert.equal(summary.exercisesCount, 2);
  assert.equal(summary.totalVolumeKg, 480); // 8 * 60 = 480 kg
});
