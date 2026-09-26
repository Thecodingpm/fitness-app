// LeaderboardScreen.js — Clean, Minimalist & Elegant Community Rankings
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Flame,
  Dumbbell,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Clock
} from 'lucide-react-native';
import { totalVolumeKg } from '../data/completedSets.mjs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🌟 Realistic Community Benchmark Athletes
const COMMUNITY_ATHLETES = [
  {
    id: 'ath-1',
    name: 'Marcus Vance',
    tag: 'US · Powerlifting',
    avatar: require('../../assets/avatars/avatar_hero_1.jpg'),
    heavyVolume: 34200,
    heavyPr: '160 kg Bench',
    consistencyDays: 7,
    consistencyStreak: 28,
    rankChange: 0
  },
  {
    id: 'ath-2',
    name: 'Elena Rostova',
    tag: 'UK · Hypertrophy',
    avatar: require('../../assets/avatars/avatar_hero_2.jpg'),
    heavyVolume: 29800,
    heavyPr: '140 kg Squat',
    consistencyDays: 6,
    consistencyStreak: 21,
    rankChange: 1
  },
  {
    id: 'ath-3',
    name: 'Kenji Takahashi',
    tag: 'JP · Strength',
    avatar: require('../../assets/avatars/avatar_4.jpg'),
    heavyVolume: 26400,
    heavyPr: '210 kg Deadlift',
    consistencyDays: 6,
    consistencyStreak: 19,
    rankChange: -1
  },
  {
    id: 'ath-4',
    name: 'Liam O’Connor',
    tag: 'IE · Hybrid',
    avatar: require('../../assets/avatars/avatar_5.jpg'),
    heavyVolume: 22100,
    heavyPr: '130 kg Bench',
    consistencyDays: 5,
    consistencyStreak: 14,
    rankChange: 2
  },
  {
    id: 'ath-5',
    name: 'Sarah Jenkins',
    tag: 'AU · Conditioning',
    avatar: require('../../assets/avatars/avatar_2.jpg'),
    heavyVolume: 19800,
    heavyPr: '115 kg Squat',
    consistencyDays: 6,
    consistencyStreak: 16,
    rankChange: 1
  },
  {
    id: 'ath-6',
    name: 'David Miller',
    tag: 'DE · Powerbuilding',
    avatar: require('../../assets/avatars/avatar_11.jpg'),
    heavyVolume: 16900,
    heavyPr: '180 kg Deadlift',
    consistencyDays: 5,
    consistencyStreak: 11,
    rankChange: -2
  },
  {
    id: 'ath-7',
    name: 'Mateo Silva',
    tag: 'BR · Strength',
    avatar: require('../../assets/avatars/avatar_13.jpg'),
    heavyVolume: 14500,
    heavyPr: '100 kg Bench',
    consistencyDays: 5,
    consistencyStreak: 12,
    rankChange: 0
  },
  {
    id: 'ath-8',
    name: 'Lucas Dubois',
    tag: 'FR · Hypertrophy',
    avatar: require('../../assets/avatars/avatar_12.jpg'),
    heavyVolume: 12800,
    heavyPr: '125 kg Squat',
    consistencyDays: 4,
    consistencyStreak: 9,
    rankChange: -1
  },
  {
    id: 'ath-9',
    name: 'Chloe Kim',
    tag: 'KR · Fitness',
    avatar: require('../../assets/avatars/avatar_9.jpg'),
    heavyVolume: 10400,
    heavyPr: '95 kg Squat',
    consistencyDays: 5,
    consistencyStreak: 10,
    rankChange: 1
  },
  {
    id: 'ath-10',
    name: 'Alexander Novak',
    tag: 'PL · Barbell',
    avatar: require('../../assets/avatars/avatar_14.jpg'),
    heavyVolume: 8900,
    heavyPr: '110 kg Bench',
    consistencyDays: 4,
    consistencyStreak: 7,
    rankChange: 0
  }
];

export function LeaderboardScreen({
  userName = 'Athlete',
  userAvatar,
  completedSets = [],
  dailyWorkoutStatuses = {}
}) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 28));

  // Category: 'HEAVY' (Tonnage) | 'CONSISTENCY' (Days hit gym)
  const [activeCategory, setActiveCategory] = useState('HEAVY');

  // 100% Real User Metrics
  const userRealVolume = useMemo(() => {
    return totalVolumeKg(completedSets || []);
  }, [completedSets]);

  const userRealCompletedDays = useMemo(() => {
    return Object.values(dailyWorkoutStatuses || {}).filter((s) => s === 'completed').length;
  }, [dailyWorkoutStatuses]);

  const userBestPr = useMemo(() => {
    let maxWeight = 0;
    let liftName = '';
    for (const set of completedSets || []) {
      const w = Number(set.weightKg) || 0;
      if (w > maxWeight) {
        maxWeight = w;
        liftName = set.exerciseName || 'Lift';
      }
    }
    return maxWeight > 0 ? `${maxWeight} kg ${liftName}` : 'No verified PR';
  }, [completedSets]);

  // Construct current user profile with 100% real data
  const currentUserAthlete = useMemo(() => {
    return {
      id: 'current-user',
      name: `${userName} (You)`,
      tag: 'You · Verified',
      avatar: userAvatar || require('../../assets/avatars/avatar_hero_1.jpg'),
      heavyVolume: userRealVolume,
      heavyPr: userBestPr,
      consistencyDays: userRealCompletedDays,
      consistencyStreak: userRealCompletedDays,
      rankChange: 0,
      isCurrentUser: true
    };
  }, [userName, userAvatar, userRealVolume, userRealCompletedDays, userBestPr]);

  // Ranked roster sorted strictly by category metric
  const rankedRoster = useMemo(() => {
    const list = [...COMMUNITY_ATHLETES, currentUserAthlete];

    if (activeCategory === 'HEAVY') {
      list.sort((a, b) => b.heavyVolume - a.heavyVolume);
    } else {
      list.sort((a, b) => {
        if (b.consistencyDays !== a.consistencyDays) {
          return b.consistencyDays - a.consistencyDays;
        }
        return b.consistencyStreak - a.consistencyStreak;
      });
    }

    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [activeCategory, currentUserAthlete]);

  // Top 3 Podium Athletes
  const topThree = useMemo(() => {
    return {
      first: rankedRoster[0] || null,
      second: rankedRoster[1] || null,
      third: rankedRoster[2] || null
    };
  }, [rankedRoster]);

  // Roster from Rank 4 onwards
  const listRoster = useMemo(() => {
    return rankedRoster.slice(3);
  }, [rankedRoster]);

  // Current User Standing
  const userRankInfo = useMemo(() => {
    const found = rankedRoster.find((a) => a.isCurrentUser);
    return found || { rank: rankedRoster.length, ...currentUserAthlete };
  }, [rankedRoster, currentUserAthlete]);

  // Format helpers
  const formatTonnage = (kg) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)}k kg`;
    }
    return `${kg} kg`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: safeTop + 6, paddingBottom: 160 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header (Clean & Minimal) */}
        <View style={styles.header}>
          <View style={styles.headerMetaRow}>
            <View style={styles.leagueTag}>
              <Shield size={11} color="#A1A1AA" />
              <Text style={styles.leagueTagText}>DIAMOND LEAGUE</Text>
            </View>
            <View style={styles.resetTag}>
              <Clock size={11} color="#71717A" />
              <Text style={styles.resetTagText}>Resets Sunday</Text>
            </View>
          </View>

          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>
            Weekly standings across the community
          </Text>
        </View>

        {/* 2. Elegant Segmented Switcher */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeCategory === 'HEAVY' && styles.segmentBtnActive
            ]}
            onPress={() => setActiveCategory('HEAVY')}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeCategory === 'HEAVY' }}
          >
            <Dumbbell
              size={14}
              color={activeCategory === 'HEAVY' ? '#FFFFFF' : '#71717A'}
              strokeWidth={activeCategory === 'HEAVY' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.segmentText,
                activeCategory === 'HEAVY' && styles.segmentTextActive
              ]}
            >
              Heavy Lifters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeCategory === 'CONSISTENCY' && styles.segmentBtnActive
            ]}
            onPress={() => setActiveCategory('CONSISTENCY')}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeCategory === 'CONSISTENCY' }}
          >
            <Flame
              size={14}
              color={activeCategory === 'CONSISTENCY' ? '#FFFFFF' : '#71717A'}
              strokeWidth={activeCategory === 'CONSISTENCY' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.segmentText,
                activeCategory === 'CONSISTENCY' && styles.segmentTextActive
              ]}
            >
              Consistency
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Refined Top 3 Showcase (Clean & Modern, No Carnival Pedestals) */}
        <View style={styles.topThreeContainer}>
          {/* #2 Silver (Left) */}
          {topThree.second && (
            <View style={styles.topThreeCard}>
              <View style={[styles.topAvatarRing, styles.ringSilver]}>
                <Image source={topThree.second.avatar} style={styles.topAvatar} />
                <View style={[styles.rankBadge, styles.badgeSilver]}>
                  <Text style={styles.rankBadgeNum}>2</Text>
                </View>
              </View>
              <Text style={styles.topAthleteName} numberOfLines={1}>
                {topThree.second.name.split(' ')[0]}
              </Text>
              <Text style={styles.topAthleteScore} numberOfLines={1}>
                {activeCategory === 'HEAVY'
                  ? formatTonnage(topThree.second.heavyVolume)
                  : `${topThree.second.consistencyDays} days`}
              </Text>
            </View>
          )}

          {/* #1 Gold (Center) */}
          {topThree.first && (
            <View style={[styles.topThreeCard, styles.topThreeCardFirst]}>
              <View style={styles.crownContainer}>
                <Crown size={14} color="#EAB308" fill="#EAB308" />
              </View>
              <View style={[styles.topAvatarRing, styles.ringGold]}>
                <Image source={topThree.first.avatar} style={styles.topAvatarFirst} />
                <View style={[styles.rankBadge, styles.badgeGold]}>
                  <Text style={styles.rankBadgeNumGold}>1</Text>
                </View>
              </View>
              <Text style={[styles.topAthleteName, styles.topAthleteNameGold]} numberOfLines={1}>
                {topThree.first.name.split(' ')[0]}
              </Text>
              <Text style={[styles.topAthleteScore, styles.topAthleteScoreGold]} numberOfLines={1}>
                {activeCategory === 'HEAVY'
                  ? formatTonnage(topThree.first.heavyVolume)
                  : `${topThree.first.consistencyDays} days`}
              </Text>
            </View>
          )}

          {/* #3 Bronze (Right) */}
          {topThree.third && (
            <View style={styles.topThreeCard}>
              <View style={[styles.topAvatarRing, styles.ringBronze]}>
                <Image source={topThree.third.avatar} style={styles.topAvatar} />
                <View style={[styles.rankBadge, styles.badgeBronze]}>
                  <Text style={styles.rankBadgeNum}>3</Text>
                </View>
              </View>
              <Text style={styles.topAthleteName} numberOfLines={1}>
                {topThree.third.name.split(' ')[0]}
              </Text>
              <Text style={styles.topAthleteScore} numberOfLines={1}>
                {activeCategory === 'HEAVY'
                  ? formatTonnage(topThree.third.heavyVolume)
                  : `${topThree.third.consistencyDays} days`}
              </Text>
            </View>
          )}
        </View>

        {/* 4. Your Real Live Standing Card */}
        <View style={styles.yourRankCard}>
          <View style={styles.yourRankLeft}>
            <View style={styles.yourRankIndexBox}>
              <Text style={styles.yourRankIndex}>#{userRankInfo.rank}</Text>
            </View>
            <Image source={currentUserAthlete.avatar} style={styles.yourRankAvatar} />
            <View style={styles.yourRankInfo}>
              <View style={styles.yourRankNameRow}>
                <Text style={styles.yourRankName} numberOfLines={1}>
                  {userName}
                </Text>
                <View style={styles.youPill}>
                  <Text style={styles.youPillText}>YOU</Text>
                </View>
              </View>
              <Text style={styles.yourRankTag}>
                {activeCategory === 'HEAVY'
                  ? `${userRankInfo.heavyVolume.toLocaleString()} kg volume · ${userRankInfo.heavyPr}`
                  : `${userRankInfo.consistencyDays} days logged`}
              </Text>
            </View>
          </View>
          <View style={styles.yourRankRight}>
            <Text style={styles.yourRankScore}>
              {activeCategory === 'HEAVY'
                ? formatTonnage(userRankInfo.heavyVolume)
                : `${userRankInfo.consistencyDays}d`}
            </Text>
          </View>
        </View>

        {/* 5. Minimalist Rankings Roster Table */}
        <View style={styles.rosterSectionHeader}>
          <Text style={styles.rosterSectionTitle}>STANDINGS</Text>
          <Text style={styles.rosterSectionCount}>{rankedRoster.length} Athletes</Text>
        </View>

        <View style={styles.rosterTable}>
          {listRoster.map((athlete, index) => {
            const isUser = athlete.isCurrentUser;
            const isLast = index === listRoster.length - 1;

            return (
              <View
                key={athlete.id}
                style={[
                  styles.rosterRow,
                  isUser && styles.rosterRowUser,
                  !isLast && styles.rosterRowDivider
                ]}
              >
                {/* Rank Number */}
                <Text style={[styles.rosterRankNum, isUser && styles.rosterRankNumUser]}>
                  {athlete.rank}
                </Text>

                {/* Avatar */}
                <Image source={athlete.avatar} style={styles.rosterAvatar} />

                {/* Athlete Info */}
                <View style={styles.rosterInfoCol}>
                  <View style={styles.rosterNameRow}>
                    <Text style={[styles.rosterName, isUser && styles.rosterNameUser]} numberOfLines={1}>
                      {athlete.name}
                    </Text>
                    {isUser && (
                      <View style={styles.youMiniBadge}>
                        <Text style={styles.youMiniBadgeText}>YOU</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.rosterTag} numberOfLines={1}>
                    {athlete.tag}
                  </Text>
                </View>

                {/* Metric Score & Rank Trend */}
                <View style={styles.rosterScoreCol}>
                  <Text style={[styles.rosterScoreText, isUser && styles.rosterScoreTextUser]}>
                    {activeCategory === 'HEAVY'
                      ? formatTonnage(athlete.heavyVolume)
                      : `${athlete.consistencyDays} days`}
                  </Text>
                  <View style={styles.rosterTrendRow}>
                    {athlete.rankChange > 0 ? (
                      <TrendingUp size={11} color="#10B981" />
                    ) : athlete.rankChange < 0 ? (
                      <TrendingDown size={11} color="#EF4444" />
                    ) : (
                      <Minus size={11} color="#52525B" />
                    )}
                    <Text style={styles.rosterTrendText}>
                      {athlete.rankChange === 0 ? '—' : Math.abs(athlete.rankChange)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20
  },

  // Header
  header: {
    marginBottom: 16
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  leagueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5
  },
  leagueTagText: {
    color: '#D4D4D8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  resetTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  resetTagText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 2
  },

  // Segmented Control
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#141416',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 20
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6
  },
  segmentBtnActive: {
    backgroundColor: '#222226',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2
  },
  segmentText: {
    color: '#71717A',
    fontSize: 12.5,
    fontWeight: '700'
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // Top 3 Minimalist Showcase
  topThreeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#121214',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16
  },
  topThreeCard: {
    flex: 1,
    alignItems: 'center'
  },
  topThreeCardFirst: {
    marginBottom: 4
  },
  crownContainer: {
    marginBottom: 4
  },
  topAvatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 2,
    borderWidth: 1.5,
    position: 'relative',
    marginBottom: 8
  },
  ringGold: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#EAB308',
    borderWidth: 2
  },
  ringSilver: {
    borderColor: '#94A3B8'
  },
  ringBronze: {
    borderColor: '#D97706'
  },
  topAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25
  },
  topAvatarFirst: {
    width: '100%',
    height: '100%',
    borderRadius: 30
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1
  },
  badgeGold: {
    backgroundColor: '#EAB308',
    borderColor: '#FEF08A'
  },
  badgeSilver: {
    backgroundColor: '#64748B',
    borderColor: '#CBD5E1'
  },
  badgeBronze: {
    backgroundColor: '#B45309',
    borderColor: '#FDE68A'
  },
  rankBadgeNum: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  rankBadgeNumGold: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900'
  },
  topAthleteName: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2
  },
  topAthleteNameGold: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  topAthleteScore: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  },
  topAthleteScoreGold: {
    color: '#EAB308',
    fontWeight: '700'
  },

  // Your Rank Card
  yourRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.28)',
    marginBottom: 20
  },
  yourRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  yourRankIndexBox: {
    width: 28,
    alignItems: 'center',
    marginRight: 6
  },
  yourRankIndex: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '900'
  },
  yourRankAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    marginRight: 10
  },
  yourRankInfo: {
    flex: 1
  },
  yourRankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  yourRankName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  youPill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  youPillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900'
  },
  yourRankTag: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 1
  },
  yourRankRight: {
    alignItems: 'flex-end'
  },
  yourRankScore: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },

  // Standings Roster Table
  rosterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4
  },
  rosterSectionTitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  rosterSectionCount: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '600'
  },
  rosterTable: {
    backgroundColor: '#121214',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden'
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  rosterRowUser: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)'
  },
  rosterRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  rosterRankNum: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '700',
    width: 24
  },
  rosterRankNumUser: {
    color: '#EF4444',
    fontWeight: '900'
  },
  rosterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  rosterInfoCol: {
    flex: 1,
    marginRight: 10
  },
  rosterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  rosterName: {
    color: '#E4E4E7',
    fontSize: 13.5,
    fontWeight: '700'
  },
  rosterNameUser: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  youMiniBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  youMiniBadgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900'
  },
  rosterTag: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 1
  },
  rosterScoreCol: {
    alignItems: 'flex-end'
  },
  rosterScoreText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '700'
  },
  rosterScoreTextUser: {
    color: '#EF4444',
    fontWeight: '800'
  },
  rosterTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2
  },
  rosterTrendText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600'
  }
});
