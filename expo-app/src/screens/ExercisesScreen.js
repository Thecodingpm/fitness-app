import React, { useMemo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_SIZE = SCREEN_WIDTH - 40;
import {
  Search,
  Volume2,
  ChevronRight,
  Play,
  Flame,
  Sparkles
} from 'lucide-react-native';
import { C } from '../constants/theme';
import { EXERCISES_DB } from '../data/exercisesDb';

// Memoized Single Exercise Item with 1:1 Square Thumbnail
const ExerciseListItem = React.memo(({ item, onSelect }) => {
  const hasLocalVideo = item.localVideo || item.videoUri;

  return (
    <TouchableOpacity
      style={styles.exCard}
      onPress={() => onSelect(item)}
      activeOpacity={0.75}
    >
      {/* 1:1 Square Viewport Thumbnail */}
      <View style={styles.exThumbWrapper}>
        <Image
          source={item.image || require('../../assets/workouts/legs_and_core.png')}
          style={styles.exThumb}
          resizeMode="cover"
        />
        {hasLocalVideo && (
          <View style={styles.videoIndicatorBadge}>
            <Play size={8} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.exName}>{item.name}</Text>
        <Text style={styles.exMeta}>{item.muscle} • {item.equipment}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
          {hasLocalVideo ? (
            <>
              <Sparkles size={11} color="#EF4444" />
              <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '800' }}>
                HD 1:1 VIDEO • 30 FPS
              </Text>
            </>
          ) : (
            <>
              <Volume2 size={11} color={C.white} />
              <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>
                3D GIF & AUDIO COACH
              </Text>
            </>
          )}
        </View>
      </View>
      <ChevronRight size={18} color={C.zincDark} />
    </TouchableOpacity>
  );
});

export function ExercisesScreen({
  searchQuery,
  setSearchQuery,
  selectedMuscle,
  setSelectedMuscle,
  onSelectExercise
}) {
  const [selectedLegIdx, setSelectedLegIdx] = useState(0);
  const [selectedBackIdx, setSelectedBackIdx] = useState(0);
  const [selectedChestIdx, setSelectedChestIdx] = useState(0);
  const [selectedArmIdx, setSelectedArmIdx] = useState(0);

  const filteredExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => {
      const matchName = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
      return matchName && matchMuscle;
    });
  }, [searchQuery, selectedMuscle]);

  const legExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => ex.muscle === 'Legs');
  }, []);

  const backExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => ex.muscle === 'Back');
  }, []);

  const chestExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => ex.muscle === 'Chest');
  }, []);

  const armsExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => ex.muscle === 'Arms');
  }, []);

  const shoulderExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => ex.muscle === 'Shoulders');
  }, []);

  const featuredExercise = useMemo(() => {
    if (selectedMuscle === 'Chest') {
      return chestExercises[selectedChestIdx] || chestExercises[0] || null;
    }
    if (selectedMuscle === 'Back') {
      return backExercises[selectedBackIdx] || backExercises[0] || null;
    }
    if (selectedMuscle === 'Legs') {
      return legExercises[selectedLegIdx] || legExercises[0] || null;
    }
    if (selectedMuscle === 'Arms') {
      return armsExercises[selectedArmIdx] || armsExercises[0] || null;
    }
    if (selectedMuscle === 'Shoulders') {
      return shoulderExercises[0] || null;
    }
    return null;
  }, [selectedMuscle, selectedLegIdx, selectedBackIdx, selectedChestIdx, selectedArmIdx, legExercises, backExercises, chestExercises, armsExercises, shoulderExercises]);

  const renderItem = useCallback(
    ({ item }) => <ExerciseListItem item={item} onSelect={onSelectExercise} />,
    [onSelectExercise]
  );

  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 24));

  const keyExtractor = useCallback((item) => String(item.id), []);

  return (
    <View style={[styles.container, { paddingTop: safeTop + 4 }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Ambient Dark-Red Glow Behind Top Status Bar */}
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.22)', 'rgba(239, 68, 68, 0.04)', 'transparent']}
        style={styles.bgGlow}
        pointerEvents="none"
      />

      <Text style={styles.pageTitle}>Exercise Anatomy</Text>
      <Text style={styles.pageSub}>HD 1:1 biomechanics videos and real-time form cues</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color={C.zinc} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises by name or muscle..."
          placeholderTextColor={C.zincDark}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Muscle Filter Chips (Clean Text Only) */}
      <View style={{ height: 38, marginBottom: 14 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 10 }}
        >
          {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'].map((muscle) => {
            const isSelected = selectedMuscle === muscle;
            return (
              <TouchableOpacity
                key={muscle}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedMuscle(muscle)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {muscle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 🏋️ 1:1 HD Video Showcase when user selects 'Chest' or 'Legs' */}
      {featuredExercise && (
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            style={styles.featuredSquareCard}
            activeOpacity={0.88}
            onPress={() => onSelectExercise && onSelectExercise(featuredExercise)}
          >
            <View style={styles.squareVideoViewport}>
              <Video
                source={featuredExercise.localVideo || featuredExercise.videoUri}
                posterSource={featuredExercise.image}
                usePoster={false}
                useNativeControls={false}
                rate={1.0}
                volume={0}
                isMuted={true}
                resizeMode={ResizeMode.COVER}
                shouldPlay={true}
                isLooping={true}
                style={styles.fullSquareVideo}
              />

              {/* 🛡️ Top Seamless Dark Vignette */}
              <LinearGradient
                colors={['rgba(9, 9, 11, 0.98)', 'rgba(9, 9, 11, 0.8)', 'rgba(9, 9, 11, 0.25)', 'transparent']}
                locations={[0, 0.35, 0.7, 1]}
                style={styles.squareTopGradient}
                pointerEvents="none"
              />

              {/* Bottom Overlay Title Bar */}
              <LinearGradient
                colors={['transparent', 'rgba(9, 9, 11, 0.65)', 'rgba(9, 9, 11, 0.95)', '#09090B']}
                locations={[0, 0.3, 0.7, 1]}
                style={styles.squareBottomGradient}
              >
                <View>
                  <Text style={styles.squareExerciseTitle}>{featuredExercise.name}</Text>
                  <Text style={styles.squareExerciseMeta}>{featuredExercise.equipment}</Text>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {/* Quick Switcher for Legs Videos */}
          {selectedMuscle === 'Legs' && legExercises.length > 1 && (
            <View style={styles.legsSubSelectorRow}>
              {legExercises.map((ex, idx) => {
                const isCurrent = idx === selectedLegIdx;
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.legsSubChip, isCurrent && styles.legsSubChipActive]}
                    onPress={() => setSelectedLegIdx(idx)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.legsSubChipText, isCurrent && styles.legsSubChipTextActive]}>
                      {ex.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Quick Switcher for Chest Videos */}
          {selectedMuscle === 'Chest' && chestExercises.length > 1 && (
            <View style={styles.legsSubSelectorRow}>
              {chestExercises.map((ex, idx) => {
                const isCurrent = idx === selectedChestIdx;
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.legsSubChip, isCurrent && styles.legsSubChipActive]}
                    onPress={() => setSelectedChestIdx(idx)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.legsSubChipText, isCurrent && styles.legsSubChipTextActive]}>
                      {ex.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Quick Switcher for Back Videos */}
          {selectedMuscle === 'Back' && backExercises.length > 1 && (
            <View style={styles.legsSubSelectorRow}>
              {backExercises.map((ex, idx) => {
                const isCurrent = idx === selectedBackIdx;
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.legsSubChip, isCurrent && styles.legsSubChipActive]}
                    onPress={() => setSelectedBackIdx(idx)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.legsSubChipText, isCurrent && styles.legsSubChipTextActive]}>
                      {ex.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Quick Switcher for Arms Videos */}
          {selectedMuscle === 'Arms' && armsExercises.length > 1 && (
            <View style={styles.legsSubSelectorRow}>
              {armsExercises.map((ex, idx) => {
                const isCurrent = idx === selectedArmIdx;
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.legsSubChip, isCurrent && styles.legsSubChipActive]}
                    onPress={() => setSelectedArmIdx(idx)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.legsSubChipText, isCurrent && styles.legsSubChipTextActive]}>
                      {ex.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* High-Performance Virtualized Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 120 }}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Flame size={32} color="#EF4444" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No Exercises in this Category</Text>
            <Text style={styles.emptySub}>
              Switch to Chest, Back, Legs, or Arms to watch full 1:1 HD biomechanics videos!
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setSelectedMuscle('Back')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBtnText}>View Back Exercise ⚡</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#09090B' },
  bgGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 380 },
  pageTitle: { color: C.white, fontSize: 24, fontWeight: '900', letterSpacing: -0.3, marginBottom: 4 },
  pageSub: { color: C.zinc, fontSize: 13, marginBottom: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: C.border
  },
  searchInput: { flex: 1, marginLeft: 8, color: C.white, fontSize: 13 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: C.surface,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: C.borderSubtle,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterChipActive: { backgroundColor: C.white, borderColor: C.white },
  filterText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: '#09090B', fontWeight: '900' },
  exCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border
  },
  exThumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  exThumb: { width: '100%', height: '100%' },
  exThumbVideo: { width: '100%', height: '100%', backgroundColor: '#000000' },
  videoIndicatorBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  exName: { color: C.white, fontSize: 14, fontWeight: '700' },
  // 1:1 Square Featured Video Viewport
  featuredSquareCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    backgroundColor: '#121215',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6
  },
  squareVideoViewport: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#000000',
    overflow: 'hidden'
  },
  fullSquareVideo: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ scale: 1.08 }, { translateY: 6 }],
    backgroundColor: '#000000'
  },
  squareTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 1
  },
  squareTopBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444'
  },
  squareTopBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  squareBottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    zIndex: 2
  },
  squareExerciseTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  squareExerciseMeta: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 2
  },
  legsSubSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  legsSubChip: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  legsSubChipActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: '#EF4444'
  },
  legsSubChipText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center'
  },
  legsSubChipTextActive: {
    color: '#EF4444',
    fontWeight: '800'
  },

  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121215',
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center'
  },
  emptySub: {
    color: '#A1A1AA',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  emptyBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
