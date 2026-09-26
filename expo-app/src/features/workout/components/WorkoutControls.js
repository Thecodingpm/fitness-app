import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Flame,
  Zap,
  Activity,
  Moon,
  Shield,
  Dumbbell,
  Layers
} from 'lucide-react-native';
import { RestTimerBanner } from './RestTimerBanner';

/**
 * Section icon resolver matching workout theme.
 */
export function renderSectionIcon(iconName, color = '#EF4444', size = 14) {
  switch (iconName) {
    case 'Flame':
      return <Flame size={size} color={color} />;
    case 'Zap':
      return <Zap size={size} color={color} />;
    case 'Activity':
      return <Activity size={size} color={color} />;
    case 'Moon':
      return <Moon size={size} color={color} />;
    case 'Shield':
      return <Shield size={size} color={color} />;
    default:
      return <Dumbbell size={size} color={color} />;
  }
}

/**
 * Workout primary controls: Start Workout CTA or In-Progress progress capsule,
 * rest countdown timer, finish button, and muscle section filter tabs.
 */
export function WorkoutControls({
  workoutState,
  completedCount,
  exerciseCount,
  percentComplete,
  formattedElapsed,
  restTimerSeconds,
  onSkipRest,
  onStartWorkout,
  onFinishPress,
  sectionsToRender = [],
  selectedSectionFilter = 'ALL',
  onSelectSectionFilter
}) {
  return (
    <View style={styles.ctaSectionContainer}>
      {workoutState === 'PREVIEW' ? (
        <TouchableOpacity
          style={styles.startWorkoutBtn}
          activeOpacity={0.88}
          onPress={onStartWorkout}
        >
          <LinearGradient
            colors={['#EF4444', '#991B1B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startWorkoutGradient}
          >
            <Flame size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.startWorkoutBtnText}>Start Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={styles.inProgressWrapper}>
          {/* Frosted "In progress" Capsule with Progress Ring/Text */}
          <View style={styles.inProgressCapsuleBtn}>
            <Text style={styles.inProgressBtnText}>
              In Progress • {completedCount}/{exerciseCount} ({percentComplete}%)
            </Text>
            <Text style={styles.inProgressTimerText}>
              ⏱️ {formattedElapsed}
            </Text>
          </View>

          {/* Rest Timer Banner if Active */}
          <RestTimerBanner
            restTimerSeconds={restTimerSeconds}
            onSkipRest={onSkipRest}
          />

          {/* Finish Workout CTA Button */}
          <TouchableOpacity
            style={styles.finishWorkoutBtn}
            activeOpacity={0.85}
            onPress={onFinishPress}
          >
            <Text style={styles.finishWorkoutBtnText}>Finish Workout 🏆</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Muscle Group Section Filter Pills */}
      {sectionsToRender.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sectionFilterTrack}
        >
          <TouchableOpacity
            style={[
              styles.sectionFilterChip,
              selectedSectionFilter === 'ALL' && styles.sectionFilterChipActive
            ]}
            onPress={() => onSelectSectionFilter('ALL')}
          >
            <Layers
              size={12}
              color={selectedSectionFilter === 'ALL' ? '#FFFFFF' : '#A1A1AA'}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.sectionFilterChipText,
                selectedSectionFilter === 'ALL' && styles.sectionFilterChipTextActive
              ]}
            >
              All Sections ({exerciseCount})
            </Text>
          </TouchableOpacity>

          {sectionsToRender.map((sec, secIdx) => {
            const isSecActive = selectedSectionFilter === sec.name;
            return (
              <TouchableOpacity
                key={secIdx}
                style={[
                  styles.sectionFilterChip,
                  isSecActive && styles.sectionFilterChipActive
                ]}
                onPress={() => onSelectSectionFilter(sec.name)}
              >
                {renderSectionIcon(sec.icon, isSecActive ? '#FFFFFF' : '#A1A1AA', 12)}
                <Text
                  style={[
                    styles.sectionFilterChipText,
                    isSecActive && styles.sectionFilterChipTextActive,
                    { marginLeft: 5 }
                  ]}
                >
                  {sec.name} ({sec.exercises?.length || 0})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ctaSectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10
  },
  startWorkoutBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  startWorkoutGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  startWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  inProgressWrapper: {
    gap: 10
  },
  inProgressCapsuleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14
  },
  inProgressBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  inProgressTimerText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '900'
  },
  finishWorkoutBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center'
  },
  finishWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  sectionFilterTrack: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14
  },
  sectionFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2A30',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12
  },
  sectionFilterChipActive: {
    backgroundColor: '#27272A',
    borderColor: '#EF4444'
  },
  sectionFilterChipText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  }
});
