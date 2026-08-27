import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  Flame,
  Dumbbell,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 📊 Weekly Tonnage Data (kg lifted)
const WEEKLY_TONNAGE_DATA = [
  { value: 11200, label: 'W1', topLabelComponent: () => <Text style={styles.barTopLabel}>11.2k</Text> },
  { value: 12800, label: 'W2', topLabelComponent: () => <Text style={styles.barTopLabel}>12.8k</Text> },
  { value: 14500, label: 'W3', topLabelComponent: () => <Text style={styles.barTopLabel}>14.5k</Text> },
  {
    value: 17200,
    label: 'W4',
    frontColor: '#EF4444',
    topLabelComponent: () => <Text style={[styles.barTopLabel, { color: '#EF4444' }]}>17.2k</Text>
  }
];

// 🍩 Muscle Volume Distribution Data
const MUSCLE_DISTRIBUTION_DATA = [
  { value: 30, color: '#DC2626', text: '30%', focused: true }, // Chest
  { value: 25, color: '#0284C7', text: '25%' },                // Back
  { value: 25, color: '#F59E0B', text: '25%' },                // Legs
  { value: 12, color: '#8B5CF6', text: '12%' },                // Shoulders
  { value: 8, color: '#10B981', text: '8%' }                   // Arms
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

          {/* Bar Chart */}
          <View style={styles.chartWrapper}>
            <BarChart
              data={WEEKLY_TONNAGE_DATA}
              barWidth={36}
              spacing={28}
              roundedTop
              roundedBottom
              radius={8}
              hideRules
              xAxisThickness={1}
              xAxisColor="#27272A"
              yAxisThickness={0}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              frontColor="#B91C1C"
              gradientColor="#DC2626"
              showGradient
              isAnimated
              animationDuration={800}
              height={150}
              width={SCREEN_WIDTH - 90}
            />
          </View>
        </View>
      ) : (
        /* 🍩 TAB 2: MUSCLE VOLUME DISTRIBUTION PIE CHART */
        <View style={styles.cardBody}>
          <View style={styles.pieRow}>
            {/* Donut Chart */}
            <View style={styles.pieWrapper}>
              <PieChart
                data={MUSCLE_DISTRIBUTION_DATA}
                donut
                radius={65}
                innerRadius={45}
                innerCircleColor="#141416"
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>42</Text>
                    <Text style={{ color: '#71717A', fontSize: 9, fontWeight: '700' }}>SETS</Text>
                  </View>
                )}
              />
            </View>

            {/* Muscle Legend */}
            <View style={styles.legendCol}>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendLabel}>Chest (30%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#0284C7' }]} />
                <Text style={styles.legendLabel}>Back & Lats (25%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendLabel}>Legs & Quads (25%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={styles.legendLabel}>Shoulders (12%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Arms (8%)</Text>
              </View>
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
    marginBottom: 14
  },
  volumeStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  volumeTotalText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  volumeUnit: {
    fontSize: 15,
    color: '#71717A',
    fontWeight: '700'
  },
  volumeSubtitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  overloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  overloadText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800'
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4
  },
  barTopLabel: {
    color: '#D4D4D8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },
  axisText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6
  },
  pieWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  legendCol: {
    gap: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  legendLabel: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700'
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#242428',
    paddingTop: 12
  },
  quickStatBox: {
    flex: 1,
    backgroundColor: '#1C1C20',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  quickStatVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4
  },
  quickStatLbl: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2
  }
});
