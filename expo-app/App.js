import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Alert,
  Modal,
  LogBox
} from 'react-native';

LogBox.ignoreAllLogs(true);
import { LinearGradient } from 'expo-linear-gradient';
import {
  Home,
  Dumbbell,
  List,
  User,
  Clock,
  Play,
  Check,
  Search,
  ChevronRight,
  Flame,
  ArrowLeft,
  X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Obsidian & Electric Violet Theme
const C = {
  bg: '#08070E',
  surface: '#131022',
  surfaceVariant: '#1B1630',
  surfaceElevated: '#241D40',
  border: '#2E2652',
  borderSubtle: '#1F1A38',
  purple: '#7C3AED',
  purpleDark: '#5B21B6',
  purpleLight: '#A78BFA',
  purpleAccent: '#C4B5FD',
  emerald: '#10B981',
  orange: '#FF9800',
  rose: '#F43F5E',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B'
};

const EXERCISES_DB = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0025.gif',
    cues: ['Retract shoulder blades into bench', 'Keep elbows at 45°', 'Control 2-sec descent'],
    mistakes: ['Flaring elbows out 90°', 'Bouncing bar off chest'],
    sets: [
      { num: 1, reps: 10, weight: 50, done: false },
      { num: 2, reps: 10, weight: 55, done: false },
      { num: 3, reps: 8, weight: 60, done: false }
    ]
  },
  {
    id: '2',
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    equipment: 'Dumbbells',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0314.gif',
    cues: ['Set bench to 30° incline', 'Maintain neutral wrists', 'Full stretch at bottom'],
    mistakes: ['Incline set too steep (>45°)', 'Clanging weights together'],
    sets: [
      { num: 1, reps: 10, weight: 20, done: false },
      { num: 2, reps: 10, weight: 22, done: false },
      { num: 3, reps: 8, weight: 24, done: false }
    ]
  },
  {
    id: '3',
    name: 'Barbell Back Squat',
    muscle: 'Legs',
    equipment: 'Barbell',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0043.gif',
    cues: ['Deep diaphragmatic brace', 'Knees track over toes', 'Chest upright'],
    mistakes: ['Knees caving inward', 'Heels lifting off ground'],
    sets: [
      { num: 1, reps: 8, weight: 70, done: false },
      { num: 2, reps: 8, weight: 75, done: false },
      { num: 3, reps: 6, weight: 80, done: false }
    ]
  },
  {
    id: '4',
    name: 'Lat Pulldown',
    muscle: 'Back',
    equipment: 'Cable Machine',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0652.gif',
    cues: ['Drive elbows down to hips', 'Engage core to prevent swinging', 'Full stretch at top'],
    mistakes: ['Swinging torso excessively', 'Pulling bar behind neck'],
    sets: [
      { num: 1, reps: 10, weight: 45, done: false },
      { num: 2, reps: 10, weight: 50, done: false },
      { num: 3, reps: 8, weight: 55, done: false }
    ]
  },
  {
    id: '5',
    name: 'Standing Overhead Press',
    muscle: 'Shoulders',
    equipment: 'Barbell',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0086.gif',
    cues: ['Vertical forearm angle', 'Glutes locked', 'Head through window at top'],
    mistakes: ['Arching lower back', 'Pressing bar forward'],
    sets: [
      { num: 1, reps: 8, weight: 35, done: false },
      { num: 2, reps: 8, weight: 40, done: false },
      { num: 3, reps: 6, weight: 42.5, done: false }
    ]
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'workouts' | 'exercises' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null);

  // Active Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState(EXERCISES_DB.slice(0, 3));
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  // Rest Timer Effect
  useEffect(() => {
    let interval;
    if (isResting && restSeconds > 0) {
      interval = setInterval(() => setRestSeconds(prev => prev - 1), 1000);
    } else if (restSeconds === 0) {
      setIsResting(false);
      setRestSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isResting, restSeconds]);

  // Workout Duration Clock
  useEffect(() => {
    let timer;
    if (isWorkoutActive) {
      timer = setInterval(() => setWorkoutDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutActive]);

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

  const filteredExercises = EXERCISES_DB.filter(ex => {
    const matchName = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
    return matchName && matchMuscle;
  });

  const currentWorkoutEx = workoutExercises[currentExIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ======================================================== */}
      {/* 1. HOME TAB */}
      {/* ======================================================== */}
      {currentTab === 'home' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.brandPill}>
              <Text style={{ fontSize: 10, color: '#C4B5FD', fontWeight: '900' }}>⚡ FITPULSE</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={{ fontSize: 12 }}>🔥</Text>
              <Text style={styles.streakText}>14 Days</Text>
            </View>
          </View>

          <Text style={styles.welcomeSub}>Welcome back,</Text>
          <Text style={styles.welcomeTitle}>Alex Vance 💪</Text>

          {/* HERO WORKOUT CARD */}
          <LinearGradient colors={['#241A42', '#130E26']} style={styles.heroCard}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>TODAY'S WORKOUT</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Clock size={13} color={C.purpleAccent} />
                <Text style={{ color: C.purpleAccent, fontSize: 12, fontWeight: '700' }}>30 min</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Day 1: Chest & Triceps Pump</Text>
            <Text style={styles.heroSub}>3 Exercises with 3D Form Animations & Smart Rest Timers</Text>

            <View style={styles.chipsRow}>
              <View style={styles.chip}><Text style={styles.chipText}>• Bench Press</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>• Incline DB</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>• Squats</Text></View>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startWorkout}>
              <Text style={styles.startBtnText}>Start Workout Now</Text>
              <Play size={18} color="#FFF" fill="#FFF" />
            </TouchableOpacity>
          </LinearGradient>

          {/* WEEKLY SPLIT */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Gym Split</Text>
            <Text style={styles.sectionSub}>Beginner Plan</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {[
              { day: 'Mon', split: 'Chest & Tri', active: true },
              { day: 'Tue', split: 'Back & Bi' },
              { day: 'Wed', split: 'Rest Day' },
              { day: 'Thu', split: 'Legs & Core' },
              { day: 'Fri', split: 'Shoulders' },
              { day: 'Sat', split: 'HIIT Burn' },
              { day: 'Sun', split: 'Rest Day' }
            ].map((item, idx) => (
              <View key={idx} style={[styles.dayCard, item.active && styles.dayCardActive]}>
                <Text style={[styles.dayText, item.active && { color: C.purpleAccent, fontWeight: '900' }]}>{item.day}</Text>
                <Text style={styles.daySplitText}>{item.split}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 3D EXERCISES GUIDE */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>3D Exercise Guide</Text>
            <TouchableOpacity onPress={() => setCurrentTab('exercises')}>
              <Text style={{ color: C.purpleAccent, fontWeight: '700', fontSize: 12 }}>View All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryRow}>
            {[
              { emoji: '🏋️', label: 'Chest & Tris', muscle: 'Chest' },
              { emoji: '🧗', label: 'Back & Lats', muscle: 'Back' },
              { emoji: '🦵', label: 'Legs & Quads', muscle: 'Legs' }
            ].map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryCard}
                onPress={() => {
                  setSelectedMuscle(cat.muscle);
                  setCurrentTab('exercises');
                }}
              >
                <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 2. WORKOUTS TAB */}
      {/* ======================================================== */}
      {currentTab === 'workouts' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Gym Workout Plans</Text>
          <Text style={styles.pageSub}>Structured routines designed for progressive overload</Text>

          {[
            { title: 'Push / Pull / Legs Split', days: '3-6 Days/Week', exCount: '6 Exercises', level: 'Beginner - Pro' },
            { title: '3-Day Full Body Blueprint', days: '3 Days/Week', exCount: '5 Exercises', level: 'Beginner' },
            { title: 'Dumbbell Only Home & Gym', days: '4 Days/Week', exCount: '4 Exercises', level: 'All Levels' }
          ].map((plan, idx) => (
            <View key={idx} style={styles.planCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>{plan.level}</Text></View>
              </View>
              <Text style={styles.planSub}>{plan.days} • {plan.exCount}</Text>
              <TouchableOpacity style={styles.planBtn} onPress={startWorkout}>
                <Text style={styles.planBtnText}>Start Routine ▶</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 3. 3D EXERCISES TAB */}
      {/* ======================================================== */}
      {currentTab === 'exercises' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>3D Exercise Library</Text>

          <View style={styles.searchContainer}>
            <Search size={18} color={C.purpleAccent} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search 3D exercises, muscles..."
              placeholderTextColor={C.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Muscle Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {['All', 'Chest', 'Back', 'Legs', 'Shoulders'].map((m, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.filterChip, selectedMuscle === m && styles.filterChipActive]}
                onPress={() => setSelectedMuscle(m)}
              >
                <Text style={[styles.filterText, selectedMuscle === m && { color: '#FFF', fontWeight: '900' }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Exercise List */}
          {filteredExercises.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              style={styles.exCard}
              onPress={() => setSelectedExerciseDetail(ex)}
            >
              <Image source={{ uri: ex.gifUrl }} style={styles.exThumb} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exMeta}>{ex.muscle} • {ex.equipment}</Text>
              </View>
              <ChevronRight size={18} color={C.textSecondary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 4. PROFILE TAB */}
      {/* ======================================================== */}
      {currentTab === 'profile' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Profile & Progress</Text>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Alex Vance</Text>
            <Text style={styles.planSub}>Level 12 • Iron Builder • 14 Day Streak</Text>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Personal Records (PRs)</Text>
            <Text style={styles.planSub}>• Bench Press: 70 kg</Text>
            <Text style={styles.planSub}>• Squat: 85 kg</Text>
            <Text style={styles.planSub}>• Pull-Ups: 10 reps</Text>
          </View>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 5. EXERCISE DETAIL MODAL */}
      {/* ======================================================== */}
      <Modal visible={!!selectedExerciseDetail} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          {selectedExerciseDetail && (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <TouchableOpacity onPress={() => setSelectedExerciseDetail(null)} style={styles.iconCircle}>
                  <ArrowLeft size={18} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.badge}><Text style={styles.badgeText}>{selectedExerciseDetail.muscle.toUpperCase()}</Text></View>
              </View>

              <Image source={{ uri: selectedExerciseDetail.gifUrl }} style={styles.detailGif} />

              <Text style={styles.detailTitle}>{selectedExerciseDetail.name}</Text>
              <Text style={styles.detailEquipment}>{selectedExerciseDetail.equipment}</Text>

              <Text style={styles.sectionTitle}>Form Checklist 💡</Text>
              {selectedExerciseDetail.cues.map((cue, i) => (
                <View key={i} style={styles.cueRow}>
                  <Check size={14} color={C.emerald} />
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}

              <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Mistakes to Avoid ⚠️</Text>
              {selectedExerciseDetail.mistakes.map((m, i) => (
                <View key={i} style={styles.mistakeRow}>
                  <Text style={{ color: C.rose, fontSize: 13 }}>❌ {m}</Text>
                </View>
              ))}

              <TouchableOpacity style={[styles.startBtn, { marginTop: 20 }]} onPress={() => { setSelectedExerciseDetail(null); startWorkout(); }}>
                <Text style={styles.startBtnText}>Start This Exercise ▶</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* ======================================================== */}
      {/* 6. GUIDED WORKOUT PLAYER (Next -> Next) */}
      {/* ======================================================== */}
      <Modal visible={isWorkoutActive} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          {currentWorkoutEx && (
            <View style={{ flex: 1, padding: 18 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setIsWorkoutActive(false)} style={styles.iconCircle}>
                  <X size={18} color="#FFF" />
                </TouchableOpacity>
                <Text style={{ fontWeight: '900', color: '#FFF', fontSize: 15 }}>Exercise {currentExIndex + 1} of {workoutExercises.length}</Text>
                <Text style={{ color: C.purpleAccent, fontWeight: '700' }}>
                  {Math.floor(workoutDuration / 60)}:{String(workoutDuration % 60).padStart(2, '0')}
                </Text>
              </View>

              <ScrollView style={{ flex: 1, marginTop: 10 }}>
                <Image source={{ uri: currentWorkoutEx.gifUrl }} style={styles.workoutGif} />
                <Text style={styles.detailTitle}>{currentWorkoutEx.name}</Text>

                {/* Form Tip */}
                <View style={styles.tipBox}>
                  <Text style={{ color: C.purpleAccent, fontWeight: '800', fontSize: 11 }}>FORM TIP:</Text>
                  <Text style={{ color: C.textSecondary, fontSize: 12 }}>{currentWorkoutEx.cues[0]}</Text>
                </View>

                {/* Sets Logger */}
                <Text style={[styles.sectionTitle, { marginVertical: 10 }]}>Log Sets</Text>
                {currentWorkoutEx.sets.map((s, idx) => (
                  <View key={idx} style={[styles.setRow, s.done && styles.setRowDone]}>
                    <View style={[styles.setNumPill, s.done && { backgroundColor: C.emerald }]}>
                      <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 11 }}>{s.num}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{s.weight} kg</Text>
                      <TouchableOpacity onPress={() => adjustWeight(idx, -2.5)}><Text style={styles.stepBtn}>-</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => adjustWeight(idx, 2.5)}><Text style={styles.stepBtn}>+</Text></TouchableOpacity>
                    </View>
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{s.reps} reps</Text>
                    <TouchableOpacity
                      style={[styles.checkBtn, s.done && { backgroundColor: C.emerald }]}
                      onPress={() => toggleSetComplete(idx)}
                    >
                      <Check size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Rest Banner */}
                {isResting && (
                  <View style={styles.restBanner}>
                    <Text style={{ color: '#FFF', fontWeight: '800' }}>⏱️ REST: {restSeconds}s left</Text>
                    <TouchableOpacity onPress={() => setIsResting(false)}>
                      <Text style={{ color: C.purpleAccent, fontWeight: '900' }}>Skip</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              {/* Next Button */}
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => {
                  if (currentExIndex < workoutExercises.length - 1) {
                    setCurrentExIndex(prev => prev + 1);
                    setIsResting(false);
                  } else {
                    Alert.alert('🎉 Workout Finished!', 'Awesome session! You earned +250 XP!');
                    setIsWorkoutActive(false);
                  }
                }}
              >
                <Text style={styles.startBtnText}>
                  {currentExIndex < workoutExercises.length - 1 ? 'Next Exercise →' : 'Finish Workout 🎉'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ======================================================== */}
      {/* 7. BOTTOM NAVIGATION BAR */}
      {/* ======================================================== */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <Home size={20} color={currentTab === 'home' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'home' && { color: C.purpleAccent }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('workouts')}>
          <Dumbbell size={20} color={currentTab === 'workouts' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'workouts' && { color: C.purpleAccent }]}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('exercises')}>
          <List size={20} color={currentTab === 'exercises' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'exercises' && { color: C.purpleAccent }]}>Exercises</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('profile')}>
          <User size={20} color={currentTab === 'profile' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'profile' && { color: C.purpleAccent }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  brandPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: C.borderSubtle },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakText: { color: C.orange, fontSize: 11, fontWeight: '800' },
  welcomeSub: { color: C.textSecondary, fontSize: 13 },
  welcomeTitle: { color: C.textPrimary, fontSize: 24, fontWeight: '900', marginBottom: 16 },
  heroCard: { borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: 'rgba(124, 58, 237, 0.5)', marginBottom: 22 },
  heroBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  heroTag: { backgroundColor: C.purple, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  heroTagText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  heroTitle: { color: C.textPrimary, fontSize: 19, fontWeight: '900', marginTop: 4 },
  heroSub: { color: C.textSecondary, fontSize: 12, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 6, marginVertical: 14 },
  chip: { backgroundColor: C.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  chipText: { color: C.textPrimary, fontSize: 11 },
  startBtn: { backgroundColor: C.purple, height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  startBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: C.textPrimary, fontSize: 16, fontWeight: '900' },
  sectionSub: { color: C.purpleAccent, fontSize: 11, fontWeight: '700' },
  dayCard: { width: 85, backgroundColor: C.surface, borderRadius: 14, padding: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle, alignItems: 'center' },
  dayCardActive: { borderColor: C.purple, backgroundColor: 'rgba(124, 58, 237, 0.2)' },
  dayText: { color: C.textSecondary, fontSize: 12, fontWeight: '700' },
  daySplitText: { color: C.textPrimary, fontSize: 10, marginTop: 4, textAlign: 'center' },
  categoryRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  categoryCard: { flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  categoryLabel: { color: C.textPrimary, fontSize: 11, fontWeight: '700', marginTop: 4 },
  pageTitle: { color: C.textPrimary, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  pageSub: { color: C.textSecondary, fontSize: 12, marginBottom: 14 },
  planCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.borderSubtle },
  planTitle: { color: C.textPrimary, fontSize: 16, fontWeight: '800' },
  planSub: { color: C.textSecondary, fontSize: 12, marginTop: 4 },
  planBtn: { backgroundColor: C.surfaceElevated, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  planBtnText: { color: C.purpleAccent, fontWeight: '800', fontSize: 13 },
  badge: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: C.purpleAccent, fontSize: 10, fontWeight: '800' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 12, height: 44, marginVertical: 10, borderWidth: 1, borderColor: C.borderSubtle },
  searchInput: { flex: 1, marginLeft: 8, color: '#FFF', fontSize: 13 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 10, marginRight: 8 },
  filterChipActive: { backgroundColor: C.purple },
  filterText: { color: C.textSecondary, fontSize: 12, fontWeight: '700' },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: C.borderSubtle },
  exThumb: { width: 50, height: 50, borderRadius: 10, backgroundColor: C.surfaceVariant },
  exName: { color: C.textPrimary, fontSize: 14, fontWeight: '700' },
  exMeta: { color: C.purpleAccent, fontSize: 11, marginTop: 2 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  detailGif: { width: '100%', height: 220, borderRadius: 18, backgroundColor: C.surfaceVariant, marginVertical: 14 },
  detailTitle: { color: C.textPrimary, fontSize: 22, fontWeight: '900' },
  detailEquipment: { color: C.purpleAccent, fontSize: 12, fontWeight: '700', marginBottom: 14 },
  cueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 3 },
  cueText: { color: C.textSecondary, fontSize: 13 },
  mistakeRow: { marginVertical: 3 },
  workoutGif: { width: '100%', height: 200, borderRadius: 16, backgroundColor: C.surfaceVariant, marginVertical: 10 },
  tipBox: { backgroundColor: C.surface, padding: 10, borderRadius: 10, marginVertical: 8, borderWidth: 1, borderColor: C.borderSubtle },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, padding: 12, marginVertical: 4, borderWidth: 1, borderColor: C.borderSubtle },
  setRowDone: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: C.emerald },
  setNumPill: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  stepBtn: { color: C.purpleAccent, fontSize: 18, fontWeight: '900', paddingHorizontal: 4 },
  checkBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  restBanner: { backgroundColor: '#2E1A47', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, borderWidth: 1, borderColor: C.purpleAccent },
  bottomNav: { flexDirection: 'row', height: 65, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.borderSubtle, position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: C.textSecondary, fontSize: 10, marginTop: 4, fontWeight: '600' }
});
