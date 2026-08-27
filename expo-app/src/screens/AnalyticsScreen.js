import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  PanResponder
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
  Line
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
  Dumbbell,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CHART_WIDTH = CARD_WIDTH - 36;
const CHART_HEIGHT = 150;

// 🏋️ Interactive Compound Lift Progression Datasets
const LIFTS_DATA = {
  bench: {
    name: 'Barbell Bench Press',
    defaultEst1RM: '88.5 kg',
    defaultWorking: '75 kg',
    baseline: '65 kg',
    points: [
      { val: 65.0, est1RM: '76.7 kg', label: 'Aug 1', date: 'Fri, Aug 1', sets: '3 × 10 @ 65kg', reps: '10 reps' },
      { val: 67.5, est1RM: '79.6 kg', label: 'Aug 7', date: 'Thu, Aug 7', sets: '3 × 8 @ 67.5kg', reps: '8 reps' },
      { val: 70.0, est1RM: '82.6 kg', label: 'Aug 14', date: 'Thu, Aug 14', sets: '4 × 8 @ 70kg', reps: '8 reps' },
      { val: 72.5, est1RM: '85.5 kg', label: 'Aug 21', date: 'Thu, Aug 21', sets: '4 × 6 @ 72.5kg', reps: '6 reps' },
      { val: 75.0, est1RM: '88.5 kg', label: 'Today', date: 'Today · Aug 27', sets: '3 × 6 @ 75kg', reps: '6 reps' }
    ]
  },
  squat: {
    name: 'Barbell Back Squat',
    defaultEst1RM: '129.8 kg',
    defaultWorking: '110 kg',
    baseline: '90 kg',
    points: [
      { val: 90.0, est1RM: '106.2 kg', label: 'Aug 1', date: 'Fri, Aug 1', sets: '3 × 8 @ 90kg', reps: '8 reps' },
      { val: 95.0, est1RM: '112.1 kg', label: 'Aug 7', date: 'Thu, Aug 7', sets: '3 × 8 @ 95kg', reps: '8 reps' },
      { val: 100.0, est1RM: '118.0 kg', label: 'Aug 14', date: 'Thu, Aug 14', sets: '4 × 6 @ 100kg', reps: '6 reps' },
      { val: 105.0, est1RM: '123.9 kg', label: 'Aug 21', date: 'Thu, Aug 21', sets: '4 × 6 @ 105kg', reps: '6 reps' },
      { val: 110.0, est1RM: '129.8 kg', label: 'Today', date: 'Today · Aug 27', sets: '3 × 5 @ 110kg', reps: '5 reps' }
    ]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    defaultEst1RM: '159.3 kg',
    defaultWorking: '135 kg',
    baseline: '110 kg',
    points: [
      { val: 110.0, est1RM: '129.8 kg', label: 'Aug 1', date: 'Fri, Aug 1', sets: '3 × 6 @ 110kg', reps: '6 reps' },
      { val: 115.0, est1RM: '135.7 kg', label: 'Aug 7', date: 'Thu, Aug 7', sets: '3 × 5 @ 115kg', reps: '5 reps' },
      { val: 120.0, est1RM: '141.6 kg', label: 'Aug 14', date: 'Thu, Aug 14', sets: '3 × 5 @ 120kg', reps: '5 reps' },
      { val: 125.0, est1RM: '147.5 kg', label: 'Aug 21', date: 'Thu, Aug 21', sets: '4 × 4 @ 125kg', reps: '4 reps' },
      { val: 135.0, est1RM: '159.3 kg', label: 'Today', date: 'Today · Aug 27', sets: '3 × 4 @ 135kg', reps: '4 reps' }
    ]
  },
  press: {
    name: 'Overhead Military Press',
    defaultEst1RM: '59.0 kg',
    defaultWorking: '50 kg',
    baseline: '40 kg',
    points: [
      { val: 40.0, est1RM: '47.2 kg', label: 'Aug 1', date: 'Fri, Aug 1', sets: '3 × 10 @ 40kg', reps: '10 reps' },
      { val: 42.5, est1RM: '50.1 kg', label: 'Aug 7', date: 'Thu, Aug 7', sets: '3 × 8 @ 42.5kg', reps: '8 reps' },
      { val: 45.0, est1RM: '53.1 kg', label: 'Aug 14', date: 'Thu, Aug 14', sets: '4 × 8 @ 45kg', reps: '8 reps' },
      { val: 47.5, est1RM: '56.0 kg', label: 'Aug 21', date: 'Thu, Aug 21', sets: '4 × 6 @ 47.5kg', reps: '6 reps' },
      { val: 50.0, est1RM: '59.0 kg', label: 'Today', date: 'Today · Aug 27', sets: '3 × 6 @ 50kg', reps: '6 reps' }
    ]
  }
};

// 📊 Weekly Tonnage Pillar Data
const WEEKLY_PILLARS = [
  { id: 'w1', week: 'Week 1', short: 'W1', value: '11,200', valNum: 11200, sets: '34 sets', workouts: '3 sessions', heightPct: 0.58 },
  { id: 'w2', week: 'Week 2', short: 'W2', value: '12,800', valNum: 12800, sets: '38 sets', workouts: '4 sessions', heightPct: 0.68 },
  { id: 'w3', week: 'Week 3', short: 'W3', value: '14,500', valNum: 14500, sets: '40 sets', workouts: '4 sessions', heightPct: 0.80 },
  { id: 'w4', week: 'Week 4', short: 'W4', value: '17,200', valNum: 17200, sets: '42 sets', workouts: '4 sessions', heightPct: 1.0, isPeak: true }
];

// 📅 Monthly Training Days
const YEARLY_MONTHS = [
  { month: 'J', count: 14 },
  { month: 'F', count: 16 },
  { month: 'M', count: 15 },
  { month: 'A', count: 18 },
  { month: 'M', count: 20 },
  { month: 'J', count: 22 },
  { month: 'J', count: 19 },
  { month: 'A', count: 24, active: true },
  { month: 'S', count: 0 },
  { month: 'O', count: 0 },
  { month: 'N', count: 0 },
  { month: 'D', count: 0 }
];

// 🏆 Personal Records
const PR_CARDS = [
  { id: '1', lift: 'Barbell Bench Press', weight: '75 kg', pr1RM: '88.5 kg', date: 'Aug 2026', badgeColor: '#EF4444' },
  { id: '2', lift: 'Barbell Back Squat', weight: '110 kg', pr1RM: '129.8 kg', date: 'Aug 2026', badgeColor: '#F59E0B' },
  { id: '3', lift: 'Barbell Deadlift', weight: '135 kg', pr1RM: '159.3 kg', date: 'Aug 2026', badgeColor: '#0284C7' },
  { id: '4', lift: 'Standing Military Press', weight: '50 kg', pr1RM: '59.0 kg', date: 'Aug 2026', badgeColor: '#8B5CF6' }
];

export function AnalyticsScreen({
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const activeLift = LIFTS_DATA[selectedLiftKey] || LIFTS_DATA.bench;

  // 📊 Live Database Volume & Workout Calculations
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const realTotalVolumeKg = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (item.totalVolumeKg || 8500), 0)
    : 0;

  const displayVolumeStr = hasRealWorkouts
    ? (realTotalVolumeKg >= 1000 ? `${(realTotalVolumeKg / 1000).toFixed(1)}k` : `${realTotalVolumeKg}`)
    : '17.2k'; // Starting baseline when 0 sessions logged

  const realWorkoutsCount = hasRealWorkouts ? workoutHistory.length : 0;
  const totalSetsCount = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (item.exercisesCount * 3 || 12), 0)
    : 42;

  // 👆 Interactive Touch Scrubber State
  const [activeIndex, setActiveIndex] = useState(activeLift.points.length - 1);
  const [selectedWeekId, setSelectedWeekId] = useState('w4');

  const activePoint = activeLift.points[activeIndex] || activeLift.points[activeLift.points.length - 1];
  const activePillar = WEEKLY_PILLARS.find((p) => p.id === selectedWeekId) || WEEKLY_PILLARS[3];

  // Dynamic Overload % relative to baseline
  const baselineVal = activeLift.points[0].val;
  const currentVal = activePoint.val;
  const gainKg = (currentVal - baselineVal).toFixed(1);
  const gainPct = Math.round(((currentVal - baselineVal) / baselineVal) * 100);

  // 📐 Precise Coordinate Calculation for Spline
  const minVal = activeLift.points[0].val * 0.92;
  const maxVal = activeLift.points[activeLift.points.length - 1].val * 1.05;
  const range = maxVal - minVal || 1;

  const pointCoords = activeLift.points.map((pt, idx) => {
    const x = 16 + (idx * (CHART_WIDTH - 32)) / (activeLift.points.length - 1);
    const y = CHART_HEIGHT - 20 - ((pt.val - minVal) / range) * (CHART_HEIGHT - 45);
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

  const activeCoord = pointCoords[activeIndex] || pointCoords[pointCoords.length - 1];

  // 🖱️ PanResponder for Live Interactive Dragging across Graph
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleTouchX(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        handleTouchX(evt.nativeEvent.locationX);
      }
    })
  ).current;

  const handleTouchX = (touchX) => {
    let closestIdx = 0;
    let minDistance = 9999;
    pointCoords.forEach((coord, i) => {
      const dist = Math.abs(coord.x - touchX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    });
    setActiveIndex(closestIdx);
  };

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
            Touch & drag graphs to scrub historical volume & 1RM mechanics.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 🎴 CARD 1: INTERACTIVE 1RM PROGRESSION LAB                                */}
        {/* ========================================================================= */}
        <View style={styles.modernCard}>
          {/* Top Subtle Ambient Glow */}
          <View style={styles.cardGlowLine} />

          {/* 1. Dynamic Split KPI Header (Changes in real-time as you scrub) */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>{activePoint.est1RM}</Text>
              <Text style={styles.kpiSubText}>Working: {activePoint.val} kg</Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>{activePoint.reps}</Text>
              </View>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD RATE</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>+{gainPct}%</Text>
              <Text style={styles.kpiSubText}>+{gainKg} kg Gain</Text>
              <View style={[styles.kpiPillTag, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Text style={[styles.kpiPillTagText, { color: '#10B981' }]}>Optimal Adaptation</Text>
              </View>
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
                  onPress={() => {
                    setSelectedLiftKey(item.key);
                    setActiveIndex(LIFTS_DATA[item.key].points.length - 1);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.liftTabText, isActive && styles.liftTabTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2. Interactive SVG Spline Canvas (Supports Touch Dragging & Scrubbing) */}
          <View style={styles.chartInteractiveWrapper} {...panResponder.panHandlers}>
            {/* Live Floating Tooltip HUD */}
            <View style={[styles.liveCursorHUD, { left: Math.max(10, Math.min(CHART_WIDTH - 120, activeCoord.x - 60)) }]}>
              <Text style={styles.liveCursorWeight}>{activePoint.val} kg</Text>
              <Text style={styles.liveCursorDate}>{activePoint.date}</Text>
            </View>

            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                <SvgGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                  <Stop offset="50%" stopColor="#DC2626" stopOpacity="0.15" />
                  <Stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </SvgGradient>
              </Defs>

              {/* Minimal Horizontal Gridlines */}
              <Line x1="0" y1="35" x2={CHART_WIDTH} y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="5,5" />
              <Line x1="0" y1="85" x2={CHART_WIDTH} y2="85" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="5,5" />
              <Line x1="0" y1={CHART_HEIGHT - 1} x2={CHART_WIDTH} y2={CHART_HEIGHT - 1} stroke="#27272A" strokeWidth="1" />

              {/* Area Wave Gradient */}
              <Path d={areaPath} fill="url(#crimsonGradient)" />

              {/* High-Contrast Crimson Glowing Spline */}
              <Path d={linePath} stroke="#EF4444" strokeWidth="3.5" fill="none" strokeLinecap="round" />

              {/* Interactive Laser Vertical Guide at Active Finger Location */}
              <Line
                x1={activeCoord.x}
                y1={activeCoord.y}
                x2={activeCoord.x}
                y2={CHART_HEIGHT}
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />

              {/* Background Dots */}
              {pointCoords.map((coord, i) => {
                const isCurrent = i === activeIndex;
                return (
                  <Circle
                    key={i}
                    cx={coord.x}
                    cy={coord.y}
                    r={isCurrent ? 6 : 3.5}
                    fill={isCurrent ? '#FFFFFF' : '#EF4444'}
                    stroke={isCurrent ? '#EF4444' : '#141416'}
                    strokeWidth={isCurrent ? 3 : 1.5}
                  />
                );
              })}
            </Svg>

            {/* X-Axis Dates */}
            <View style={styles.chartDateRow}>
              {activeLift.points.map((pt, i) => (
                <TouchableOpacity key={i} onPress={() => setActiveIndex(i)} activeOpacity={0.7}>
                  <Text style={[styles.chartDateText, i === activeIndex && styles.chartDateTextActive]}>
                    {pt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interactive Scrub Hint Bar */}
          <View style={styles.scrubberHintBar}>
            <Zap size={12} color="#EF4444" style={{ marginRight: 5 }} />
            <Text style={styles.scrubberHintText}>
              Selected: <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{activePoint.sets}</Text> · 1RM {activePoint.est1RM}
            </Text>
          </View>

          {/* 3. Bottom Efficiency Scorecard */}
          <View style={styles.scorecardFooter}>
            <View style={styles.scorecardRow}>
              <View>
                <Text style={styles.scorecardBigPercent}>94%</Text>
                <Text style={styles.scorecardTitle}>Progressive Overload Efficiency</Text>
              </View>
              <View style={styles.efficiencyGradeBadge}>
                <Text style={styles.efficiencyGradeText}>GRADE A+</Text>
              </View>
            </View>
            <Text style={styles.scorecardDesc}>
              Mechanical tension adaptation rate is consistently trending above baseline (+{gainKg}kg).
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📊 CARD 2: INTERACTIVE WEEKLY TONNAGE PILLARS                             */}
        {/* ========================================================================= */}
        <View style={styles.modernCard}>
          <View style={[styles.cardGlowLine, { backgroundColor: '#10B981' }]} />

          {/* Dynamic Dual-Column Header based on Tapped Week */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>{hasRealWorkouts ? 'RECORDED VOLUME' : `${activePillar.week.toUpperCase()} VOLUME`}</Text>
              <Text style={styles.kpiBigNumber}>{displayVolumeStr} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>{hasRealWorkouts ? `${realWorkoutsCount} Logged Sessions` : activePillar.workouts}</Text>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>INTENSITY & SETS</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>{totalSetsCount} <Text style={styles.kpiUnit}>sets</Text></Text>
              <Text style={styles.kpiSubText}>100% Adherence</Text>
            </View>
          </View>

          {/* Interactive Stepped Pillars (Tap to Select Week) */}
          <View style={styles.pillarsContainer}>
            {WEEKLY_PILLARS.map((pillar) => {
              const isSelected = pillar.id === selectedWeekId;
              return (
                <TouchableOpacity
                  key={pillar.id}
                  style={styles.pillarCol}
                  onPress={() => setSelectedWeekId(pillar.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillarValueLabel, isSelected && { color: '#FFFFFF', fontWeight: '900' }]}>
                    {pillar.valNum >= 1000 ? `${(pillar.valNum / 1000).toFixed(1)}k` : pillar.valNum}
                  </Text>
                  <View style={[styles.pillarTrack, isSelected && styles.pillarTrackSelected]}>
                    <View
                      style={[
                        styles.pillarBar,
                        {
                          height: `${pillar.heightPct * 100}%`,
                          backgroundColor: isSelected ? '#EF4444' : pillar.isPeak ? '#B91C1C' : '#3F3F46'
                        }
                      ]}
                    />
                  </View>
                  <View style={[styles.pillarPillTag, isSelected && styles.pillarPillTagActive]}>
                    <Text style={[styles.pillarWeekLabel, isSelected && styles.pillarWeekLabelActive]}>
                      {pillar.short}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Scorecard */}
          <View style={styles.scorecardFooter}>
            <View style={styles.scorecardRow}>
              <View>
                <Text style={[styles.scorecardBigPercent, { color: '#10B981' }]}>+18.6%</Text>
                <Text style={styles.scorecardTitle}>Hypertrophy Work Capacity</Text>
              </View>
              <View style={[styles.efficiencyGradeBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}>
                <Text style={[styles.efficiencyGradeText, { color: '#10B981' }]}>+420 kg / Session</Text>
              </View>
            </View>
            <Text style={styles.scorecardDesc}>
              Total tonnage increased steadily across training blocks with progressive overload.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📅 CARD 3: ANNUAL 12-MONTH CONSISTENCY MATRIX                              */}
        {/* ========================================================================= */}
        <View style={styles.modernCard}>
          <View style={[styles.cardGlowLine, { backgroundColor: '#38BDF8' }]} />

          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ANNUAL SESSIONS</Text>
              <Text style={styles.kpiBigNumber}>{hasRealWorkouts ? realWorkoutsCount : 144} <Text style={styles.kpiUnit}>workouts</Text></Text>
              <Text style={styles.kpiSubText}>2026 Year-to-Date</Text>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>MONTHLY AVERAGE</Text>
              <Text style={[styles.kpiBigNumber, { color: '#38BDF8' }]}>{hasRealWorkouts ? Math.max(1, Math.round(realWorkoutsCount / 8)) : '18.0'}</Text>
              <Text style={styles.kpiSubText}>4.2 Days / Week</Text>
            </View>
          </View>

          {/* 12-Month Micro-Bars */}
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
            <Text style={styles.scorecardTitle}>Consistency Index</Text>
            <Text style={styles.scorecardDesc}>
              Consistent hypertrophy habit maintained across 8 consecutive calendar months.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 4: PERSONAL BEST RECORDS HALL OF FAME                             */}
        {/* ========================================================================= */}
        <View style={styles.modernCard}>
          <View style={[styles.cardGlowLine, { backgroundColor: '#F59E0B' }]} />

          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
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

  // 🎴 Modern Luxury Cards
  modernCard: {
    backgroundColor: '#121215',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden'
  },
  cardGlowLine: {
    height: 3,
    backgroundColor: '#EF4444',
    width: '100%'
  },

  // Split KPI Header
  splitKpiHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
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
  kpiPillTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  kpiPillTagText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800'
  },
  kpiDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'stretch',
    marginHorizontal: 12
  },

  // Lift Tabs
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

  // Interactive Chart Canvas Area
  chartInteractiveWrapper: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    alignItems: 'center',
    position: 'relative'
  },
  liveCursorHUD: {
    position: 'absolute',
    top: 2,
    backgroundColor: '#1C1C20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    zIndex: 10
  },
  liveCursorWeight: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  liveCursorDate: {
    color: '#A1A1AA',
    fontSize: 8,
    fontWeight: '600'
  },
  chartDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    marginTop: 8
  },
  chartDateText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },
  chartDateTextActive: {
    color: '#EF4444',
    fontWeight: '800'
  },

  // Scrubber Hint Bar
  scrubberHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  scrubberHintText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600'
  },

  // Pillars (Interactive Week Bars)
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
    width: 54
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  pillarTrackSelected: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)'
  },
  pillarBar: {
    width: '100%',
    borderRadius: 8
  },
  pillarPillTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6
  },
  pillarPillTagActive: {
    backgroundColor: '#DC2626'
  },
  pillarWeekLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  pillarWeekLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // 12-Month Micro-Bars
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

  // Scorecard Footer
  scorecardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.015)'
  },
  scorecardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    marginTop: 4,
    lineHeight: 16
  },
  efficiencyGradeBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  efficiencyGradeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800'
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
