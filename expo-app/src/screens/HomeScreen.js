import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { User, Edit3, Play, Sparkles, Dumbbell } from 'lucide-react-native';
import { C } from '../constants/theme';
import { LiftBrandLogo } from '../components/LiftLogo';

export function HomeScreen({
  userName,
  onNavigateTab,
  onStartWorkout,
  onSelectMuscle
}) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {/* Brand Header */}
      <View style={styles.headerRow}>
        <LiftBrandLogo size="small" />

        <TouchableOpacity style={styles.userBadge} onPress={() => onNavigateTab('profile')}>
          <User size={13} color={C.white} />
          <Text style={styles.userBadgeText}>{userName || 'Athlete'}</Text>
          <Edit3 size={11} color={C.zinc} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Personalized Greeting */}
      <Text style={styles.welcomeSub}>Ready for today's session,</Text>
      <Text style={styles.welcomeTitle}>{userName || 'Athlete'}? 👋</Text>

      {/* Today's Target Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroTag}><Text style={styles.heroTagText}>TODAY'S WORKOUT</Text></View>
          <Text style={{ color: C.zinc, fontSize: 12, fontWeight: '700' }}>3 Exercises • 45 Mins</Text>
        </View>

        <Text style={styles.heroTitle}>Push Hypertrophy Day</Text>
        <Text style={styles.heroSub}>Custom-tailored for {userName}'s fitness goals</Text>

        {/* Quick Metrics */}
        <View style={styles.chipsRow}>
          <View style={styles.chip}><Text style={styles.chipText}>🔥 320 kcal</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>⚡ +250 XP</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>🎯 Chest & Triceps</Text></View>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={onStartWorkout}>
          <Play size={16} color={C.bg} fill={C.bg} />
          <Text style={styles.startBtnText}>Start Workout Session ▶</Text>
        </TouchableOpacity>
      </View>

      {/* 7-Day Gym Split Strip */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Weekly Gym Split</Text>
        <Text style={styles.sectionSub}>Phase 1 Roadmap</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {[
          { day: 'Mon', split: 'Push (Chest/Tri)', active: true },
          { day: 'Tue', split: 'Pull (Back/Bi)', active: false },
          { day: 'Wed', split: 'Legs & Core', active: false },
          { day: 'Thu', split: 'Rest / Mobility', active: false },
          { day: 'Fri', split: 'Upper Body', active: false },
          { day: 'Sat', split: 'Lower Body', active: false },
          { day: 'Sun', split: 'Active Recovery', active: false }
        ].map((item, idx) => (
          <View key={idx} style={[styles.dayCard, item.active && styles.dayCardActive]}>
            <Text style={[styles.dayText, item.active && { color: C.white, fontWeight: '900' }]}>{item.day}</Text>
            <Text style={[styles.daySplitText, item.active && { color: C.white }]} numberOfLines={2}>{item.split}</Text>
          </View>
        ))}
      </ScrollView>

      {/* AI Progressive Overload Banner */}
      <View style={styles.aiCoachCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color={C.white} />
          <Text style={{ color: C.white, fontWeight: '900', fontSize: 12 }}>AI VOICE COACH READY</Text>
        </View>
        <Text style={{ color: C.zinc, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
          "Put your headphones on, {userName}! The Audio Coach will guide your cadence (3s lower, hold, explode) hands-free."
        </Text>
      </View>

      {/* Muscle Focus Selector */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Explore by Muscle</Text>
      <View style={styles.categoryRow}>
        {['Chest', 'Back', 'Legs', 'Arms'].map((muscle, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.categoryCard}
            onPress={() => onSelectMuscle(muscle)}
          >
            <Dumbbell size={18} color={C.white} />
            <Text style={styles.categoryLabel}>{muscle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  userBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  userBadgeText: { color: C.white, fontSize: 11, fontWeight: '800' },
  welcomeSub: { color: C.zinc, fontSize: 13 },
  welcomeTitle: { color: C.white, fontSize: 26, fontWeight: '900', marginBottom: 16 },
  heroCard: { backgroundColor: C.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 22 },
  heroBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  heroTag: { backgroundColor: C.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  heroTagText: { color: C.bg, fontSize: 9, fontWeight: '900' },
  heroTitle: { color: C.white, fontSize: 20, fontWeight: '900', marginTop: 4 },
  heroSub: { color: C.zinc, fontSize: 12, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 6, marginVertical: 14 },
  chip: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  chipText: { color: C.white, fontSize: 11, fontWeight: '600' },
  startBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  startBtnText: { color: C.bg, fontWeight: '900', fontSize: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: C.white, fontSize: 16, fontWeight: '900' },
  sectionSub: { color: C.zinc, fontSize: 11, fontWeight: '700' },
  dayCard: { width: 85, backgroundColor: C.surface, borderRadius: 14, padding: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle, alignItems: 'center' },
  dayCardActive: { borderColor: C.white, backgroundColor: C.surfaceElevated },
  dayText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
  daySplitText: { color: C.zinc, fontSize: 10, marginTop: 4, textAlign: 'center' },
  categoryRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  categoryCard: { flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  categoryLabel: { color: C.white, fontSize: 11, fontWeight: '700', marginTop: 4 },
  aiCoachCard: { backgroundColor: C.surfaceVariant, borderRadius: 16, padding: 14, marginVertical: 10, borderWidth: 1, borderColor: C.border }
});
