import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  LogBox
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Dumbbell, List, User } from 'lucide-react-native';

LogBox.ignoreAllLogs(true);

// Modular Imports
import { FIREBASE_CONFIG } from './src/config/firebase';
import { saveUserProfileToFirestore } from './src/services/firestore';
import {
  saveUserSession,
  loadUserSession,
  clearUserSession,
  persistDailyStatuses,
  persistWorkoutHistory
} from './src/services/sessionStorage';
import { C } from './src/constants/theme';
import { EXERCISES_DB, WEEKLY_ROUTINES_DB } from './src/data/exercisesDb';
import { AuthScreen } from './src/screens/AuthScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { ExercisesScreen } from './src/screens/ExercisesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ConsistencyScreen } from './src/screens/ConsistencyScreen';
import { ExerciseDetailModal } from './src/modals/ExerciseDetailModal';
import { WorkoutPreviewModal } from './src/modals/WorkoutPreviewModal';
import { PaywallModal } from './src/modals/PaywallModal';

export default function App() {
  // App Navigation Flow: 'AUTH' | 'ONBOARDING' | 'MAIN'
  const [appScreen, setAppScreen] = useState('AUTH');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');

  // Exercise & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null);

  // User Profile & Authentication State
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [userName, setUserName] = useState('Ahmad Muaaz');
  const [userEmail, setUserEmail] = useState('ahmad.muaaz@gmail.com');
  const [nameInput, setNameInput] = useState('Ahmad Muaaz');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showConsistency, setShowConsistency] = useState(false);
  const [userAvatar, setUserAvatar] = useState(require('./assets/athlete_hero.jpg'));
  const [dailyWorkoutStatuses, setDailyWorkoutStatuses] = useState({});
  const [activeWorkoutProgress, setActiveWorkoutProgress] = useState(null);

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

  // Live Workout State
  const [selectedPreviewRoutine, setSelectedPreviewRoutine] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState(EXERCISES_DB.slice(0, 3));
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  // Real Reactive Workout History
  const [workoutHistory, setWorkoutHistory] = useState([
    {
      id: 'prev-1',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      routineName: 'Push Hypertrophy',
      durationSeconds: 2850,
      exercisesCount: 3,
      totalVolumeKg: 12400
    },
    {
      id: 'prev-2',
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      routineName: 'Pull Strength & Lats',
      durationSeconds: 3100,
      exercisesCount: 3,
      totalVolumeKg: 11500
    }
  ]);

  // 🔍 1. App Startup: Check Existing Persistent Session
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const session = await loadUserSession();
        if (session && session.isLoggedIn && session.userName) {
          setFirebaseUid(session.firebaseUid || null);
          setUserName(session.userName);
          setNameInput(session.userName);
          setUserEmail(session.userEmail || '');
          if (session.userAvatar) {
            setUserAvatar(session.userAvatar);
          }
          if (session.dailyWorkoutStatuses) {
            setDailyWorkoutStatuses(session.dailyWorkoutStatuses);
          }
          if (session.workoutHistory && session.workoutHistory.length > 0) {
            setWorkoutHistory(session.workoutHistory);
          }
          if (session.unitWeight) setUnitWeight(session.unitWeight);
          if (session.topGoal) setTopGoal(session.topGoal);
          if (session.fitnessGoals) setFitnessGoals(session.fitnessGoals);

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

  // Rest Timer
  useEffect(() => {
    let interval;
    if (isResting && restSeconds > 0) {
      interval = setInterval(() => setRestSeconds((prev) => prev - 1), 1000);
    } else if (restSeconds === 0) {
      setIsResting(false);
      setRestSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isResting, restSeconds]);

  // Workout Clock
  useEffect(() => {
    let timer;
    if (isWorkoutActive) {
      timer = setInterval(() => setWorkoutDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutActive]);

  // Fast Account Login (Google Flow)
  const handleQuickLogin = async (selectedEmail, selectedName) => {
    setIsSigningIn(true);
    let uid = null;
    try {
      if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('REPLACE_')) {
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ returnSecureToken: true })
          }
        );
        const data = await res.json();
        if (data.localId) {
          uid = data.localId;
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {}

    const effectiveUid = uid || selectedEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    setUserEmail(selectedEmail);
    setNameInput(selectedName);
    setUserName(selectedName);

    // Save session
    await saveUserSession({
      firebaseUid: effectiveUid,
      userName: selectedName,
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

    const extractedName = customUsername?.trim() || emailInput.split('@')[0] || 'Athlete';
    const effectiveUid = localId || emailInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    setUserEmail(emailInput.trim());
    setNameInput(extractedName);
    setUserName(extractedName);

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
    const finalName = nameInput.trim();
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
    setActiveWorkoutProgress(null);
    setAppScreen('AUTH');
  };

  const startWorkout = (routine) => {
    setSelectedPreviewRoutine(routine || WEEKLY_ROUTINES_DB[0]);
  };

  // =========================================================================
  // ⚡ 0. SPLASH / SESSION LOADING STATE
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* CONSISTENCY TRACKER SCREEN */}
      {showConsistency ? (
        <ConsistencyScreen
          programName={topGoal ? topGoal.replace(/_/g, ' ').toUpperCase() : 'HYPERTROPHY'}
          dailyWorkoutStatuses={dailyWorkoutStatuses}
          onUpdateDailyStatus={handleUpdateDailyStatus}
          onOpenWorkoutRoutine={(routine) => {
            setShowConsistency(false);
            setSelectedPreviewRoutine(routine);
          }}
          onBack={() => setShowConsistency(false)}
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
              onOpenConsistency={() => setShowConsistency(true)}
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
              onOpenConsistency={() => setShowConsistency(true)}
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
        onFinishWorkout={({ routineTitle, durationSeconds, exercisesCompleted }) => {
          setActiveWorkoutProgress(null);
          const now = new Date();
          const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          handleUpdateDailyStatus(todayDateKey, 'completed');

          const finishedWorkout = {
            id: String(Date.now()),
            date: now.toISOString(),
            routineName: routineTitle || 'Workout Session',
            durationSeconds: durationSeconds || 2700,
            exercisesCount: exercisesCompleted || 4,
            totalVolumeKg: 14200
          };
          setWorkoutHistory((prev) => {
            const next = [finishedWorkout, ...prev];
            persistWorkoutHistory(next);
            return next;
          });
        }}
        onSelectExercise={(exercise) => {
          setSelectedExerciseDetail(exercise);
        }}
      />

      {/* MODAL: PRO SUBSCRIPTION PAYWALL */}
      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* MODAL: EXERCISE DETAIL WITH 3D GIF & AUDIO COACH */}
      <ExerciseDetailModal
        exercise={selectedExerciseDetail}
        onClose={() => setSelectedExerciseDetail(null)}
        onStartExercise={() => {
          setSelectedExerciseDetail(null);
          startWorkout();
        }}
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
    </SafeAreaView>
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
