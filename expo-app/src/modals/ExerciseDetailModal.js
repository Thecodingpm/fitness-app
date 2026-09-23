import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { C } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * 🏋️ Clean Exercise Detail Modal
 * Displays high-definition exercise visuals, biomechanics, target muscles, and form tips.
 */
export function ExerciseDetailModal({ exercise, onClose, onStartExercise }) {
  if (!exercise) return null;

  const primaryMuscle = exercise.targetMuscles?.[0];

  return (
    <Modal visible={!!exercise} animationType="slide" transparent={false} statusBarTranslucent>
      <SafeAreaView style={styles.modalBg} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" />

        {/* Header: Back Button & Muscle Badge */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose} style={styles.iconCircle} activeOpacity={0.7}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.muscleBadge}>
            <Text style={styles.muscleBadgeText}>{exercise.muscle?.toUpperCase() || 'EXERCISE'}</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Exercise Title & Equipment */}
          <View style={styles.titleSection}>
            <Text style={styles.detailTitle}>{exercise.name}</Text>
            <Text style={styles.detailEquipment}>
              {exercise.equipment || 'Free Weights'} • {exercise.tempo || '3-1-1-0'}
            </Text>
          </View>

          {/* 🖼️ High-Definition Visual Showcase Frame */}
          <View style={styles.videoCardWrapper}>
            <View style={styles.videoCard}>
              <Image
                source={exercise.image || require('../../assets/workouts/legs_and_core.png')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Target Muscles */}
          {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeader}>TARGET MUSCLES</Text>
              <View style={styles.muscleTagsRow}>
                {exercise.targetMuscles.map((m, idx) => (
                  <View key={idx} style={[styles.musclePill, idx === 0 && styles.musclePillPrimary]}>
                    <Text style={[styles.musclePillText, idx === 0 && styles.musclePillTextPrimary]}>
                      {m.name} {m.role ? `(${m.role})` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Biomechanics & Form Cues */}
          {exercise.biomechanics && (
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeaderRow}>
                <Sparkles size={14} color="#EF4444" />
                <Text style={styles.sectionHeader}>BIOMECHANICS & FORM</Text>
              </View>
              {exercise.biomechanics.jointAngle && (
                <View style={styles.cueRow}>
                  <CheckCircle2 size={14} color="#22C55E" style={{ marginTop: 2 }} />
                  <Text style={styles.cueText}>{exercise.biomechanics.jointAngle}</Text>
                </View>
              )}
              {exercise.biomechanics.barPath && (
                <View style={styles.cueRow}>
                  <CheckCircle2 size={14} color="#22C55E" style={{ marginTop: 2 }} />
                  <Text style={styles.cueText}>{exercise.biomechanics.barPath}</Text>
                </View>
              )}
              {exercise.biomechanics.footwork && (
                <View style={styles.cueRow}>
                  <CheckCircle2 size={14} color="#22C55E" style={{ marginTop: 2 }} />
                  <Text style={styles.cueText}>{exercise.biomechanics.footwork}</Text>
                </View>
              )}
            </View>
          )}

          {/* Common Mistakes */}
          {exercise.mistakes && exercise.mistakes.length > 0 && (
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeaderRow}>
                <ShieldAlert size={14} color="#F59E0B" />
                <Text style={[styles.sectionHeader, { color: '#F59E0B' }]}>MISTAKES TO AVOID</Text>
              </View>
              {exercise.mistakes.map((mistake, idx) => (
                <View key={idx} style={styles.mistakeRow}>
                  <Text style={styles.mistakeBullet}>•</Text>
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Clean Bottom "Start This Exercise" Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={onStartExercise}
            activeOpacity={0.85}
          >
            <Play size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.startBtnText}>Start This Exercise</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: '#09090B',
    paddingHorizontal: 16
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  muscleBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)'
  },
  muscleBadgeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  titleSection: {
    marginTop: 4,
    marginBottom: 8
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.4
  },
  detailEquipment: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3
  },
  videoCardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  videoCard: {
    width: '100%',
    aspectRatio: 9 / 16,
    maxHeight: Math.min(SCREEN_HEIGHT * 0.44, 420),
    backgroundColor: '#18181B',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center'
  },
  sectionBox: {
    backgroundColor: '#141416',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  sectionHeader: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 8
  },
  muscleTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  musclePill: {
    backgroundColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  musclePillPrimary: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  musclePillText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700'
  },
  musclePillTextPrimary: {
    color: '#EF4444',
    fontWeight: '800'
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 4
  },
  cueText: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginVertical: 3
  },
  mistakeBullet: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '900'
  },
  mistakeText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18
  },
  bottomBar: {
    paddingVertical: 12
  },
  startBtn: {
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.3
  }
});

export default ExerciseDetailModal;
