import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Check,
  Moon,
  X,
  ArrowUpRight,
  Zap,
  Clock,
  Dumbbell,
  Sparkles,
  Calendar,
  ChevronRight,
  Flame
} from 'lucide-react-native';
import { C } from '../constants/theme';

const { width } = Dimensions.get('window');

// 📅 7-Day Training Matrix Data (Sunday to Saturday)
const WEEKLY_TRAINING_DAYS = [
  { day: 'S', fullDay: 'Sunday', status: 'completed', label: 'Push' },
  { day: 'M', fullDay: 'Monday', status: 'rest', label: 'Rest' },
  { day: 'T', fullDay: 'Tuesday', status: 'completed', label: 'Pull' },
  { day: 'W', fullDay: 'Wednesday', status: 'rest', label: 'Rest' },
  { day: 'T', fullDay: 'Thursday', status: 'completed', label: 'Legs' },
  { day: 'F', fullDay: 'Friday', status: 'rest', label: 'Rest' },
  { day: 'S', fullDay: 'Saturday', status: 'missed', label: 'Core' }
];

export function HomeScreen({
  userName = 'David',
  onNavigateTab,
  onStartWorkout,
  onSelectMuscle
}) {
  const [hasNotification, setHasNotification] = useState(true);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 👤 1. Top Header: User Profile Greeting & Notification Bell */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.userProfileGroup}
          activeOpacity={0.8}
          onPress={() => onNavigateTab && onNavigateTab('profile')}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/athlete_hero.jpg')}
              style={styles.avatarImage}
            />
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.greetingTitle}>Hey {userName || 'David'}!</Text>
            <Text style={styles.greetingSubtitle}>Ready to train?</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notificationBtn}
          activeOpacity={0.75}
          onPress={() => setHasNotification(false)}
        >
          <Bell size={19} color="#FFFFFF" />
          {hasNotification && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      {/* ⚡ 2. Hero "NEXT WORKOUT" Card */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabel}>NEXT WORKOUT</Text>
      </View>

      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.9}
        onPress={onStartWorkout}
      >
        {/* Background Athlete Image */}
        <Image
          source={require('../../assets/athlete_hero.jpg')}
          style={styles.heroImage}
        />

        {/* Deep Bottom Linear Vignette for High-Contrast Typography */}
        <LinearGradient
          colors={['rgba(9, 9, 11, 0.15)', 'rgba(9, 9, 11, 0.55)', 'rgba(9, 9, 11, 0.96)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* Top Floating Badge Bar */}
        <View style={styles.heroTopBadgesRow}>
          {/* Schedule Countdown Pill */}
          <View style={styles.schedulePill}>
            <Calendar size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.schedulePillText}>In 2 days</Text>
          </View>

          {/* Right Badges Stack */}
          <View style={styles.heroRightBadgesStack}>
            <View style={styles.frostedBadge}>
              <Zap size={12} color="#FBBF24" style={{ marginRight: 4 }} />
              <Text style={styles.frostedBadgeText}>6 exercises</Text>
            </View>
            <View style={[styles.frostedBadge, { marginTop: 6 }]}>
              <Clock size={12} color="#A1A1AA" style={{ marginRight: 4 }} />
              <Text style={styles.frostedBadgeText}>45 min</Text>
            </View>
          </View>
        </View>

        {/* Bottom Hero Info */}
        <View style={styles.heroBottomContent}>
          <Text style={styles.workoutMainTitle}>Push</Text>
          <Text style={styles.workoutSubInfo}>Week 3 · Day 3</Text>
        </View>
      </TouchableOpacity>

      {/* 📊 3. "YOUR TRAINING SUMMARY" (7-Day Adherence Matrix) */}
      <View style={[styles.sectionHeaderRow, { marginTop: 26 }]}>
        <Text style={styles.sectionLabel}>YOUR TRAINING SUMMARY</Text>
      </View>

      <View style={styles.summaryCard}>
        {/* Header Row */}
        <View style={styles.summaryHeaderRow}>
          <Text style={styles.summaryTitle}>Workouts</Text>
          <TouchableOpacity
            style={styles.linkArrowBtn}
            activeOpacity={0.7}
            onPress={() => onNavigateTab && onNavigateTab('workouts')}
          >
            <ArrowUpRight size={18} color="#71717A" />
          </TouchableOpacity>
        </View>

        {/* 7-Day Status Circles Strip */}
        <View style={styles.daysStripContainer}>
          {WEEKLY_TRAINING_DAYS.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isRest = item.status === 'rest';
            const isMissed = item.status === 'missed';

            return (
              <View key={idx} style={styles.dayCol}>
                <View
                  style={[
                    styles.dayCircle,
                    isCompleted && styles.dayCircleCompleted,
                    isRest && styles.dayCircleRest,
                    isMissed && styles.dayCircleMissed
                  ]}
                >
                  {isCompleted && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  {isRest && <Moon size={13} color="#71717A" />}
                  {isMissed && <X size={13} color="#FFFFFF" strokeWidth={2.5} />}
                </View>
                <Text style={styles.dayLetterLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.summaryDivider} />

        {/* Bottom Metrics: Completed Count & On Track % */}
        <View style={styles.summaryMetricsRow}>
          <View style={styles.metricLeftGroup}>
            <Text style={styles.metricLargeNumber}>
              3<Text style={styles.metricTotalSub}>/4</Text>
            </Text>
            <Text style={styles.metricDescription}>Completed this week</Text>
          </View>

          <View style={styles.metricRightGroup}>
            <Text style={styles.metricLargeNumber}>85%</Text>
            <Text style={styles.metricDescription}>On Track</Text>
          </View>
        </View>
      </View>

      {/* 📈 4. Weekly Quick Stats Dual Cards */}
      <View style={styles.dualCardsRow}>
        {/* Duration Card */}
        <TouchableOpacity
          style={styles.statMiniCard}
          activeOpacity={0.8}
          onPress={() => onNavigateTab && onNavigateTab('workouts')}
        >
          <View style={styles.statMiniHeader}>
            <Text style={styles.statMiniLabel}>Duration</Text>
            <ArrowUpRight size={16} color="#71717A" />
          </View>
          <Text style={styles.statMiniValue}>4h 40m</Text>
          <Text style={styles.statMiniSub}>Total time trained</Text>
        </TouchableOpacity>

        {/* Total Exercises Card */}
        <TouchableOpacity
          style={styles.statMiniCard}
          activeOpacity={0.8}
          onPress={() => onNavigateTab && onNavigateTab('exercises')}
        >
          <View style={styles.statMiniHeader}>
            <Text style={styles.statMiniLabel}>Total Exercises</Text>
            <ArrowUpRight size={16} color="#71717A" />
          </View>
          <Text style={styles.statMiniValue}>36</Text>
          <Text style={styles.statMiniSub}>Completed this week</Text>
        </TouchableOpacity>
      </View>

      {/* 🎧 5. Studio AI Audio Coach Banner */}
      <View style={styles.aiCoachStudioCard}>
        <View style={styles.aiCoachHeaderRow}>
          <View style={styles.aiIconBadge}>
            <Sparkles size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.aiCoachBadgeTitle}>AI AUDIO COACH ACTIVE</Text>
        </View>
        <Text style={styles.aiCoachBodyText}>
          "Ready when you are, {userName}! Pop your earphones in for real-time cadence cues and smart rest tracking."
        </Text>
      </View>

      {/* 🏋️ 6. Explore Muscle Targets */}
      <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
        <Text style={styles.sectionLabel}>EXPLORE BY MUSCLE</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.muscleScrollRow}
      >
        {['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Abs'].map((muscle, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.muscleChipCard}
            activeOpacity={0.75}
            onPress={() => onSelectMuscle && onSelectMuscle(muscle)}
          >
            <Dumbbell size={16} color="#FFFFFF" />
            <Text style={styles.muscleChipLabel}>{muscle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110
  },

  // 👤 Header Styles
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarContainer: {
    position: 'relative'
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#3F3F46'
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#09090B'
  },
  userTextCol: {
    justifyContent: 'center'
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  greetingSubtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C20',
    borderWidth: 1,
    borderColor: '#2A2A30',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  notificationDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444'
  },

  // ⚡ Section Labels
  sectionHeaderRow: {
    marginBottom: 10
  },
  sectionLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8
  },

  // 🏋️ Hero Card Styles
  heroCard: {
    width: '100%',
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#141416'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  heroTopBadgesRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  schedulePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  heroRightBadgesStack: {
    alignItems: 'flex-end'
  },
  frostedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  frostedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    zIndex: 10
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  workoutSubInfo: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
  },

  // 📊 Training Summary Card Styles
  summaryCard: {
    backgroundColor: '#141416',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 18
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  linkArrowBtn: {
    padding: 4
  },
  daysStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  dayCol: {
    alignItems: 'center',
    gap: 8
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayCircleCompleted: {
    backgroundColor: '#10B981'
  },
  dayCircleRest: {
    backgroundColor: '#1E1E22',
    borderWidth: 1,
    borderColor: '#2C2C32'
  },
  dayCircleMissed: {
    backgroundColor: '#DC2626'
  },
  dayLetterLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#242428',
    marginVertical: 16
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  metricLeftGroup: {},
  metricRightGroup: {
    alignItems: 'flex-end'
  },
  metricLargeNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900'
  },
  metricTotalSub: {
    color: '#71717A',
    fontSize: 16,
    fontWeight: '700'
  },
  metricDescription: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },

  // 📈 Dual Quick Stats Cards
  dualCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: '#141416',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242428'
  },
  statMiniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  statMiniLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  statMiniValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900'
  },
  statMiniSub: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4
  },

  // 🎧 AI Audio Coach Banner
  aiCoachStudioCard: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  aiCoachHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  aiIconBadge: {
    backgroundColor: '#DC2626',
    padding: 4,
    borderRadius: 6
  },
  aiCoachBadgeTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  aiCoachBodyText: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 18
  },

  // 🏋️ Muscle Chips Scroll
  muscleScrollRow: {
    marginVertical: 4
  },
  muscleChipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#141416',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#242428'
  },
  muscleChipLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
