import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Crown, LogOut } from 'lucide-react-native';
import { C } from '../constants/theme';

export function ProfileScreen({
  userName,
  userEmail,
  onEditProfile,
  onOpenPaywall,
  onLogOut
}) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Athlete Profile</Text>

      {/* User Card */}
      <View style={styles.planCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.planTitle, { fontSize: 20 }]}>{userName || 'Athlete'}</Text>
            <Text style={styles.planSub}>Level 12 • {userEmail || 'Firebase Athlete'}</Text>
          </View>
          <TouchableOpacity style={styles.editPill} onPress={onEditProfile}>
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNum}>14</Text>
            <Text style={styles.profileStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNum}>24</Text>
            <Text style={styles.profileStatLabel}>Workouts</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNum}>4,850</Text>
            <Text style={styles.profileStatLabel}>Total XP</Text>
          </View>
        </View>
      </View>

      {/* Pro Subscription Banner */}
      <View style={styles.proCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Crown size={16} color={C.white} />
          <Text style={{ color: C.white, fontWeight: '900', fontSize: 13, letterSpacing: 0.5 }}>LIFT PRO</Text>
        </View>
        <Text style={{ color: C.zinc, fontSize: 12, marginTop: 4 }}>
          Unlock Unlimited 1-on-1 AI Voice Coach, Custom Splits, and Progressive Overload Tracking.
        </Text>
        <TouchableOpacity style={styles.upgradeBtn} onPress={onOpenPaywall}>
          <Text style={styles.upgradeBtnText}>Start 7-Day Free Trial ⭐</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Records */}
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Personal Records (PRs)</Text>
        <Text style={styles.planSub}>• Bench Press: 70 kg</Text>
        <Text style={styles.planSub}>• Squat: 85 kg</Text>
        <Text style={styles.planSub}>• Pull-Ups: 10 reps</Text>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogOut}>
        <LogOut size={16} color={C.rose} />
        <Text style={styles.logoutBtnText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  pageTitle: { color: C.white, fontSize: 22, fontWeight: '900', marginBottom: 14 },
  planCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  planTitle: { color: C.white, fontSize: 16, fontWeight: '800' },
  planSub: { color: C.zinc, fontSize: 12, marginTop: 4 },
  editPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  editPillText: { color: C.white, fontSize: 11, fontWeight: '700' },
  profileStat: { flex: 1, backgroundColor: C.surfaceVariant, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  profileStatNum: { color: C.white, fontSize: 16, fontWeight: '900' },
  profileStatLabel: { color: C.zinc, fontSize: 10, marginTop: 2 },
  proCard: { backgroundColor: C.surfaceElevated, borderRadius: 16, padding: 16, marginVertical: 10, borderWidth: 1, borderColor: C.border },
  upgradeBtn: { backgroundColor: C.white, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  upgradeBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.surfaceVariant, height: 44, borderRadius: 12, marginTop: 14, borderWidth: 1, borderColor: C.border },
  logoutBtnText: { color: C.rose, fontWeight: '800', fontSize: 13 }
});
