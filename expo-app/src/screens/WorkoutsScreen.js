import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  Sparkles,
  RotateCcw,
  Moon
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

  // 👆 Single Tap Handler for Primary Workout Box
  const handleWorkoutBoxPress = () => {
    if (isCompleted || isMissed) {
      setModalType('CHANGE_STATUS');
    } else if (isInProgress && onResumeWorkout) {
      onResumeWorkout();
    } else if (onStartWorkout) {
      onStartWorkout(selectedRoutine);
    }
  };

  // 👆 Single Tap Handler for 7 Day Boxes (Selects the routine for that day)
  const handleDayBoxPress = (dayIdx) => {
    setSelectedDayIndex(dayIdx);
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
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight || 28));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Ambient Dark-Red Glow Behind Top Status Bar */}
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.18)', 'rgba(239, 68, 68, 0.03)', 'transparent']}
        style={styles.bgGlow}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: safeTop + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Workout Sessions</Text>
        <Text style={styles.pageSub}>Manage your daily routine & active status for {userName}</Text>

      {/* ======================================================== */}
      {/* 📅 7 DAYS OF THE WEEK STRIP (MONDAY - SUNDAY) */}
      {/* ======================================================== */}
      <View style={styles.daysSectionHeaderRow}>
        <Text style={styles.sectionHeader}>DAYS OF THE WEEK</Text>
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
          const isDayToday = idx === todayDayIndex;
          const isDaySelected = selectedDayIndex === idx;

          return (
            <TouchableOpacity
              key={idx}
              style={styles.dayCol}
              activeOpacity={0.75}
              onPress={() => handleDayBoxPress(idx)}
            >
              {/* Top: Circular Status Node */}
              <View
                style={[
                  styles.matrixDayCell,
                  isDayCompleted && styles.matrixDayCellCompleted,
                  isDayMissed && styles.matrixDayCellMissed,
                  isDayInProgress && styles.matrixDayCellInProgress,
                  !isDayCompleted && !isDayMissed && !isDayInProgress && styles.matrixDayCellUnmarked,
                  isDayToday && styles.matrixDayCellToday,
                  isDaySelected && styles.matrixDayCellSelected
                ]}
              >
                {isDayCompleted ? (
                  <Check size={15} color="#FFFFFF" strokeWidth={3} />
                ) : isDayMissed ? (
                  <X size={15} color="#EF4444" strokeWidth={2.8} />
                ) : isDayInProgress ? (
                  <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                ) : isDayToday ? (
                  <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                ) : item.isRest ? (
                  <Moon size={12} color="#52525B" />
                ) : (
                  <Dumbbell size={12} color="#3F3F46" />
                )}
              </View>

              {/* Bottom: Day Code */}
              <Text
                style={[
                  styles.dayBoxCode,
                  isDayToday && styles.dayBoxCodeToday,
                  isDaySelected && styles.dayBoxCodeSelected
                ]}
              >
                {item.dayCode}
              </Text>
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
                ✓ Session completed · Tap card to change status
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
            <Text style={styles.confirmBoxTitle}>Change Workout Status</Text>
            <Text style={styles.confirmBoxSubtitle}>
              Select status for {selectedRoutine.dayName} ({selectedDateKey}):
            </Text>

            {(() => {
              const isCurrCompleted = isCompleted;
              const isCurrMissed = isMissed;
              const isCurrUnmarked = isUnmarked;

              return (
                <View style={styles.statusOptionsList}>
                  {/* Option 1: Completed (Single ✓ Icon) */}
                  <TouchableOpacity
                    style={[
                      styles.statusOptionBtnCompleted,
                      isCurrCompleted && styles.statusOptionBtnCompletedActive
                    ]}
                    onPress={handleConfirmComplete}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statusOptionLeft}>
                      <View style={[styles.statusIconCircle, styles.statusIconCircleCompleted, isCurrCompleted && styles.statusIconCircleActive]}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                      <Text style={[styles.statusOptionBtnText, isCurrCompleted && styles.statusOptionBtnTextActive]}>
                        Completed
                      </Text>
                    </View>
                    {isCurrCompleted && (
                      <View style={styles.activePillBadge}>
                        <Text style={styles.activePillText}>SELECTED</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Option 2: Missed (Single × Icon) */}
                  <TouchableOpacity
                    style={[
                      styles.statusOptionBtnMissed,
                      isCurrMissed && styles.statusOptionBtnMissedActive
                    ]}
                    onPress={handleConfirmMissed}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statusOptionLeft}>
                      <View style={[styles.statusIconCircle, styles.statusIconCircleMissed, isCurrMissed && styles.statusIconCircleActive]}>
                        <X size={14} color="#EF4444" strokeWidth={3} />
                      </View>
                      <Text style={[styles.statusOptionBtnMissedText, isCurrMissed && styles.statusOptionBtnMissedTextActive]}>
                        Missed
                      </Text>
                    </View>
                    {isCurrMissed && (
                      <View style={[styles.activePillBadge, styles.activePillBadgeMissed]}>
                        <Text style={styles.activePillText}>SELECTED</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Option 3: Reset / Clear Status (RotateCcw Icon) */}
                  <TouchableOpacity
                    style={[
                      styles.statusOptionBtnClear,
                      isCurrUnmarked && styles.statusOptionBtnClearActive
                    ]}
                    onPress={handleClearStatus}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statusOptionLeft}>
                      <View style={styles.statusIconCircleClear}>
                        <RotateCcw size={14} color="#A1A1AA" strokeWidth={2.4} />
                      </View>
                      <Text style={[styles.statusOptionBtnClearText, isCurrUnmarked && styles.statusOptionBtnClearTextActive]}>
                        Reset Status (Unmarked)
                      </Text>
                    </View>
                    {isCurrUnmarked && (
                      <View style={styles.activePillBadgeUnmarked}>
                        <Text style={styles.activePillTextUnmarked}>SELECTED</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setModalType(null)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </View>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  scrollContent: {
    padding: 20,
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

  // 📅 7 Days Strip Container (Matrix Boxes)
  sevenDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6
  },
  dayBoxCode: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6
  },
  dayBoxCodeToday: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  dayBoxCodeSelected: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  matrixDayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#27272A'
  },
  matrixDayCellCompleted: {
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  matrixDayCellMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.16)',
    borderWidth: 1.2,
    borderColor: '#7F1D1D'
  },
  matrixDayCellInProgress: {
    backgroundColor: '#7A0000',
    borderWidth: 2,
    borderColor: '#EF4444'
  },
  matrixDayCellUnmarked: {
    backgroundColor: '#16161A',
    borderWidth: 1.2,
    borderColor: '#24242A'
  },
  matrixDayCellToday: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    backgroundColor: '#1C1C20'
  },
  matrixDayCellSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2
  },
  matrixDayNumText: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '700'
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
    gap: 10,
    width: '100%'
  },
  statusOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  statusIconCircleCompleted: {
    backgroundColor: '#3F3F46'
  },
  statusIconCircleMissed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  statusIconCircleClear: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  statusIconCircleActive: {
    transform: [{ scale: 1.05 }]
  },
  statusOptionBtnCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C20',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2C2C32'
  },
  statusOptionBtnCompletedActive: {
    backgroundColor: '#27272A',
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6
  },
  statusOptionBtnText: {
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 14
  },
  statusOptionBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  statusOptionBtnMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C20',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2C2C32'
  },
  statusOptionBtnMissedActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6
  },
  statusOptionBtnMissedText: {
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 14
  },
  statusOptionBtnMissedTextActive: {
    color: '#EF4444',
    fontWeight: '800'
  },
  statusOptionBtnClear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181B',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  statusOptionBtnClearActive: {
    backgroundColor: '#202024',
    borderColor: '#52525B'
  },
  statusOptionBtnClearText: {
    color: '#A1A1AA',
    fontWeight: '600',
    fontSize: 13
  },
  statusOptionBtnClearTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  activePillBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  activePillText: {
    color: '#09090B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  activePillBadgeMissed: {
    backgroundColor: '#EF4444'
  },
  activePillBadgeUnmarked: {
    backgroundColor: '#3F3F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  activePillTextUnmarked: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  }
});
