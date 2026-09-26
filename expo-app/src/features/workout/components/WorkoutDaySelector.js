import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { WEEKLY_ROUTINES_DB } from '../../../data/exercisesDb';

/**
 * Horizontal Monday-to-Sunday selector pills for switching routines.
 */
export function WorkoutDaySelector({
  activeDayIndex,
  onSelectDay
}) {
  return (
    <View style={styles.daySelectorContainer}>
      <Text style={styles.selectorSectionLabel}>SCHEDULE · MONDAY TO SUNDAY</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScrollTrack}
      >
        {WEEKLY_ROUTINES_DB.map((r, idx) => {
          const isSelected = activeDayIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.daySelectorPill,
                isSelected && styles.daySelectorPillActive
              ]}
              activeOpacity={0.8}
              onPress={() => onSelectDay(idx, r)}
            >
              <Text
                style={[
                  styles.daySelectorCode,
                  isSelected && styles.daySelectorCodeActive
                ]}
              >
                {r.dayCode}
              </Text>
              <Text
                style={[
                  styles.daySelectorName,
                  isSelected && styles.daySelectorNameActive
                ]}
              >
                {r.dayName.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  daySelectorContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8
  },
  selectorSectionLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  daysScrollTrack: {
    flexDirection: 'row',
    gap: 8
  },
  daySelectorPill: {
    width: 46,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2A30',
    justifyContent: 'center',
    alignItems: 'center'
  },
  daySelectorPillActive: {
    backgroundColor: '#EF4444',
    borderColor: '#F87171',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6
  },
  daySelectorCode: {
    color: '#71717A',
    fontSize: 14,
    fontWeight: '900'
  },
  daySelectorCodeActive: {
    color: '#FFFFFF'
  },
  daySelectorName: {
    color: '#52525B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  },
  daySelectorNameActive: {
    color: '#FFFFFF'
  }
});
