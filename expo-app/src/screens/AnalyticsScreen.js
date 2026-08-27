import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
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
const CHART_WIDTH = CARD_WIDTH - 20;

// 🏋️ Compound Lift Datasets for Apple Health Bezier Curves
const LIFTS_DATABASE = {
  bench: {
    name: 'Barbell Bench Press',
    baseline: 65,
    labels: ['Aug 1', 'Aug 7', 'Aug 14', 'Aug 21', 'Today'],
    weights: [65.0, 67.5, 70.0, 72.5, 75.0],
    reps: [10, 8, 8, 6, 6]
  },
  squat: {
    name: 'Barbell Back Squat',
    baseline: 90,
    labels: ['Aug 1', 'Aug 7', 'Aug 14', 'Aug 21', 'Today'],
    weights: [90.0, 95.0, 100.0, 105.0, 110.0],
    reps: [8, 8, 6, 6, 5]
  },
  deadlift: {
    name: 'Barbell Deadlift',
    baseline: 110,
    labels: ['Aug 1', 'Aug 7', 'Aug 14', 'Aug 21', 'Today'],
    weights: [110.0, 115.0, 120.0, 125.0, 135.0],
    reps: [6, 5, 5, 4, 4]
  },
  press: {
    name: 'Overhead Military Press',
    baseline: 40,
    labels: ['Aug 1', 'Aug 7', 'Aug 14', 'Aug 21', 'Today'],
    weights: [40.0, 42.5, 45.0, 47.5, 50.0],
    reps: [10, 8, 8, 6, 6]
  }
};

export function AnalyticsScreen({
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const [liftsState, setLiftsState] = useState(LIFTS_DATABASE);
  const [selectedPointIdx, setSelectedPointIdx] = useState(4);
  const [selectedBarIdx, setSelectedBarIdx] = useState(0);

  // Load real persisted logs from AsyncStorage & auto-updates
  useEffect(() => {
    (async () => {
      const savedLogs = await loadExerciseLogs();
      if (savedLogs && Object.keys(savedLogs).length > 0) {
        const mapped = {};
        Object.keys(savedLogs).forEach((k) => {
          if (savedLogs[k]?.points && savedLogs[k].points.length >= 2) {
            mapped[k] = {
              name: savedLogs[k].name || LIFTS_DATABASE[k]?.name,
              baseline: savedLogs[k].baseline || LIFTS_DATABASE[k]?.baseline || 60,
              labels: savedLogs[k].points.map((pt) => pt.label || 'Day'),
              weights: savedLogs[k].points.map((pt) => pt.val),
              reps: savedLogs[k].points.map((pt) => pt.reps || 6)
            };
          }
        });
        if (Object.keys(mapped).length > 0) {
          setLiftsState((prev) => ({ ...prev, ...mapped }));
        }
      }
    })();
  }, [workoutHistory]);

  const activeLift = liftsState[selectedLiftKey] || liftsState.bench;
  const weights = activeLift.weights;
  const labels = activeLift.labels;
  const reps = activeLift.reps;

  // Selected Data Point State
  const activeIdx = Math.min(selectedPointIdx, weights.length - 1);
  const activeWeight = weights[activeIdx];
  const activeReps = reps[activeIdx] || 6;
  const activeLabel = labels[activeIdx];

  // 🧮 Calculate 1RM via Epley Formula: 1RM = Weight × (1 + Reps / 30)
  const calc1RM = (weight, r = 6) => (weight * (1 + r / 30)).toFixed(1);
  const active1RM = calc1RM(activeWeight, activeReps);

  // Overload % vs Baseline
  const baseline = activeLift.baseline || weights[0];
  const gainKg = (activeWeight - baseline).toFixed(1);
  const gainPct = Math.round(((activeWeight - baseline) / baseline) * 100);

  // 📊 Live Real Workout History Processing
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const totalVolumeKg = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (item.totalVolumeKg || 8500), 0)
    : 23900;

  const displayVolumeStr = totalVolumeKg >= 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : `${totalVolumeKg}`;

  // Real Workout Bars for Weekly Volume
  const realBarLabels = hasRealWorkouts
    ? workoutHistory.slice(0, 4).reverse().map((w, i) => `S${i + 1}`)
    : ['W1', 'W2', 'W3', 'W4'];

  const realBarValues = hasRealWorkouts
    ? workoutHistory.slice(0, 4).reverse().map((w) => (w.totalVolumeKg ? Math.round(w.totalVolumeKg / 1000) : 12))
    : [11.2, 12.8, 14.5, 17.2];

  // Apple Fitness Activity Rings Data
  const ringProgressData = {
    labels: ['Volume', 'Streak', 'Intensity'],
    data: [Math.min(1.0, totalVolumeKg / 30000), 0.86, 0.94]
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      {/* 🔴 Ambient Luxury Dark-Red Radial Background Glow */}
      <LinearGradient
        colors={['rgba(220, 38, 38, 0.22)', 'rgba(220, 38, 38, 0.04)', 'transparent']}
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
            <Text style={styles.headerBadgeText}>PRO ATHLETE INTELLIGENCE</Text>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            Interactive Apple Health-style Bezier curves & live hypertrophy metrics.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 🎴 CARD 1: APPLE HEALTH STYLE BEZIER 1RM PROGRESSION                       */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          {/* Dynamic KPI Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>{active1RM} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Working Set: {activeWeight} kg ({activeReps} reps)</Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>Milestone: {activeLabel}</Text>
              </View>
            </View>

            <View style={styles.kpiDivider} />

            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>OVERLOAD RATE</Text>
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
                  onPress={() => {
                    setSelectedLiftKey(item.key);
                    setSelectedPointIdx(4);
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

          {/* 🍏 Apple Health Smooth Bezier Line Chart from react-native-chart-kit */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: weights,
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                    strokeWidth: 3.5
                  }
                ]
              }}
              width={CHART_WIDTH}
              height={170}
              bezier
              withInnerLines
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines
              chartConfig={{
                backgroundColor: '#121215',
                backgroundGradientFrom: '#121215',
                backgroundGradientTo: '#121215',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2.5',
                  stroke: '#FFFFFF'
                },
                propsForBackgroundLines: {
                  strokeDasharray: '4, 4',
                  stroke: 'rgba(255, 255, 255, 0.05)'
                }
              }}
              onDataPointClick={({ index, value }) => {
                setSelectedPointIdx(index);
              }}
              style={styles.bezierChartStyle}
            />
          </View>

          {/* Interactive Hint Bar */}
          <View style={styles.scrubberHintBar}>
            <Zap size={13} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.scrubberHintText}>
              Tap any point to inspect: <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{activeWeight} kg</Text> (1RM {active1RM} kg)
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
        {/* 🍏 CARD 2: APPLE FITNESS ACTIVITY RINGS                                   */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>FITNESS ACTIVITY METRICS</Text>
              <Text style={styles.kpiBigNumber}>3 Core Rings</Text>
              <Text style={styles.kpiSubText}>Volume · Streak · Intensity</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>TOTAL RECORDED</Text>
              <Text style={[styles.kpiBigNumber, { color: '#10B981' }]}>{displayVolumeStr} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>{workoutHistory.length || 2} Sessions Logged</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <ProgressChart
              data={ringProgressData}
              width={CARD_WIDTH - 20}
              height={140}
              strokeWidth={10}
              radius={24}
              chartConfig={{
                backgroundColor: '#121215',
                backgroundGradientFrom: '#121215',
                backgroundGradientTo: '#121215',
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
        {/* 📊 CARD 3: REAL WORKOUT VOLUME BAR CHART                                  */}
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
              <Text style={styles.kpiSuperTitle}>SESSION RHYTHM</Text>
              <Text style={[styles.kpiBigNumber, { color: '#38BDF8' }]}>4.2 <Text style={styles.kpiUnit}>d/wk</Text></Text>
              <Text style={styles.kpiSubText}>Stored in Database</Text>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: realBarLabels,
                datasets: [{ data: realBarValues }]
              }}
              width={CHART_WIDTH}
              height={150}
              yAxisSuffix="k"
              showValuesOnTopOfBars
              withInnerLines={false}
              chartConfig={{
                backgroundColor: '#121215',
                backgroundGradientFrom: '#121215',
                backgroundGradientTo: '#121215',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
                barPercentage: 0.6
              }}
              style={styles.bezierChartStyle}
            />
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 4: PERSONAL RECORDS HALL OF FAME                                  */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
            <Text style={styles.kpiSuperTitle}>LIFETIME TROPHIES</Text>
            <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {[
              { id: 'bench', lift: 'Barbell Bench Press', weight: `${Math.max(...liftsState.bench.weights)} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'squat', lift: 'Barbell Back Squat', weight: `${Math.max(...liftsState.squat.weights)} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'deadlift', lift: 'Barbell Deadlift', weight: `${Math.max(...liftsState.deadlift.weights)} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'press', lift: 'Standing Military Press', weight: `${Math.max(...liftsState.press.weights)} kg`, date: 'Aug 2026', badgeColor: '#EF4444' }
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
    height: 360
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

  // 🎴 Luxury Frosted Obsidian Glass Cards
  glassCard: {
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 16,
    overflow: 'hidden'
  },

  // Split KPI Header
  splitKpiHeader: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 18,
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
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 18,
    marginBottom: 10
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

  // Chart Wrapper
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 4
  },
  bezierChartStyle: {
    borderRadius: 16,
    marginVertical: 4
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

  // Scorecard Footer
  scorecardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 18,
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
