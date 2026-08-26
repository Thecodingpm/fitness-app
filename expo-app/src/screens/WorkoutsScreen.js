import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Play,
  Check,
  X,
  Zap,
  Clock,
  Dumbbell,
  Trophy,
  Flame,
  Calendar,
  Sparkles
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PROGRAMS_DB = [
  {
    id: 'prog-1',
    title: 'Beginner 3-Day Hypertrophy',
    sub: '3 days/week • 45 mins • Perfect for building solid foundation',
    xp: 200,
    exercisesCount: 4,
    durationMin: 45
  },
  {
    id: 'prog-2',
    title: 'Push / Pull / Legs (PPL)',
    sub: '6 days/week • 60 mins • Classic aesthetic muscle builder',
    xp: 350,
    exercisesCount: 5,
    durationMin: 60
  },
  {
    id: 'prog-3',
    title: 'Upper / Lower Power Split',
    sub: '4 days/week • 50 mins • Explosive strength & hypertrophy',
    xp: 300,
    exercisesCount: 4,
    durationMin: 50
  }
];

export function WorkoutsScreen({
  userName = 'Athlete',
  activeWorkoutProgress = null,
  dailyWorkoutStatuses = {},
  onUpdateDailyStatus,
  onStartWorkout,
  onResumeWorkout,
  onOpenConsistency
}) {
  const now = new Date();
  const todayDayIndex = now.getDay(); // 0 = Sun, 1 = Mon... 6 = Sat
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Currently selected day in the 7-day strip (defaults to today)
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayDayIndex);

  // Compute start of current week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Calculate selected date object and string
  const selectedDateObj = new Date(startOfWeek);
  selectedDateObj.setDate(startOfWeek.getDate() + selectedDayIndex);
  const selectedDateKey = `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}`;

  const selectedRoutine = WEEKLY_ROUTINES_DB[selectedDayIndex] || WEEKLY_ROUTINES_DB[0];

  // Double-tap tracking refs
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);
  const dayBoxLastTapRef = useRef({});
  const dayBoxSingleTapTimerRef = useRef({});

  // Status Action / Confirmation Modals
  const [modalType, setModalType] = useState(null); // 'CONFIRM_COMPLETE' | 'CONFIRM_MISSED' | 'CHANGE_STATUS'

  // Current unified status for selected date
  const rawStatus = dailyWorkoutStatuses[selectedDateKey];
  const currentStatus = rawStatus || (selectedDateKey === todayKey && activeWorkoutProgress ? 'in_progress' : 'unmarked');

  const isCompleted = currentStatus === 'completed';
  const isMissed = currentStatus === 'missed';
  const isInProgress = currentStatus === 'in_progress';
  const isUnmarked = !isCompleted && !isMissed && !isInProgress;

  // 👆 Double Tap Handler for Primary Workout Box
  const handleWorkoutBoxPress = () => {
    const tapNow = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (tapNow - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap Detected!
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapRef.current = 0;
      if (onOpenConsistency) onOpenConsistency(selectedDateKey);
    } else {
      lastTapRef.current = tapNow;
      singleTapTimerRef.current = setTimeout(() => {
        if (isCompleted || isMissed) {
          setModalType('CHANGE_STATUS');
        } else if (isInProgress && onResumeWorkout) {
          onResumeWorkout();
        } else if (onStartWorkout) {
          onStartWorkout(selectedRoutine);
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  // 👆 Double Tap / Single Tap Handler for 7 Day Boxes (Saturday, Sunday, Monday, etc.)
  const handleDayBoxPress = (dayIdx, dayDateStr) => {
    const tapNow = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const prevTap = dayBoxLastTapRef.current[dayIdx] || 0;

    if (tapNow - prevTap < DOUBLE_TAP_DELAY) {
      // 🚀 DOUBLE TAP on day box! Cancel single tap and open Consistency page focused on this day
      if (dayBoxSingleTapTimerRef.current[dayIdx]) {
        clearTimeout(dayBoxSingleTapTimerRef.current[dayIdx]);
        dayBoxSingleTapTimerRef.current[dayIdx] = null;
      }
      dayBoxLastTapRef.current[dayIdx] = 0;
      if (onOpenConsistency) {
        onOpenConsistency(dayDateStr);
      }
    } else {
      // Single tap: select this day to show its routine in the workout box
      dayBoxLastTapRef.current[dayIdx] = tapNow;
      dayBoxSingleTapTimerRef.current[dayIdx] = setTimeout(() => {
        setSelectedDayIndex(dayIdx);
      }, DOUBLE_TAP_DELAY);
    }
  };

  // ✅ Confirm Complete
  const handleConfirmComplete = () => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(selectedDateKey, 'completed');
    }
    setModalType(null);
  };

  // ❌ Confirm Missed
  const handleConfirmMissed = () => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(selectedDateKey, 'missed');
    }
    setModalType(null);
  };

  // 🔄 Clear / Reset Status
  const handleClearStatus = () => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(selectedDateKey, 'unmarked');
    }
    setModalType(null);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.pageTitle}>Workout Sessions</Text>
      <Text style={styles.pageSub}>Manage your daily routine & active status for {userName}</Text>

      {/* ======================================================== */}
      {/* 📅 7 DAYS OF THE WEEK STRIP (MONDAY - SUNDAY) */}
      {/* ======================================================== */}
      <View style={styles.daysSectionHeaderRow}>
        <Text style={styles.sectionHeader}>DAYS OF THE WEEK</Text>
        <Text style={styles.doubleTapTipText}>Double-tap for Consistency ↗</Text>
      </View>

      <View style={styles.sevenDaysContainer}>
        {WEEKLY_ROUTINES_DB.map((item, idx) => {
          const dObj = new Date(startOfWeek);
          dObj.setDate(startOfWeek.getDate() + idx);
          const dKey = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;

          const dayStatus = dailyWorkoutStatuses[dKey] || (idx === todayDayIndex && activeWorkoutProgress ? 'in_progress' : 'unmarked');
          const isDayCompleted = dayStatus === 'completed';
          const isDayMissed = dayStatus === 'missed';
          const isDayInProgress = dayStatus === 'in_progress';
          const isDaySelected = selectedDayIndex === idx;

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayBox,
                isDaySelected && styles.dayBoxSelected,
                isDayCompleted && styles.dayBoxCompleted,
                isDayMissed && styles.dayBoxMissed,
                isDayInProgress && styles.dayBoxInProgress
              ]}
              activeOpacity={0.75}
              onPress={() => handleDayBoxPress(idx, dKey)}
            >
              {/* Day Code (M, T, W, T, F, S, S) */}
              <Text style={[styles.dayBoxCode, isDaySelected && styles.dayBoxCodeSelected]}>
                {item.dayCode}
              </Text>

              {/* Day Number */}
              <Text style={[styles.dayBoxNum, isDaySelected && styles.dayBoxNumSelected]}>
                {dObj.getDate()}
              </Text>

              {/* Status Indicator Icon */}
              <View style={styles.dayBoxStatusCircle}>
                {isDayCompleted ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : isDayMissed ? (
                  <X size={12} color="#EF4444" strokeWidth={2.8} />
                ) : isDayInProgress ? (
                  <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <View style={styles.unmarkedEmptySquare} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ======================================================== */}
      {/* 🏋️ 1. PRIMARY WORKOUT BOX (WITH SUBTLE RED ACCENT) */}
      {/* ======================================================== */}
      <View style={[styles.daysSectionHeaderRow, { marginTop: 24 }]}>
        <Text style={styles.sectionHeader}>
          {selectedDayIndex === todayDayIndex
            ? "TODAY'S WORKOUT"
            : `${selectedRoutine.dayName.toUpperCase()}'S WORKOUT`}
        </Text>
        <Text style={styles.selectedDateSubText}>
          {selectedDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.todayWorkoutCard,
          isCompleted && styles.cardCompleted,
          isMissed && styles.cardMissed,
          isInProgress && styles.cardInProgress
        ]}
        activeOpacity={0.9}
        onPress={handleWorkoutBoxPress}
      >
        {/* 🔴 Radiant Light & Professional Red Theme Gradient Background */}
        <LinearGradient
          colors={['#201014', '#2C1219', '#3B131E', '#4E1425']}
          locations={[0, 0.35, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        {/* Subtle Top-Left Ambient Crimson Light Highlight */}
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.22)', 'rgba(185, 28, 28, 0.06)', 'transparent']}
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* Top Badges Row */}
        <View style={styles.cardHeaderRow}>
          {/* Status Badge Pill */}
          <View
            style={[
              styles.statusPill,
              isCompleted && styles.statusPillCompleted,
              isMissed && styles.statusPillMissed,
              isInProgress && styles.statusPillInProgress,
              isUnmarked && styles.statusPillUnmarked
            ]}
          >
            {isCompleted ? (
              <Check size={12} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 5 }} />
            ) : isMissed ? (
              <X size={12} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 5 }} />
            ) : isInProgress ? (
              <Play size={10} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 5 }} />
            ) : (
              <Calendar size={12} color="#A1A1AA" style={{ marginRight: 5 }} />
            )}

            <Text
              style={[
                styles.statusPillText,
                isMissed && { color: '#EF4444' },
                isUnmarked && { color: '#A1A1AA' }
              ]}
            >
              {isCompleted
                ? '✓ Completed'
                : isMissed
                ? '× Missed'
                : isInProgress
                ? `In Progress • ${activeWorkoutProgress?.percentComplete || 50}%`
                : '□ Unmarked'}
            </Text>
          </View>

          {/* Quick Change Status Pill if already completed/missed */}
          {(isCompleted || isMissed) ? (
            <TouchableOpacity
              style={styles.changeStatusPill}
              onPress={() => setModalType('CHANGE_STATUS')}
              activeOpacity={0.7}
            >
              <Text style={styles.changeStatusPillText}>Change Status</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.durationChip}>
              <Clock size={11} color="#71717A" style={{ marginRight: 4 }} />
              <Text style={styles.durationChipText}>
                {selectedRoutine.durationMin || 45} mins
              </Text>
            </View>
          )}
        </View>

        {/* Title & Workout Focus */}
        <Text style={styles.routineTitleText}>{selectedRoutine.title}</Text>
        <Text style={styles.routineFocusText}>
          {selectedRoutine.splitLabel || 'Hypertrophy Split'} · {selectedRoutine.exercises?.length || 4} Exercises
        </Text>

        {/* In-Progress Progress Bar */}
        {isInProgress && (
          <View style={styles.inProgressProgressBlock}>
            <View style={styles.progressLineBg}>
              <View
                style={[
                  styles.progressLineFill,
                  { width: `${Math.max(10, activeWorkoutProgress?.percentComplete || 50)}%` }
                ]}
              />
            </View>
            <View style={styles.inProgressInfoRow}>
              <Text style={styles.inProgressSubText}>
                {activeWorkoutProgress?.completedCount || 2} of {activeWorkoutProgress?.totalCount || 4} exercises completed
              </Text>
              <Text style={styles.inProgressPercentText}>
                {activeWorkoutProgress?.percentComplete || 50}%
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsContainer}>
          {isUnmarked && (
            <>
              {/* Primary Start Button */}
              <TouchableOpacity
                style={styles.primaryStartBtn}
                onPress={() => onStartWorkout && onStartWorkout(selectedRoutine)}
                activeOpacity={0.85}
              >
                <Play size={13} color="#000000" fill="#000000" style={{ marginRight: 6 }} />
                <Text style={styles.primaryStartBtnText}>Start Workout</Text>
              </TouchableOpacity>

              {/* Manual Mark Controls */}
              <View style={styles.manualControlsRow}>
                <TouchableOpacity
                  style={styles.manualCompleteBtn}
                  onPress={() => setModalType('CONFIRM_COMPLETE')}
                  activeOpacity={0.8}
                >
                  <Check size={13} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                  <Text style={styles.manualCompleteBtnText}>Mark Completed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.manualMissedBtn}
                  onPress={() => setModalType('CONFIRM_MISSED')}
                  activeOpacity={0.8}
                >
                  <X size={13} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 4 }} />
                  <Text style={styles.manualMissedBtnText}>Mark Missed</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {isInProgress && (
            <View style={styles.inProgressActionsRow}>
              <TouchableOpacity
                style={styles.resumeLargeBtn}
                onPress={onResumeWorkout}
                activeOpacity={0.85}
              >
                <Play size={13} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.resumeLargeBtnText}>RESUME</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manualFinishSmallBtn}
                onPress={() => setModalType('CONFIRM_COMPLETE')}
                activeOpacity={0.8}
              >
                <Check size={13} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                <Text style={styles.manualFinishSmallBtnText}>Complete</Text>
              </TouchableOpacity>
            </View>
          )}

          {isCompleted && (
            <View style={styles.completedBannerRow}>
              <Text style={styles.completedNoticeText}>
                ✓ Session completed · Double-tap card to view in Consistency
              </Text>
            </View>
          )}

          {isMissed && (
            <View style={styles.missedBannerRow}>
              <Text style={styles.missedNoticeText}>
                × Marked as missed · Tap card to change status
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* ======================================================== */}
      {/* 📋 2. MULTI-WEEK TRAINING PROGRAMS */}
      {/* ======================================================== */}
      <Text style={[styles.sectionHeader, { marginTop: 26 }]}>TRAINING PROGRAMS</Text>
      {PROGRAMS_DB.map((plan) => (
        <View key={plan.id} style={styles.planCard}>
          <View style={styles.planHeaderRow}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+{plan.xp} XP</Text>
            </View>
          </View>

          <Text style={styles.planSub}>{plan.sub}</Text>

          <View style={styles.planMetaRow}>
            <View style={styles.metaChip}>
              <Zap size={12} color="#FBBF24" style={{ marginRight: 4 }} />
              <Text style={styles.metaChipText}>{plan.exercisesCount} Exercises</Text>
            </View>
            <View style={styles.metaChip}>
              <Clock size={12} color="#A1A1AA" style={{ marginRight: 4 }} />
              <Text style={styles.metaChipText}>{plan.durationMin} Min</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.planBtn}
            onPress={() => onStartWorkout && onStartWorkout({ title: plan.title, durationMin: plan.durationMin })}
            activeOpacity={0.85}
          >
            <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.planBtnText}>Start Routine</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* ======================================================== */}
      {/* 🛡️ CONFIRMATION / CHANGE STATUS MODALS */}
      {/* ======================================================== */}
      {/* 1. Confirm Complete Modal */}
      <Modal visible={modalType === 'CONFIRM_COMPLETE'} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmBoxTitle}>Mark this workout as completed?</Text>
            <Text style={styles.confirmBoxSubtitle}>
              {selectedRoutine.dayName} ({selectedDateKey}): This will mark the session as complete and sync with Consistency.
            </Text>

            <View style={styles.confirmActionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalType(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmCompleteActionBtn}
                onPress={handleConfirmComplete}
                activeOpacity={0.8}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                <Text style={styles.confirmCompleteActionText}>✓ Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Confirm Missed Modal */}
      <Modal visible={modalType === 'CONFIRM_MISSED'} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmBoxTitle}>Mark this workout as missed?</Text>
            <Text style={styles.confirmBoxSubtitle}>
              {selectedRoutine.dayName} ({selectedDateKey}): This will record a missed session on your Consistency Tracker.
            </Text>

            <View style={styles.confirmActionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalType(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmMissedActionBtn}
                onPress={handleConfirmMissed}
                activeOpacity={0.8}
              >
                <X size={16} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 4 }} />
                <Text style={styles.confirmMissedActionText}>× Missed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. Change / Clear Status Modal */}
      <Modal visible={modalType === 'CHANGE_STATUS'} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmBoxTitle}>Change workout status?</Text>
            <Text style={styles.confirmBoxSubtitle}>
              Select a status for {selectedRoutine.dayName} ({selectedDateKey}):
            </Text>

            <View style={styles.statusOptionsList}>
              <TouchableOpacity
                style={styles.statusOptionBtnCompleted}
                onPress={handleConfirmComplete}
                activeOpacity={0.8}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 6 }} />
                <Text style={styles.statusOptionBtnText}>✓ Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusOptionBtnMissed}
                onPress={handleConfirmMissed}
                activeOpacity={0.8}
              >
                <X size={16} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 6 }} />
                <Text style={styles.statusOptionBtnMissedText}>× Missed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusOptionBtnClear}
                onPress={handleClearStatus}
                activeOpacity={0.8}
              >
                <Text style={styles.statusOptionBtnClearText}>Clear Status (Reset to □)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalType(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scrollContent: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 110
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  pageSub: {
    color: '#8E8E93',
    fontSize: 13,
    marginBottom: 16
  },
  daysSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  doubleTapTipText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600'
  },
  selectedDateSubText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },

  // 📅 7 Days Strip Container
  sevenDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  dayBox: {
    flex: 1,
    height: 72,
    backgroundColor: '#141416',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242428',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  dayBoxSelected: {
    borderColor: '#52525B',
    borderWidth: 1.5,
    backgroundColor: '#19191D'
  },
  dayBoxCompleted: {
    backgroundColor: '#16161A',
    borderColor: '#3F3F46'
  },
  dayBoxMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderColor: '#7F1D1D'
  },
  dayBoxInProgress: {
    backgroundColor: '#1C1313',
    borderColor: '#7A0000'
  },
  dayBoxCode: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800'
  },
  dayBoxCodeSelected: {
    color: '#FFFFFF'
  },
  dayBoxNum: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '800'
  },
  dayBoxNumSelected: {
    color: '#FFFFFF'
  },
  dayBoxStatusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  unmarkedEmptySquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#52525B'
  },

  // 🏋️ Today's Workout Card Styles (Subtle Deep Red Atmospheric Finish)
  todayWorkoutCard: {
    backgroundColor: '#1C0D11',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#541C25',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6
  },
  cardCompleted: {
    borderColor: '#52525B'
  },
  cardMissed: {
    borderColor: 'rgba(220, 38, 38, 0.55)'
  },
  cardInProgress: {
    borderColor: 'rgba(239, 68, 68, 0.5)'
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10
  },
  statusPillCompleted: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#52525B'
  },
  statusPillMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.45)'
  },
  statusPillInProgress: {
    backgroundColor: 'rgba(139, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.5)'
  },
  statusPillUnmarked: {
    backgroundColor: '#18181D',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  changeStatusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  changeStatusPillText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700'
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  durationChipText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  },
  routineTitleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 4
  },
  routineFocusText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16
  },
  inProgressProgressBlock: {
    marginBottom: 16
  },
  progressLineBg: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#27272A',
    overflow: 'hidden',
    marginBottom: 6
  },
  progressLineFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2
  },
  inProgressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inProgressSubText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600'
  },
  inProgressPercentText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800'
  },
  actionButtonsContainer: {
    gap: 8
  },
  primaryStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 12
  },
  primaryStartBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2
  },
  manualControlsRow: {
    flexDirection: 'row',
    gap: 8
  },
  manualCompleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  manualCompleteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  manualMissedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.35)'
  },
  manualMissedBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800'
  },
  inProgressActionsRow: {
    flexDirection: 'row',
    gap: 8
  },
  resumeLargeBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  resumeLargeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  manualFinishSmallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  manualFinishSmallBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  completedBannerRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  completedNoticeText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600'
  },
  missedBannerRow: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.35)'
  },
  missedNoticeText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600'
  },

  // 📋 Plan Cards
  planCard: {
    backgroundColor: '#141416',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#242428'
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  planTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  badge: {
    backgroundColor: '#1C1C20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C2C32'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  planSub: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16
  },
  planMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  metaChipText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '700'
  },
  planBtn: {
    flexDirection: 'row',
    backgroundColor: '#27272A',
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#3F3F46'
  },
  planBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },

  // 🛡️ Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  confirmBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A32',
    alignItems: 'center'
  },
  confirmBoxTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center'
  },
  confirmBoxSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#202026',
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303038'
  },
  cancelBtnText: {
    color: '#A1A1AA',
    fontWeight: '700',
    fontSize: 14
  },
  confirmCompleteActionBtn: {
    flex: 1,
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B',
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmCompleteActionText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14
  },
  confirmMissedActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(220, 38, 38, 0.14)',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmMissedActionText: {
    color: '#EF4444',
    fontWeight: '900',
    fontSize: 14
  },
  statusOptionsList: {
    gap: 8,
    width: '100%'
  },
  statusOptionBtnCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27272A',
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#52525B'
  },
  statusOptionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  statusOptionBtnMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.14)',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7F1D1D'
  },
  statusOptionBtnMissedText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 14
  },
  statusOptionBtnClear: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E22',
    height: 42,
    borderRadius: 12
  },
  statusOptionBtnClearText: {
    color: '#A1A1AA',
    fontWeight: '700',
    fontSize: 13
  }
});
