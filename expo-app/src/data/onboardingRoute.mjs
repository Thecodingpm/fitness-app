export function onboardingRoute({ isNewUser = false, localProfile = null, cloudProfile = null, session = null } = {}) {
  const status = localProfile?.onboardingStatus || cloudProfile?.onboardingStatus || session?.onboardingStatus;
  if (status === 'completed' || status === 'skipped') return 'MAIN';
  if (status === 'pending') return 'ONBOARDING';
  // An existing account without a marker predates onboarding routing. Do not
  // unexpectedly ask its owner to answer the setup questions again.
  return isNewUser ? 'ONBOARDING' : 'MAIN';
}
