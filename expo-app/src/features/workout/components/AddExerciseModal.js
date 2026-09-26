import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { X, Search, Plus } from 'lucide-react-native';
import { EXERCISES_DB } from '../../../data/exercisesDb';
import { filterSearchExercises } from '../utils/workoutHelpers';

/**
 * Bottom-sheet style modal for searching the 250+ exercises database
 * or quickly creating a custom movement to add to the active routine.
 */
export function AddExerciseModal({
  visible,
  currentRoutine,
  rawExercises = [],
  onClose,
  onAddExercise,
  onCreateCustomExercise
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');

  if (!visible) return null;

  const handleClose = () => {
    setSearchQuery('');
    setCustomName('');
    onClose();
  };

  const handleSelectFromDb = async (exercise) => {
    const success = await onAddExercise(exercise);
    if (success) {
      setSearchQuery('');
      onClose();
    }
  };

  const handleCreateCustom = async () => {
    const success = await onCreateCustomExercise(customName, customMuscle);
    if (success) {
      setCustomName('');
      onClose();
    }
  };

  const searchResults = filterSearchExercises(EXERCISES_DB, searchQuery, rawExercises, 15);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.addModalOverlay}>
        <View style={styles.addModalBox}>
          <View style={styles.addModalHeaderRow}>
            <Text style={styles.addModalTitle}>
              Add Exercise to {currentRoutine?.dayName || 'Day'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.addModalCloseBtn}>
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.addModalSearchBox}>
            <Search size={16} color="#8A8A94" />
            <TextInput
              style={styles.addModalSearchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search 250+ exercises"
              placeholderTextColor="#777780"
            />
          </View>

          {/* Search Results List */}
          <ScrollView style={styles.resultsList}>
            {searchResults.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.addModalItemRow}
                onPress={() => handleSelectFromDb(ex)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.addModalItemMuscle}>{ex.muscle}</Text>
                  <Text style={styles.addModalItemName}>{ex.name}</Text>
                </View>
                <View style={styles.addModalItemAddCircle}>
                  <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Custom Exercise Section */}
          <View style={styles.customAddSection}>
            <Text style={styles.customAddLabel}>OR TYPE CUSTOM MOVE</Text>
            <View style={styles.customInputRow}>
              <TextInput
                style={[styles.addModalSearchInput, styles.customTextInput]}
                value={customName}
                onChangeText={setCustomName}
                placeholder="e.g. Incline Bench"
                placeholderTextColor="#777780"
              />
              <TouchableOpacity
                style={styles.customAddSubmitBtn}
                onPress={handleCreateCustom}
                activeOpacity={0.8}
              >
                <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.customAddSubmitBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  addModalBox: {
    backgroundColor: '#16161A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2F2F38',
    maxHeight: '85%'
  },
  addModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  addModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  addModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26262E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addModalSearchBox: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B2B30',
    backgroundColor: '#19191D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8
  },
  addModalSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 0
  },
  resultsList: {
    maxHeight: 260,
    marginVertical: 10
  },
  addModalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C22',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D37'
  },
  addModalItemMuscle: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  addModalItemName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  addModalItemAddCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customAddSection: {
    backgroundColor: '#1E1E26',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#343442'
  },
  customAddLabel: {
    color: '#8A8A94',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6
  },
  customTextInput: {
    flex: 1,
    height: 38,
    backgroundColor: '#191920',
    borderRadius: 8,
    paddingHorizontal: 10
  },
  customAddSubmitBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  customAddSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12
  }
});
