import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Search,
  X,
  Plus,
  Check,
  Flame,
  Trophy,
  Dumbbell,
  Clock,
  Zap,
  Activity
} from 'lucide-react-native';
import { EXERCISES_DB } from '../data/exercisesDb';
import { FullscreenVideoModal } from '../modals/FullscreenVideoModal';
import { saveDayCustomExercises, loadDayCustomExercises } from '../services/sessionStorage';
import { totalVolumeKg } from '../data/completedSets.mjs';

const RED = '#EF4444';
const SIDE = 18;
const GAP = 12;
const CARD_WIDTH = (Dimensions.get('window').width - SIDE * 2 - GAP) / 2;
const FILTERS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Mobility'];

export function ExerciseVideosScreen({
  routine = null,
  userId = 'guest',
  completedSets = [],
  onLogSet,
  onLogBatchSets,
  onStartWorkout,
  onFinishWorkout,
  onClearRoutine
}) {
  const insets = useSafeAreaInsets();
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [query, setQuery] = useState('');
  const [activeExercise, setActiveExercise] = useState(null);

  // Custom exercises added by the user to this routine
  const [customExercises, setCustomExercises] = useState([]);


  // Add Exercise Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');
  const [customDefaultSets, setCustomDefaultSets] = useState('3');
  const [customDefaultReps, setCustomDefaultReps] = useState('10');
  const [customDefaultWeight, setCustomDefaultWeight] = useState('40');

  // Load custom exercises for the active routine's day
  useEffect(() => {
    let isMounted = true;
    async function loadCustom() {
      if (routine && routine.dayIndex !== undefined) {
        const loaded = await loadDayCustomExercises(routine.dayIndex, userId);
        if (isMounted) {
          setCustomExercises(loaded || []);
        }
      } else {
        if (isMounted) setCustomExercises([]);
      }
    }
    loadCustom();
    return () => {
      isMounted = false;
    };
  }, [routine?.dayIndex, userId]);

  // Combined list of routine exercises (default + user added)
  const routineExercises = useMemo(() => {
    if (!routine) return [];
    const base = routine.exercises || [];
    const customIds = new Set(customExercises.map((e) => e.id));
    const merged = [...base.filter((e) => !customIds.has(e.id)), ...customExercises];
    return merged;
  }, [routine, customExercises]);

  // Filtered exercises for display
  const filtered = useMemo(() => {
    const available = EXERCISES_DB.filter((exercise) => exercise.videoVerified !== false);
    if (routine) {
      const routineMap = new Map();
      routineExercises.forEach((e) => routineMap.set(e.id, e));
      const list = [...routineMap.values()];
      const search = query.trim().toLowerCase();
      if (!search) return list;
      return list.filter((e) =>
        `${e.name} ${e.muscle || ''} ${e.equipment || ''}`.toLowerCase().includes(search)
      );
    }
    const search = query.trim().toLowerCase();
    return available.filter(
      (exercise) =>
        (selectedMuscle === 'All' || exercise.muscle === selectedMuscle) &&
        (!search || `${exercise.name} ${exercise.equipment} ${exercise.muscle}`.toLowerCase().includes(search))
    );
  }, [routine, routineExercises, selectedMuscle, query]);

  // Sets logged for this routine or within recent window
  const sessionSets = useMemo(() => {
    if (!routine) return [];
    return completedSets.filter(
      (set) =>
        set.routineTitle === routine.title ||
        (Number.isFinite(Date.parse(set.loggedAt)) && Date.now() - Date.parse(set.loggedAt) < 7200000)
    );
  }, [routine, completedSets]);

  // Sets mapped per exercise
  const exerciseSetsMap = useMemo(() => {
    const map = {};
    for (const set of sessionSets) {
      if (!map[set.exerciseId]) map[set.exerciseId] = [];
      map[set.exerciseId].push(set);
    }
    return map;
  }, [sessionSets]);

  const totalSessionSets = sessionSets.length;
  const totalSessionReps = sessionSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
  const totalSessionVolume = totalVolumeKg(sessionSets);


  // Add Exercise to Routine Handler
  const handleAddExerciseToRoutine = async (exerciseToAdd) => {
    if (!routine || routine.dayIndex === undefined) return;
    const exists = routineExercises.some((e) => e.id === exerciseToAdd.id);
    if (exists) {
      Alert.alert('Already Added', `${exerciseToAdd.name} is already in this routine.`);
      return;
    }

    const updated = [...customExercises, exerciseToAdd];
    setCustomExercises(updated);
    await saveDayCustomExercises(routine.dayIndex, updated, userId);
    setShowAddModal(false);
    setAddSearch('');
    Alert.alert('Exercise Added 🎉', `${exerciseToAdd.name} has been added to ${routine.dayName || 'this'} routine.`);
  };

  // Add Custom Exercise Created by User
  const handleCreateCustomExercise = async () => {
    if (!customName.trim()) {
      Alert.alert('Missing Name', 'Please enter an exercise name.');
      return;
    }
    const sets = parseInt(customDefaultSets, 10) || 3;
    const reps = parseInt(customDefaultReps, 10) || 10;
    const weight = parseFloat(customDefaultWeight) || 0;

    const newEx = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      shortName: customName.trim().slice(0, 18),
      muscle: customMuscle,
      equipment: weight > 0 ? 'Free Weights' : 'Bodyweight',
      videoVerified: false,
      tagline: `${customMuscle} Builder`,
      sets: Array.from({ length: sets }, (_, i) => ({ num: i + 1, reps, weight, done: false }))
    };

    await handleAddExerciseToRoutine(newEx);
    setCustomName('');
  };

  // Finish Workout Session
  const handleFinishRoutineWorkout = () => {
    if (totalSessionSets === 0) {
      Alert.alert('No Sets Logged', 'Log at least one set before saving this workout.');
      return;
    }

    Alert.alert(
      'Finish Workout?',
      `Save your session with ${totalSessionSets} sets, ${totalSessionReps} reps and ${totalSessionVolume} kg volume to your database?`,
      [
        { text: 'Keep Training', style: 'cancel' },
        {
          text: 'Save & Finish 🎉',
          style: 'default',
          onPress: () => {
            if (onFinishWorkout) {
              onFinishWorkout({
                routineTitle: routine?.title || 'Workout Session',
                durationSeconds: 1800,
                exercisesCompleted: Object.keys(exerciseSetsMap).length,
                completedExercises: routineExercises.filter((e) => !!exerciseSetsMap[e.id]),
                sessionId: `session-${Date.now()}`
              });
            }
            Alert.alert(
              'Workout Saved! 🏆',
              `Your ${routine?.title || 'workout'} data has been saved to Cloud Firestore and local storage. Head to the Analytics tab to view your updated metrics!`
            );
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Ambient Background Glow */}
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.18)', 'rgba(239, 68, 68, 0.03)', 'transparent']}
        style={styles.bgGlow}
        pointerEvents="none"
      />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.eyebrow}>
            {routine ? `${routine.dayName?.toUpperCase()} · DAY ${routine.dayNum || 1}` : 'EXERCISE LIBRARY'}
          </Text>
          {routine && onStartWorkout && (
            <TouchableOpacity
              style={styles.liveWorkoutChip}
              onPress={() => onStartWorkout(routine)}
              activeOpacity={0.8}
            >
              <Zap size={11} color="#EF4444" />
              <Text style={styles.liveWorkoutChipText}>Full Mode</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>{routine ? routine.title : 'Exercises'}</Text>
        <Text style={styles.subtitle}>
          {routine
            ? `${routine.focus || 'Strength'} · Tap video to watch guide, or log sets below.`
            : 'Clear guides & set logging for every move in your plan.'}
        </Text>

        {/* 📊 Active Session Tracker Bar if viewing routine and sets are logged */}
        {routine && totalSessionSets > 0 && (
          <View style={styles.sessionStatusBanner}>
            <View style={styles.sessionStatsRow}>
              <View style={styles.sessionStatItem}>
                <Text style={styles.sessionStatNumber}>{totalSessionSets}</Text>
                <Text style={styles.sessionStatLabel}>SETS</Text>
              </View>
              <View style={styles.sessionStatDivider} />
              <View style={styles.sessionStatItem}>
                <Text style={styles.sessionStatNumber}>{totalSessionReps}</Text>
                <Text style={styles.sessionStatLabel}>REPS</Text>
              </View>
              <View style={styles.sessionStatDivider} />
              <View style={styles.sessionStatItem}>
                <Text style={[styles.sessionStatNumber, { color: '#10B981' }]}>
                  {totalSessionVolume >= 1000 ? `${(totalSessionVolume / 1000).toFixed(1)}k` : totalSessionVolume}
                </Text>
                <Text style={styles.sessionStatLabel}>KG VOL</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.finishWorkoutBannerBtn}
              onPress={handleFinishRoutineWorkout}
              activeOpacity={0.85}
            >
              <Trophy size={14} color="#000000" />
              <Text style={styles.finishWorkoutBannerBtnText}>Save & Finish</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Routine Action Bar: Add Exercise & Finish Workout buttons */}
        {routine && (
          <View style={styles.routineActionBar}>
            <TouchableOpacity
              style={styles.addExerciseBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.addExerciseBtnText}>Add Exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveWorkoutBtn,
                totalSessionSets > 0 && styles.saveWorkoutBtnActive
              ]}
              onPress={handleFinishRoutineWorkout}
              activeOpacity={0.8}
            >
              <Check size={14} color={totalSessionSets > 0 ? '#FFFFFF' : '#A1A1AA'} strokeWidth={3} />
              <Text
                style={[
                  styles.saveWorkoutBtnText,
                  totalSessionSets > 0 && styles.saveWorkoutBtnTextActive
                ]}
              >
                {totalSessionSets > 0 ? `Finish Workout (${totalSessionSets} Sets)` : 'Finish Workout'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Routine or Library Controls */}
      {routine ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClearRoutine}
          accessibilityRole="button"
          accessibilityLabel="Show all exercises"
        >
          <ArrowLeft size={16} color="#FFFFFF" />
          <Text style={styles.backText}>All exercises</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.searchBox}>
            <Search size={18} color="#8A8A94" />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search exercises or equipment"
              placeholderTextColor="#777780"
              returnKeyType="search"
              accessibilityLabel="Search exercises"
            />
            {!!query && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <X size={17} color="#A1A1AA" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {FILTERS.map((muscle) => {
              const active = selectedMuscle === muscle;
              return (
                <TouchableOpacity
                  key={muscle}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedMuscle(muscle)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{muscle}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* Section Header */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {routine ? `${routine.dayName || 'Routine'} Exercises` : 'Browse library'}
        </Text>
        <Text style={styles.count}>
          {filtered.length} {filtered.length === 1 ? 'exercise' : 'exercises'}
        </Text>
      </View>

      {/* Exercises Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        renderItem={({ item }) => {
          const logged = exerciseSetsMap[item.id] || [];
          const isDone = logged.length >= (item.sets?.length || 3);

          return (
            <View style={styles.cardWrapper}>
              <TouchableOpacity
                style={[styles.card, isDone && styles.cardCompleted]}
                activeOpacity={0.88}
                onPress={() => setActiveExercise(item)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.name} guide & set logger`}
              >
                {/* Video Preview Thumbnail / Play Button */}
                <View style={styles.imageWrap}>
                  {item.image ? (
                    <Image source={item.image} style={styles.image} resizeMode="cover" fadeDuration={0} />
                  ) : (
                    <View style={[styles.image, styles.imageFallback]}>
                      <Dumbbell size={32} color="#454550" />
                    </View>
                  )}

                  {/* Play Video Badge */}
                  <View style={styles.playButton}>
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                  </View>

                  {/* Target Sets Tag */}
                  <View style={styles.targetBadge}>
                    <Text style={styles.targetBadgeText}>
                      {item.sets?.length || 3} sets · {item.sets?.[0]?.reps || 10} reps
                    </Text>
                  </View>
                </View>

                {/* Card Body */}
                <View style={styles.cardBody}>
                  <Text style={styles.cardMuscle} numberOfLines={1}>
                    {item.muscle || 'Full Body'}
                  </Text>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.shortName || item.name}
                  </Text>

                  {/* Logged Sets Indicator */}
                  {logged.length > 0 ? (
                    <View style={styles.loggedIndicatorPill}>
                      <Check size={11} color="#10B981" strokeWidth={3} />
                      <Text style={styles.loggedIndicatorText}>
                        {logged.length} sets logged ({logged.reduce((s, x) => s + (Number(x.reps) || 0), 0)} reps)
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.cardEquipment} numberOfLines={1}>
                      {item.equipment || 'Exercise guide'}
                    </Text>
                  )}

                  {/* Clean Action Button */}
                  <View style={[styles.quickLogBtn, logged.length > 0 && styles.quickLogBtnLogged]}>
                    {logged.length > 0 ? (
                      <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
                    ) : (
                      <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                    <Text style={styles.quickLogBtnText}>
                      {logged.length > 0 ? 'Logged · View Demo' : 'Watch & Log Sets'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {routine ? 'No exercises found' : 'No matching exercises'}
            </Text>
            <Text style={styles.emptyText}>
              {routine
                ? 'Tap "+ Add Exercise" above to add moves to this workout.'
                : 'Try a different search or muscle group.'}
            </Text>
          </View>
        }
      />

      {/* 📹 Fullscreen Video & Set Logger Modal (Hevy / Strong pattern) */}
      {activeExercise && (
        <FullscreenVideoModal
          visible={!!activeExercise}
          exercise={activeExercise}
          routine={routine}
          completedSets={completedSets}
          userId={userId}
          onLogSet={onLogSet}
          onLogBatchSets={onLogBatchSets}
          onClose={() => setActiveExercise(null)}
        />
      )}

      {/* ➕ Add Exercise to Routine Modal */}
      {showAddModal && (
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '88%' }]}>
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.modalSubtitle}>CUSTOMIZE WORKOUT</Text>
                  <Text style={styles.modalTitle}>
                    Add Exercise to {routine?.dayName || 'Workout'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setShowAddModal(false)}
                  activeOpacity={0.7}
                >
                  <X size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={[styles.searchBox, { marginHorizontal: 0, marginTop: 10 }]}>
                <Search size={16} color="#8A8A94" />
                <TextInput
                  style={styles.searchInput}
                  value={addSearch}
                  onChangeText={setAddSearch}
                  placeholder="Search 250+ exercises to add"
                  placeholderTextColor="#777780"
                />
                {!!addSearch && (
                  <TouchableOpacity onPress={() => setAddSearch('')}>
                    <X size={15} color="#A1A1AA" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Muscle Filter Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0, marginVertical: 10 }}
                contentContainerStyle={{ gap: 6 }}
              >
                {FILTERS.map((m) => {
                  const isActive = selectedMuscleFilter === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.smallFilterChip, isActive && styles.smallFilterChipActive]}
                      onPress={() => setSelectedMuscleFilter(m)}
                    >
                      <Text style={[styles.smallFilterText, isActive && styles.smallFilterTextActive]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* List of Available Exercises to Add */}
              <ScrollView style={{ flex: 1, marginVertical: 6 }} showsVerticalScrollIndicator={false}>
                {EXERCISES_DB.filter((e) => {
                  const matchesMuscle = selectedMuscleFilter === 'All' || e.muscle === selectedMuscleFilter;
                  const s = addSearch.trim().toLowerCase();
                  const matchesSearch = !s || `${e.name} ${e.muscle}`.toLowerCase().includes(s);
                  const notAlreadyIn = !routineExercises.some((re) => re.id === e.id);
                  return matchesMuscle && matchesSearch && notAlreadyIn;
                }).map((ex) => (
                  <View key={ex.id} style={styles.addExerciseRow}>
                    <View style={styles.addExerciseThumbWrap}>
                      {ex.image ? (
                        <Image source={ex.image} style={styles.addExerciseThumb} />
                      ) : (
                        <View style={[styles.addExerciseThumb, styles.imageFallback]}>
                          <Dumbbell size={16} color="#71717A" />
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                      <Text style={styles.addExerciseMuscle}>{ex.muscle}</Text>
                      <Text style={styles.addExerciseName} numberOfLines={1}>
                        {ex.name}
                      </Text>
                      <Text style={styles.addExerciseTarget}>
                        Target: {ex.sets?.length || 3} sets · {ex.sets?.[0]?.reps || 10} reps
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addBtnCircle}
                      onPress={() => handleAddExerciseToRoutine(ex)}
                      activeOpacity={0.8}
                    >
                      <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Section: Create Brand New Custom Exercise */}
                <View style={styles.customCreateSection}>
                  <Text style={styles.customCreateHeader}>OR CREATE CUSTOM EXERCISE</Text>
                  <TextInput
                    style={styles.customInput}
                    value={customName}
                    onChangeText={setCustomName}
                    placeholder="e.g. Incline Cable Flyes"
                    placeholderTextColor="#71717A"
                  />
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputMiniLabel}>MUSCLE</Text>
                      <TextInput
                        style={styles.customInput}
                        value={customMuscle}
                        onChangeText={setCustomMuscle}
                        placeholder="Chest"
                        placeholderTextColor="#71717A"
                      />
                    </View>
                    <View style={{ width: 80 }}>
                      <Text style={styles.inputMiniLabel}>SETS</Text>
                      <TextInput
                        style={styles.customInput}
                        value={customDefaultSets}
                        onChangeText={setCustomDefaultSets}
                        keyboardType="number-pad"
                        placeholder="3"
                        placeholderTextColor="#71717A"
                      />
                    </View>
                    <View style={{ width: 80 }}>
                      <Text style={styles.inputMiniLabel}>REPS</Text>
                      <TextInput
                        style={styles.customInput}
                        value={customDefaultReps}
                        onChangeText={setCustomDefaultReps}
                        keyboardType="number-pad"
                        placeholder="10"
                        placeholderTextColor="#71717A"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.createCustomBtn}
                    onPress={handleCreateCustomExercise}
                    activeOpacity={0.85}
                  >
                    <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.createCustomBtnText}>Add Custom Move</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0D' },
  bgGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  header: { paddingHorizontal: SIDE, paddingTop: 14, paddingBottom: 14 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: RED, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  liveWorkoutChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)'
  },
  liveWorkoutChipText: { color: RED, fontSize: 10, fontWeight: '800' },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', letterSpacing: -0.8, lineHeight: 36 },
  subtitle: { color: '#A2A2AA', fontSize: 13, lineHeight: 18, marginTop: 4 },

  // Live session status banner
  sessionStatusBanner: {
    backgroundColor: '#19191D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sessionStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionStatItem: { alignItems: 'center' },
  sessionStatNumber: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  sessionStatLabel: { color: '#8A8A94', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  sessionStatDivider: { width: 1, height: 24, backgroundColor: '#2E2E35' },
  finishWorkoutBannerBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  finishWorkoutBannerBtnText: { color: '#000000', fontSize: 12, fontWeight: '900' },

  // Routine action bar
  routineActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12
  },
  addExerciseBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#383842',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  addExerciseBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  saveWorkoutBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#19191E',
    borderWidth: 1,
    borderColor: '#2A2A32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  saveWorkoutBtnActive: {
    backgroundColor: RED,
    borderColor: '#DC2626'
  },
  saveWorkoutBtnText: { color: '#71717A', fontSize: 13, fontWeight: '800' },
  saveWorkoutBtnTextActive: { color: '#FFFFFF' },

  // General controls
  searchBox: {
    height: 46,
    marginHorizontal: SIDE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2B2B30',
    backgroundColor: '#19191D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10
  },
  searchInput: { flex: 1, height: '100%', color: '#FFFFFF', fontSize: 14, paddingVertical: 0 },
  filterScroll: { flexGrow: 0, height: 56, marginTop: 8 },
  filterContent: { alignItems: 'center', paddingHorizontal: SIDE, gap: 8 },
  chip: {
    minHeight: 34,
    paddingHorizontal: 13,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#35353B',
    backgroundColor: '#19191D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chipActive: { borderColor: RED, backgroundColor: RED },
  chipText: { color: '#B5B5BE', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },

  backButton: {
    alignSelf: 'flex-start',
    minHeight: 38,
    marginHorizontal: SIDE,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#202024',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  backText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: SIDE,
    paddingTop: 6,
    paddingBottom: 10
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  count: { color: '#8A8A94', fontSize: 12, fontWeight: '600' },

  grid: { paddingHorizontal: SIDE, paddingBottom: 130 },
  row: { gap: GAP, marginBottom: GAP },
  cardWrapper: { width: CARD_WIDTH },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A30',
    backgroundColor: '#18181B',
    overflow: 'hidden'
  },
  cardCompleted: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: '#141A17'
  },
  imageWrap: { width: '100%', height: CARD_WIDTH * 0.82, backgroundColor: '#252529', position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageFallback: { backgroundColor: '#252529', alignItems: 'center', justifyContent: 'center' },
  playButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3
  },
  targetBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6
  },
  targetBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },

  cardBody: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  cardMuscle: { color: RED, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  cardName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', lineHeight: 17, marginTop: 3 },
  cardEquipment: { color: '#96969F', fontSize: 10, lineHeight: 13, marginTop: 3 },

  loggedIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  loggedIndicatorText: { color: '#10B981', fontSize: 9, fontWeight: '800' },

  quickLogBtn: {
    marginTop: 8,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#26262C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#383842'
  },
  quickLogBtnLogged: {
    backgroundColor: '#1E2B24',
    borderColor: '#10B981'
  },
  quickLogBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },

  empty: { paddingHorizontal: 24, paddingVertical: 45, alignItems: 'center' },
  emptyTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  emptyText: { color: '#A1A1AA', fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 17 },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#16161A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2F2F38'
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  modalSubtitle: { color: RED, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26262E',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Inputs Grid
  inputsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18
  },
  inputCol: { flex: 1 },
  inputLabel: { color: '#A1A1AA', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F26',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#32323D',
    overflow: 'hidden'
  },
  stepBtn: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272730'
  },
  stepBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  stepperInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    paddingVertical: 0
  },

  summaryBox: {
    backgroundColor: '#1F1F27',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#30303D'
  },
  summaryBoxText: { color: '#D4D4D8', fontSize: 12, lineHeight: 18 },

  previousSetsList: { marginTop: 12 },
  previousSetsTitle: { color: '#8A8A94', fontSize: 10, fontWeight: '800', marginBottom: 6 },
  prevSetChip: {
    backgroundColor: '#1B2420',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6
  },
  prevSetChipText: { color: '#10B981', fontSize: 10, fontWeight: '700' },

  saveSetsSubmitBtn: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden'
  },
  saveSetsGradient: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  saveSetsSubmitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },

  // Add Exercise Modal Styles
  smallFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#22222B',
    borderWidth: 1,
    borderColor: '#33333F'
  },
  smallFilterChipActive: { backgroundColor: RED, borderColor: RED },
  smallFilterText: { color: '#A1A1AA', fontSize: 11, fontWeight: '700' },
  smallFilterTextActive: { color: '#FFFFFF' },

  addExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C22',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D37'
  },
  addExerciseThumbWrap: { width: 44, height: 44, borderRadius: 8, overflow: 'hidden' },
  addExerciseThumb: { width: '100%', height: '100%' },
  addExerciseMuscle: { color: RED, fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  addExerciseName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  addExerciseTarget: { color: '#8A8A94', fontSize: 10, marginTop: 2 },
  addBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center'
  },

  customCreateSection: {
    backgroundColor: '#1E1E26',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#343442'
  },
  customCreateHeader: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 0.5, marginBottom: 8 },
  customInput: {
    height: 40,
    backgroundColor: '#15151B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2F2F3B',
    color: '#FFFFFF',
    fontSize: 13,
    paddingHorizontal: 12
  },
  inputMiniLabel: { color: '#8A8A94', fontSize: 9, fontWeight: '800', marginBottom: 4 },
  createCustomBtn: {
    height: 40,
    backgroundColor: RED,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12
  },
  createCustomBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }
});

export default ExerciseVideosScreen;
