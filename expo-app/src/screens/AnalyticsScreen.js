import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  G
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
  Lock
} from 'lucide-react-native';
import { loadExerciseLogs } from '../services/sessionStorage';
import { getUserExerciseLogsFromFirestore } from '../services/firestore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

// Lift labels only. No default weights are displayed as user results.
const LIFT_CONFIGS = {
  squat: { name: 'Barbell Back Squat' },
  legpress: { name: '45° Incline Leg Press' },
  legscore: { name: 'Legs & Core' },
  bench: { name: 'Flat Barbell Bench Press' },
  deadlift: { name: 'Barbell Deadlift' },
  press: { name: 'Overhead Shoulder Press' }
};

// Legacy points could be manual test entries. Only completed-set records qualify.
const verifiedPoints = (logs, liftKey) => (logs?.[liftKey]?.points || []).filter(point =>
  point?.source === 'completed_set' &&
  Number.isFinite(Number(point.value)) && Number(point.value) > 0 &&
  Number.isFinite(Number(point.reps)) && Number(point.reps) > 0 &&
  Number.isFinite(Date.parse(point.date))
);

export function AnalyticsScreen({
  userId = 'guest',
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout,
  onOpenPaywall
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('squat');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M'); // '1M' | '3M' | '6M' | '1Y' | 'ALL'
  const [userLogs, setUserLogs] = useState({});
  const [selectedPointIdx, setSelectedPointIdx] = useState(null);

  // 🔄 Load this user's real isolated exercise logs (AsyncStorage + Cloud Firestore)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      // 1. Try loading from user's local scoped storage
      const localLogs = await loadExerciseLogs(userId);
      if (localLogs && Object.keys(localLogs).length > 0 && isMounted) {
        setUserLogs(localLogs);
      }

      // 2. Fetch from Cloud Firestore in background
      try {
        const cloudLogs = await getUserExerciseLogsFromFirestore(userId);
        if (cloudLogs && Object.keys(cloudLogs).length > 0 && isMounted) {
          setUserLogs(cloudLogs);
        }
      } catch (err) {
        console.log('Error fetching Firestore logs:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [userId, workoutHistory]);

  const activeConfig = LIFT_CONFIGS[selectedLiftKey] || LIFT_CONFIGS.squat;
  const rawPoints = verifiedPoints(userLogs, selectedLiftKey).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const hasRecordedPoints = rawPoints.length > 0;

  // Filter or aggregate points based on Time Range
  const getRangeData = () => {
    const pts = rawPoints;
    const days = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[selectedTimeRange];
    return days ? pts.filter(point => Date.now() - Date.parse(point.date) < days * 86400000) : pts;
  };

  const chartData = getRangeData();

  // Active selected point index defaults to last point
  const activeIdx =
    selectedPointIdx !== null && selectedPointIdx >= 0 && selectedPointIdx < chartData.length
      ? selectedPointIdx
      : chartData.length - 1;

  const displayedItem = chartData[activeIdx] || chartData[chartData.length - 1];

  // 🧮 Calculate 1RM via Epley Formula: 1RM = Weight × (1 + Reps / 30)
  const calc1RM = (weight, reps = 6) =>
    (Number(weight || 0) * (1 + Number(reps || 6) / 30)).toFixed(1);
  const displayed1RM = displayedItem ? calc1RM(displayedItem.value, displayedItem.reps) : null;

  // Dynamic Overload % relative to range baseline
  const baselineVal = chartData[0]?.value || 0;
  const gainKg = displayedItem ? (displayedItem.value - baselineVal).toFixed(1) : '0.0';
  const gainPct =
    baselineVal > 0 && displayedItem ? Math.round(((displayedItem.value - baselineVal) / baselineVal) * 100) : 0;

  // 📊 Live Real Workout History Processing (Total Volume & Sessions)
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const totalVolumeKg = workoutHistory.reduce((acc, item) => acc + (Number(item.totalVolumeKg) || 0), 0);

  const displayVolumeStr =
    totalVolumeKg >= 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : `${totalVolumeKg}`;

  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 24));

  // 📐 Native SVG Line Graph Dimensions & Curves
  const svgWidth = CARD_WIDTH - 28;
  const svgHeight = 150;
  const padX = 20;
  const padY = 24;

  const minVal = chartData.length ? Math.min(...chartData.map((d) => d.value)) * 0.92 : 0;
  const maxVal = chartData.length ? Math.max(...chartData.map((d) => d.value)) * 1.08 : 1;
  const valRange = maxVal - minVal || 1;

  const coords = chartData.map((d, i) => {
    const x = padX + (i / Math.max(1, chartData.length - 1)) * (svgWidth - 2 * padX);
    const y = svgHeight - padY - ((d.value - minVal) / valRange) * (svgHeight - 2 * padY);
    return { x, y, data: d, index: i };
  });

  // Generate Smooth Cubic Bezier Path
  const makeSmoothPath = (pts) => {
    if (!pts || pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = makeSmoothPath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${svgHeight} L ${coords[0].x} ${svgHeight} Z`
      : '';

  const today = new Date();
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const recentSessions = workoutHistory.filter(item => Number.isFinite(Date.parse(item.date)));
  const weeklyCounts = Array.from({ length: 4 }, (_, index) => {
    const start = new Date(weekStart.getTime() - (3 - index) * 7 * 86400000);
    const end = new Date(start.getTime() + 7 * 86400000);
    return recentSessions.filter(item => {
      const time = Date.parse(item.date);
      return time >= start.getTime() && time < end.getTime();
    }).length;
  });
  const maxWeeklyCount = Math.max(1, ...weeklyCounts);
  const volumeBars = weeklyCounts.map((count, index) => ({
    label: index === 3 ? 'This wk' : `Wk ${index + 1}`,
    valStr: String(count),
    percent: Math.max(3, (count / maxWeeklyCount) * 100),
    isHighlight: index === 3
  }));
  const workoutsThisWeek = weeklyCounts[3];
  const activeDaysThisWeek = new Set(recentSessions.filter(item => Date.parse(item.date) >= weekStart.getTime()).map(item => item.date.slice(0, 10))).size;
  const weekProgress = Math.min(1, workoutsThisWeek / 4);
  const dayProgress = Math.min(1, activeDaysThisWeek / 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Ambient Dark-Red Radial Glow */}
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.22)', 'rgba(239, 68, 68, 0.04)', 'transparent']}
        style={styles.bgGlow}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: safeTop + 4 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 🌟 Luxury Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerBadge}>
              <View style={styles.headerDotPulse} />
              <Text style={styles.headerBadgeText}>SAVED WORKOUT DATA</Text>
            </View>
            <TouchableOpacity
              onPress={onOpenPaywall}
              style={styles.proPreviewLink}
              accessibilityRole="button"
              accessibilityLabel="Open Pro preview"
            >
              <Text style={styles.proPreviewLinkText}>PRO</Text>
              <ChevronRight size={14} color="#F87171" />
            </TouchableOpacity>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            {userName} • Progress from your saved training history.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 🎴 CARD 1: TIME-AGGREGATED PROGRESSION STUDIO                              */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          {/* Dynamic Split KPI Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>
                {displayed1RM || '—'} {displayed1RM && <Text style={styles.kpiUnit}>kg</Text>}
              </Text>
              <Text style={styles.kpiSubText}>
                {displayedItem ? `Working: ${displayedItem.value} kg (${displayedItem.reps} reps)` : 'No completed sets recorded'}
              </Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>
                  {displayedItem?.date ? new Date(displayedItem.date).toLocaleDateString() : 'Awaiting workout data'}
                </Text>
              </View>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD RATE ({selectedTimeRange})</Text>
              <Text
                style={[styles.kpiBigNumber, { color: gainPct >= 0 ? '#10B981' : '#EF4444' }]}
              >
                {hasRecordedPoints ? (gainPct >= 0 ? `+${gainPct}%` : `${gainPct}%`) : '—'}
              </Text>
              <Text style={styles.kpiSubText}>
                {hasRecordedPoints ? `${Number(gainKg) >= 0 ? '+' : ''}${gainKg} kg vs ${selectedTimeRange} start` : 'No strength trend yet'}
              </Text>
              <View
                style={[styles.kpiPillTag, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}
              >
                <Text style={[styles.kpiPillTagText, { color: '#10B981' }]}>
                  {hasRecordedPoints
                    ? `${chartData.length} Logged Sessions`
                    : 'No verified sets yet'}
                </Text>
              </View>
            </View>
          </View>

          {/* Segmented Lift Switcher (Squat, Leg Press, Legs & Core, Bench) */}
          <View style={styles.liftTabsWrapper}>
            {[
              { key: 'squat', label: 'Squat' },
              { key: 'legpress', label: 'Leg Press' },
              { key: 'legscore', label: 'Legs & Core' },
              { key: 'bench', label: 'Bench' }
            ].map((item) => {
              const isActive = selectedLiftKey === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.liftTab, isActive && styles.liftTabActive]}
                  onPress={() => {
                    setSelectedLiftKey(item.key);
                    setSelectedPointIdx(null);
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

          {/* 📅 Gold Standard Time Range Bar (1M, 3M, 6M, 1Y, ALL) */}
          <View style={styles.timeRangeBarWrapper}>
            {['1M', '3M', '6M', '1Y', 'ALL'].map((rangeKey) => {
              const isSelected = selectedTimeRange === rangeKey;
              return (
                <TouchableOpacity
                  key={rangeKey}
                  style={[styles.timeRangePill, isSelected && styles.timeRangePillSelected]}
                  onPress={() => {
                    setSelectedTimeRange(rangeKey);
                    setSelectedPointIdx(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.timeRangeText, isSelected && styles.timeRangeTextSelected]}
                  >
                    {rangeKey}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 🍏 High-Performance Native SVG Spline LineChart */}
          <View style={styles.chartWrapper}>
            {!chartData.length && <View style={{ position: 'absolute', top: 45, left: 0, right: 0, alignItems: 'center' }}><Text style={styles.kpiSubText}>Complete and save sets to build this graph</Text></View>}
            <Svg width={svgWidth} height={svgHeight}>
              <Defs>
                <SvgLinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.32" />
                  <Stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </SvgLinearGradient>
              </Defs>

              {/* Area Fill */}
              {areaPath !== '' && <Path d={areaPath} fill="url(#chartGrad)" />}

              {/* Stroke Curve */}
              {linePath !== '' && (
                <Path
                  d={linePath}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              )}

              {/* Data Points */}
              {coords.map((pt) => {
                const isSelected = pt.index === activeIdx;
                return (
                  <G key={pt.index}>
                    <Circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#FFFFFF' : '#EF4444'}
                      stroke={isSelected ? '#EF4444' : '#18181C'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                  </G>
                );
              })}
            </Svg>

            {/* Bottom X-Axis Date Labels */}
            <View style={styles.xAxisRow}>
              {chartData.map((item, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.xAxisText,
                    idx === activeIdx && { color: '#FFFFFF', fontWeight: '800' }
                  ]}
                >
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
              ))}
            </View>
          </View>

          {/* 🎛️ Session Point Selector Bar */}
          <View style={styles.sessionSelectorContainer}>
            <Text style={styles.sessionSelectorTitle}>
              {hasRecordedPoints ? 'RECORDED WORKOUT SETS:' : 'NO SET DATA YET'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionSelectorScroll}
            >
              {chartData.map((item, idx) => {
                const isSelected = idx === activeIdx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.sessionPill, isSelected && styles.sessionPillSelected]}
                    onPress={() => setSelectedPointIdx(idx)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.sessionPillDate,
                        isSelected && styles.sessionPillDateSelected
                      ]}
                    >
                      {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text
                      style={[
                        styles.sessionPillWeight,
                        isSelected && styles.sessionPillWeightSelected
                      ]}
                    >
                      {item.value}kg
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Efficiency Scorecard */}
          <View style={styles.scorecardFooter}>
            <View style={styles.scorecardRow}>
              <View>
                <Text style={styles.scorecardBigPercent}>
                  {hasRecordedPoints ? `${gainPct}%` : '—'}
                </Text>
                <Text style={styles.scorecardTitle}>Progressive Overload Trend</Text>
              </View>
              <View style={styles.efficiencyGradeBadge}>
                <Text style={styles.efficiencyGradeText}>
                  {hasRecordedPoints ? 'ACTIVE TRACKING' : 'NEW ACCOUNT'}
                </Text>
              </View>
            </View>
            <Text style={styles.scorecardDesc}>
              {hasRecordedPoints
                ? `Calculated from verified completed sets (${gainKg} kg change).`
                : `Strength progression appears when completed sets include real reps and weight.`}
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🍏 CARD 2: REAL ACTIVITY RINGS                                            */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>FITNESS ACTIVITY METRICS</Text>
              <Text style={styles.kpiBigNumber}>{workoutsThisWeek} this week</Text>
              <Text style={styles.kpiSubText}>Workout activity</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>TOTAL RECORDED</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>
                {displayVolumeStr} <Text style={styles.kpiUnit}>kg</Text>
              </Text>
              <Text style={styles.kpiSubText}>
                {workoutHistory.length} Sessions Logged
              </Text>
            </View>
          </View>

          {/* Native SVG 3 Concentric Activity Progress Rings */}
          <View style={{ alignItems: 'center', paddingVertical: 14 }}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
              {/* Background Tracks */}
              <Circle cx="90" cy="90" r="70" stroke="#1F1F24" strokeWidth="10" fill="none" />
              <Circle cx="90" cy="90" r="54" stroke="#1F1F24" strokeWidth="10" fill="none" />
              <Circle cx="90" cy="90" r="38" stroke="#1F1F24" strokeWidth="10" fill="none" />

              {/* Rings reflect saved workouts and active days this week. */}
              <Circle
                cx="90"
                cy="90"
                r="70"
                stroke="#EF4444"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${Math.round(440 * weekProgress)} 440`}
                strokeLinecap="round"
              />
              {/* Ring 2: Workouts (Emerald #10B981) */}
              <Circle
                cx="90"
                cy="90"
                r="54"
                stroke="#10B981"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${Math.round(340 * dayProgress)} 340`}
                strokeLinecap="round"
              />
              {/* Ring 3: Consistency (Sky #38BDF8) */}
              <Circle
                cx="90"
                cy="90"
                r="38"
                stroke="#38BDF8"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${Math.round(240 * Math.min(1, workoutHistory.length / 20))} 240`}
                strokeLinecap="round"
              />
            </Svg>

            <View style={styles.ringLegendRow}>
              <View style={styles.ringLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.ringLegendText}>Workouts this week ({workoutsThisWeek})</Text>
              </View>
              <View style={styles.ringLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.ringLegendText}>Active days ({activeDaysThisWeek})</Text>
              </View>
              <View style={styles.ringLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#38BDF8' }]} />
                <Text style={styles.ringLegendText}>Total sessions ({workoutHistory.length})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📊 CARD 3: REAL SESSION TONNAGE BARS                                      */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>WORKOUT FREQUENCY</Text>
              <Text style={styles.kpiBigNumber}>
                {workoutsThisWeek} <Text style={styles.kpiUnit}>this week</Text>
              </Text>
              <Text style={styles.kpiSubText}>Last four weeks</Text>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>COMPLETED SESSIONS</Text>
              <Text style={[styles.kpiBigNumber, { color: '#38BDF8' }]}>
                {workoutHistory.length} <Text style={styles.kpiUnit}>total</Text>
              </Text>
              <Text style={styles.kpiSubText}>Synced to Cloud DB</Text>
            </View>
          </View>

          {/* Saved session counts by week. */}
          <View style={styles.barChartContainer}>
            {volumeBars.map((bar, idx) => (
              <View key={idx} style={styles.barColumn}>
                <Text
                  style={[
                    styles.barTopVal,
                    bar.isHighlight && { color: '#EF4444', fontWeight: '800' }
                  ]}
                >
                  {bar.valStr}
                </Text>
                <View style={styles.barTrack}>
                  <LinearGradient
                    colors={
                      bar.isHighlight
                        ? ['#EF4444', '#B91C1C']
                        : ['#3F3F46', '#27272A']
                    }
                    style={[styles.barFill, { height: `${bar.percent}%` }]}
                  />
                </View>
                <Text
                  style={[
                    styles.barBottomLabel,
                    bar.isHighlight && { color: '#FFFFFF', fontWeight: '700' }
                  ]}
                >
                  {bar.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.scorecardFooter}>
            <Text style={styles.scorecardDesc}>
              {hasRealWorkouts
                ? 'These bars count your saved workout sessions.'
                : 'Complete a workout to start building your history.'}
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 4: PERSONAL BEST RECORDS                                         */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={styles.kpiSuperTitle}>YOUR LIFETIME TROPHIES</Text>
            <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {Object.keys(LIFT_CONFIGS).map((k) => {
              const cfg = LIFT_CONFIGS[k];
              const points = verifiedPoints(userLogs, k);
              const bestPoint = points.reduce((best, point) => !best || Number(point.value) > Number(best.value) ? point : best, null);
              const isRecorded = !!bestPoint;

              return (
                <View key={k} style={styles.prRow}>
                  <View
                    style={[
                      styles.prBadge,
                      {
                        backgroundColor: isRecorded
                          ? 'rgba(239, 68, 68, 0.15)'
                          : '#27272A',
                        borderColor: isRecorded ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'
                      }
                    ]}
                  >
                    <Trophy size={14} color={isRecorded ? '#EF4444' : '#71717A'} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.prLiftName}>{cfg.name}</Text>
                    <Text style={styles.prDate}>
                      {isRecorded ? 'Verified completed set' : 'No record yet'}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.prWeight}>{isRecorded ? `${bestPoint.value} kg` : '—'}</Text>
                    <Text style={styles.pr1RM}>{isRecorded ? `1RM: ${calc1RM(bestPoint.value, bestPoint.reps)} kg` : 'Complete sets to unlock'}</Text>
                  </View>
                </View>
              );
            })}
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
    height: 340
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)'
  },
  proPreviewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#493035'
  },
  proPreviewLinkText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  headerDotPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6
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
    letterSpacing: -0.6
  },
  subtitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18
  },

  // 🎴 Luxury Obsidian Cards
  glassCard: {
    backgroundColor: '#111114',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 16,
    overflow: 'hidden'
  },

  // Split KPI Header
  splitKpiHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
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
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8
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
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignSelf: 'stretch',
    marginHorizontal: 14
  },

  // Lift Tabs
  liftTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#18181C',
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 18,
    marginBottom: 8
  },
  liftTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 9
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

  // 📅 Gold Standard Time Range Bar (1M, 3M, 6M, 1Y, ALL)
  timeRangeBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: '#16161A',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  timeRangePill: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 7
  },
  timeRangePillSelected: {
    backgroundColor: '#27272A'
  },
  timeRangeText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },
  timeRangeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900'
  },

  // Chart Wrapper
  chartWrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center'
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8
  },
  xAxisText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },

  // 🎛️ Session Selector Horizontal List
  sessionSelectorContainer: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8
  },
  sessionSelectorTitle: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  sessionSelectorScroll: {
    gap: 8
  },
  sessionPill: {
    backgroundColor: '#18181C',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center'
  },
  sessionPillSelected: {
    backgroundColor: '#27272A',
    borderColor: '#EF4444'
  },
  sessionPillDate: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '600'
  },
  sessionPillDateSelected: {
    color: '#FFFFFF'
  },
  sessionPillWeight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2
  },
  sessionPillWeightSelected: {
    color: '#EF4444'
  },

  // 🕹️ Interactive Stepper Controls
  stepperContainer: {
    marginHorizontal: 18,
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#16161A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  stepperHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  stepperLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  stepperSubLabel: {
    color: '#71717A',
    fontSize: 10
  },
  stepperButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  stepperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27272A',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4
  },
  stepperBtnMinus: {
    backgroundColor: '#222228'
  },
  stepperBtnAdd: {
    backgroundColor: '#27272A'
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  stepperBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1
  },
  stepperBtnNewText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  stepperBtnReset: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222228',
    width: 34,
    height: 34,
    borderRadius: 8
  },

  // Scorecard Footer
  scorecardFooter: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#0F0F12'
  },
  scorecardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  scorecardBigPercent: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '900'
  },
  scorecardTitle: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600'
  },
  efficiencyGradeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  efficiencyGradeText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800'
  },
  scorecardDesc: {
    color: '#71717A',
    fontSize: 11,
    lineHeight: 16
  },

  // Ring Legend
  ringLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10
  },
  ringLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  colorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  ringLegendText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '600'
  },

  // Tonnage Bar Chart
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 130,
    paddingTop: 10,
    paddingHorizontal: 16
  },
  barColumn: {
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
    height: 80,
    backgroundColor: '#222228',
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

  // Personal Best Records
  cardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 2
  },
  prList: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 10
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  prBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1
  },
  prLiftName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  prDate: {
    color: '#71717A',
    fontSize: 10,
    marginTop: 2
  },
  prWeight: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  pr1RM: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700'
  }
});
