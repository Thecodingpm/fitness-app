import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import {
  TrendingUp,
  Award,
  Flame,
  Dumbbell,
  Zap,
  Activity,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Layers
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🏋️ Per-Exercise Progression Data Map
const EXERCISE_LIFT_DATA = {
  bench: [
    { value: 65, label: 'Aug 1', date: 'Aug 1', oneRepMax: '76kg' },
    { value: 67.5, label: 'Aug 7', date: 'Aug 7', oneRepMax: '79kg' },
    { value: 70, label: 'Aug 14', date: 'Aug 14', oneRepMax: '82kg' },
    { value: 72.5, label: 'Aug 21', date: 'Aug 21', oneRepMax: '85kg' },
    { value: 75, label: 'Today', date: 'Today', oneRepMax: '88kg', dataPointText: '75kg' }
  ],
  squat: [
    { value: 90, label: 'Aug 1', date: 'Aug 1', oneRepMax: '106kg' },
    { value: 95, label: 'Aug 7', date: 'Aug 7', oneRepMax: '112kg' },
    { value: 100, label: 'Aug 14', date: 'Aug 14', oneRepMax: '118kg' },
    { value: 105, label: 'Aug 21', date: 'Aug 21', oneRepMax: '124kg' },
    { value: 110, label: 'Today', date: 'Today', oneRepMax: '130kg', dataPointText: '110kg' }
  ],
  deadlift: [
    { value: 110, label: 'Aug 1', date: 'Aug 1', oneRepMax: '130kg' },
    { value: 115, label: 'Aug 7', date: 'Aug 7', oneRepMax: '135kg' },
    { value: 120, label: 'Aug 14', date: 'Aug 14', oneRepMax: '141kg' },
    { value: 125, label: 'Aug 21', date: 'Aug 21', oneRepMax: '147kg' },
    { value: 135, label: 'Today', date: 'Today', oneRepMax: '159kg', dataPointText: '135kg' }
  ],
  press: [
    { value: 40, label: 'Aug 1', date: 'Aug 1', oneRepMax: '47kg' },
    { value: 42.5, label: 'Aug 7', date: 'Aug 7', oneRepMax: '50kg' },
    { value: 45, label: 'Aug 14', date: 'Aug 14', oneRepMax: '53kg' },
    { value: 47.5, label: 'Aug 21', date: 'Aug 21', oneRepMax: '56kg' },
    { value: 50, label: 'Today', date: 'Today', oneRepMax: '59kg', dataPointText: '50kg' }
  ]
};

// 📊 Weekly Tonnage Data
const WEEKLY_VOLUME_BARS = [
  { value: 11200, label: 'W1', topLabelComponent: () => <Text style={styles.barTopLabel}>11.2k</Text> },
  { value: 12800, label: 'W2', topLabelComponent: () => <Text style={styles.barTopLabel}>12.8k</Text> },
  { value: 14500, label: 'W3', topLabelComponent: () => <Text style={styles.barTopLabel}>14.5k</Text> },
  {
    value: 17200,
    label: 'W4',
    frontColor: '#EF4444',
    topLabelComponent: () => <Text style={[styles.barTopLabel, { color: '#EF4444' }]}>17.2k</Text>
  }
];

// 🍩 Muscle Volume Balance Data
const MUSCLE_PIE_DATA = [
  { value: 30, color: '#DC2626', text: '30%' }, // Chest
  { value: 25, color: '#0284C7', text: '25%' }, // Back
  { value: 25, color: '#F59E0B', text: '25%' }, // Legs
  { value: 12, color: '#8B5CF6', text: '12%' }, // Shoulders
  { value: 8, color: '#10B981', text: '8%' }    // Arms
];

// 🏆 Personal Records Data
const PR_RECORDS = [
  { id: '1', lift: 'Barbell Bench Press', weight: '75 kg', pr1RM: '88 kg', date: 'Aug 2026', badgeColor: '#EF4444' },
  { id: '2', lift: 'Barbell Back Squat', weight: '110 kg', pr1RM: '130 kg', date: 'Aug 2026', badgeColor: '#F59E0B' },
  { id: '3', lift: 'Barbell Deadlift', weight: '135 kg', pr1RM: '159 kg', date: 'Aug 2026', badgeColor: '#0284C7' },
  { id: '4', lift: 'Standing Military Press', weight: '50 kg', pr1RM: '59 kg', date: 'Aug 2026', badgeColor: '#8B5CF6' }
];

export function AnalyticsScreen({ userName = 'Athlete' }) {
  const [selectedLift, setSelectedLift] = useState('bench'); // 'bench' | 'squat' | 'deadlift' | 'press'
  const currentChartData = EXERCISE_LIFT_DATA[selectedLift] || EXERCISE_LIFT_DATA.bench;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🌟 1. Studio Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopBadge}>
            <Activity size={12} color="#EF4444" style={{ marginRight: 5 }} />
            <Text style={styles.headerTopBadgeText}>PRO ATHLETE INTELLIGENCE</Text>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            Biomechanical overload, 1RM progression, and muscle balance metrics.
          </Text>
        </View>

        {/* ⚡ 2. Hero Metric Cards Trio */}
        <View style={styles.heroTrioRow}>
          {/* Total Tonnage */}
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>TOTAL VOLUME</Text>
            <Text style={styles.heroMetricVal}>17.2k <Text style={styles.heroMetricSub}>kg</Text></Text>
            <View style={styles.growthPill}>
              <TrendingUp size={11} color="#10B981" style={{ marginRight: 3 }} />
              <Text style={styles.growthPillText}>+18.4%</Text>
            </View>
          </View>

          {/* Active Streak */}
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>STREAK</Text>
            <Text style={styles.heroMetricVal}>4 <Text style={styles.heroMetricSub}>wks</Text></Text>
            <View style={[styles.growthPill, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Flame size={11} color="#EF4444" style={{ marginRight: 3 }} />
              <Text style={[styles.growthPillText, { color: '#EF4444' }]}>Crushing</Text>
            </View>
          </View>

          {/* Adherence */}
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>ADHERENCE</Text>
            <Text style={styles.heroMetricVal}>94.2<Text style={styles.heroMetricSub}>%</Text></Text>
            <View style={[styles.growthPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Sparkles size={11} color="#F59E0B" style={{ marginRight: 3 }} />
              <Text style={[styles.growthPillText, { color: '#F59E0B' }]}>Elite</Text>
            </View>
          </View>
        </View>

        {/* 📈 3. Interactive 1RM Strength Curve Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSuperTitle}>STRENGTH CURVE</Text>
              <Text style={styles.cardMainTitle}>Estimated 1-Rep Max</Text>
            </View>

            <View style={styles.liftSelectorRow}>
              {[
                { key: 'bench', label: 'Bench' },
                { key: 'squat', label: 'Squat' },
                { key: 'deadlift', label: 'Deadlift' },
                { key: 'press', label: 'Press' }
              ].map((item) => {
                const isActive = selectedLift === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.liftChip, isActive && styles.liftChipActive]}
                    onPress={() => setSelectedLift(item.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.liftChipText, isActive && styles.liftChipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 60FPS Line Chart with Touch Scrubber */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={currentChartData}
              width={SCREEN_WIDTH - 80}
              height={170}
              color="#DC2626"
              thickness={3.5}
              curved
              isAnimated
              animationDuration={700}
              startFillColor="rgba(220, 38, 38, 0.35)"
              endFillColor="rgba(220, 38, 38, 0.0)"
              startOpacity={0.9}
              endOpacity={0.0}
              areaChart
              noOfSections={4}
              yAxisColor="transparent"
              xAxisColor="#27272A"
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              hideRules
              dataPointsColor="#FFFFFF"
              dataPointsRadius={4}
              dataPointsWidth={3}
              textColor="#FFFFFF"
              textFontSize={11}
              textShiftY={-8}
              textShiftX={-4}
              pointerConfig={{
                pointerStripHeight: 150,
                pointerStripColor: '#EF4444',
                pointerStripWidth: 2,
                pointerColor: '#FFFFFF',
                radius: 6,
                pointerLabelWidth: 100,
                pointerLabelHeight: 50,
                activatePointersOnLongPress: false,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items) => {
                  const item = items[0];
                  if (!item) return null;
                  return (
                    <View style={styles.tooltipContainer}>
                      <Text style={styles.tooltipWeight}>{item.value} kg</Text>
                      <Text style={styles.tooltipSub}>1RM ~ {item.oneRepMax}</Text>
                    </View>
                  );
                }
              }}
            />
          </View>

          <View style={styles.cardFooterHint}>
            <Zap size={12} color="#71717A" style={{ marginRight: 5 }} />
            <Text style={styles.cardFooterText}>
              Touch & drag across the graph to view exact working sets and 1RM
            </Text>
          </View>
        </View>

        {/* 📊 4. Weekly Tonnage & Volume Overload */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSuperTitle}>WEEKLY TONNAGE</Text>
              <Text style={styles.cardMainTitle}>Volume Progression</Text>
            </View>

            <View style={styles.overloadBadge}>
              <TrendingUp size={13} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={styles.overloadText}>+18.6%</Text>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <BarChart
              data={WEEKLY_VOLUME_BARS}
              barWidth={36}
              spacing={28}
              roundedTop
              roundedBottom
              radius={8}
              hideRules
              xAxisThickness={1}
              xAxisColor="#27272A"
              yAxisThickness={0}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              frontColor="#B91C1C"
              gradientColor="#DC2626"
              showGradient
              isAnimated
              animationDuration={800}
              height={140}
              width={SCREEN_WIDTH - 90}
            />
          </View>
        </View>

        {/* 🍩 5. Muscle Group Symmetry & Balance */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSuperTitle}>SYMMETRY & RATIOS</Text>
              <Text style={styles.cardMainTitle}>Muscle Volume Split</Text>
            </View>
          </View>

          <View style={styles.pieRow}>
            <View style={styles.pieWrapper}>
              <PieChart
                data={MUSCLE_PIE_DATA}
                donut
                radius={60}
                innerRadius={42}
                innerCircleColor="#141416"
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>42</Text>
                    <Text style={{ color: '#71717A', fontSize: 9, fontWeight: '700' }}>SETS</Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.legendCol}>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendLabel}>Chest (30%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#0284C7' }]} />
                <Text style={styles.legendLabel}>Back & Lats (25%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendLabel}>Legs & Quads (25%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={styles.legendLabel}>Shoulders (12%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Arms (8%)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 🏆 6. Personal Records (PR) Hall of Fame */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSuperTitle}>HALL OF FAME</Text>
              <Text style={styles.cardMainTitle}>Personal Best Records 🏆</Text>
            </View>
          </View>

          <View style={styles.prList}>
            {PR_RECORDS.map((item) => (
              <View key={item.id} style={styles.prRow}>
                <View style={[styles.prBadge, { backgroundColor: `${item.badgeColor}20`, borderColor: item.badgeColor }]}>
                  <Dumbbell size={16} color={item.badgeColor} />
                </View>

                <View style={styles.prDetails}>
                  <Text style={styles.prLiftName}>{item.lift}</Text>
                  <Text style={styles.prDate}>{item.date}</Text>
                </View>

                <View style={styles.prNumbers}>
                  <Text style={styles.prWeight}>{item.weight}</Text>
                  <Text style={styles.pr1RM}>1RM: {item.pr1RM}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    padding: 20,
    paddingBottom: 110
  },

  // Header
  headerContainer: {
    marginBottom: 20
  },
  headerTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    marginBottom: 8
  },
  headerTopBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18
  },

  // Hero Trio Row
  heroTrioRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  heroMetricCard: {
    flex: 1,
    backgroundColor: '#141416',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#242428'
  },
  heroMetricLabel: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  heroMetricVal: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 4
  },
  heroMetricSub: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '700'
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  growthPillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800'
  },

  // Cards
  card: {
    backgroundColor: '#141416',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 18,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  cardSuperTitle: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  cardMainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 2
  },

  // Lift Selector Chips
  liftSelectorRow: {
    flexDirection: 'row',
    backgroundColor: '#1C1C20',
    borderRadius: 10,
    padding: 3,
    gap: 2
  },
  liftChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7
  },
  liftChipActive: {
    backgroundColor: '#DC2626'
  },
  liftChipText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  liftChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4
  },
  axisText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },
  tooltipContainer: {
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center'
  },
  tooltipWeight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  tooltipSub: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700'
  },
  cardFooterHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  cardFooterText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  },

  // Overload Badge
  overloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  overloadText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800'
  },
  barTopLabel: {
    color: '#D4D4D8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },

  // Pie
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6
  },
  pieWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  legendCol: {
    gap: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  legendLabel: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700'
  },

  // PR Records
  prList: {
    gap: 10
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C20',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  prBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12
  },
  prDetails: {
    flex: 1
  },
  prLiftName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  prDate: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  prNumbers: {
    alignItems: 'flex-end'
  },
  prWeight: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  pr1RM: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2
  }
});
