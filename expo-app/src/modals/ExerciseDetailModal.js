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
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { C } from '../constants/theme';
import { ExerciseAudioCoachStudio } from '../components/VoiceCoachStudio';

export function ExerciseDetailModal({
  exercise,
  onClose,
  onStartExercise
}) {
  return (
    <Modal visible={!!exercise} animationType="slide" transparent>
      <SafeAreaView style={styles.modalBg}>
        {exercise && (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
                <ArrowLeft size={18} color={C.white} />
              </TouchableOpacity>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{exercise.muscle.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.detailTitle}>{exercise.name}</Text>
            <Text style={styles.detailEquipment}>{exercise.equipment}</Text>

            {/* 3D Anatomy GIF & Audio Coach Studio */}
            <ExerciseAudioCoachStudio exercise={exercise} />

            {/* Mistakes to Avoid */}
            <Text style={styles.sectionTitle}>Rookie Mistakes to Avoid ⚠️</Text>
            {exercise.mistakes.map((m, i) => (
              <View key={i} style={styles.mistakeRow}>
                <AlertTriangle size={14} color={C.white} />
                <Text style={{ color: C.zincLight, fontSize: 12, flex: 1 }}>{m}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.startBtn} onPress={onStartExercise}>
              <Text style={styles.startBtnText}>Start This Exercise ▶</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  badge: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  badgeText: { color: C.white, fontSize: 10, fontWeight: '800' },
  detailTitle: { color: C.white, fontSize: 22, fontWeight: '900' },
  detailEquipment: { color: C.zinc, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  sectionTitle: { color: C.white, fontSize: 16, fontWeight: '900', marginTop: 18, marginBottom: 8 },
  mistakeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surfaceVariant, padding: 10, borderRadius: 10, marginVertical: 4, borderWidth: 1, borderColor: C.border },
  startBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 22 },
  startBtnText: { color: C.bg, fontWeight: '900', fontSize: 15 }
});
