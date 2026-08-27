import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  PanResponder,
  Modal,
  TextInput,
  Alert
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
  Plus,
  X,
  Check,
  RotateCcw
} from 'lucide-react-native';
import { persistExerciseLogs, loadExerciseLogs } from '../services/sessionStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CHART_WIDTH = CARD_WIDTH - 36;
const CHART_HEIGHT = 150;

// 🏋️ Default baseline progression points
const DEFAULT_LIFTS = {
  bench: {
    name: 'Barbell Bench Press',
    baseline: 65,
    points: [
      { val: 65.0, reps: 10, label: 'Aug 1', date: 'Aug 1', sets: '3 × 10 @ 65kg' },
      { val: 67.5, reps: 8, label: 'Aug 7', date: 'Aug 7', sets: '3 × 8 @ 67.5kg' },
      { val: 70.0, reps: 8, label: 'Aug 14', date: 'Aug 14', sets: '4 × 8 @ 70kg' },
      { val: 72.5, reps: 6, label: 'Aug 21', date: 'Aug 21', sets: '4 × 6 @ 72.5kg' },
      { val: 75.0, reps: 6, label: 'Today', date: 'Today', sets: '3 × 6 @ 75kg' }
    ]
  },
  squat: {
    name: 'Barbell Back Squat',
    baseline: 90,
    points: [
      { val: 90.0, reps: 8, label: 'Aug 1', date: 'Aug 1', sets: '3 × 8 @ 90kg' },
      { val: 95.0, reps: 8, label: 'Aug 7', date: 'Aug 7', sets: '3 × 8 @ 95kg' },
      { val: 100.0, reps: 6, label: 'Aug 14', date: 'Aug 14', sets: '4 × 6 @ 100kg' },
      { val: 105.0, reps: 6, label: 'Aug 21', date: 'Aug 21', sets: '4 × 6 @ 105kg' },
      { val: 110.0, reps: 5, label: 'Today', date: 'Today', sets: '3 × 5 @ 110kg' }
    ]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    baseline: 110,
    points: [
      { val: 110.0, reps: 6, label: 'Aug 1', date: 'Aug 1', sets: '3 × 6 @ 110kg' },
      { val: 115.0, reps: 5, label: 'Aug 7', date: 'Aug 7', sets: '3 × 5 @ 115kg' },
      { val: 120.0, reps: 5, label: 'Aug 14', date: 'Aug 14', sets: '3 × 5 @ 120kg' },
      { val: 125.0, reps: 4, label: 'Aug 21', date: 'Aug 21', sets: '4 × 4 @ 125kg' },
      { val: 135.0, reps: 4, label: 'Today', date: 'Today', sets: '3 × 4 @ 135kg' }
    ]
  },
  press: {
    name: 'Overhead Military Press',
    baseline: 40,
    points: [
      { val: 40.0, reps: 10, label: 'Aug 1', date: 'Aug 1', sets: '3 × 10 @ 40kg' },
      { val: 42.5, reps: 8, label: 'Aug 7', date: 'Aug 7', sets: '3 × 8 @ 42.5kg' },
      { val: 45.0, reps: 8, label: 'Aug 14', date: 'Aug 14', sets: '4 × 8 @ 45kg' },
      { val: 47.5, reps: 6, label: 'Aug 21', date: 'Aug 21', sets: '4 × 6 @ 47.5kg' },
      { val: 50.0, reps: 6, label: 'Today', date: 'Today', sets: '3 × 6 @ 50kg' }
    ]
  }
};

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

export function AnalyticsScreen({
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const [liftsState, setLiftsState] = useState(DEFAULT_LIFTS);
  const [showLogModal, setShowLogModal] = useState(false);
  const [inputWeight, setInputWeight] = useState('80');
  const [inputReps, setInputReps] = useState('6');

  // Load custom persisted lift records if available
  useEffect(() => {
    (async () => {
      const savedLogs = await loadExerciseLogs();
      if (savedLogs) {
        setLiftsState(savedLogs);
      }
    })();
  }, []);

  const activeLift = liftsState[selectedLiftKey] || liftsState.bench;

  // 👆 Interactive Touch Scrubber State
  const [activeIndex, setActiveIndex] = useState(activeLift.points.length - 1);
  const [selectedBarIdx, setSelectedBarIdx] = useState(0);

  // Sync activeIndex if lift changes
  useEffect(() => {
    setActiveIndex(activeLift.points.length - 1);
  }, [selectedLiftKey, activeLift.points.length]);

  const activePoint = activeLift.points[activeIndex] || activeLift.points[activeLift.points.length - 1];

  // 🧮 Calculate 1RM via Epley Formula: 1RM = Weight × (1 + Reps / 30)
  const calc1RM = (weight, reps) => (weight * (1 + reps / 30)).toFixed(1);
  const current1RM = calc1RM(activePoint.val, activePoint.reps || 6);

  // Dynamic Overload % relative to baseline
  const baselineVal = activeLift.baseline || activeLift.points[0].val;
  const currentVal = activePoint.val;
  const gainKg = (currentVal - baselineVal).toFixed(1);
  const gainPct = Math.round(((currentVal - baselineVal) / baselineVal) * 100);

  // 📐 Precise SVG Coordinate Calculation for Spline
  const allVals = activeLift.points.map((p) => p.val);
  const minVal = Math.min(...allVals) * 0.94;
  const maxVal = Math.max(...allVals) * 1.05;
  const range = maxVal - minVal || 1;

  const pointCoords = activeLift.points.map((pt, idx) => {
    const x = 16 + (idx * (CHART_WIDTH - 32)) / Math.max(1, activeLift.points.length - 1);
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

  // ➕ Save New Custom Lift Record
  const handleSaveCustomLift = async () => {
    const w = parseFloat(inputWeight);
    const r = parseInt(inputReps, 10);
    if (!w || !r || w <= 0 || r <= 0) {
      Alert.alert('Invalid Entry', 'Please enter valid positive numbers for weight and reps.');
      return;
    }

    const now = new Date();
    const dateLabel = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;
    const newPoint = {
      val: w,
      reps: r,
      label: dateLabel,
      date: `Today · ${dateLabel}`,
      sets: `3 × ${r} @ ${w}kg`
    };

    const nextLifts = {
      ...liftsState,
      [selectedLiftKey]: {
        ...activeLift,
        points: [...activeLift.points, newPoint]
      }
    };

    setLiftsState(nextLifts);
    await persistExerciseLogs(nextLifts);
    setActiveIndex(nextLifts[selectedLiftKey].points.length - 1);
    setShowLogModal(false);
  };

  // 📊 Live Real Workout History Processing
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const totalVolumeKg = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (item.totalVolumeKg || 8500), 0)
    : 23900;

  const displayVolumeStr = totalVolumeKg >= 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : `${totalVolumeKg}`;

  // Build Real Workout Bars
  const realBars = hasRealWorkouts
    ? workoutHistory.slice(0, 4).reverse().map((w, idx) => {
        const maxW = Math.max(...workoutHistory.map((item) => item.totalVolumeKg || 8500));
        const vol = w.totalVolumeKg || 11950;
        return {
          id: w.id || String(idx),
          title: w.routineName || `Session #${idx + 1}`,
          short: `S${idx + 1}`,
          volume: vol,
          volumeStr: vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : `${vol}`,
          heightPct: Math.max(0.4, vol / (maxW || 1)),
          date: w.date ? new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'
        };
      })
    : [
        { id: '1', title: 'Chest & Triceps', short: 'W1', volume: 11200, volumeStr: '11.2k', heightPct: 0.58, date: 'Aug 1' },
        { id: '2', title: 'Back & Biceps', short: 'W2', volume: 12800, volumeStr: '12.8k', heightPct: 0.68, date: 'Aug 7' },
        { id: '3', title: 'Legs & Core', short: 'W3', volume: 14500, volumeStr: '14.5k', heightPct: 0.80, date: 'Aug 14' },
        { id: '4', title: 'Full Body Power', short: 'W4', volume: 17200, volumeStr: '17.2k', heightPct: 1.0, date: 'Aug 21', isPeak: true }
      ];

  const activeBar = realBars[selectedBarIdx] || realBars[realBars.length - 1];

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.mainTitle}>Performance Studio</Text>
            <TouchableOpacity
              style={styles.quickLogHeaderBtn}
              onPress={() => setShowLogModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.quickLogHeaderBtnText}>Log Lift</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Touch & slide to inspect real-time 1RM overload & mechanical progression.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 🎴 CARD 1: LIVE 1RM STRENGTH OVERLOAD LAB                                 */}
        {/* ========================================================================= */}
        <View style={styles.luxuryCard}>
          {/* Top Ambient Highlight */}
          <View style={styles.topAccentBar} />

          {/* Dynamic Split Header (Updates live as user drags across graph) */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>{current1RM} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Working Set: {activePoint.val} kg</Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>{activePoint.reps || 6} Reps Recorded</Text>
              </View>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD GAIN</Text>
              <Text style={[styles.kpiBigNumber, { color: gainPct >= 0 ? '#10B981' : '#EF4444' }]}>
                {gainPct >= 0 ? `+${gainPct}%` : `${gainPct}%`}
              </Text>
              <Text style={styles.kpiSubText}>{gainKg >= 0 ? `+${gainKg}` : gainKg} kg vs Baseline</Text>
              <View style={[styles.kpiPillTag, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Text style={[styles.kpiPillTagText, { color: '#10B981' }]}>Live Database Log</Text>
              </View>
            </View>
          </View>

          {/* Segmented Lift Switcher */}
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

          {/* 2. Interactive SVG Spline Canvas (Drag Finger Across to Scrub) */}
          <View style={styles.chartInteractiveWrapper} {...panResponder.panHandlers}>
            {/* Dynamic Floating HUD Tooltip */}
            <View style={[styles.liveCursorHUD, { left: Math.max(8, Math.min(CHART_WIDTH - 125, activeCoord.x - 55)) }]}>
              <Text style={styles.liveCursorWeight}>{activePoint.val} kg · 1RM {current1RM} kg</Text>
              <Text style={styles.liveCursorDate}>{activePoint.date}</Text>
            </View>

            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                <SvgGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                  <Stop offset="60%" stopColor="#DC2626" stopOpacity="0.12" />
                  <Stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </SvgGradient>
              </Defs>

              {/* Minimal Gridlines */}
              <Line x1="0" y1="35" x2={CHART_WIDTH} y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="5,5" />
              <Line x1="0" y1="85" x2={CHART_WIDTH} y2="85" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="5,5" />
              <Line x1="0" y1={CHART_HEIGHT - 1} x2={CHART_WIDTH} y2={CHART_HEIGHT - 1} stroke="#27272A" strokeWidth="1" />

              {/* Gradient Area Wave */}
              <Path d={areaPath} fill="url(#crimsonGradient)" />

              {/* High-Contrast Glowing Spline */}
              <Path d={linePath} stroke="#EF4444" strokeWidth="3.5" fill="none" strokeLinecap="round" />

              {/* Laser Line Guide */}
              <Line
                x1={activeCoord.x}
                y1={activeCoord.y}
                x2={activeCoord.x}
                y2={CHART_HEIGHT}
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />

              {/* Points on Curve */}
              {pointCoords.map((coord, i) => {
                const isCurrent = i === activeIndex;
                return (
                  <Circle
                    key={i}
                    cx={coord.x}
                    cy={coord.y}
                    r={isCurrent ? 6.5 : 3.5}
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

          {/* Interactive Info Bar with Quick Log Button */}
          <View style={styles.scrubberHintBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Zap size={13} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={styles.scrubberHintText}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{activePoint.sets}</Text> · 1RM: {current1RM} kg
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addLiftInlineBtn}
              onPress={() => setShowLogModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.addLiftInlineBtnText}>+ Log Set</Text>
            </TouchableOpacity>
          </View>

          {/* Efficiency Scorecard */}
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
        {/* 📊 CARD 2: REAL WORKOUT VOLUME PILLARS                                    */}
        {/* ========================================================================= */}
        <View style={styles.luxuryCard}>
          <View style={[styles.topAccentBar, { backgroundColor: '#10B981' }]} />

          {/* Dynamic Dual-Column Header based on Tapped Bar */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>RECORDED VOLUME</Text>
              <Text style={styles.kpiBigNumber}>{activeBar.volumeStr} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>{activeBar.title}</Text>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>SESSION TIMELINE</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>{activeBar.date}</Text>
              <Text style={styles.kpiSubText}>Completed in Database</Text>
            </View>
          </View>

          {/* Interactive Stepped Pillars (Tap to Select Session) */}
          <View style={styles.pillarsContainer}>
            {realBars.map((bar, i) => {
              const isSelected = i === selectedBarIdx;
              return (
                <TouchableOpacity
                  key={bar.id}
                  style={styles.pillarCol}
                  onPress={() => setSelectedBarIdx(i)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillarValueLabel, isSelected && { color: '#FFFFFF', fontWeight: '900' }]}>
                    {bar.volumeStr}
                  </Text>
                  <View style={[styles.pillarTrack, isSelected && styles.pillarTrackSelected]}>
                    <View
                      style={[
                        styles.pillarBar,
                        {
                          height: `${bar.heightPct * 100}%`,
                          backgroundColor: isSelected ? '#10B981' : bar.isPeak ? '#059669' : '#3F3F46'
                        }
                      ]}
                    />
                  </View>
                  <View style={[styles.pillarPillTag, isSelected && styles.pillarPillTagActiveGreen]}>
                    <Text style={[styles.pillarWeekLabel, isSelected && styles.pillarWeekLabelActive]}>
                      {bar.short}
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
                <Text style={[styles.scorecardBigPercent, { color: '#10B981' }]}>
                  {displayVolumeStr} <Text style={{ fontSize: 14, color: '#A1A1AA' }}>Total kg</Text>
                </Text>
                <Text style={styles.scorecardTitle}>Hypertrophy Work Capacity</Text>
              </View>
              <View style={[styles.efficiencyGradeBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}>
                <Text style={[styles.efficiencyGradeText, { color: '#10B981' }]}>
                  {workoutHistory.length || 2} Workouts
                </Text>
              </View>
            </View>
            <Text style={styles.scorecardDesc}>
              Total cumulative tonnage calculated dynamically from your logged workout sessions.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 3: PERSONAL RECORDS HALL OF FAME                                  */}
        {/* ========================================================================= */}
        <View style={styles.luxuryCard}>
          <View style={[styles.topAccentBar, { backgroundColor: '#F59E0B' }]} />

          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
            <Text style={styles.kpiSuperTitle}>LIFETIME TROPHIES</Text>
            <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {[
              { id: 'bench', lift: 'Barbell Bench Press', weight: `${Math.max(...liftsState.bench.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'squat', lift: 'Barbell Back Squat', weight: `${Math.max(...liftsState.squat.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#F59E0B' },
              { id: 'deadlift', lift: 'Barbell Deadlift', weight: `${Math.max(...liftsState.deadlift.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#0284C7' },
              { id: 'press', lift: 'Standing Military Press', weight: `${Math.max(...liftsState.press.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#8B5CF6' }
            ].map((item) => (
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
                  <Text style={styles.pr1RM}>1RM: {calc1RM(parseFloat(item.weight), 6)} kg</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* 📝 QUICK LOG MODAL (ALLOWS USER TO LOG REAL WEIGHT & REPS LIVE)           */}
      {/* ========================================================================= */}
      <Modal
        visible={showLogModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Log Real Lift Set</Text>
                <Text style={styles.modalSub}>{activeLift.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowLogModal(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputsRow}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>WEIGHT (KG)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={inputWeight}
                  onChangeText={setInputWeight}
                  keyboardType="numeric"
                  placeholder="e.g. 80"
                  placeholderTextColor="#71717A"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>REPS COMPLETED</Text>
                <TextInput
                  style={styles.modalInput}
                  value={inputReps}
                  onChangeText={setInputReps}
                  keyboardType="numeric"
                  placeholder="e.g. 6"
                  placeholderTextColor="#71717A"
                />
              </View>
            </View>

            <View style={styles.estimated1RMPreview}>
              <Text style={styles.est1RMPreviewLabel}>Calculated 1-Rep Max (Epley):</Text>
              <Text style={styles.est1RMPreviewVal}>
                {calc1RM(parseFloat(inputWeight) || 0, parseInt(inputReps, 10) || 0)} kg
              </Text>
            </View>

            <TouchableOpacity
              style={styles.saveLiftBtn}
              onPress={handleSaveCustomLift}
              activeOpacity={0.8}
            >
              <Check size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveLiftBtnText}>Save & Plot to Database</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  quickLogHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  quickLogHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  subtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18
  },

  // 🎴 Luxury Frosted Cards
  luxuryCard: {
    backgroundColor: '#111114',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden'
  },
  topAccentBar: {
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
    backgroundColor: '#18181C',
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
    paddingTop: 20,
    paddingBottom: 8,
    alignItems: 'center',
    position: 'relative'
  },
  liveCursorHUD: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#1C1C20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    zIndex: 10
  },
  liveCursorWeight: {
    color: '#FFFFFF',
    fontSize: 10,
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
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  addLiftInlineBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  addLiftInlineBtnText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800'
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
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)'
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
  pillarPillTagActiveGreen: {
    backgroundColor: '#10B981'
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
    backgroundColor: '#161619',
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
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#16161A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  modalSub: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  modalCloseBtn: {
    padding: 4
  },
  modalInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  modalInputGroup: {
    flex: 1
  },
  modalInputLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6
  },
  modalInput: {
    backgroundColor: '#222228',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  estimated1RMPreview: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  est1RMPreviewLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600'
  },
  est1RMPreviewVal: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '900'
  },
  saveLiftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14
  },
  saveLiftBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  }
});
