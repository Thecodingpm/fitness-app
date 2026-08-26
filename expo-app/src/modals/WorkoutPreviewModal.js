import React, { useState, useEffect } from 'react';
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
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Zap,
  Check,
  Dumbbell,
  Trophy,
  X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function WorkoutPreviewModal({
  visible,
  routine,
  savedProgress,
  onClose,
  onSaveProgress,
  onFinishWorkout
}) {
  if (!routine) return null;

  const rawExercises = routine.exercises || [];
  const exerciseCount = rawExercises.length;
  const estimatedDuration = routine.durationMin || 45;

  // ⚡ Workout State: 'PREVIEW' | 'IN_PROGRESS'
  const [workoutState, setWorkoutState] = useState('PREVIEW');
  const [completedExerciseIds, setCompletedExerciseIds] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  // Restore saved progress if resuming, or initialize
  useEffect(() => {
    if (visible) {
      if (savedProgress && savedProgress.routineTitle === routine.title) {
        setWorkoutState('IN_PROGRESS');
        setCompletedExerciseIds(savedProgress.completedExerciseIds || {});
        setElapsedSeconds(savedProgress.elapsedSeconds || 0);
        setRestTimerSeconds(0);
      } else {
        setWorkoutState('PREVIEW');
        setCompletedExerciseIds({});
        setElapsedSeconds(0);
        setRestTimerSeconds(0);
      }
    }
  }, [visible, routine, savedProgress]);

  // Elapsed Workout Timer
  useEffect(() => {
    let timer;
    if (visible && workoutState === 'IN_PROGRESS') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [visible, workoutState]);

  // Rest Countdown Timer
  useEffect(() => {
    let restTimer;
    if (restTimerSeconds > 0) {
      restTimer = setInterval(() => {
        setRestTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(restTimer);
  }, [restTimerSeconds]);

  // Format Elapsed Time (e.g. "04:32")
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle Exercise Completion
  const handleToggleComplete = (exerciseId) => {
    setCompletedExerciseIds((prev) => {
      const next = { ...prev, [exerciseId]: !prev[exerciseId] };
      // Start 90s rest timer if marked complete
      if (next[exerciseId]) {
        setRestTimerSeconds(90);
      }
      return next;
    });
  };

  // Handle Close / Exit Modal (Save partial progress if in progress!)
  const handleCloseModal = () => {
    if (workoutState === 'IN_PROGRESS') {
      const completedCount = Object.values(completedExerciseIds).filter(Boolean).length;
      if (onSaveProgress) {
        onSaveProgress({
          routineTitle: routine.title,
          completedCount,
          totalCount: exerciseCount,
          percentComplete: Math.round((completedCount / exerciseCount) * 100),
          completedExerciseIds,
          elapsedSeconds,
          routine
        });
      }
    }
    onClose();
  };

  // Finish Workout Confirmed
  const handleConfirmFinish = () => {
    setShowFinishConfirm(false);
    const completedCount = Object.values(completedExerciseIds).filter(Boolean).length;
    if (onFinishWorkout) {
      onFinishWorkout({
        routineTitle: routine.title,
        durationSeconds: Math.max(1200, elapsedSeconds),
        exercisesCompleted: completedCount || exerciseCount
      });
    }
    onClose();
  };

  const completedCount = Object.values(completedExerciseIds).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / exerciseCount) * 100);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCloseModal}
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
              source={routine.image || require('../../assets/athlete_hero.jpg')}
              style={styles.heroImage}
            />

            {/* Smooth Linear Vignette Gradient */}
            <LinearGradient
              colors={['rgba(9, 9, 11, 0.4)', 'transparent', 'rgba(9, 9, 11, 0.75)', '#09090B']}
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

              <TouchableOpacity
                style={styles.circularGlassBtn}
                activeOpacity={0.7}
              >
                <SlidersHorizontal size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Title & Badges Overlaid at Bottom of Photo */}
            <View style={styles.photoOverlayContent}>
              <Text style={styles.workoutMainTitle}>{routine.title}</Text>

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

          {/* 🔴 2. Dynamic CTA: "Start workout" OR "In progress" */}
          <View style={styles.ctaSectionContainer}>
            {workoutState === 'PREVIEW' ? (
              <TouchableOpacity
                style={styles.startWorkoutBtn}
                activeOpacity={0.88}
                onPress={() => setWorkoutState('IN_PROGRESS')}
              >
                <LinearGradient
                  colors={['#DC2626', '#991B1B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startWorkoutGradient}
                >
                  <Text style={styles.startWorkoutBtnText}>Start workout</Text>
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
                      onPress={() => setRestTimerSeconds(0)}
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

            {/* Week & Day Breadcrumb */}
            <Text style={styles.weekDayBreadcrumb}>
              Week 3 · Day {routine.dayNum || 2} · {routine.focus}
            </Text>
          </View>

          {/* 📋 3. Exercise Queue Cards */}
          <View style={styles.exerciseQueueList}>
            {rawExercises.map((item, index) => {
              const exerciseId = item.id || String(index);
              const isCompleted = !!completedExerciseIds[exerciseId];
              const totalSets = item.sets?.length || 4;
              const repRange = item.sets?.[0]?.reps || 8;
              const weightKg = item.sets?.[0]?.weight || 70;

              return (
                <TouchableOpacity
                  key={exerciseId}
                  style={[
                    styles.exerciseCard,
                    isCompleted && styles.exerciseCardCompleted
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleToggleComplete(exerciseId)}
                >
                  {/* Top-Left Metallic "✓ Completed" Badge */}
                  {isCompleted && (
                    <View style={styles.completedBadgePill}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                      <Text style={styles.completedBadgeText}>Completed</Text>
                    </View>
                  )}

                  <View style={styles.cardInnerRow}>
                    {/* Left: Diagram */}
                    <View style={styles.diagramContainer}>
                      {item.gifUrl || item.thumbUrl ? (
                        <Image
                          source={{ uri: item.gifUrl || item.thumbUrl }}
                          style={styles.diagramImage}
                        />
                      ) : (
                        <View style={styles.diagramPlaceholder}>
                          <Dumbbell size={24} color="#71717A" />
                        </View>
                      )}
                    </View>

                    {/* Right: Exercise Prescription Details */}
                    <View style={styles.cardDetailsCol}>
                      <Text style={styles.cardExerciseName}>{item.name}</Text>
                      <Text style={styles.cardMuscleSubtitle}>
                        {item.muscle || 'Chest, Triceps'}
                      </Text>

                      <View style={styles.cardSetsRow}>
                        <Text style={styles.cardSetsText}>
                          {totalSets} sets · {repRange} reps · {weightKg}kg
                        </Text>
                      </View>

                      <Text style={styles.cardRestText}>90s rest</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* 🛡️ Workout Completion Confirmation Dialog */}
        <Modal visible={showFinishConfirm} animationType="fade" transparent>
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 60
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
    zIndex: 30
  },
  circularGlassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(28, 28, 32, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoOverlayContent: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    zIndex: 10
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10
  },
  frostedMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 32, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  frostedMetaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  ctaSectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center'
  },
  startWorkoutBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8
  },
  startWorkoutGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  startWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  inProgressWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 10
  },
  inProgressCapsuleBtn: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#18181C',
    borderWidth: 1,
    borderColor: '#3F3F46',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inProgressBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  inProgressTimerText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700'
  },
  restTimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderWidth: 1,
    borderColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'space-between'
  },
  restTimerText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800'
  },
  skipRestBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  skipRestBtnText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700'
  },
  finishWorkoutBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  finishWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  weekDayBreadcrumb: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8
  },
  exerciseQueueList: {
    paddingHorizontal: 20,
    gap: 14
  },
  exerciseCard: {
    backgroundColor: '#141416',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 16,
    position: 'relative'
  },
  exerciseCardCompleted: {
    borderColor: '#52525B',
    backgroundColor: '#18181C'
  },
  completedBadgePill: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#52525B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  cardInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  diagramContainer: {
    width: 100,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#1E1E22',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 16
  },
  diagramImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  diagramPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardDetailsCol: {
    flex: 1
  },
  cardExerciseName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  cardMuscleSubtitle: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  cardSetsRow: {
    marginTop: 6
  },
  cardSetsText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '700'
  },
  cardRestText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },

  // 🛡️ Confirmation Modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  confirmModalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A32',
    alignItems: 'center'
  },
  trophyCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },
  confirmModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 6
  },
  confirmModalSubtitle: {
    color: '#8E8E93',
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
    height: 48,
    borderRadius: 14,
    backgroundColor: '#202026',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303038'
  },
  confirmCancelText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '700'
  },
  confirmFinishBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmFinishText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  }
});
