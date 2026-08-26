import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react-native';
import { WEEKLY_ROUTINES_DB } from '../data/exercisesDb';

const { width } = Dimensions.get('window');

const PRESET_AVATARS = [
  { id: '1', name: 'Athlete 1', source: require('../../assets/athlete_hero.jpg') },
  { id: '2', name: 'Athlete 2', source: require('../../assets/athlete_hero_2.jpg') },
  { id: '3', name: 'Lat Pulldown', source: require('../../assets/auth_lat_pulldown.jpg') },
  { id: '4', name: 'Slide 1', source: require('../../assets/auth_slide_1.jpg') }
];

export function HomeScreen({
  userName = 'David',
  userAvatar,
  onUpdateAvatar,
  workoutHistory = [],
  onNavigateTab,
  onStartWorkout,
  onPreviewWorkout,
  onSelectMuscle,
  onOpenConsistency
}) {
  const [hasNotification, setHasNotification] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(userAvatar || PRESET_AVATARS[0].source);

  // Active avatar reference
  const currentAvatar = userAvatar || localAvatar;

  // 📸 1. Launch Camera to take a new picture
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

  // 🖼️ 2. Open Photo Gallery to pick existing picture
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
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);

  // Selected routine based on user interaction or today
  const activeRoutine = WEEKLY_ROUTINES_DB[selectedDayIndex] || WEEKLY_ROUTINES_DB[0];

  // 📊 Calculate Reactive Real-time Metrics from workoutHistory
  const metrics = useMemo(() => {
    // Filter workouts from this current week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday of this week
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekWorkouts = workoutHistory.filter((w) => {
      if (!w.date) return false;
      const wDate = new Date(w.date);
      return wDate >= startOfWeek;
    });

    const completedCount = thisWeekWorkouts.length;
    const targetCount = 4; // 4-day workout target
    const onTrackPercent = Math.min(100, Math.round((completedCount / targetCount) * 100));

    // Sum total duration
    const totalSecs = thisWeekWorkouts.reduce((sum, w) => sum + (w.durationSeconds || 2700), 0);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const formattedDuration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    // Sum total exercises
    const totalExercises = thisWeekWorkouts.reduce((sum, w) => sum + (w.exercisesCount || (w.exercises?.length || 4)), 0);

    // Days completed map (0-6)
    const completedDaysMap = {};
    thisWeekWorkouts.forEach((w) => {
      if (w.date) {
        const d = new Date(w.date).getDay();
        completedDaysMap[d] = true;
      }
    });

    return {
      completedCount,
      targetCount,
      onTrackPercent,
      formattedDuration: completedCount > 0 ? formattedDuration : '0m',
      totalExercises: completedCount > 0 ? totalExercises : 0,
      completedDaysMap
    };
  }, [workoutHistory]);

  // Check if today's workout has been completed
  const isTodayCompleted = metrics.completedDaysMap[todayIndex];

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
            {/* Avatar on the Left with Camera Indicator */}
            <View style={styles.avatarContainer}>
              <Image
                source={currentAvatar}
                style={styles.avatarImage}
              />
              <View style={styles.onlineBadge} />
              <View style={styles.cameraIconBadge}>
                <Camera size={10} color="#FFFFFF" />
              </View>
            </View>

            {/* Username on the Right */}
            <View style={styles.userTextCol}>
              <Text style={styles.greetingTitle}>{userName || 'David'}</Text>
              <Text style={styles.greetingSubtitle}>Ready to train?</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationBtn}
            activeOpacity={0.75}
            onPress={() => setHasNotification(false)}
          >
            <Bell size={19} color="#FFFFFF" />
            {hasNotification && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>

        {/* ⚡ 2. Hero "NEXT WORKOUT" Card (Dynamic & Interactive) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>NEXT WORKOUT</Text>
        </View>

        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => {
            if (onPreviewWorkout) {
              onPreviewWorkout(activeRoutine);
            } else if (onStartWorkout) {
              onStartWorkout(activeRoutine);
            }
          }}
        >
          {/* Background Athlete Image */}
          <Image
            source={activeRoutine.image || require('../../assets/athlete_hero.jpg')}
            style={styles.heroImage}
          />

          {/* Deep Bottom Linear Vignette for High-Contrast Typography */}
          <LinearGradient
            colors={['rgba(9, 9, 11, 0.15)', 'rgba(9, 9, 11, 0.55)', 'rgba(9, 9, 11, 0.96)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* Top Floating Badge Bar */}
          <View style={styles.heroTopBadgesRow}>
            {/* Dynamic Schedule Countdown Pill */}
            <View
              style={[
                styles.schedulePill,
                isTodayCompleted && styles.schedulePillCompleted,
                activeRoutine.isRest && styles.schedulePillRest
              ]}
            >
              <Calendar size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
              <Text style={styles.schedulePillText}>
                {isTodayCompleted
                  ? 'Completed Today 🎉'
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

          {/* Bottom Hero Info */}
          <View style={styles.heroBottomContent}>
            <Text style={styles.workoutMainTitle}>{activeRoutine.title}</Text>
            <Text style={styles.workoutSubInfo}>
              Week 3 · Day {activeRoutine.dayNum || 1} · {activeRoutine.focus}
            </Text>

            {/* Quick Action Hint */}
            <View style={styles.tapToPreviewRow}>
              <Text style={styles.tapToPreviewText}>Tap to preview exercises & start ▶</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 📊 3. "YOUR TRAINING SUMMARY" (7-Day Reactive Adherence Matrix) */}
        <View style={[styles.sectionHeaderRow, { marginTop: 26 }]}>
          <Text style={styles.sectionLabel}>YOUR TRAINING SUMMARY</Text>
        </View>

        <View style={styles.summaryCard}>
          {/* Header Row */}
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
              const isCompleted = metrics.completedDaysMap[idx];
              const isToday = idx === todayIndex;
              const isRest = item.isRest;
              const isMissed = !isCompleted && !isRest && idx < todayIndex;
              const isSelected = selectedDayIndex === idx;

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.dayCol}
                  activeOpacity={0.75}
                  onPress={() => setSelectedDayIndex(idx)}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isCompleted && styles.dayCircleCompleted,
                      isRest && !isCompleted && styles.dayCircleRest,
                      isMissed && styles.dayCircleMissed,
                      isToday && !isCompleted && styles.dayCircleToday,
                      isSelected && styles.dayCircleSelected
                    ]}
                  >
                    {isCompleted ? (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    ) : isRest ? (
                      <Moon size={13} color="#71717A" />
                    ) : isMissed ? (
                      <X size={13} color="#FFFFFF" strokeWidth={2.5} />
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

        {/* 📈 4. Weekly Quick Stats Dual Cards (Reactive) */}
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

      {/* 🖼️ Premium Athlete Profile Photo Customizer Modal */}
      <Modal visible={showAvatarPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Update Profile Photo</Text>
                <Text style={styles.modalSubtitle}>Personalize your LIFT athlete identity</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAvatarPicker(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Action Buttons: Camera & Gallery */}
            <View style={styles.pickerActionsContainer}>
              {/* Take Photo */}
              <TouchableOpacity
                style={styles.pickerActionBtn}
                onPress={handleTakePhoto}
                activeOpacity={0.8}
              >
                <View style={[styles.pickerIconWrapper, { backgroundColor: '#7A0000' }]}>
                  <Camera size={22} color="#FFFFFF" />
                </View>
                <View style={styles.pickerTextCol}>
                  <Text style={styles.pickerActionTitle}>Take Photo</Text>
                  <Text style={styles.pickerActionSub}>Open camera to take a picture</Text>
                </View>
                <ChevronRight size={18} color="#71717A" />
              </TouchableOpacity>

              {/* Choose From Gallery */}
              <TouchableOpacity
                style={styles.pickerActionBtn}
                onPress={handlePickFromGallery}
                activeOpacity={0.8}
              >
                <View style={[styles.pickerIconWrapper, { backgroundColor: '#1E1E24', borderColor: '#3F3F46', borderWidth: 1 }]}>
                  <ImageIcon size={22} color="#FFFFFF" />
                </View>
                <View style={styles.pickerTextCol}>
                  <Text style={styles.pickerActionTitle}>Choose from Gallery</Text>
                  <Text style={styles.pickerActionSub}>Select a photo from your library</Text>
                </View>
                <ChevronRight size={18} color="#71717A" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.pickerDividerRow}>
              <View style={styles.pickerDividerLine} />
              <Text style={styles.pickerDividerText}>OR CHOOSE ATHLETE AVATAR</Text>
              <View style={styles.pickerDividerLine} />
            </View>

            {/* Preset Avatars Grid */}
            <View style={styles.avatarGrid}>
              {PRESET_AVATARS.map((item) => {
                const isSelected = currentAvatar === item.source;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.avatarOptionWrapper,
                      isSelected && styles.avatarOptionWrapperActive
                    ]}
                    onPress={() => {
                      setLocalAvatar(item.source);
                      if (onUpdateAvatar) onUpdateAvatar(item.source);
                      setShowAvatarPicker(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image source={item.source} style={styles.avatarOptionImg} />
                    {isSelected && (
                      <View style={styles.avatarCheckBadge}>
                        <Check size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* View Full Profile Action */}
            <TouchableOpacity
              style={styles.viewProfileShortcutBtn}
              onPress={() => {
                setShowAvatarPicker(false);
                if (onNavigateTab) onNavigateTab('profile');
              }}
              activeOpacity={0.8}
            >
              <User size={16} color="#A1A1AA" />
              <Text style={styles.viewProfileShortcutText}>View Full Athlete Profile</Text>
            </TouchableOpacity>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#3F3F46'
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#09090B'
  },
  cameraIconBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B31F1F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#09090B'
  },
  userTextCol: {
    justifyContent: 'center'
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  greetingSubtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
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
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#141416'
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
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  schedulePillCompleted: {
    backgroundColor: '#10B981'
  },
  schedulePillRest: {
    backgroundColor: '#0284C7'
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
    bottom: 16,
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
    marginTop: 4
  },
  tapToPreviewRow: {
    marginTop: 6
  },
  tapToPreviewText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700'
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
    backgroundColor: '#10B981'
  },
  dayCircleRest: {
    backgroundColor: '#1E1E22',
    borderWidth: 1,
    borderColor: '#2C2C32'
  },
  dayCircleMissed: {
    backgroundColor: '#DC2626'
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#1E1B4B'
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
    color: '#818CF8',
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

  // 🖼️ Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#141416',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 44,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  modalSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pickerActionsContainer: {
    gap: 12,
    marginBottom: 16
  },
  pickerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C20',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A32',
    gap: 14
  },
  pickerIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pickerTextCol: {
    flex: 1
  },
  pickerActionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  pickerActionSub: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500'
  },
  pickerDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10
  },
  pickerDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272A'
  },
  pickerDividerText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  avatarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    marginTop: 4,
    marginBottom: 18
  },
  avatarOptionWrapper: {
    position: 'relative',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  avatarOptionWrapperActive: {
    borderColor: '#EF4444'
  },
  avatarOptionImg: {
    width: '100%',
    height: '100%',
    borderRadius: 33
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#141416'
  },
  viewProfileShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E1E24',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2E2E36'
  },
  viewProfileShortcutText: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '700'
  }
});
