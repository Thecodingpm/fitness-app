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
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
  Line,
  Rect
} from 'react-native-svg';
import {
  TrendingUp,
  Activity,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
  Dumbbell
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CHART_WIDTH = CARD_WIDTH - 32;
const CHART_HEIGHT = 130;

// 🏋️ Compound Lift Data
const LIFTS_DATABASE = {
  bench: {
    name: 'Barbell Bench Press',
    workingWeight: '75 kg',
    est1RM: '88.5 kg',
    overloadGain: '+15.4%',
    baseline: '65 kg',
    efficiencyScore: '94%',
    efficiencyDesc: 'Progressive overload adaptation rate is optimal across chest hypertrophy sets.',
    points: [
      { val: 65, label: 'Aug 1', date: 'Aug 1' },
      { val: 67.5, label: 'Aug 7', date: 'Aug 7' },
      { val: 70, label: 'Aug 14', date: 'Aug 14' },
      { val: 72.5, label: 'Aug 21', date: 'Aug 21' },
      { val: 75, label: 'Today', date: 'Aug 27' }
    ]
  },
  squat: {
    name: 'Barbell Back Squat',
    workingWeight: '110 kg',
    est1RM: '129.8 kg',
    overloadGain: '+22.2%',
    baseline: '90 kg',
    efficiencyScore: '96%',
    efficiencyDesc: 'Quad recruitment & posterior chain power curve is outpacing baseline by +20kg.',
    points: [
      { val: 90, label: 'Aug 1', date: 'Aug 1' },
      { val: 95, label: 'Aug 7', date: 'Aug 7' },
      { val: 100, label: 'Aug 14', date: 'Aug 14' },
      { val: 105, label: 'Aug 21', date: 'Aug 21' },
      { val: 110, label: 'Today', date: 'Aug 27' }
    ]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    workingWeight: '135 kg',
    est1RM: '159.3 kg',
    overloadGain: '+22.7%',
    baseline: '110 kg',
    efficiencyScore: '98%',
    efficiencyDesc: 'Peak mechanical tension & central nervous system drive at all-time high.',
    points: [
      { val: 110, label: 'Aug 1', date: 'Aug 1' },
      { val: 115, label: 'Aug 7', date: 'Aug 7' },
      { val: 120, label: 'Aug 14', date: 'Aug 14' },
      { val: 125, label: 'Aug 21', date: 'Aug 21' },
      { val: 135, label: 'Today', date: 'Aug 27' }
    ]
  },
  press: {
    name: 'Overhead Military Press',
    workingWeight: '50 kg',
    est1RM: '59.0 kg',
    overloadGain: '+25.0%',
    baseline: '40 kg',
    efficiencyScore: '91%',
    efficiencyDesc: 'Deltoid stabilization & lock-out velocity showing clean weekly adaptation.',
    points: [
      { val: 40, label: 'Aug 1', date: 'Aug 1' },
      { val: 42.5, label: 'Aug 7', date: 'Aug 7' },
      { val: 45, label: 'Aug 14', date: 'Aug 14' },
      { val: 47.5, label: 'Aug 21', date: 'Aug 21' },
      { val: 50, label: 'Today', date: 'Aug 27' }
    ]
  }
};

// 📊 Weekly Tonnage Pillar Data (Dribbble v4)
const WEEKLY_PILLARS = [
  { week: 'W1', value: '11.2k', heightPct: 0.58, color: '#27272A', active: false },
  { week: 'W2', value: '12.8k', heightPct: 0.68, color: '#3F3F46', active: false },
  { week: 'W3', value: '14.5k', heightPct: 0.80, color: '#71717A', active: false },
  { week: 'W4', value: '17.2k', heightPct: 1.0, color: '#EF4444', active: true }
];

// 📅 12-Month Year-to-Date Micro Bars (Dribbble v5)
const YEARLY_MONTHS = [
  { month: 'J', count: 14, active: false },
  { month: 'F', count: 16, active: false },
  { month: 'M', count: 15, active: false },
  { month: 'A', count: 18, active: false },
  { month: 'M', count: 20, active: false },
  { month: 'J', count: 22, active: false },
  { month: 'J', count: 19, active: false },
  { month: 'A', count: 24, active: true }, // Current Month
  { month: 'S', count: 0, active: false },
  { month: 'O', count: 0, active: false },
  { month: 'N', count: 0, active: false },
  { month: 'D', count: 0, active: false }
];

// 🏆 Personal Records
const PR_CARDS = [
  { id: '1', lift: 'Barbell Bench Press', weight: '75 kg', pr1RM: '88.5 kg', date: 'Aug 2026', badgeColor: '#EF4444' },
  { id: '2', lift: 'Barbell Back Squat', weight: '110 kg', pr1RM: '129.8 kg', date: 'Aug 2026', badgeColor: '#F59E0B' },
  { id: '3', lift: 'Barbell Deadlift', weight: '135 kg', pr1RM: '159.3 kg', date: 'Aug 2026', badgeColor: '#0284C7' },
  { id: '4', lift: 'Standing Military Press', weight: '50 kg', pr1RM: '59.0 kg', date: 'Aug 2026', badgeColor: '#8B5CF6' }
];

export function AnalyticsScreen() {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const activeLift = LIFTS_DATABASE[selectedLiftKey] || LIFTS_DATABASE.bench;

  // 📐 Generate Smooth Cubic Bezier Spline for Wave (Dribbble v3)
  const minVal = activeLift.points[0].val * 0.9;
  const maxVal = activeLift.points[activeLift.points.length - 1].val * 1.06;
  const range = maxVal - minVal || 1;

  const pointCoords = activeLift.points.map((pt, idx) => {
    const x = 12 + (idx * (CHART_WIDTH - 24)) / (activeLift.points.length - 1);
    const y = CHART_HEIGHT - 18 - ((pt.val - minVal) / range) * (CHART_HEIGHT - 40);
    return { x, y, pt };
  });

  // Calculate smooth cubic bezier path
  let linePath = `M ${pointCoords[0].x} ${pointCoords[0].y}`;
  for (let i = 0; i < pointCoords.length - 1; i++) {
    const p0 = pointCoords[i];
    const p1 = pointCoords[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    linePath += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const lastCoord = pointCoords[pointCoords.length - 1];
  const areaPath = `${linePath} L ${lastCoord.x} ${CHART_HEIGHT} L ${pointCoords[0].x} ${CHART_HEIGHT} Z`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

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
        {/* 🎴 CARD 1: 1RM STRENGTH PROGRESSION WAVE (Dribbble v3 Architecture)      */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          <View style={styles.topAccentRed} />

          {/* 1. Dual-Column Split KPI Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>{activeLift.est1RM}</Text>
              <Text style={styles.kpiSubText}>Working Set: {activeLift.workingWeight}</Text>
              <TouchableOpacity style={styles.kpiLinkBtn} activeOpacity={0.7}>
                <Text style={styles.kpiLinkText}>View Log</Text>
                <ChevronRight size={12} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD GAIN</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>{activeLift.overloadGain}</Text>
              <Text style={styles.kpiSubText}>Baseline: {activeLift.baseline}</Text>
              <TouchableOpacity style={styles.kpiLinkBtn} activeOpacity={0.7}>
                <Text style={[styles.kpiLinkText, { color: '#10B981' }]}>+10 kg Overload</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Segmented Lift Selector Tabs */}
          <View style={styles.liftTabsWrapper}>
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

          {/* 2. Fluid Organic SVG Bezier Wave (Dribbble v3) */}
          <View style={styles.svgContainer}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                <SvgGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </SvgGradient>
              </Defs>

              {/* Background Hairline Gridlines */}
              <Line x1="0" y1="30" x2={CHART_WIDTH} y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <Line x1="0" y1="75" x2={CHART_WIDTH} y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <Line x1="0" y1={CHART_HEIGHT - 1} x2={CHART_WIDTH} y2={CHART_HEIGHT - 1} stroke="#27272A" strokeWidth="1" />

              {/* Gradient Area Wave */}
              <Path d={areaPath} fill="url(#crimsonGradient)" />

              {/* Glowing Cubic Bezier Line */}
              <Path d={linePath} stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Vertical Dashed Drop Guideline to X-Axis */}
              <Line
                x1={lastCoord.x}
                y1={lastCoord.y}
                x2={lastCoord.x}
                y2={CHART_HEIGHT}
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Subtle Milestone Dots on the Curve */}
              {pointCoords.map((coord, i) => (
                <Circle
                  key={i}
                  cx={coord.x}
                  cy={coord.y}
                  r={i === pointCoords.length - 1 ? 5.5 : 3.5}
                  fill={i === pointCoords.length - 1 ? '#FFFFFF' : '#EF4444'}
                  stroke={i === pointCoords.length - 1 ? '#DC2626' : '#141416'}
                  strokeWidth={i === pointCoords.length - 1 ? 2.5 : 1.5}
                />
              ))}
            </Svg>

            {/* Start & End Dates Under Graph */}
            <View style={styles.chartDateRow}>
              <Text style={styles.chartDateText}>Aug 1, 2026</Text>
              <Text style={styles.chartDateText}>Today · Aug 27</Text>
            </View>
          </View>

          {/* 3. Bottom Scorecard (Dribbble v3 Footer) */}
          <View style={styles.scorecardFooter}>
            <Text style={styles.scorecardBigPercent}>{activeLift.efficiencyScore}</Text>
            <Text style={styles.scorecardTitle}>Progressive Overload Efficiency</Text>
            <Text style={styles.scorecardDesc}>{activeLift.efficiencyDesc}</Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📊 CARD 2: WEEKLY TONNAGE CAPACITY (Dribbble v4 Architecture)            */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          <View style={[styles.topAccentRed, { backgroundColor: '#10B981' }]} />

          {/* Dual-Column Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>TOTAL VOLUME</Text>
              <Text style={styles.kpiBigNumber}>17.2k <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Week 4 Peak</Text>
              <TouchableOpacity style={styles.kpiLinkBtn} activeOpacity={0.7}>
                <Text style={[styles.kpiLinkText, { color: '#10B981' }]}>+18.6% Overload</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>SETS COMPLETED</Text>
              <Text style={styles.kpiBigNumber}>42 <Text style={styles.kpiUnit}>sets</Text></Text>
              <Text style={styles.kpiSubText}>4 Active Workouts</Text>
              <TouchableOpacity style={styles.kpiLinkBtn} activeOpacity={0.7}>
                <Text style={styles.kpiLinkText}>100% Adherence</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stepped Pillar Bar Visuals (Dribbble v4) */}
          <View style={styles.pillarsContainer}>
            {WEEKLY_PILLARS.map((pillar, i) => (
              <View key={i} style={styles.pillarCol}>
                <Text style={[styles.pillarValueLabel, pillar.active && { color: '#EF4444', fontWeight: '900' }]}>
                  {pillar.value}
                </Text>
                <View style={styles.pillarTrack}>
                  <View
                    style={[
                      styles.pillarBar,
                      {
                        height: `${pillar.heightPct * 100}%`,
                        backgroundColor: pillar.color
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.pillarWeekLabel, pillar.active && { color: '#FFFFFF', fontWeight: '800' }]}>
                  {pillar.week}
                </Text>
              </View>
            ))}
          </View>

          {/* Bottom Scorecard */}
          <View style={styles.scorecardFooter}>
            <Text style={[styles.scorecardBigPercent, { color: '#10B981' }]}>+18.6%</Text>
            <Text style={styles.scorecardTitle}>Hypertrophy Volume Capacity</Text>
            <Text style={styles.scorecardDesc}>
              Average session density increased by 420 kg compared to Week 1 baseline.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📅 CARD 3: 12-MONTH SPARKLINE HISTOGRAM (Dribbble v5 Architecture)       */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          <View style={[styles.topAccentRed, { backgroundColor: '#38BDF8' }]} />

          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ANNUAL WORKOUTS</Text>
              <Text style={styles.kpiBigNumber}>144 <Text style={styles.kpiUnit}>sessions</Text></Text>
              <Text style={styles.kpiSubText}>2026 Year-to-Date</Text>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>AVG SESSIONS / MO</Text>
              <Text style={[styles.kpiBigNumber, { color: '#38BDF8' }]}>18.0</Text>
              <Text style={styles.kpiSubText}>Active 4.2 days/wk</Text>
            </View>
          </View>

          {/* 12-Month Micro-Bars (Dribbble v5) */}
          <View style={styles.microBarsRow}>
            {YEARLY_MONTHS.map((m, i) => {
              const barHeightPct = m.count > 0 ? (m.count / 26) * 100 : 8;
              return (
                <View key={i} style={styles.microBarItem}>
                  <View style={styles.microBarTrack}>
                    <View
                      style={[
                        styles.microBarFill,
                        {
                          height: `${barHeightPct}%`,
                          backgroundColor: m.active ? '#EF4444' : m.count > 0 ? '#52525B' : '#27272A'
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.microMonthLabel, m.active && { color: '#FFFFFF', fontWeight: '800' }]}>
                    {m.month}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.scorecardFooter}>
            <Text style={[styles.scorecardBigPercent, { color: '#38BDF8' }]}>4.2 d/wk</Text>
            <Text style={styles.scorecardTitle}>Annual Training Consistency</Text>
            <Text style={styles.scorecardDesc}>
              Consistent training rhythm maintained across 8 consecutive months.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 4: PERSONAL RECORDS HALL OF FAME                                  */}
        {/* ========================================================================= */}
        <View style={styles.dribbbleCard}>
          <View style={[styles.topAccentRed, { backgroundColor: '#F59E0B' }]} />

          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 }}>
            <Text style={styles.kpiSuperTitle}>LIFETIME TROPHIES</Text>
            <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {PR_CARDS.map((item) => (
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
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110
  },

  // Header
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

  // 🎴 Dribbble-Style Elevated Cards
  dribbbleCard: {
    backgroundColor: '#121215',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden'
  },
  topAccentRed: {
    height: 3,
    backgroundColor: '#EF4444',
    width: '100%'
  },

  // 1. Dual-Column Split KPI Header
  splitKpiHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'flex-start'
  },
  kpiCol: {
    flex: 1
  },
  kpiSuperTitle: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4
  },
  kpiBigNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  kpiUnit: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '700'
  },
  kpiSubText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  kpiLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  kpiLinkText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2
  },
  kpiDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'stretch',
    marginHorizontal: 12
  },

  // Segmented Lift Selector Tabs
  liftTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1E',
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 16,
    marginBottom: 10
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

  // 2. Pure SVG Bezier Wave Area (Dribbble v3)
  svgContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    alignItems: 'center'
  },
  chartDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    marginTop: 6
  },
  chartDateText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },

  // 3. Stepped Pillar Bar Visuals (Dribbble v4)
  pillarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10
  },
  pillarCol: {
    alignItems: 'center',
    width: 52
  },
  pillarValueLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6
  },
  pillarTrack: {
    width: 38,
    height: 85,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  pillarBar: {
    width: '100%',
    borderRadius: 8
  },
  pillarWeekLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6
  },

  // 4. 12-Month Micro-Bars (Dribbble v5)
  microBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  microBarItem: {
    alignItems: 'center',
    flex: 1
  },
  microBarTrack: {
    width: 12,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  microBarFill: {
    width: '100%',
    borderRadius: 4
  },
  microMonthLabel: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4
  },

  // 5. Bottom Scorecard (Dribbble v3 Footer)
  scorecardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.015)'
  },
  scorecardBigPercent: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  scorecardTitle: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2
  },
  scorecardDesc: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 16
  },

  // PR Records
  cardHeaderTitle: {
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
