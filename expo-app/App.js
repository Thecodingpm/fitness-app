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
import { C } from './src/constants/theme';
import { EXERCISES_DB } from './src/data/exercisesDb';
import { AuthScreen } from './src/screens/AuthScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { ExercisesScreen } from './src/screens/ExercisesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ActiveWorkoutModal } from './src/modals/ActiveWorkoutModal';
import { ExerciseDetailModal } from './src/modals/ExerciseDetailModal';
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

  // Onboarding Step State
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [unitWeight, setUnitWeight] = useState('kg');
  const [unitDistance, setUnitDistance] = useState('kilometers');
  const [unitBody, setUnitBody] = useState('cm');

  // Live Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState(EXERCISES_DB.slice(0, 3));
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [workoutDuration, setWorkoutDuration] = useState(0);

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
  const handleFirebaseEmailAuth = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setIsSigningIn(true);
    try {
      if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('REPLACE_')) {
        let res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`,
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

        if (data.error && data.error.message.includes('EMAIL_NOT_FOUND')) {
          res = await fetch(
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
          data = await res.json();
        }

        if (data.localId) {
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {}

    const extractedName = emailInput.split('@')[0] || 'Athlete';
    setUserEmail(emailInput.trim());
    setNameInput(extractedName);
    setUserName(extractedName);
    setIsSigningIn(false);
    setOnboardingStep(1);
    setAppScreen('ONBOARDING');
  };

  const handleFinishOnboarding = () => {
    if (!nameInput.trim()) {
      Alert.alert('Please enter your name', 'Your AI coach needs your name to personalize your workouts.');
      return;
    }
    setUserName(nameInput.trim());
    setAppScreen('MAIN');
  };

  const handleLogOut = () => {
    setUserName('');
    setNameInput('');
    setUserEmail('');
    setFirebaseUid(null);
    setAppScreen('AUTH');
  };

  const startWorkout = () => {
    setWorkoutExercises(JSON.parse(JSON.stringify(EXERCISES_DB.slice(0, 3))));
    setCurrentExIndex(0);
    setWorkoutDuration(0);
    setIsResting(false);
    setIsWorkoutActive(true);
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

  // 2. ONBOARDING SCREEN (NAME + SELECT UNITS)
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
        onFinishOnboarding={handleFinishOnboarding}
        onBackToAuth={() => setAppScreen('AUTH')}
      />
    );
  }

  // 3. MAIN APPLICATION TABS
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* DASHBOARD TAB */}
      {currentTab === 'home' && (
        <HomeScreen
          userName={userName}
          onNavigateTab={setCurrentTab}
          onStartWorkout={startWorkout}
          onSelectMuscle={(muscle) => {
            setSelectedMuscle(muscle);
            setCurrentTab('exercises');
          }}
        />
      )}

      {/* WORKOUTS TAB */}
      {currentTab === 'workouts' && (
        <WorkoutsScreen userName={userName} onStartWorkout={startWorkout} />
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
          onEditProfile={() => {
            setOnboardingStep(1);
            setAppScreen('ONBOARDING');
          }}
          onOpenPaywall={() => setShowPaywall(true)}
          onLogOut={handleLogOut}
        />
      )}

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

      {/* MODAL: LIVE ACTIVE WORKOUT PLAYER */}
      <ActiveWorkoutModal
        visible={isWorkoutActive}
        workoutExercises={workoutExercises}
        currentExIndex={currentExIndex}
        workoutDuration={workoutDuration}
        isResting={isResting}
        restSeconds={restSeconds}
        onClose={() => setIsWorkoutActive(false)}
        onNextExercise={() => {
          if (currentExIndex < workoutExercises.length - 1) {
            setCurrentExIndex((prev) => prev + 1);
            setIsResting(false);
          } else {
            Alert.alert('🎉 Workout Finished!', `Awesome job, ${userName}! You earned +250 XP!`);
            setIsWorkoutActive(false);
          }
        }}
        onToggleSetComplete={toggleSetComplete}
        onAdjustWeight={adjustWeight}
        onSkipRest={() => setIsResting(false)}
      />

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <Home size={20} color={currentTab === 'home' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'home' && { color: C.white, fontWeight: '800' }]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('workouts')}>
          <Dumbbell size={20} color={currentTab === 'workouts' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'workouts' && { color: C.white, fontWeight: '800' }]}>
            Programs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('exercises')}>
          <List size={20} color={currentTab === 'exercises' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'exercises' && { color: C.white, fontWeight: '800' }]}>
            3D Anatomy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('profile')}>
          <User size={20} color={currentTab === 'profile' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'profile' && { color: C.white, fontWeight: '800' }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  bottomNav: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: C.zincDark, fontSize: 10, marginTop: 4, fontWeight: '600' }
});
