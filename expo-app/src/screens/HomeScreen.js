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
  Alert,
  Platform,
  StatusBar
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
  UploadCloud,
  RotateCcw,
  ArrowLeft
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🌟 17 Aesthetic 1:1 Circle Avatars (Starting with the 2 Pro Athlete Pictures)
const AVATAR_PRESETS_DB = [
  { id: 'avatar-hero-1', name: 'LIFT Athlete Pro', image: require('../../assets/avatars/avatar_hero_1.jpg') },
  { id: 'avatar-hero-2', name: 'Anime Gym Beast', image: require('../../assets/avatars/avatar_hero_2.jpg') },
  { id: 'avatar-1', name: 'Neon Cat', image: require('../../assets/avatars/avatar_1.jpg') },
  { id: 'avatar-2', name: 'Anime Pink', image: require('../../assets/avatars/avatar_2.jpg') },
  { id: 'avatar-3', name: 'Chibi Hoodie', image: require('../../assets/avatars/avatar_3.jpg') },
  { id: 'avatar-4', name: 'Goku Black', image: require('../../assets/avatars/avatar_4.jpg') },
  { id: 'avatar-5', name: 'Panda Warrior', image: require('../../assets/avatars/avatar_5.jpg') },
  { id: 'avatar-6', name: 'Luffy Laugh', image: require('../../assets/avatars/avatar_6.jpg') },
  { id: 'avatar-7', name: 'Little Luffy', image: require('../../assets/avatars/avatar_7.jpg') },
  { id: 'avatar-8', name: 'Lightning McQueen', image: require('../../assets/avatars/avatar_8.jpg') },
  { id: 'avatar-9', name: 'Pink Cat Car', image: require('../../assets/avatars/avatar_9.jpg') },
  { id: 'avatar-10', name: 'Porsche 911', image: require('../../assets/avatars/avatar_10.jpg') },
  { id: 'avatar-11', name: 'Dodge Challenger', image: require('../../assets/avatars/avatar_11.jpg') },
  { id: 'avatar-12', name: 'Dark Supra', image: require('../../assets/avatars/avatar_12.jpg') },
  { id: 'avatar-13', name: 'Fast & Furious Cat', image: require('../../assets/avatars/avatar_13.jpg') },
  { id: 'avatar-14', name: 'Cloud Storm', image: require('../../assets/avatars/avatar_14.jpg') },
  { id: 'avatar-15', name: 'Nature Valley', image: require('../../assets/avatars/avatar_15.jpg') }
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
  const [statusTargetDateKey, setStatusTargetDateKey] = useState(todayKey);
  const [localAvatar, setLocalAvatar] = useState(userAvatar || require('../../assets/athlete_hero.jpg'));
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar-1');

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
  const selectedDateKey = (() => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + selectedDayIndex);
    return `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
  })();
  const selectedRoutineStatus = dailyWorkoutStatuses[selectedDateKey];
  const isSelectedCompleted = selectedRoutineStatus === 'completed';
  const isSelectedMissed = selectedRoutineStatus === 'missed';
  const isSelectedInProgress = selectedRoutineStatus === 'in_progress' || (selectedDayIndex === todayIndex && !!activeWorkoutProgress && !isSelectedCompleted);
  const isSelectedToday = selectedDayIndex === todayIndex;

  const todayStatus = dailyWorkoutStatuses[todayKey] || (activeWorkoutProgress ? 'in_progress' : 'unmarked');
  const isTodayCompleted = todayStatus === 'completed';
  const isTodayMissed = todayStatus === 'missed';
  const isTodayInProgress = todayStatus === 'in_progress' || (!!activeWorkoutProgress && !isTodayCompleted);

  // 👆 Double Tap Handler for Workout Box (Goes to the next workout task)
  const handleWorkoutBoxPress = () => {
    const tapNow = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (tapNow - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap Detected! Cancel single tap and go to next workout task
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapRef.current = 0;
      setSelectedDayIndex((prev) => (prev + 1) % 7);
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
      onUpdateDailyStatus(statusTargetDateKey || todayKey, newStatus);
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

    const targetCount = 7;
    const onTrackPercent = Math.min(100, Math.round((completedCount / targetCount) * 100));
    const hours = Math.floor((completedCount * 45) / 60);
    const mins = (completedCount * 45) % 60;
    const formattedDuration = completedCount > 0 ? (hours > 0 ? `${hours}h ${mins}m` : `${mins}m`) : '0m';

    return {
      completedCount,
      targetCount: 7,
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
        {/* 👤 1. Top Header: User Profile Greeting & Avatar Customizer in Transparent Red-Black Glass Box */}
        <View style={styles.headerGlassCapsule}>
          {/* 🔴 Transparent Red-Black Ambient Gradient Background */}
          <LinearGradient
            colors={['rgba(54, 15, 22, 0.72)', 'rgba(32, 9, 14, 0.82)', 'rgba(14, 4, 7, 0.92)']}
            locations={[0, 0.45, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.userProfileGroup}
              activeOpacity={0.75}
              onPress={() => setShowAvatarPicker(true)}
            >
              {/* Ultra-Aesthetic Clean Avatar Container on Left */}
              <View style={styles.avatarContainer}>
                <Image
                  source={currentAvatar}
                  style={styles.avatarImage}
                />
              </View>

              {/* Small Elegant Username with SF Pro Typography */}
              <View style={styles.userTextCol}>
                <Text style={styles.greetingTitle} numberOfLines={1}>
                  {(userName || 'Athlete').slice(0, 14)}
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
                  <Play size={13} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.notificationBtn}
                activeOpacity={0.75}
                onPress={() => setHasNotification(false)}
              >
                <Bell size={18} color="#FFFFFF" />
                {hasNotification && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            </View>
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
            source={activeRoutine.image || require('../../assets/workouts/day_0_push.png')}
            style={styles.heroImage}
          />

          {/* Deep Bottom Linear Vignette with Crystal Clear Top for Face Visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 4, 6, 0.15)', 'rgba(24, 7, 11, 0.72)', 'rgba(38, 10, 16, 0.96)']}
            locations={[0, 0.38, 0.72, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* Top Floating Badge Bar: Day 1 - Day 7 Indicator */}
          <View style={styles.heroTopBadgesRow}>
            <View
              style={[
                styles.schedulePill,
                isSelectedCompleted && styles.schedulePillCompleted,
                isSelectedInProgress && styles.schedulePillInProgress,
                isSelectedMissed && styles.schedulePillMissed,
                activeRoutine.isRest && styles.schedulePillRest
              ]}
            >
              {isSelectedCompleted ? (
                <Check size={12} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 5 }} />
              ) : isSelectedMissed ? (
                <X size={12} color="#EF4444" strokeWidth={2.8} style={{ marginRight: 5 }} />
              ) : (
                <Calendar size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
              )}

              <Text style={styles.schedulePillText}>
                {`Day ${activeRoutine.dayNum || (selectedDayIndex + 1)}` +
                  (isSelectedCompleted
                    ? ' · Completed'
                    : isSelectedInProgress
                    ? ` · In Progress (${activeWorkoutProgress?.percentComplete || 50}%)`
                    : isSelectedMissed
                    ? ' · Missed'
                    : isSelectedToday
                    ? ' · Today'
                    : '')}
              </Text>
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
            ) : null}
          </View>
        </TouchableOpacity>

        {/* 📊 3. "YOUR TRAINING SUMMARY" (7-Day Reactive Adherence Matrix) */}
        <View style={[styles.sectionHeaderRow, { marginTop: 26 }]}>
          <Text style={styles.sectionLabel}>YOUR TRAINING SUMMARY</Text>
        </View>

        <View style={styles.summaryCard}>
          {/* 🔴 Top Red Glow Fading to Pure Black at Bottom */}
          <LinearGradient
            colors={['#2E1117', '#1E0E13', '#131316', '#0A0A0C']}
            locations={[0, 0.28, 0.62, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

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
                    setSelectedDayIndex(idx);
                    setStatusTargetDateKey(dateStr);
                    setShowStatusModal(true);
                  }}
                >
                  {/* Top: Circular Status Node */}
                  <View
                    style={[
                      styles.matrixDayCell,
                      isCompleted && styles.matrixDayCellCompleted,
                      isMissed && styles.matrixDayCellMissed,
                      isInProgress && styles.matrixDayCellInProgress,
                      !isCompleted && !isMissed && !isInProgress && styles.matrixDayCellUnmarked,
                      isToday && styles.matrixDayCellToday,
                      isSelected && styles.matrixDayCellSelected
                    ]}
                  >
                    {isCompleted ? (
                      <Check size={15} color="#FFFFFF" strokeWidth={3} />
                    ) : isMissed ? (
                      <X size={15} color="#EF4444" strokeWidth={2.8} />
                    ) : isInProgress ? (
                      <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                    ) : isToday ? (
                      <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
                    ) : isRest ? (
                      <Moon size={12} color="#52525B" />
                    ) : (
                      <Dumbbell size={12} color="#3F3F46" />
                    )}
                  </View>

                  {/* Bottom: Day Letter (S, M, T, W, T, F, S) */}
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
                <Text style={styles.metricTotalSub}>/7</Text>
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
      </ScrollView>

      {/* 🖼️ Choose Avatar Full-Screen Modal (Ultra-Aesthetic & Professional) */}
      <Modal visible={showAvatarPicker} animationType="slide" transparent={false}>
        <View style={styles.chooseAvatarFullScreen}>
          <StatusBar barStyle="light-content" backgroundColor="#2A080E" />

          {/* 🔴 Top Red Shade -> Bottom Black Gradient for the entire Avatar Page */}
          <LinearGradient
            colors={['#2E0A10', '#1C060B', '#110407', '#09090B', '#09090B']}
            locations={[0, 0.18, 0.4, 0.7, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* Header Bar with Ambient Line */}
          <View style={styles.chooseAvatarHeader}>
            <TouchableOpacity
              style={styles.chooseAvatarBackBtn}
              onPress={() => setShowAvatarPicker(false)}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.chooseAvatarHeaderTitle}>CHOOSE AVATAR</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.chooseAvatarScroll}
            contentContainerStyle={styles.chooseAvatarScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Large Circular Hero Preview with Ambient Rings */}
            <View style={styles.topAvatarPreviewContainer}>
              <View style={styles.topAvatarGlowRing}>
                <LinearGradient
                  colors={['#48141F', '#2C0D14', '#15060A', '#08080A']}
                  locations={[0, 0.35, 0.7, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
                <View style={styles.topAvatarPreviewCircle}>
                  <Image
                    source={currentAvatar || AVATAR_PRESETS_DB[0].image}
                    style={styles.topAvatarPreviewImg}
                  />
                </View>
              </View>
            </View>

            {/* Premium Choose from Gallery Card */}
            <TouchableOpacity
              style={styles.chooseFromGalleryCard}
              onPress={handlePickFromGallery}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#1E1E24', '#141418']}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View style={styles.galleryIconCircle}>
                <UploadCloud size={20} color="#FFFFFF" />
              </View>
              <View style={styles.galleryTextCol}>
                <Text style={styles.galleryTitleText}>Upload from Gallery</Text>
                <Text style={styles.gallerySubText}>Select any photo from your device camera roll</Text>
              </View>
              <ImageIcon size={16} color="#71717A" />
            </TouchableOpacity>

            {/* Grid Header */}
            <View style={styles.avatarSectionHeaderRow}>
              <Text style={styles.avatarSectionTitle}>SELECT PRESET AVATAR</Text>
              <Text style={styles.avatarSectionCountBadge}>17 Avatars</Text>
            </View>

            {/* 3-Column Grid of 1:1 Circular Avatars with Top-Red Bottom-Black Theme */}
            <View style={styles.avatarGrid3Col}>
              {AVATAR_PRESETS_DB.map((preset) => {
                const isSelected = selectedAvatarId === preset.id || userAvatar === preset.image || localAvatar === preset.image;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.avatarGridTile,
                      isSelected && styles.avatarGridTileSelected
                    ]}
                    onPress={() => {
                      setSelectedAvatarId(preset.id);
                      setLocalAvatar(preset.image);
                      if (onUpdateAvatar) onUpdateAvatar(preset.image);
                    }}
                    activeOpacity={0.8}
                  >
                    {/* 🔴 Top Red Shade -> Bottom Black Gradient Background */}
                    <LinearGradient
                      colors={isSelected ? ['#44121C', '#280B11', '#140508', '#08080A'] : ['#2A0E13', '#1B090D', '#0F0507', '#08080A']}
                      locations={[0, 0.35, 0.7, 1]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                      pointerEvents="none"
                    />

                    <View style={[styles.avatarCircleWrapper, isSelected && styles.avatarCircleWrapperSelected]}>
                      <Image source={preset.image} style={styles.avatarCircleImg} />
                    </View>
                    {isSelected && (
                      <View style={styles.tileCheckBadge}>
                        <Check size={9} color="#09090B" strokeWidth={3.5} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* 🛡️ Change Status Modal on Home Screen */}
      <Modal visible={showStatusModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.statusModalBox}>
            <Text style={styles.statusModalTitle}>Change Workout Status</Text>
            <Text style={styles.statusModalSubtitle}>
              Select status for {statusTargetDateKey}:
            </Text>

            {(() => {
              const currentActive = dailyWorkoutStatuses[statusTargetDateKey] || 'unmarked';
              const isCurrCompleted = currentActive === 'completed';
              const isCurrMissed = currentActive === 'missed';
              const isCurrUnmarked = currentActive === 'unmarked';

              return (
                <View style={styles.statusOptionsList}>
                  {/* Option 1: Completed (Single ✓ Icon) */}
                  <TouchableOpacity
                    style={[
                      styles.statusOptionBtnCompleted,
                      isCurrCompleted && styles.statusOptionBtnCompletedActive
                    ]}
                    onPress={() => handleSetStatus('completed')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statusOptionLeft}>
                      <View style={[styles.statusIconCircle, styles.statusIconCircleCompleted, isCurrCompleted && styles.statusIconCircleActive]}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                      <Text style={[styles.statusOptionBtnText, isCurrCompleted && styles.statusOptionBtnTextActive]}>
                        Completed
                      </Text>
                    </View>
                    {isCurrCompleted && (
                      <View style={styles.activePillBadge}>
                        <Text style={styles.activePillText}>SELECTED</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Option 2: Missed (Single × Icon) */}
                  <TouchableOpacity
                    style={[
                      styles.statusOptionBtnMissed,
                      isCurrMissed && styles.statusOptionBtnMissedActive
                    ]}
                    onPress={() => handleSetStatus('missed')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statusOptionLeft}>
                      <View style={[styles.statusIconCircle, styles.statusIconCircleMissed, isCurrMissed && styles.statusIconCircleActive]}>
                        <X size={14} color="#EF4444" strokeWidth={3} />
                      </View>
                      <Text style={[styles.statusOptionBtnMissedText, isCurrMissed && styles.statusOptionBtnMissedTextActive]}>
                        Missed
                      </Text>
                    </View>
                    {isCurrMissed && (
                      <View style={[styles.activePillBadge, styles.activePillBadgeMissed]}>
                        <Text style={styles.activePillText}>SELECTED</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Option 3: Reset / Clear Status (RotateCcw Icon) */}
                  <TouchableOpacity
                    style={[
                      styles.statusOptionBtnClear,
                      isCurrUnmarked && styles.statusOptionBtnClearActive
                    ]}
                    onPress={() => handleSetStatus('unmarked')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statusOptionLeft}>
                      <View style={styles.statusIconCircleClear}>
                        <RotateCcw size={14} color="#A1A1AA" strokeWidth={2.4} />
                      </View>
                      <Text style={[styles.statusOptionBtnClearText, isCurrUnmarked && styles.statusOptionBtnClearTextActive]}>
                        Reset Status (Unmarked)
                      </Text>
                    </View>
                    {isCurrUnmarked && (
                      <View style={styles.activePillBadgeUnmarked}>
                        <Text style={styles.activePillTextUnmarked}>SELECTED</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowStatusModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
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
  headerGlassCapsule: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1C1C20',
    padding: 2,
    borderWidth: 1.5,
    borderColor: '#4A1D24',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
    resizeMode: 'cover'
  },
  avatarMiniSparkleBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#09090B'
  },
  userTextCol: {
    justifyContent: 'center'
  },
  greetingTitle: {
    color: '#D4D4D8',
    fontFamily: Platform.select({
      ios: 'AvenirNext-Medium',
      android: 'sans-serif',
      web: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      default: 'System'
    }),
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3
  },
  headerRightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  introVideoBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(40, 14, 20, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(28, 12, 16, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
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
    height: 360,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#38161E',
    backgroundColor: '#140609',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8
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
  heroImageDay6: {
    height: '118%',
    transform: [{ translateY: -36 }]
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
  heroSevenDaysPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 18, 0.78)',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 3
  },
  heroDayMiniChip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroDayMiniChipActive: {
    backgroundColor: '#E53935',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3
  },
  heroDayMiniChipToday: {
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
  heroDayMiniChipText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800'
  },
  heroDayMiniChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  heroDayMiniChipTextDone: {
    color: '#D4D4D8'
  },
  heroDayMiniChipTextMiss: {
    color: '#F87171'
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

  // 📊 Training Summary Card Styles (Top Red Glow Fading to Black)
  summaryCard: {
    backgroundColor: '#0A0A0C',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#32181E',
    padding: 18,
    overflow: 'hidden',
    position: 'relative'
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
    flex: 1,
    alignItems: 'center',
    gap: 6
  },
  dayLetterLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6
  },
  dayLetterToday: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  dayLetterSelected: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  matrixDayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#27272A'
  },
  matrixDayCellCompleted: {
    backgroundColor: '#27272A',
    borderWidth: 1.5,
    borderColor: '#52525B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  matrixDayCellMissed: {
    backgroundColor: 'rgba(220, 38, 38, 0.16)',
    borderWidth: 1.2,
    borderColor: '#7F1D1D'
  },
  matrixDayCellInProgress: {
    backgroundColor: '#7A0000',
    borderWidth: 2,
    borderColor: '#EF4444'
  },
  matrixDayCellUnmarked: {
    backgroundColor: '#16161A',
    borderWidth: 1.2,
    borderColor: '#24242A'
  },
  matrixDayCellToday: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    backgroundColor: '#1C1C20'
  },
  matrixDayCellSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2
  },
  matrixDayNumText: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '700'
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

  // 🖼️ Choose Avatar Full-Screen Styles
  chooseAvatarFullScreen: {
    flex: 1,
    backgroundColor: '#09090B',
    position: 'relative'
  },
  chooseAvatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)'
  },
  chooseAvatarBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16161A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A'
  },
  chooseAvatarHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.4
  },
  chooseAvatarScroll: {
    flex: 1
  },
  chooseAvatarScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 48,
    alignItems: 'center'
  },
  topAvatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  topAvatarGlowRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    padding: 3,
    backgroundColor: '#18181D',
    borderWidth: 1.5,
    borderColor: '#2F2F36',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8
  },
  topAvatarPreviewCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#52525B',
    overflow: 'hidden',
    backgroundColor: '#121214'
  },
  topAvatarPreviewImg: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover'
  },
  activeAvatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181D',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 6
  },
  activeAvatarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E'
  },
  activeAvatarPillText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  chooseFromGalleryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    width: '100%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#27272E',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20
  },
  galleryIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#22222A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#383844'
  },
  galleryTextCol: {
    flex: 1
  },
  galleryTitleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2
  },
  gallerySubText: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '500'
  },
  avatarSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 2
  },
  avatarSectionTitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  avatarSectionCountBadge: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700'
  },
  avatarGrid3Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10
  },
  avatarGridTile: {
    width: (SCREEN_WIDTH - 56) / 3,
    height: (SCREEN_WIDTH - 56) / 3,
    backgroundColor: '#0A0A0C',
    borderRadius: 20,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#301318',
    overflow: 'hidden',
    position: 'relative'
  },
  avatarGridTileSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8
  },
  avatarCircleWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: '#000000'
  },
  avatarCircleWrapperSelected: {
    transform: [{ scale: 1.02 }]
  },
  avatarCircleImg: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    resizeMode: 'cover'
  },
  tileCheckBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4
  },

  // 🛡️ Status Modal Styles
  statusModalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#2A2A32',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10
  },
  statusModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  statusModalSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18
  },
  statusOptionsList: {
    gap: 10,
    width: '100%'
  },
  statusOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  statusIconCircleCompleted: {
    backgroundColor: '#3F3F46'
  },
  statusIconCircleMissed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  statusIconCircleClear: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  statusIconCircleActive: {
    transform: [{ scale: 1.05 }]
  },
  statusOptionBtnCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C20',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2C2C32'
  },
  statusOptionBtnCompletedActive: {
    backgroundColor: '#27272A',
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6
  },
  statusOptionBtnText: {
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 14
  },
  statusOptionBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  statusOptionBtnMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C20',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2C2C32'
  },
  statusOptionBtnMissedActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6
  },
  statusOptionBtnMissedText: {
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 14
  },
  statusOptionBtnMissedTextActive: {
    color: '#EF4444',
    fontWeight: '800'
  },
  statusOptionBtnClear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181B',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  statusOptionBtnClearActive: {
    backgroundColor: '#202024',
    borderColor: '#52525B'
  },
  statusOptionBtnClearText: {
    color: '#A1A1AA',
    fontWeight: '600',
    fontSize: 13
  },
  statusOptionBtnClearTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  activePillBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  activePillText: {
    color: '#09090B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  activePillBadgeMissed: {
    backgroundColor: '#EF4444'
  },
  activePillBadgeUnmarked: {
    backgroundColor: '#3F3F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  activePillTextUnmarked: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  cancelBtn: {
    backgroundColor: '#1E1E24',
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C34',
    marginTop: 4
  },
  cancelBtnText: {
    color: '#A1A1AA',
    fontWeight: '700',
    fontSize: 13
  }
});
