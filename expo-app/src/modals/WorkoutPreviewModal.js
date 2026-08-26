import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Clock,
  Zap,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  Flame
} from 'lucide-react-native';
import { C } from '../constants/theme';

export function WorkoutPreviewModal({
  visible,
  routine,
  onClose,
  onStartWorkout,
  onSelectExercise
}) {
  if (!routine) return null;

  const exercises = routine.exercises || [];
  const exerciseCount = exercises.length;
  const estimatedDuration = routine.durationMin || 45;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Ambient Top Crimson Glow */}
        <LinearGradient
          colors={['#420C12', '#1C0508', '#09090B']}
          locations={[0, 0.35, 0.85]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <SafeAreaView style={{ flex: 1 }}>
          {/* Top Bar Header */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topBarTitleCol}>
              <Text style={styles.topBarMainTitle}>{routine.title}</Text>
              <Text style={styles.topBarSubInfo}>
                {exerciseCount} exercises · {estimatedDuration} min
              </Text>
            </View>

            <View style={{ width: 42 }} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Visual Card */}
            <View style={styles.heroBannerWrapper}>
              <Image
                source={routine.image || require('../../assets/athlete_hero.jpg')}
                style={styles.heroBannerImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(9, 9, 11, 0.5)', 'rgba(9, 9, 11, 0.96)']}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFillObject}
              />

              <View style={styles.heroBannerContent}>
                <View style={styles.heroTagRow}>
                  <View style={styles.splitTag}>
                    <Text style={styles.splitTagText}>{routine.splitLabel || 'Push Hypertrophy'}</Text>
                  </View>
                  <Text style={styles.weekTagText}>Week 3 · Day {routine.dayNum || 1}</Text>
                </View>

                <Text style={styles.heroMainHeadline}>{routine.title}</Text>
                <Text style={styles.heroSubHeadline}>{routine.focus || 'Chest, Shoulders & Triceps'}</Text>
              </View>
            </View>

            {/* Quick Metrics Bar */}
            <View style={styles.metricsBarRow}>
              <View style={styles.metricPill}>
                <Zap size={14} color="#FBBF24" />
                <Text style={styles.metricPillText}>{exerciseCount} Exercises</Text>
              </View>
              <View style={styles.metricPill}>
                <Clock size={14} color="#A1A1AA" />
                <Text style={styles.metricPillText}>{estimatedDuration} Mins</Text>
              </View>
              <View style={styles.metricPill}>
                <Flame size={14} color="#EF4444" />
                <Text style={styles.metricPillText}>~350 kcal</Text>
              </View>
            </View>

            {/* Section: Exercise Queue */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>EXERCISE QUEUE</Text>
              <Text style={styles.sectionSubCount}>{exerciseCount} movements</Text>
            </View>

            <View style={styles.exerciseListContainer}>
              {exercises.map((item, index) => {
                const totalSets = item.sets?.length || 3;
                const repRange = item.sets?.[0]?.reps || 10;
                const startingWeight = item.sets?.[0]?.weight || 50;

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={styles.exerciseCard}
                    activeOpacity={0.8}
                    onPress={() => onSelectExercise && onSelectExercise(item)}
                  >
                    {/* Index Number Badge */}
                    <View style={styles.indexCircle}>
                      <Text style={styles.indexCircleText}>{index + 1}</Text>
                    </View>

                    {/* Thumbnail */}
                    {item.thumbUrl ? (
                      <Image
                        source={{ uri: item.thumbUrl }}
                        style={styles.exerciseThumb}
                      />
                    ) : (
                      <View style={styles.exerciseThumbPlaceholder}>
                        <Dumbbell size={20} color="#71717A" />
                      </View>
                    )}

                    {/* Info Column */}
                    <View style={styles.exerciseInfoCol}>
                      <Text style={styles.exerciseNameText} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.exerciseSetDetailText}>
                        {totalSets} sets × {repRange} reps · {startingWeight} kg
                      </Text>
                      <View style={styles.targetMuscleChip}>
                        <Text style={styles.targetMuscleChipText}>{item.muscle || 'Target'}</Text>
                      </View>
                    </View>

                    {/* Right Chevron */}
                    <ChevronRight size={18} color="#52525B" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Sticky Bottom Start Button */}
          <View style={styles.bottomBarContainer}>
            <TouchableOpacity
              style={styles.startWorkoutCtaBtn}
              activeOpacity={0.88}
              onPress={() => {
                onClose();
                onStartWorkout(routine);
              }}
            >
              <LinearGradient
                colors={['#DC2626', '#991B1B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startWorkoutGradient}
              >
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.startWorkoutCtaText}>Start Workout Session</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1C1C20',
    borderWidth: 1,
    borderColor: '#2A2A30',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBarTitleCol: {
    alignItems: 'center'
  },
  topBarMainTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800'
  },
  topBarSubInfo: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110
  },
  heroBannerWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#141416'
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  heroBannerContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  splitTag: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  splitTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  weekTagText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600'
  },
  heroMainHeadline: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4
  },
  heroSubHeadline: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  metricsBarRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  metricPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#141416',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#242428'
  },
  metricPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12
  },
  sectionHeading: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  sectionSubCount: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600'
  },
  exerciseListContainer: {
    gap: 12
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#242428'
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E1E22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  indexCircleText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '800'
  },
  exerciseThumb: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#1E1E22',
    marginRight: 14
  },
  exerciseThumbPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#1E1E22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  exerciseInfoCol: {
    flex: 1
  },
  exerciseNameText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  exerciseSetDetailText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3
  },
  targetMuscleChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E1E22',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6
  },
  targetMuscleChipText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#09090B'
  },
  startWorkoutCtaBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    overflow: 'hidden'
  },
  startWorkoutGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  startWorkoutCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2
  }
});
