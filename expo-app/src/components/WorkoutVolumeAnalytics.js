import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  Flame,
  Dumbbell,
  Sparkles
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 📊 Weekly Tonnage Data (kg lifted)
const WEEKLY_TONNAGE_DATA = [
  { value: 11200, label: 'W1', display: '11.2k', percent: 65, isHighlight: false },
  { value: 12800, label: 'W2', display: '12.8k', percent: 74, isHighlight: false },
  { value: 14500, label: 'W3', display: '14.5k', percent: 84, isHighlight: false },
  { value: 17200, label: 'W4', display: '17.2k', percent: 100, isHighlight: true }
];

// 🍩 Muscle Volume Distribution Data
const MUSCLE_DISTRIBUTION_DATA = [
  { label: 'Chest (30%)', color: '#DC2626' },
  { label: 'Back & Lats (25%)', color: '#0284C7' },
  { label: 'Legs & Quads (25%)', color: '#F59E0B' },
  { label: 'Shoulders (12%)', color: '#8B5CF6' },
  { label: 'Arms (8%)', color: '#10B981' }
];

export function WorkoutVolumeAnalytics({
  totalVolumeKg = 17200,
  workoutCount = 18,
  streakWeeks = 4
}) {
  const [activeTab, setActiveTab] = useState('volume'); // 'volume' | 'muscles'

  return (
    <View style={styles.container}>
      {/* Header with Title & Tab Switcher */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerSuperTitle}>ANALYTICS & METRICS</Text>
          <Text style={styles.headerMainTitle}>Training Progression</Text>
        </View>

        <View style={styles.tabTogglePill}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'volume' && styles.tabBtnActive]}
            onPress={() => setActiveTab('volume')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabBtnText, activeTab === 'volume' && styles.tabBtnTextActive]}>
              Volume
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'muscles' && styles.tabBtnActive]}
            onPress={() => setActiveTab('muscles')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabBtnText, activeTab === 'muscles' && styles.tabBtnTextActive]}>
              Muscles
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📊 TAB 1: WEEKLY VOLUME TONNAGE BAR CHART */}
      {activeTab === 'volume' ? (
        <View style={styles.cardBody}>
          <View style={styles.volumeStatHeader}>
            <View>
              <Text style={styles.volumeTotalText}>
                {totalVolumeKg.toLocaleString()} <Text style={styles.volumeUnit}>kg</Text>
              </Text>
              <Text style={styles.volumeSubtitle}>Total Weight Moved This Month</Text>
            </View>

            <View style={styles.overloadBadge}>
              <TrendingUp size={13} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={styles.overloadText}>+18.6%</Text>
            </View>
          </View>

          {/* Native Volume Bar Chart */}
          <View style={styles.barChartContainer}>
            {WEEKLY_TONNAGE_DATA.map((bar, idx) => (
              <View key={idx} style={styles.barColumn}>
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
      ) : (
        /* 🍩 TAB 2: MUSCLE VOLUME DISTRIBUTION PIE CHART */
        <View style={styles.cardBody}>
          <View style={styles.pieRow}>
            {/* Donut Chart */}
            <View style={styles.donutContainer}>
              <Svg width={110} height={110} viewBox="0 0 110 110">
                <Circle cx="55" cy="55" r="42" stroke="#1F1F23" strokeWidth="13" fill="none" />
                {/* 30% Chest */}
                <Circle
                  cx="55"
                  cy="55"
                  r="42"
                  stroke="#DC2626"
                  strokeWidth="13"
                  fill="none"
                  strokeDasharray="79.1 184.8"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* 25% Back */}
                <Circle
                  cx="55"
                  cy="55"
                  r="42"
                  stroke="#0284C7"
                  strokeWidth="13"
                  fill="none"
                  strokeDasharray="65.9 198"
                  strokeDashoffset="-79.1"
                  strokeLinecap="round"
                />
                {/* 25% Legs */}
                <Circle
                  cx="55"
                  cy="55"
                  r="42"
                  stroke="#F59E0B"
                  strokeWidth="13"
                  fill="none"
                  strokeDasharray="65.9 198"
                  strokeDashoffset="-145"
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.donutCenterLabel}>
                <Text style={styles.donutCenterNum}>42</Text>
                <Text style={styles.donutCenterSub}>SETS</Text>
              </View>
            </View>

            {/* Muscle Legend */}
            <View style={styles.legendCol}>
              {MUSCLE_DISTRIBUTION_DATA.map((item, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 3 Quick Bottom Highlight Badges */}
      <View style={styles.quickStatsRow}>
        <View style={styles.quickStatBox}>
          <Flame size={14} color="#EF4444" />
          <Text style={styles.quickStatVal}>{streakWeeks} WEEKS</Text>
          <Text style={styles.quickStatLbl}>Active Streak</Text>
        </View>

        <View style={styles.quickStatBox}>
          <Dumbbell size={14} color="#38BDF8" />
          <Text style={styles.quickStatVal}>{workoutCount}</Text>
          <Text style={styles.quickStatLbl}>Workouts</Text>
        </View>

        <View style={styles.quickStatBox}>
          <Sparkles size={14} color="#FBBF24" />
          <Text style={styles.quickStatVal}>94.2%</Text>
          <Text style={styles.quickStatLbl}>Adherence</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141416',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 18,
    marginVertical: 14
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerSuperTitle: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  headerMainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 2
  },
  tabTogglePill: {
    flexDirection: 'row',
    backgroundColor: '#1C1C20',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9
  },
  tabBtnActive: {
    backgroundColor: '#DC2626'
  },
  tabBtnText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  cardBody: {
    backgroundColor: '#1A1A1E',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#27272C'
  },
  volumeStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  volumeTotalText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  volumeUnit: {
    fontSize: 14,
    color: '#A1A1AA',
    fontWeight: '600'
  },
  volumeSubtitle: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2
  },
  overloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  overloadText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800'
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 12
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
    width: 34,
    height: 90,
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
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  donutContainer: {
    position: 'relative',
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center'
  },
  donutCenterLabel: {
    position: 'absolute',
    alignItems: 'center'
  },
  donutCenterNum: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900'
  },
  donutCenterSub: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800'
  },
  legendCol: {
    flex: 1,
    marginLeft: 18,
    gap: 7
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
    fontWeight: '600'
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 8
  },
  quickStatBox: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242428'
  },
  quickStatVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 1
  },
  quickStatLbl: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500'
  }
});
