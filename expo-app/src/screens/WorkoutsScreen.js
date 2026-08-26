import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Play,
  Check,
  X,
  Zap,
  Clock,
  Dumbbell,
  Trophy,
  Flame
} from 'lucide-react-native';

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
  consistencyRecords = {},
  onStartWorkout,
  onResumeWorkout
}) {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isTodayCompleted = consistencyRecords[todayKey] === 'completed';
  const isTodayMissed = consistencyRecords[todayKey] === 'missed';
  const isTodayInProgress = !!activeWorkoutProgress && !isTodayCompleted;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.pageTitle}>Training Programs</Text>
      <Text style={styles.pageSub}>Structured multi-week programs for {userName}</Text>

      {/* Today's Active Workout Banner */}
      {isTodayInProgress && (
        <View style={styles.activeBannerCard}>
          <View style={styles.activeBannerHeader}>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>IN PROGRESS • {activeWorkoutProgress.percentComplete}%</Text>
            </View>
            <Text style={styles.activeTimerText}>
              {activeWorkoutProgress.completedCount}/{activeWorkoutProgress.totalCount} Exercises
            </Text>
          </View>

          <Text style={styles.activeBannerTitle}>{activeWorkoutProgress.routineTitle || "Today's Workout"}</Text>

          {/* Progress Line */}
          <View style={styles.bannerProgressBg}>
            <View style={[styles.bannerProgressFill, { width: `${activeWorkoutProgress.percentComplete}%` }]} />
          </View>

          <TouchableOpacity style={styles.resumePrimaryBtn} onPress={onResumeWorkout} activeOpacity={0.85}>
            <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.resumePrimaryBtnText}>Resume Workout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Completed Today Banner */}
      {isTodayCompleted && (
        <View style={styles.completedBannerCard}>
          <View style={styles.completedBadgeCircle}>
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.completedBannerTitle}>Today's Workout Completed</Text>
            <Text style={styles.completedBannerSub}>Synced with your Consistency Tracker & Trophy records</Text>
          </View>
        </View>
      )}

      {/* List of Programs */}
      <Text style={styles.sectionHeader}>EXPLORE ROUTINES</Text>
      {PROGRAMS_DB.map((plan, idx) => (
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
  activeBannerCard: {
    backgroundColor: '#18181C',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#7A0000',
    marginBottom: 18
  },
  activeBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  activePill: {
    backgroundColor: '#7A0000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  activeTimerText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },
  activeBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10
  },
  bannerProgressBg: {
    width: '100%',
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#27272A',
    overflow: 'hidden',
    marginBottom: 12
  },
  bannerProgressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2.5
  },
  resumePrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B31F1F'
  },
  resumePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  completedBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3F3F46',
    marginBottom: 18
  },
  completedBadgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#52525B'
  },
  completedBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  completedBannerSub: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2
  },
  sectionHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4
  },
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
  }
});
