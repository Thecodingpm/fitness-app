import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import {
  TrendingUp,
  Award,
  Flame,
  Dumbbell,
  Zap,
  Activity,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Trophy,
  ArrowUpRight
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🏋️ Curated Exercise Progression Curves
const EXERCISE_LIFT_DATA = {
  bench: {
    name: 'Barbell Bench Press',
    currentWeight: '75 kg',
    projected1RM: '88.5 kg',
    growth: '+15.4%',
    data: [
      { value: 65, label: 'Aug 1' },
      { value: 67.5, label: 'Aug 7' },
      { value: 70, label: 'Aug 14' },
      { value: 72.5, label: 'Aug 21' },
      { value: 75, label: 'Today', customDataPoint: () => <View style={styles.activeDataPoint} /> }
    ]
  },
  squat: {
    name: 'Barbell Back Squat',
    currentWeight: '110 kg',
    projected1RM: '129.8 kg',
    growth: '+22.2%',
    data: [
      { value: 90, label: 'Aug 1' },
      { value: 95, label: 'Aug 7' },
      { value: 100, label: 'Aug 14' },
      { value: 105, label: 'Aug 21' },
      { value: 110, label: 'Today', customDataPoint: () => <View style={styles.activeDataPoint} /> }
    ]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    currentWeight: '135 kg',
    projected1RM: '159.3 kg',
    growth: '+22.7%',
    data: [
      { value: 110, label: 'Aug 1' },
      { value: 115, label: 'Aug 7' },
      { value: 120, label: 'Aug 14' },
      { value: 125, label: 'Aug 21' },
      { value: 135, label: 'Today', customDataPoint: () => <View style={styles.activeDataPoint} /> }
    ]
  },
  press: {
    name: 'Overhead Military Press',
    currentWeight: '50 kg',
    projected1RM: '59.0 kg',
    growth: '+25.0%',
    data: [
      { value: 40, label: 'Aug 1' },
      { value: 42.5, label: 'Aug 7' },
      { value: 45, label: 'Aug 14' },
      { value: 47.5, label: 'Aug 21' },
      { value: 50, label: 'Today', customDataPoint: () => <View style={styles.activeDataPoint} /> }
    ]
  }
};

// 📊 Weekly Tonnage Bars (Clean values & top badges)
const WEEKLY_VOLUME_BARS = [
  {
    value: 11200,
    label: 'Week 1',
    topLabelComponent: () => <Text style={styles.barValueLabel}>11.2k</Text>
  },
  {
    value: 12800,
    label: 'Week 2',
    topLabelComponent: () => <Text style={styles.barValueLabel}>12.8k</Text>
  },
  {
    value: 14500,
    label: 'Week 3',
    topLabelComponent: () => <Text style={styles.barValueLabel}>14.5k</Text>
  },
  {
    value: 17200,
    label: 'Week 4',
    frontColor: '#EF4444',
    gradientColor: '#DC2626',
    topLabelComponent: () => <Text style={[styles.barValueLabel, { color: '#EF4444', fontWeight: '900' }]}>17.2k</Text>
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

// 🏆 Hall of Fame PRs
const PR_RECORDS = [
  { id: '1', lift: 'Barbell Bench Press', weight: '75 kg', pr1RM: '88.5 kg', date: 'Aug 2026', badgeColor: '#EF4444' },
  { id: '2', lift: 'Barbell Back Squat', weight: '110 kg', pr1RM: '129.8 kg', date: 'Aug 2026', badgeColor: '#F59E0B' },
  { id: '3', lift: 'Barbell Deadlift', weight: '135 kg', pr1RM: '159.3 kg', date: 'Aug 2026', badgeColor: '#0284C7' },
  { id: '4', lift: 'Overhead Press', weight: '50 kg', pr1RM: '59.0 kg', date: 'Aug 2026', badgeColor: '#8B5CF6' }
];

export function AnalyticsScreen({ userName = 'Athlete' }) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const activeLift = EXERCISE_LIFT_DATA[selectedLiftKey] || EXERCISE_LIFT_DATA.bench;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🌟 1. Header with Status Badge */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopBadge}>
            <Activity size={12} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.headerTopBadgeText}>PRO ATHLETE INTELLIGENCE</Text>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            Biomechanical overload, 1RM progression, and muscle balance.
          </Text>
        </View>

        {/* ⚡ 2. Hero KPI Metric Cards */}
        <View style={styles.heroTrioRow}>
          {/* Total Volume */}
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>TOTAL VOLUME</Text>
            <Text style={styles.heroMetricVal}>
              17.2k <Text style={styles.heroMetricUnit}>kg</Text>
            </Text>
            <View style={styles.growthPill}>
              <TrendingUp size={10} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={styles.growthPillText}>+18.4%</Text>
            </View>
          </View>

          {/* Active Streak */}
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>STREAK</Text>
            <Text style={styles.heroMetricVal}>
              4 <Text style={styles.heroMetricUnit}>wks</Text>
            </Text>
            <View style={[styles.growthPill, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Flame size={10} color="#EF4444" style={{ marginRight: 4 }} />
              <Text style={[styles.growthPillText, { color: '#EF4444' }]}>Active</Text>
            </View>
          </View>

          {/* Adherence */}
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>ADHERENCE</Text>
            <Text style={styles.heroMetricVal}>
              94.2<Text style={styles.heroMetricUnit}>%</Text>
            </Text>
            <View style={[styles.growthPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Sparkles size={10} color="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={[styles.growthPillText, { color: '#F59E0B' }]}>Elite</Text>
            </View>
          </View>
        </View>

        {/* 📈 3. Luxury 1RM Strength Curve Card */}
        <View style={styles.card}>
          {/* Card Top Title */}
          <View style={styles.cardHeaderStack}>
            <View style={styles.cardTitleRow}>
              <View>
                <Text style={styles.cardSuperTitle}>STRENGTH PROGRESSION</Text>
                <Text style={styles.cardMainTitle}>Estimated 1-Rep Max</Text>
              </View>

              <View style={styles.statCallout}>
                <Text style={styles.statCalloutVal}>{activeLift.projected1RM}</Text>
                <Text style={styles.statCalloutGrowth}>{activeLift.growth}</Text>
              </View>
            </View>

            {/* Segmented Lift Selector Tabs */}
            <View style={styles.segmentedTabWrapper}>
              {[
                { key: 'bench', label: 'Bench' },
                { key: 'squat', label: 'Squat' },
                { key: 'deadlift', label: 'Deadlift' },
                { key: 'press', label: 'Press' }
              ].map((item) => {
                const isActive = selectedLiftKey === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                    onPress={() => setSelectedLiftKey(item.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.segmentBtnText, isActive && styles.segmentBtnTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Smooth Bezier Line Chart */}
          <View style={styles.chartBox}>
            <LineChart
              data={activeLift.data}
              width={SCREEN_WIDTH - 84}
              height={160}
              color="#DC2626"
              thickness={3}
              curved
              curveType={0}
              isAnimated
              animationDuration={600}
              startFillColor="rgba(220, 38, 38, 0.35)"
              endFillColor="rgba(220, 38, 38, 0.0)"
              startOpacity={0.8}
              endOpacity={0.0}
              areaChart
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#222226"
              xAxisLabelTextStyle={styles.axisLabel}
              rulesColor="rgba(255, 255, 255, 0.04)"
              rulesType="solid"
              dataPointsColor="#EF4444"
              dataPointsRadius={4}
              dataPointsWidth={2}
              spacing={(SCREEN_WIDTH - 120) / 4}
              pointerConfig={{
                pointerStripHeight: 140,
                pointerStripColor: '#EF4444',
                pointerStripWidth: 1.5,
                pointerColor: '#FFFFFF',
                radius: 5,
                pointerLabelWidth: 90,
                pointerLabelHeight: 46,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items) => {
                  const item = items[0];
                  if (!item) return null;
                  return (
                    <View style={styles.tooltipPill}>
                      <Text style={styles.tooltipWeight}>{item.value} kg</Text>
                      <Text style={styles.tooltipSub}>Working Set</Text>
                    </View>
                  );
                }
              }}
            />
          </View>

          <View style={styles.cardFooter}>
            <Zap size={12} color="#71717A" style={{ marginRight: 5 }} />
            <Text style={styles.cardFooterText}>
              Touch & scrub across points to view historical working sets
            </Text>
          </View>
        </View>

        {/* 📊 4. Weekly Tonnage Growth (Bar Chart) */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardSuperTitle}>WEEKLY TONNAGE</Text>
              <Text style={styles.cardMainTitle}>Volume Progression</Text>
            </View>

            <View style={styles.overloadBadge}>
              <TrendingUp size={12} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={styles.overloadText}>+18.6%</Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <BarChart
              data={WEEKLY_VOLUME_BARS}
              barWidth={38}
              spacing={28}
              roundedTop
              roundedBottom
              radius={6}
              hideRules
              hideYAxisText
              xAxisThickness={1}
              xAxisColor="#222226"
              yAxisThickness={0}
              xAxisLabelTextStyle={styles.axisLabel}
              frontColor="#B91C1C"
              gradientColor="#DC2626"
              showGradient
              isAnimated
              animationDuration={700}
              height={140}
              maxValue={20000}
              width={SCREEN_WIDTH - 84}
            />
          </View>
        </View>

        {/* 🍩 5. Muscle Symmetry & Distribution */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardSuperTitle}>SYMMETRY & RATIOS</Text>
              <Text style={styles.cardMainTitle}>Muscle Volume Split</Text>
            </View>

            <View style={styles.setsTotalBadge}>
              <Text style={styles.setsTotalText}>42 Sets / Wk</Text>
            </View>
          </View>

          <View style={styles.pieRow}>
            {/* Donut Chart */}
            <View style={styles.pieWrapper}>
              <PieChart
                data={MUSCLE_PIE_DATA}
                donut
                radius={58}
                innerRadius={40}
                innerCircleColor="#121214"
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>42</Text>
                    <Text style={{ color: '#71717A', fontSize: 9, fontWeight: '700' }}>SETS</Text>
                  </View>
                )}
              />
            </View>

            {/* Muscle Breakdown List */}
            <View style={styles.legendCol}>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendLabel}>Chest</Text>
                <Text style={styles.legendPercent}>30%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#0284C7' }]} />
                <Text style={styles.legendLabel}>Back & Lats</Text>
                <Text style={styles.legendPercent}>25%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendLabel}>Legs & Quads</Text>
                <Text style={styles.legendPercent}>25%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={styles.legendLabel}>Shoulders</Text>
                <Text style={styles.legendPercent}>12%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Arms</Text>
                <Text style={styles.legendPercent}>8%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 🏆 6. Personal Best Records (PR) Hall of Fame */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardSuperTitle}>HALL OF FAME</Text>
              <Text style={styles.cardMainTitle}>Personal Best Records 🏆</Text>
            </View>
          </View>

          <View style={styles.prList}>
            {PR_RECORDS.map((item) => (
              <View key={item.id} style={styles.prRow}>
                <View style={[styles.prBadge, { backgroundColor: `${item.badgeColor}18`, borderColor: `${item.badgeColor}40` }]}>
                  <Trophy size={15} color={item.badgeColor} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 110
  },

  // 🌟 Header
  headerContainer: {
    marginBottom: 18
  },
  headerTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
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
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18
  },

  // ⚡ Hero Trio Row
  heroTrioRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  heroMetricCard: {
    flex: 1,
    backgroundColor: '#121214',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  heroMetricLabel: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  heroMetricVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 3
  },
  heroMetricUnit: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '700'
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
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

  // 🎴 Sleek Obsidian Cards
  card: {
    backgroundColor: '#121214',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    padding: 16,
    marginBottom: 14
  },
  cardHeaderStack: {
    marginBottom: 14
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  cardSuperTitle: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  cardMainTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 2
  },

  statCallout: {
    alignItems: 'flex-end'
  },
  statCalloutVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  statCalloutGrowth: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2
  },

  // Segmented Lift Selector Tabs
  segmentedTabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1E',
    borderRadius: 12,
    padding: 3,
    gap: 4
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9
  },
  segmentBtnActive: {
    backgroundColor: '#DC2626'
  },
  segmentBtnText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // Chart Container
  chartBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  axisLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },
  activeDataPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC2626'
  },
  tooltipPill: {
    backgroundColor: '#1E1E22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center'
  },
  tooltipWeight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  tooltipSub: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '600'
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  cardFooterText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  },

  // Weekly Tonnage
  overloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)'
  },
  overloadText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800'
  },
  barValueLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },

  // Muscle Symmetry
  setsTotalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  setsTotalText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '700'
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 6
  },
  pieWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  legendCol: {
    flex: 1,
    marginLeft: 20,
    gap: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  legendLabel: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700',
    flex: 1
  },
  legendPercent: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '800'
  },

  // PR Records List
  prList: {
    gap: 8
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181C',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  prBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 10
  },
  prDetails: {
    flex: 1
  },
  prLiftName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  prDate: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1
  },
  prNumbers: {
    alignItems: 'flex-end'
  },
  prWeight: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  pr1RM: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1
  }
});
