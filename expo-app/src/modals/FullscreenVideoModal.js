// FullscreenVideoModal.js — Proper slide-in screen with contained video
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { width: W, height: H } = Dimensions.get('screen');

// Video box: portrait-ish, centered, not edge-to-edge
const VIDEO_W = W * 0.88;
const VIDEO_H = VIDEO_W * 1.15;

export function FullscreenVideoModal({ visible, exercise, onClose }) {
  const insets = useSafeAreaInsets();

  const lastExercise = useRef(exercise);
  if (exercise) lastExercise.current = exercise;
  const ex = lastExercise.current;

  const source = ex?.localVideo ?? ex?.videoUri ?? null;

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    try { p.audioMixingMode = 'mixWithOthers'; } catch (_) {}
  });

  useEffect(() => {
    if (!player) return;
    if (visible) {
      try { player.play(); } catch (_) {}
    } else {
      try { player.pause(); } catch (_) {}
    }
  }, [visible, player]);

  const handleClose = useCallback(() => {
    try { player?.pause(); } catch (_) {}
    onClose?.();
  }, [onClose, player]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <View style={styles.screen}>

        {/* Close button — top left */}
        <View style={[styles.topBar, { paddingTop: (insets.top || 44) + 8 }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            activeOpacity={0.8}
          >
            <X size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Centered video box */}
        <View style={styles.videoWrapper}>
          <VideoView
            style={styles.video}
            player={player}
            contentFit="cover"
            nativeControls={false}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
          />
        </View>

        {/* Info below video */}
        {!!ex && (
          <View style={styles.infoBlock}>
            <View style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>
                {(ex.muscle || '').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.exerciseTitle} numberOfLines={2}>
              {ex.name}
            </Text>
            {!!ex.tagline && (
              <Text style={styles.exerciseTagline} numberOfLines={2}>
                {ex.tagline}
              </Text>
            )}
            {!!ex.tempo && (
              <Text style={styles.tempoText}>
                {'⏱  ' + ex.tempo}
              </Text>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  videoWrapper: {
    width: VIDEO_W,
    height: VIDEO_H,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#111',
  },
  video: {
    width: VIDEO_W,
    height: VIDEO_H,
  },
  infoBlock: {
    width: VIDEO_W,
    marginTop: 22,
    alignItems: 'flex-start',
  },
  muscleTag: {
    backgroundColor: '#EF4444',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  muscleTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  exerciseTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 5,
  },
  exerciseTagline: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 8,
  },
  tempoText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default FullscreenVideoModal;
