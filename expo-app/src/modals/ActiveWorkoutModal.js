import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { C } from '../constants/theme';
import { ExerciseAudioCoachStudio } from '../components/VoiceCoachStudio';

export function ActiveWorkoutModal({
  visible,
  workoutExercises,
  currentExIndex,
  workoutDuration,
  isResting,
  restSeconds,
  onClose,
  onNextExercise,
  onToggleSetComplete,
  onAdjustWeight,
  onSkipRest
}) {
  const currentWorkoutEx = workoutExercises[currentExIndex];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.modalBg}>
        {currentWorkoutEx && (
          <View style={{ flex: 1, padding: 18 }}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
                <X size={18} color={C.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Exercise {currentExIndex + 1} of {workoutExercises.length}
              </Text>
              <Text style={{ color: C.white, fontWeight: '900' }}>
                ⏱️ {Math.floor(workoutDuration / 60)}:{String(workoutDuration % 60).padStart(2, '0')}
              </Text>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 10 }}>
              <Text style={styles.detailTitle}>{currentWorkoutEx.name}</Text>

              {/* Compact Coach Studio */}
              <ExerciseAudioCoachStudio exercise={currentWorkoutEx} compact />

              {/* Sets Logger */}
              <Text style={styles.sectionTitle}>Log Sets & Reps</Text>
              {currentWorkoutEx.sets.map((s, idx) => (
                <View key={idx} style={[styles.setRow, s.done && styles.setRowDone]}>
                  <View style={[styles.setNumPill, s.done && { backgroundColor: C.emerald }]}>
                    <Text style={{ color: C.white, fontWeight: '900', fontSize: 11 }}>{s.num}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ color: C.white, fontWeight: '700', fontSize: 14 }}>{s.weight} kg</Text>
                    <TouchableOpacity onPress={() => onAdjustWeight(idx, -2.5)}>
                      <Text style={styles.stepBtn}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onAdjustWeight(idx, 2.5)}>
                      <Text style={styles.stepBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: C.white, fontWeight: '700', fontSize: 14 }}>{s.reps} reps</Text>
                  <TouchableOpacity
                    style={[styles.checkBtn, s.done && { backgroundColor: C.emerald }]}
                    onPress={() => onToggleSetComplete(idx)}
                  >
                    <Check size={16} color={s.done ? C.white : C.zinc} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Rest Timer Banner */}
              {isResting && (
                <View style={styles.restBanner}>
                  <Text style={{ color: C.white, fontWeight: '800' }}>⏱️ REST: {restSeconds}s left</Text>
                  <TouchableOpacity onPress={onSkipRest}>
                    <Text style={{ color: C.white, fontWeight: '900', textDecorationLine: 'underline' }}>Skip</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {/* Next Button */}
            <TouchableOpacity style={styles.startBtn} onPress={onNextExercise}>
              <Text style={styles.startBtnText}>
                {currentExIndex < workoutExercises.length - 1 ? 'Next Exercise →' : 'Finish Workout 🎉'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: C.bg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontWeight: '900', color: C.white, fontSize: 15 },
  detailTitle: { color: C.white, fontSize: 20, fontWeight: '900', marginBottom: 6 },
  sectionTitle: { color: C.white, fontSize: 16, fontWeight: '900', marginVertical: 10 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, padding: 12, marginVertical: 4, borderWidth: 1, borderColor: C.border },
  setRowDone: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: C.emerald },
  setNumPill: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  stepBtn: { color: C.white, fontSize: 18, fontWeight: '900', paddingHorizontal: 4 },
  checkBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  restBanner: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, borderWidth: 1, borderColor: C.border },
  startBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  startBtnText: { color: C.bg, fontWeight: '900', fontSize: 15 }
});
