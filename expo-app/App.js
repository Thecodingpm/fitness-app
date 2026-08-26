import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  LogBox
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Dumbbell, List, User } from 'lucide-react-native';

LogBox.ignoreAllLogs(true);

// Modular Imports
import { FIREBASE_CONFIG } from './src/config/firebase';
import { saveUserProfileToFirestore } from './src/services/firestore';
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

  const handleUpdateDailyStatus = (dateStr, status) => {
    setDailyWorkoutStatuses((prev) => ({
      ...prev,
      [dateStr]: status
    }));
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (dateStr === todayKey) {
      if (status === 'completed' || status === 'missed' || status === 'upcoming') {
        setActiveWorkoutProgress(null);
      }
    }
  };

  const handleResumeWorkout = () => {
    if (activeWorkoutProgress?.routine) {
      setSelectedPreviewRoutine(activeWorkoutProgress.routine);
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

  // Live Workout & Dynamic Schedule State
  const [selectedPreviewRoutine, setSelectedPreviewRoutine] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState(EXERCISES_DB.slice(0, 3));
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  // 📊 Real Reactive Workout History
  const [workoutHistory, setWorkoutHistory] = useState([
    {
      id: 'prev-1',
      date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
      routineName: 'Push Hypertrophy',
      durationSeconds: 2850,
      exercisesCount: 3,
      totalVolumeKg: 12400
    },
    {
      id: 'prev-2',
      date: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
      routineName: 'Pull Strength & Lats',
      durationSeconds: 3100,
      exercisesCount: 3,
      totalVolumeKg: 11500
    }
  ]);

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
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {}

    setUserEmail(selectedEmail);
    setNameInput(selectedName);
    setUserName(selectedName);
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

        // If trying to sign in with an account that doesn't exist yet, auto sign-up
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
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {
      console.log('Firebase auth network error:', e);
    }

    const extractedName = customUsername?.trim() || emailInput.split('@')[0] || 'Athlete';
    setUserEmail(emailInput.trim());
    setNameInput(extractedName);
    setUserName(extractedName);
    setIsSigningIn(false);
    setOnboardingStep(1);
    setAppScreen('ONBOARDING');
  };

  const handleFinishOnboarding = async () => {
    if (!nameInput.trim()) {
      Alert.alert('Please enter your name', 'Your AI coach needs your name to personalize your workouts.');
      return;
    }
    const finalName = nameInput.trim();
    setUserName(finalName);
    setAppScreen('MAIN');

    // 🗄️ Save full athlete profile & selected units to Firestore Database
    const effectiveUid = firebaseUid || userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    await saveUserProfileToFirestore(effectiveUid, {
      name: finalName,
      username: finalName,
      email: userEmail,
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
    });
  };

  const handleLogOut = () => {
    setUserName('');
    setNameInput('');
    setUserEmail('');
    setFirebaseUid(null);
    setAppScreen('AUTH');
  };

  const startWorkout = (routine) => {
    setSelectedPreviewRoutine(routine || WEEKLY_ROUTINES_DB[0]);
  };

  const toggleSetComplete = (setIndex) => {
    const updated = [...workoutExercises];
    const currentSets = updated[currentExIndex].sets;
    currentSets[setIndex].done = !currentSets[setIndex].done;
    setWorkoutExercises(updated);

    if (currentSets[setIndex].done) {
      setRestSeconds(60);
      setIsResting(true);
    }
  };

  const adjustWeight = (setIndex, delta) => {
    const updated = [...workoutExercises];
    const currentSets = updated[currentExIndex].sets;
    currentSets[setIndex].weight = Math.max(2.5, currentSets[setIndex].weight + delta);
    setWorkoutExercises(updated);
  };

  // 1. AUTH SCREEN
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

  // 2. ONBOARDING SCREEN (NAME + UNITS + GENDER + BIRTHDAY + GOALS)
  if (appScreen === 'ONBOARDING') {
    return (
      <OnboardingScreen
        onboardingStep={onboardingStep}
        setOnboardingStep={setOnboardingStep}
        nameInput={nameInput}
        setNameInput={setNameInput}
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
        onFinishOnboarding={handleFinishOnboarding}
        onBackToAuth={() => setAppScreen('AUTH')}
      />
    );
  }

  // 3. MAIN APPLICATION TABS
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
              onUpdateAvatar={setUserAvatar}
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
              onUpdateAvatar={setUserAvatar}
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
          setDailyWorkoutStatuses((prev) => ({
            ...prev,
            [todayDateKey]: 'in_progress'
          }));
        }}
        onFinishWorkout={({ routineTitle, durationSeconds, exercisesCompleted }) => {
          setActiveWorkoutProgress(null);
          const now = new Date();
          const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          setDailyWorkoutStatuses((prev) => ({
            ...prev,
            [todayDateKey]: 'completed'
          }));
          const finishedWorkout = {
            id: String(Date.now()),
            date: now.toISOString(),
            routineName: routineTitle || 'Workout Session',
            durationSeconds: durationSeconds || 2700,
            exercisesCount: exercisesCompleted || 4,
            totalVolumeKg: 14200
          };
          setWorkoutHistory((prev) => [finishedWorkout, ...prev]);
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



      {/* FLOATING FROSTED BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNavPill}>
          <TouchableOpacity
            style={[styles.navItem, currentTab === 'home' && styles.navItemActive]}
            onPress={() => setCurrentTab('home')}
            activeOpacity={0.8}
          >
            <Home size={20} color={currentTab === 'home' ? '#FFFFFF' : '#71717A'} />
            <Text style={[styles.navText, currentTab === 'home' && styles.navTextActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentTab === 'workouts' && styles.navItemActive]}
            onPress={() => setCurrentTab('workouts')}
            activeOpacity={0.8}
          >
            <Dumbbell size={20} color={currentTab === 'workouts' ? '#FFFFFF' : '#71717A'} />
            <Text style={[styles.navText, currentTab === 'workouts' && styles.navTextActive]}>
              Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentTab === 'exercises' && styles.navItemActive]}
            onPress={() => setCurrentTab('exercises')}
            activeOpacity={0.8}
          >
            <List size={20} color={currentTab === 'exercises' ? '#FFFFFF' : '#71717A'} />
            <Text style={[styles.navText, currentTab === 'exercises' && styles.navTextActive]}>
              Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentTab === 'profile' && styles.navItemActive]}
            onPress={() => setCurrentTab('profile')}
            activeOpacity={0.8}
          >
            <User size={20} color={currentTab === 'profile' ? '#FFFFFF' : '#71717A'} />
            <Text style={[styles.navText, currentTab === 'profile' && styles.navTextActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    zIndex: 100
  },
  bottomNavPill: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: 'rgba(20, 20, 24, 0.94)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  navText: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '600'
  },
  navTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  }
});
