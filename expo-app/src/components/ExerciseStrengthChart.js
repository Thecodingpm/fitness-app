import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Award, Zap, Calendar } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 📊 Realistic Exercise Progression Datasets (Sample Historical Progression)
const PROGRESSION_DATA_MAP = {
  '1M': [
    { value: 65, label: 'Aug 1', date: 'Aug 1', oneRepMax: '76kg', dataPointText: '' },
    { value: 67.5, label: 'Aug 7', date: 'Aug 7', oneRepMax: '79kg', dataPointText: '' },
    { value: 70, label: 'Aug 14', date: 'Aug 14', oneRepMax: '82kg', dataPointText: '' },
    { value: 72.5, label: 'Aug 21', date: 'Aug 21', oneRepMax: '85kg', dataPointText: '' },
    { value: 75, label: 'Today', date: 'Today', oneRepMax: '88kg', dataPointText: '75kg' }
  ],
  '3M': [
    { value: 55, label: 'Jun', date: 'Jun 1', oneRepMax: '64kg' },
    { value: 60, label: 'Jun 15', date: 'Jun 15', oneRepMax: '70kg' },
    { value: 62.5, label: 'Jul 1', date: 'Jul 1', oneRepMax: '73kg' },
    { value: 65, label: 'Jul 15', date: 'Jul 15', oneRepMax: '76kg' },
    { value: 70, label: 'Aug 1', date: 'Aug 1', oneRepMax: '82kg' },
    { value: 75, label: 'Today', date: 'Today', oneRepMax: '88kg' }
  ],
  '6M': [
    { value: 45, label: 'Mar', date: 'Mar 1', oneRepMax: '53kg' },
    { value: 52.5, label: 'Apr', date: 'Apr 1', oneRepMax: '61kg' },
    { value: 60, label: 'May', date: 'May 1', oneRepMax: '70kg' },
    { value: 65, label: 'Jun', date: 'Jun 1', oneRepMax: '76kg' },
    { value: 70, label: 'Jul', date: 'Jul 1', oneRepMax: '82kg' },
    { value: 75, label: 'Today', date: 'Aug 27', oneRepMax: '88kg' }
  ],
  'ALL': [
    { value: 40, label: 'Jan', date: 'Jan 2026', oneRepMax: '47kg' },
    { value: 50, label: 'Mar', date: 'Mar 2026', oneRepMax: '58kg' },
    { value: 60, label: 'May', date: 'May 2026', oneRepMax: '70kg' },
    { value: 70, label: 'Jul', date: 'Jul 2026', oneRepMax: '82kg' },
    { value: 75, label: 'Now', date: 'Aug 2026', oneRepMax: '88kg' }
  ]
};

export function ExerciseStrengthChart({ exerciseName = 'Barbell Bench Press', unit = 'kg' }) {
  const [selectedRange, setSelectedRange] = useState('1M');
  const chartData = PROGRESSION_DATA_MAP[selectedRange] || PROGRESSION_DATA_MAP['1M'];

  const currentWeight = chartData[chartData.length - 1]?.value || 75;
  const initialWeight = chartData[0]?.value || 60;
  const growthPercentage = Math.round(((currentWeight - initialWeight) / initialWeight) * 100);
  const estimated1RM = chartData[chartData.length - 1]?.oneRepMax || '88kg';

  return (
    <View style={styles.container}>
      {/* Header Metric Cards */}
      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <View style={styles.metricIconRow}>
            <TrendingUp size={14} color="#EF4444" style={{ marginRight: 4 }} />
            <Text style={styles.metricLabel}>CURRENT WEIGHT</Text>
          </View>
          <Text style={styles.metricValue}>
            {currentWeight} <Text style={styles.metricUnit}>{unit}</Text>
          </Text>
          <View style={styles.growthBadge}>
            <Text style={styles.growthText}>+{growthPercentage}% OVERLOAD</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIconRow}>
            <Award size={14} color="#FBBF24" style={{ marginRight: 4 }} />
            <Text style={styles.metricLabel}>ESTIMATED 1RM</Text>
          </View>
          <Text style={styles.metricValue}>{estimated1RM}</Text>
          <Text style={styles.subtext}>Based on 8 reps @ {currentWeight}{unit}</Text>
        </View>
      </View>

      {/* Range Selector Chips */}
      <View style={styles.rangeSelectorContainer}>
        {['1M', '3M', '6M', 'ALL'].map((range) => {
          const isActive = selectedRange === range;
          return (
            <TouchableOpacity
              key={range}
              style={[styles.rangeChip, isActive && styles.rangeChipActive]}
              onPress={() => setSelectedRange(range)}
              activeOpacity={0.8}
            >
              <Text style={[styles.rangeChipText, isActive && styles.rangeChipTextActive]}>
                {range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 📈 60FPS Interactive Gifted Chart */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={SCREEN_WIDTH - 80}
          height={180}
          color="#DC2626"
          thickness={3.5}
          curved
          isAnimated
          animationDuration={800}
          startFillColor="rgba(220, 38, 38, 0.4)"
          endFillColor="rgba(220, 38, 38, 0.0)"
          startOpacity={0.9}
          endOpacity={0.0}
          areaChart
          noOfSections={4}
          yAxisColor="transparent"
          xAxisColor="#27272A"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          hideRules
          dataPointsColor="#FFFFFF"
          dataPointsRadius={4}
          dataPointsWidth={3}
          textColor="#FFFFFF"
          textFontSize={11}
          textShiftY={-8}
          textShiftX={-4}
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: '#EF4444',
            pointerStripWidth: 2,
            pointerColor: '#FFFFFF',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 50,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items) => {
              const item = items[0];
              if (!item) return null;
              return (
                <View style={styles.tooltipContainer}>
                  <Text style={styles.tooltipWeight}>{item.value} {unit}</Text>
                  <Text style={styles.tooltipSub}>1RM ~ {item.oneRepMax || `${Math.round(item.value * 1.18)}kg`}</Text>
                </View>
              );
            }
          }}
        />
      </View>

      {/* Graph Footer Caption */}
      <View style={styles.footerRow}>
        <Zap size={12} color="#71717A" style={{ marginRight: 5 }} />
        <Text style={styles.footerText}>
          Touch and scrub across the chart to view historical sets & 1RM
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141416',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 16,
    marginVertical: 14
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1C1C20',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  metricLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  metricUnit: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '700'
  },
  growthBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  growthText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800'
  },
  subtext: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4
  },
  rangeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C20',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16
  },
  rangeChip: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8
  },
  rangeChipActive: {
    backgroundColor: '#DC2626'
  },
  rangeChipText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  rangeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    overflow: 'hidden'
  },
  axisText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },
  tooltipContainer: {
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6
  },
  tooltipWeight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  tooltipSub: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700'
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  footerText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  }
});
