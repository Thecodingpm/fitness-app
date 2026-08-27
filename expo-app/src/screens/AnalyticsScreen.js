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
import { LineChart, BarChart } from 'react-native-gifted-charts';
import {
  TrendingUp,
  Activity,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
  ArrowUpRight,
  Dumbbell
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🏋️ Compound Lifts Progression Data
const EXERCISE_LIFT_DATA = {
  bench: {
    name: 'Barbell Bench Press',
    workingWeight: '75 kg',
    est1RM: '88.5 kg',
    overloadPct: '+15.4%',
    baselineWeight: '65 kg',
    data: [
      { value: 65, label: 'Aug 1' },
      { value: 67.5, label: 'Aug 7' },
      { value: 70, label: 'Aug 14' },
      { value: 72.5, label: 'Aug 21' },
      { value: 75, label: 'Today', customDataPoint: () => <View style={styles.activePointPin} /> }
    ]
  },
  squat: {
    name: 'Barbell Back Squat',
    workingWeight: '110 kg',
    est1RM: '129.8 kg',
    overloadPct: '+22.2%',
    baselineWeight: '90 kg',
    data: [
      { value: 90, label: 'Aug 1' },
      { value: 95, label: 'Aug 7' },
      { value: 100, label: 'Aug 14' },
      { value: 105, label: 'Aug 21' },
      { value: 110, label: 'Today', customDataPoint: () => <View style={styles.activePointPin} /> }
    ]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    workingWeight: '135 kg',
    est1RM: '159.3 kg',
    overloadPct: '+22.7%',
    baselineWeight: '110 kg',
    data: [
      { value: 110, label: 'Aug 1' },
      { value: 115, label: 'Aug 7' },
      { value: 120, label: 'Aug 14' },
      { value: 125, label: 'Aug 21' },
      { value: 135, label: 'Today', customDataPoint: () => <View style={styles.activePointPin} /> }
    ]
  },
  press: {
    name: 'Overhead Military Press',
    workingWeight: '50 kg',
    est1RM: '59.0 kg',
    overloadPct: '+25.0%',
    baselineWeight: '40 kg',
    data: [
      { value: 40, label: 'Aug 1' },
      { value: 42.5, label: 'Aug 7' },
      { value: 45, label: 'Aug 14' },
      { value: 47.5, label: 'Aug 21' },
      { value: 50, label: 'Today', customDataPoint: () => <View style={styles.activePointPin} /> }
    ]
  }
};

// 📊 Weekly Tonnage Bars (Inspired by Dribbble v4 clean stepped bars)
const WEEKLY_TONNAGE_BARS = [
  { value: 11200, label: 'W1', frontColor: '#3F3F46', topLabelComponent: () => <Text style={styles.barTopLabel}>11.2k</Text> },
  { value: 12800, label: 'W2', frontColor: '#52525B', topLabelComponent: () => <Text style={styles.barTopLabel}>12.8k</Text> },
  { value: 14500, label: 'W3', frontColor: '#B91C1C', topLabelComponent: () => <Text style={styles.barTopLabel}>14.5k</Text> },
  {
    value: 17200,
    label: 'W4',
    frontColor: '#EF4444',
    gradientColor: '#DC2626',
    showGradient: true,
    topLabelComponent: () => <Text style={[styles.barTopLabel, { color: '#EF4444', fontWeight: '900' }]}>17.2k</Text>
  }
];

// 📅 12-Month Year-to-Date Volume Sparklines (Inspired by Dribbble v5)
const MONTHLY_HISTOGRAM = [
  { value: 12, label: 'J' },
  { value: 15, label: 'F' },
  { value: 14, label: 'M' },
  { value: 18, label: 'A' },
  { value: 20, label: 'M' },
  { value: 22, label: 'J' },
  { value: 19, label: 'J' },
  { value: 24, label: 'A', frontColor: '#EF4444' }, // Current Month
  { value: 0, label: 'S', frontColor: '#27272A' },
  { value: 0, label: 'O', frontColor: '#27272A' },
  { value: 0, label: 'N', frontColor: '#27272A' },
  { value: 0, label: 'D', frontColor: '#27272A' }
];

// 🏆 Personal Best Hall of Fame
const PR_RECORDS = [
  { id: '1', lift: 'Barbell Bench Press', weight: '75 kg', pr1RM: '88.5 kg', date: 'Aug 2026', badgeColor: '#EF4444' },
  { id: '2', lift: 'Barbell Back Squat', weight: '110 kg', pr1RM: '129.8 kg', date: 'Aug 2026', badgeColor: '#F59E0B' },
  { id: '3', lift: 'Barbell Deadlift', weight: '135 kg', pr1RM: '159.3 kg', date: 'Aug 2026', badgeColor: '#0284C7' },
  { id: '4', lift: 'Overhead Press', weight: '50 kg', pr1RM: '59.0 kg', date: 'Aug 2026', badgeColor: '#8B5CF6' }
];

export function AnalyticsScreen() {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const activeLift = EXERCISE_LIFT_DATA[selectedLiftKey] || EXERCISE_LIFT_DATA.bench;

  return (
    <View style={styles.safeArea}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🌟 Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBadge}>
            <Activity size={11} color="#EF4444" style={{ marginRight: 5 }} />
            <Text style={styles.headerBadgeText}>PRO ATHLETE INTELLIGENCE</Text>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            Progression curve, volume overload, and training capacity metrics.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 📈 CARD 1: THE DUAL-COLUMN STRENGTH OVERLOAD CARD (Inspired by Dribbble v3) */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          {/* Top Accent Line */}
          <View style={styles.cardTopAccent} />

          {/* 1. Dual-Column KPI Split Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiColumn}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiMainNumber}>{activeLift.est1RM}</Text>
              <Text style={styles.kpiSubText}>Working: {activeLift.workingWeight}</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.kpiActionBtn}>
                <Text style={styles.kpiActionText}>View Log</Text>
                <ChevronRight size={12} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {/* Vertical Divider */}
            <View style={styles.kpiVerticalDivider} />

            <View style={styles.kpiColumn}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD GAIN</Text>
              <Text style={[styles.kpiMainNumber, { color: '#10B981' }]}>{activeLift.overloadPct}</Text>
              <Text style={styles.kpiSubText}>Baseline: {activeLift.baselineWeight}</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.kpiActionBtn}>
                <Text style={[styles.kpiActionText, { color: '#10B981' }]}>+10 kg Overload</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Segmented Lift Selector Tabs */}
          <View style={styles.liftSelectorSegment}>
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
                  style={[styles.liftTab, isActive && styles.liftTabActive]}
                  onPress={() => setSelectedLiftKey(item.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.liftTabText, isActive && styles.liftTabTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2. Elevated Bezier Curve with Start & End Date Anchors */}
          <View style={styles.chartCanvasArea}>
            <LineChart
              data={activeLift.data}
              width={SCREEN_WIDTH - 84}
              height={140}
              color="#EF4444"
              thickness={3}
              curved
              curveType={0}
              isAnimated
              animationDuration={600}
              startFillColor="rgba(239, 68, 68, 0.28)"
              endFillColor="rgba(239, 68, 68, 0.0)"
              startOpacity={0.8}
              endOpacity={0.0}
              areaChart
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#27272A"
              xAxisLabelTextStyle={styles.chartAxisLabel}
              rulesColor="rgba(255, 255, 255, 0.03)"
              dataPointsColor="#FFFFFF"
              dataPointsRadius={4}
              spacing={(SCREEN_WIDTH - 120) / 4}
              pointerConfig={{
                pointerStripHeight: 120,
                pointerStripColor: '#EF4444',
                pointerStripWidth: 1.5,
                pointerColor: '#FFFFFF',
                radius: 5,
                pointerLabelWidth: 85,
                pointerLabelHeight: 44,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items) => {
                  const item = items[0];
                  if (!item) return null;
                  return (
                    <View style={styles.chartTooltip}>
                      <Text style={styles.chartTooltipVal}>{item.value} kg</Text>
                      <Text style={styles.chartTooltipDate}>{item.label}</Text>
                    </View>
                  );
                }
              }}
            />
          </View>

          {/* 3. Bottom Efficiency Scorecard (From Dribbble v3 Footer) */}
          <View style={styles.scorecardFooter}>
            <Text style={styles.scorecardPercent}>94%</Text>
            <Text style={styles.scorecardTitle}>Progressive Overload Efficiency</Text>
            <Text style={styles.scorecardSub}>
              Training adaptation rate is on target across all compound movements.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📊 CARD 2: WEEKLY VOLUME CAPACITY (Inspired by Dribbble v4 Stepped Bars) */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          {/* Top Emerald Accent Line */}
          <View style={[styles.cardTopAccent, { backgroundColor: '#10B981' }]} />

          {/* Dual-Column Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiColumn}>
              <Text style={styles.kpiSuperTitle}>TOTAL VOLUME</Text>
              <Text style={styles.kpiMainNumber}>17.2k <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Week 4 Peak</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.kpiActionBtn}>
                <Text style={[styles.kpiActionText, { color: '#10B981' }]}>+18.6% Overload</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.kpiVerticalDivider} />

            <View style={styles.kpiColumn}>
              <Text style={styles.kpiSuperTitle}>SETS COMPLETED</Text>
              <Text style={styles.kpiMainNumber}>42 <Text style={styles.kpiUnit}>sets</Text></Text>
              <Text style={styles.kpiSubText}>4 Active Workouts</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.kpiActionBtn}>
                <Text style={styles.kpiActionText}>100% Adherence</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stepped Clean Bars */}
          <View style={styles.chartCanvasArea}>
            <BarChart
              data={WEEKLY_TONNAGE_BARS}
              barWidth={34}
              spacing={32}
              roundedTop
              roundedBottom
              radius={6}
              hideRules
              hideYAxisText
              xAxisThickness={1}
              xAxisColor="#27272A"
              yAxisThickness={0}
              xAxisLabelTextStyle={styles.chartAxisLabel}
              height={130}
              maxValue={20000}
              width={SCREEN_WIDTH - 84}
            />
          </View>

          {/* Bottom Scorecard */}
          <View style={styles.scorecardFooter}>
            <Text style={[styles.scorecardPercent, { color: '#10B981' }]}>+18.6%</Text>
            <Text style={styles.scorecardTitle}>Hypertrophy Volume Capacity</Text>
            <Text style={styles.scorecardSub}>
              Average session density increased by 420 kg compared to Week 1 baseline.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📅 CARD 3: 12-MONTH HISTOGRAM (Inspired by Dribbble v5 Micro-bars) */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          <View style={[styles.cardTopAccent, { backgroundColor: '#38BDF8' }]} />

          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiColumn}>
              <Text style={styles.kpiSuperTitle}>ANNUAL WORKOUTS</Text>
              <Text style={styles.kpiMainNumber}>144 <Text style={styles.kpiUnit}>sessions</Text></Text>
              <Text style={styles.kpiSubText}>2026 Year-to-Date</Text>
            </View>

            <View style={styles.kpiVerticalDivider} />

            <View style={styles.kpiColumn}>
              <Text style={styles.kpiSuperTitle}>AVG SESSIONS / MO</Text>
              <Text style={[styles.kpiMainNumber, { color: '#38BDF8' }]}>18.0</Text>
              <Text style={styles.kpiSubText}>Active 4.2 days/wk</Text>
            </View>
          </View>

          {/* 12 Monthly Micro-Bars */}
          <View style={styles.chartCanvasArea}>
            <BarChart
              data={MONTHLY_HISTOGRAM}
              barWidth={14}
              spacing={11}
              roundedTop
              roundedBottom
              radius={4}
              frontColor="#3F3F46"
              hideRules
              hideYAxisText
              xAxisThickness={1}
              xAxisColor="#27272A"
              yAxisThickness={0}
              xAxisLabelTextStyle={{ color: '#71717A', fontSize: 9, fontWeight: '700' }}
              height={90}
              maxValue={30}
              width={SCREEN_WIDTH - 84}
            />
          </View>

          <View style={styles.scorecardFooter}>
            <Text style={[styles.scorecardPercent, { color: '#38BDF8' }]}>4.2 d/wk</Text>
            <Text style={styles.scorecardTitle}>Annual Training Consistency</Text>
            <Text style={styles.scorecardSub}>
              Consistent training rhythm maintained across 8 consecutive months.
            </Text>
          </View>
        </View>

        {/* 🏆 CARD 4: PERSONAL RECORDS HALL OF FAME */}
        <View style={styles.dribbbleCard}>
          <View style={[styles.cardTopAccent, { backgroundColor: '#F59E0B' }]} />

          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 }}>
            <Text style={styles.kpiSuperTitle}>LIFETIME TROPHIES</Text>
            <Text style={styles.cardSectionTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {PR_RECORDS.map((item) => (
              <View key={item.id} style={styles.prRow}>
                <View style={[styles.prBadge, { backgroundColor: `${item.badgeColor}18`, borderColor: `${item.badgeColor}40` }]}>
                  <Trophy size={14} color={item.badgeColor} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.prLiftName}>{item.lift}</Text>
                  <Text style={styles.prDate}>{item.date}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 110
  },

  // 🌟 Header
  headerContainer: {
    marginBottom: 16
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
    marginBottom: 8
  },
  headerBadgeText: {
    color: '#EF4444',
    fontSize: 9,
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
    marginTop: 3,
    lineHeight: 18
  },

  // ==========================================
  // 🎴 Dribbble-Inspired Elevated Card Structure
  // ==========================================
  dribbbleCard: {
    backgroundColor: '#121215',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden'
  },
  cardTopAccent: {
    height: 3,
    backgroundColor: '#EF4444',
    width: '100%'
  },

  // 1. Dual-Column KPI Split Header
  splitKpiHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'flex-start'
  },
  kpiColumn: {
    flex: 1
  },
  kpiSuperTitle: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4
  },
  kpiMainNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  kpiUnit: {
    fontSize: 13,
    color: '#71717A',
    fontWeight: '700'
  },
  kpiSubText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  kpiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  kpiActionText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2
  },
  kpiVerticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'stretch',
    marginHorizontal: 12
  },

  // Segmented Lift Selector Tabs
  liftSelectorSegment: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1E',
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 16,
    marginBottom: 8
  },
  liftTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 7
  },
  liftTabActive: {
    backgroundColor: '#DC2626'
  },
  liftTabText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  liftTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // 2. Chart Canvas
  chartCanvasArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  chartAxisLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },
  activePointPin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC2626'
  },
  chartTooltip: {
    backgroundColor: '#1E1E22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center'
  },
  chartTooltipVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  chartTooltipDate: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '600'
  },
  barTopLabel: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 3
  },

  // 3. Bottom Efficiency Scorecard
  scorecardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.015)'
  },
  scorecardPercent: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  scorecardTitle: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2
  },
  scorecardSub: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 15
  },

  // PR Records
  cardSectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2
  },
  prList: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181C',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  prBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 10
  },
  prLiftName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  prDate: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  },
  prWeight: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  pr1RM: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1
  }
});
