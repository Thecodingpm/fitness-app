import test from 'node:test';
import assert from 'node:assert/strict';
import { onboardingRoute } from './onboardingRoute.mjs';

test('new account enters onboarding', () => {
  assert.equal(onboardingRoute({ isNewUser: true }), 'ONBOARDING');
});

test('pending onboarding resumes after restart', () => {
  assert.equal(onboardingRoute({ session: { onboardingStatus: 'pending' } }), 'ONBOARDING');
});

test('completed and skipped accounts do not repeat onboarding', () => {
  assert.equal(onboardingRoute({ isNewUser: true, localProfile: { onboardingStatus: 'completed' } }), 'MAIN');
  assert.equal(onboardingRoute({ isNewUser: true, cloudProfile: { onboardingStatus: 'skipped' } }), 'MAIN');
});

test('legacy existing account with no marker remains in the app', () => {
  assert.equal(onboardingRoute({ isNewUser: false }), 'MAIN');
});
