import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native';
import { Trophy, Check } from 'lucide-react-native';

/**
 * Confirmation dialog shown before officially ending/finishing an active workout.
 */
export function WorkoutFinishDialog({
  visible,
  completedCount,
  exerciseCount,
  formattedElapsed,
  onCancel,
  onConfirm
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.confirmModalOverlay}>
        <View style={styles.confirmModalBox}>
          <View style={styles.trophyCircleBadge}>
            <Trophy size={24} color="#FBBF24" />
          </View>

          <Text style={styles.confirmModalTitle}>Complete this workout?</Text>
          <Text style={styles.confirmModalSubtitle}>
            {completedCount} of {exerciseCount} exercises logged • {formattedElapsed}
          </Text>

          <View style={styles.confirmActionsRow}>
            <TouchableOpacity
              style={styles.confirmCancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmFinishBtn}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 6 }} />
              <Text style={styles.confirmFinishText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  confirmModalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2A2A30',
    alignItems: 'center'
  },
  trophyCircleBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  confirmModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  confirmModalSubtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  confirmCancelBtn: {
    flex: 1,
    backgroundColor: '#27272A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmCancelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  confirmFinishBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmFinishText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  }
});
