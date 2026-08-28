import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { TrendingUp, Award, Zap } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 📊 Realistic Exercise Progression Datasets (Sample Historical Progression)
const PROGRESSION_DATA_MAP = {
  '1M': [
    { value: 65, label: 'Aug 1', date: 'Aug 1', oneRepMax: '76kg' },
    { value: 67.5, label: 'Aug 7', date: 'Aug 7', oneRepMax: '79kg' },
    { value: 70, label: 'Aug 14', date: 'Aug 14', oneRepMax: '82kg' },
    { value: 72.5, label: 'Aug 21', date: 'Aug 21', oneRepMax: '85kg' },
    { value: 75, label: 'Today', date: 'Today', oneRepMax: '88kg' }
  ],
  '3M': [
    { value: 55, label: 'Jun 1', date: 'Jun 1', oneRepMax: '64kg' },
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
  const [selectedPointIdx, setSelectedPointIdx] = useState(chartData.length - 1);

  const currentWeight = chartData[chartData.length - 1]?.value || 75;
  const initialWeight = chartData[0]?.value || 60;
  const growthPercentage = Math.round(((currentWeight - initialWeight) / initialWeight) * 100);
  const estimated1RM = chartData[chartData.length - 1]?.oneRepMax || '88kg';

  // SVG dimensions
  const svgWidth = Math.max(SCREEN_WIDTH - 80, 240);
  const svgHeight = 130;
  const paddingX = 20;
  const paddingY = 16;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const minVal = Math.min(...chartData.map(d => d.value));
  const maxVal = Math.max(...chartData.map(d => d.value));
  const valRange = maxVal - minVal || 1;

  const points = chartData.map((d, idx) => {
    const x = paddingX + (idx / (chartData.length - 1)) * innerWidth;
    const y = svgHeight - paddingY - ((d.value - minVal) / valRange) * innerHeight;
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cx1 = (prev.x + pt.x) / 2;
    const cy1 = prev.y;
    const cx2 = (prev.x + pt.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  const selectedPt = points[selectedPointIdx] || points[points.length - 1];

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
              onPress={() => {
                setSelectedRange(range);
                setSelectedPointIdx((PROGRESSION_DATA_MAP[range] || []).length - 1);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.rangeChipText, isActive && styles.rangeChipTextActive]}>
                {range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Native SVG Chart Area */}
      <View style={styles.chartWrapper}>
        {/* Selected Data Point Tooltip */}
        <View style={styles.activeTooltipRow}>
          <Text style={styles.tooltipWeightText}>{selectedPt.value} {unit}</Text>
          <Text style={styles.tooltipDateText}>• {selectedPt.label}</Text>
        </View>

        <Svg width={svgWidth} height={svgHeight} style={{ overflow: 'visible' }}>
          <Defs>
            <SvgLinearGradient id="strengthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
            </SvgLinearGradient>
          </Defs>

          {/* Area Fill */}
          <Path d={areaPath} fill="url(#strengthGradient)" />

          {/* Curved Line */}
          <Path d={linePath} stroke="#DC2626" strokeWidth={3} fill="none" />

          {/* Dots */}
          {points.map((pt, idx) => {
            const isSelected = selectedPointIdx === idx;
            return (
              <Circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6 : 3.5}
                fill={isSelected ? '#FFFFFF' : '#EF4444'}
                stroke={isSelected ? '#EF4444' : '#09090B'}
                strokeWidth={isSelected ? 2.5 : 1}
              />
            );
          })}
        </Svg>

        {/* X-Axis Date Labels */}
        <View style={styles.xAxisRow}>
          {points.map((pt, idx) => {
            const isSelected = selectedPointIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedPointIdx(idx)}
                style={styles.xAxisCol}
                activeOpacity={0.7}
              >
                <Text style={[styles.axisLabel, isSelected && styles.axisLabelActive]}>
                  {pt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Chart Footer Tip */}
      <View style={styles.chartFooter}>
        <Zap size={12} color="#71717A" style={{ marginRight: 6 }} />
        <Text style={styles.chartFooterText}>
          Overload progression tracked via Progressive Resistance Engine
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121214',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 16
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  metricLabel: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A1A1AA'
  },
  growthBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  growthText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800'
  },
  subtext: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500'
  },
  rangeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    gap: 4
  },
  rangeChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center'
  },
  rangeChipActive: {
    backgroundColor: '#DC2626'
  },
  rangeChipText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  rangeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 6
  },
  activeTooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC2626',
    marginBottom: 6
  },
  tooltipWeightText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  tooltipDateText: {
    color: '#A1A1AA',
    fontSize: 11,
    marginLeft: 4
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 6
  },
  xAxisCol: {
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4
  },
  axisLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  },
  axisLabelActive: {
    color: '#EF4444',
    fontWeight: '800'
  },
  chartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)'
  },
  chartFooterText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
    flex: 1
  }
});
