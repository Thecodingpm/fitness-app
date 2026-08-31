import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import * as Speech from 'expo-speech';
import { Volume2, VolumeX, Mic, ShieldCheck, Activity } from 'lucide-react-native';
import { C } from '../constants/theme';

export function ExerciseAudioCoachStudio({ exercise, compact = false }) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [coachSubtitle, setCoachSubtitle] = useState(exercise.audioCues.intro);
  const [cadencePhase, setCadencePhase] = useState('READY');
  const timeoutIds = useRef([]);

  // Clear all pending timeouts and stop speech on unmount
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout);
      try {
        Speech.stop();
      } catch (e) { }
    };
  }, []);

  const speak = (text) => {
    try {
      Speech.stop();
      Speech.speak(text, { rate: 0.95, pitch: 1.0 });
    } catch (e) { }
  };

  const startVoiceCoaching = () => {
    // Clear any previous timeouts
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];

    setIsVoiceActive(true);
    setCoachSubtitle(exercise.audioCues.intro);
    speak(exercise.audioCues.intro);

    const t1 = setTimeout(() => {
      setCadencePhase('LOWER (3s)');
      setCoachSubtitle(exercise.audioCues.lower);
      speak(exercise.audioCues.lower);
    }, 4500);

    const t2 = setTimeout(() => {
      setCadencePhase('EXPLODE UP! ⚡');
      setCoachSubtitle(exercise.audioCues.press);
      speak(exercise.audioCues.press);
    }, 9000);

    const t3 = setTimeout(() => {
      setCadencePhase('SET COMPLETE! ✅');
      setCoachSubtitle(exercise.audioCues.finish);
      speak(exercise.audioCues.finish);
      setIsVoiceActive(false);
    }, 13000);

    timeoutIds.current.push(t1, t2, t3);
  };

  const stopVoiceCoaching = () => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    try {
      Speech.stop();
    } catch (e) { }
    setIsVoiceActive(false);
    setCadencePhase('READY');
  };

  const hasVideo = exercise.localVideo || exercise.videoUri;

  return (
    <View style={styles.coachCard}>
      {/* 3D Anatomical / HD 1:1 Video Viewport Frame */}
      <View style={compact ? styles.viewportCompact : (hasVideo ? styles.viewportSquare : styles.viewport)}>
        {hasVideo ? (
          <Video
            source={exercise.localVideo || exercise.videoUri || require('../../assets/exercises/22legs.mp4')}
            posterSource={require('../../assets/workouts/legs_and_core.png')}
            usePoster={false}
            useNativeControls={false}
            rate={1.0}
            volume={0}
            isMuted={true}
            resizeMode={ResizeMode.COVER}
            shouldPlay={true}
            isLooping={true}
            style={styles.viewportVideo}
          />
        ) : (
          <Image
            source={exercise.image || require('../../assets/workouts/legs_and_core.png')}
            style={styles.viewportImg}
            resizeMode="cover"
          />
        )}

        {/* 🛡️ Top Seamless Dark Vignette */}
        {hasVideo && (
          <LinearGradient
            colors={['rgba(9, 9, 11, 0.98)', 'rgba(9, 9, 11, 0.8)', 'rgba(9, 9, 11, 0.25)', 'transparent']}
            locations={[0, 0.35, 0.7, 1]}
            style={styles.topVignette}
            pointerEvents="none"
          />
        )}

        {/* 🛡️ Bottom Seamless Dark Vignette (masks bottom text/watermarks) */}
        {hasVideo && (
          <LinearGradient
            colors={['transparent', 'rgba(9, 9, 11, 0.4)', 'rgba(9, 9, 11, 0.95)', '#09090B']}
            locations={[0, 0.35, 0.75, 1]}
            style={styles.bottomVignette}
            pointerEvents="none"
          />
        )}

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
          <Text style={styles.cueItemText}>{exercise.biomechanics?.jointAngle}</Text>
        </View>
        <View style={styles.cueItemRow}>
          <Activity size={13} color={C.white} />
          <Text style={styles.cueItemText}>{exercise.biomechanics?.barPath || exercise.biomechanics?.tempo}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coachCard: { backgroundColor: C.surface, borderRadius: 20, padding: 14, borderWidth: 1, borderColor: C.border, marginVertical: 6 },
  viewport: { width: '100%', height: 230, backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  viewportSquare: { width: '100%', aspectRatio: 1, backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  viewportCompact: { width: '100%', height: 160, backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  viewportVideo: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ scale: 1.08 }, { translateY: 6 }],
    backgroundColor: '#000000'
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 1
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 54,
    zIndex: 1
  },
  viewportImg: { width: '85%', height: '85%' },
  hudTopBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  hudTopText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  audioCoachPill: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.85)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  audioCoachPillActive: { backgroundColor: C.white, borderColor: C.white },
  audioCoachPillText: { color: C.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  speechSubtitleBox: { backgroundColor: C.surfaceVariant, padding: 12, borderRadius: 14, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  speechSubtitleText: { color: C.white, fontSize: 12, fontStyle: 'italic', fontWeight: '600', lineHeight: 17 },
  cadenceTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 'auto' },
  biomechBox: { flexDirection: 'column', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.borderSubtle },
  cueItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cueItemText: { color: C.zinc, fontSize: 11, fontWeight: '600' }
});
