// LIFT Fitness Mobile App - SDK 57 (Reloaded: 2026-09-22T05:48:40)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Dumbbell, Activity, User, Trophy } from 'lucide-react-native';
import {
  useFonts,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold
} from '@expo-google-fonts/manrope';

import { FIREBASE_CONFIG } from './src/config/firebase';
import {
  getUserProfileFromFirestore,
  getUserWorkoutsFromFirestore,
  getUserDailyStatusesFromFirestore,
  getCompletedSetsFromFirestore
} from './src/services/firestore';
import {
  saveUserSession,
  loadUserSession,
  clearUserSession,
  saveLocalUserProfile,
  loadLocalUserProfile,
  persistDailyStatuses,
  loadDailyStatuses,
  persistWorkoutHistory,
  loadWorkoutHistory,
  loadCompletedSets,
  persistCompletedSets
} from './src/services/sessionStorage';
import { rememberFirebaseTokens, clearFirebaseTokens } from './src/services/firebaseAuthTokens';
import {
  SyncOperationType,
  enqueueOperation,
  requestQueueDrain,
  startSyncLifecycleListeners,
  stopSyncLifecycleListeners
} from './src/services/sync';
import { createCompletedSet, mergeCompletedSets, totalVolumeKg } from './src/data/completedSets.mjs';
import { WEEKLY_ROUTINES_DB } from './src/data/exercisesDb';
import { onboardingRoute } from './src/data/onboardingRoute.mjs';
import { VideoSplashScreen } from './src/screens/VideoSplashScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ConsistencyScreen } from './src/screens/ConsistencyScreen';
import { ExerciseVideosScreen } from './src/screens/ExerciseVideosScreen';

import { WorkoutPreviewModal } from './src/modals/WorkoutPreviewModal';
import { PaywallModal } from './src/modals/PaywallModal';

function MainApp() {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top, Platform.OS === 'ios' ? 47 : (StatusBar.currentHeight || 24));

  // App Navigation Flow: 'AUTH' | 'ONBOARDING' | 'MAIN'
  const [showVideoIntro, setShowVideoIntro] = useState(false);
  const [appScreen, setAppScreen] = useState('AUTH');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedExerciseRoutine, setSelectedExerciseRoutine] = useState(null);



  // User Profile & Authentication State
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isFinishingOnboardingRef = useRef(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showConsistency, setShowConsistency] = useState(false);
  const [consistencyFocusedDateKey, setConsistencyFocusedDateKey] = useState(null);
  const [userAvatar, setUserAvatar] = useState(require('./assets/athlete_hero.jpg'));
  const [dailyWorkoutStatuses, setDailyWorkoutStatuses] = useState({});
  const [activeWorkoutProgress, setActiveWorkoutProgress] = useState(null);
  const [selectedPreviewRoutine, setSelectedPreviewRoutine] = useState(null);

  const handleOpenConsistency = (targetDateKey = null) => {
    setConsistencyFocusedDateKey(targetDateKey || null);
    setShowConsistency(true);
  };

  const navigateToTab = (tab) => {
    if (tab === 'rank' || tab === 'leaderboard') {
      setCurrentTab('rank');
      return;
    }
    if (tab === 'exercises' || tab === 'videos') {
      setSelectedExerciseRoutine(null);
      setCurrentTab('videos');
      return;
    }
    if (tab === 'workouts') {
      setCurrentTab('home');
      return;
    }
    setCurrentTab(tab);
    if (tab === 'analytics') {
      setShowPaywall(true);
    }
  };

  // Onboarding Step State
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [unitWeight, setUnitWeight] = useState('kg');
  const [unitDistance, setUnitDistance] = useState('kilometers');
  const [unitBody, setUnitBody] = useState('cm');
  const [userGender, setUserGender] = useState('male');
  const [birthDay, setBirthDay] = useState(23);
  const [birthMonth, setBirthMonth] = useState('August');
  const [birthYear, setBirthYear] = useState(2008);
  const [userWeight, setUserWeight] = useState(72.0);
  const [userHeightCm, setUserHeightCm] = useState(170);
  const [topGoal, setTopGoal] = useState('build_muscle');
  const [trainingExperience, setTrainingExperience] = useState('beginner');
  const [workoutGuidance, setWorkoutGuidance] = useState('build_own');
  const [fitnessGoals, setFitnessGoals] = useState(['Build Muscle']);

  // Real Reactive Workout History (Starts empty for fresh accounts)
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);

  const syncCompletedSets = async (uid) => {
    const local = await loadCompletedSets(uid);
    setCompletedSets(local);
    try {
      const cloud = await getCompletedSetsFromFirestore(uid);
      const merged = mergeCompletedSets(local, cloud);
      await persistCompletedSets(merged, uid);
      setCompletedSets(merged);

      // Queue any unsynced local sets for reliable persistent upload
      const unsynced = merged.filter(set => !set.synced);
      if (unsynced.length > 0) {
        for (const item of unsynced) {
          await enqueueOperation({
            operationType: SyncOperationType.UPSERT_COMPLETED_SET,
            entityId: item.id,
            userId: uid,
            payload: item
          });
        }
        requestQueueDrain(uid);
      }
    } catch (error) {
      console.log('Set cloud load pending:', error.message);
    }
  };

  const handleLogCompletedSet = async ({ exercise, sessionId, routineTitle, reps, weightKg }) => {
    const targetUid = firebaseUid || userEmail || 'guest';
    const sid = sessionId || `session-${Date.now()}`;
    const record = createCompletedSet({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
      sessionId: sid,
      exercise,
      routineTitle: routineTitle || '',
      reps,
      weightKg,
      loggedAt: new Date().toISOString()
    });
    const local = await loadCompletedSets(targetUid);
    const next = mergeCompletedSets([record, ...local]);
    await persistCompletedSets(next, targetUid);
    setCompletedSets(next);

    if (firebaseUid) {
      await enqueueOperation({
        operationType: SyncOperationType.UPSERT_COMPLETED_SET,
        entityId: record.id,
        userId: firebaseUid,
        payload: record
      });
      requestQueueDrain(firebaseUid);
      return { record, queued: true };
    }
    return { record, synced: false };
  };

  const handleLogCompletedBatchSets = async ({ exercise, sessionId, routineTitle, setsCount = 3, reps = 10, weightKg = 0 }) => {
    const targetUid = firebaseUid || userEmail || 'guest';
    const effectiveSetsCount = Math.max(1, Math.min(20, Number(setsCount) || 1));
    const sid = sessionId || `session-${Date.now()}`;
    const baseTime = Date.now();
    const records = [];

    for (let i = 0; i < effectiveSetsCount; i++) {
      const record = createCompletedSet({
        id: `${baseTime}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        sessionId: sid,
        exercise,
        routineTitle: routineTitle || '',
        reps,
        weightKg,
        loggedAt: new Date(baseTime + i * 1000).toISOString()
      });
      records.push(record);
    }

    const local = await loadCompletedSets(targetUid);
    const next = mergeCompletedSets([...records, ...local]);
    await persistCompletedSets(next, targetUid);
    setCompletedSets(next);

    if (firebaseUid) {
      for (const r of records) {
        await enqueueOperation({
          operationType: SyncOperationType.UPSERT_COMPLETED_SET,
          entityId: r.id,
          userId: firebaseUid,
          payload: r
        });
      }
      requestQueueDrain(firebaseUid);
    }

    return { records, count: records.length, sessionId: sid };
  };

  const applyProfile = (profile = {}) => {
    setUnitWeight(profile.unitWeight || 'kg');
    setUnitDistance(profile.unitDistance || 'kilometers');
    setUnitBody(profile.unitBody || 'cm');
    setUserGender(profile.gender || 'male');
    setBirthDay(profile.birthDay ?? 23);
    setBirthMonth(profile.birthMonth || 'August');
    setBirthYear(profile.birthYear ?? 2008);
    setUserWeight(profile.weight ?? 72);
    setUserHeightCm(profile.height ?? 170);
    setTopGoal(profile.topGoal || 'build_muscle');
    setTrainingExperience(profile.experience || 'beginner');
    setWorkoutGuidance(profile.guidance || 'build_own');
    setFitnessGoals(Array.isArray(profile.fitnessGoals) && profile.fitnessGoals.length ? profile.fitnessGoals : ['Build Muscle']);
  };

  // 🔍 1. App Startup: Check Existing Persistent Session
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const session = await loadUserSession();
        if (session && session.isLoggedIn && session.userName) {
          let safeName = session.userName ? session.userName.slice(0, 24) : 'Athlete';
          if (safeName === 'ahmad muaa' && session.userEmail?.includes('ahmadmuaaz')) {
            safeName = 'ahmad muaaz';
          }
          const uid = session.firebaseUid || session.userEmail || 'guest';
          setFirebaseUid(session.firebaseUid || null);
          setUserName(safeName);
          setNameInput(safeName);
          setUserEmail(session.userEmail || '');
          if (session.userAvatar) {
            setUserAvatar(session.userAvatar);
          }
          if (session.dailyWorkoutStatuses) {
            setDailyWorkoutStatuses(session.dailyWorkoutStatuses);
          }
          if (session.workoutHistory) {
            setWorkoutHistory(session.workoutHistory);
          }
          const localProfile = await loadLocalUserProfile(uid);
          await syncCompletedSets(uid);
          applyProfile(localProfile || session);
          const route = onboardingRoute({ localProfile, session });
          setOnboardingStep(1);
          setAppScreen(route);
          setIsCheckingSession(false);

          if (session.firebaseUid) {
            startSyncLifecycleListeners(session.firebaseUid);
            requestQueueDrain(session.firebaseUid);
          }

          // Non-blocking background sync with Cloud Firestore
          (async () => {
            try {
              const cloudWorkouts = await getUserWorkoutsFromFirestore(uid);
              if (cloudWorkouts && cloudWorkouts.length > 0) {
                setWorkoutHistory(cloudWorkouts);
                await persistWorkoutHistory(cloudWorkouts, uid);
              }
              const cloudStatuses = await getUserDailyStatusesFromFirestore(uid);
              if (cloudStatuses && Object.keys(cloudStatuses).length > 0) {
                setDailyWorkoutStatuses(cloudStatuses);
                await persistDailyStatuses(cloudStatuses, uid);
              }
            } catch (e) {
              console.log('Background Firestore sync error:', e);
            }
          })();
        } else {
          // No active session -> Show Auth Screen
          setAppScreen('AUTH');
          setIsCheckingSession(false);
        }
      } catch (err) {
        console.log('Error verifying session:', err);
        setAppScreen('AUTH');
        setIsCheckingSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkExistingSession();

    return () => {
      stopSyncLifecycleListeners();
    };
  }, []);

  // Update Daily Status and Persist
  const handleUpdateDailyStatus = (dateStr, status) => {
    setDailyWorkoutStatuses((prev) => {
      const next = { ...prev, [dateStr]: status };
      const activeUid = firebaseUid || 'guest';
      persistDailyStatuses(next, activeUid);
      if (firebaseUid) {
        enqueueOperation({
          operationType: SyncOperationType.UPSERT_DAILY_STATUSES,
          entityId: 'daily_statuses',
          userId: firebaseUid,
          payload: next
        }).then(() => requestQueueDrain(firebaseUid));
      }
      return next;
    });

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (dateStr === todayKey) {
      if (status === 'completed' || status === 'missed' || status === 'unmarked') {
        setActiveWorkoutProgress(null);
      }
    }
  };

  const handleResumeWorkout = () => {
    if (activeWorkoutProgress?.routine) {
      setSelectedPreviewRoutine(activeWorkoutProgress.routine);
    }
  };

  const finishAuthenticatedLogin = async ({ uid, email, name, idToken, refreshToken, expiresIn, isNewUser }) => {
    await rememberFirebaseTokens(uid, idToken, refreshToken, expiresIn);
    await syncCompletedSets(uid);
    const safeName = (name || email.split('@')[0] || 'Athlete').trim().slice(0, 24);
    setFirebaseUid(uid);
    startSyncLifecycleListeners(uid);
    requestQueueDrain(uid);
    setUserEmail(email);
    setUserName(safeName);
    setNameInput(safeName);
    setOnboardingStep(1);
    setCurrentTab('home');
    setSelectedExerciseRoutine(null);
    setSelectedPreviewRoutine(null);
    setShowConsistency(false);

    const localProfile = await loadLocalUserProfile(uid);
    const cloudProfile = await getUserProfileFromFirestore(uid, idToken);
    let profile = { ...localProfile };
    for (const [key, value] of Object.entries(cloudProfile || {})) {
      if (value !== null && value !== undefined && (!Array.isArray(value) || value.length)) profile[key] = value;
    }
    const route = onboardingRoute({ isNewUser, localProfile: profile });
    if (!profile.onboardingStatus) {
      profile = { ...profile, onboardingStatus: route === 'ONBOARDING' ? 'pending' : 'skipped' };
      await saveLocalUserProfile(uid, profile);
    }
    setUserName(profile.name || safeName);
    setNameInput(profile.name || safeName);
    applyProfile(profile);
    const avatar = profile.userAvatar || require('./assets/athlete_hero.jpg');
    setUserAvatar(avatar);

    const userHistory = await loadWorkoutHistory(uid);
    const userStatuses = await loadDailyStatuses(uid);
    setWorkoutHistory(userHistory || []);
    setDailyWorkoutStatuses(userStatuses || {});
    try {
      const [cloudWorkouts, cloudStatuses] = await Promise.all([
        getUserWorkoutsFromFirestore(uid), getUserDailyStatusesFromFirestore(uid)
      ]);
      if (cloudWorkouts?.length) {
        setWorkoutHistory(cloudWorkouts);
        await persistWorkoutHistory(cloudWorkouts, uid);
      }
      if (cloudStatuses && Object.keys(cloudStatuses).length) {
        setDailyWorkoutStatuses(cloudStatuses);
        await persistDailyStatuses(cloudStatuses, uid);
      }
    } catch (error) {
      console.log('Could not sync workout history:', error);
    }

    const savedSession = await saveUserSession({
      ...profile,
      firebaseUid: uid,
      userName: profile.name || safeName,
      userEmail: email,
      userAvatar: avatar,
      onboardingStatus: profile.onboardingStatus
    });
    if (!savedSession) throw new Error('Unable to save your sign-in on this device.');
    setAppScreen(route);
  };

  // Fast Account Login (Google Flow) — syncs with live Firebase Auth
  const handleQuickLogin = async (selectedEmail, selectedName, googleAccessToken = null) => {
    setIsSigningIn(true);
    try {
      if (!googleAccessToken) throw new Error('Google sign-in did not return an access token.');
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_CONFIG.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postBody: `access_token=${encodeURIComponent(googleAccessToken)}&providerId=google.com`,
          requestUri: 'http://localhost',
          returnSecureToken: true,
          returnIdpCredential: true
        })
      });
      const data = await res.json();
      if (!res.ok || !data.localId || !data.idToken) throw new Error(data.error?.message || 'Google authentication failed.');
      await finishAuthenticatedLogin({
        uid: data.localId,
        email: data.email || selectedEmail,
        name: selectedName,
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        isNewUser: data.isNewUser === true
      });
    } catch (error) {
      Alert.alert('Sign-in failed', error.message || 'Please try Google sign-in again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Live Firebase Email & Password REST Auth
  const handleFirebaseEmailAuth = async (isSignUp = false, customUsername = '') => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Missing Information', 'Please enter both your email address and password.');
      return;
    }

    setIsSigningIn(true);
    try {
      const endpoint = isSignUp ? 'signUp' : 'signInWithPassword';
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${FIREBASE_CONFIG.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), password: passwordInput.trim(), returnSecureToken: true })
      });
      const data = await res.json();
      if (!res.ok || !data.localId || !data.idToken) throw new Error(data.error?.message || 'Authentication failed.');
      await finishAuthenticatedLogin({
        uid: data.localId,
        email: data.email || emailInput.trim(),
        name: customUsername?.trim() || emailInput.split('@')[0],
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        isNewUser: isSignUp
      });
    } catch (error) {
      Alert.alert('Authentication error', error.message || 'Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Finish Onboarding & Save Profile
  const handleFinishOnboarding = async () => {
    if (isFinishingOnboardingRef.current) return;
    if (!nameInput.trim()) {
      Alert.alert('Please enter your name', 'Your AI coach needs your name to personalize your workouts.');
      return;
    }
    if (!firebaseUid) {
      Alert.alert('Sign-in required', 'Please sign in again before saving your profile.');
      setAppScreen('AUTH');
      return;
    }
    isFinishingOnboardingRef.current = true;
    const finalName = nameInput.trim().slice(0, 24);
    const effectiveUid = firebaseUid;
    const profilePayload = {
      firebaseUid: effectiveUid,
      userName: finalName,
      name: finalName,
      username: finalName,
      email: userEmail,
      userEmail: userEmail,
      userAvatar: userAvatar,
      unitWeight,
      unitDistance,
      unitBody,
      gender: userGender,
      birthDay,
      birthMonth,
      birthYear,
      weight: userWeight,
      height: userHeightCm,
      topGoal,
      experience: trainingExperience,
      guidance: workoutGuidance,
      fitnessGoals,
      onboardingStatus: 'completed',
      onboardingCompletedAt: new Date().toISOString()
    };
    try {
      const previous = await loadLocalUserProfile(effectiveUid);
      const completeProfile = { ...previous, ...profilePayload, createdAt: previous?.createdAt || new Date().toISOString() };
      await saveLocalUserProfile(effectiveUid, completeProfile);
      const savedSession = await saveUserSession(completeProfile);
      if (!savedSession) throw new Error('Session could not be saved');
      setUserName(finalName);
      setAppScreen('MAIN');

      if (effectiveUid) {
        enqueueOperation({
          operationType: SyncOperationType.UPDATE_PROFILE,
          entityId: 'profile',
          userId: effectiveUid,
          payload: completeProfile
        }).then(() => requestQueueDrain(effectiveUid));
      }
    } catch (error) {
      Alert.alert('Could not save profile', 'Please try again. Your answers have not been discarded.');
    } finally {
      isFinishingOnboardingRef.current = false;
    }
  };

  // Log Out Handler
  const handleLogOut = async () => {
    stopSyncLifecycleListeners();
    await clearUserSession();
    await clearFirebaseTokens();
    setUserName('');
    setNameInput('');
    setUserEmail('');
    setFirebaseUid(null);
    applyProfile({});
    setUserAvatar(require('./assets/athlete_hero.jpg'));
    setWorkoutHistory([]);
    setCompletedSets([]);
    setDailyWorkoutStatuses({});
    setActiveWorkoutProgress(null);
    setCurrentTab('home');
    setSelectedExerciseRoutine(null);
    setSelectedPreviewRoutine(null);
    setShowConsistency(false);
    setAppScreen('AUTH');
  };

  // Profile In-Place Update Handler (Persists Name, Biometrics, Goals)
  const handleUpdateProfile = async (updates) => {
    if (!updates) return;
    const activeUid = firebaseUid || userEmail || 'guest';
    if (updates.name !== undefined) {
      setUserName(updates.name);
      setNameInput(updates.name);
    }
    if (updates.weight !== undefined) setUserWeight(Number(updates.weight));
    if (updates.height !== undefined) setUserHeightCm(Number(updates.height));
    if (updates.gender !== undefined) setUserGender(updates.gender);
    if (updates.topGoal !== undefined) {
      setTopGoal(updates.topGoal);
      const goalLabels = {
        build_muscle: 'Build Muscle',
        gain_strength: 'Gain Strength',
        fat_loss: 'Fat Loss'
      };
      if (goalLabels[updates.topGoal]) {
        setFitnessGoals([goalLabels[updates.topGoal]]);
      }
    }
    if (updates.experience !== undefined) setTrainingExperience(updates.experience);
    if (updates.guidance !== undefined) setWorkoutGuidance(updates.guidance);

    if (activeUid) {
      const currentProfile = (await loadLocalUserProfile(activeUid)) || {};
      const updatedProfile = {
        ...currentProfile,
        name: updates.name !== undefined ? updates.name : (currentProfile.name || userName),
        weight: updates.weight !== undefined ? Number(updates.weight) : (currentProfile.weight || userWeight),
        height: updates.height !== undefined ? Number(updates.height) : (currentProfile.height || userHeightCm),
        gender: updates.gender !== undefined ? updates.gender : (currentProfile.gender || userGender),
        topGoal: updates.topGoal !== undefined ? updates.topGoal : (currentProfile.topGoal || topGoal),
        experience: updates.experience !== undefined ? updates.experience : (currentProfile.experience || trainingExperience),
        guidance: updates.guidance !== undefined ? updates.guidance : (currentProfile.guidance || workoutGuidance)
      };
      await saveLocalUserProfile(activeUid, updatedProfile);
      await saveUserSession(updatedProfile);
      await enqueueOperation({
        operationType: SyncOperationType.UPDATE_PROFILE,
        entityId: 'profile',
        userId: activeUid,
        payload: updatedProfile
      });
      requestQueueDrain(activeUid);
    }
  };

  const startWorkout = (routine) => {
    setSelectedPreviewRoutine(routine || WEEKLY_ROUTINES_DB[0]);
  };

  // =========================================================================
  // 🎬 0. ANIMATED INTRO VIDEO SPLASH SCREEN
  // =========================================================================
  if (showVideoIntro && Platform.OS !== 'web') {
    return (
      <VideoSplashScreen
        onFinish={() => {
          setShowVideoIntro(false);
        }}
      />
    );
  }

  // =========================================================================
  // ⚡ 1. SESSION CHECKING LOADING STATE
  // =========================================================================
  if (isCheckingSession) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <LinearGradient
          colors={['#000000', '#000000', '#180000', '#3A0000', '#5C0000']}
          locations={[0, 0.42, 0.68, 0.86, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.splashContent}>
          <Text style={styles.splashLogoText}>L I F T</Text>
          <Text style={styles.splashSubText}>ATHLETIC INTELLIGENCE</Text>
          <ActivityIndicator size="small" color="#DC2626" style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  // =========================================================================
  // 🔐 1. AUTHENTICATION & LOGIN SCREEN
  // =========================================================================
  if (appScreen === 'AUTH') {
    return (
      <AuthScreen
        onQuickLogin={handleQuickLogin}
        onFirebaseEmailAuth={handleFirebaseEmailAuth}
        isSigningIn={isSigningIn}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
      />
    );
  }

  // =========================================================================
  // 📋 2. ONBOARDING & PROFILE SETUP FLOW
  // =========================================================================
  if (appScreen === 'ONBOARDING') {
    return (
      <OnboardingScreen
        onboardingStep={onboardingStep}
        setOnboardingStep={setOnboardingStep}
        unitWeight={unitWeight}
        setUnitWeight={setUnitWeight}
        unitDistance={unitDistance}
        setUnitDistance={setUnitDistance}
        unitBody={unitBody}
        setUnitBody={setUnitBody}
        userGender={userGender}
        setUserGender={setUserGender}
        birthDay={birthDay}
        setBirthDay={setBirthDay}
        birthMonth={birthMonth}
        setBirthMonth={setBirthMonth}
        birthYear={birthYear}
        setBirthYear={setBirthYear}
        userWeight={userWeight}
        setUserWeight={setUserWeight}
        userHeightCm={userHeightCm}
        setUserHeightCm={setUserHeightCm}
        topGoal={topGoal}
        setTopGoal={setTopGoal}
        trainingExperience={trainingExperience}
        setTrainingExperience={setTrainingExperience}
        workoutGuidance={workoutGuidance}
        setWorkoutGuidance={setWorkoutGuidance}
        fitnessGoals={fitnessGoals}
        setFitnessGoals={setFitnessGoals}
        nameInput={nameInput}
        setNameInput={setNameInput}
        onFinishOnboarding={handleFinishOnboarding}
        onBackToAuth={() => setAppScreen('AUTH')}
      />
    );
  }

  // =========================================================================
  // 🏠 3. MAIN APPLICATION TABS (HOME, WORKOUTS, EXERCISES, PROFILE)
  // =========================================================================
  const activeUid = firebaseUid || userEmail || 'guest';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* CONSISTENCY TRACKER SCREEN */}
      {showConsistency ? (
        <ConsistencyScreen
          programName={topGoal ? topGoal.replace(/_/g, ' ').toUpperCase() : 'HYPERTROPHY'}
          dailyWorkoutStatuses={dailyWorkoutStatuses}
          focusedDateKey={consistencyFocusedDateKey}
          onUpdateDailyStatus={handleUpdateDailyStatus}
          onOpenWorkoutRoutine={(routine) => {
            setShowConsistency(false);
            setSelectedPreviewRoutine(routine);
          }}
          onBack={() => {
            setShowConsistency(false);
            setConsistencyFocusedDateKey(null);
          }}
        />
      ) : (
        <>
          {/* DASHBOARD TAB */}
          {currentTab === 'home' && (
            <HomeScreen
              userName={userName}
              userAvatar={userAvatar}
              onUpdateAvatar={async (newAvatar) => {
                setUserAvatar(newAvatar);
                await saveUserSession({
                  firebaseUid,
                  userName,
                  userEmail,
                  userAvatar: newAvatar
                });
              }}
              workoutHistory={workoutHistory}
              activeWorkoutProgress={activeWorkoutProgress}
              dailyWorkoutStatuses={dailyWorkoutStatuses}
              onUpdateDailyStatus={handleUpdateDailyStatus}
              onNavigateTab={navigateToTab}
              onStartWorkout={startWorkout}
              onPreviewWorkout={(routine) => setSelectedPreviewRoutine(routine)}
              onResumeWorkout={handleResumeWorkout}
              onSelectMuscle={() => {
                setSelectedExerciseRoutine(null);
                setCurrentTab('videos');
              }}
              onOpenRoutineExercises={(routine) => {
                setSelectedExerciseRoutine(routine);
                setCurrentTab('videos');
              }}
              onOpenConsistency={handleOpenConsistency}
              onReplayIntroVideo={() => setShowVideoIntro(true)}
            />
          )}

          {/* 🏆 ARENA / LEADERBOARD TAB */}
          {currentTab === 'rank' && (
            <LeaderboardScreen
              userName={userName}
              userAvatar={userAvatar}
              completedSets={completedSets}
              dailyWorkoutStatuses={dailyWorkoutStatuses}
            />
          )}

          {/* 📈 PERFORMANCE STUDIO / ANALYTICS TAB */}
          {currentTab === 'analytics' && (
            <AnalyticsScreen
              userId={activeUid}
              userName={userName}
              workoutHistory={workoutHistory}
              completedSets={completedSets}
              dailyWorkoutStatuses={dailyWorkoutStatuses}
              onStartWorkout={startWorkout}
              onOpenPaywall={() => setShowPaywall(true)}
            />
          )}

          {/* 🎬 EXERCISE VIDEOS TAB */}
          {currentTab === 'videos' && (
            <ExerciseVideosScreen
              routine={selectedExerciseRoutine}
              userId={activeUid}
              completedSets={completedSets}
              onLogSet={handleLogCompletedSet}
              onLogBatchSets={handleLogCompletedBatchSets}
              onStartWorkout={(routine) => setSelectedPreviewRoutine(routine)}
              onFinishWorkout={({ routineTitle, durationSeconds, exercisesCompleted, completedExercises, sessionId }) => {
                const now = new Date();
                const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                handleUpdateDailyStatus(todayDateKey, 'completed');

                const sessionSets = completedSets.filter(set =>
                  (sessionId && set.sessionId === sessionId) ||
                  (Date.now() - Date.parse(set.loggedAt) < 7200000)
                );
                const volume = totalVolumeKg(sessionSets);

                const finishedWorkout = {
                  id: String(Date.now()),
                  date: now.toISOString(),
                  routineName: routineTitle || 'Workout Session',
                  durationSeconds: durationSeconds || 1800,
                  exercisesCount: exercisesCompleted || completedExercises?.length || 1,
                  completedExercises: completedExercises || [],
                  totalVolumeKg: volume
                };

                setWorkoutHistory((prev) => {
                  const next = [finishedWorkout, ...prev];
                  persistWorkoutHistory(next, activeUid);
                  return next;
                });

                if (activeUid) {
                  const workoutPayload = {
                    id: finishedWorkout.id,
                    routineName: finishedWorkout.routineName,
                    durationSeconds: finishedWorkout.durationSeconds,
                    exercisesCount: finishedWorkout.exercisesCount,
                    totalVolumeKg: finishedWorkout.totalVolumeKg,
                    date: finishedWorkout.date
                  };
                  enqueueOperation({
                    operationType: SyncOperationType.UPSERT_WORKOUT,
                    entityId: finishedWorkout.id,
                    userId: activeUid,
                    payload: workoutPayload
                  }).then(() => requestQueueDrain(activeUid));
                }
              }}
              onClearRoutine={() => setSelectedExerciseRoutine(null)}
            />
          )}

          {/* PROFILE TAB */}
          {currentTab === 'profile' && (
            <ProfileScreen
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
              userWeight={userWeight}
              userHeightCm={userHeightCm}
              userGender={userGender}
              birthDay={birthDay}
              birthMonth={birthMonth}
              birthYear={birthYear}
              trainingExperience={trainingExperience}
              topGoal={topGoal}
              workoutGuidance={workoutGuidance}
              fitnessGoals={fitnessGoals}
              unitWeight={unitWeight}
              unitDistance={unitDistance}
              unitBody={unitBody}
              workoutHistory={workoutHistory}
              completedSets={completedSets}
              dailyWorkoutStatuses={dailyWorkoutStatuses}
              onUpdateAvatar={async (newAvatar) => {
                setUserAvatar(newAvatar);
                await saveUserSession({
                  firebaseUid,
                  userName,
                  userEmail,
                  userAvatar: newAvatar
                });
              }}
              onUpdateUnits={async ({ unitWeight: newWeight, unitDistance: newDist, unitBody: newBody }) => {
                if (newWeight) setUnitWeight(newWeight);
                if (newDist) setUnitDistance(newDist);
                if (newBody) setUnitBody(newBody);
                if (activeUid) {
                  const currentProfile = (await loadLocalUserProfile(activeUid)) || {};
                  const updatedProfile = {
                    ...currentProfile,
                    unitWeight: newWeight || currentProfile.unitWeight || unitWeight,
                    unitDistance: newDist || currentProfile.unitDistance || unitDistance,
                    unitBody: newBody || currentProfile.unitBody || unitBody
                  };
                  await saveLocalUserProfile(activeUid, updatedProfile);
                  await saveUserSession(updatedProfile);
                  if (firebaseUid) {
                    enqueueOperation({
                      operationType: SyncOperationType.UPDATE_PROFILE,
                      entityId: 'profile',
                      userId: firebaseUid,
                      payload: updatedProfile
                    }).then(() => requestQueueDrain(firebaseUid));
                  }
                }
              }}
              onUpdateProfile={handleUpdateProfile}
              onOpenPaywall={() => setShowPaywall(true)}
              onReplayIntroVideo={() => setShowVideoIntro(true)}
              onLogOut={handleLogOut}
            />
          )}
        </>
      )}

      {/* MODAL: WORKOUT PREVIEW & DETAILS */}
      {!!selectedPreviewRoutine && (
        <WorkoutPreviewModal
          visible={!!selectedPreviewRoutine}
          routine={selectedPreviewRoutine}
          savedProgress={activeWorkoutProgress}
          completedSets={completedSets}
          userId={activeUid}
          onLogSet={handleLogCompletedSet}
          onLogBatchSets={handleLogCompletedBatchSets}
          onSelectRoutine={(r) => setSelectedPreviewRoutine(r)}
        onClose={() => setSelectedPreviewRoutine(null)}
        onSaveProgress={(progress) => {
          setActiveWorkoutProgress(progress);
          const now = new Date();
          const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          handleUpdateDailyStatus(todayDateKey, 'in_progress');
        }}
        onFinishWorkout={({ routineTitle, durationSeconds, exercisesCompleted, completedExercises, sessionId }) => {
          setActiveWorkoutProgress(null);
          const now = new Date();
          const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          handleUpdateDailyStatus(todayDateKey, 'completed');

          const sessionSets = completedSets.filter(set =>
            (sessionId && set.sessionId === sessionId) ||
            (Date.now() - Date.parse(set.loggedAt) < 7200000)
          );
          const volume = totalVolumeKg(sessionSets);

          const finishedWorkout = {
            id: String(Date.now()),
            date: now.toISOString(),
            routineName: routineTitle || 'Workout Session',
            durationSeconds: durationSeconds || 1800,
            exercisesCount: exercisesCompleted || completedExercises?.length || 1,
            completedExercises: completedExercises || [],
            totalVolumeKg: volume
          };

          setWorkoutHistory((prev) => {
            const next = [finishedWorkout, ...prev];
            persistWorkoutHistory(next, activeUid);
            return next;
          });

          // Sync to Cloud Firestore in background via persistent sync queue
          if (activeUid) {
            const workoutPayload = {
              id: finishedWorkout.id,
              routineName: finishedWorkout.routineName,
              durationSeconds: finishedWorkout.durationSeconds,
              exercisesCount: finishedWorkout.exercisesCount,
              totalVolumeKg: finishedWorkout.totalVolumeKg,
              date: finishedWorkout.date
            };
            enqueueOperation({
              operationType: SyncOperationType.UPSERT_WORKOUT,
              entityId: finishedWorkout.id,
              userId: activeUid,
              payload: workoutPayload
            }).then(() => requestQueueDrain(activeUid));
          }
        }}
      />
      )}

      {/* MODAL: PRO SUBSCRIPTION PAYWALL */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />



      {/* BOTTOM FLOATING DOCK NAVIGATION */}
      {!showConsistency && (
        <View style={[styles.bottomNavContainer, { bottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 12) + 6 : 16 }]}>
          <View style={styles.bottomNav}>
            {/* 1. HOME */}
            <TouchableOpacity
              style={[
                styles.navItem,
                currentTab === 'home' && styles.navItemActive
              ]}
              onPress={() => setCurrentTab('home')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Home tab"
            >
              <Home
                size={20}
                color={currentTab === 'home' ? '#EF4444' : '#71717A'}
                strokeWidth={currentTab === 'home' ? 2.4 : 1.8}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'home' && styles.navLabelActive
                ]}
              >
                Home
              </Text>
              {currentTab === 'home' && <View style={styles.activeNavDot} />}
            </TouchableOpacity>

            {/* 2. EXERCISES (Video library & in-video set logger) */}
            <TouchableOpacity
              style={[
                styles.navItem,
                currentTab === 'videos' && styles.navItemActive
              ]}
              onPress={() => {
                setSelectedExerciseRoutine(null);
                setCurrentTab('videos');
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Exercises tab"
            >
              <Dumbbell
                size={20}
                color={currentTab === 'videos' ? '#EF4444' : '#71717A'}
                strokeWidth={currentTab === 'videos' ? 2.4 : 1.8}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'videos' && styles.navLabelActive
                ]}
              >
                Exercises
              </Text>
              {currentTab === 'videos' && <View style={styles.activeNavDot} />}
            </TouchableOpacity>

            {/* 3. RANK / LEADERBOARD (Heavy Lifters & Daily Consistency) */}
            <TouchableOpacity
              style={[
                styles.navItem,
                currentTab === 'rank' && styles.navItemActive
              ]}
              onPress={() => setCurrentTab('rank')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Leaderboard rank tab"
            >
              <Trophy
                size={20}
                color={currentTab === 'rank' ? '#EF4444' : '#71717A'}
                strokeWidth={currentTab === 'rank' ? 2.4 : 1.8}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'rank' && styles.navLabelActive
                ]}
              >
                Rank
              </Text>
              {currentTab === 'rank' && <View style={styles.activeNavDot} />}
            </TouchableOpacity>

            {/* 4. ANALYTICS (1RM charts, volume & PRs) */}
            <TouchableOpacity
              style={[
                styles.navItem,
                currentTab === 'analytics' && styles.navItemActive
              ]}
              onPress={() => navigateToTab('analytics')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Analytics tab"
            >
              <Activity
                size={20}
                color={currentTab === 'analytics' ? '#EF4444' : '#71717A'}
                strokeWidth={currentTab === 'analytics' ? 2.4 : 1.8}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'analytics' && styles.navLabelActive
                ]}
              >
                Analytics
              </Text>
              {currentTab === 'analytics' && <View style={styles.activeNavDot} />}
            </TouchableOpacity>

            {/* 5. PROFILE */}
            <TouchableOpacity
              style={[
                styles.navItem,
                currentTab === 'profile' && styles.navItemActive
              ]}
              onPress={() => setCurrentTab('profile')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Profile tab"
            >
              <User
                size={20}
                color={currentTab === 'profile' ? '#EF4444' : '#71717A'}
                strokeWidth={currentTab === 'profile' ? 2.4 : 1.8}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'profile' && styles.navLabelActive
                ]}
              >
                Profile
              </Text>
              {currentTab === 'profile' && <View style={styles.activeNavDot} />}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold
  });

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashContent: {
    alignItems: 'center'
  },
  splashLogoText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 10
  },
  splashSubText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 8
  },
  bottomNavContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 99,
    alignItems: 'center'
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 18, 22, 0.94)',
    borderRadius: 28,
    paddingVertical: 7,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 16
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 18,
    minWidth: 50
  },
  navItemActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.10)'
  },
  navLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.2
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  activeNavDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#EF4444',
    marginTop: 2
  }
});
