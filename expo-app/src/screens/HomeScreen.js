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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  TrendingUp,
  ArrowLeft,
  Activity,
  ChevronRight
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';
import { WorkoutVolumeAnalytics } from '../components/WorkoutVolumeAnalytics';

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
  onOpenRoutineExercises,
  onOpenConsistency,
  onReplayIntroVideo
}) {
  // 🗓️ Real-time Monday-Indexed Day Detection (0 = Monday ... 6 = Sunday)
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7; // 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const getMondayStartOfWeek = (d = new Date()) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 is Sun, 1 is Mon...
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formattedName = useMemo(() => {
    if (!userName) return 'Athlete';
    return userName
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }, [userName]);

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTargetDateKey, setStatusTargetDateKey] = useState(todayKey);
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);
  const homeScrollRef = useRef(null);
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

  // Selected routine based on user interaction or today
  const activeRoutine = WEEKLY_ROUTINES_DB[selectedDayIndex] || WEEKLY_ROUTINES_DB[0];

  // 📊 Read Strict Unified Status from dailyWorkoutStatuses
  const selectedDateKey = (() => {
    const startOfWeek = getMondayStartOfWeek(now);
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + selectedDayIndex);
    return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
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

  // 🎯 Helper: Determine primary target muscle group for a routine
  const getRoutinePrimaryMuscle = (routine) => {
    if (!routine) return 'All';
    if (routine.exercises && routine.exercises.length > 0) {
      const firstEx = routine.exercises[0];
      if (firstEx && firstEx.muscle) {
        return firstEx.muscle;
      }
    }
    const text = `${routine.title || ''} ${routine.focus || ''} ${routine.splitLabel || ''}`.toLowerCase();
    if (text.includes('pull') || text.includes('back')) return 'Back';
    if (text.includes('push') || text.includes('chest')) return 'Chest';
    if (text.includes('leg') || text.includes('quad') || text.includes('glute') || text.includes('lower')) return 'Legs';
    if (text.includes('shoulder')) return 'Shoulders';
    if (text.includes('arm') || text.includes('bicep') || text.includes('tricep')) return 'Arms';
    if (text.includes('core') || text.includes('ab') || text.includes('mobility') || text.includes('recovery')) return 'Core';
    return 'All';
  };

  // 👆 Tap Handler: Redirects directly to the respective Exercises page with HD animations!
  const handleWorkoutBoxPress = () => {
    if (selectedDayIndex === todayIndex && isTodayInProgress && onResumeWorkout) {
      onResumeWorkout();
      return;
    }

    if (onOpenRoutineExercises) {
      onOpenRoutineExercises(activeRoutine);
      return;
    }

    const primaryMuscle = getRoutinePrimaryMuscle(activeRoutine);
    if (onSelectMuscle) {
      onSelectMuscle(primaryMuscle);
    } else if (onNavigateTab) {
      onNavigateTab('exercises');
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
    const startOfWeek = getMondayStartOfWeek(now);

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

  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 38));

  return (
    <>
      <ScrollView
        ref={homeScrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: safeTop + 10 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 👤 1. Top Header: Clean Professional User Profile & Streak Action */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.userProfileGroup}
            activeOpacity={0.8}
            onPress={() => setShowAvatarPicker(true)}
          >
            {/* Clean, borderless avatar without red corners or green dot */}
            <View style={styles.avatarContainer}>
              <Image
                source={currentAvatar}
                style={styles.avatarImage}
              />
            </View>

            {/* Refined Modern Typography */}
            <View style={styles.userTextCol}>
              <Text style={styles.welcomeSubLabel}>WELCOME BACK</Text>
              <Text style={styles.greetingTitle} numberOfLines={1}>
                {formattedName}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Right Action Button: Motivation / Streak Consistency Pill */}
          <View style={styles.headerRightActionsRow}>
            <TouchableOpacity
              style={styles.streakHeaderPill}
              activeOpacity={0.8}
              onPress={() => onOpenConsistency && onOpenConsistency()}
            >
              <Flame size={15} color="#F97316" fill="#F97316" />
              <Text style={styles.streakHeaderVal}>
                {metrics.completedCount > 0 ? `${metrics.completedCount}d` : '1d'}
              </Text>
              <Text style={styles.streakHeaderLabel}>STREAK</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ⚡ 2. Dynamic Day-Based "NEXT WORKOUT" Hero Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>
            {isSelectedInProgress ? 'WORKOUT IN PROGRESS' : isSelectedToday ? "TODAY'S WORKOUT" : 'SELECTED WORKOUT'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.heroCard,
            isSelectedInProgress && styles.heroCardInProgress,
            isSelectedCompleted && styles.heroCardCompleted,
            isSelectedMissed && styles.heroCardMissed
          ]}
          activeOpacity={0.9}
          onPress={handleWorkoutBoxPress}
        >
          {/* Background Athlete Image */}
          {activeRoutine.image && (
            <Image source={activeRoutine.image} style={styles.heroImage} resizeMode="cover" fadeDuration={0} />
          )}

          {/* Deep Cinematic Linear Vignette */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.15)', 'rgba(10, 10, 12, 0.75)', '#0D0D10']}
            locations={[0, 0.38, 0.72, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* Top Floating Badge Bar: Minimal Clean Day & Status */}
          <View style={styles.heroTopBadgesRow}>
            <View style={styles.heroDayTagPill}>
              <Text style={styles.heroDayTagText}>
                {`${activeRoutine.dayName?.toUpperCase() || 'TODAY'} • DAY ${activeRoutine.dayNum || (selectedDayIndex + 1)}`}
              </Text>
            </View>

            {isSelectedCompleted ? (
              <View style={styles.heroCompletedBadge}>
                <Check size={11} color="#10B981" strokeWidth={3} style={{ marginRight: 4 }} />
                <Text style={styles.heroCompletedText}>Completed</Text>
              </View>
            ) : isSelectedInProgress ? (
              <View style={styles.heroInProgressBadge}>
                <Activity size={11} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.heroInProgressText}>{activeWorkoutProgress?.percentComplete ?? 0}% Done</Text>
              </View>
            ) : null}
          </View>

          {/* Bottom Hero Info & Direct Exercise Action */}
          <View style={styles.heroBottomContent}>
            {/* Category / Target Muscle Tag */}
            <Text style={styles.heroFocusTag}>
              {(activeRoutine.splitLabel || activeRoutine.focus || 'STRENGTH').toUpperCase()}
            </Text>

            {/* Main Routine Title */}
            <Text style={styles.workoutMainTitle}>{activeRoutine.title}</Text>

            {/* In-Progress Progress Bar & Resume Button */}
            {isSelectedInProgress && !!activeWorkoutProgress ? (
              <View style={styles.inProgressContainer}>
                <View style={styles.progressLineBg}>
                  <View
                    style={[
                      styles.progressLineFill,
                      { width: `${Math.max(0, activeWorkoutProgress.percentComplete || 0)}%` }
                    ]}
                  />
                </View>
                <View style={styles.resumeBtnRow}>
                  <Text style={styles.resumeSubText}>
                    {activeWorkoutProgress.completedCount || 0} / {activeWorkoutProgress.totalCount || activeRoutine.exercises.length} exercises done
                  </Text>
                  <View style={styles.resumeBadgeBtn}>
                    <Play size={10} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.resumeBadgeBtnText}>RESUME</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.heroMetaActionRow}>
                <Text style={styles.heroMetaText}>
                  {(activeRoutine.exercises || []).length} Exercises • {activeRoutine.durationMin} min
                </Text>
                <TouchableOpacity
                  style={styles.heroActionCue}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    handleWorkoutBoxPress();
                  }}
                >
                  <Play size={9} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.heroActionCueText}>Exercises</Text>
                  <ChevronRight size={12} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* 📊 3. "YOUR TRAINING SUMMARY" (7-Day Reactive Adherence Matrix: Monday - Sunday) */}
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

          {/* 7-Day Status Circles Strip (Monday - Sunday: [M, T, W, T, F, S, S]) */}
          <View style={styles.daysStripContainer}>
            {WEEKLY_ROUTINES_DB.map((item, idx) => {
              const startOfWeek = getMondayStartOfWeek(now);
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
                    homeScrollRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.dayName}: ${item.title}`}
                  accessibilityState={{ selected: isSelected }}
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
                      <Play size={11} color="#EF4444" fill="#EF4444" />
                    ) : isRest ? (
                      <Moon size={12} color="#71717A" />
                    ) : (
                      <View style={styles.emptyDayInnerDot} />
                    )}
                  </View>

                  {/* Bottom: Day Letter (M, T, W, T, F, S, S) */}
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

        {/* 📊 5. Sleek Performance Studio Portal Card */}
        <TouchableOpacity
          style={styles.analyticsPortalCard}
          activeOpacity={0.85}
          onPress={() => onNavigateTab && onNavigateTab('analytics')}
        >
          <View style={styles.analyticsPortalLeft}>
            <View style={styles.analyticsPortalIconBox}>
              <TrendingUp size={20} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.analyticsPortalBadge}>
                <Text style={styles.analyticsPortalBadgeText}>PRO ATHLETE INTELLIGENCE</Text>
              </View>
              <Text style={styles.analyticsPortalTitle}>Performance Studio</Text>
              <Text style={styles.analyticsPortalSub}>
                Workout trends, consistency & saved history
              </Text>
            </View>
          </View>
          <ArrowUpRight size={18} color="#71717A" />
        </TouchableOpacity>

        {/* 🏋️ EXERCISE LIBRARY HERO BANNER */}
        <TouchableOpacity
          style={styles.exerciseBannerCard}
          activeOpacity={0.88}
          onPress={() => onNavigateTab && onNavigateTab('videos')}
        >
          {/* Thumbnail strip */}
          <View style={styles.exerciseBannerThumbs}>
            <Image
              source={require('../../assets/exercise_thumbnails/barbell_squats_small.jpg')}
              style={styles.exerciseBannerThumb}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/exercise_thumbnails/deadlift_small.jpg')}
              style={[styles.exerciseBannerThumb, styles.exerciseBannerThumbMid]}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/exercise_thumbnails/barbell_bench_press_small.jpg')}
              style={styles.exerciseBannerThumb}
              resizeMode="cover"
            />
          </View>

          {/* Dark gradient over thumbnails */}
          <LinearGradient
            colors={['rgba(9,9,11,0)', 'rgba(9,9,11,0.55)', 'rgba(9,9,11,0.96)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* Content overlay */}
          <View style={styles.exerciseBannerContent}>
            <View style={styles.exerciseBannerBadge}>
              <Play size={9} color="#fff" fill="#fff" />
              <Text style={styles.exerciseBannerBadgeText}>17 EXERCISE VIDEOS</Text>
            </View>
            <Text style={styles.exerciseBannerTitle}>Exercise Library</Text>
            <Text style={styles.exerciseBannerSub}>
              Full-screen video guides for every muscle group
            </Text>
            <View style={styles.exerciseBannerCTA}>
              <Text style={styles.exerciseBannerCTAText}>Browse All Exercises</Text>
              <ChevronRight size={14} color="#EF4444" strokeWidth={2.5} />
            </View>
          </View>
        </TouchableOpacity>

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

      {/* 🛡️ Compact Change Status Modal Centered on Screen */}
      <Modal visible={showStatusModal} animationType="fade" transparent onRequestClose={() => setShowStatusModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusModal(false)}
        >
          <TouchableOpacity
            style={styles.statusModalBox}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Top Red Gradient Atmosphere Header */}
            <LinearGradient
              colors={['#2D0B12', '#1A080C', '#121215']}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />

            <Text style={styles.statusModalTitle}>Workout Status</Text>
            <Text style={styles.statusModalSubtitle}>
              {statusTargetDateKey}
            </Text>

            {(() => {
              const currentActive = dailyWorkoutStatuses[statusTargetDateKey] || 'unmarked';
              const isCurrCompleted = currentActive === 'completed';
              const isCurrMissed = currentActive === 'missed';
              const isCurrUnmarked = currentActive === 'unmarked';

              return (
                <View style={styles.statusOptionsList}>
                  {/* Option 1: Completed */}
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
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
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

                  {/* Option 2: Missed */}
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
                        <X size={12} color="#EF4444" strokeWidth={3} />
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

                  {/* Option 3: Reset / Clear Status */}
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
                        <RotateCcw size={12} color="#A1A1AA" strokeWidth={2.4} />
                      </View>
                      <Text style={[styles.statusOptionBtnClearText, isCurrUnmarked && styles.statusOptionBtnClearTextActive]}>
                        Reset (Unmarked)
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
          </TouchableOpacity>
        </TouchableOpacity>
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
    paddingBottom: 110
  },

  // 👤 Header Styles
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    paddingHorizontal: 2
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C20',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    resizeMode: 'cover'
  },
  userTextCol: {
    justifyContent: 'center'
  },
  welcomeSubLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase'
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'sans-serif-medium',
      web: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      default: 'System'
    }),
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  headerRightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  streakHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  streakHeaderVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  streakHeaderLabel: {
    color: '#F97316',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
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
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#141416',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6
  },
  heroCardInProgress: {
    borderColor: '#3F3F46'
  },
  heroCardCompleted: {
    borderColor: '#3F3F46'
  },
  heroCardMissed: {
    borderColor: '#3F3F46'
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
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
    alignItems: 'center',
    zIndex: 10
  },
  heroDayTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(18, 18, 22, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)'
  },
  heroDayTagText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  heroCompletedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)'
  },
  heroCompletedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  heroInProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)'
  },
  heroInProgressText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10
  },
  heroFocusTag: {
    color: '#F43F5E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 30
  },
  heroMetaActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  heroMetaText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600'
  },
  heroActionCue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 3,
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heroActionCueText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2
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
  emptyDayInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46'
  },
  matrixDayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#141417',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.76)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28
  },
  statusModalBox: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#141418',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10
  },
  statusModalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2
  },
  statusModalSubtitle: {
    color: '#A1A1AA',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12
  },
  statusOptionsList: {
    gap: 8,
    width: '100%'
  },
  statusOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  statusIconCircleCompleted: {
    backgroundColor: '#22C55E'
  },
  statusIconCircleMissed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)'
  },
  statusIconCircleClear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  statusIconCircleActive: {
    transform: [{ scale: 1.05 }]
  },
  statusOptionBtnCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 28, 34, 0.9)',
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2A2A32'
  },
  statusOptionBtnCompletedActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E'
  },
  statusOptionBtnText: {
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 13
  },
  statusOptionBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  statusOptionBtnMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 28, 34, 0.9)',
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2A2A32'
  },
  statusOptionBtnMissedActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444'
  },
  statusOptionBtnMissedText: {
    color: '#D4D4D8',
    fontWeight: '700',
    fontSize: 13
  },
  statusOptionBtnMissedTextActive: {
    color: '#EF4444',
    fontWeight: '800'
  },
  statusOptionBtnClear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 24, 28, 0.9)',
    height: 38,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#242428'
  },
  statusOptionBtnClearActive: {
    backgroundColor: '#202024',
    borderColor: '#52525B'
  },
  statusOptionBtnClearText: {
    color: '#A1A1AA',
    fontWeight: '600',
    fontSize: 12
  },
  statusOptionBtnClearTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  activePillBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  activePillBadgeMissed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)'
  },
  activePillBadgeUnmarked: {
    backgroundColor: 'rgba(161, 161, 170, 0.2)'
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  activePillTextUnmarked: {
    color: '#A1A1AA',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  cancelBtn: {
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2
  },
  cancelBtnText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },
  analyticsPortalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121214',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginTop: 14,
    marginBottom: 8
  },
  analyticsPortalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12
  },
  analyticsPortalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  analyticsPortalBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 3
  },
  analyticsPortalBadgeText: {
    color: '#EF4444',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  analyticsPortalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  analyticsPortalSub: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1
  },
  // ── Exercise Library Banner ──
  exerciseBannerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    height: 180,
    position: 'relative',
  },
  exerciseBannerThumbs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  exerciseBannerThumb: {
    flex: 1,
    height: '100%',
  },
  exerciseBannerThumbMid: {
    marginHorizontal: 2,
  },
  exerciseBannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  exerciseBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EF4444',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  exerciseBannerBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  exerciseBannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 3,
  },
  exerciseBannerSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  exerciseBannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseBannerCTAText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
