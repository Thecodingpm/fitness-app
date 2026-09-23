import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, Activity } from 'lucide-react-native';
import { C } from '../constants/theme';

export function ExerciseAudioCoachStudio({ exercise, compact = false }) {
  return (
    <View style={styles.coachCard}>
      {/* 3D Anatomical Visual Viewport Frame */}
      <View style={compact ? styles.viewportCompact : styles.viewport}>
        <Image
          source={exercise.image || require('../../assets/workouts/legs_and_core.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="contain"
        />
      </View>

      {/* Biomechanics Cues */}
      {exercise.biomechanics && (
        <View style={styles.biomechBox}>
          {exercise.biomechanics.jointAngle && (
            <View style={styles.cueItemRow}>
              <ShieldCheck size={13} color={C.white} />
              <Text style={styles.cueItemText}>{exercise.biomechanics.jointAngle}</Text>
            </View>
          )}
          {(exercise.biomechanics.barPath || exercise.biomechanics.tempo) && (
            <View style={styles.cueItemRow}>
              <Activity size={13} color={C.white} />
              <Text style={styles.cueItemText}>
                {exercise.biomechanics.barPath || exercise.biomechanics.tempo}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  coachCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0F1015',
    marginVertical: 6
  },
  viewport: {
    width: '100%',
    height: 230,
    backgroundColor: '#090A0E',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  viewportSquare: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#090A0E',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  viewportCompact: {
    width: '100%',
    height: 160,
    backgroundColor: '#090A0E',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  viewportVideo: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  viewportImg: {
    width: '85%',
    height: '85%'
  },
  biomechBox: {
    flexDirection: 'column',
    gap: 7,
    marginTop: 12
  },
  cueItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cueItemText: {
    color: C.zinc,
    fontSize: 11,
    fontWeight: '600'
  }
});
