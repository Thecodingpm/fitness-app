import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Trophy,
  Calendar,
  Zap,
  Flame,
  Award,
  Play,
  Dumbbell,
  Clock,
  Sparkles
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function ConsistencyScreen({
  programName = 'Hypertrophy',
  dailyWorkoutStatuses = {},
  focusedDateKey = null,
  onUpdateDailyStatus,
  onOpenWorkoutRoutine,
  onBack
}) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const todayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

  // Parse focused date if provided from double-tap
  const parsedFocusedYear = focusedDateKey ? parseInt(focusedDateKey.split('-')[0], 10) : currentYear;
  const parsedFocusedMonth = focusedDateKey ? parseInt(focusedDateKey.split('-')[1], 10) - 1 : currentMonth;

  // Period View Mode: 'monthly' | 'yearly'
  const [viewMode, setViewMode] = useState('monthly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  // Navigation state
  const [selectedYear, setSelectedYear] = useState(parsedFocusedYear);
  const [selectedMonth, setSelectedMonth] = useState(parsedFocusedMonth);
  const [activeFocusedKey, setActiveFocusedKey] = useState(focusedDateKey);

  // Confirmation Modal state
  const [pendingCell, setPendingCell] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Clean Single Source of Truth — No fake pre-filled data!
  const activeRecords = dailyWorkoutStatuses || {};

  // 🗓️ Monthly Navigation Handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      if (selectedYear > 2024) {
        setSelectedYear((prev) => prev - 1);
        setSelectedMonth(11);
      }
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedYear === currentYear && selectedMonth >= currentMonth) {
      return;
    }
    if (selectedMonth === 11) {
      if (selectedYear < currentYear) {
        setSelectedYear((prev) => prev + 1);
        setSelectedMonth(0);
      }
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const canGoNextMonth = !(selectedYear === currentYear && selectedMonth >= currentMonth);

  // 🗓️ Yearly Navigation Handlers
  const handlePrevYear = () => {
    if (selectedYear > 2024) {
      setSelectedYear((prev) => prev - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear((prev) => prev + 1);
    }
  };

  // 📊 Calculate Monthly Metrics & Grid Data (Strict Single Source of Truth)
  const monthlyData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    // Monday = 0, Sunday = 6
    const firstDayOfWeek = (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7;

    let completedCount = 0;
    let missedCount = 0;
    let scheduledCount = 0;

    const weeks = [];
    let currentWeekDays = [];

    // Fill leading empty padding days
    for (let p = 0; p < firstDayOfWeek; p++) {
      currentWeekDays.push({ isEmpty: true, id: `pad-${p}` });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cellDate = new Date(selectedYear, selectedMonth, d);
      const isToday = selectedYear === currentYear && selectedMonth === currentMonth && d === currentDay;
      const rawDayOfWeek = cellDate.getDay(); // 0 Sun, 1 Mon...
      const dayOfWeek = (rawDayOfWeek + 6) % 7; // 0 Mon... 6 Sun
      const isScheduled = dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 4;

      const associatedRoutine = WEEKLY_ROUTINES_DB[rawDayOfWeek] || WEEKLY_ROUTINES_DB[0];

      // Explicit status from shared single source of truth
      let status = activeRecords[dateKey] || 'unmarked';

      if (status === 'completed') {
        completedCount++;
        scheduledCount++;
      } else if (status === 'missed') {
        missedCount++;
        scheduledCount++;
      } else if (isScheduled) {
        scheduledCount++;
      }

      currentWeekDays.push({
        isEmpty: false,
        dayNum: d,
        dateKey,
        status,
        isScheduled,
        isToday,
        associatedRoutine
      });

      if (currentWeekDays.length === 7 || d === daysInMonth) {
        while (currentWeekDays.length < 7) {
          currentWeekDays.push({ isEmpty: true, id: `trail-${currentWeekDays.length}` });
        }

        // Calculate if week is fully completed (Trophy earned only if ALL scheduled days are completed)
        const scheduledInWeek = currentWeekDays.filter((c) => !c.isEmpty && c.isScheduled);
        const completedInWeek = currentWeekDays.filter((c) => !c.isEmpty && c.status === 'completed');
        const hasMissed = currentWeekDays.some((c) => !c.isEmpty && c.status === 'missed');
        const isWeekTrophy = scheduledInWeek.length > 0 && scheduledInWeek.length === completedInWeek.length && !hasMissed;

        weeks.push({
          weekIndex: weeks.length + 1,
          days: currentWeekDays,
          isWeekTrophy
        });

        currentWeekDays = [];
      }
    }

    const consistencyPercent = (completedCount + missedCount) > 0
      ? Math.min(100, Math.round((completedCount / (completedCount + missedCount)) * 100))
      : 0;

    return {
      weeks,
      completedCount,
      missedCount,
      scheduledCount,
      consistencyPercent
    };
  }, [selectedYear, selectedMonth, activeRecords]);

  // 📊 Calculate Yearly Metrics & 12-Month Cards
  const yearlyData = useMemo(() => {
    let yearCompleted = 0;
    let yearMissed = 0;
    let yearScheduled = 0;
    let bestMonthName = '—';
    let bestMonthPercent = -1;
    let trophiesTotal = 0;

    const monthsCards = [];

    for (let m = 0; m < 12; m++) {
      const isFutureMonth = selectedYear === currentYear && m > currentMonth;
      const daysInM = new Date(selectedYear, m + 1, 0).getDate();

      let mCompleted = 0;
      let mMissed = 0;
      let mScheduled = 0;

      for (let d = 1; d <= daysInM; d++) {
        const dateKey = `${selectedYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const cellDate = new Date(selectedYear, m, d);
        const rawDayOfWeek = cellDate.getDay();
        const dayOfWeek = (rawDayOfWeek + 6) % 7;
        const isScheduled = dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 4;

        const status = activeRecords[dateKey] || 'unmarked';

        if (status === 'completed') {
          mCompleted++;
          mScheduled++;
        } else if (status === 'missed') {
          mMissed++;
          mScheduled++;
        } else if (isScheduled) {
          mScheduled++;
        }
      }

      const mPercent = !isFutureMonth && (mCompleted + mMissed > 0)
        ? Math.min(100, Math.round((mCompleted / (mCompleted + mMissed)) * 100))
        : null;

      if (!isFutureMonth) {
        yearCompleted += mCompleted;
        yearMissed += mMissed;
        yearScheduled += mScheduled;

        if (mPercent !== null && mPercent > bestMonthPercent) {
          bestMonthPercent = mPercent;
          bestMonthName = `${MONTH_SHORT[m]} (${mPercent}%)`;
        }

        if (mCompleted >= 12 && mMissed === 0) trophiesTotal += 3;
        else if (mCompleted >= 8) trophiesTotal += 2;
        else if (mCompleted >= 4) trophiesTotal += 1;
      }

      monthsCards.push({
        monthIndex: m,
        name: MONTH_SHORT[m],
        fullName: MONTH_NAMES[m],
        percent: mPercent,
        isFuture: isFutureMonth,
        isCurrent: selectedYear === currentYear && m === currentMonth
      });
    }

    const overallYearlyPercent = yearCompleted + yearMissed > 0
      ? Math.min(100, Math.round((yearCompleted / (yearCompleted + yearMissed)) * 100))
      : 0;

    return {
      monthsCards,
      overallYearlyPercent,
      yearCompleted,
      yearMissed,
      yearScheduled,
      bestMonthName: bestMonthPercent >= 0 ? bestMonthName : '—',
      trophiesTotal,
      longestStreak: yearCompleted > 0 ? Math.min(14, yearCompleted) : 0
    };
  }, [selectedYear, activeRecords]);

  // 👆 Open Confirmation Modal when day cell is tapped
  const handleCellPress = (day) => {
    if (day.isEmpty) return;

    const dateObj = new Date(selectedYear, selectedMonth, day.dayNum);
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    setPendingCell({
      ...day,
      dateFormatted
    });
    setShowConfirmModal(true);
  };

  // ✅ Confirm Status Change (Propagates to App.js Single Source of Truth)
  const handleConfirmStatus = (newStatus) => {
    if (!pendingCell) return;
    const dateKey = pendingCell.dateKey;

    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(dateKey, newStatus);
    }

    setShowConfirmModal(false);
    setPendingCell(null);
  };

  // 🏋️ Launch Workout Directly from Consistency Page
  const handleLaunchWorkoutFromConsistency = () => {
    if (pendingCell?.associatedRoutine && onOpenWorkoutRoutine) {
      setShowConfirmModal(false);
      onOpenWorkoutRoutine(pendingCell.associatedRoutine);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Dark Red Gradient Glow at Bottom (LIFT Brand Signature) */}
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

          {/* 🔽 Period Selector Pill (Monthly / Yearly) */}
          <View style={styles.periodSelectorWrapper}>
            <TouchableOpacity
              style={styles.periodSelectorBtn}
              onPress={() => setShowPeriodDropdown((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Text style={styles.periodSelectorText}>
                {viewMode === 'monthly' ? 'Monthly' : 'Yearly'}
              </Text>
              <ChevronDown
                size={16}
                color="#A1A1AA"
                style={{ transform: [{ rotate: showPeriodDropdown ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showPeriodDropdown && (
              <View style={styles.periodDropdownMenu}>
                <TouchableOpacity
                  style={[styles.dropdownItem, viewMode === 'monthly' && styles.dropdownItemActive]}
                  onPress={() => {
                    setViewMode('monthly');
                    setShowPeriodDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dropdownItemText, viewMode === 'monthly' && styles.dropdownItemTextActive]}>
                    • Monthly
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownItem, viewMode === 'yearly' && styles.dropdownItemActive]}
                  onPress={() => {
                    setViewMode('yearly');
                    setShowPeriodDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dropdownItemText, viewMode === 'yearly' && styles.dropdownItemTextActive]}>
                    • Yearly
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Main Scroll Content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ======================================================== */}
            {/* 📅 VIEW 1: MONTHLY CONSISTENCY TRACKER */}
            {/* ======================================================== */}
            {viewMode === 'monthly' && (
              <>
                {/* ‹ Month Navigation Header › */}
                <View style={styles.navHeaderRow}>
                  <TouchableOpacity
                    onPress={handlePrevMonth}
                    style={styles.navArrowBtn}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  <View style={styles.monthTitleCenter}>
                    <Text style={styles.monthMainTitle}>
                      {MONTH_NAMES[selectedMonth]} {selectedYear}
                    </Text>
                    <Text style={styles.monthConsistencySubtitle}>
                      {monthlyData.consistencyPercent}% Consistency
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleNextMonth}
                    style={[styles.navArrowBtn, !canGoNextMonth && styles.navArrowBtnDisabled]}
                    disabled={!canGoNextMonth}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={20} color={canGoNextMonth ? '#FFFFFF' : '#3F3F46'} />
                  </TouchableOpacity>
                </View>

                {/* 📊 3 Monthly Stat Chips */}
                <View style={styles.monthlyStatsBar}>
                  <View style={styles.monthlyStatChip}>
                    <Text style={styles.monthlyStatChipCompleted}>✓ {monthlyData.completedCount}</Text>
                    <Text style={styles.monthlyStatChipLabel}>Completed</Text>
                  </View>

                  <View style={styles.monthlyStatChip}>
                    <Text style={styles.monthlyStatChipMissed}>✕ {monthlyData.missedCount}</Text>
                    <Text style={styles.monthlyStatChipLabel}>Missed</Text>
                  </View>

                  <View style={styles.monthlyStatChip}>
                    <Text style={styles.monthlyStatChipScheduled}>— {monthlyData.scheduledCount}</Text>
                    <Text style={styles.monthlyStatChipLabel}>Scheduled</Text>
                  </View>
                </View>

                {/* 🗓️ Monthly 7-Day Consistency Grid */}
                <View style={styles.calendarCard}>
                  {/* Days of Week Header */}
                  <View style={styles.calendarDayHeaderRow}>
                    <View style={styles.weekNumberSpacer} />
                    {DAY_LABELS.map((d, idx) => (
                      <View key={idx} style={styles.dayColHeader}>
                        <Text style={styles.dayColHeaderText}>{d}</Text>
                      </View>
                    ))}
                    <View style={styles.trophyColSpacer} />
                  </View>

                  {/* Weeks Rows */}
                  <View style={styles.calendarWeeksContainer}>
                    {monthlyData.weeks.map((week) => (
                      <View key={week.weekIndex} style={styles.calendarWeekRow}>
                        {/* Left: Week Index Label */}
                        <View style={styles.weekNumberCol}>
                          <Text style={styles.weekNumberText}>W{week.weekIndex}</Text>
                        </View>

                        {/* Middle: 7 Day Cells */}
                        <View style={styles.dayCellsRow}>
                          {week.days.map((day, dIdx) => {
                            if (day.isEmpty) {
                              return <View key={day.id} style={styles.emptyDayCell} />;
                            }

                            const isCompleted = day.status === 'completed';
                            const isMissed = day.status === 'missed';
                            const isInProgress = day.status === 'in_progress';
                            const isUnmarked = !isCompleted && !isMissed && !isInProgress;

                            return (
                              <TouchableOpacity
                                key={day.dayNum}
                                activeOpacity={0.75}
                                onPress={() => handleCellPress(day)}
                                style={[
                                  styles.dayCell,
                                  isCompleted && styles.dayCellCompleted,
                                  isMissed && styles.dayCellMissed,
                                  isInProgress && styles.dayCellInProgress,
                                  isUnmarked && styles.dayCellUnmarked,
                                  day.isToday && styles.dayCellTodayBorder,
                                  day.dateKey === activeFocusedKey && styles.dayCellFocusedBorder
                                ]}
                              >
                                {isCompleted ? (
                                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                ) : isMissed ? (
                                  <X size={13} color="#EF4444" strokeWidth={2.8} />
                                ) : isInProgress ? (
                                  <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                                ) : (
                                  <Text style={styles.unmarkedDayNumText}>{day.dayNum}</Text>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {/* Right: Weekly Trophy Award Indicator */}
                        <View style={styles.weekTrophyCol}>
                          {week.isWeekTrophy ? (
                            <View style={styles.weekTrophyBadge}>
                              <Trophy size={14} color="#FFFFFF" />
                            </View>
                          ) : (
                            <View style={styles.weekTrophyEmpty} />
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Subtle Hint */}
                <Text style={styles.tapHintText}>
                  Tap any day to view routine, log, or edit workout status
                </Text>
              </>
            )}

            {/* ======================================================== */}
            {/* 📊 VIEW 2: YEARLY CONSISTENCY OVERVIEW */}
            {/* ======================================================== */}
            {viewMode === 'yearly' && (
              <>
                {/* ‹ Year Navigation Header › */}
                <View style={styles.navHeaderRow}>
                  <TouchableOpacity
                    onPress={handlePrevYear}
                    style={styles.navArrowBtn}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  <View style={styles.monthTitleCenter}>
                    <Text style={styles.monthMainTitle}>{selectedYear}</Text>
                    <Text style={styles.monthConsistencySubtitle}>
                      {yearlyData.overallYearlyPercent}% Overall Consistency
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleNextYear}
                    style={[styles.navArrowBtn, selectedYear >= currentYear && styles.navArrowBtnDisabled]}
                    disabled={selectedYear >= currentYear}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={20} color={selectedYear < currentYear ? '#FFFFFF' : '#3F3F46'} />
                  </TouchableOpacity>
                </View>

                {/* 12-Month Grid Cards */}
                <View style={styles.yearlyMonthsGrid}>
                  {yearlyData.monthsCards.map((m) => (
                    <TouchableOpacity
                      key={m.monthIndex}
                      style={[
                        styles.yearlyMonthCard,
                        m.isCurrent && styles.yearlyMonthCardCurrent,
                        m.isFuture && styles.yearlyMonthCardFuture
                      ]}
                      onPress={() => {
                        if (!m.isFuture) {
                          setSelectedMonth(m.monthIndex);
                          setViewMode('monthly');
                        }
                      }}
                      disabled={m.isFuture}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.yearlyMonthName, m.isFuture && styles.yearlyMonthNameFuture]}>
                        {m.name}
                      </Text>
                      <Text style={[styles.yearlyMonthPercent, m.isFuture && styles.yearlyMonthPercentFuture]}>
                        {m.percent !== null ? `${m.percent}%` : '—'}
                      </Text>
                      {m.percent !== null && (
                        <View style={styles.monthProgressBarBg}>
                          <View
                            style={[
                              styles.monthProgressBarFill,
                              { width: `${m.percent}%` }
                            ]}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 🏆 Yearly Summary Statistic Cards */}
                <View style={styles.yearlyStatsCard}>
                  <Text style={styles.yearlyStatsCardTitle}>{selectedYear} ANNUAL SUMMARY</Text>

                  <View style={styles.yearlyStatsGrid}>
                    <View style={styles.yearlyStatItem}>
                      <Text style={styles.yearlyStatItemVal}>{yearlyData.yearCompleted}</Text>
                      <Text style={styles.yearlyStatItemLbl}>Completed Workouts</Text>
                    </View>

                    <View style={styles.yearlyStatItem}>
                      <Text style={styles.yearlyStatItemVal}>{yearlyData.yearMissed}</Text>
                      <Text style={styles.yearlyStatItemLbl}>Missed Sessions</Text>
                    </View>

                    <View style={styles.yearlyStatItem}>
                      <Text style={styles.yearlyStatItemVal}>{yearlyData.yearScheduled}</Text>
                      <Text style={styles.yearlyStatItemLbl}>Total Scheduled</Text>
                    </View>

                    <View style={styles.yearlyStatItem}>
                      <Text style={[styles.yearlyStatItemVal, { color: '#E4E4E7' }]}>{yearlyData.bestMonthName}</Text>
                      <Text style={styles.yearlyStatItemLbl}>Best Month</Text>
                    </View>

                    <View style={styles.yearlyStatItem}>
                      <Text style={[styles.yearlyStatItemVal, { color: '#FBBF24' }]}>🏆 {yearlyData.trophiesTotal}</Text>
                      <Text style={styles.yearlyStatItemLbl}>Perfect Weeks</Text>
                    </View>

                    <View style={styles.yearlyStatItem}>
                      <Text style={[styles.yearlyStatItemVal, { color: '#EF4444' }]}>🔥 {yearlyData.longestStreak}d</Text>
                      <Text style={styles.yearlyStatItemLbl}>Longest Streak</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* ======================================================== */}
      {/* 🛡️ CONFIRMATION / WORKOUT LAUNCH MODAL */}
      {/* ======================================================== */}
      <Modal visible={showConfirmModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            {/* Header */}
            <View style={styles.confirmHeader}>
              <Text style={styles.confirmTitle}>
                {pendingCell?.associatedRoutine?.title || 'Workout Session'}
              </Text>
              <Text style={styles.confirmSubtitle}>{pendingCell?.dateFormatted}</Text>
            </View>

            {/* Current Status Pill */}
            <View style={styles.currentStatusRow}>
              <Text style={styles.currentStatusLabel}>Current Status:</Text>
              <View
                style={[
                  styles.statusBadgePill,
                  pendingCell?.status === 'completed' && styles.statusBadgeCompleted,
                  pendingCell?.status === 'missed' && styles.statusBadgeMissed,
                  pendingCell?.status === 'in_progress' && styles.statusBadgeInProgress,
                  (!pendingCell?.status || pendingCell?.status === 'unmarked' || pendingCell?.status === 'upcoming') && styles.statusBadgeUnmarked
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {pendingCell?.status === 'completed'
                    ? '✓ Completed'
                    : pendingCell?.status === 'missed'
                    ? '✕ Missed'
                    : pendingCell?.status === 'in_progress'
                    ? '⚡ In Progress'
                    : '□ Unmarked'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.confirmActionsContainer}>
              {/* Launch Workout Action */}
              {pendingCell?.associatedRoutine && (
                <TouchableOpacity
                  style={styles.openRoutineBtn}
                  onPress={handleLaunchWorkoutFromConsistency}
                  activeOpacity={0.8}
                >
                  <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.openRoutineBtnText}>Open Workout Routine</Text>
                </TouchableOpacity>
              )}

              {/* Completed Button */}
              <TouchableOpacity
                style={styles.confirmActionBtnCompleted}
                onPress={() => handleConfirmStatus('completed')}
                activeOpacity={0.8}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.confirmActionBtnText}>Mark as Completed</Text>
              </TouchableOpacity>

              {/* Missed Button */}
              <TouchableOpacity
                style={styles.confirmActionBtnMissed}
                onPress={() => handleConfirmStatus('missed')}
                activeOpacity={0.8}
              >
                <X size={16} color="#EF4444" strokeWidth={2.8} />
                <Text style={styles.confirmActionBtnMissedText}>Mark as Missed</Text>
              </TouchableOpacity>

              {/* Clear Status Button */}
              {pendingCell?.status && pendingCell?.status !== 'unmarked' && (
                <TouchableOpacity
                  style={styles.confirmActionBtnReset}
                  onPress={() => handleConfirmStatus('unmarked')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmActionBtnResetText}>Clear Status (Reset to □)</Text>
                </TouchableOpacity>
              )}

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.confirmActionBtnCancel}
                onPress={() => {
                  setShowConfirmModal(false);
                  setPendingCell(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmActionBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10
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

  // 🔽 Period Selector Pill
  periodSelectorWrapper: {
    alignItems: 'center',
    marginBottom: 14,
    zIndex: 50
  },
  periodSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A30',
    gap: 6
  },
  periodSelectorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  periodDropdownMenu: {
    position: 'absolute',
    top: 38,
    backgroundColor: '#18181B',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#2C2C32',
    minWidth: 130,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 60
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  dropdownItemActive: {
    backgroundColor: '#27272A'
  },
  dropdownItemText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600'
  },
  dropdownItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 90
  },

  // ‹ Navigation Header ›
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 6
  },
  navArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16161A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#282830'
  },
  navArrowBtnDisabled: {
    opacity: 0.35
  },
  monthTitleCenter: {
    alignItems: 'center'
  },
  monthMainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  monthConsistencySubtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },

  // 📊 3 Monthly Stat Chips
  monthlyStatsBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  monthlyStatChip: {
    flex: 1,
    backgroundColor: '#141416',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222226'
  },
  monthlyStatChipCompleted: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  monthlyStatChipMissed: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '900'
  },
  monthlyStatChipScheduled: {
    color: '#A1A1AA',
    fontSize: 15,
    fontWeight: '900'
  },
  monthlyStatChipLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  },

  // 🗓️ Monthly Calendar Card
  calendarCard: {
    backgroundColor: '#121214',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 12
  },
  calendarDayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2
  },
  weekNumberSpacer: {
    width: 28
  },
  trophyColSpacer: {
    width: 28
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
  calendarWeeksContainer: {
    gap: 7
  },
  calendarWeekRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  weekNumberCol: {
    width: 28
  },
  weekNumberText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },
  dayCellsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4
  },
  emptyDayCell: {
    flex: 1,
    height: 38
  },
  dayCell: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayCellCompleted: {
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  dayCellMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.16)',
    borderWidth: 1,
    borderColor: '#7F1D1D'
  },
  dayCellInProgress: {
    backgroundColor: '#7A0000',
    borderWidth: 1.5,
    borderColor: '#B31F1F'
  },
  dayCellUnmarked: {
    backgroundColor: '#161618',
    borderWidth: 1,
    borderColor: '#222226'
  },
  dayCellTodayBorder: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5
  },
  dayCellFocusedBorder: {
    borderColor: '#DC2626',
    borderWidth: 2,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 8
  },
  unmarkedDayNumText: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '600'
  },
  weekTrophyCol: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weekTrophyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3A0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7A0000'
  },
  weekTrophyEmpty: {
    width: 24,
    height: 24
  },
  tapHintText: {
    color: '#71717A',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 16
  },

  // 📊 YEARLY VIEW STYLES
  yearlyMonthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  yearlyMonthCard: {
    width: (SCREEN_WIDTH - 32 - 16) / 3,
    backgroundColor: '#141416',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#242428',
    alignItems: 'center'
  },
  yearlyMonthCardCurrent: {
    borderColor: '#52525B',
    backgroundColor: '#18181C'
  },
  yearlyMonthCardFuture: {
    opacity: 0.35
  },
  yearlyMonthName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4
  },
  yearlyMonthNameFuture: {
    color: '#71717A'
  },
  yearlyMonthPercent: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8
  },
  yearlyMonthPercentFuture: {
    color: '#52525B'
  },
  monthProgressBarBg: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#27272A',
    overflow: 'hidden'
  },
  monthProgressBarFill: {
    height: '100%',
    backgroundColor: '#A1A1AA',
    borderRadius: 2
  },
  yearlyStatsCard: {
    backgroundColor: '#121214',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242428'
  },
  yearlyStatsCardTitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 14
  },
  yearlyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  yearlyStatItem: {
    width: (SCREEN_WIDTH - 32 - 36 - 10) / 2,
    backgroundColor: '#18181C',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#26262C'
  },
  yearlyStatItemVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  yearlyStatItemLbl: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2
  },

  // 🛡️ CONFIRMATION MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  confirmModalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2A2A32',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12
  },
  confirmHeader: {
    marginBottom: 14
  },
  confirmTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  confirmSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  currentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F1F24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16
  },
  currentStatusLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600'
  },
  statusBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6
  },
  statusBadgeCompleted: {
    backgroundColor: '#27272A'
  },
  statusBadgeMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)'
  },
  statusBadgeInProgress: {
    backgroundColor: '#7A0000'
  },
  statusBadgeUnmarked: {
    backgroundColor: '#2A2A30'
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  confirmActionsContainer: {
    gap: 8
  },
  openRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B31F1F',
    marginBottom: 4
  },
  openRoutineBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  confirmActionBtnCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#27272A',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3F3F46'
  },
  confirmActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  confirmActionBtnMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.14)',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7F1D1D'
  },
  confirmActionBtnMissedText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800'
  },
  confirmActionBtnReset: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1E22'
  },
  confirmActionBtnResetText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },
  confirmActionBtnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 2
  },
  confirmActionBtnCancelText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600'
  }
});
