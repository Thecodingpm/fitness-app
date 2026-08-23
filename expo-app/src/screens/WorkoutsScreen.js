import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { C } from '../constants/theme';

export function WorkoutsScreen({ userName, onStartWorkout }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Training Programs</Text>
      <Text style={styles.pageSub}>Structured multi-week programs for {userName}</Text>

      {[
        { title: 'Beginner 3-Day Hypertrophy', sub: '3 days/week • 45 mins • Perfect for newcomers', xp: 200 },
        { title: 'Push / Pull / Legs (PPL)', sub: '6 days/week • 60 mins • Classic muscle builder', xp: 350 },
        { title: 'Upper / Lower Power Split', sub: '4 days/week • 50 mins • Strength & power', xp: 300 }
      ].map((plan, idx) => (
        <View key={idx} style={styles.planCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>+{plan.xp} XP</Text></View>
          </View>
          <Text style={styles.planSub}>{plan.sub}</Text>
          <TouchableOpacity style={styles.planBtn} onPress={onStartWorkout}>
            <Text style={styles.planBtnText}>Start Routine ▶</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  pageTitle: { color: C.white, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  pageSub: { color: C.zinc, fontSize: 12, marginBottom: 14 },
  planCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  planTitle: { color: C.white, fontSize: 16, fontWeight: '800' },
  planSub: { color: C.zinc, fontSize: 12, marginTop: 4 },
  planBtn: { backgroundColor: C.white, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  planBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },
  badge: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  badgeText: { color: C.white, fontSize: 10, fontWeight: '800' }
});
