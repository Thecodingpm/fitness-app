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
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
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
      { value: 75, label: 'Today' }
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
      { value: 110, label: 'Today' }
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
      { value: 135, label: 'Today' }
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
      { value: 50, label: 'Today' }
    ]
  }
};

// 📊 Weekly Tonnage Bars
const WEEKLY_VOLUME_BARS = [
  { value: 11200, label: 'Wk 1', display: '11.2k', percent: 65, isHighlight: false },
  { value: 12800, label: 'Wk 2', display: '12.8k', percent: 74, isHighlight: false },
  { value: 14500, label: 'Wk 3', display: '14.5k', percent: 84, isHighlight: false },
  { value: 17200, label: 'Wk 4', display: '17.2k', percent: 100, isHighlight: true }
];

// 🍩 Muscle Volume Balance Data
const MUSCLE_PIE_DATA = [
  { label: 'Chest', percent: 30, color: '#DC2626' },
  { label: 'Back & Lats', percent: 25, color: '#0284C7' },
  { label: 'Legs & Quads', percent: 25, color: '#F59E0B' },
  { label: 'Shoulders', percent: 12, color: '#8B5CF6' },
  { label: 'Arms', percent: 8, color: '#10B981' }
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
  const [selectedPointIdx, setSelectedPointIdx] = useState(4); // Default to latest
  const activeLift = EXERCISE_LIFT_DATA[selectedLiftKey] || EXERCISE_LIFT_DATA.bench;

  // Compute SVG Line & Area coordinates
  const svgWidth = Math.max(SCREEN_WIDTH - 76, 260);
  const svgHeight = 140;
  const paddingX = 24;
  const paddingY = 20;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const minVal = Math.min(...activeLift.data.map(d => d.value));
  const maxVal = Math.max(...activeLift.data.map(d => d.value));
  const valRange = maxVal - minVal || 1;

  const points = activeLift.data.map((d, idx) => {
    const x = paddingX + (idx / (activeLift.data.length - 1)) * innerWidth;
    const y = svgHeight - paddingY - ((d.value - minVal) / valRange) * innerHeight;
    return { x, y, ...d };
  });

  // Construct SVG paths
  const linePath = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cx1 = (prev.x + pt.x) / 2;
    const cy1 = prev.y;
    const cx2 = (prev.x + pt.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  const selectedPt = points[selectedPointIdx] || points[points.length - 1];

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
                    onPress={() => {
                      setSelectedLiftKey(item.key);
                      setSelectedPointIdx(4);
                    }}
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

          {/* Interactive Native SVG Chart Box */}
          <View style={styles.chartBox}>
            {/* Active Floating Tooltip */}
            <View style={styles.activeTooltipContainer}>
              <View style={styles.tooltipPill}>
                <Text style={styles.tooltipWeight}>{selectedPt.value} kg</Text>
                <Text style={styles.tooltipSub}>{selectedPt.label} • Working Set</Text>
              </View>
            </View>

            <Svg width={svgWidth} height={svgHeight} style={{ overflow: 'visible' }}>
              <Defs>
                <SvgLinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </SvgLinearGradient>
              </Defs>

              {/* Area Gradient Fill */}
              <Path d={areaPath} fill="url(#areaGradient)" />

              {/* Glowing Line Path */}
              <Path d={linePath} stroke="#DC2626" strokeWidth={3} fill="none" />

              {/* Data Point Dots */}
              {points.map((pt, idx) => {
                const isSelected = selectedPointIdx === idx;
                return (
                  <Circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#FFFFFF' : '#EF4444'}
                    stroke={isSelected ? '#EF4444' : '#09090B'}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                );
              })}
            </Svg>

            {/* Bottom X-Axis Date Labels & Tap Targets */}
            <View style={styles.xAxisRow}>
              {points.map((pt, idx) => {
                const isSelected = selectedPointIdx === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedPointIdx(idx)}
                    style={styles.xAxisCol}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.axisLabel, isSelected && styles.axisLabelActive]}>
                      {pt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Zap size={12} color="#71717A" style={{ marginRight: 5 }} />
            <Text style={styles.cardFooterText}>
              Tap points to view historical working set weights
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

          {/* Native Volume Bar Chart */}
          <View style={styles.volumeBarContainer}>
            {WEEKLY_VOLUME_BARS.map((bar, idx) => (
              <View key={idx} style={styles.volumeBarCol}>
                <Text style={[styles.barTopVal, bar.isHighlight && { color: '#EF4444', fontWeight: '800' }]}>
                  {bar.display}
                </Text>
                <View style={styles.barTrack}>
                  <LinearGradient
                    colors={bar.isHighlight ? ['#EF4444', '#B91C1C'] : ['#3F3F46', '#27272A']}
                    style={[styles.barFill, { height: `${bar.percent}%` }]}
                  />
                </View>
                <Text style={[styles.barBottomLabel, bar.isHighlight && { color: '#FFFFFF', fontWeight: '700' }]}>
                  {bar.label}
                </Text>
              </View>
            ))}
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
            {/* Donut Ring Visual with Center Sets Metric */}
            <View style={styles.donutContainer}>
              <Svg width={100} height={100} viewBox="0 0 100 100">
                {/* Background Ring */}
                <Circle cx="50" cy="50" r="38" stroke="#1F1F23" strokeWidth="12" fill="none" />
                {/* 30% Chest Segment */}
                <Circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#DC2626"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="71.6 167"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* 25% Back Segment */}
                <Circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#0284C7"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="59.6 179"
                  strokeDashoffset="-71.6"
                  strokeLinecap="round"
                />
                {/* 25% Legs Segment */}
                <Circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="59.6 179"
                  strokeDashoffset="-131.2"
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.donutCenterContent}>
                <Text style={styles.donutCenterNum}>42</Text>
                <Text style={styles.donutCenterSub}>SETS</Text>
              </View>
            </View>

            {/* Muscle Breakdown List */}
            <View style={styles.legendCol}>
              {MUSCLE_PIE_DATA.map((item, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendPercent}>{item.percent}%</Text>
                </View>
              ))}
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.28)'
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
    letterSpacing: -0.5,
    marginBottom: 4
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 18
  },

  // ⚡ KPI Row
  heroTrioRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  heroMetricCard: {
    flex: 1,
    backgroundColor: '#121214',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222226'
  },
  heroMetricLabel: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6
  },
  heroMetricVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6
  },
  heroMetricUnit: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600'
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  growthPillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700'
  },

  // 🗂️ Reusable Card
  card: {
    backgroundColor: '#121214',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222226',
    marginBottom: 16
  },
  cardHeaderStack: {
    marginBottom: 12
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  cardSuperTitle: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  cardMainTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  statCallout: {
    alignItems: 'flex-end'
  },
  statCalloutVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  statCalloutGrowth: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700'
  },

  // Segment Buttons
  segmentedTabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1C1C20',
    borderRadius: 10,
    padding: 3,
    gap: 4
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center'
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

  // Chart Box
  chartBox: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
    position: 'relative'
  },
  activeTooltipContainer: {
    marginBottom: 8,
    alignItems: 'center'
  },
  tooltipPill: {
    backgroundColor: '#1C1C20',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tooltipWeight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  tooltipSub: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '500'
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 6
  },
  xAxisCol: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6
  },
  axisLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },
  axisLabelActive: {
    color: '#EF4444',
    fontWeight: '800'
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)'
  },
  cardFooterText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500'
  },

  // Volume Bar Chart
  overloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  overloadText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700'
  },
  volumeBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 16
  },
  volumeBarCol: {
    alignItems: 'center',
    flex: 1
  },
  barTopVal: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6
  },
  barTrack: {
    width: 32,
    height: 90,
    backgroundColor: '#1A1A1E',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    borderRadius: 8
  },
  barBottomLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6
  },

  // Donut Chart & Symmetry
  setsTotalBadge: {
    backgroundColor: '#1C1C20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A30'
  },
  setsTotalText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  donutContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  donutCenterContent: {
    position: 'absolute',
    alignItems: 'center'
  },
  donutCenterNum: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  donutCenterSub: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800'
  },
  legendCol: {
    flex: 1,
    marginLeft: 20,
    gap: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  legendLabel: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  legendPercent: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },

  // Hall of Fame PRs
  prList: {
    gap: 10
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272A'
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
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2
  },
  prDate: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500'
  },
  prNumbers: {
    alignItems: 'flex-end'
  },
  prWeight: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  pr1RM: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600'
  }
});
