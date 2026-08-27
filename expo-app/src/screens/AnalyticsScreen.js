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
  Line,
  Text as SvgText
} from 'react-native-svg';
import {
  TrendingUp,
  Activity,
  Zap,
  Flame,
  Award,
  ChevronDown,
  Sparkles,
  Trophy,
  Dumbbell,
  Calendar,
  Layers,
  Check,
  Scale
} from 'lucide-react-native';
import { loadExerciseLogs } from '../services/sessionStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 180;
const LEFT_AXIS_WIDTH = 34;
const CHART_RIGHT_PAD = 18;

// 🏋️ Compound Lift Datasets with Dense Organic Milestones
const LIFTS_DATABASE = {
  bench: {
    name: 'Barbell Bench Press',
    baseline: 65.0,
    current: 78.5,
    points: [
      { val: 65.0, label: 'Aug 1' },
      { val: 66.0, label: 'Aug 4' },
      { val: 68.5, label: 'Aug 7' },
      { val: 71.0, label: 'Aug 10' },
      { val: 69.5, label: 'Aug 13' },
      { val: 69.0, label: 'Aug 16' },
      { val: 72.0, label: 'Aug 19' },
      { val: 73.5, label: 'Aug 21' },
      { val: 72.0, label: 'Aug 23' },
      { val: 74.0, label: 'Aug 25' },
      { val: 76.5, label: 'Aug 27' },
      { val: 78.5, label: 'Today', isToday: true }
    ]
  },
  squat: {
    name: 'Barbell Back Squat',
    baseline: 90.0,
    current: 110.0,
    points: [
      { val: 90.0, label: 'Aug 1' },
      { val: 92.0, label: 'Aug 4' },
      { val: 95.0, label: 'Aug 7' },
      { val: 98.0, label: 'Aug 10' },
      { val: 97.0, label: 'Aug 13' },
      { val: 99.0, label: 'Aug 16' },
      { val: 102.0, label: 'Aug 19' },
      { val: 104.5, label: 'Aug 21' },
      { val: 103.0, label: 'Aug 23' },
      { val: 106.0, label: 'Aug 25' },
      { val: 108.5, label: 'Aug 27' },
      { val: 110.0, label: 'Today', isToday: true }
    ]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    baseline: 110.0,
    current: 135.0,
    points: [
      { val: 110.0, label: 'Aug 1' },
      { val: 112.5, label: 'Aug 4' },
      { val: 115.0, label: 'Aug 7' },
      { val: 118.0, label: 'Aug 10' },
      { val: 120.0, label: 'Aug 13' },
      { val: 122.5, label: 'Aug 16' },
      { val: 125.0, label: 'Aug 19' },
      { val: 128.0, label: 'Aug 21' },
      { val: 127.0, label: 'Aug 23' },
      { val: 130.0, label: 'Aug 25' },
      { val: 132.5, label: 'Aug 27' },
      { val: 135.0, label: 'Today', isToday: true }
    ]
  },
  press: {
    name: 'Overhead Military Press',
    baseline: 40.0,
    current: 50.0,
    points: [
      { val: 40.0, label: 'Aug 1' },
      { val: 41.0, label: 'Aug 4' },
      { val: 42.5, label: 'Aug 7' },
      { val: 43.5, label: 'Aug 10' },
      { val: 44.0, label: 'Aug 13' },
      { val: 45.0, label: 'Aug 16' },
      { val: 46.5, label: 'Aug 19' },
      { val: 47.0, label: 'Aug 21' },
      { val: 46.5, label: 'Aug 23' },
      { val: 48.0, label: 'Aug 25' },
      { val: 49.0, label: 'Aug 27' },
      { val: 50.0, label: 'Today', isToday: true }
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
  const [timeRange, setTimeRange] = useState('All Time');
  const [liftsState, setLiftsState] = useState(LIFTS_DATABASE);

  // Load real persisted logs from AsyncStorage & merge seamlessly
  useEffect(() => {
    (async () => {
      const savedLogs = await loadExerciseLogs();
      if (savedLogs && Object.keys(savedLogs).length > 0) {
        const cleaned = {};
        Object.keys(savedLogs).forEach((k) => {
          if (savedLogs[k]?.points && savedLogs[k].points.length >= 2) {
            const raw = savedLogs[k].points;
            cleaned[k] = {
              name: savedLogs[k].name || LIFTS_DATABASE[k]?.name,
              baseline: savedLogs[k].baseline || LIFTS_DATABASE[k]?.baseline || 60,
              current: raw[raw.length - 1].val,
              points: raw.map((p, idx) => ({
                val: p.val,
                label: idx === raw.length - 1 ? 'Today' : p.label || `Day ${idx + 1}`,
                isToday: idx === raw.length - 1
              }))
            };
          }
        });
        if (Object.keys(cleaned).length > 0) {
          setLiftsState((prev) => ({ ...prev, ...cleaned }));
        }
      }
    })();
  }, [workoutHistory]);

  const activeLift = liftsState[selectedLiftKey] || liftsState.bench;
  const points = activeLift.points;

  // 📐 Precise Scaling & Gridlines Math
  const allVals = points.map((p) => p.val);
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);

  // Generate 5 Clean Y-Axis Ticks (e.g. 82, 80, 78, 76, 74)
  const step = Math.max(2, Math.ceil((rawMax - rawMin) / 4));
  const minTick = Math.floor(rawMin / step) * step;
  const maxTick = minTick + step * 4;

  const yTicks = [maxTick, minTick + step * 3, minTick + step * 2, minTick + step, minTick];

  const usableWidth = CARD_WIDTH - LEFT_AXIS_WIDTH - CHART_RIGHT_PAD;
  const usableHeight = CHART_HEIGHT - 32;

  const pointCoords = points.map((pt, idx) => {
    const x = LEFT_AXIS_WIDTH + (idx * usableWidth) / Math.max(1, points.length - 1);
    const y = 14 + ((maxTick - pt.val) / (maxTick - minTick || 1)) * usableHeight;
    return { x, y, pt };
  });

  // Calculate smooth Monotone Spline Path
  let linePath = `M ${pointCoords[0].x} ${pointCoords[0].y}`;
  for (let i = 0; i < pointCoords.length - 1; i++) {
    const p0 = pointCoords[i];
    const p1 = pointCoords[i + 1];
    const dx = p1.x - p0.x;
    const cp1x = p0.x + dx * 0.45;
    const cp1y = p0.y;
    const cp2x = p1.x - dx * 0.45;
    const cp2y = p1.y;
    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  const lastCoord = pointCoords[pointCoords.length - 1];
  const areaPath = `${linePath} L ${lastCoord.x} ${CHART_HEIGHT} L ${pointCoords[0].x} ${CHART_HEIGHT} Z`;

  // 👆 Continuous 60FPS Drag Scrubber & Callout Badge State
  const [scrubState, setScrubState] = useState({
    isDragging: false,
    x: lastCoord.x,
    y: lastCoord.y,
    weight: points[points.length - 1].val.toFixed(1),
    date: points[points.length - 1].label
  });

  // Reset to latest point when switching lift tabs
  useEffect(() => {
    const latest = points[points.length - 1];
    const latestCoord = pointCoords[pointCoords.length - 1];
    setScrubState({
      isDragging: false,
      x: latestCoord.x,
      y: latestCoord.y,
      weight: latest.val.toFixed(1),
      date: latest.label
    });
  }, [selectedLiftKey, points.length]);

  // Exact Cubic Bezier calculation for 1:1 pinned accuracy
  const handleContinuousTouch = (touchX) => {
    const minX = pointCoords[0].x;
    const maxX = pointCoords[pointCoords.length - 1].x;
    const clampedX = Math.max(minX, Math.min(maxX, touchX));

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

    const cp1y = p0.y;
    const cp2y = p1.y;
    const interpY =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * cp1y +
      3 * (1 - t) * Math.pow(t, 2) * cp2y +
      Math.pow(t, 3) * p1.y;

    const interpWeight = (p0.pt.val + t * (p1.pt.val - p0.pt.val)).toFixed(1);
    const interpDate = t < 0.5 ? p0.pt.label : p1.pt.label;

    setScrubState({
      isDragging: true,
      x: clampedX,
      y: interpY,
      weight: interpWeight,
      date: interpDate
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

  // Calculate Delta vs Previous Milestone
  const prevVal = points.length >= 2 ? points[points.length - 2].val : points[0].val;
  const currentVal = parseFloat(scrubState.weight);
  const deltaKg = (currentVal - prevVal).toFixed(1);
  const isPositiveDelta = currentVal >= prevVal;

  // 📊 Live Real Workout History Processing
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const totalVolumeKg = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (item.totalVolumeKg || 8500), 0)
    : 23900;

  const displayVolumeStr = totalVolumeKg >= 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : `${totalVolumeKg}`;

  // Display dates for the bottom X-axis (evenly distributed labels)
  const displayDateLabels = [
    points[0]?.label || 'Aug 1',
    points[Math.floor(points.length * 0.25)]?.label || 'Aug 8',
    points[Math.floor(points.length * 0.5)]?.label || 'Aug 15',
    points[Math.floor(points.length * 0.75)]?.label || 'Aug 22',
    'Today'
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================================= */}
        {/* 🔘 TOP CAPSULE BAR: EXACT MATCH TO USER DESIGN                            */}
        {/* ========================================================================= */}
        <View style={styles.topCapsuleRow}>
          {[
            { key: 'This Week', label: 'This Week' },
            { key: 'Real', label: 'Real' },
            { key: 'kg', label: 'kg' },
            { key: 'All Time', label: 'All Time' }
          ].map((item) => {
            const isActive = timeRange === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.topCapsulePill, isActive && styles.topCapsulePillActive]}
                onPress={() => setTimeRange(item.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.topCapsuleText, isActive && styles.topCapsuleTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ========================================================================= */}
        {/* 🎴 HERO GRAPH CARD: 1:1 REPLICATION OF USER REFERENCE SCREENSHOT          */}
        {/* ========================================================================= */}
        <View style={styles.referenceCard}>
          {/* Card Header: Red Icon + Title + Dropdown Unit */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.redIconBadge}>
                <Dumbbell size={15} color="#FF2D55" />
              </View>
              <Text style={styles.cardHeaderTitle}>Weight Progress</Text>
            </View>

            {/* Dropdown Capsule */}
            <View style={styles.unitDropdown}>
              <Text style={styles.unitDropdownText}>kg</Text>
              <ChevronDown size={14} color="#A1A1AA" style={{ marginLeft: 4 }} />
            </View>
          </View>

          {/* Lift Selector Pills */}
          <View style={styles.liftPillsRow}>
            {[
              { key: 'bench', label: 'Bench Press' },
              { key: 'squat', label: 'Back Squat' },
              { key: 'deadlift', label: 'Deadlift' },
              { key: 'press', label: 'Overhead Press' }
            ].map((item) => {
              const isActive = selectedLiftKey === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.liftSelectPill, isActive && styles.liftSelectPillActive]}
                  onPress={() => setSelectedLiftKey(item.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.liftSelectPillText, isActive && styles.liftSelectPillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Hero Numbers: Big 78.5 kg + Trend Subtitle */}
          <View style={styles.metricRow}>
            <View>
              <Text style={styles.bigHeroNum}>
                {scrubState.weight} <Text style={styles.bigHeroUnit}>kg</Text>
              </Text>
              <View style={styles.trendRow}>
                <Text style={[styles.trendValueText, { color: isPositiveDelta ? '#FF2D55' : '#10B981' }]}>
                  {isPositiveDelta ? `↑ +${deltaKg}` : `↓ ${deltaKg}`} kg
                </Text>
                <Text style={styles.trendSubText}>vs last week</Text>
              </View>
            </View>
          </View>

          {/* 🔴 High-Precision SVG Canvas with Y-Axis, Dashed Lines & Red Callout */}
          <View style={styles.chartCanvasWrapper} {...panResponder.panHandlers}>
            {/* 🔴 Floating Red Callout Badge (1:1 Match to Screenshot) */}
            <View
              style={[
                styles.redCalloutBadgeContainer,
                {
                  left: Math.max(LEFT_AXIS_WIDTH, Math.min(CARD_WIDTH - 85, scrubState.x - 38)),
                  top: Math.max(0, scrubState.y - 38)
                }
              ]}
              pointerEvents="none"
            >
              <View style={styles.redCalloutBox}>
                <Text style={styles.redCalloutText}>{scrubState.weight} kg</Text>
              </View>
              <View style={styles.redCalloutArrow} />
            </View>

            <Svg width={CARD_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                {/* Deep Crimson Gradient Fill */}
                <SvgGradient id="referenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#FF2D55" stopOpacity="0.45" />
                  <Stop offset="50%" stopColor="#D81B60" stopOpacity="0.18" />
                  <Stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                </SvgGradient>
              </Defs>

              {/* Y-Axis Ticks & Horizontal Dashed Gridlines */}
              {yTicks.map((tickVal, idx) => {
                const tickY = 14 + (idx * usableHeight) / 4;
                return (
                  <React.Fragment key={idx}>
                    {/* Y-Axis Text Label */}
                    <SvgText
                      x={LEFT_AXIS_WIDTH - 8}
                      y={tickY + 4}
                      fill="#71717A"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="end"
                    >
                      {tickVal}
                    </SvgText>

                    {/* Dashed Horizontal Grid Line */}
                    <Line
                      x1={LEFT_AXIS_WIDTH}
                      y1={tickY}
                      x2={CARD_WIDTH - CHART_RIGHT_PAD}
                      y2={tickY}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                  </React.Fragment>
                );
              })}

              {/* Deep Red Area Wave */}
              <Path d={areaPath} fill="url(#referenceGradient)" />

              {/* Ambient Glowing Outer Line */}
              <Path
                d={linePath}
                stroke="#FF2D55"
                strokeWidth="7"
                strokeOpacity="0.25"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Sharp High-Contrast Crimson Stroke */}
              <Path
                d={linePath}
                stroke="#FF2D55"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Circular Dots at Every Data Point */}
              {pointCoords.map((coord, i) => {
                const isLast = i === pointCoords.length - 1;
                return (
                  <Circle
                    key={i}
                    cx={coord.x}
                    cy={coord.y}
                    r={isLast ? 5 : 3.8}
                    fill="#FF2D55"
                    stroke="#121215"
                    strokeWidth={isLast ? 2 : 1}
                  />
                );
              })}

              {/* Active Pulsing Tip Dot at Scrubber Finger */}
              <Circle
                cx={scrubState.x}
                cy={scrubState.y}
                r={6}
                fill="#FF2D55"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </Svg>

            {/* X-Axis Dates Row */}
            <View style={styles.chartDatesRow}>
              {displayDateLabels.map((dateStr, i) => {
                const isToday = i === displayDateLabels.length - 1;
                return (
                  <Text
                    key={i}
                    style={[styles.chartDateLabel, isToday && styles.chartDateLabelToday]}
                  >
                    {dateStr}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 2: LIFETIME PR BEST RECORDS                                       */}
        {/* ========================================================================= */}
        <View style={styles.referenceCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.redIconBadge, { backgroundColor: 'rgba(255, 45, 85, 0.12)' }]}>
                <Trophy size={15} color="#FF2D55" />
              </View>
              <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
            </View>
          </View>

          <View style={styles.prList}>
            {[
              { id: 'bench', lift: 'Barbell Bench Press', weight: `${Math.max(...liftsState.bench.points.map((p) => p.val))} kg`, date: 'Aug 2026' },
              { id: 'squat', lift: 'Barbell Back Squat', weight: `${Math.max(...liftsState.squat.points.map((p) => p.val))} kg`, date: 'Aug 2026' },
              { id: 'deadlift', lift: 'Barbell Deadlift', weight: `${Math.max(...liftsState.deadlift.points.map((p) => p.val))} kg`, date: 'Aug 2026' },
              { id: 'press', lift: 'Standing Military Press', weight: `${Math.max(...liftsState.press.points.map((p) => p.val))} kg`, date: 'Aug 2026' }
            ].map((item) => (
              <View key={item.id} style={styles.prRow}>
                <View style={styles.prBadge}>
                  <Trophy size={14} color="#FF2D55" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.prLiftName}>{item.lift}</Text>
                  <Text style={styles.prDate}>{item.date}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.prWeight}>{item.weight}</Text>
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

  // Top Filter Capsules (This Week, Real, kg, All Time)
  topCapsuleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6
  },
  topCapsulePill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: '#121215',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  topCapsulePillActive: {
    backgroundColor: '#18181C',
    borderColor: 'rgba(255, 45, 85, 0.4)'
  },
  topCapsuleText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  topCapsuleTextActive: {
    color: '#FF2D55',
    fontWeight: '800'
  },

  // 🎴 Reference Card Style
  referenceCard: {
    backgroundColor: '#111114',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    overflow: 'hidden'
  },

  // Card Header Row
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  redIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 45, 85, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 85, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  cardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  unitDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  unitDropdownText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // Lift Selector Pills
  liftPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14
  },
  liftSelectPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#18181C',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  liftSelectPillActive: {
    backgroundColor: 'rgba(255, 45, 85, 0.15)',
    borderColor: 'rgba(255, 45, 85, 0.4)'
  },
  liftSelectPillText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  liftSelectPillTextActive: {
    color: '#FF2D55',
    fontWeight: '800'
  },

  // Hero Metric: 78.5 kg
  metricRow: {
    marginBottom: 10
  },
  bigHeroNum: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1
  },
  bigHeroUnit: {
    color: '#FF2D55',
    fontSize: 18,
    fontWeight: '800'
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  trendValueText: {
    fontSize: 12,
    fontWeight: '800',
    marginRight: 6
  },
  trendSubText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600'
  },

  // Chart Canvas
  chartCanvasWrapper: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 6
  },

  // 🔴 Floating Red Callout Badge (1:1 match to screenshot)
  redCalloutBadgeContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10
  },
  redCalloutBox: {
    backgroundColor: '#FF2D55',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4
  },
  redCalloutText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  redCalloutArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF2D55'
  },

  // Dates Row
  chartDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CARD_WIDTH - LEFT_AXIS_WIDTH - CHART_RIGHT_PAD + 10,
    marginLeft: LEFT_AXIS_WIDTH - 6,
    marginTop: 6
  },
  chartDateLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },
  chartDateLabelToday: {
    color: '#FF2D55',
    fontWeight: '800'
  },

  // PR Records
  prList: {
    gap: 8,
    marginTop: 6
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161619',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  prBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 85, 0.3)',
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
  }
});
