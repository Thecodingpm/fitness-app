import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Timer,
  Check,
  RotateCcw,
  SkipForward
} from 'lucide-react-native';
import { calculateRemainingSeconds } from '../services/timer/restTimerService';

export function RestRecoveryItem({
  restDuration = 90, // in seconds
  autoStart = false,
  onComplete,
  label = 'REST'
}) {
  // States: 'upcoming' | 'active' | 'completed'
  const endsAtRef = useRef(null);
  const [restState, setRestState] = useState(autoStart ? 'active' : 'upcoming');
  const [secondsRemaining, setSecondsRemaining] = useState(restDuration);

  const startTimer = (secs = restDuration) => {
    endsAtRef.current = Date.now() + (secs * 1000);
    setSecondsRemaining(secs);
    setRestState('active');
  };

  useEffect(() => {
    if (autoStart) {
      startTimer(restDuration);
    }
  }, [autoStart, restDuration]);

  useEffect(() => {
    if (restState !== 'active' || !endsAtRef.current) return;

    const updateRemaining = () => {
      const remaining = calculateRemainingSeconds(endsAtRef.current);
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        setRestState('completed');
        endsAtRef.current = null;
        if (onComplete) onComplete();
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 500);

    const subscription = AppState.addEventListener
      ? AppState.addEventListener('change', (state) => {
          if (state === 'active') updateRemaining();
        })
      : null;

    return () => {
      clearInterval(interval);
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [restState, onComplete]);

  const handlePressCard = () => {
    if (restState === 'upcoming' || restState === 'completed') {
      startTimer(restDuration);
    }
  };

  const handleSkipRest = (e) => {
    e?.stopPropagation?.();
    endsAtRef.current = null;
    setSecondsRemaining(0);
    setRestState('completed');
    if (onComplete) onComplete();
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, ((restDuration - secondsRemaining) / restDuration) * 100));

  return (
    <TouchableOpacity
      style={[
        styles.restCard,
        restState === 'active' && styles.restCardActive,
        restState === 'completed' && styles.restCardCompleted
      ]}
      onPress={handlePressCard}
      activeOpacity={0.88}
    >
      {/* Top 80% Black/Dark Charcoal & Bottom 20% Subtle Premium Red Accent */}
      <LinearGradient
        colors={
          restState === 'active'
            ? ['#1C1014', '#180E12', '#140E10', '#2E0E15', '#4A0E1C']
            : restState === 'completed'
            ? ['#16161A', '#16161A', '#1A1215', '#2A0E15']
            : ['#141417', '#141417', '#141417', '#200E13', '#300E17']
        }
        locations={[0, 0.65, 0.80, 0.92, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.cardContentRow}>
        {/* Left: Dedicated Recovery / Rest Icon (NO generic checkbox!) */}
        <View
          style={[
            styles.restIconCircle,
            restState === 'active' && styles.restIconCircleActive,
            restState === 'completed' && styles.restIconCircleCompleted
          ]}
        >
          {restState === 'completed' ? (
            <Check size={15} color="#E53935" strokeWidth={3} />
          ) : (
            <Timer
              size={15}
              color={restState === 'active' ? '#E53935' : '#71717A'}
              strokeWidth={2.2}
            />
          )}
        </View>

        {/* Center: Details & Timer */}
        <View style={styles.restTextCol}>
          <View style={styles.restHeaderRow}>
            <Text style={styles.restTitleLabel}>{label}</Text>
            {restState === 'active' ? (
              <Text style={styles.restTimerActiveText}>{formatTimer(secondsRemaining)}</Text>
            ) : restState === 'completed' ? (
              <Text style={styles.restCompletedBadgeText}>Rest completed</Text>
            ) : (
              <Text style={styles.restDurationUpcomingText}>{restDuration}s</Text>
            )}
          </View>

          <Text style={styles.restSubtitleText}>
            {restState === 'active'
              ? 'Recover before your next set'
              : restState === 'completed'
              ? `Completed (${restDuration}s recovery interval)`
              : 'Recovery interval · Tap to start timer'}
          </Text>

          {/* Active Rest Progress Line */}
          {restState === 'active' && (
            <View style={styles.progressTrackBg}>
              <View style={[styles.progressTrackFill, { width: `${progressPercent}%` }]} />
            </View>
          )}
        </View>

        {/* Right: Quick Action Controls */}
        {restState === 'active' && (
          <TouchableOpacity
            style={styles.skipActionBtn}
            onPress={handleSkipRest}
            activeOpacity={0.7}
          >
            <Text style={styles.skipActionText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Signature Subtle Red Baseline Strip */}
      <View
        style={[
          styles.cardBottomRedGlowStrip,
          restState === 'active' && styles.cardBottomRedGlowStripActive,
          restState === 'completed' && styles.cardBottomRedGlowStripCompleted
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  restCard: {
    backgroundColor: '#141417',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 14,
    marginVertical: 6,
    overflow: 'hidden',
    position: 'relative'
  },
  restCardActive: {
    borderColor: '#8B0000',
    backgroundColor: '#1A1014'
  },
  restCardCompleted: {
    backgroundColor: '#16161A',
    borderColor: '#2D2226'
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  restIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#2C2C34',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  restIconCircleActive: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
    borderColor: '#E53935'
  },
  restIconCircleCompleted: {
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
    borderColor: '#8B0000'
  },
  restTextCol: {
    flex: 1
  },
  restHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  restTitleLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  restTimerActiveText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  restDurationUpcomingText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '800'
  },
  restCompletedBadgeText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '800'
  },
  restSubtitleText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500'
  },
  progressTrackBg: {
    width: '100%',
    height: 3,
    backgroundColor: '#26262E',
    borderRadius: 1.5,
    marginTop: 6,
    overflow: 'hidden'
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 1.5
  },
  skipActionBtn: {
    backgroundColor: '#202026',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30303A',
    marginLeft: 10
  },
  skipActionText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '800'
  },
  cardBottomRedGlowStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E53935',
    opacity: 0.4
  },
  cardBottomRedGlowStripActive: {
    height: 3,
    opacity: 0.9
  },
  cardBottomRedGlowStripCompleted: {
    height: 2.5,
    opacity: 0.65
  }
});
