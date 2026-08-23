import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { Volume2, VolumeX, Mic, ShieldCheck, Activity } from 'lucide-react-native';
import { C } from '../constants/theme';

export function ExerciseAudioCoachStudio({ exercise, compact = false }) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [coachSubtitle, setCoachSubtitle] = useState(exercise.audioCues.intro);
  const [cadencePhase, setCadencePhase] = useState('READY');

  const speak = (text) => {
    try {
      Speech.stop();
      Speech.speak(text, { rate: 0.95, pitch: 1.0 });
    } catch (e) {}
  };

  const startVoiceCoaching = () => {
    setIsVoiceActive(true);
    setCoachSubtitle(exercise.audioCues.intro);
    speak(exercise.audioCues.intro);

    setTimeout(() => {
      setCadencePhase('LOWER (3s)');
      setCoachSubtitle(exercise.audioCues.lower);
      speak(exercise.audioCues.lower);
    }, 4500);

    setTimeout(() => {
      setCadencePhase('EXPLODE UP! ⚡');
      setCoachSubtitle(exercise.audioCues.press);
      speak(exercise.audioCues.press);
    }, 9000);

    setTimeout(() => {
      setCadencePhase('SET COMPLETE! ✅');
      setCoachSubtitle(exercise.audioCues.finish);
      speak(exercise.audioCues.finish);
    }, 13000);
  };

  const stopVoiceCoaching = () => {
    try {
      Speech.stop();
    } catch (e) {}
    setIsVoiceActive(false);
    setCadencePhase('READY');
  };

  return (
    <View style={styles.coachCard}>
      {/* 3D Anatomical GIF Viewport Frame */}
      <View style={compact ? styles.viewportCompact : styles.viewport}>
        <Image
          source={{ uri: exercise.gifUrl }}
          style={styles.viewportImg}
          resizeMode="contain"
        />

        {/* Live HUD Badge */}
        <View style={styles.hudTopBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.hudTopText}>3D ANATOMICAL GIF • RED = ACTIVE MUSCLE</Text>
        </View>

        {/* Voice Coach Play/Pause Button */}
        <TouchableOpacity
          style={[styles.audioCoachPill, isVoiceActive && styles.audioCoachPillActive]}
          onPress={() => (isVoiceActive ? stopVoiceCoaching() : startVoiceCoaching())}
        >
          {isVoiceActive ? <VolumeX size={14} color={C.bg} /> : <Volume2 size={14} color={C.white} />}
          <Text style={[styles.audioCoachPillText, isVoiceActive && { color: C.bg }]}>
            {isVoiceActive ? 'STOP VOICE COACH' : '🎙️ START AUDIO COACH'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Real-Time Live Speech Subtitle Banner */}
      <View style={styles.speechSubtitleBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Mic size={13} color={C.white} />
          <Text style={{ color: C.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>
            AI COACH VOICE-OVER:
          </Text>
          <View style={[styles.cadenceTag, { backgroundColor: isVoiceActive ? C.emerald : C.surfaceElevated }]}>
            <Text style={{ color: isVoiceActive ? '#FFF' : C.zinc, fontSize: 9, fontWeight: '900' }}>
              {cadencePhase}
            </Text>
          </View>
        </View>
        <Text style={styles.speechSubtitleText}>"{coachSubtitle}"</Text>
      </View>

      {/* Biomechanics Cues */}
      <View style={styles.biomechBox}>
        <View style={styles.cueItemRow}>
          <ShieldCheck size={13} color={C.white} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.jointAngle}</Text>
        </View>
        <View style={styles.cueItemRow}>
          <Activity size={13} color={C.zinc} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.barPath}</Text>
        </View>
      </View>

      {/* Target Muscle Load Map */}
      <View style={styles.muscleMapSection}>
        <Text style={styles.muscleMapTitle}>Target Muscle Activation (Red Highlight)</Text>
        {exercise.targetMuscles.map((m, i) => (
          <View key={i} style={styles.muscleRow}>
            <View style={styles.muscleRowHeader}>
              <Text style={styles.muscleName}>{m.name}</Text>
              <Text style={styles.muscleRole}>{m.role}</Text>
            </View>
            <View style={styles.muscleTrack}>
              <View
                style={[
                  styles.muscleFill,
                  { width: i === 0 ? '95%' : i === 1 ? '70%' : '55%' }
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coachCard: { backgroundColor: C.surface, borderRadius: 20, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: C.border },
  viewport: { width: '100%', height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
  viewportCompact: { width: '100%', height: 190, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
  viewportImg: { width: '92%', height: '92%' },
  hudTopBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: C.border },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald },
  hudTopText: { color: C.white, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  audioCoachPill: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.85)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.border },
  audioCoachPillActive: { backgroundColor: C.white },
  audioCoachPillText: { color: C.white, fontSize: 10, fontWeight: '900' },
  speechSubtitleBox: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  cadenceTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 'auto' },
  speechSubtitleText: { color: C.white, fontSize: 12, lineHeight: 17, fontStyle: 'italic' },
  biomechBox: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 10, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  cueItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  cueItemText: { color: C.zincLight, fontSize: 11, fontWeight: '600', flex: 1 },
  muscleMapSection: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.borderSubtle },
  muscleMapTitle: { color: C.white, fontSize: 12, fontWeight: '800', marginBottom: 8 },
  muscleRow: { marginVertical: 4 },
  muscleRowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  muscleName: { color: C.zincLight, fontSize: 11, fontWeight: '700' },
  muscleRole: { color: C.white, fontSize: 10, fontWeight: '800' },
  muscleTrack: { height: 5, backgroundColor: C.surfaceVariant, borderRadius: 3, overflow: 'hidden' },
  muscleFill: { height: '100%', backgroundColor: C.white, borderRadius: 3 }
});
