import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Bell,
  Check,
  Moon,
  X,
  ArrowUpRight,
  Zap,
  Clock,
  Dumbbell,
  Sparkles,
  Calendar,
  Flame,
  Play,
  Camera,
  Image as ImageIcon,
  User,
  UploadCloud
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AVATAR_SLOTS = [
  { id: 'slot-1', name: 'Alpha' },
  { id: 'slot-2', name: 'Stealth' },
  { id: 'slot-3', name: 'Titan' },
  { id: 'slot-4', name: 'Vanguard' },
  { id: 'slot-5', name: 'Apex' },
  { id: 'slot-6', name: 'Phantom' },
  { id: 'slot-7', name: 'Rogue' },
  { id: 'slot-8', name: 'Strike' },
  { id: 'slot-9', name: 'Ghost' },
  { id: 'slot-10', name: 'Prime' }
];

export function HomeScreen({
  userName = 'David',
  userAvatar,
  onUpdateAvatar,
  workoutHistory = [],
  activeWorkoutProgress = null,
  dailyWorkoutStatuses = {},
  onUpdateDailyStatus,
  onNavigateTab,
  onStartWorkout,
  onPreviewWorkout,
  onResumeWorkout,
  onSelectMuscle,
  onOpenConsistency,
  onReplayIntroVideo
}) {
  const [hasNotification, setHasNotification] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(userAvatar || require('../../assets/athlete_hero.jpg'));

  // Double-tap tracker refs
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);
  const dayStripLastTapRef = useRef({});
  const dayStripSingleTapTimerRef = useRef({});

  // Active avatar reference
  const currentAvatar = userAvatar || localAvatar;

  // 📸 1. Launch Camera
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access in your device settings to take a profile photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAvatarSource = { uri: result.assets[0].uri };
        setLocalAvatar(newAvatarSource);
        if (onUpdateAvatar) onUpdateAvatar(newAvatarSource);
        setShowAvatarPicker(false);
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Camera Error', 'Could not open the camera. Please try again.');
    }
  };

  // 🖼️ 2. Open Photo Gallery
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          'Please allow photo library access in your device settings to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAvatarSource = { uri: result.assets[0].uri };
        setLocalAvatar(newAvatarSource);
        if (onUpdateAvatar) onUpdateAvatar(newAvatarSource);
        setShowAvatarPicker(false);
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Gallery Error', 'Could not open photo library. Please try again.');
    }
  };

  // 🗓️ Real-time Day Detection
  const now = new Date();
  const todayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);

  // Selected routine based on user interaction or today
  const activeRoutine = WEEKLY_ROUTINES_DB[selectedDayIndex] || WEEKLY_ROUTINES_DB[0];

  // 📊 Read Strict Unified Status from dailyWorkoutStatuses
  const todayStatus = dailyWorkoutStatuses[todayKey] || (activeWorkoutProgress ? 'in_progress' : 'unmarked');
  const isTodayCompleted = todayStatus === 'completed';
  const isTodayMissed = todayStatus === 'missed';
  const isTodayInProgress = todayStatus === 'in_progress' || (!!activeWorkoutProgress && !isTodayCompleted);

  // 👆 Double Tap Handler for Workout Box (Opens Consistency Page directly)
  const handleWorkoutBoxPress = () => {
    const tapNow = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (tapNow - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap Detected! Cancel single tap and open Consistency screen
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapRef.current = 0;
      if (onOpenConsistency) onOpenConsistency(todayKey);
    } else {
      lastTapRef.current = tapNow;
      singleTapTimerRef.current = setTimeout(() => {
        // Single Tap Action
        if (isTodayCompleted || isTodayMissed) {
          setShowStatusModal(true);
        } else if (isTodayInProgress && onResumeWorkout) {
          onResumeWorkout();
        } else if (onPreviewWorkout) {
          onPreviewWorkout(activeRoutine);
        } else if (onStartWorkout) {
          onStartWorkout(activeRoutine);
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  // Status Change Handlers
  const handleSetStatus = (newStatus) => {
    if (onUpdateDailyStatus) {
      onUpdateDailyStatus(todayKey, newStatus);
    }
    setShowStatusModal(false);
  };

  // 📊 Compute Real-time Weekly Metrics from Shared Status
  const metrics = useMemo(() => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    let completedCount = 0;
    const completedDaysMap = {};

    WEEKLY_ROUTINES_DB.forEach((item, idx) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + idx);
      const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;

      const s = dailyWorkoutStatuses[dateStr];
      if (s === 'completed') {
        completedCount++;
        completedDaysMap[idx] = true;
      }
    });

    const targetCount = 4;
    const onTrackPercent = Math.min(100, Math.round((completedCount / targetCount) * 100));
    const hours = Math.floor((completedCount * 45) / 60);
    const mins = (completedCount * 45) % 60;
    const formattedDuration = completedCount > 0 ? (hours > 0 ? `${hours}h ${mins}m` : `${mins}m`) : '0m';

    return {
      completedCount,
      targetCount,
      onTrackPercent,
      formattedDuration,
      totalExercises: completedCount * 4,
      completedDaysMap
    };
  }, [dailyWorkoutStatuses, now]);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 👤 1. Top Header: User Profile Greeting & Avatar Customizer */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.userProfileGroup}
            activeOpacity={0.75}
            onPress={() => setShowAvatarPicker(true)}
          >
            {/* Clean Avatar on the Left (No green dot, no camera icon) */}
            <View style={styles.avatarContainer}>
              <Image
                source={currentAvatar}
                style={styles.avatarImage}
              />
            </View>

            {/* Small Elegant Username (Max 10 chars, refined typography, no Ready to train) */}
            <View style={styles.userTextCol}>
              <Text style={styles.greetingPrefix}>Good day,</Text>
              <Text style={styles.greetingTitle} numberOfLines={1}>
                {(userName || 'Athlete').slice(0, 10)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Right Action Buttons: Play Intro Animation & Notification */}
          <View style={styles.headerRightActionsRow}>
            {onReplayIntroVideo && (
              <TouchableOpacity
                style={styles.introVideoBtn}
                activeOpacity={0.75}
                onPress={onReplayIntroVideo}
              >
                <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.75}
              onPress={() => setHasNotification(false)}
            >
              <Bell size={19} color="#FFFFFF" />
              {hasNotification && <View style={styles.notificationDot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* ⚡ 2. Hero "NEXT WORKOUT" Card (With Double-Tap to Consistency) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>
            {isTodayInProgress ? 'WORKOUT IN PROGRESS' : isTodayCompleted ? "TODAY'S WORKOUT" : 'NEXT WORKOUT'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.heroCard,
            isTodayInProgress && styles.heroCardInProgress,
            isTodayCompleted && styles.heroCardCompleted,
            isTodayMissed && styles.heroCardMissed
          ]}
          activeOpacity={0.9}
          onPress={handleWorkoutBoxPress}
        >
          {/* Background Athlete Image */}
          <Image
            source={activeRoutine.image || require('../../assets/athlete_hero.jpg')}
            style={styles.heroImage}
          />

          {/* Deep Bottom Linear Vignette with Light & Professional Crimson Atmosphere */}
          <LinearGradient
            colors={['rgba(20, 8, 11, 0.15)', 'rgba(42, 12, 18, 0.75)', 'rgba(64, 14, 25, 0.98)']}
            locations={[0, 0.42, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* Top Floating Badge Bar */}
          <View style={styles.heroTopBadgesRow}>
            {/* Dynamic Status Pill */}
            <View
              style={[
                styles.schedulePill,
                isTodayCompleted && styles.schedulePillCompleted,
                isTodayInProgress && styles.schedulePillInProgress,
                isTodayMissed && styles.schedulePillMissed,
                activeRoutine.isRest && styles.schedulePillRest
              ]}
            >
              {isTodayCompleted ? (
                <Check size={12} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 5 }} />
              ) : isTodayMissed ? (
                <X size={12} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 5 }} />
              ) : (
                <Calendar size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
              )}

              <Text style={styles.schedulePillText}>
                {isTodayCompleted
                  ? 'Completed Today'
                  : isTodayInProgress
                  ? `In Progress • ${activeWorkoutProgress?.percentComplete || 50}%`
                  : isTodayMissed
                  ? 'Missed Session'
                  : selectedDayIndex === todayIndex
                  ? 'Today · Session 1'
                  : selectedDayIndex === (todayIndex + 1) % 7
                  ? 'Tomorrow'
                  : `In ${(selectedDayIndex - todayIndex + 7) % 7} days`}
              </Text>
            </View>

            {/* Right Badges Stack */}
            <View style={styles.heroRightBadgesStack}>
              {!activeRoutine.isRest ? (
                <>
                  <View style={styles.frostedBadge}>
                    <Zap size={12} color="#FBBF24" style={{ marginRight: 4 }} />
                    <Text style={styles.frostedBadgeText}>
                      {activeRoutine.exercises?.length || 4} exercises
                    </Text>
                  </View>
                  <View style={[styles.frostedBadge, { marginTop: 6 }]}>
                    <Clock size={12} color="#A1A1AA" style={{ marginRight: 4 }} />
                    <Text style={styles.frostedBadgeText}>
                      {activeRoutine.durationMin || 45} min
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.frostedBadge}>
                  <Moon size={12} color="#38BDF8" style={{ marginRight: 4 }} />
                  <Text style={styles.frostedBadgeText}>Rest & Recovery</Text>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Hero Info & In-Progress Progress Bar */}
          <View style={styles.heroBottomContent}>
            <Text style={styles.workoutMainTitle}>{activeRoutine.title}</Text>
            <Text style={styles.workoutSubInfo}>
              Week 3 · Day {activeRoutine.dayNum || 1} · {activeRoutine.focus}
            </Text>

            {/* In-Progress Progress Bar & Resume Button */}
            {isTodayInProgress ? (
              <View style={styles.inProgressContainer}>
                <View style={styles.progressLineBg}>
                  <View
                    style={[
                      styles.progressLineFill,
                      { width: `${Math.max(10, activeWorkoutProgress?.percentComplete || 50)}%` }
                    ]}
                  />
                </View>
                <View style={styles.resumeBtnRow}>
                  <Text style={styles.resumeSubText}>
                    {activeWorkoutProgress?.completedCount || 2} / {activeWorkoutProgress?.totalCount || 4} exercises done
                  </Text>
                  <View style={styles.resumeBadgeBtn}>
                    <Play size={10} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.resumeBadgeBtnText}>RESUME</Text>
                  </View>
                </View>
              </View>
            ) : isTodayCompleted ? (
              <View style={styles.completedSubRow}>
                <Text style={styles.completedSubText}>✓ Session logged • Tap to change status • Double-tap for calendar</Text>
              </View>
            ) : isTodayMissed ? (
              <View style={styles.completedSubRow}>
                <Text style={[styles.completedSubText, { color: '#F87171' }]}>× Marked missed • Tap to change status</Text>
              </View>
            ) : (
              <View style={styles.tapToPreviewRow}>
                <Text style={styles.tapToPreviewText}>Tap to start · Double tap for Consistency ↗</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* 📊 3. "YOUR TRAINING SUMMARY" (7-Day Reactive Adherence Matrix) */}
        <View style={[styles.sectionHeaderRow, { marginTop: 26 }]}>
          <Text style={styles.sectionLabel}>YOUR TRAINING SUMMARY</Text>
        </View>

        <View style={styles.summaryCard}>
          {/* Header Row with Existing Arrow for Consistency */}
          <View style={styles.summaryHeaderRow}>
            <Text style={styles.summaryTitle}>Workouts</Text>
            <TouchableOpacity
              style={styles.linkArrowBtn}
              activeOpacity={0.7}
              onPress={() => {
                if (onOpenConsistency) {
                  onOpenConsistency();
                } else if (onNavigateTab) {
                  onNavigateTab('workouts');
                }
              }}
            >
              <ArrowUpRight size={18} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* 7-Day Status Circles Strip */}
          <View style={styles.daysStripContainer}>
            {WEEKLY_ROUTINES_DB.map((item, idx) => {
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              const dayDate = new Date(startOfWeek);
              dayDate.setDate(startOfWeek.getDate() + idx);
              const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;

              const dayStatus = dailyWorkoutStatuses[dateStr] || (idx === todayIndex ? todayStatus : 'unmarked');

              const isCompleted = dayStatus === 'completed';
              const isMissed = dayStatus === 'missed';
              const isInProgress = dayStatus === 'in_progress';
              const isToday = idx === todayIndex;
              const isRest = item.isRest;
              const isSelected = selectedDayIndex === idx;

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.dayCol}
                  activeOpacity={0.75}
                  onPress={() => {
                    const tapNow = Date.now();
                    const DOUBLE_TAP_DELAY = 300;
                    const prevTap = dayStripLastTapRef.current[idx] || 0;
                    if (tapNow - prevTap < DOUBLE_TAP_DELAY) {
                      if (dayStripSingleTapTimerRef.current[idx]) {
                        clearTimeout(dayStripSingleTapTimerRef.current[idx]);
                        dayStripSingleTapTimerRef.current[idx] = null;
                      }
                      dayStripLastTapRef.current[idx] = 0;
                      if (onOpenConsistency) onOpenConsistency(dateStr);
                    } else {
                      dayStripLastTapRef.current[idx] = tapNow;
                      dayStripSingleTapTimerRef.current[idx] = setTimeout(() => {
                        setSelectedDayIndex(idx);
                      }, DOUBLE_TAP_DELAY);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isCompleted && styles.dayCircleCompleted,
                      isRest && !isCompleted && styles.dayCircleRest,
                      isMissed && styles.dayCircleMissed,
                      isInProgress && styles.dayCircleInProgress,
                      isToday && !isCompleted && !isMissed && !isInProgress && styles.dayCircleToday,
                      isSelected && styles.dayCircleSelected
                    ]}
                  >
                    {isCompleted ? (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    ) : isRest ? (
                      <Moon size={13} color="#71717A" />
                    ) : isMissed ? (
                      <X size={13} color="#EF4444" strokeWidth={2.8} />
                    ) : isInProgress ? (
                      <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                    ) : isToday ? (
                      <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                    ) : (
                      <Dumbbell size={12} color="#52525B" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.dayLetterLabel,
                      isToday && styles.dayLetterToday,
                      isSelected && styles.dayLetterSelected
                    ]}
                  >
                    {item.dayCode}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Divider */}
          <View style={styles.summaryDivider} />

          {/* Bottom Metrics: Completed Count & On Track % */}
          <View style={styles.summaryMetricsRow}>
            <View style={styles.metricLeftGroup}>
              <Text style={styles.metricLargeNumber}>
                {metrics.completedCount}
                <Text style={styles.metricTotalSub}>/{metrics.targetCount}</Text>
              </Text>
              <Text style={styles.metricDescription}>Completed this week</Text>
            </View>

            <View style={styles.metricRightGroup}>
              <Text style={styles.metricLargeNumber}>{metrics.onTrackPercent}%</Text>
              <Text style={styles.metricDescription}>On Track</Text>
            </View>
          </View>
        </View>

        {/* 📈 4. Weekly Quick Stats Dual Cards */}
        <View style={styles.dualCardsRow}>
          {/* Duration Card */}
          <TouchableOpacity
            style={styles.statMiniCard}
            activeOpacity={0.8}
            onPress={() => onNavigateTab && onNavigateTab('workouts')}
          >
            <View style={styles.statMiniHeader}>
              <Text style={styles.statMiniLabel}>Duration</Text>
              <ArrowUpRight size={16} color="#71717A" />
            </View>
            <Text style={styles.statMiniValue}>{metrics.formattedDuration}</Text>
            <Text style={styles.statMiniSub}>Total time trained</Text>
          </TouchableOpacity>

          {/* Total Exercises Card */}
          <TouchableOpacity
            style={styles.statMiniCard}
            activeOpacity={0.8}
            onPress={() => onNavigateTab && onNavigateTab('exercises')}
          >
            <View style={styles.statMiniHeader}>
              <Text style={styles.statMiniLabel}>Total Exercises</Text>
              <ArrowUpRight size={16} color="#71717A" />
            </View>
            <Text style={styles.statMiniValue}>{metrics.totalExercises}</Text>
            <Text style={styles.statMiniSub}>Completed this week</Text>
          </TouchableOpacity>
        </View>

        {/* 🎧 5. Studio AI Audio Coach Banner */}
        <View style={styles.aiCoachStudioCard}>
          <View style={styles.aiCoachHeaderRow}>
            <View style={styles.aiIconBadge}>
              <Sparkles size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.aiCoachBadgeTitle}>AI AUDIO COACH ACTIVE</Text>
          </View>
          <Text style={styles.aiCoachBodyText}>
            "Ready when you are, {userName}! Pop your earphones in for real-time cadence cues and smart rest tracking."
          </Text>
        </View>

        {/* 🏋️ 6. Explore Muscle Targets */}
        <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
          <Text style={styles.sectionLabel}>EXPLORE BY MUSCLE</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.muscleScrollRow}
        >
          {['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Abs'].map((muscle, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.muscleChipCard}
              activeOpacity={0.75}
              onPress={() => onSelectMuscle && onSelectMuscle(muscle)}
            >
              <Dumbbell size={16} color="#FFFFFF" />
              <Text style={styles.muscleChipLabel}>{muscle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* 🖼️ Modern Aesthetic Avatar Customization Sheet */}
      <Modal visible={showAvatarPicker} animationType="slide" transparent>
        <View style={styles.avatarModalOverlay}>
          <TouchableOpacity
            style={styles.avatarModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowAvatarPicker(false)}
          />

          <View style={styles.avatarSheetContainer}>
            <View style={styles.sheetDragHandle} />

            <View style={styles.sheetHeaderRow}>
              <View>
                <Text style={styles.sheetTitle}>Profile Picture</Text>
                <Text style={styles.sheetSubtitle}>Choose how you appear in LIFT</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAvatarPicker(false)}
                style={styles.sheetCloseBtn}
                activeOpacity={0.7}
              >
                <X size={16} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            {/* 1. Choose from Gallery Action Card */}
            <TouchableOpacity
              style={styles.customActionCard}
              onPress={handlePickFromGallery}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#1E1E24', '#16161A']}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View style={styles.customActionIconCircle}>
                <UploadCloud size={20} color="#FFFFFF" />
              </View>
              <View style={styles.customActionTextCol}>
                <Text style={styles.customActionTitle}>Choose from Gallery</Text>
                <Text style={styles.customActionSub}>Select any photo from your device</Text>
              </View>
            </TouchableOpacity>

            {/* 2. Choose Avatar Section (10 Slots) */}
            <View style={styles.avatarSectionBlock}>
              <View style={styles.avatarGridHeaderRow}>
                <Text style={styles.avatarGridHeaderLabel}>CHOOSE AVATAR (10 SLOTS)</Text>
                <Text style={styles.avatarGridCountBadge}>10 Slots</Text>
              </View>

              <View style={styles.avatarCardsGrid}>
                {AVATAR_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={styles.avatarSlotCard}
                    onPress={() => {
                      if (onUpdateAvatar) onUpdateAvatar(require('../../assets/athlete_hero.jpg'));
                      setShowAvatarPicker(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <LinearGradient
                      colors={['#1C1C20', '#141417']}
                      style={StyleSheet.absoluteFillObject}
                      pointerEvents="none"
                    />
                    <View style={styles.avatarPlaceholderCircle}>
                      <User size={20} color="#71717A" />
                    </View>
                    <Text style={styles.avatarSlotLabel}>{slot.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🛡️ Change Status Modal on Home Screen */}
      <Modal visible={showStatusModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.statusModalBox}>
            <Text style={styles.statusModalTitle}>Change Workout Status?</Text>
            <Text style={styles.statusModalSubtitle}>
              Select a new status for today ({todayKey}):
            </Text>

            <View style={styles.statusOptionsList}>
              <TouchableOpacity
                style={styles.statusOptionBtnCompleted}
                onPress={() => handleSetStatus('completed')}
                activeOpacity={0.8}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 6 }} />
                <Text style={styles.statusOptionBtnText}>✓ Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusOptionBtnMissed}
                onPress={() => handleSetStatus('missed')}
                activeOpacity={0.8}
              >
                <X size={16} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 6 }} />
                <Text style={styles.statusOptionBtnMissedText}>× Missed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusOptionBtnClear}
                onPress={() => handleSetStatus('unmarked')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusOptionBtnClearText}>Clear Status (Reset to □)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowStatusModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110
  },

  // 👤 Header Styles
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarContainer: {
    position: 'relative'
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#2A2A30'
  },
  userTextCol: {
    justifyContent: 'center'
  },
  greetingPrefix: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginTop: 1
  },
  headerRightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  introVideoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F1113',
    borderWidth: 1,
    borderColor: '#7A0000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C20',
    borderWidth: 1,
    borderColor: '#2A2A30',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  notificationDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444'
  },

  // ⚡ Section Labels
  sectionHeaderRow: {
    marginBottom: 10
  },
  sectionLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8
  },

  // 🏋️ Hero Card Styles
  heroCard: {
    width: '100%',
    height: 256,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#541C25',
    backgroundColor: '#1C0D11',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6
  },
  heroCardInProgress: {
    borderColor: '#8B0000'
  },
  heroCardCompleted: {
    borderColor: '#52525B'
  },
  heroCardMissed: {
    borderColor: '#7F1D1D'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  heroTopBadgesRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F3F46'
  },
  schedulePillCompleted: {
    backgroundColor: '#27272A',
    borderColor: '#52525B'
  },
  schedulePillInProgress: {
    backgroundColor: '#7A0000',
    borderColor: '#B31F1F'
  },
  schedulePillMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderColor: '#7F1D1D'
  },
  schedulePillRest: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8'
  },
  schedulePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  heroRightBadgesStack: {
    alignItems: 'flex-end'
  },
  frostedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  frostedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    right: 18,
    zIndex: 10
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  workoutSubInfo: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3
  },
  tapToPreviewRow: {
    marginTop: 6
  },
  tapToPreviewText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700'
  },
  inProgressContainer: {
    marginTop: 8
  },
  progressLineBg: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#27272A',
    overflow: 'hidden',
    marginBottom: 8
  },
  progressLineFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2
  },
  resumeBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resumeSubText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700'
  },
  resumeBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B31F1F'
  },
  resumeBadgeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  completedSubRow: {
    marginTop: 6
  },
  completedSubText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600'
  },

  // 📊 Training Summary Card Styles
  summaryCard: {
    backgroundColor: '#141416',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 18
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  linkArrowBtn: {
    padding: 4
  },
  daysStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  dayCol: {
    alignItems: 'center',
    gap: 8
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181B'
  },
  dayCircleCompleted: {
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B'
  },
  dayCircleRest: {
    backgroundColor: '#1E1E22',
    borderWidth: 1,
    borderColor: '#2C2C32'
  },
  dayCircleMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.16)',
    borderWidth: 1,
    borderColor: '#7F1D1D'
  },
  dayCircleInProgress: {
    backgroundColor: '#7A0000',
    borderWidth: 1.5,
    borderColor: '#B31F1F'
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#18181C'
  },
  dayCircleSelected: {
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  dayLetterLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  dayLetterToday: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  dayLetterSelected: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#242428',
    marginVertical: 16
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  metricLeftGroup: {},
  metricRightGroup: {
    alignItems: 'flex-end'
  },
  metricLargeNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900'
  },
  metricTotalSub: {
    color: '#71717A',
    fontSize: 16,
    fontWeight: '700'
  },
  metricDescription: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },

  // 📈 Dual Quick Stats Cards
  dualCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: '#141416',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242428'
  },
  statMiniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  statMiniLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  statMiniValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900'
  },
  statMiniSub: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4
  },

  // 🎧 AI Audio Coach Banner
  aiCoachStudioCard: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  aiCoachHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  aiIconBadge: {
    backgroundColor: '#DC2626',
    padding: 4,
    borderRadius: 6
  },
  aiCoachBadgeTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  aiCoachBodyText: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 18
  },

  // 🏋️ Muscle Chips Scroll
  muscleScrollRow: {
    marginVertical: 4
  },
  muscleChipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#141416',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#242428'
  },
  muscleChipLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  // 🖼️ Compact Modal Box Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28
  },
  compactModalBox: {
    width: '100%',
    maxWidth: 310,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2A2A32',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10
  },
  compactModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  compactModalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  compactCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#24242A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  compactCircleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  circleActionItem: {
    alignItems: 'center',
    gap: 8
  },
  // 🖼️ Avatar Sheet Styles
  avatarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end'
  },
  avatarModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  avatarSheetContainer: {
    backgroundColor: '#141418',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#2A2A32',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '85%'
  },
  sheetDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46',
    alignSelf: 'center',
    marginBottom: 16
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  sheetSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#202026',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303038'
  },
  customActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2C2C34',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16
  },
  customActionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#24242C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#3A3A44'
  },
  customActionTextCol: {
    flex: 1
  },
  customActionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  customActionSub: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16
  },
  avatarSectionBlock: {
    marginTop: 2
  },
  avatarGridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarGridHeaderLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  avatarGridCountBadge: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700'
  },
  avatarCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  avatarSlotCard: {
    width: (SCREEN_WIDTH - 64) / 5,
    height: 76,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A32',
    overflow: 'hidden',
    position: 'relative'
  },
  avatarPlaceholderCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#303038'
  },
  avatarSlotLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },

  // 🛡️ Status Modal Styles
  statusModalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A32',
    alignItems: 'center'
  },
  statusModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 6
  },
  statusModalSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18
  },
  statusOptionsList: {
    gap: 8,
    width: '100%'
  },
  statusOptionBtnCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27272A',
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#52525B'
  },
  statusOptionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  statusOptionBtnMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.14)',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7F1D1D'
  },
  statusOptionBtnMissedText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 14
  },
  statusOptionBtnClear: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E22',
    height: 42,
    borderRadius: 12
  },
  statusOptionBtnClearText: {
    color: '#A1A1AA',
    fontWeight: '700',
    fontSize: 13
  },
  cancelBtn: {
    backgroundColor: '#202026',
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303038',
    marginTop: 4
  },
  cancelBtnText: {
    color: '#71717A',
    fontWeight: '700',
    fontSize: 13
  }
});
