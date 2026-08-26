import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Clock,
  Zap,
  Sparkles,
  Check,
  CheckCircle2,
  Dumbbell,
  Volume2
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 🏋️ 1. Full-Bleed Athlete Photo Header (Matches Dribbble Shot Exactly) */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={routine.image || require('../../assets/athlete_hero.jpg')}
              style={styles.heroImage}
            />

            {/* Smooth Vignette Gradient for High Contrast */}
            <LinearGradient
              colors={['rgba(9, 9, 11, 0.4)', 'rgba(9, 9, 11, 0.1)', 'rgba(9, 9, 11, 0.75)', '#09090B']}
              locations={[0, 0.35, 0.75, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Floating Top Bar Buttons */}
            <SafeAreaView edges={['top']} style={styles.floatingTopBar}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.circularGlassBtn}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circularGlassBtn}
                activeOpacity={0.7}
              >
                <Sparkles size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </SafeAreaView>

            {/* Title & Badges Overlaid at Bottom of Photo */}
            <View style={styles.photoOverlayContent}>
              <Text style={styles.workoutMainTitle}>{routine.title}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.frostedMetaBadge}>
                  <Zap size={13} color="#FBBF24" style={{ marginRight: 4 }} />
                  <Text style={styles.frostedMetaText}>{exerciseCount} exercises</Text>
                </View>

                <View style={styles.frostedMetaBadge}>
                  <Clock size={13} color="#A1A1AA" style={{ marginRight: 4 }} />
                  <Text style={styles.frostedMetaText}>{estimatedDuration} min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 🔴 2. Primary CTA: Red "Start workout" Button */}
          <View style={styles.ctaSectionContainer}>
            <TouchableOpacity
              style={styles.startWorkoutBtn}
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
                <Text style={styles.startWorkoutBtnText}>Start workout</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Week & Day Breadcrumb */}
            <Text style={styles.weekDayBreadcrumb}>
              Week 3 · Day {routine.dayNum || 2}
            </Text>
          </View>

          {/* 📋 3. Exercise Queue Cards (Matching Dribbble Right Screen Layout) */}
          <View style={styles.exerciseQueueList}>
            {exercises.map((item, index) => {
              const totalSets = item.sets?.length || 4;
              const repRange = item.sets?.[0]?.reps || 8;
              const weightKg = item.sets?.[0]?.weight || 70;
              const isCompleted = index === 0; // Highlight first as completed for preview realism

              return (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.exerciseCard}
                  activeOpacity={0.8}
                  onPress={() => onSelectExercise && onSelectExercise(item)}
                >
                  {/* Top-Left Completed Badge (If Completed) */}
                  {isCompleted && (
                    <View style={styles.completedBadgePill}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                      <Text style={styles.completedBadgeText}>Completed</Text>
                    </View>
                  )}

                  <View style={styles.cardInnerRow}>
                    {/* Left: 3D Illustration / Diagram */}
                    <View style={styles.diagramContainer}>
                      {item.thumbUrl ? (
                        <Image
                          source={{ uri: item.thumbUrl }}
                          style={styles.diagramImage}
                        />
                      ) : (
                        <View style={styles.diagramPlaceholder}>
                          <Dumbbell size={24} color="#71717A" />
                        </View>
                      )}
                    </View>

                    {/* Right: Exercise Prescription Details */}
                    <View style={styles.cardDetailsCol}>
                      <Text style={styles.cardExerciseName}>{item.name}</Text>
                      <Text style={styles.cardMuscleSubtitle}>
                        {item.muscle || 'Chest, Triceps'}
                      </Text>

                      <View style={styles.cardSetsRow}>
                        <Text style={styles.cardSetsText}>
                          {totalSets} sets · {repRange} reps · {weightKg}kg
                        </Text>
                      </View>

                      <Text style={styles.cardRestText}>90s rest</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 60
  },

  // 🏋️ Hero Image Header
  heroImageWrapper: {
    width: '100%',
    height: 330,
    position: 'relative',
    backgroundColor: '#141416'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  floatingTopBar: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 20
  },
  circularGlassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(28, 28, 32, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoOverlayContent: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    zIndex: 10
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10
  },
  frostedMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 32, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  frostedMetaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  // 🔴 CTA Section
  ctaSectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center'
  },
  startWorkoutBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8
  },
  startWorkoutGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  startWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  weekDayBreadcrumb: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14
  },

  // 📋 Exercise Queue
  exerciseQueueList: {
    paddingHorizontal: 20,
    gap: 14
  },
  exerciseCard: {
    backgroundColor: '#141416',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 16,
    position: 'relative'
  },
  completedBadgePill: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  cardInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  diagramContainer: {
    width: 100,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#1E1E22',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 16
  },
  diagramImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  diagramPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardDetailsCol: {
    flex: 1
  },
  cardExerciseName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  cardMuscleSubtitle: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  cardSetsRow: {
    marginTop: 6
  },
  cardSetsText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '700'
  },
  cardRestText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  }
});
