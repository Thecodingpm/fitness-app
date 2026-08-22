import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Home,
  Dumbbell,
  Users,
  TrendingUp,
  User,
  Flame,
  Footprints,
  Clock,
  Play,
  Check,
  Search,
  Trophy,
  Shield,
  Zap,
  Activity
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Black & Purple Global Theme
const C = {
  bg: '#08070E',
  surface: '#131022',
  surfaceVariant: '#1B1630',
  surfaceElevated: '#241D40',
  border: '#2E2652',
  borderSubtle: '#1F1A38',
  purple: '#7C3AED',
  purpleDark: '#5B21B6',
  purpleLight: '#A78BFA',
  purpleAccent: '#C4B5FD',
  orange: '#FF7A00',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  rose: '#F43F5E'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('community'); // 'home' | 'workouts' | 'community' | 'progress' | 'profile'
  const [userPoints, setUserPoints] = useState(395);
  const [likes, setLikes] = useState(18);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* ======================================================== */}
        {/* COMMUNITY & CHALLENGES TAB */}
        {/* ======================================================== */}
        {currentTab === 'community' && (
          <View>
            {/* FitPulse Clean Brand Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 12, borderWidth: 1, borderColor: C.borderSubtle }}>
              <Activity size={14} color={C.purpleAccent} />
              <Text style={{ fontSize: 11, fontWeight: '900', color: C.textPrimary, letterSpacing: 1.5 }}>FITPULSE</Text>
            </View>

            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Community & Races</Text>
                <Text style={styles.headerSub}>Compete, inspire, and grow together</Text>
              </View>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => Alert.alert('Privacy & Safety', 'Body weight is private and never shared. Ranking is based strictly on consistency.')}
              >
                <Shield size={18} color={C.purpleAccent} />
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => Alert.alert('⚡ Challenge a Friend', 'Select friend to invite for 7-Day Workout Race!')}
              >
                <Zap size={16} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Challenge Friend</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => Alert.alert('+ Create Challenge', 'Custom challenge creator opened.')}
              >
                <Text style={styles.btnSecondaryText}>+ Create</Text>
              </TouchableOpacity>
            </View>

            {/* 🏁 7-Day Fitness Race Track */}
            <LinearGradient colors={['#241A42', '#130E26']} style={styles.raceCard}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🏁 7-DAY FITNESS RACE</Text>
                </View>
                <Text style={{ fontSize: 11, color: C.orange, fontWeight: '800' }}>⏱ 3 Days Left</Text>
              </View>

              <Text style={styles.raceTitle}>Friend Workout & Consistency Sprint</Text>
              <Text style={styles.raceDesc}>Score points by logging workouts, hitting step targets, and staying consistent.</Text>

              {/* Racers */}
              <View style={{ marginVertical: 14 }}>
                <View style={styles.racerRow}>
                  <Text style={styles.racerName}>1. Alex Vance</Text>
                  <Text style={styles.racerPts}>420 pts</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.trackFill, { width: '85%' }]} />
                </View>

                <View style={[styles.racerRow, { marginTop: 10 }]}>
                  <Text style={[styles.racerName, { color: C.purpleAccent, fontWeight: '900' }]}>2. Sarah (You)</Text>
                  <Text style={[styles.racerPts, { color: C.purpleAccent }]}>{userPoints} pts</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.trackFill, { width: `${(userPoints / 500) * 100}%`, backgroundColor: C.purpleAccent }]} />
                </View>
              </View>

              <TouchableOpacity
                style={styles.logBtn}
                onPress={() => {
                  setUserPoints(prev => prev + 30);
                  Alert.alert('🔥 Logged!', '+30 Points Earned! You moved into 1st Place! 🎉');
                }}
              >
                <Text style={styles.logBtnText}>⚡ Log Activity (+30 pts)</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* Global Challenges */}
            <Text style={styles.sectionHeader}>Worldwide Movements</Text>
            <View style={styles.challengeCard}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🌎 GLOBAL CHALLENGE</Text>
                </View>
                <Text style={{ fontSize: 11, color: C.textSecondary }}>6 days left</Text>
              </View>
              <Text style={styles.cardTitle}>Global 1 Million Step Challenge</Text>
              <Text style={styles.cardDesc}>Progress: 782,430 / 1,000,000 steps • 124,892 athletes • 87 countries</Text>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => Alert.alert('Joined!', 'You are participating in Global 1M Steps! ⭐ +600 XP')}
              >
                <Text style={styles.btnPrimaryText}>✓ Joined • Active in Challenge</Text>
              </TouchableOpacity>
            </View>

            {/* Friend Feed */}
            <Text style={styles.sectionHeader}>Friend Activity Feed</Text>
            <View style={styles.challengeCard}>
              <Text style={{ fontWeight: '800', color: '#FFF', fontSize: 13 }}>Sarah completed a 25m HIIT Workout! 🔥</Text>
              <Text style={{ color: C.textSecondary, fontSize: 11, marginVertical: 4 }}>10m ago</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <TouchableOpacity
                  style={styles.reactionPill}
                  onPress={() => setLikes(likes + 1)}
                >
                  <Text style={{ color: '#FFF', fontSize: 12 }}>❤️ {likes}</Text>
                </TouchableOpacity>
                <View style={styles.reactionPill}>
                  <Text style={{ color: '#FFF', fontSize: 12 }}>🔥 12</Text>
                </View>
                <View style={styles.reactionPill}>
                  <Text style={{ color: '#FFF', fontSize: 12 }}>💪 14</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* HOME TAB */}
        {currentTab === 'home' && (
          <View>
            <Text style={styles.headerTitle}>Home Dashboard</Text>
            <LinearGradient colors={['#241A42', '#130E26']} style={styles.raceCard}>
              <Text style={styles.cardTitle}>75.0 kg → 70.0 kg target</Text>
              <Text style={styles.cardDesc}>You're 74% closer to your sustainable fitness goal.</Text>
            </LinearGradient>
          </View>
        )}

        {/* WORKOUTS TAB */}
        {currentTab === 'workouts' && (
          <View>
            <Text style={styles.headerTitle}>Workout Hub</Text>
            <View style={styles.challengeCard}>
              <Text style={styles.cardTitle}>Fat Burn HIIT Accelerator</Text>
              <Text style={styles.cardDesc}>25 min • 240 kcal • Intermediate</Text>
            </View>
          </View>
        )}

        {/* PROGRESS TAB */}
        {currentTab === 'progress' && (
          <View>
            <Text style={styles.headerTitle}>Progress & Stats</Text>
            <View style={styles.challengeCard}>
              <Text style={styles.cardTitle}>72.4 kg (↓ 1.6 kg this month)</Text>
            </View>
          </View>
        )}

        {/* PROFILE TAB */}
        {currentTab === 'profile' && (
          <View>
            <Text style={styles.headerTitle}>Profile & Preferences</Text>
            <View style={styles.challengeCard}>
              <Text style={styles.cardTitle}>Sarah • Level 12 Pro</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation (5 Tabs) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <Home size={20} color={currentTab === 'home' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'home' && { color: C.purpleAccent }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('workouts')}>
          <Dumbbell size={20} color={currentTab === 'workouts' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'workouts' && { color: C.purpleAccent }]}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('community')}>
          <Users size={20} color={currentTab === 'community' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'community' && { color: C.purpleAccent }]}>Community</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('progress')}>
          <TrendingUp size={20} color={currentTab === 'progress' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'progress' && { color: C.purpleAccent }]}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('profile')}>
          <User size={20} color={currentTab === 'profile' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'profile' && { color: C.purpleAccent }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.textPrimary
  },
  headerSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  btnPrimary: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: C.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  btnPrimaryText: {
    fontWeight: '800',
    color: '#FFF',
    fontSize: 13
  },
  btnSecondary: {
    width: 100,
    height: 46,
    borderRadius: 12,
    backgroundColor: C.surfaceVariant,
    borderWidth: 1,
    borderColor: C.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnSecondaryText: {
    fontWeight: '700',
    color: C.textPrimary,
    fontSize: 13
  },
  raceCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
    marginBottom: 16
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  badge: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.purpleAccent
  },
  raceTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 4
  },
  raceDesc: {
    fontSize: 12,
    color: C.textSecondary,
    lineHeight: 16
  },
  racerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  racerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF'
  },
  racerPts: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF'
  },
  track: {
    height: 14,
    backgroundColor: C.surfaceVariant,
    borderRadius: 7,
    overflow: 'hidden'
  },
  trackFill: {
    height: '100%',
    backgroundColor: C.purple,
    borderRadius: 7
  },
  logBtn: {
    height: 42,
    backgroundColor: C.purple,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  logBtnText: {
    fontWeight: '800',
    color: '#FFF',
    fontSize: 13
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    marginVertical: 12
  },
  challengeCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderSubtle,
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 12,
    color: C.textSecondary,
    lineHeight: 16,
    marginBottom: 12
  },
  reactionPill: {
    backgroundColor: C.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderColor: C.borderSubtle,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8
  },
  navItem: {
    alignItems: 'center',
    gap: 4
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textSecondary
  }
});
