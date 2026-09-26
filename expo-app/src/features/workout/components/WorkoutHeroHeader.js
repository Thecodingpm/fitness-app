import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Clock,
  Zap,
  Flame,
  Activity,
  Moon
} from 'lucide-react-native';

/**
 * Top hero image header with linear gradient vignette, floating back button,
 * day badge, and routine intensity & duration pills.
 */
export function WorkoutHeroHeader({
  currentRoutine,
  exerciseCount,
  estimatedDuration,
  onClose
}) {
  const isRest = !!currentRoutine?.isRest;
  const intensity = currentRoutine?.intensity;
  const isLowIntensity = intensity === 'Low';

  const badgeBgColor = isRest
    ? 'rgba(14, 165, 233, 0.25)'
    : isLowIntensity
    ? 'rgba(16, 185, 129, 0.25)'
    : 'rgba(239, 68, 68, 0.28)';

  const badgeTextColor = isRest
    ? '#38BDF8'
    : isLowIntensity
    ? '#10B981'
    : '#EF4444';

  return (
    <View style={styles.heroImageWrapper}>
      <Image
        source={currentRoutine?.image || require('../../../../assets/workouts/hero_monday.jpg')}
        style={styles.heroImage}
        fadeDuration={0}
      />

      {/* Smooth Linear Vignette Gradient */}
      <LinearGradient
        colors={['rgba(9, 9, 11, 0.45)', 'transparent', 'rgba(9, 9, 11, 0.75)', '#0F0F11']}
        locations={[0, 0.3, 0.75, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating Top Bar Buttons */}
      <View style={styles.floatingTopBar}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.circularGlassBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topRightBadge}>
          <Text style={styles.topRightBadgeText}>
            {`Day ${currentRoutine?.dayNum || 1} · ${currentRoutine?.dayName || 'Monday'}`}
          </Text>
        </View>
      </View>

      {/* Title & Badges Overlaid at Bottom of Photo */}
      <View style={styles.photoOverlayContent}>
        <View style={styles.intensityBadgeRow}>
          <View style={[styles.intensityBadge, { backgroundColor: badgeBgColor }]}>
            {isRest ? (
              <Moon size={12} color="#38BDF8" style={{ marginRight: 5 }} />
            ) : isLowIntensity ? (
              <Activity size={12} color="#10B981" style={{ marginRight: 5 }} />
            ) : (
              <Flame size={12} color="#EF4444" style={{ marginRight: 5 }} />
            )}
            <Text style={[styles.intensityBadgeText, { color: badgeTextColor }]}>
              {intensity || 'High Intensity'}
            </Text>
          </View>
        </View>

        <Text style={styles.workoutMainTitle}>{currentRoutine?.title}</Text>
        <Text style={styles.workoutSubHeader}>{currentRoutine?.splitLabel}</Text>

        <View style={styles.badgesRow}>
          <View style={styles.frostedMetaBadge}>
            <Zap size={13} color="#FBBF24" style={{ marginRight: 5 }} />
            <Text style={styles.frostedMetaText}>{exerciseCount} exercises</Text>
          </View>

          <View style={styles.frostedMetaBadge}>
            <Clock size={13} color="#A1A1AA" style={{ marginRight: 5 }} />
            <Text style={styles.frostedMetaText}>{estimatedDuration} min</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImageWrapper: {
    width: '100%',
    height: 380,
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
    top: Platform.OS === 'ios' ? 56 : 38,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 30
  },
  circularGlassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(28, 28, 32, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topRightBadge: {
    backgroundColor: 'rgba(28, 28, 32, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14
  },
  topRightBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  photoOverlayContent: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    zIndex: 20
  },
  intensityBadgeRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  intensityBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3
  },
  workoutMainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2
  },
  workoutSubHeader: {
    color: '#D4D4D8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  frostedMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  frostedMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  }
});
