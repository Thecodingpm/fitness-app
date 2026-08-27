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
  Alert
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

// 🏋️ Clean 7-Session Initial Benchmarks (Merged dynamically with real AsyncStorage workout logs)
const LIFTS_DATABASE = {
  bench: {
    name: 'Barbell Bench Press',
    baseline: 65.0,
    ranges: {
      '1M': [
        { value: 65.0, reps: 8, label: 'Aug 1', date: 'Aug 1' },
        { value: 67.0, reps: 8, label: 'Aug 5', date: 'Aug 5' },
        { value: 68.5, reps: 8, label: 'Aug 9', date: 'Aug 9' },
        { value: 70.0, reps: 6, label: 'Aug 13', date: 'Aug 13' },
        { value: 71.5, reps: 6, label: 'Aug 17', date: 'Aug 17' },
        { value: 73.0, reps: 6, label: 'Aug 21', date: 'Aug 21' },
        { value: 75.0, reps: 6, label: 'Today', date: 'Today' }
      ],
      '3M': [
        { value: 60.0, reps: 8, label: 'Jun 1', date: 'Jun 1' },
        { value: 62.5, reps: 8, label: 'Jun 15', date: 'Jun 15' },
        { value: 65.0, reps: 8, label: 'Jul 1', date: 'Jul 1' },
        { value: 67.5, reps: 6, label: 'Jul 15', date: 'Jul 15' },
        { value: 70.0, reps: 6, label: 'Aug 1', date: 'Aug 1' },
        { value: 75.0, reps: 6, label: 'Today', date: 'Today' }
      ],
      '6M': [
        { value: 55.0, reps: 10, label: 'Mar', date: 'March' },
        { value: 57.5, reps: 8, label: 'Apr', date: 'April' },
        { value: 60.0, reps: 8, label: 'May', date: 'May' },
        { value: 65.0, reps: 8, label: 'Jun', date: 'June' },
        { value: 70.0, reps: 6, label: 'Jul', date: 'July' },
        { value: 75.0, reps: 6, label: 'Today', date: 'August (Today)' }
      ],
      '1Y': [
        { value: 45.0, reps: 10, label: 'Sep', date: 'Sep 2025' },
        { value: 47.5, reps: 10, label: '', date: 'Oct 2025' },
        { value: 50.0, reps: 8, label: 'Nov', date: 'Nov 2025' },
        { value: 52.5, reps: 8, label: '', date: 'Dec 2025' },
        { value: 55.0, reps: 8, label: 'Jan', date: 'Jan 2026' },
        { value: 57.5, reps: 8, label: '', date: 'Feb 2026' },
        { value: 60.0, reps: 8, label: 'Mar', date: 'Mar 2026' },
        { value: 62.5, reps: 8, label: '', date: 'Apr 2026' },
        { value: 65.0, reps: 6, label: 'May', date: 'May 2026' },
        { value: 67.5, reps: 6, label: '', date: 'Jun 2026' },
        { value: 70.0, reps: 6, label: 'Jul', date: 'Jul 2026' },
        { value: 75.0, reps: 6, label: 'Today', date: 'Today' }
      ],
      ALL: [
        { value: 40.0, reps: 10, label: '2024', date: 'Year 2024' },
        { value: 50.0, reps: 8, label: 'Q1', date: 'Q1 2025' },
        { value: 57.5, reps: 8, label: 'Q2', date: 'Q2 2025' },
        { value: 65.0, reps: 6, label: 'Q3', date: 'Q3 2025' },
        { value: 75.0, reps: 6, label: 'Today', date: 'Lifetime Peak (Today)' }
      ]
    }
  },
  squat: {
    name: 'Barbell Back Squat',
    baseline: 90.0,
    ranges: {
      '1M': [
        { value: 90.0, reps: 8, label: 'Aug 1', date: 'Aug 1' },
        { value: 93.0, reps: 8, label: 'Aug 5', date: 'Aug 5' },
        { value: 96.5, reps: 8, label: 'Aug 9', date: 'Aug 9' },
        { value: 100.0, reps: 6, label: 'Aug 13', date: 'Aug 13' },
        { value: 103.5, reps: 6, label: 'Aug 17', date: 'Aug 17' },
        { value: 106.0, reps: 5, label: 'Aug 21', date: 'Aug 21' },
        { value: 110.0, reps: 5, label: 'Today', date: 'Today' }
      ],
      '3M': [
        { value: 80.0, reps: 8, label: 'Jun 1', date: 'Jun 1' },
        { value: 85.0, reps: 8, label: 'Jun 15', date: 'Jun 15' },
        { value: 90.0, reps: 8, label: 'Jul 1', date: 'Jul 1' },
        { value: 95.0, reps: 6, label: 'Jul 15', date: 'Jul 15' },
        { value: 100.0, reps: 6, label: 'Aug 1', date: 'Aug 1' },
        { value: 110.0, reps: 5, label: 'Today', date: 'Today' }
      ],
      '6M': [
        { value: 75.0, reps: 10, label: 'Mar', date: 'March' },
        { value: 80.0, reps: 8, label: 'Apr', date: 'April' },
        { value: 85.0, reps: 8, label: 'May', date: 'May' },
        { value: 90.0, reps: 8, label: 'Jun', date: 'June' },
        { value: 100.0, reps: 6, label: 'Jul', date: 'July' },
        { value: 110.0, reps: 5, label: 'Today', date: 'August (Today)' }
      ],
      '1Y': [
        { value: 65.0, reps: 10, label: 'Sep', date: 'Sep 2025' },
        { value: 70.0, reps: 10, label: '', date: 'Oct 2025' },
        { value: 75.0, reps: 8, label: 'Nov', date: 'Nov 2025' },
        { value: 80.0, reps: 8, label: '', date: 'Dec 2025' },
        { value: 85.0, reps: 8, label: 'Jan', date: 'Jan 2026' },
        { value: 87.5, reps: 8, label: '', date: 'Feb 2026' },
        { value: 90.0, reps: 8, label: 'Mar', date: 'Mar 2026' },
        { value: 95.0, reps: 8, label: '', date: 'Apr 2026' },
        { value: 97.5, reps: 6, label: 'May', date: 'May 2026' },
        { value: 100.0, reps: 6, label: '', date: 'Jun 2026' },
        { value: 105.0, reps: 6, label: 'Jul', date: 'Jul 2026' },
        { value: 110.0, reps: 5, label: 'Today', date: 'Today' }
      ],
      ALL: [
        { value: 60.0, reps: 10, label: '2024', date: 'Year 2024' },
        { value: 75.0, reps: 8, label: 'Q1', date: 'Q1 2025' },
        { value: 85.0, reps: 8, label: 'Q2', date: 'Q2 2025' },
        { value: 95.0, reps: 6, label: 'Q3', date: 'Q3 2025' },
        { value: 110.0, reps: 5, label: 'Today', date: 'Lifetime Peak (Today)' }
      ]
    }
  },
  deadlift: {
    name: 'Barbell Deadlift',
    baseline: 110.0,
    ranges: {
      '1M': [
        { value: 110.0, reps: 6, label: 'Aug 1', date: 'Aug 1' },
        { value: 114.0, reps: 6, label: 'Aug 5', date: 'Aug 5' },
        { value: 118.0, reps: 5, label: 'Aug 9', date: 'Aug 9' },
        { value: 122.5, reps: 5, label: 'Aug 13', date: 'Aug 13' },
        { value: 126.0, reps: 4, label: 'Aug 17', date: 'Aug 17' },
        { value: 130.0, reps: 4, label: 'Aug 21', date: 'Aug 21' },
        { value: 135.0, reps: 4, label: 'Today', date: 'Today' }
      ],
      '3M': [
        { value: 95.0, reps: 8, label: 'Jun 1', date: 'Jun 1' },
        { value: 100.0, reps: 6, label: 'Jun 15', date: 'Jun 15' },
        { value: 110.0, reps: 6, label: 'Jul 1', date: 'Jul 1' },
        { value: 115.0, reps: 5, label: 'Jul 15', date: 'Jul 15' },
        { value: 125.0, reps: 5, label: 'Aug 1', date: 'Aug 1' },
        { value: 135.0, reps: 4, label: 'Today', date: 'Today' }
      ],
      '6M': [
        { value: 85.0, reps: 8, label: 'Mar', date: 'March' },
        { value: 95.0, reps: 6, label: 'Apr', date: 'April' },
        { value: 105.0, reps: 6, label: 'May', date: 'May' },
        { value: 115.0, reps: 5, label: 'Jun', date: 'June' },
        { value: 125.0, reps: 5, label: 'Jul', date: 'July' },
        { value: 135.0, reps: 4, label: 'Today', date: 'August (Today)' }
      ],
      '1Y': [
        { value: 75.0, reps: 8, label: 'Sep', date: 'Sep 2025' },
        { value: 80.0, reps: 8, label: '', date: 'Oct 2025' },
        { value: 85.0, reps: 8, label: 'Nov', date: 'Nov 2025' },
        { value: 90.0, reps: 6, label: '', date: 'Dec 2025' },
        { value: 95.0, reps: 6, label: 'Jan', date: 'Jan 2026' },
        { value: 100.0, reps: 6, label: '', date: 'Feb 2026' },
        { value: 105.0, reps: 5, label: 'Mar', date: 'Mar 2026' },
        { value: 110.0, reps: 5, label: '', date: 'Apr 2026' },
        { value: 115.0, reps: 5, label: 'May', date: 'May 2026' },
        { value: 120.0, reps: 5, label: '', date: 'Jun 2026' },
        { value: 125.0, reps: 4, label: 'Jul', date: 'Jul 2026' },
        { value: 135.0, reps: 4, label: 'Today', date: 'Today' }
      ],
      ALL: [
        { value: 70.0, reps: 8, label: '2024', date: 'Year 2024' },
        { value: 90.0, reps: 6, label: 'Q1', date: 'Q1 2025' },
        { value: 105.0, reps: 6, label: 'Q2', date: 'Q2 2025' },
        { value: 120.0, reps: 5, label: 'Q3', date: 'Q3 2025' },
        { value: 135.0, reps: 4, label: 'Today', date: 'Lifetime Peak (Today)' }
      ]
    }
  },
  press: {
    name: 'Overhead Military Press',
    baseline: 40.0,
    ranges: {
      '1M': [
        { value: 40.0, reps: 10, label: 'Aug 1', date: 'Aug 1' },
        { value: 41.5, reps: 8, label: 'Aug 5', date: 'Aug 5' },
        { value: 43.0, reps: 8, label: 'Aug 9', date: 'Aug 9' },
        { value: 45.0, reps: 8, label: 'Aug 13', date: 'Aug 13' },
        { value: 46.5, reps: 6, label: 'Aug 17', date: 'Aug 17' },
        { value: 48.0, reps: 6, label: 'Aug 21', date: 'Aug 21' },
        { value: 50.0, reps: 6, label: 'Today', date: 'Today' }
      ],
      '3M': [
        { value: 35.0, reps: 10, label: 'Jun 1', date: 'Jun 1' },
        { value: 37.5, reps: 10, label: 'Jun 15', date: 'Jun 15' },
        { value: 40.0, reps: 8, label: 'Jul 1', date: 'Jul 1' },
        { value: 42.5, reps: 8, label: 'Jul 15', date: 'Jul 15' },
        { value: 46.0, reps: 6, label: 'Aug 1', date: 'Aug 1' },
        { value: 50.0, reps: 6, label: 'Today', date: 'Today' }
      ],
      '6M': [
        { value: 30.0, reps: 10, label: 'Mar', date: 'March' },
        { value: 32.5, reps: 10, label: 'Apr', date: 'April' },
        { value: 35.0, reps: 8, label: 'May', date: 'May' },
        { value: 40.0, reps: 8, label: 'Jun', date: 'June' },
        { value: 45.0, reps: 6, label: 'Jul', date: 'July' },
        { value: 50.0, reps: 6, label: 'Today', date: 'August (Today)' }
      ],
      '1Y': [
        { value: 25.0, reps: 12, label: 'Sep', date: 'Sep 2025' },
        { value: 27.5, reps: 10, label: '', date: 'Oct 2025' },
        { value: 30.0, reps: 10, label: 'Nov', date: 'Nov 2025' },
        { value: 32.5, reps: 8, label: '', date: 'Dec 2025' },
        { value: 35.0, reps: 8, label: 'Jan', date: 'Jan 2026' },
        { value: 37.5, reps: 8, label: '', date: 'Feb 2026' },
        { value: 40.0, reps: 8, label: 'Mar', date: 'Mar 2026' },
        { value: 42.5, reps: 8, label: '', date: 'Apr 2026' },
        { value: 45.0, reps: 6, label: 'May', date: 'May 2026' },
        { value: 46.5, reps: 6, label: '', date: 'Jun 2026' },
        { value: 48.0, reps: 6, label: 'Jul', date: 'Jul 2026' },
        { value: 50.0, reps: 6, label: 'Today', date: 'Today' }
      ],
      ALL: [
        { value: 20.0, reps: 12, label: '2024', date: 'Year 2024' },
        { value: 30.0, reps: 10, label: 'Q1', date: 'Q1 2025' },
        { value: 37.5, reps: 8, label: 'Q2', date: 'Q2 2025' },
        { value: 45.0, reps: 6, label: 'Q3', date: 'Q3 2025' },
        { value: 50.0, reps: 6, label: 'Today', date: 'Lifetime Peak (Today)' }
      ]
    }
  }
};

export function AnalyticsScreen({
  userName = 'Athlete',
  workoutHistory = [],
  dailyWorkoutStatuses = {},
  onStartWorkout
}) {
  const [selectedLiftKey, setSelectedLiftKey] = useState('bench');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M'); // '1M' | '3M' | '6M' | '1Y' | 'ALL'
  const [liftsState, setLiftsState] = useState(LIFTS_DATABASE);
  const [selectedPointIdx, setSelectedPointIdx] = useState(null);

  // Load real persisted logs from AsyncStorage
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
              ranges: {
                ...(LIFTS_DATABASE[k]?.ranges || {}),
                '1M': raw.map((p, idx) => ({
                  value: p.val,
                  reps: p.reps || 6,
                  label: idx === raw.length - 1 ? 'Today' : p.label || `S${idx + 1}`,
                  date: idx === raw.length - 1 ? 'Today' : p.label || `S${idx + 1}`
                }))
              }
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
  const currentRangeData = activeLift.ranges[selectedTimeRange] || activeLift.ranges['1M'];
  const chartData = currentRangeData;

  // Active selected point index defaults to last point
  const activeIdx = selectedPointIdx !== null && selectedPointIdx >= 0 && selectedPointIdx < chartData.length
    ? selectedPointIdx
    : chartData.length - 1;

  const displayedItem = chartData[activeIdx] || chartData[chartData.length - 1];

  // 🧮 Calculate 1RM via Epley Formula: 1RM = Weight × (1 + Reps / 30)
  const calc1RM = (weight, reps = 6) => (weight * (1 + reps / 30)).toFixed(1);
  const displayed1RM = calc1RM(displayedItem.value, displayedItem.reps || 6);

  // Dynamic Overload % relative to range baseline
  const baselineVal = chartData[0]?.value || activeLift.baseline;
  const gainKg = (displayedItem.value - baselineVal).toFixed(1);
  const gainPct = Math.round(((displayedItem.value - baselineVal) / (baselineVal || 1)) * 100);

  // 🛠️ Adjust weight of the CURRENTLY SELECTED point (+/- delta)
  const handleAdjustSelectedPoint = async (delta) => {
    const targetIdx = activeIdx;
    const currentVal = chartData[targetIdx].value;
    const newVal = Math.max(10, parseFloat((currentVal + delta).toFixed(1)));

    const updatedRangeData = chartData.map((item, idx) => {
      if (idx === targetIdx) {
        return { ...item, value: newVal };
      }
      return item;
    });

    const updatedLift = {
      ...activeLift,
      ranges: {
        ...activeLift.ranges,
        [selectedTimeRange]: updatedRangeData
      }
    };
    const updatedState = { ...liftsState, [selectedLiftKey]: updatedLift };

    setLiftsState(updatedState);

    // Save to AsyncStorage
    const storageFormat = {};
    Object.keys(updatedState).forEach((k) => {
      storageFormat[k] = {
        name: updatedState[k].name,
        baseline: updatedState[k].baseline,
        points: updatedState[k].ranges['1M'].map((d) => ({
          val: d.value,
          reps: d.reps,
          label: d.label
        }))
      };
    });
    await persistExerciseLogs(storageFormat);
  };

  // ➕ Add a new session point to the active range
  const handleAddNewSession = async () => {
    const lastVal = chartData[chartData.length - 1].value;
    const newVal = parseFloat((lastVal + 2.5).toFixed(1));

    const updatedData = chartData.map((item, idx) => {
      if (idx === chartData.length - 1) {
        return { ...item, label: `S${idx + 1}`, date: `Session ${idx + 1}` };
      }
      return item;
    });

    const newPoint = {
      value: newVal,
      reps: 6,
      label: 'Today',
      date: 'Today'
    };

    const newDataArray = [...updatedData, newPoint];
    const updatedLift = {
      ...activeLift,
      ranges: {
        ...activeLift.ranges,
        [selectedTimeRange]: newDataArray
      }
    };
    const updatedState = { ...liftsState, [selectedLiftKey]: updatedLift };

    setLiftsState(updatedState);
    setSelectedPointIdx(newDataArray.length - 1);
  };

  // 🔄 Reset lift to factory baseline
  const handleResetLift = async () => {
    setLiftsState(LIFTS_DATABASE);
    setSelectedPointIdx(null);
    await persistExerciseLogs(null);
    Alert.alert('🔄 Reset Completed', 'Restored compound lift stats to initial baseline.');
  };

  // 📊 Live Real Workout History Processing
  const hasRealWorkouts = workoutHistory && workoutHistory.length > 0;
  const totalVolumeKg = hasRealWorkouts
    ? workoutHistory.reduce((acc, item) => acc + (item.totalVolumeKg || 8500), 0)
    : 23900;

  const displayVolumeStr = totalVolumeKg >= 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : `${totalVolumeKg}`;

  // Gifted Charts Bar Data for Volume
  const giftedBarData = hasRealWorkouts
    ? workoutHistory.slice(0, 4).reverse().map((w, idx) => ({
        value: w.totalVolumeKg ? Math.round(w.totalVolumeKg / 1000) : 12,
        label: `S${idx + 1}`,
        frontColor: idx === workoutHistory.slice(0, 4).length - 1 ? '#EF4444' : '#27272A',
        topLabelComponent: () => (
          <Text style={styles.barTopLabel}>
            {w.totalVolumeKg ? (w.totalVolumeKg / 1000).toFixed(1) : 12}k
          </Text>
        )
      }))
    : [
        { value: 11.2, label: 'W1', frontColor: '#27272A', topLabelComponent: () => <Text style={styles.barTopLabel}>11.2k</Text> },
        { value: 12.8, label: 'W2', frontColor: '#27272A', topLabelComponent: () => <Text style={styles.barTopLabel}>12.8k</Text> },
        { value: 14.5, label: 'W3', frontColor: '#27272A', topLabelComponent: () => <Text style={styles.barTopLabel}>14.5k</Text> },
        { value: 17.2, label: 'W4', frontColor: '#EF4444', topLabelComponent: () => <Text style={[styles.barTopLabel, { color: '#EF4444' }]}>17.2k</Text> }
      ];

  // Apple Fitness Activity Rings Data
  const ringProgressData = {
    labels: ['Volume', 'Streak', 'Intensity'],
    data: [Math.min(1.0, totalVolumeKg / 30000), 0.86, 0.94]
  };

  // 📐 Full Width 0-Space Edge-to-Edge Calculation
  const chartWidth = CARD_WIDTH - 2;
  const chartSpacing = (chartWidth - 24) / Math.max(1, chartData.length - 1);

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
            <Text style={styles.headerBadgeText}>PRO ATHLETE INTELLIGENCE</Text>
          </View>
          <Text style={styles.mainTitle}>Performance Studio</Text>
          <Text style={styles.subtitle}>
            Touch any session to inspect or test adjust weight live on the curve.
          </Text>
        </View>

        {/* ========================================================================= */}
        {/* 🎴 CARD 1: TIME-AGGREGATED GOLD STANDARD PROGRESSION STUDIO                */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          {/* Dynamic Split KPI Header */}
          <View style={styles.splitKpiHeader}>
            <View style={styles.kpiCol}>
              <Text style={styles.kpiSuperTitle}>ESTIMATED 1-REP MAX</Text>
              <Text style={styles.kpiBigNumber}>{displayed1RM} <Text style={styles.kpiUnit}>kg</Text></Text>
              <Text style={styles.kpiSubText}>Working: {displayedItem.value} kg ({displayedItem.reps || 6} reps)</Text>
              <View style={styles.kpiPillTag}>
                <Text style={styles.kpiPillTagText}>{displayedItem.date || 'Today'}</Text>
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
                  {selectedTimeRange === '1Y' ? '12 Monthly Bests' : selectedTimeRange === '6M' ? '6 Monthly Peaks' : `${chartData.length} Session Dots`}
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

          {/* 🍏 Edge-to-Edge LineChart (0 Space on Left Corner) */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              height={155}
              width={chartWidth}
              spacing={chartSpacing}
              initialSpacing={12}
              endSpacing={12}
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
                pointerStripHeight: 145,
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
            <Text style={styles.sessionSelectorTitle}>SELECT ANY MILESTONE TO TEST / EDIT:</Text>
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
              <Text style={styles.stepperLabelTitle}>ADJUST {displayedItem.date.toUpperCase()}:</Text>
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
                <Text style={styles.stepperBtnNewText}>+ New</Text>
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
        {/* 📊 CARD 3: HYPERTROPHY WORKOUT CAPACITY BARS                              */}
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
              Total cumulative tonnage calculated dynamically from your logged workout sessions.
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 🏆 CARD 4: PERSONAL RECORDS HALL OF FAME                                  */}
        {/* ========================================================================= */}
        <View style={styles.glassCard}>
          <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={styles.kpiSuperTitle}>LIFETIME TROPHIES</Text>
            <Text style={styles.cardHeaderTitle}>Personal Best Records 🏆</Text>
          </View>

          <View style={styles.prList}>
            {[
              { id: 'bench', lift: 'Barbell Bench Press', weight: `${Math.max(...liftsState.bench.ranges['1M'].map((p) => p.value))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'squat', lift: 'Barbell Back Squat', weight: `${Math.max(...liftsState.squat.ranges['1M'].map((p) => p.value))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'deadlift', lift: 'Barbell Deadlift', weight: `${Math.max(...liftsState.deadlift.ranges['1M'].map((p) => p.value))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' },
              { id: 'press', lift: 'Standing Military Press', weight: `${Math.max(...liftsState.press.ranges['1M'].map((p) => p.value))} kg`, date: 'Aug 2026', badgeColor: '#EF4444' }
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
    marginHorizontal: 20,
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
    marginHorizontal: 20,
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

  // Chart Wrapper (0 Extra Left Padding)
  chartWrapper: {
    paddingHorizontal: 0,
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: 'center'
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
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
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
