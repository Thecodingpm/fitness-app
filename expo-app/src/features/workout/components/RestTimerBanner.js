import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Clock } from 'lucide-react-native';

/**
 * Visual banner showing rest timer countdown and Skip button.
 */
export function RestTimerBanner({
  restTimerSeconds,
  onSkipRest
}) {
  if (!restTimerSeconds || restTimerSeconds <= 0) return null;

  return (
    <View style={styles.restTimerBanner}>
      <Clock size={14} color="#38BDF8" style={{ marginRight: 6 }} />
      <Text style={styles.restTimerText}>REST: {restTimerSeconds}s</Text>
      <TouchableOpacity
        onPress={onSkipRest}
        style={styles.skipRestBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.skipRestBtnText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  restTimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderWidth: 1,
    borderColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  restTimerText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
    flex: 1
  },
  skipRestBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  skipRestBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  }
});
