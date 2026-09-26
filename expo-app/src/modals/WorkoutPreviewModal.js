import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Alert
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { RestRecoveryItem } from '../components/RestRecoveryItem';
import { BACK_PRIORITY, useAndroidBackHandler } from '../services/navigation/backHandlerService';
import {
  useWorkoutPersistence,
  useWorkoutSession,
  getSetsForExercise,
  WorkoutHeroHeader,
  WorkoutDaySelector,
  WorkoutControls,
  WorkoutExerciseCard,
  WorkoutFinishDialog,
  AddExerciseModal,
  renderSectionIcon
} from '../features/workout';

/**
 * WorkoutPreviewModal
 * Primary modal coordinator for routine preview, exercise execution, and workout completion.
 * Composes modular feature components from features/workout.
 */
export function WorkoutPreviewModal({
  visible,
  routine,
  savedProgress,
  completedSets = [],
  userId = 'guest',
  onLogSet,
  onLogBatchSets,
  onClose,
  onSaveProgress,
  onFinishWorkout,
  onSelectRoutine,
  onSelectExercise
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Routine selection, day tracking, and custom exercise persistence
  const {
    activeDayIndex,
    selectDay,
    currentRoutine,
    rawExercises,
    exerciseCount,
    estimatedDuration,
    addExerciseToRoutine,
    createAndAddCustomExercise
  } = useWorkoutPersistence({
    initialRoutine: routine,
    visible,
    userId,
    onSelectRoutine
  });

  // Active workout session lifecycle, timing, set logging, and completion flow
  const {
    workoutState,
    sessionSets,
    formattedElapsed,
    restTimerSeconds,
    skipRest,
    completedExerciseIds,
    completedCount,
    percentComplete,
    loggingExerciseId,
    toggleLoggingExercise,
    repsInput,
    setRepsInput,
    weightInput,
    setWeightInput,
    isSavingSet,
    showFinishConfirm,
    setShowFinishConfirm,
    selectedSectionFilter,
    setSelectedSectionFilter,
    sectionsToRender,
    filteredSections,
    startWorkoutSession,
    handleSaveSet,
    handleSaveBatchSets,
    handleCloseModal,
    handleConfirmFinish
  } = useWorkoutSession({
    visible,
    currentRoutine,
    rawExercises,
    savedProgress,
    completedSets,
    onLogSet,
    onLogBatchSets,
    onSaveProgress,
    onFinishWorkout,
    onClose
  });

  // Android hardware back button handler
  const handleBackPress = useCallback(() => {
    if (showFinishConfirm) {
      setShowFinishConfirm(false);
      return true;
    }
    if (showAddModal) {
      setShowAddModal(false);
      return true;
    }
    if (workoutState === 'IN_PROGRESS' && sessionSets.length > 0) {
      Alert.alert(
        'Workout in progress',
        'Your logged sets are saved on this device. Do you want to pause and exit?',
        [
          { text: 'Keep Working Out', style: 'cancel' },
          {
            text: 'Save & Exit',
            style: 'destructive',
            onPress: () => handleCloseModal()
          }
        ]
      );
      return true;
    }
    handleCloseModal();
    return true;
  }, [showFinishConfirm, showAddModal, workoutState, sessionSets.length, handleCloseModal, setShowFinishConfirm]);

  useAndroidBackHandler(handleBackPress, BACK_PRIORITY.WORKOUT_MODAL, visible);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleBackPress}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 🏋️ 1. Full-Bleed Athlete Photo Header */}
          <WorkoutHeroHeader
            currentRoutine={currentRoutine}
            exerciseCount={exerciseCount}
            estimatedDuration={estimatedDuration}
            onClose={handleCloseModal}
          />

          {/* 📅 2. Interactive Horizontal Day Selector (Monday - Sunday) */}
          <WorkoutDaySelector
            activeDayIndex={activeDayIndex}
            onSelectDay={selectDay}
          />

          {/* 🔴 3. Dynamic CTA: "Start Workout" OR "In Progress" + Filters */}
          <WorkoutControls
            workoutState={workoutState}
            completedCount={completedCount}
            exerciseCount={exerciseCount}
            percentComplete={percentComplete}
            formattedElapsed={formattedElapsed}
            restTimerSeconds={restTimerSeconds}
            onSkipRest={skipRest}
            onStartWorkout={startWorkoutSession}
            onFinishPress={() => setShowFinishConfirm(true)}
            sectionsToRender={sectionsToRender}
            selectedSectionFilter={selectedSectionFilter}
            onSelectSectionFilter={setSelectedSectionFilter}
          />

          {/* 📋 4. Dedicated Muscle-Group Sections & Exercise Cards */}
          <View style={styles.sectionsContainer}>
            {filteredSections.map((sec, secIdx) => (
              <View key={sec.name || secIdx} style={styles.sectionBlock}>
                {/* Section Header */}
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionIconBadge}>
                    {renderSectionIcon(sec.icon, '#EF4444', 14)}
                  </View>
                  <Text style={styles.sectionTitleText}>{sec.name}</Text>
                  <View style={styles.sectionCountPill}>
                    <Text style={styles.sectionCountText}>
                      {sec.exercises?.length || 0} exercises
                    </Text>
                  </View>
                </View>

                {/* Exercises in this section */}
                <View style={styles.exerciseQueueList}>
                  {(sec.exercises || []).map((item, index) => {
                    const exerciseId = item.id || String(index);
                    const isCompleted = !!completedExerciseIds[exerciseId];
                    const loggedSets = getSetsForExercise(sessionSets, exerciseId);
                    const isLoggingActive = loggingExerciseId === exerciseId;

                    return (
                      <React.Fragment key={exerciseId}>
                        <WorkoutExerciseCard
                          item={item}
                          isCompleted={isCompleted}
                          loggedSets={loggedSets}
                          workoutState={workoutState}
                          isLoggingActive={isLoggingActive}
                          onToggleLogging={toggleLoggingExercise}
                          sectionName={sec.name}
                          fallbackImage={currentRoutine.image}
                          repsInput={repsInput}
                          onChangeReps={setRepsInput}
                          weightInput={weightInput}
                          onChangeWeight={setWeightInput}
                          isSavingSet={isSavingSet}
                          onSaveSet={handleSaveSet}
                          onSaveBatchSets={handleSaveBatchSets}
                        />

                        {/* ⏱️ Dedicated Rest Recovery Item between exercises */}
                        {index < (sec.exercises.length - 1) && (
                          <RestRecoveryItem
                            restDuration={90}
                            autoStart={false}
                            label={`REST (${index + 1}/${sec.exercises.length})`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* ➕ Add Exercise Button */}
            <TouchableOpacity
              style={styles.addExerciseToWorkoutBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
              <Text style={styles.addExerciseToWorkoutBtnText}>
                + Add Exercise to {currentRoutine.dayName || 'Workout'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 🛡️ Workout Completion Confirmation Dialog */}
        <WorkoutFinishDialog
          visible={showFinishConfirm}
          completedCount={completedCount}
          exerciseCount={exerciseCount}
          formattedElapsed={formattedElapsed}
          onCancel={() => setShowFinishConfirm(false)}
          onConfirm={handleConfirmFinish}
        />

        {/* ➕ Add Exercise Modal */}
        <AddExerciseModal
          visible={showAddModal}
          currentRoutine={currentRoutine}
          rawExercises={rawExercises}
          onClose={() => setShowAddModal(false)}
          onAddExercise={addExerciseToRoutine}
          onCreateCustomExercise={createAndAddCustomExercise}
        />
      </View>
    </Modal>
  );
}

export default WorkoutPreviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 70
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 22
  },
  sectionBlock: {
    gap: 10
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  sectionIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  sectionTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    flex: 1
  },
  sectionCountPill: {
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2A30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  sectionCountText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  exerciseQueueList: {
    gap: 10
  },
  addExerciseToWorkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1E1E26',
    borderWidth: 1,
    borderColor: '#343442',
    marginVertical: 18,
    marginHorizontal: 16
  },
  addExerciseToWorkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
