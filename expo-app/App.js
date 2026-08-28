import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  LogBox,
  Platform
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Dumbbell, List, User, TrendingUp } from 'lucide-react-native';

import { FIREBASE_CONFIG } from './src/config/firebase';
import {
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  saveWorkoutToFirestore,
  getUserWorkoutsFromFirestore,
  saveExerciseLogsToFirestore,
  getUserExerciseLogsFromFirestore,
  saveDailyStatusesToFirestore,
  getUserDailyStatusesFromFirestore
} from './src/services/firestore';
import {
  saveUserSession,
  loadUserSession,
  clearUserSession,
  persistDailyStatuses,
  loadDailyStatuses,
  persistWorkoutHistory,
  loadWorkoutHistory,
  persistExerciseLogs,
  loadExerciseLogs
} from './src/services/sessionStorage';
import { C } from './src/constants/theme';
import { EXERCISES_DB, WEEKLY_ROUTINES_DB } from './src/data/exercisesDb';
import { VideoSplashScreen } from './src/screens/VideoSplashScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { ExercisesScreen } from './src/screens/ExercisesScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ConsistencyScreen } from './src/screens/ConsistencyScreen';
import { ExerciseDetailModal } from './src/modals/ExerciseDetailModal';
import { WorkoutPreviewModal } from './src/modals/WorkoutPreviewModal';
import { PaywallModal } from './src/modals/PaywallModal';

function MainApp() {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top, Platform.OS === 'ios' ? 47 : (StatusBar.currentHeight || 24));

  // App Navigation Flow: 'AUTH' | 'ONBOARDING' | 'MAIN'
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [appScreen, setAppScreen] = useState('AUTH');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');

  // Exercise & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null);

  // User Profile & Authentication State
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);
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

  // 🔍 1. App Startup: Check Existing Persistent Session
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const session = await loadUserSession();
        if (session && session.isLoggedIn && session.userName) {
          const safeName = session.userName.slice(0, 10);
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
          if (session.unitWeight) setUnitWeight(session.unitWeight);
          if (session.topGoal) setTopGoal(session.topGoal);
          if (session.fitnessGoals) setFitnessGoals(session.fitnessGoals);

          // Background sync with Cloud Firestore
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

          // User is already authenticated -> Go directly to Home Screen!
          setAppScreen('MAIN');
        } else {
          // No active session -> Show Auth Screen
          setAppScreen('AUTH');
        }
      } catch (err) {
        console.log('Error verifying session:', err);
        setAppScreen('AUTH');
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkExistingSession();
  }, []);

  // Update Daily Status and Persist
  const handleUpdateDailyStatus = (dateStr, status) => {
    setDailyWorkoutStatuses((prev) => {
      const next = { ...prev, [dateStr]: status };
      persistDailyStatuses(next);
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

  // Fast Account Login (Google Flow) — syncs with live Firebase Auth
  const handleQuickLogin = async (selectedEmail, selectedName, googleAccessToken = null) => {
    setIsSigningIn(true);
    let uid = null;
    try {
      if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('REPLACE_')) {
        if (googleAccessToken) {
          // Register Google user directly into Firebase Authentication database
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_CONFIG.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postBody: `access_token=${googleAccessToken}&providerId=google.com`,
                requestUri: 'http://localhost',
                returnSecureToken: true,
                returnIdpCredential: true
              })
            }
          );
          const data = await res.json();
          console.log('🔥 [Firebase Auth] Google User registered/signed-in in Firebase:', data.email, data.localId);
          if (data.localId) {
            uid = data.localId;
            setFirebaseUid(data.localId);
          }
        }
      }
    } catch (e) {
      console.log('🔥 [Firebase Auth] Error registering Google user in Firebase:', e);
    }

    const effectiveUid = uid || selectedEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeName = (selectedName || 'Athlete').slice(0, 10);
    setUserEmail(selectedEmail);
    setNameInput(safeName);
    setUserName(safeName);

    // Load user's scoped local history
    const userHistory = await loadWorkoutHistory(effectiveUid);
    setWorkoutHistory(userHistory || []);
    const userStatuses = await loadDailyStatuses(effectiveUid);
    setDailyWorkoutStatuses(userStatuses || {});

    // Save session
    await saveUserSession({
      firebaseUid: effectiveUid,
      userName: safeName,
      userEmail: selectedEmail,
      userAvatar
    });

    setIsSigningIn(false);
    setOnboardingStep(1);
    setAppScreen('ONBOARDING');
  };

  // Live Firebase Email & Password REST Auth
  const handleFirebaseEmailAuth = async (isSignUp = false, customUsername = '') => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Missing Information', 'Please enter both your email address and password.');
      return;
    }

    setIsSigningIn(true);
    let localId = null;
    try {
      if (FIREBASE_CONFIG.apiKey) {
        const endpoint = isSignUp ? 'signUp' : 'signInWithPassword';
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${FIREBASE_CONFIG.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailInput.trim(),
              password: passwordInput.trim(),
              returnSecureToken: true
            })
          }
        );

        let data = await res.json();

        if (!isSignUp && data.error && (data.error.message.includes('EMAIL_NOT_FOUND') || data.error.message.includes('INVALID_LOGIN_CREDENTIALS'))) {
          const signUpRes = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: emailInput.trim(),
                password: passwordInput.trim(),
                returnSecureToken: true
              })
            }
          );
          const signUpData = await signUpRes.json();
          if (signUpData.localId) {
            data = signUpData;
          }
        }

        if (data.error && !data.localId) {
          setIsSigningIn(false);
          Alert.alert('Authentication Error', data.error.message || 'Please check your password (minimum 6 characters).');
          return;
        }

        if (data.localId) {
          localId = data.localId;
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {
      console.log('Firebase auth network error:', e);
    }

    const extractedName = (customUsername?.trim() || emailInput.split('@')[0] || 'Athlete').slice(0, 10);
    const effectiveUid = localId || emailInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    setUserEmail(emailInput.trim());
    setNameInput(extractedName);
    setUserName(extractedName);

    // Load this specific user's scoped workouts & statuses
    const userHistory = await loadWorkoutHistory(effectiveUid);
    setWorkoutHistory(userHistory || []);
    const userStatuses = await loadDailyStatuses(effectiveUid);
    setDailyWorkoutStatuses(userStatuses || {});

    // Try fetching from Firestore in background
    try {
      const cloudWorkouts = await getUserWorkoutsFromFirestore(effectiveUid);
      if (cloudWorkouts && cloudWorkouts.length > 0) {
        setWorkoutHistory(cloudWorkouts);
        await persistWorkoutHistory(cloudWorkouts, effectiveUid);
      }
      const cloudStatuses = await getUserDailyStatusesFromFirestore(effectiveUid);
      if (cloudStatuses && Object.keys(cloudStatuses).length > 0) {
        setDailyWorkoutStatuses(cloudStatuses);
        await persistDailyStatuses(cloudStatuses, effectiveUid);
      }
    } catch (e) {}

    // If existing returning user logs in (not signup), go directly to MAIN!
    if (!isSignUp) {
      await saveUserSession({
        firebaseUid: effectiveUid,
        userName: extractedName,
        userEmail: emailInput.trim(),
        userAvatar
      });
      setIsSigningIn(false);
      setAppScreen('MAIN');
      return;
    }

    // If fresh signup, proceed to profile onboarding
    setIsSigningIn(false);
    setOnboardingStep(1);
    setAppScreen('ONBOARDING');
  };

  // Finish Onboarding & Save Profile
  const handleFinishOnboarding = async () => {
    if (!nameInput.trim()) {
      Alert.alert('Please enter your name', 'Your AI coach needs your name to personalize your workouts.');
      return;
    }
    const finalName = nameInput.trim().slice(0, 10);
    setUserName(finalName);
    setAppScreen('MAIN');

    const effectiveUid = firebaseUid || userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
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
      createdAt: new Date().toISOString()
    };

    // 💾 Save session locally
    await saveUserSession(profilePayload);

    // 🗄️ Save to Firestore Database
    await saveUserProfileToFirestore(effectiveUid, profilePayload);
  };

  // Log Out Handler
  const handleLogOut = async () => {
    await clearUserSession();
    setUserName('');
    setNameInput('');
    setUserEmail('');
    setFirebaseUid(null);
    setWorkoutHistory([]);
    setDailyWorkoutStatuses({});
    setActiveWorkoutProgress(null);
    setAppScreen('AUTH');
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
              onNavigateTab={setCurrentTab}
              onStartWorkout={startWorkout}
              onPreviewWorkout={(routine) => setSelectedPreviewRoutine(routine)}
              onResumeWorkout={handleResumeWorkout}
              onSelectMuscle={(muscle) => {
                setSelectedMuscle(muscle);
                setCurrentTab('exercises');
              }}
              onOpenConsistency={handleOpenConsistency}
              onReplayIntroVideo={() => setShowVideoIntro(true)}
              onOpenPaywall={() => setShowPaywall(true)}
              isProUnlocked={isProUnlocked}
            />
          )}

          {/* WORKOUTS TAB */}
          {currentTab === 'workouts' && (
            <WorkoutsScreen
              userName={userName}
              activeWorkoutProgress={activeWorkoutProgress}
              dailyWorkoutStatuses={dailyWorkoutStatuses}
              onUpdateDailyStatus={handleUpdateDailyStatus}
              onStartWorkout={(routine) => setSelectedPreviewRoutine(routine)}
              onResumeWorkout={handleResumeWorkout}
              onOpenConsistency={handleOpenConsistency}
            />
          )}

          {/* 3D ANATOMY EXERCISES TAB */}
          {currentTab === 'exercises' && (
            <ExercisesScreen
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedMuscle={selectedMuscle}
              setSelectedMuscle={setSelectedMuscle}
              onSelectExercise={setSelectedExerciseDetail}
            />
          )}

          {/* 📈 PERFORMANCE STUDIO / ANALYTICS TAB */}
          {currentTab === 'analytics' && (
            <AnalyticsScreen
              userId={activeUid}
              userName={userName}
              workoutHistory={workoutHistory}
              dailyWorkoutStatuses={dailyWorkoutStatuses}
              onStartWorkout={startWorkout}
              isProUnlocked={isProUnlocked}
              onOpenPaywall={() => setShowPaywall(true)}
            />
          )}

          {/* PROFILE TAB */}
          {currentTab === 'profile' && (
            <ProfileScreen
              userName={userName}
              userEmail={userEmail}
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
              onEditProfile={() => {
                setOnboardingStep(1);
                setAppScreen('ONBOARDING');
              }}
              onOpenPaywall={() => setShowPaywall(true)}
              onReplayIntroVideo={() => setShowVideoIntro(true)}
              onLogOut={handleLogOut}
            />
          )}
        </>
      )}

      {/* MODAL: WORKOUT PREVIEW & DETAILS */}
      <WorkoutPreviewModal
        visible={!!selectedPreviewRoutine}
        routine={selectedPreviewRoutine}
        savedProgress={activeWorkoutProgress}
        onClose={() => setSelectedPreviewRoutine(null)}
        onSaveProgress={(progress) => {
          setActiveWorkoutProgress(progress);
          const now = new Date();
          const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          handleUpdateDailyStatus(todayDateKey, 'in_progress');
        }}
        onFinishWorkout={async ({ routineTitle, durationSeconds, exercisesCompleted, totalVolumeKg, completedExercises }) => {
          setActiveWorkoutProgress(null);
          const now = new Date();
          const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          handleUpdateDailyStatus(todayDateKey, 'completed');

          const finalVol = totalVolumeKg || 11950;
          const finishedWorkout = {
            id: String(Date.now()),
            date: now.toISOString(),
            routineName: routineTitle || 'Workout Session',
            durationSeconds: durationSeconds || 2700,
            exercisesCount: exercisesCompleted || 4,
            totalVolumeKg: finalVol,
            completedExercises: completedExercises || []
          };

          setWorkoutHistory((prev) => {
            const next = [finishedWorkout, ...prev];
            persistWorkoutHistory(next, activeUid);
            return next;
          });

          // Sync to Cloud Firestore in background
          if (activeUid) {
            saveWorkoutToFirestore(activeUid, {
              title: routineTitle || 'Workout Session',
              durationSeconds: durationSeconds || 2700,
              totalWeight: finalVol,
              unitWeight: 'kg'
            });
          }

          // Automatically record compound lift progression point for this specific user
          try {
            const existingLogs = (await loadExerciseLogs(activeUid)) || {};
            const dateLabel = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;
            const targetLift = routineTitle.toLowerCase().includes('squat') || routineTitle.toLowerCase().includes('leg') ? 'squat' :
                               routineTitle.toLowerCase().includes('pull') || routineTitle.toLowerCase().includes('back') ? 'deadlift' :
                               routineTitle.toLowerCase().includes('shoulder') ? 'press' : 'bench';
            
            const currentPoints = existingLogs[targetLift]?.points || [];
            const lastVal = currentPoints.length > 0 ? currentPoints[currentPoints.length - 1].value : 60;
            const newWeight = lastVal + 2.5;
            
            const updatedPoint = {
              value: newWeight,
              reps: 6,
              label: dateLabel,
              date: `Today · ${dateLabel}`
            };

            const updatedLogs = {
              ...existingLogs,
              [targetLift]: {
                name: targetLift === 'bench' ? 'Barbell Bench Press' : targetLift === 'squat' ? 'Barbell Back Squat' : targetLift === 'deadlift' ? 'Barbell Deadlift' : 'Overhead Military Press',
                baseline: currentPoints.length > 0 ? existingLogs[targetLift].baseline : 60,
                points: [...currentPoints, updatedPoint]
              }
            };
            await persistExerciseLogs(updatedLogs, activeUid);
            saveExerciseLogsToFirestore(activeUid, updatedLogs);
          } catch (err) {
            console.log('Error auto-logging lift point:', err);
          }
        }}
        onSelectExercise={(exercise) => {
          setSelectedExerciseDetail(exercise);
        }}
      />

      {/* MODAL: PRO SUBSCRIPTION PAYWALL */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onProUnlocked={() => setIsProUnlocked(true)}
      />

      {/* MODAL: EXERCISE DETAIL WITH 3D GIF & AUDIO COACH */}
      <ExerciseDetailModal
        exercise={selectedExerciseDetail}
        onClose={() => setSelectedExerciseDetail(null)}
        onStartExercise={() => {
          setSelectedExerciseDetail(null);
          startWorkout();
        }}
        isProUnlocked={isProUnlocked}
        onOpenPaywall={() => setShowPaywall(true)}
      />

      {/* BOTTOM TAB BAR NAVIGATION */}
      {!showConsistency && (
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentTab('home')}
            >
              <Home
                size={22}
                color={currentTab === 'home' ? C.white : C.zinc}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'home' && styles.navLabelActive
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentTab('workouts')}
            >
              <Dumbbell
                size={22}
                color={currentTab === 'workouts' ? C.white : C.zinc}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'workouts' && styles.navLabelActive
                ]}
              >
                Workouts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentTab('analytics')}
            >
              <TrendingUp
                size={22}
                color={currentTab === 'analytics' ? C.white : C.zinc}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'analytics' && styles.navLabelActive
                ]}
              >
                Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentTab('exercises')}
            >
              <List
                size={22}
                color={currentTab === 'exercises' ? C.white : C.zinc}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'exercises' && styles.navLabelActive
                ]}
              >
                Exercises
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentTab('profile')}
            >
              <User
                size={22}
                color={currentTab === 'profile' ? C.white : C.zinc}
              />
              <Text
                style={[
                  styles.navLabel,
                  currentTab === 'profile' && styles.navLabelActive
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: {
    alignItems: 'center',
    gap: 4
  },
  navLabel: {
    color: C.zinc,
    fontSize: 11,
    fontWeight: '700'
  },
  navLabelActive: {
    color: C.white,
    fontWeight: '900'
  }
});
