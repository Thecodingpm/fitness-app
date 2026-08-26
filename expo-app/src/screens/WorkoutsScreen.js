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
  SlidersHorizontal
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';

const { width } = Dimensions.get('window');

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
  const todayDayIndex = now.getDay();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayRoutine = WEEKLY_ROUTINES_DB[todayDayIndex] || WEEKLY_ROUTINES_DB[0];

  // Double-tap tracking
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);

  // Status Action / Confirmation Modals
  const [modalType, setModalType] = useState(null); // 'CONFIRM_COMPLETE' | 'CONFIRM_MISSED' | 'CHANGE_STATUS'

  // Current unified status from shared state
  const rawStatus = dailyWorkoutStatuses[todayKey];
  const currentStatus = rawStatus || (activeWorkoutProgress ? 'in_progress' : 'unmarked');

  const isCompleted = currentStatus === 'completed';
  const isMissed = currentStatus === 'missed';
  const isInProgress = currentStatus === 'in_progress';
  const isUnmarked = !isCompleted && !isMissed && !isInProgress;

  // 👆 Double Tap Handler for Workout Box (Opens Consistency Page directly)
  const handleWorkoutBoxPress = () => {
    const tapNow = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (tapNow - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapRef.current = 0;
      if (onOpenConsistency) onOpenConsistency(todayKey);
    } else {
      lastTapRef.current = tapNow;
      singleTapTimerRef.current = setTimeout(() => {
        if (isCompleted || isMissed) {
          setModalType('CHANGE_STATUS');
        } else if (isInProgress && onResumeWorkout) {
          onResumeWorkout();
        } else if (onStartWorkout) {
          onStartWorkout(todayRoutine);
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  // ✅ Confirm Complete
  const handleConfirmComplete = () => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(todayKey, 'completed');
    }
    setModalType(null);
  };

  // ❌ Confirm Missed
  const handleConfirmMissed = () => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(todayKey, 'missed');
    }
    setModalType(null);
  };

  // 🔄 Clear / Reset Status
  const handleClearStatus = () => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(todayKey, 'unmarked');
    }
    setModalType(null);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.pageTitle}>Workout Sessions</Text>
      <Text style={styles.pageSub}>Manage your daily routine & active status for {userName}</Text>

      {/* 🏋️ 1. Primary "TODAY'S WORKOUT" Box with State Controls & Double-Tap */}
      <Text style={styles.sectionHeader}>TODAY'S WORKOUT</Text>
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
        {/* Top Badges Row */}
        <View style={styles.cardHeaderRow}>
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
              <Check size={13} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 5 }} />
            ) : isMissed ? (
              <X size={13} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 5 }} />
            ) : (
              <Calendar size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
            )}

            <Text style={styles.statusPillText}>
              {isCompleted
                ? '✓ Completed'
                : isMissed
                ? '× Missed'
                : isInProgress
                ? `⚡ In Progress (${activeWorkoutProgress?.percentComplete || 50}%)`
                : '□ Unmarked'}
            </Text>
          </View>

          {/* Quick Change Status Pill if already completed/missed */}
          {(isCompleted || isMissed) && (
            <TouchableOpacity
              style={styles.changeStatusPill}
              onPress={() => setModalType('CHANGE_STATUS')}
              activeOpacity={0.7}
            >
              <Text style={styles.changeStatusPillText}>Change Status</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title & Workout Focus */}
        <Text style={styles.routineTitleText}>{todayRoutine.title}</Text>
        <Text style={styles.routineFocusText}>
          {todayRoutine.splitLabel || 'Push & Hypertrophy'} • {todayRoutine.durationMin || 45} mins
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
            <Text style={styles.inProgressSubText}>
              {activeWorkoutProgress?.completedCount || 2} / {activeWorkoutProgress?.totalCount || 4} exercises completed
            </Text>
          </View>
        )}

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsContainer}>
          {isUnmarked && (
            <>
              {/* Primary Start Button */}
              <TouchableOpacity
                style={styles.primaryStartBtn}
                onPress={() => onStartWorkout && onStartWorkout(todayRoutine)}
                activeOpacity={0.85}
              >
                <Play size={13} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryStartBtnText}>Start Workout</Text>
              </TouchableOpacity>

              {/* Manual Mark Controls */}
              <View style={styles.manualControlsRow}>
                <TouchableOpacity
                  style={styles.manualCompleteBtn}
                  onPress={() => setModalType('CONFIRM_COMPLETE')}
                  activeOpacity={0.8}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                  <Text style={styles.manualCompleteBtnText}>Mark Completed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.manualMissedBtn}
                  onPress={() => setModalType('CONFIRM_MISSED')}
                  activeOpacity={0.8}
                >
                  <X size={14} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 4 }} />
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
                <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.resumeLargeBtnText}>Resume Workout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manualFinishSmallBtn}
                onPress={() => setModalType('CONFIRM_COMPLETE')}
                activeOpacity={0.8}
              >
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </TouchableOpacity>
            </View>
          )}

          {isCompleted && (
            <View style={styles.completedBannerRow}>
              <Text style={styles.completedNoticeText}>
                ✓ Logged to your Consistency Tracker. Double-tap to view calendar.
              </Text>
            </View>
          )}

          {isMissed && (
            <View style={styles.missedBannerRow}>
              <Text style={styles.missedNoticeText}>
                × Marked as missed. Tap card to change status.
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* 📋 2. Explore Programs */}
      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>TRAINING PROGRAMS</Text>
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
      {/* 1. Confirm Complete */}
      <Modal visible={modalType === 'CONFIRM_COMPLETE'} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmBoxTitle}>Mark this workout as completed?</Text>
            <Text style={styles.confirmBoxSubtitle}>
              This will update your daily workout status and sync with your Consistency Tracker.
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
                <Text style={styles.confirmCompleteActionText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Confirm Missed */}
      <Modal visible={modalType === 'CONFIRM_MISSED'} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmBoxTitle}>Mark this workout as missed?</Text>
            <Text style={styles.confirmBoxSubtitle}>
              This will record a missed session on your Consistency Tracker.
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
                <Text style={styles.confirmMissedActionText}>Mark Missed</Text>
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
              Select a new status for today's workout:
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
  sectionHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10
  },

  // 🏋️ Today's Workout Card Styles
  todayWorkoutCard: {
    backgroundColor: '#141416',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 8
  },
  cardCompleted: {
    borderColor: '#3F3F46',
    backgroundColor: '#16161A'
  },
  cardMissed: {
    borderColor: '#7F1D1D',
    backgroundColor: 'rgba(220, 38, 38, 0.08)'
  },
  cardInProgress: {
    borderColor: '#7A0000',
    backgroundColor: '#18181C'
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderWidth: 1,
    borderColor: '#7F1D1D'
  },
  statusPillInProgress: {
    backgroundColor: '#7A0000',
    borderWidth: 1,
    borderColor: '#B31F1F'
  },
  statusPillUnmarked: {
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#2E2E36'
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  changeStatusPill: {
    backgroundColor: '#202026',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#303038'
  },
  changeStatusPillText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700'
  },
  routineTitleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  routineFocusText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14
  },
  inProgressProgressBlock: {
    marginBottom: 14
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
  inProgressSubText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600'
  },
  actionButtonsContainer: {
    gap: 8
  },
  primaryStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 46,
    borderRadius: 14
  },
  primaryStartBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900'
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
    backgroundColor: '#202026',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#303038'
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
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7F1D1D'
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B31F1F'
  },
  resumeLargeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  manualFinishSmallBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    justifyContent: 'center',
    alignItems: 'center'
  },
  completedBannerRow: {
    backgroundColor: '#1E1E24',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E2E36'
  },
  completedNoticeText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600'
  },
  missedBannerRow: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7F1D1D'
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
