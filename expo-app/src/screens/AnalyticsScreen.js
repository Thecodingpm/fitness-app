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
  Alert,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { ProgressChart } from 'react-native-chart-kit';
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
  Check,
  Plus,
  Minus,
  PlusCircle,
  RotateCcw
} from 'lucide-react-native';
import { loadExerciseLogs, persistExerciseLogs } from '../services/sessionStorage';
import { getUserExerciseLogsFromFirestore, saveExerciseLogsToFirestore } from '../services/firestore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CHART_PADDING_X = 14;
const CHART_WIDTH = CARD_WIDTH - 2 * CHART_PADDING_X;

// Standard lift titles
const LIFT_CONFIGS = {
  bench: { name: 'Barbell Bench Press', defaultStarting: 60.0 },
  squat: { name: 'Barbell Back Squat', defaultStarting: 80.0 },
  deadlift: { name: 'Barbell Deadlift', defaultStarting: 100.0 },
  press: { name: 'Overhead Military Press', defaultStarting: 40.0 }
};

export function AnalyticsScreen({
  userId = 'guest',
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M'); // '1M' | '3M' | '6M' | '1Y' | 'ALL'
  const [userLogs, setUserLogs] = useState({});
  const [selectedPointIdx, setSelectedPointIdx] = useState(null);
  const [initialWeightInput, setInitialWeightInput] = useState('');
  const [isInitializingLift, setIsInitializingLift] = useState(false);

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
          await persistExerciseLogs(cloudLogs, userId);
        }
      } catch (err) {
        console.log('Error fetching Firestore logs:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [userId, workoutHistory]);

  const activeConfig = LIFT_CONFIGS[selectedLiftKey] || LIFT_CONFIGS.bench;
  const currentLiftData = userLogs[selectedLiftKey];
  const hasRecordedPoints = currentLiftData?.points && currentLiftData.points.length > 0;

  // Build chart points from real user logs
  const rawPoints = hasRecordedPoints
    ? currentLiftData.points
    : [
        {
          value: activeConfig.defaultStarting,
          reps: 6,
          label: 'Baseline',
          date: 'Starting Baseline'
        }
      ];

  // Filter or aggregate points based on Time Range
  const getRangeData = () => {
    if (!hasRecordedPoints) return rawPoints;
    const pts = currentLiftData.points;
    if (selectedTimeRange === '1M') {
      return pts.slice(-7);
    } else if (selectedTimeRange === '3M') {
      return pts.length > 6 ? pts.filter((_, i) => i % 2 === 0).slice(-6) : pts;
    } else if (selectedTimeRange === '6M') {
      return pts.length > 6 ? pts.filter((_, i) => i % 3 === 0).slice(-6) : pts;
    } else if (selectedTimeRange === '1Y') {
      return pts.slice(-12);
    }
    return pts; // ALL
  };

  const chartData = getRangeData();

  // Active selected point index defaults to last point
  const activeIdx =
    selectedPointIdx !== null && selectedPointIdx >= 0 && selectedPointIdx < chartData.length
      ? selectedPointIdx
      : chartData.length - 1;

  const displayedItem = chartData[activeIdx] || chartData[chartData.length - 1];

  // 🧮 Calculate 1RM via Epley Formula: 1RM = Weight × (1 + Reps / 30)
  const calc1RM = (weight, reps = 6) => (Number(weight || 0) * (1 + Number(reps || 6) / 30)).toFixed(1);
  const displayed1RM = calc1RM(displayedItem.value, displayedItem.reps || 6);

  // Dynamic Overload % relative to range baseline
  const baselineVal = chartData[0]?.value || displayedItem.value || 60;
  const gainKg = (displayedItem.value - baselineVal).toFixed(1);
  const gainPct = baselineVal > 0 ? Math.round(((displayedItem.value - baselineVal) / baselineVal) * 100) : 0;

  // 💾 Helper to save updated logs to Local + Cloud Firestore
  const saveLogsState = async (nextLogs) => {
    setUserLogs(nextLogs);
    await persistExerciseLogs(nextLogs, userId);
    if (userId && userId !== 'guest') {
      saveExerciseLogsToFirestore(userId, nextLogs);
    }
  };

  // 🛠️ Record or initialize starting weight for a lift
  const handleRecordStartingWeight = async (customWeight = null) => {
    const weightNum = parseFloat(customWeight || initialWeightInput) || activeConfig.defaultStarting;
    const now = new Date();
    const dateLabel = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;

    const newPoint = {
      value: weightNum,
      reps: 6,
      label: 'Today',
      date: `Today · ${dateLabel}`
    };

    const nextLogs = {
      ...userLogs,
      [selectedLiftKey]: {
        name: activeConfig.name,
        baseline: weightNum,
        points: [newPoint]
      }
    };

    await saveLogsState(nextLogs);
    setIsInitializingLift(false);
    setInitialWeightInput('');
    setSelectedPointIdx(0);
  };

  // 🛠️ Adjust weight of the CURRENTLY SELECTED point (+/- delta)
  const handleAdjustSelectedPoint = async (delta) => {
    if (!hasRecordedPoints) {
      await handleRecordStartingWeight(activeConfig.defaultStarting + delta);
      return;
    }

    const targetIdx = activeIdx;
    const currentVal = chartData[targetIdx].value;
    const newVal = Math.max(10, parseFloat((currentVal + delta).toFixed(1)));

    const updatedPoints = chartData.map((item, idx) => {
      if (idx === targetIdx) {
        return { ...item, value: newVal };
      }
      return item;
    });

    const nextLogs = {
      ...userLogs,
      [selectedLiftKey]: {
        ...currentLiftData,
        points: updatedPoints
      }
    };

    await saveLogsState(nextLogs);
  };

  // ➕ Add a new session point to the active range
  const handleAddNewSession = async () => {
    const lastVal = chartData[chartData.length - 1].value;
    const newVal = parseFloat((lastVal + 2.5).toFixed(1));
    const now = new Date();
    const dateLabel = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;

    const updatedExisting = chartData.map((item, idx) => {
      if (idx === chartData.length - 1) {
        return { ...item, label: `S${idx + 1}` };
      }
      return item;
    });

    const newPoint = {
      value: newVal,
      reps: 6,
      label: 'Today',
      date: `Today · ${dateLabel}`
    };

    const nextLogs = {
      ...userLogs,
      [selectedLiftKey]: {
        ...currentLiftData,
        points: [...updatedExisting, newPoint]
      }
    };

    await saveLogsState(nextLogs);
    setSelectedPointIdx(nextLogs[selectedLiftKey].points.length - 1);
  };

  // 🔄 Reset lift to clean state
  const handleResetLift = async () => {
    const nextLogs = { ...userLogs };
    delete nextLogs[selectedLiftKey];
    await saveLogsState(nextLogs);
    setSelectedPointIdx(null);
    Alert.alert('🔄 Reset Completed', `Cleared data for ${activeConfig.name}.`);
  };

  // 📊 Live Real Workout History Processing (Total Volume & Sessions)
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const totalVolumeKg = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (Number(item.totalVolumeKg) || 0), 0)
    : 0;

  const displayVolumeStr =
    totalVolumeKg >= 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : `${totalVolumeKg}`;

  // Gifted Charts Bar Data for Volume from REAL workouts
  const giftedBarData = hasRealWorkouts
    ? workoutHistory
        .slice(0, 4)
        .reverse()
        .map((w, idx, arr) => ({
          value: w.totalVolumeKg ? Math.round(w.totalVolumeKg / 1000) : 0,
          label: `S${idx + 1}`,
          frontColor: idx === arr.length - 1 ? '#EF4444' : '#27272A',
          topLabelComponent: () => (
            <Text style={[styles.barTopLabel, idx === arr.length - 1 && { color: '#EF4444' }]}>
              {w.totalVolumeKg ? (w.totalVolumeKg / 1000).toFixed(1) : 0}k
            </Text>
          )
        }))
    : [
        { value: 0, label: 'S1', frontColor: '#27272A', topLabelComponent: () => <Text style={styles.barTopLabel}>0k</Text> },
        { value: 0, label: 'S2', frontColor: '#27272A', topLabelComponent: () => <Text style={styles.barTopLabel}>0k</Text> },
        { value: 0, label: 'S3', frontColor: '#27272A', topLabelComponent: () => <Text style={styles.barTopLabel}>0k</Text> },
        { value: 0, label: 'S4', frontColor: '#EF4444', topLabelComponent: () => <Text style={[styles.barTopLabel, { color: '#EF4444' }]}>0k</Text> }
      ];

  // Apple Fitness Activity Rings Data based on REAL user progress
  const ringProgressData = {
    labels: ['Volume', 'Workouts', 'Consistency'],
    data: [
      Math.min(1.0, totalVolumeKg / 25000),
      Math.min(1.0, (workoutHistory.length || 0) / 10),
      Math.min(1.0, Object.keys(dailyWorkoutStatuses || {}).length / 7)
    ]
  };

  // 📐 Generous 24px Side Margins so labels never get clipped!
  const sidePad = 24;
  const chartSpacing = (CHART_WIDTH - 2 * sidePad) / Math.max(1, chartData.length - 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      {/* 🔴 Ambient Dark-Red Radial Glow */}
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.16)', 'rgba(239, 68, 68, 0.02)', 'transparent']}
        style={styles.bgGlow}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🌟 Luxury Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBadge}>
            <View style={styles.headerDotPulse} />
            <Text style={styles.headerBadgeText}>REAL TIME CLOUD DATABASE</Text>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            {userName} • Live progression curves synced directly with your personal profile.
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
              <Text style={styles.kpiBigNumber}>{displayed1RM} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Working: {displayedItem.value} kg ({displayedItem.reps || 6} reps)</Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>{displayedItem.date || displayedItem.label || 'Today'}</Text>
              </View>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD RATE ({selectedTimeRange})</Text>
              <Text style={[styles.kpiBigNumber, { color: gainPct >= 0 ? '#10B981' : '#EF4444' }]}>
                {gainPct >= 0 ? `+${gainPct}%` : `${gainPct}%`}
              </Text>
              <Text style={styles.kpiSubText}>{gainKg >= 0 ? `+${gainKg}` : gainKg} kg vs {selectedTimeRange} start</Text>
              <View style={[styles.kpiPillTag, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Text style={[styles.kpiPillTagText, { color: '#10B981' }]}>
                  {hasRecordedPoints ? `${chartData.length} Logged Sessions` : 'Starting Baseline'}
                </Text>
              </View>
            </View>
          </View>

          {/* Segmented Lift Switcher (Bench, Squat, Deadlift, Press) */}
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
                  <Text style={[styles.timeRangeText, isSelected && styles.timeRangeTextSelected]}>
                    {rangeKey}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 🍏 Zero-Clipped LineChart */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              height={150}
              width={CHART_WIDTH}
              spacing={chartSpacing}
              initialSpacing={sidePad}
              endSpacing={sidePad}
              color="#EF4444"
              thickness={2.5}
              startFillColor="rgba(239, 68, 68, 0.22)"
              endFillColor="rgba(239, 68, 68, 0.0)"
              startOpacity={0.9}
              endOpacity={0.0}
              areaChart
              curved
              curvature={0.22}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="rgba(255, 255, 255, 0.06)"
              xAxisLabelTextStyle={{ color: '#71717A', fontSize: 10, fontWeight: '600' }}
              dataPointsColor="#FFFFFF"
              dataPointsRadius={4}
              focusedDataPointRadius={5}
              pointerConfig={{
                pointerStripHeight: 140,
                pointerStripColor: 'rgba(255, 255, 255, 0.35)',
                pointerStripWidth: 1,
                pointerColor: '#FFFFFF',
                radius: 5,
                pointerLabelWidth: 130,
                pointerLabelHeight: 38,
                activatePointersOnLongPress: false,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items) => {
                  const item = items[0];
                  if (!item) return null;
                  return (
                    <View style={styles.cleanFloatingPill}>
                      <Text style={styles.floatingPillBold}>{item.value} kg</Text>
                      <Text style={styles.floatingPillSub}> · 1RM {calc1RM(item.value, item.reps || 6)}kg</Text>
                    </View>
                  );
                },
                onPointerHover: (item, index) => {
                  if (typeof index === 'number' && index >= 0) {
                    setSelectedPointIdx(index);
                  }
                }
              }}
            />
          </View>

          {/* 🎛️ Session Point Selector Bar */}
          <View style={styles.sessionSelectorContainer}>
            <Text style={styles.sessionSelectorTitle}>
              {hasRecordedPoints ? 'SELECT ANY SESSION TO TEST / EDIT:' : 'STARTING BASELINE (LOG WORKOUT TO GROW):'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionSelectorScroll}>
              {chartData.map((item, idx) => {
                const isSelected = idx === activeIdx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.sessionPill, isSelected && styles.sessionPillSelected]}
                    onPress={() => setSelectedPointIdx(idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sessionPillDate, isSelected && styles.sessionPillDateSelected]}>
                      {item.date || item.label || `M${idx + 1}`}
                    </Text>
                    <Text style={[styles.sessionPillWeight, isSelected && styles.sessionPillWeightSelected]}>
                      {item.value}kg
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ⚡ Live Stepper for Selected Milestone */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperLabelCol}>
              <Text style={styles.stepperLabelTitle}>ADJUST {displayedItem.label.toUpperCase()}:</Text>
              <Text style={styles.stepperLabelWeight}>{displayedItem.value} kg</Text>
            </View>

            <View style={styles.stepperActionsRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleAdjustSelectedPoint(-2.5)}
                activeOpacity={0.7}
              >
                <Minus size={15} color="#FFFFFF" />
                <Text style={styles.stepperBtnText}>2.5kg</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.stepperBtn, styles.stepperBtnAdd]}
                onPress={() => handleAdjustSelectedPoint(+2.5)}
                activeOpacity={0.7}
              >
                <Plus size={15} color="#FFFFFF" />
                <Text style={styles.stepperBtnText}>2.5kg</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stepperBtnNew}
                onPress={handleAddNewSession}
                activeOpacity={0.7}
              >
                <PlusCircle size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.stepperBtnNewText}>+ Log</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stepperBtnReset}
                onPress={handleResetLift}
                activeOpacity={0.7}
              >
                <RotateCcw size={13} color="#71717A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Efficiency Scorecard */}
          <View style={styles.scorecardFooter}>
            <View style={styles.scorecardRow}>
              <View>
                <Text style={styles.scorecardBigPercent}>{gainPct >= 0 ? `${gainPct}%` : '0%'}</Text>
                <Text style={styles.scorecardTitle}>Progressive Overload Trend</Text>
              </View>
              <View style={styles.efficiencyGradeBadge}>
                <Text style={styles.efficiencyGradeText}>{hasRecordedPoints ? 'ACTIVE TRACKING' : 'NEW ACCOUNT'}</Text>
              </View>
            </View>
            <Text style={styles.scorecardDesc}>
              {hasRecordedPoints
                ? `Adaptation rate is tracking live from your real workout sets (+${gainKg}kg).`
                : `Complete workouts in the Workouts tab or tap "+ Log" to record your live ${activeConfig.name} sets.`}
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
              <Text style={styles.kpiBigNumber}>3 Core Rings</Text>
              <Text style={styles.kpiSubText}>Volume · Workouts · Streak</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>TOTAL RECORDED</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>{displayVolumeStr} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>{workoutHistory.length} Sessions Logged</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <ProgressChart
              data={ringProgressData}
              width={CARD_WIDTH - 20}
              height={140}
              strokeWidth={10}
              radius={24}
              chartConfig={{
                backgroundColor: '#111114',
                backgroundGradientFrom: '#111114',
                backgroundGradientTo: '#111114',
                color: (opacity = 1, index) => {
                  const colors = [
                    `rgba(239, 68, 68, ${opacity})`,
                    `rgba(16, 185, 129, ${opacity})`,
                    `rgba(56, 189, 248, ${opacity})`
                  ];
                  return colors[index % colors.length] || `rgba(239, 68, 68, ${opacity})`;
                }
              }}
              hideLegend={false}
              style={{ borderRadius: 16 }}
            />
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 📊 CARD 3: REAL SESSION TONNAGE BARS                                      */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>SESSION TONNAGE</Text>
              <Text style={styles.kpiBigNumber}>{displayVolumeStr} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Last 4 Workouts</Text>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>COMPLETED SESSIONS</Text>
              <Text style={[styles.kpiBigNumber, { color: '#38BDF8' }]}>{workoutHistory.length} <Text style={styles.kpiUnit}>total</Text></Text>
              <Text style={styles.kpiSubText}>Synced to Cloud DB</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <BarChart
              data={giftedBarData}
              width={CARD_WIDTH - 44}
              height={130}
              barWidth={32}
              spacing={22}
              roundedTop
              roundedBottom
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="rgba(255, 255, 255, 0.06)"
              xAxisLabelTextStyle={{ color: '#71717A', fontSize: 11, fontWeight: '700' }}
            />
          </View>

          <View style={styles.scorecardFooter}>
            <Text style={styles.scorecardDesc}>
              {hasRealWorkouts
                ? 'Total cumulative tonnage calculated dynamically from your logged workout sessions.'
                : 'No workouts completed yet. Start your first workout to record real tonnage!'}
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
              const logData = userLogs[k];
              const bestVal = logData?.points && logData.points.length > 0
                ? Math.max(...logData.points.map((p) => Number(p.value) || 0))
                : cfg.defaultStarting;
              const isRecorded = logData?.points && logData.points.length > 0;

              return (
                <View key={k} style={styles.prRow}>
                  <View style={[styles.prBadge, { backgroundColor: isRecorded ? 'rgba(239, 68, 68, 0.15)' : '#27272A', borderColor: isRecorded ? '#EF4444' : 'rgba(255, 255, 255, 0.1)' }]}>
                    <Trophy size={14} color={isRecorded ? '#EF4444' : '#71717A'} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.prLiftName}>{cfg.name}</Text>
                    <Text style={styles.prDate}>{isRecorded ? 'Recorded in DB' : 'Starting Baseline'}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.prWeight}>{bestVal} kg</Text>
                    <Text style={styles.pr1RM}>1RM: {calc1RM(bestVal, 6)} kg</Text>
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
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginBottom: 8
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
    paddingHorizontal: CHART_PADDING_X,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    overflow: 'visible'
  },
  cleanFloatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  floatingPillBold: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  floatingPillSub: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700'
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
    gap: 8,
    paddingBottom: 4
  },
  sessionPill: {
    backgroundColor: '#18181C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center'
  },
  sessionPillSelected: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444'
  },
  sessionPillDate: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '700'
  },
  sessionPillDateSelected: {
    color: '#EF4444',
    fontWeight: '800'
  },
  sessionPillWeight: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2
  },
  sessionPillWeightSelected: {
    color: '#FFFFFF',
    fontWeight: '900'
  },

  // ⚡ Live Stepper Row
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16161A',
    marginHorizontal: 18,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  stepperLabelCol: {
    justifyContent: 'center'
  },
  stepperLabelTitle: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  stepperLabelWeight: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 1
  },
  stepperActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  stepperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6
  },
  stepperBtnAdd: {
    backgroundColor: '#DC2626'
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 2
  },
  stepperBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  stepperBtnNewText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800'
  },
  stepperBtnReset: {
    backgroundColor: '#18181C',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },

  // Bar Top Label
  barTopLabel: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4
  },

  // Scorecard Footer
  scorecardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 20,
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
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161619',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  prBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12
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
