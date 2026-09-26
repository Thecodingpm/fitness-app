import React, { useState, useEffect, useMemo, Fragment } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  TextInput,
  AppState
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Clock,
  Zap,
  Check,
  Dumbbell,
  Trophy,
  X,
  Plus,
  Flame,
  Activity,
  Moon,
  Shield,
  Layers,
  Search
} from 'lucide-react-native';
import { RestRecoveryItem } from '../components/RestRecoveryItem';
import { WEEKLY_ROUTINES_DB, EXERCISES_DB } from '../data/exercisesDb';
import { saveDayCustomExercises, loadDayCustomExercises } from '../services/sessionStorage';
import { useRestTimer } from '../hooks/useRestTimer';
import { BACK_PRIORITY, useAndroidBackHandler } from '../services/navigation/backHandlerService';

const { width } = Dimensions.get('window');

export function WorkoutPreviewModal({
  visible,
  routine,
  savedProgress,
  completedSets = [],
  userId = 'guest',
  onLogSet,
  onLogBatchSets,
  onClose,
  onSaveProgress,
  onFinishWorkout,
  onSelectRoutine,
  onSelectExercise
}) {
  // Current active day index in preview modal (defaults to current routine's dayIndex)
  const [activeDayIndex, setActiveDayIndex] = useState(routine?.dayIndex ?? 0);
  const [customExercises, setCustomExercises] = useState([]);

  // Add Exercise Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');

  // Sync active routine when routine prop changes or when user switches day
  const currentRoutine = WEEKLY_ROUTINES_DB[activeDayIndex] || routine || WEEKLY_ROUTINES_DB[0];

  useEffect(() => {
    if (routine && routine.dayIndex !== undefined) {
      setActiveDayIndex(routine.dayIndex);
    }
  }, [routine, visible]);

  // Load custom exercises for this day
  useEffect(() => {
    let isMounted = true;
    async function load() {
      const loaded = await loadDayCustomExercises(activeDayIndex, userId);
      if (isMounted) setCustomExercises(loaded || []);
    }
    load();
    return () => { isMounted = false; };
  }, [activeDayIndex, userId]);

  const rawExercises = useMemo(() => {
    const base = currentRoutine.exercises || [];
    const customIds = new Set(customExercises.map(e => e.id));
    return [...base.filter(e => !customIds.has(e.id)), ...customExercises];
  }, [currentRoutine, customExercises]);

  const exerciseCount = rawExercises.length;
  const estimatedDuration = currentRoutine.durationMin || 45;

  // ⚡ Workout State: 'PREVIEW' | 'IN_PROGRESS'
  const [workoutState, setWorkoutState] = useState('PREVIEW');
  const [sessionId, setSessionId] = useState(null);
  const [workoutStartedAt, setWorkoutStartedAt] = useState(null);
  const [loggingExerciseId, setLoggingExerciseId] = useState(null);
  const [repsInput, setRepsInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [isSavingSet, setIsSavingSet] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  // Background-Safe Rest Timer (derives remaining time from absolute timestamps)
  const {
    remainingSeconds: restTimerSeconds,
    startRest,
    skipRest
  } = useRestTimer({
    sessionId,
    autoRestore: true,
    enableNotifications: true,
    enableHaptics: true
  });

  // Active muscle group section tab filter ('ALL' or section name)
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');

  // Restore saved progress if resuming, or initialize
  useEffect(() => {
    if (visible) {
      if (savedProgress && savedProgress.routineTitle === currentRoutine.title) {
        setWorkoutState('IN_PROGRESS');
        setSessionId(savedProgress.sessionId || null);
        const startedAt = savedProgress.workoutStartedAt || (Date.now() - (savedProgress.elapsedSeconds || 0) * 1000);
        setWorkoutStartedAt(startedAt);
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
      } else {
        setWorkoutState('PREVIEW');
        setSessionId(null);
        setWorkoutStartedAt(null);
        setElapsedSeconds(0);
      }
      setSelectedSectionFilter('ALL');
      setLoggingExerciseId(null);
    }
  }, [visible, activeDayIndex]);

  // Elapsed Workout Timer (Derived from real timestamp + AppState recovery)
  useEffect(() => {
    if (!visible || workoutState !== 'IN_PROGRESS' || !workoutStartedAt) return;

    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - workoutStartedAt) / 1000)));
    };

    updateElapsed();
    const timer = setInterval(updateElapsed, 1000);

    const subscription = AppState.addEventListener
      ? AppState.addEventListener('change', (state) => {
          if (state === 'active') updateElapsed();
        })
      : null;

    return () => {
      clearInterval(timer);
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [visible, workoutState, workoutStartedAt]);

  // Format Elapsed Time (e.g. "04:32")
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sessionSets = completedSets.filter(set => set.sessionId === sessionId && set.source === 'completed_set');
  const setsForExercise = (exerciseId) => sessionSets.filter(set => set.exerciseId === exerciseId);
  const completedExerciseIds = Object.fromEntries(rawExercises.map(exercise => [
    exercise.id,
    setsForExercise(exercise.id).length >= (exercise.sets?.length || 3)
  ]));

  const startWorkoutSession = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    const startedAt = Date.now();
    setSessionId(id);
    setWorkoutStartedAt(startedAt);
    setElapsedSeconds(0);
    setWorkoutState('IN_PROGRESS');
    onSaveProgress?.({
      sessionId: id,
      routineTitle: currentRoutine.title,
      completedCount: 0,
      totalCount: exerciseCount,
      percentComplete: 0,
      elapsedSeconds: 0,
      workoutStartedAt: startedAt,
      routine: currentRoutine
    });
  };

  const handleSaveSet = async (exercise) => {
    if (isSavingSet || !sessionId || !onLogSet) return;
    setIsSavingSet(true);
    try {
      const result = await onLogSet({
        exercise, sessionId, routineTitle: currentRoutine.title,
        reps: repsInput.trim(), weightKg: weightInput.trim()
      });
      setRepsInput('');
      setWeightInput('');
      startRest(90);
      if (!result.synced) Alert.alert('Set saved on this device', 'Cloud sync is pending. Reopen the app when online, or sign in again if your session expired.');
    } catch (error) {
      Alert.alert('Set not saved', error.message || 'Please try again.');
    } finally {
      setIsSavingSet(false);
    }
  };

  const handleSaveBatchSets = async (exercise, setsCount = 3) => {
    if (isSavingSet || !sessionId) return;
    const reps = repsInput.trim() || String(exercise.sets?.[0]?.reps || 10);
    const weight = weightInput.trim() || String(exercise.sets?.[0]?.weight || 0);
    setIsSavingSet(true);
    try {
      if (onLogBatchSets) {
        await onLogBatchSets({
          exercise,
          sessionId,
          routineTitle: currentRoutine.title,
          setsCount,
          reps: Number(reps) || 10,
          weightKg: Number(weight) || 0
        });
      } else if (onLogSet) {
        for (let i = 0; i < setsCount; i++) {
          await onLogSet({
            exercise,
            sessionId,
            routineTitle: currentRoutine.title,
            reps,
            weightKg: weight
          });
        }
      }
      setRepsInput('');
      setWeightInput('');
      startRest(90);
    } catch (error) {
      Alert.alert('Sets not saved', error.message || 'Please try again.');
    } finally {
      setIsSavingSet(false);
    }
  };

  const handleAddExerciseToRoutine = async (exToAdd) => {
    const exists = rawExercises.some((e) => e.id === exToAdd.id);
    if (exists) {
      Alert.alert('Already Added', `${exToAdd.name} is already in this routine.`);
      return;
    }
    const updated = [...customExercises, exToAdd];
    setCustomExercises(updated);
    await saveDayCustomExercises(activeDayIndex, updated, userId);
    setShowAddModal(false);
    setAddSearch('');
    Alert.alert('Exercise Added 🎉', `${exToAdd.name} added to ${currentRoutine.dayName || 'this'} routine.`);
  };

  const handleCreateCustomExercise = async () => {
    if (!customName.trim()) {
      Alert.alert('Missing Name', 'Please enter an exercise name.');
      return;
    }
    const newEx = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      shortName: customName.trim().slice(0, 18),
      muscle: customMuscle,
      equipment: 'Free Weights',
      tagline: `${customMuscle} Move`,
      sets: [
        { num: 1, reps: 10, weight: 20, done: false },
        { num: 2, reps: 10, weight: 20, done: false },
        { num: 3, reps: 10, weight: 20, done: false }
      ]
    };
    await handleAddExerciseToRoutine(newEx);
    setCustomName('');
  };

  // Handle Close / Exit Modal (Save partial progress if in progress!)
  const handleCloseModal = () => {
    if (workoutState === 'IN_PROGRESS') {
      const completedCount = Object.values(completedExerciseIds).filter(Boolean).length;
      if (onSaveProgress) {
        onSaveProgress({
          routineTitle: currentRoutine.title,
          sessionId,
          completedCount,
          totalCount: exerciseCount,
          percentComplete: Math.round((completedCount / (exerciseCount || 1)) * 100),
          completedExerciseIds,
          elapsedSeconds,
          workoutStartedAt,
          routine: currentRoutine
        });
      }
    }
    onClose();
  };

  // Android Back Handler & Exit Safety Confirmation
  const handleBackPress = () => {
    if (showFinishConfirm) {
      setShowFinishConfirm(false);
      return true;
    }
    if (showAddModal) {
      setShowAddModal(false);
      return true;
    }
    if (workoutState === 'IN_PROGRESS' && sessionSets.length > 0) {
      Alert.alert(
        'Workout in progress',
        'Your logged sets are saved on this device. Do you want to pause and exit?',
        [
          { text: 'Keep Working Out', style: 'cancel' },
          {
            text: 'Save & Exit',
            style: 'destructive',
            onPress: () => handleCloseModal()
          }
        ]
      );
      return true;
    }
    handleCloseModal();
    return true;
  };

  useAndroidBackHandler(handleBackPress, BACK_PRIORITY.WORKOUT_MODAL, visible);

  // Finish Workout Confirmed
  const handleConfirmFinish = () => {
    setShowFinishConfirm(false);
    const completedList = rawExercises.filter((ex) => setsForExercise(ex.id).length > 0);
    if (completedList.length === 0) {
      Alert.alert('No sets logged', 'Log at least one real set before saving this workout.');
      return;
    }

    if (onFinishWorkout) {
      onFinishWorkout({
        routineTitle: currentRoutine.title,
        durationSeconds: elapsedSeconds,
        exercisesCompleted: completedList.length,
        completedExercises: completedList,
        sessionId
      });
      skipRest();
    }
    onClose();
  };

  const completedCount = Object.values(completedExerciseIds).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / (exerciseCount || 1)) * 100);

  // Helper to render section icon
  const renderSectionIcon = (iconName, color = '#EF4444', size = 14) => {
    switch (iconName) {
      case 'Flame':
        return <Flame size={size} color={color} />;
      case 'Zap':
        return <Zap size={size} color={color} />;
      case 'Activity':
        return <Activity size={size} color={color} />;
      case 'Moon':
        return <Moon size={size} color={color} />;
      case 'Shield':
        return <Shield size={size} color={color} />;
      default:
        return <Dumbbell size={size} color={color} />;
    }
  };

  // Get sections to render based on current routine
  const sectionsToRender = currentRoutine.sections && currentRoutine.sections.length > 0
    ? currentRoutine.sections
    : [
        {
          name: currentRoutine.focus || 'Main Exercises',
          icon: 'Flame',
          exercises: rawExercises
        }
      ];

  const filteredSections = selectedSectionFilter === 'ALL'
    ? sectionsToRender
    : sectionsToRender.filter((s) => s.name === selectedSectionFilter);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleBackPress}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 🏋️ 1. Full-Bleed Athlete Photo Header */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={currentRoutine.image || require('../../assets/workouts/hero_monday.jpg')}
              style={styles.heroImage}
              fadeDuration={0}
            />

            {/* Smooth Linear Vignette Gradient */}
            <LinearGradient
              colors={['rgba(9, 9, 11, 0.45)', 'transparent', 'rgba(9, 9, 11, 0.75)', '#0F0F11']}
              locations={[0, 0.3, 0.75, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Floating Top Bar Buttons */}
            <View style={styles.floatingTopBar}>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.circularGlassBtn}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.topRightBadge}>
                <Text style={styles.topRightBadgeText}>
                  {`Day ${currentRoutine.dayNum || 1} · ${currentRoutine.dayName || 'Monday'}`}
                </Text>
              </View>
            </View>

            {/* Title & Badges Overlaid at Bottom of Photo */}
            <View style={styles.photoOverlayContent}>
              <View style={styles.intensityBadgeRow}>
                <View
                  style={[
                    styles.intensityBadge,
                    {
                      backgroundColor: currentRoutine.isRest
                        ? 'rgba(14, 165, 233, 0.25)'
                        : currentRoutine.intensity === 'Low'
                        ? 'rgba(16, 185, 129, 0.25)'
                        : 'rgba(239, 68, 68, 0.28)'
                    }
                  ]}
                >
                  {currentRoutine.isRest ? (
                    <Moon size={12} color="#38BDF8" style={{ marginRight: 5 }} />
                  ) : currentRoutine.intensity === 'Low' ? (
                    <Activity size={12} color="#10B981" style={{ marginRight: 5 }} />
                  ) : (
                    <Flame size={12} color="#EF4444" style={{ marginRight: 5 }} />
                  )}
                  <Text
                    style={[
                      styles.intensityBadgeText,
                      {
                        color: currentRoutine.isRest
                          ? '#38BDF8'
                          : currentRoutine.intensity === 'Low'
                          ? '#10B981'
                          : '#EF4444'
                      }
                    ]}
                  >
                    {currentRoutine.intensity || 'High Intensity'}
                  </Text>
                </View>
              </View>

              <Text style={styles.workoutMainTitle}>{currentRoutine.title}</Text>
              <Text style={styles.workoutSubHeader}>{currentRoutine.splitLabel}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.frostedMetaBadge}>
                  <Zap size={13} color="#FBBF24" style={{ marginRight: 5 }} />
                  <Text style={styles.frostedMetaText}>{exerciseCount} exercises</Text>
                </View>

                <View style={styles.frostedMetaBadge}>
                  <Clock size={13} color="#A1A1AA" style={{ marginRight: 5 }} />
                  <Text style={styles.frostedMetaText}>{estimatedDuration} min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 📅 2. Interactive Horizontal Day Selector (Monday - Sunday) */}
          <View style={styles.daySelectorContainer}>
            <Text style={styles.selectorSectionLabel}>SCHEDULE · MONDAY TO SUNDAY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysScrollTrack}
            >
              {WEEKLY_ROUTINES_DB.map((r, idx) => {
                const isSelected = activeDayIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.daySelectorPill,
                      isSelected && styles.daySelectorPillActive
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setActiveDayIndex(idx);
                      if (onSelectRoutine) onSelectRoutine(r);
                    }}
                  >
                    <Text
                      style={[
                        styles.daySelectorCode,
                        isSelected && styles.daySelectorCodeActive
                      ]}
                    >
                      {r.dayCode}
                    </Text>
                    <Text
                      style={[
                        styles.daySelectorName,
                        isSelected && styles.daySelectorNameActive
                      ]}
                    >
                      {r.dayName.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 🔴 3. Dynamic CTA: "Start Workout" OR "In Progress" */}
          <View style={styles.ctaSectionContainer}>
            {workoutState === 'PREVIEW' ? (
              <TouchableOpacity
                style={styles.startWorkoutBtn}
                activeOpacity={0.88}
                onPress={startWorkoutSession}
              >
                <LinearGradient
                  colors={['#EF4444', '#991B1B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startWorkoutGradient}
                >
                  <Flame size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.startWorkoutBtnText}>Start Workout</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.inProgressWrapper}>
                {/* Frosted "In progress" Capsule with Progress Ring/Text */}
                <View style={styles.inProgressCapsuleBtn}>
                  <Text style={styles.inProgressBtnText}>
                    In Progress • {completedCount}/{exerciseCount} ({percentComplete}%)
                  </Text>
                  <Text style={styles.inProgressTimerText}>
                    ⏱️ {formatTimer(elapsedSeconds)}
                  </Text>
                </View>

                {/* Rest Timer Banner if Active */}
                {restTimerSeconds > 0 && (
                  <View style={styles.restTimerBanner}>
                    <Clock size={14} color="#38BDF8" style={{ marginRight: 6 }} />
                    <Text style={styles.restTimerText}>REST: {restTimerSeconds}s</Text>
                    <TouchableOpacity
                      onPress={() => skipRest()}
                      style={styles.skipRestBtn}
                    >
                      <Text style={styles.skipRestBtnText}>Skip</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Finish Workout CTA Button */}
                <TouchableOpacity
                  style={styles.finishWorkoutBtn}
                  activeOpacity={0.85}
                  onPress={() => setShowFinishConfirm(true)}
                >
                  <Text style={styles.finishWorkoutBtnText}>Finish Workout 🏆</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Muscle Group Section Filter Pills */}
            {sectionsToRender.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sectionFilterTrack}
              >
                <TouchableOpacity
                  style={[
                    styles.sectionFilterChip,
                    selectedSectionFilter === 'ALL' && styles.sectionFilterChipActive
                  ]}
                  onPress={() => setSelectedSectionFilter('ALL')}
                >
                  <Layers size={12} color={selectedSectionFilter === 'ALL' ? '#FFFFFF' : '#A1A1AA'} style={{ marginRight: 5 }} />
                  <Text
                    style={[
                      styles.sectionFilterChipText,
                      selectedSectionFilter === 'ALL' && styles.sectionFilterChipTextActive
                    ]}
                  >
                    All Sections ({exerciseCount})
                  </Text>
                </TouchableOpacity>

                {sectionsToRender.map((sec, secIdx) => {
                  const isSecActive = selectedSectionFilter === sec.name;
                  return (
                    <TouchableOpacity
                      key={secIdx}
                      style={[
                        styles.sectionFilterChip,
                        isSecActive && styles.sectionFilterChipActive
                      ]}
                      onPress={() => setSelectedSectionFilter(sec.name)}
                    >
                      {renderSectionIcon(sec.icon, isSecActive ? '#FFFFFF' : '#A1A1AA', 12)}
                      <Text
                        style={[
                          styles.sectionFilterChipText,
                          isSecActive && styles.sectionFilterChipTextActive,
                          { marginLeft: 5 }
                        ]}
                      >
                        {sec.name} ({sec.exercises?.length || 0})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 📋 4. Dedicated Muscle-Group Sections & Exercise Cards */}
          <View style={styles.sectionsContainer}>
            {filteredSections.map((sec, secIdx) => (
              <View key={secIdx} style={styles.sectionBlock}>
                {/* Section Header */}
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionIconBadge}>
                    {renderSectionIcon(sec.icon, '#EF4444', 14)}
                  </View>
                  <Text style={styles.sectionTitleText}>{sec.name}</Text>
                  <View style={styles.sectionCountPill}>
                    <Text style={styles.sectionCountText}>
                      {sec.exercises?.length || 0} exercises
                    </Text>
                  </View>
                </View>

                {/* Exercises in this section */}
                <View style={styles.exerciseQueueList}>
                  {(sec.exercises || []).map((item, index) => {
                    const exerciseId = item.id || String(index);
                    const isCompleted = !!completedExerciseIds[exerciseId];
                    const totalSets = item.sets?.length || 3;
                    const repRange = item.sets?.[0]?.reps || 10;
                    const loggedSets = setsForExercise(exerciseId);

                    return (
                      <React.Fragment key={exerciseId}>
                        <TouchableOpacity
                          style={[
                            styles.exerciseCard,
                            isCompleted && styles.exerciseCardCompleted
                          ]}
                          activeOpacity={workoutState === 'IN_PROGRESS' ? 0.75 : 1}
                          onPress={() => {
                            if (workoutState === 'IN_PROGRESS') {
                              setLoggingExerciseId(loggingExerciseId === exerciseId ? null : exerciseId);
                              setRepsInput('');
                              setWeightInput('');
                            }
                          }}
                        >
                          {/* Top-Left Metallic "✓ Completed" Badge */}
                          {isCompleted && (
                            <View style={styles.completedBadgePill}>
                              <Check size={11} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                              <Text style={styles.completedBadgeText}>Completed</Text>
                            </View>
                          )}

                          <View style={styles.cardInnerRow}>
                            {/* Left: 3D Anatomical Diagram Thumbnail */}
                            <View style={styles.diagramContainer}>
                              <Image
                                source={item.image || currentRoutine.image || require('../../assets/workouts/hero_monday.jpg')}
                                style={styles.diagramImage}
                                resizeMode="cover"
                              />
                            </View>

                            {/* Right: Exercise Prescription Details */}
                            <View style={styles.cardDetailsCol}>
                              <Text style={styles.cardExerciseName}>{item.name}</Text>
                              <Text style={styles.cardMuscleSubtitle}>
                                {item.tagline || item.muscle || sec.name}
                              </Text>

                              <View style={styles.cardSetsRow}>
                                <Text style={styles.cardSetsText}>
                                  Target: {totalSets} sets · {repRange} reps
                                </Text>
                              </View>

                              {workoutState === 'IN_PROGRESS' && (
                                <Text style={styles.cardRestText}>{loggedSets.length}/{totalSets} sets logged · Tap to add a set</Text>
                              )}

                              <Text style={styles.cardRestText}>90s rest • {item.tempo || 'Controlled'}</Text>
                            </View>

                            {/* Right Action / Status Checkbox if in Progress */}
                            {workoutState === 'IN_PROGRESS' && (
                              <View
                                style={[
                                  styles.actionCheckboxCircle,
                                  isCompleted && styles.actionCheckboxCircleCompleted
                                ]}
                              >
                                {isCompleted ? (
                                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                ) : (
                                  <View style={styles.actionCheckboxDot} />
                                )}
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>

                        {workoutState === 'IN_PROGRESS' && loggingExerciseId === exerciseId && (
                          <View style={styles.setLogger}>
                            <Text style={styles.setLoggerTitle}>Log set {loggedSets.length + 1} · {item.shortName || item.name}</Text>
                            <Text style={styles.setLoggerHint}>Enter what you actually completed. Weight is optional for bodyweight moves.</Text>
                            <View style={styles.setInputRow}>
                              <View style={styles.setInputWrap}>
                                <Text style={styles.setInputLabel}>REPS</Text>
                                <TextInput value={repsInput} onChangeText={setRepsInput} keyboardType="number-pad" placeholder="e.g. 10" placeholderTextColor="#777780" style={styles.setInput} accessibilityLabel="Completed reps" />
                              </View>
                              <View style={styles.setInputWrap}>
                                <Text style={styles.setInputLabel}>WEIGHT · KG</Text>
                                <TextInput value={weightInput} onChangeText={setWeightInput} keyboardType="decimal-pad" placeholder="Optional" placeholderTextColor="#777780" style={styles.setInput} accessibilityLabel="Weight in kilograms" />
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                              <TouchableOpacity style={[styles.saveSetButton, { flex: 1 }, isSavingSet && { opacity: 0.5 }]} disabled={isSavingSet} onPress={() => handleSaveSet(item)} accessibilityRole="button">
                                <Text style={styles.saveSetText}>{isSavingSet ? 'Saving…' : 'Save 1 Set'}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.saveSetButton, { flex: 1.2, backgroundColor: '#EF4444' }, isSavingSet && { opacity: 0.5 }]} disabled={isSavingSet} onPress={() => handleSaveBatchSets(item, 3)} accessibilityRole="button">
                                <Text style={styles.saveSetText}>⚡ Log 3 Sets ({3 * (parseInt(repsInput, 10) || 10)} reps)</Text>
                              </TouchableOpacity>
                            </View>
                            {loggedSets.map((set, setIndex) => (
                              <Text key={set.id} style={styles.loggedSetText}>Set {setIndex + 1}: {set.reps} reps{set.weightKg > 0 ? ` · ${set.weightKg} kg` : ' · bodyweight'}{set.synced ? '' : ' · sync pending'}</Text>
                            ))}
                          </View>
                        )}

                        {/* ⏱️ Dedicated Rest Recovery Item between exercises */}
                        {index < (sec.exercises.length - 1) && (
                          <RestRecoveryItem
                            restDuration={90}
                            autoStart={false}
                            label={`REST (${index + 1}/${sec.exercises.length})`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* ➕ Add Exercise Button */}
            <TouchableOpacity
              style={styles.addExerciseToWorkoutBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
              <Text style={styles.addExerciseToWorkoutBtnText}>
                + Add Exercise to {currentRoutine.dayName || 'Workout'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 🛡️ Workout Completion Confirmation Dialog */}
        <Modal visible={showFinishConfirm} animationType="fade" transparent onRequestClose={() => setShowFinishConfirm(false)}>
          <View style={styles.confirmModalOverlay}>
            <View style={styles.confirmModalBox}>
              <View style={styles.trophyCircleBadge}>
                <Trophy size={24} color="#FBBF24" />
              </View>

              <Text style={styles.confirmModalTitle}>Complete this workout?</Text>
              <Text style={styles.confirmModalSubtitle}>
                {completedCount} of {exerciseCount} exercises logged • {formatTimer(elapsedSeconds)}
              </Text>

              <View style={styles.confirmActionsRow}>
                <TouchableOpacity
                  style={styles.confirmCancelBtn}
                  onPress={() => setShowFinishConfirm(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmFinishBtn}
                  onPress={handleConfirmFinish}
                  activeOpacity={0.8}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 6 }} />
                  <Text style={styles.confirmFinishText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ➕ Add Exercise Modal */}
        {showAddModal && (
          <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
            <View style={styles.addModalOverlay}>
              <View style={styles.addModalBox}>
                <View style={styles.addModalHeaderRow}>
                  <Text style={styles.addModalTitle}>Add Exercise to {currentRoutine.dayName || 'Day'}</Text>
                  <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.addModalCloseBtn}>
                    <X size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.addModalSearchBox}>
                  <Search size={16} color="#8A8A94" />
                  <TextInput
                    style={styles.addModalSearchInput}
                    value={addSearch}
                    onChangeText={setAddSearch}
                    placeholder="Search 250+ exercises"
                    placeholderTextColor="#777780"
                  />
                </View>

                {/* Exercise List */}
                <ScrollView style={{ maxHeight: 260, marginVertical: 10 }}>
                  {EXERCISES_DB.filter((e) => {
                    const s = addSearch.trim().toLowerCase();
                    const notAlready = !rawExercises.some((re) => re.id === e.id);
                    return notAlready && (!s || `${e.name} ${e.muscle}`.toLowerCase().includes(s));
                  }).slice(0, 15).map((ex) => (
                    <TouchableOpacity
                      key={ex.id}
                      style={styles.addModalItemRow}
                      onPress={() => handleAddExerciseToRoutine(ex)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.addModalItemMuscle}>{ex.muscle}</Text>
                        <Text style={styles.addModalItemName}>{ex.name}</Text>
                      </View>
                      <View style={styles.addModalItemAddCircle}>
                        <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Custom Exercise Section */}
                <View style={styles.customAddSection}>
                  <Text style={styles.customAddLabel}>OR TYPE CUSTOM MOVE</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    <TextInput
                      style={[styles.addModalSearchInput, { flex: 1, height: 38, backgroundColor: '#191920', borderRadius: 8, paddingHorizontal: 10 }]}
                      value={customName}
                      onChangeText={setCustomName}
                      placeholder="e.g. Incline Bench"
                      placeholderTextColor="#777780"
                    />
                    <TouchableOpacity
                      style={styles.customAddSubmitBtn}
                      onPress={handleCreateCustomExercise}
                    >
                      <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 70
  },
  heroImageWrapper: {
    width: '100%',
    height: 380,
    position: 'relative',
    backgroundColor: '#141416'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  floatingTopBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 38,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 30
  },
  circularGlassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(28, 28, 32, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topRightBadge: {
    backgroundColor: 'rgba(28, 28, 32, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14
  },
  topRightBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  photoOverlayContent: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    zIndex: 20
  },
  intensityBadgeRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  intensityBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2
  },
  workoutSubHeader: {
    color: '#D4D4D8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  frostedMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  frostedMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // 📅 Day Selector
  daySelectorContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8
  },
  selectorSectionLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  daysScrollTrack: {
    flexDirection: 'row',
    gap: 8
  },
  daySelectorPill: {
    width: 46,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2A30',
    justifyContent: 'center',
    alignItems: 'center'
  },
  daySelectorPillActive: {
    backgroundColor: '#EF4444',
    borderColor: '#F87171',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6
  },
  daySelectorCode: {
    color: '#71717A',
    fontSize: 14,
    fontWeight: '900'
  },
  daySelectorCodeActive: {
    color: '#FFFFFF'
  },
  daySelectorName: {
    color: '#52525B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  },
  daySelectorNameActive: {
    color: '#FFFFFF'
  },

  // 🔴 CTA & Filter section
  ctaSectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10
  },
  startWorkoutBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  startWorkoutGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  startWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  inProgressWrapper: {
    gap: 10
  },
  inProgressCapsuleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14
  },
  inProgressBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  inProgressTimerText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '900'
  },
  restTimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderWidth: 1,
    borderColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  restTimerText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
    flex: 1
  },
  skipRestBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  skipRestBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  finishWorkoutBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center'
  },
  finishWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  sectionFilterTrack: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14
  },
  sectionFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2A30',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12
  },
  sectionFilterChipActive: {
    backgroundColor: '#27272A',
    borderColor: '#EF4444'
  },
  sectionFilterChipText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // 📋 Muscle-group sections
  sectionsContainer: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 22
  },
  sectionBlock: {
    gap: 10
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  sectionIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  sectionTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    flex: 1
  },
  sectionCountPill: {
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2A30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  sectionCountText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  exerciseQueueList: {
    gap: 10
  },
  exerciseCard: {
    backgroundColor: '#16161A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#24242A',
    padding: 12,
    position: 'relative'
  },
  exerciseCardCompleted: {
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.08)'
  },
  completedBadgePill: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 10
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  cardInnerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  diagramContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#1F1F24',
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative'
  },
  diagramImage: {
    width: '100%',
    height: '100%'
  },

  cardDetailsCol: {
    flex: 1
  },
  cardExerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2
  },
  cardMuscleSubtitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  cardSetsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardSetsText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700'
  },
  cardRestText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  actionCheckboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  actionCheckboxCircleCompleted: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E'
  },
  actionCheckboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3F3F46'
  },

  // 🛡️ Confirmation Modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  confirmModalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2A2A30',
    alignItems: 'center'
  },
  trophyCircleBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  confirmModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  confirmModalSubtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  confirmCancelBtn: {
    flex: 1,
    backgroundColor: '#27272A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmCancelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  confirmFinishBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  setLogger: { marginTop: 8, marginBottom: 14, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#303036', backgroundColor: '#1B1B20' },
  setLoggerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 5 },
  setLoggerHint: { color: '#A1A1AA', fontSize: 12, lineHeight: 18, marginBottom: 15 },
  setInputRow: { flexDirection: 'row', gap: 10 },
  setInputWrap: { flex: 1 },
  setInputLabel: { color: '#A1A1AA', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  setInput: { height: 48, borderWidth: 1, borderColor: '#3C3C44', borderRadius: 11, paddingHorizontal: 12, backgroundColor: '#111114', color: '#FFFFFF', fontSize: 16 },
  saveSetButton: { marginTop: 12, backgroundColor: '#EF4444', borderRadius: 11, minHeight: 46, justifyContent: 'center', alignItems: 'center' },
  saveSetText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  loggedSetText: { color: '#CACAD0', fontSize: 12, marginTop: 9 },
  confirmFinishText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  addExerciseToWorkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1E1E26',
    borderWidth: 1,
    borderColor: '#343442',
    marginVertical: 18,
    marginHorizontal: 16
  },
  addExerciseToWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  addModalBox: {
    backgroundColor: '#16161A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2F2F38',
    maxHeight: '85%'
  },
  addModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  addModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  addModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26262E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addModalSearchBox: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B2B30',
    backgroundColor: '#19191D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8
  },
  addModalSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 0
  },
  addModalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C22',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D37'
  },
  addModalItemMuscle: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  addModalItemName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  addModalItemAddCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customAddSection: {
    backgroundColor: '#1E1E26',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#343442'
  },
  customAddLabel: {
    color: '#8A8A94',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  customAddSubmitBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  }
});
