import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, AlertTriangle, Activity, TrendingUp } from 'lucide-react-native';
import { C } from '../constants/theme';
import { ExerciseAudioCoachStudio } from '../components/VoiceCoachStudio';
import { ExerciseStrengthChart } from '../components/ExerciseStrengthChart';

export function ExerciseDetailModal({
  exercise,
  onClose,
  onStartExercise
}) {
  const [activeTab, setActiveTab] = useState('biomechanics'); // 'biomechanics' | 'analytics'

  if (!exercise) return null;

  return (
    <Modal visible={!!exercise} animationType="slide" transparent>
      <SafeAreaView style={styles.modalBg}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.iconCircle} activeOpacity={0.7}>
              <ArrowLeft size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.muscle?.toUpperCase() || 'CHEST'}</Text>
            </View>
          </View>

          <Text style={styles.detailTitle}>{exercise.name}</Text>
          <Text style={styles.detailEquipment}>{exercise.equipment || 'Barbell / Free Weights'}</Text>

          {/* ⚡ Tab Selector: "3D Form & Coach" vs "Strength Analytics" */}
          <View style={styles.tabToggleContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'biomechanics' && styles.tabButtonActive]}
              onPress={() => setActiveTab('biomechanics')}
              activeOpacity={0.8}
            >
              <Activity size={14} color={activeTab === 'biomechanics' ? '#FFFFFF' : '#71717A'} style={{ marginRight: 6 }} />
              <Text style={[styles.tabButtonText, activeTab === 'biomechanics' && styles.tabButtonTextActive]}>
                3D Form & Coach
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'analytics' && styles.tabButtonActive]}
              onPress={() => setActiveTab('analytics')}
              activeOpacity={0.8}
            >
              <TrendingUp size={14} color={activeTab === 'analytics' ? '#FFFFFF' : '#71717A'} style={{ marginRight: 6 }} />
              <Text style={[styles.tabButtonText, activeTab === 'analytics' && styles.tabButtonTextActive]}>
                1RM Analytics
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: 3D ANATOMY GIF & VOICE COACH */}
          {activeTab === 'biomechanics' ? (
            <View>
              {/* 3D Anatomy GIF & Audio Coach Studio */}
              <ExerciseAudioCoachStudio exercise={exercise} />

              {/* Mistakes to Avoid */}
              <Text style={styles.sectionTitle}>Rookie Mistakes to Avoid ⚠️</Text>
              {(exercise.mistakes || [
                'Do not bounce the bar off your chest',
                'Keep shoulder blades retracted throughout the lift',
                'Avoid flaring elbows beyond 75 degrees'
              ]).map((m, i) => (
                <View key={i} style={styles.mistakeRow}>
                  <AlertTriangle size={14} color="#EF4444" />
                  <Text style={styles.mistakeText}>{m}</Text>
                </View>
              ))}
            </View>
          ) : (
            /* TAB 2: INTERACTIVE 1RM STRENGTH CHART */
            <View>
              <ExerciseStrengthChart exerciseName={exercise.name} unit="kg" />
            </View>
          )}

          <TouchableOpacity style={styles.startBtn} onPress={onStartExercise} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>Start This Exercise ▶</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  badge: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)'
  },
  badgeText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  detailEquipment: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14
  },
  tabToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 16
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10
  },
  tabButtonActive: {
    backgroundColor: '#DC2626'
  },
  tabButtonText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '700'
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 10
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#141416',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#242428'
  },
  mistakeText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
    flex: 1
  },
  startBtn: {
    backgroundColor: '#DC2626',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.3
  }
});
