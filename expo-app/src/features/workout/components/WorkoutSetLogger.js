import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

/**
 * Isolated inline set logger with reps & weight inputs, single/batch save buttons,
 * and logged sets history. Memoized to avoid unnecessary parent re-renders.
 */
function WorkoutSetLoggerComponent({
  exercise,
  loggedSets = [],
  repsInput,
  onChangeReps,
  weightInput,
  onChangeWeight,
  isSavingSet,
  onSaveSet,
  onSaveBatchSets
}) {
  const currentSetNum = loggedSets.length + 1;
  const displayName = exercise?.shortName || exercise?.name || 'Exercise';
  const parsedReps = parseInt(repsInput, 10) || 10;

  return (
    <View style={styles.setLogger}>
      <Text style={styles.setLoggerTitle}>
        Log set {currentSetNum} · {displayName}
      </Text>
      <Text style={styles.setLoggerHint}>
        Enter what you actually completed. Weight is optional for bodyweight moves.
      </Text>

      <View style={styles.setInputRow}>
        <View style={styles.setInputWrap}>
          <Text style={styles.setInputLabel}>REPS</Text>
          <TextInput
            value={repsInput}
            onChangeText={onChangeReps}
            keyboardType="number-pad"
            placeholder="e.g. 10"
            placeholderTextColor="#777780"
            style={styles.setInput}
            accessibilityLabel="Completed reps"
          />
        </View>

        <View style={styles.setInputWrap}>
          <Text style={styles.setInputLabel}>WEIGHT · KG</Text>
          <TextInput
            value={weightInput}
            onChangeText={onChangeWeight}
            keyboardType="decimal-pad"
            placeholder="Optional"
            placeholderTextColor="#777780"
            style={styles.setInput}
            accessibilityLabel="Weight in kilograms"
          />
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.saveSetButton, styles.saveSingleBtn, isSavingSet && styles.savingDisabled]}
          disabled={isSavingSet}
          onPress={() => onSaveSet(exercise)}
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <Text style={styles.saveSetText}>
            {isSavingSet ? 'Saving…' : 'Save 1 Set'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveSetButton, styles.saveBatchBtn, isSavingSet && styles.savingDisabled]}
          disabled={isSavingSet}
          onPress={() => onSaveBatchSets(exercise, 3)}
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <Text style={styles.saveSetText}>
            ⚡ Log 3 Sets ({3 * parsedReps} reps)
          </Text>
        </TouchableOpacity>
      </View>

      {loggedSets.map((set, setIndex) => (
        <Text key={set.id || setIndex} style={styles.loggedSetText}>
          Set {setIndex + 1}: {set.reps} reps
          {set.weightKg > 0 ? ` · ${set.weightKg} kg` : ' · bodyweight'}
          {set.synced ? '' : ' · sync pending'}
        </Text>
      ))}
    </View>
  );
}

export const WorkoutSetLogger = memo(WorkoutSetLoggerComponent);

const styles = StyleSheet.create({
  setLogger: {
    marginTop: 8,
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#303036',
    backgroundColor: '#1B1B20'
  },
  setLoggerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5
  },
  setLoggerHint: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 15
  },
  setInputRow: {
    flexDirection: 'row',
    gap: 10
  },
  setInputWrap: {
    flex: 1
  },
  setInputLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6
  },
  setInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#3C3C44',
    borderRadius: 11,
    paddingHorizontal: 12,
    backgroundColor: '#111114',
    color: '#FFFFFF',
    fontSize: 16
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  saveSetButton: {
    borderRadius: 11,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveSingleBtn: {
    flex: 1,
    backgroundColor: '#EF4444'
  },
  saveBatchBtn: {
    flex: 1.2,
    backgroundColor: '#EF4444'
  },
  savingDisabled: {
    opacity: 0.5
  },
  saveSetText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  loggedSetText: {
    color: '#CACAD0',
    fontSize: 12,
    marginTop: 9
  }
});
