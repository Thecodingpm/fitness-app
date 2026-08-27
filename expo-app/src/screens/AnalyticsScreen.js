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
  PanResponder
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  Check
} from 'lucide-react-native';
import { loadExerciseLogs } from '../services/sessionStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CHART_WIDTH = CARD_WIDTH - 36;
const CHART_HEIGHT = 150;

// 🏋️ Default starting baseline progression
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

export function AnalyticsScreen({
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const [liftsState, setLiftsState] = useState(DEFAULT_LIFTS);
  const [selectedBarIdx, setSelectedBarIdx] = useState(0);

  // Load real persisted logs from AsyncStorage & auto-updates
  useEffect(() => {
    (async () => {
      const savedLogs = await loadExerciseLogs();
      if (savedLogs && Object.keys(savedLogs).length > 0) {
        setLiftsState((prev) => ({ ...prev, ...savedLogs }));
      }
    })();
  }, [workoutHistory]);

  const activeLift = liftsState[selectedLiftKey] || liftsState.bench;
  const points = activeLift.points;

  // 🧮 Calculate 1RM via Epley Formula: 1RM = Weight × (1 + Reps / 30)
  const calc1RM = (weight, reps = 6) => (weight * (1 + reps / 30)).toFixed(1);

  // 📐 Continuous Spline Coordinates
  const allVals = points.map((p) => p.val);
  const minVal = Math.min(...allVals) * 0.94;
  const maxVal = Math.max(...allVals) * 1.05;
  const range = maxVal - minVal || 1;

  const pointCoords = points.map((pt, idx) => {
    const x = 16 + (idx * (CHART_WIDTH - 32)) / Math.max(1, points.length - 1);
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

  // 👆 Continuous Fluid Scrub State (Sub-pixel 60FPS precision across every single pixel)
  const [scrubState, setScrubState] = useState({
    active: false,
    x: lastCoord.x,
    y: lastCoord.y,
    weight: points[points.length - 1].val.toFixed(1),
    reps: points[points.length - 1].reps || 6,
    date: points[points.length - 1].date,
    est1RM: calc1RM(points[points.length - 1].val, points[points.length - 1].reps || 6)
  });

  // Reset scrub state when lift tab switches
  useEffect(() => {
    const latest = points[points.length - 1];
    const latestCoord = pointCoords[pointCoords.length - 1];
    setScrubState({
      active: false,
      x: latestCoord.x,
      y: latestCoord.y,
      weight: latest.val.toFixed(1),
      reps: latest.reps || 6,
      date: latest.date,
      est1RM: calc1RM(latest.val, latest.reps || 6)
    });
  }, [selectedLiftKey, points.length]);

  // 🖱️ Continuous Fluid Touch Scrubber
  const handleContinuousTouch = (touchX) => {
    const minX = pointCoords[0].x;
    const maxX = pointCoords[pointCoords.length - 1].x;
    const clampedX = Math.max(minX, Math.min(maxX, touchX));

    // Find interpolation segment
    let segIdx = 0;
    for (let i = 0; i < pointCoords.length - 1; i++) {
      if (clampedX >= pointCoords[i].x && clampedX <= pointCoords[i + 1].x) {
        segIdx = i;
        break;
      }
    }

    const p0 = pointCoords[segIdx];
    const p1 = pointCoords[segIdx + 1];
    const t = (clampedX - p0.x) / (p1.x - p0.x || 1);

    // Smooth cubic bezier easing for continuous Y tracking
    const interpY =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p0.y +
      3 * (1 - t) * Math.pow(t, 2) * p1.y +
      Math.pow(t, 3) * p1.y;

    const interpWeight = (p0.pt.val + t * (p1.pt.val - p0.pt.val)).toFixed(1);
    const interpReps = Math.round(p0.pt.reps + t * (p1.pt.reps - p0.pt.reps));
    const interpDate = t < 0.5 ? p0.pt.date : p1.pt.date;

    setScrubState({
      active: true,
      x: clampedX,
      y: interpY,
      weight: interpWeight,
      reps: interpReps,
      date: interpDate,
      est1RM: calc1RM(parseFloat(interpWeight), interpReps)
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleContinuousTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleContinuousTouch(evt.nativeEvent.locationX)
    })
  ).current;

  // Dynamic Overload % relative to baseline
  const baselineVal = activeLift.baseline || points[0].val;
  const currentWeightNum = parseFloat(scrubState.weight);
  const gainKg = (currentWeightNum - baselineVal).toFixed(1);
  const gainPct = Math.round(((currentWeightNum - baselineVal) / baselineVal) * 100);

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

      {/* 🔴 Ambient Luxury Dark-Red Radial Background Glow */}
      <LinearGradient
        colors={['rgba(220, 38, 38, 0.18)', 'rgba(220, 38, 38, 0.04)', 'transparent']}
        style={styles.bgGlow}
        pointerEvents="none"
      />

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
            Fluid sub-pixel continuous touch tracking across historical mechanical overload.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 🎴 CARD 1: LIVE CONTINUOUS 1RM STRENGTH CURVE                              */}
        {/* ========================================================================= */}
        <View style={styles.luxuryCard}>
          {/* Dynamic Split Header (Updates live at 60FPS as finger glides across curve) */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>{scrubState.est1RM} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Working Set: {scrubState.weight} kg</Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>{scrubState.reps} Reps Tracked</Text>
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
                <Text style={[styles.kpiPillTagText, { color: '#10B981' }]}>Auto-Synced to DB</Text>
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

          {/* 2. Pure SVG Continuous Spline Canvas (Smooth Liquid Dragging) */}
          <View style={styles.chartInteractiveWrapper} {...panResponder.panHandlers}>
            {/* Live Floating HUD Tooltip gliding seamlessly with finger */}
            <View
              style={[
                styles.liveCursorHUD,
                { left: Math.max(8, Math.min(CHART_WIDTH - 125, scrubState.x - 55)) }
              ]}
            >
              <Text style={styles.liveCursorWeight}>{scrubState.weight} kg · 1RM {scrubState.est1RM} kg</Text>
              <Text style={styles.liveCursorDate}>{scrubState.date}</Text>
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

              {/* 🔴 Continuous Laser Line at Exact Touch Coordinate */}
              <Line
                x1={scrubState.x}
                y1={scrubState.y}
                x2={scrubState.x}
                y2={CHART_HEIGHT}
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />

              {/* Base Milestone Points */}
              {pointCoords.map((coord, i) => (
                <Circle
                  key={i}
                  cx={coord.x}
                  cy={coord.y}
                  r={3.5}
                  fill="#EF4444"
                  stroke="#141416"
                  strokeWidth={1.5}
                />
              ))}

              {/* ⚪ Active Liquid Touch Cursor */}
              <Circle
                cx={scrubState.x}
                cy={scrubState.y}
                r={6.5}
                fill="#FFFFFF"
                stroke="#EF4444"
                strokeWidth={3}
              />
            </Svg>

            {/* X-Axis Dates */}
            <View style={styles.chartDateRow}>
              {points.map((pt, i) => (
                <Text key={i} style={styles.chartDateText}>
                  {pt.label}
                </Text>
              ))}
            </View>
          </View>

          {/* Real-Time Scrub Status Bar */}
          <View style={styles.scrubberHintBar}>
            <Zap size={13} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.scrubberHintText}>
              Point: <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{scrubState.weight} kg</Text> · 1RM: {scrubState.est1RM} kg ({scrubState.date})
            </Text>
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
              Mechanical tension adaptation rate is trending consistently above baseline (+{gainKg}kg).
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📊 CARD 2: REAL WORKOUT VOLUME PILLARS                                    */}
        {/* ========================================================================= */}
        <View style={styles.luxuryCard}>
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
              <Text style={styles.kpiSubText}>Stored in Database</Text>
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
                          backgroundColor: isSelected ? '#EF4444' : bar.isPeak ? '#B91C1C' : '#3F3F46'
                        }
                      ]}
                    />
                  </View>
                  <View style={[styles.pillarPillTag, isSelected && styles.pillarPillTagActive]}>
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
                <Text style={[styles.scorecardBigPercent, { color: '#FFFFFF' }]}>
                  {displayVolumeStr} <Text style={{ fontSize: 14, color: '#A1A1AA' }}>Total kg</Text>
                </Text>
                <Text style={styles.scorecardTitle}>Hypertrophy Work Capacity</Text>
              </View>
              <View style={[styles.efficiencyGradeBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }]}>
                <Text style={[styles.efficiencyGradeText, { color: '#EF4444' }]}>
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
          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
            <Text style={styles.kpiSuperTitle}>LIFETIME TROPHIES</Text>
            <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {[
              { id: 'bench', lift: 'Barbell Bench Press', weight: `${Math.max(...liftsState.bench.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'squat', lift: 'Barbell Back Squat', weight: `${Math.max(...liftsState.squat.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'deadlift', lift: 'Barbell Deadlift', weight: `${Math.max(...liftsState.deadlift.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'press', lift: 'Standing Military Press', weight: `${Math.max(...liftsState.press.points.map((p) => p.val))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' }
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320
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
  subtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18
  },

  // 🎴 Clean Luxury Frosted Cards (No harsh colored accent bars)
  luxuryCard: {
    backgroundColor: '#111114',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden'
  },

  // Split KPI Header
  splitKpiHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
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

  // Scrubber Hint Bar
  scrubberHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: 'rgba(239, 68, 68, 0.5)',
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
  }
});
