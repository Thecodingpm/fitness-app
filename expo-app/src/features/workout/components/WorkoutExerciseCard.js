import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { Check } from 'lucide-react-native';
import { WorkoutSetLogger } from './WorkoutSetLogger';

/**
 * Exercise prescription card showing anatomical diagram, target prescription,
 * completion badge, progress indicator, and the expandable inline set logger.
 */
function WorkoutExerciseCardComponent({
  item,
  isCompleted,
  loggedSets = [],
  workoutState,
  isLoggingActive,
  onToggleLogging,
  sectionName,
  fallbackImage,
  repsInput = '',
  onChangeReps,
  weightInput = '',
  onChangeWeight,
  isSavingSet = false,
  onSaveSet,
  onSaveBatchSets
}) {
  const exerciseId = item?.id;
  const totalSets = item?.sets?.length || 3;
  const repRange = item?.sets?.[0]?.reps || 10;
  const isInProgress = workoutState === 'IN_PROGRESS';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.exerciseCard,
          isCompleted && styles.exerciseCardCompleted
        ]}
        activeOpacity={isInProgress ? 0.75 : 1}
        onPress={() => {
          if (isInProgress && onToggleLogging) {
            onToggleLogging(exerciseId);
          }
        }}
      >
        {/* Top-Right Metallic "✓ Completed" Badge */}
        {isCompleted && (
          <View style={styles.completedBadgePill}>
            <Check size={11} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
            <Text style={styles.completedBadgeText}>Completed</Text>
          </View>
        )}

        <View style={styles.cardInnerRow}>
          {/* Left: 3D Anatomical Diagram Thumbnail */}
          <View style={styles.diagramContainer}>
            <Image
              source={item?.image || fallbackImage || require('../../../../assets/workouts/hero_monday.jpg')}
              style={styles.diagramImage}
              resizeMode="cover"
            />
          </View>

          {/* Right: Exercise Prescription Details */}
          <View style={styles.cardDetailsCol}>
            <Text style={styles.cardExerciseName}>{item?.name}</Text>
            <Text style={styles.cardMuscleSubtitle}>
              {item?.tagline || item?.muscle || sectionName}
            </Text>

            <View style={styles.cardSetsRow}>
              <Text style={styles.cardSetsText}>
                Target: {totalSets} sets · {repRange} reps
              </Text>
            </View>

            {isInProgress && (
              <Text style={styles.cardRestText}>
                {loggedSets.length}/{totalSets} sets logged · Tap to add a set
              </Text>
            )}

            <Text style={styles.cardRestText}>
              90s rest • {item?.tempo || 'Controlled'}
            </Text>
          </View>

          {/* Right Action / Status Checkbox if in Progress */}
          {isInProgress && (
            <View
              style={[
                styles.actionCheckboxCircle,
                isCompleted && styles.actionCheckboxCircleCompleted
              ]}
            >
              {isCompleted ? (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <View style={styles.actionCheckboxDot} />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Expandable Inline Set Logger */}
      {isInProgress && isLoggingActive && (
        <WorkoutSetLogger
          exercise={item}
          loggedSets={loggedSets}
          repsInput={repsInput}
          onChangeReps={onChangeReps}
          weightInput={weightInput}
          onChangeWeight={onChangeWeight}
          isSavingSet={isSavingSet}
          onSaveSet={onSaveSet}
          onSaveBatchSets={onSaveBatchSets}
        />
      )}
    </View>
  );
}

export const WorkoutExerciseCard = memo(WorkoutExerciseCardComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  exerciseCard: {
    backgroundColor: '#16161A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#24242A',
    padding: 12,
    position: 'relative'
  },
  exerciseCardCompleted: {
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.08)'
  },
  completedBadgePill: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 10
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  cardInnerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  diagramContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#1F1F24',
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative'
  },
  diagramImage: {
    width: '100%',
    height: '100%'
  },
  cardDetailsCol: {
    flex: 1
  },
  cardExerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2
  },
  cardMuscleSubtitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  cardSetsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardSetsText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700'
  },
  cardRestText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  actionCheckboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  actionCheckboxCircleCompleted: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E'
  },
  actionCheckboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3F3F46'
  }
});
