import test from 'node:test';
import assert from 'node:assert/strict';
import { createCompletedSet, mergeCompletedSets, setsForExerciseSession, analyticsPointsFromSets, totalVolumeKg } from './completedSets.mjs';

const sample = { id: 'set-1', sessionId: 'session-1', exercise: { id: 'chest_1', name: 'Bench Press', muscle: 'Chest' }, routineTitle: 'Chest & Triceps', reps: '10', weightKg: '70', loggedAt: '2026-09-24T10:00:00.000Z' };

test('a submitted set keeps actual reps and weight', () => {
  const set = createCompletedSet(sample);
  assert.equal(set.reps, 10);
  assert.equal(set.weightKg, 70);
  assert.equal(set.source, 'completed_set');
  assert.equal(totalVolumeKg([set]), 700);
  assert.equal(analyticsPointsFromSets([set], 'bench')[0].value, 70);
});

test('bodyweight sets have no invented weight and never become 1RM points', () => {
  const set = createCompletedSet({ ...sample, exercise: { id: 'chest_2', name: 'Push-Up' }, weightKg: '' });
  assert.equal(set.weightKg, 0);
  assert.equal(analyticsPointsFromSets([set], 'bench').length, 0);
});

test('rejects invalid and fabricated-looking set inputs', () => {
  assert.throws(() => createCompletedSet({ ...sample, reps: '1.5' }));
  assert.throws(() => createCompletedSet({ ...sample, reps: '0' }));
  assert.throws(() => createCompletedSet({ ...sample, weightKg: '-1' }));
});

test('merges cloud and local records by stable ID', () => {
  const set = createCompletedSet(sample);
  assert.equal(mergeCompletedSets([set], [{ ...set, synced: true }]).length, 1);
  assert.equal(setsForExerciseSession([set], 'chest_1', 'session-1').length, 1);
  assert.equal(setsForExerciseSession([set], 'chest_1', 'session-2').length, 0);
});
