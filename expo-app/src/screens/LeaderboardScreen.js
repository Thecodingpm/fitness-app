// LeaderboardScreen.js — Global Gym Arena & Community Rankings
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
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  Flame,
  Dumbbell,
  Crown,
  Medal,
  Award,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react-native';
import { totalVolumeKg } from '../data/completedSets.mjs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🌟 Community Athletes DB for Realistic Global Competition
const COMMUNITY_ATHLETES = [
  {
    id: 'ath-1',
    name: 'Marcus Vance',
    title: 'Powerlifter · US',
    avatar: require('../../assets/avatars/avatar_hero_1.jpg'),
    heavyVolume: 34200,
    heavyPr: '160 kg Bench',
    consistencyDays: 7,
    consistencyStreak: 28,
    rankChange: 0,
    tier: 'Titan'
  },
  {
    id: 'ath-2',
    name: 'Elena Rostova',
    title: 'Bodybuilder · UK',
    avatar: require('../../assets/avatars/avatar_hero_2.jpg'),
    heavyVolume: 29800,
    heavyPr: '140 kg Squat',
    consistencyDays: 6,
    consistencyStreak: 21,
    rankChange: 1,
    tier: 'Titan'
  },
  {
    id: 'ath-3',
    name: 'Kenji Takahashi',
    title: 'Strength Athlete · JP',
    avatar: require('../../assets/avatars/avatar_4.jpg'),
    heavyVolume: 26400,
    heavyPr: '210 kg Deadlift',
    consistencyDays: 6,
    consistencyStreak: 19,
    rankChange: -1,
    tier: 'Diamond'
  },
  {
    id: 'ath-4',
    name: 'Liam O’Connor',
    title: 'Hybrid Lifter · IE',
    avatar: require('../../assets/avatars/avatar_5.jpg'),
    heavyVolume: 22100,
    heavyPr: '130 kg Bench',
    consistencyDays: 5,
    consistencyStreak: 14,
    rankChange: 2,
    tier: 'Diamond'
  },
  {
    id: 'ath-5',
    name: 'Sarah Jenkins',
    title: 'CrossFit Athlete · AU',
    avatar: require('../../assets/avatars/avatar_2.jpg'),
    heavyVolume: 19800,
    heavyPr: '115 kg Squat',
    consistencyDays: 6,
    consistencyStreak: 16,
    rankChange: 1,
    tier: 'Diamond'
  },
  {
    id: 'ath-6',
    name: 'David Miller',
    title: 'Gym Beast · DE',
    avatar: require('../../assets/avatars/avatar_11.jpg'),
    heavyVolume: 16900,
    heavyPr: '180 kg Deadlift',
    consistencyDays: 5,
    consistencyStreak: 11,
    rankChange: -2,
    tier: 'Gold'
  },
  {
    id: 'ath-7',
    name: 'Mateo Silva',
    title: 'Calisthenics & Iron · BR',
    avatar: require('../../assets/avatars/avatar_13.jpg'),
    heavyVolume: 14500,
    heavyPr: '100 kg Bench',
    consistencyDays: 5,
    consistencyStreak: 12,
    rankChange: 3,
    tier: 'Gold'
  },
  {
    id: 'ath-8',
    name: 'Lucas Dubois',
    title: 'Hypertrophy Focus · FR',
    avatar: require('../../assets/avatars/avatar_12.jpg'),
    heavyVolume: 12800,
    heavyPr: '125 kg Squat',
    consistencyDays: 4,
    consistencyStreak: 9,
    rankChange: -1,
    tier: 'Gold'
  },
  {
    id: 'ath-9',
    name: 'Chloe Kim',
    title: 'Functional Fitness · KR',
    avatar: require('../../assets/avatars/avatar_9.jpg'),
    heavyVolume: 10400,
    heavyPr: '95 kg Squat',
    consistencyDays: 5,
    consistencyStreak: 10,
    rankChange: 0,
    tier: 'Silver'
  },
  {
    id: 'ath-10',
    name: 'Alexander Novak',
    title: 'Power Builder · PL',
    avatar: require('../../assets/avatars/avatar_14.jpg'),
    heavyVolume: 8900,
    heavyPr: '110 kg Bench',
    consistencyDays: 4,
    consistencyStreak: 7,
    rankChange: 2,
    tier: 'Silver'
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

  // Active Category: 'HEAVY' (Heavy Lifters) | 'CONSISTENCY' (Daily Streaks)
  const [activeCategory, setActiveCategory] = useState('HEAVY');
  // Timeframe Filter: 'WEEKLY' | 'ALL_TIME'
  const [timeframe, setTimeframe] = useState('WEEKLY');

  // Compute User's Real Metrics
  const userRealVolume = useMemo(() => {
    return totalVolumeKg(completedSets);
  }, [completedSets]);

  const userRealCompletedDays = useMemo(() => {
    return Object.values(dailyWorkoutStatuses).filter((s) => s === 'completed').length;
  }, [dailyWorkoutStatuses]);

  const userBestPr = useMemo(() => {
    let maxWeight = 0;
    let liftName = 'Bench Press';
    for (const set of completedSets) {
      const w = Number(set.weightKg) || 0;
      if (w > maxWeight) {
        maxWeight = w;
        liftName = set.exerciseName || 'Lift';
      }
    }
    return maxWeight > 0 ? `${maxWeight} kg ${liftName}` : '100 kg Bench';
  }, [completedSets]);

  // Construct current user's athlete profile
  const currentUserAthlete = useMemo(() => {
    // If the user has logged sets, use their real volume; otherwise provide an active starter baseline
    const effectiveVolume = userRealVolume > 0 ? userRealVolume : 15800;
    const effectiveDays = userRealCompletedDays > 0 ? userRealCompletedDays : 5;
    const effectiveStreak = effectiveDays * 2 + 3;

    return {
      id: 'current-user',
      name: `${userName} (You)`,
      title: 'Active Competitor',
      avatar: userAvatar || require('../../assets/avatars/avatar_hero_1.jpg'),
      heavyVolume: effectiveVolume,
      heavyPr: userBestPr,
      consistencyDays: effectiveDays,
      consistencyStreak: effectiveStreak,
      rankChange: 2,
      tier: effectiveVolume > 25000 ? 'Titan' : effectiveVolume > 15000 ? 'Diamond' : 'Gold',
      isCurrentUser: true
    };
  }, [userName, userAvatar, userRealVolume, userRealCompletedDays, userBestPr]);

  // Generate Ranked Leaderboard based on active category
  const rankedRoster = useMemo(() => {
    const list = [...COMMUNITY_ATHLETES, currentUserAthlete];

    if (activeCategory === 'HEAVY') {
      list.sort((a, b) => b.heavyVolume - a.heavyVolume);
    } else {
      // Consistency: sorted by days completed, then streak, then volume
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

  // Top 3 Podium
  const topThree = useMemo(() => {
    return {
      first: rankedRoster[0] || null,
      second: rankedRoster[1] || null,
      third: rankedRoster[2] || null
    };
  }, [rankedRoster]);

  // Rest of the Roster (Rank 4 onwards)
  const listRoster = useMemo(() => {
    return rankedRoster.slice(3);
  }, [rankedRoster]);

  // Current User's Position in the active ranking
  const userRankInfo = useMemo(() => {
    const found = rankedRoster.find((a) => a.isCurrentUser);
    return found || { rank: 5, ...currentUserAthlete };
  }, [rankedRoster, currentUserAthlete]);

  // Formatter helpers
  const formatVolume = (kg) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)}k kg`;
    }
    return `${kg} kg`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Ambient Dark Crimson & Gold Glow */}
      <LinearGradient
        colors={
          activeCategory === 'HEAVY'
            ? ['rgba(239, 68, 68, 0.22)', 'rgba(239, 68, 68, 0.04)', 'transparent']
            : ['rgba(245, 158, 11, 0.22)', 'rgba(245, 158, 11, 0.04)', 'transparent']
        }
        style={styles.bgGlow}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: safeTop + 6, paddingBottom: 110 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 🏆 1. Screen Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.leagueBadge}>
              <Shield size={12} color="#F59E0B" />
              <Text style={styles.leagueBadgeText}>DIAMOND LEAGUE · DIV 1</Text>
            </View>

            <View style={styles.timerBadge}>
              <Clock size={11} color="#A1A1AA" />
              <Text style={styles.timerBadgeText}>Resets in 2d 14h</Text>
            </View>
          </View>

          <Text style={styles.title}>Global Leaderboard</Text>
          <Text style={styles.subtitle}>
            Compete with athletes worldwide. Push heavy iron or show up daily to claim the crown.
          </Text>
        </View>

        {/* ⚡ 2. Category Switcher (The 2 Core Sections Requested) */}
        <View style={styles.categorySwitcherContainer}>
          {/* Section 1: Heavy Lifters */}
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              activeCategory === 'HEAVY' && styles.categoryBtnActive
            ]}
            onPress={() => setActiveCategory('HEAVY')}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeCategory === 'HEAVY' }}
          >
            <Dumbbell
              size={17}
              color={activeCategory === 'HEAVY' ? '#FFFFFF' : '#A1A1AA'}
              strokeWidth={activeCategory === 'HEAVY' ? 2.5 : 2}
            />
            <View style={styles.categoryTextCol}>
              <Text
                style={[
                  styles.categoryTitle,
                  activeCategory === 'HEAVY' && styles.categoryTitleActive
                ]}
              >
                Heavy Lifters
              </Text>
              <Text style={styles.categorySub}>Volume & 1RM Power</Text>
            </View>
          </TouchableOpacity>

          {/* Section 2: Daily Consistency */}
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              activeCategory === 'CONSISTENCY' && styles.categoryBtnActiveConsistency
            ]}
            onPress={() => setActiveCategory('CONSISTENCY')}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeCategory === 'CONSISTENCY' }}
          >
            <Flame
              size={17}
              color={activeCategory === 'CONSISTENCY' ? '#FFFFFF' : '#A1A1AA'}
              strokeWidth={activeCategory === 'CONSISTENCY' ? 2.5 : 2}
            />
            <View style={styles.categoryTextCol}>
              <Text
                style={[
                  styles.categoryTitle,
                  activeCategory === 'CONSISTENCY' && styles.categoryTitleActive
                ]}
              >
                Consistency Kings
              </Text>
              <Text style={styles.categorySub}>Daily Attendance</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 🥇 3. Olympic-Style Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* 🥈 #2 Silver Place (Left) */}
          {topThree.second && (
            <View style={styles.podiumCol}>
              <View style={[styles.avatarWrap, styles.avatarWrapSilver]}>
                <Image source={topThree.second.avatar} style={styles.avatarImg} />
                <View style={[styles.podiumRankBadge, styles.podiumBadgeSilver]}>
                  <Text style={styles.podiumRankText}>2</Text>
                </View>
              </View>

              <Text style={styles.podiumName} numberOfLines={1}>
                {topThree.second.name.split(' ')[0]}
              </Text>
              <Text style={styles.podiumScore} numberOfLines={1}>
                {activeCategory === 'HEAVY'
                  ? formatVolume(topThree.second.heavyVolume)
                  : `${topThree.second.consistencyDays}d · ${topThree.second.consistencyStreak} streak`}
              </Text>

              {/* Pedestal */}
              <LinearGradient
                colors={['#3F3F46', '#27272A', '#18181B']}
                style={[styles.pedestal, styles.pedestalSilver]}
              >
                <Medal size={20} color="#D4D4D8" />
                <Text style={styles.pedestalLabel}>SILVER</Text>
              </LinearGradient>
            </View>
          )}

          {/* 👑 #1 Gold Place (Center - Elevated) */}
          {topThree.first && (
            <View style={[styles.podiumCol, styles.podiumColFirst]}>
              <View style={styles.crownWrap}>
                <Crown size={22} color="#F59E0B" fill="#F59E0B" />
              </View>

              <View style={[styles.avatarWrap, styles.avatarWrapGold]}>
                <Image source={topThree.first.avatar} style={styles.avatarImgFirst} />
                <View style={[styles.podiumRankBadge, styles.podiumBadgeGold]}>
                  <Text style={styles.podiumRankTextGold}>1</Text>
                </View>
              </View>

              <Text style={[styles.podiumName, styles.podiumNameGold]} numberOfLines={1}>
                {topThree.first.name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumScore, styles.podiumScoreGold]} numberOfLines={1}>
                {activeCategory === 'HEAVY'
                  ? formatVolume(topThree.first.heavyVolume)
                  : `${topThree.first.consistencyDays}d · ${topThree.first.consistencyStreak} streak`}
              </Text>

              {/* Pedestal */}
              <LinearGradient
                colors={['#D97706', '#92400E', '#451A03']}
                style={[styles.pedestal, styles.pedestalGold]}
              >
                <Trophy size={26} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.pedestalLabelGold}>CHAMPION</Text>
              </LinearGradient>
            </View>
          )}

          {/* 🥉 #3 Bronze Place (Right) */}
          {topThree.third && (
            <View style={styles.podiumCol}>
              <View style={[styles.avatarWrap, styles.avatarWrapBronze]}>
                <Image source={topThree.third.avatar} style={styles.avatarImg} />
                <View style={[styles.podiumRankBadge, styles.podiumBadgeBronze]}>
                  <Text style={styles.podiumRankText}>3</Text>
                </View>
              </View>

              <Text style={styles.podiumName} numberOfLines={1}>
                {topThree.third.name.split(' ')[0]}
              </Text>
              <Text style={styles.podiumScore} numberOfLines={1}>
                {activeCategory === 'HEAVY'
                  ? formatVolume(topThree.third.heavyVolume)
                  : `${topThree.third.consistencyDays}d · ${topThree.third.consistencyStreak} streak`}
              </Text>

              {/* Pedestal */}
              <LinearGradient
                colors={['#78350F', '#451A03', '#18181B']}
                style={[styles.pedestal, styles.pedestalBronze]}
              >
                <Award size={20} color="#F59E0B" />
                <Text style={styles.pedestalLabel}>BRONZE</Text>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* 🌟 4. Your Real Live Standing Card */}
        <View style={styles.yourRankCard}>
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.16)', 'rgba(24, 24, 27, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.yourRankLeft}>
            <View style={styles.yourRankNumBox}>
              <Text style={styles.yourRankNum}>#{userRankInfo.rank}</Text>
              <Text style={styles.yourRankLabel}>YOUR RANK</Text>
            </View>

            <View style={styles.yourRankAvatarWrap}>
              <Image source={currentUserAthlete.avatar} style={styles.yourRankAvatar} />
            </View>

            <View style={styles.yourRankDetails}>
              <Text style={styles.yourRankName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.yourRankMeta}>
                {activeCategory === 'HEAVY'
                  ? `${formatVolume(userRankInfo.heavyVolume)} volume · ${userRankInfo.heavyPr}`
                  : `${userRankInfo.consistencyDays} Days trained · ${userRankInfo.consistencyStreak}d Streak`}
              </Text>
            </View>
          </View>

          <View style={styles.yourRankStatusPill}>
            <Sparkles size={11} color="#10B981" />
            <Text style={styles.yourRankStatusText}>TOP 10%</Text>
          </View>
        </View>

        {/* 📋 5. Detailed Ranked Roster (Rank 4 to 11+) */}
        <View style={styles.rosterSectionHeader}>
          <Text style={styles.rosterSectionTitle}>LEAGUE ROSTER</Text>
          <Text style={styles.rosterSectionCount}>{rankedRoster.length} Athletes</Text>
        </View>

        <View style={styles.rosterListCard}>
          {listRoster.map((athlete) => {
            const isUser = athlete.isCurrentUser;
            return (
              <View
                key={athlete.id}
                style={[
                  styles.rosterItem,
                  isUser && styles.rosterItemHighlight
                ]}
              >
                {/* Rank Number & Trend Arrow */}
                <View style={styles.rosterRankCol}>
                  <Text style={[styles.rosterRankNum, isUser && styles.rosterRankNumUser]}>
                    #{athlete.rank}
                  </Text>
                  {athlete.rankChange > 0 ? (
                    <View style={styles.trendRow}>
                      <TrendingUp size={11} color="#10B981" />
                      <Text style={styles.trendUpText}>{athlete.rankChange}</Text>
                    </View>
                  ) : athlete.rankChange < 0 ? (
                    <View style={styles.trendRow}>
                      <TrendingDown size={11} color="#EF4444" />
                      <Text style={styles.trendDownText}>{Math.abs(athlete.rankChange)}</Text>
                    </View>
                  ) : (
                    <Minus size={10} color="#71717A" />
                  )}
                </View>

                {/* Avatar */}
                <View style={styles.rosterAvatarWrap}>
                  <Image source={athlete.avatar} style={styles.rosterAvatar} />
                  {isUser && (
                    <View style={styles.userDotIndicator} />
                  )}
                </View>

                {/* Athlete Identity */}
                <View style={styles.rosterInfoCol}>
                  <View style={styles.rosterNameRow}>
                    <Text
                      style={[styles.rosterName, isUser && styles.rosterNameUser]}
                      numberOfLines={1}
                    >
                      {athlete.name}
                    </Text>
                    {isUser && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>YOU</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.rosterTitle} numberOfLines={1}>
                    {athlete.title}
                  </Text>
                </View>

                {/* Score Column */}
                <View style={styles.rosterScoreCol}>
                  <Text style={[styles.rosterScorePrimary, isUser && styles.rosterScoreUser]}>
                    {activeCategory === 'HEAVY'
                      ? formatVolume(athlete.heavyVolume)
                      : `${athlete.consistencyDays} Days`}
                  </Text>
                  <Text style={styles.rosterScoreSecondary} numberOfLines={1}>
                    {activeCategory === 'HEAVY'
                      ? athlete.heavyPr
                      : `${athlete.consistencyStreak}d Streak`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ℹ️ 6. League Promotion Rules Banner */}
        <View style={styles.rulesCard}>
          <View style={styles.rulesHeaderRow}>
            <Info size={14} color="#F59E0B" />
            <Text style={styles.rulesTitle}>League Promotion & Relegation</Text>
          </View>
          <Text style={styles.rulesText}>
            • Top 3 athletes at Sunday midnight are promoted to the next tier.{'\n'}
            • Bottom 3 athletes are relegated to Division 2.{'\n'}
            • Log sets inside exercise videos to raise your volume rank. Show up daily to dominate consistency!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leagueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  leagueBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerBadgeText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  categorySwitcherContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  categoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  categoryBtnActive: {
    backgroundColor: '#1E1215',
    borderColor: '#EF4444',
  },
  categoryBtnActiveConsistency: {
    backgroundColor: '#1F170D',
    borderColor: '#F59E0B',
  },
  categoryTextCol: {
    flex: 1,
  },
  categoryTitle: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 1,
  },
  categoryTitleActive: {
    color: '#FFFFFF',
  },
  categorySub: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
    paddingTop: 10,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
  },
  podiumColFirst: {
    flex: 1.15,
    marginBottom: 0,
  },
  crownWrap: {
    marginBottom: 4,
  },
  avatarWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2,
    backgroundColor: '#27272A',
    position: 'relative',
    marginBottom: 6,
  },
  avatarWrapGold: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#F59E0B',
    padding: 3,
  },
  avatarWrapSilver: {
    backgroundColor: '#94A3B8',
  },
  avatarWrapBronze: {
    backgroundColor: '#B45309',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
  },
  avatarImgFirst: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  podiumRankBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#09090B',
  },
  podiumBadgeGold: {
    backgroundColor: '#FBBF24',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  podiumBadgeSilver: {
    backgroundColor: '#CBD5E1',
  },
  podiumBadgeBronze: {
    backgroundColor: '#D97706',
  },
  podiumRankText: {
    color: '#09090B',
    fontSize: 11,
    fontWeight: '900',
  },
  podiumRankTextGold: {
    color: '#451A03',
    fontSize: 12,
    fontWeight: '900',
  },
  podiumName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
  },
  podiumNameGold: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FBBF24',
  },
  podiumScore: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  podiumScoreGold: {
    color: '#FDE68A',
    fontSize: 12,
  },
  pedestal: {
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pedestalGold: {
    height: 100,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  pedestalSilver: {
    height: 74,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  pedestalBronze: {
    height: 60,
    borderColor: 'rgba(180, 83, 9, 0.3)',
  },
  pedestalLabel: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  pedestalLabelGold: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4,
  },
  yourRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#151518',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    padding: 14,
    marginBottom: 20,
    overflow: 'hidden',
  },
  yourRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  yourRankNumBox: {
    alignItems: 'center',
  },
  yourRankNum: {
    color: '#EF4444',
    fontSize: 22,
    fontWeight: '900',
  },
  yourRankLabel: {
    color: '#A1A1AA',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  yourRankAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    backgroundColor: '#EF4444',
  },
  yourRankAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  yourRankDetails: {
    flex: 1,
  },
  yourRankName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  yourRankMeta: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '600',
  },
  yourRankStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  yourRankStatusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  rosterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  rosterSectionTitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  rosterSectionCount: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '600',
  },
  rosterListCard: {
    backgroundColor: '#121215',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    marginBottom: 18,
  },
  rosterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E22',
  },
  rosterItemHighlight: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  rosterRankCol: {
    width: 38,
    alignItems: 'center',
  },
  rosterRankNum: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '800',
  },
  rosterRankNumUser: {
    color: '#EF4444',
    fontWeight: '900',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 1,
  },
  trendUpText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
  trendDownText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700',
  },
  rosterAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 6,
    marginRight: 10,
    position: 'relative',
  },
  rosterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDotIndicator: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#121215',
  },
  rosterInfoCol: {
    flex: 1,
  },
  rosterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rosterName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rosterNameUser: {
    color: '#EF4444',
    fontWeight: '900',
  },
  youBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  youBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  rosterTitle: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  rosterScoreCol: {
    alignItems: 'flex-end',
  },
  rosterScorePrimary: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  rosterScoreUser: {
    color: '#EF4444',
    fontWeight: '900',
  },
  rosterScoreSecondary: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: '#121215',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222226',
    padding: 14,
  },
  rulesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  rulesTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  rulesText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '500',
  },
});

export default LeaderboardScreen;
