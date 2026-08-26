import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, X, Trophy, Calendar } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 📅 Standard 8-Week Training Program (7 Days per week)
const TOTAL_WEEKS = 8;
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

export function ConsistencyScreen({
  programName = 'Hypertrophy',
  workoutHistory = [],
  onBack
}) {
  // ⚡ Manual User Toggles state: map of `${weekNum}_${dayNum}` -> 'completed' | 'missed' | 'upcoming'
  const [manualCellStatus, setManualCellStatus] = useState({
    // Week 1 (7/7 Completed -> Trophy!)
    '1_1': 'completed',
    '1_2': 'completed',
    '1_3': 'completed',
    '1_4': 'completed',
    '1_5': 'completed',
    '1_6': 'completed',
    '1_7': 'completed',

    // Week 2 (7/7 Completed -> Trophy!)
    '2_1': 'completed',
    '2_2': 'completed',
    '2_3': 'completed',
    '2_4': 'completed',
    '2_5': 'completed',
    '2_6': 'completed',
    '2_7': 'completed',

    // Week 3 (6 completed, 1 missed)
    '3_1': 'completed',
    '3_2': 'completed',
    '3_3': 'completed',
    '3_4': 'completed',
    '3_5': 'missed',
    '3_6': 'completed',
    '3_7': 'completed',

    // Week 4 (Current)
    '4_1': 'completed',
    '4_2': 'completed',
    '4_3': 'completed',
    '4_4': 'completed',
    '4_5': 'upcoming',
    '4_6': 'upcoming',
    '4_7': 'upcoming'
  });

  // 👆 Interactive toggle handler on cell click
  const handleToggleCell = (weekNum, dayNum) => {
    const key = `${weekNum}_${dayNum}`;
    const current = manualCellStatus[key] || 'upcoming';

    let nextStatus = 'completed';
    if (current === 'completed') {
      nextStatus = 'missed';
    } else if (current === 'missed') {
      nextStatus = 'upcoming';
    } else {
      nextStatus = 'completed';
    }

    setManualCellStatus((prev) => ({
      ...prev,
      [key]: nextStatus
    }));
  };

  // 📊 Calculate Dynamic Weekly & Daily Completion Data
  const {
    gridData,
    overallPercent,
    completedTotal,
    totalScheduled,
    startDateStr,
    endDateStr
  } = useMemo(() => {
    const now = new Date();
    const programStart = new Date(now);
    programStart.setDate(now.getDate() - 25);
    programStart.setHours(0, 0, 0, 0);

    const programEnd = new Date(programStart);
    programEnd.setDate(programStart.getDate() + TOTAL_WEEKS * 7);

    const formatShortDate = (d) => {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    let completedCount = 0;
    const weeks = [];

    for (let w = 0; w < TOTAL_WEEKS; w++) {
      const weekDays = [];
      let weekCompletedDays = 0;

      for (let d = 0; d < DAYS_PER_WEEK; d++) {
        const weekNum = w + 1;
        const dayNum = d + 1;
        const key = `${weekNum}_${dayNum}`;

        const dayDate = new Date(programStart);
        dayDate.setDate(programStart.getDate() + (w * 7 + d));

        const status = manualCellStatus[key] || 'upcoming';

        if (status === 'completed') {
          completedCount++;
          weekCompletedDays++;
        }

        weekDays.push({
          dayNum,
          status,
          dateStr: formatShortDate(dayDate)
        });
      }

      const isWeekFullyCompleted = weekCompletedDays === DAYS_PER_WEEK;

      weeks.push({
        weekNum: w + 1,
        days: weekDays,
        isFullyCompleted: isWeekFullyCompleted
      });
    }

    const totalDays = TOTAL_WEEKS * DAYS_PER_WEEK;
    const dynamicPercent = Math.round((completedCount / totalDays) * 100);

    return {
      gridData: weeks,
      overallPercent: dynamicPercent,
      completedTotal: completedCount,
      totalScheduled: totalDays,
      startDateStr: formatShortDate(programStart),
      endDateStr: formatShortDate(programEnd)
    };
  }, [manualCellStatus]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Dark Red Gradient Glow at Bottom (Matches LIFT Brand System) */}
      <LinearGradient
        colors={['#000000', '#000000', '#180000', '#3A0000', '#5C0000']}
        locations={[0, 0.42, 0.68, 0.86, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.pageContainer}>
          {/* Top Bar Header */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.topBarTitle}>Consistency</Text>

            <View style={styles.topBarSpacer} />
          </View>

          {/* Main Scroll Content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Program Name & Dynamic Overall Completion Percentage */}
            <View style={styles.programHeaderRow}>
              <View style={styles.programNameCol}>
                <Text style={styles.programNameText}>{programName}</Text>
                <Text style={styles.programSubText}>Tap any box to toggle (✓ / ✕ / empty)</Text>
              </View>

              <View style={styles.percentageCol}>
                <Text style={styles.percentageText}>{overallPercent}% completed</Text>
              </View>
            </View>

            {/* 🗓️ Weekly Tracker 7-Day Grid */}
            <View style={styles.trackerCard}>
              {/* Columns Header (D1, D2, D3, D4, D5, D6, D7) */}
              <View style={styles.gridHeaderRow}>
                <View style={styles.weekLabelSpacer} />
                {DAY_LABELS.map((label, idx) => (
                  <View key={idx} style={styles.dayColHeader}>
                    <Text style={styles.dayColHeaderText}>{label}</Text>
                  </View>
                ))}
              </View>

              {/* Rows (Week 1 through Week 8) */}
              <View style={styles.weeksRowsContainer}>
                {gridData.map((week) => (
                  <View key={week.weekNum} style={styles.weekRow}>
                    {/* Left: Week Label */}
                    <View style={styles.weekLabelCol}>
                      <Text style={styles.weekLabelText}>W{week.weekNum}</Text>
                    </View>

                    {/* Right: 7 Interactive Day Cells */}
                    <View style={styles.dayCellsRow}>
                      {week.days.map((day, dIdx) => {
                        const isCompleted = day.status === 'completed';
                        const isMissed = day.status === 'missed';
                        const isUpcoming = day.status === 'upcoming';
                        const showTrophy = week.isFullyCompleted && dIdx === DAYS_PER_WEEK - 1;

                        return (
                          <TouchableOpacity
                            key={day.dayNum}
                            activeOpacity={0.75}
                            onPress={() => handleToggleCell(week.weekNum, day.dayNum)}
                            style={[
                              styles.dayCell,
                              isCompleted && styles.dayCellCompleted,
                              isMissed && styles.dayCellMissed,
                              isUpcoming && styles.dayCellUpcoming
                            ]}
                          >
                            {isCompleted ? (
                              showTrophy ? (
                                <View style={styles.trophyWrapper}>
                                  <Trophy size={15} color="#FFFFFF" />
                                </View>
                              ) : (
                                <Check size={15} color="#FFFFFF" strokeWidth={3} />
                              )
                            ) : isMissed ? (
                              <X size={13} color="#EF4444" strokeWidth={2.8} />
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              {/* Program Timeline Footer */}
              <View style={styles.timelineFooterRow}>
                <View style={styles.timelineItem}>
                  <Calendar size={13} color="#8E8E93" style={{ marginRight: 5 }} />
                  <Text style={styles.timelineText}>Started {startDateStr}</Text>
                </View>

                <View style={styles.timelineItem}>
                  <Calendar size={13} color="#8E8E93" style={{ marginRight: 5 }} />
                  <Text style={styles.timelineText}>Ends on {endDateStr}</Text>
                </View>
              </View>
            </View>

            {/* Micro Trophy Reward Card */}
            <View style={styles.trophyRewardCard}>
              <View style={styles.trophyIconCircle}>
                <Trophy size={20} color="#FBBF24" />
              </View>
              <View style={styles.trophyRewardTextCol}>
                <Text style={styles.trophyRewardTitle}>Weekly Perfection Awards</Text>
                <Text style={styles.trophyRewardSub}>
                  Complete all 7 days in a week to earn a Weekly Trophy.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  pageContainer: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E'
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  topBarSpacer: {
    width: 40,
    height: 40
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90
  },
  programHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
    paddingHorizontal: 4
  },
  programNameCol: {
    flex: 1,
    marginRight: 10
  },
  programNameText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  programSubText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  percentageCol: {
    alignItems: 'flex-end'
  },
  percentageText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '700'
  },
  trackerCard: {
    backgroundColor: '#121214',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 16
  },
  gridHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  weekLabelSpacer: {
    width: 38
  },
  dayColHeader: {
    flex: 1,
    alignItems: 'center'
  },
  dayColHeaderText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800'
  },
  weeksRowsContainer: {
    gap: 8
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  weekLabelCol: {
    width: 38
  },
  weekLabelText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700'
  },
  dayCellsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 5
  },
  dayCell: {
    flex: 1,
    height: 40,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayCellCompleted: {
    backgroundColor: '#15803D',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3
  },
  dayCellMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderWidth: 1,
    borderColor: '#991B1B'
  },
  dayCellUpcoming: {
    backgroundColor: '#1C1C20',
    borderWidth: 1,
    borderColor: '#2A2A30'
  },
  trophyWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  timelineFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#242428',
    paddingHorizontal: 4
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timelineText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500'
  },
  trophyRewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 14
  },
  trophyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)'
  },
  trophyRewardTextCol: {
    flex: 1
  },
  trophyRewardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3
  },
  trophyRewardSub: {
    color: '#8E8E93',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500'
  }
});
