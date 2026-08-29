import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Search, Volume2, ChevronRight, Play, Flame, Sparkles } from 'lucide-react-native';
import { C } from '../constants/theme';
import { EXERCISES_DB } from '../data/exercisesDb';

// Memoized Single Exercise Item with 1:1 Square Video / GIF Preview
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
        {hasLocalVideo ? (
          <Video
            source={item.localVideo || item.videoUri}
            rate={1.0}
            volume={0}
            isMuted={true}
            resizeMode={ResizeMode.COVER}
            shouldPlay={true}
            isLooping={true}
            style={styles.exThumbVideo}
          />
        ) : (
          <Image
            source={{ uri: item.gifUrl }}
            style={styles.exThumb}
            resizeMode="contain"
          />
        )}
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
              <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '800' }}>HD 1:1 VIDEO • 30 FPS</Text>
            </>
          ) : (
            <>
              <Volume2 size={11} color={C.white} />
              <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>3D GIF & AUDIO COACH</Text>
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
  const filteredExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => {
      const matchName = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
      return matchName && matchMuscle;
    });
  }, [searchQuery, selectedMuscle]);

  const legExercise = useMemo(() => {
    return EXERCISES_DB.find((ex) => ex.muscle === 'Legs') || EXERCISES_DB[0];
  }, []);

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
        colors={['rgba(239, 68, 68, 0.18)', 'rgba(239, 68, 68, 0.03)', 'transparent']}
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
          placeholder="Search exercises..."
          placeholderTextColor={C.zincDark}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Muscle Filter Chips */}
      <View style={{ height: 38, marginBottom: 12 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms']}
          keyExtractor={(item) => item}
          renderItem={({ item: muscle }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedMuscle === muscle && styles.filterChipActive]}
              onPress={() => setSelectedMuscle(muscle)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, selectedMuscle === muscle && { color: C.bg, fontWeight: '900' }]}>
                {muscle}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 🏋️ Highlighted 1:1 Square Video Showcase when Legs Filter is Active */}
      {selectedMuscle === 'Legs' && (
        <TouchableOpacity
          style={styles.featuredSquareCard}
          activeOpacity={0.88}
          onPress={() => onSelectExercise && onSelectExercise(legExercise)}
        >
          {/* 1:1 Aspect Ratio Square Video Player (720x720 30FPS Seamless Loop) */}
          <View style={styles.squareVideoViewport}>
            <Video
              source={require('../../assets/exercises/legs.mp4')}
              rate={1.0}
              volume={0}
              isMuted={true}
              resizeMode={ResizeMode.COVER}
              shouldPlay={true}
              isLooping={true}
              style={styles.fullSquareVideo}
            />

            {/* Top Specs Pill */}
            <View style={styles.squareTopBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.squareTopBadgeText}>1:1 SQUARE • 720×720 • 30 FPS</Text>
            </View>

            {/* Bottom Overlay Title Bar */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)', '#09090B']}
              style={styles.squareBottomGradient}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.squareExerciseTitle}>{legExercise.name}</Text>
                  <Text style={styles.squareExerciseMeta}>{legExercise.equipment}</Text>
                </View>
                <View style={styles.exploreBadge}>
                  <Text style={styles.exploreBadgeText}>TAP FOR CUES</Text>
                  <ChevronRight size={14} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: C.surface,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: C.borderSubtle,
    height: 32,
    justifyContent: 'center'
  },
  filterChipActive: { backgroundColor: C.white, borderColor: C.white },
  filterText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
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
  exThumb: { width: '85%', height: '85%' },
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
  exMeta: { color: C.zinc, fontSize: 11, marginTop: 2 },

  // 1:1 Square Featured Video Viewport
  featuredSquareCard: {
    width: '100%',
    marginBottom: 16,
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
    backgroundColor: '#000000'
  },
  fullSquareVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000'
  },
  squareTopBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    paddingHorizontal: 14,
    paddingTop: 30,
    paddingBottom: 14
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
  exploreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  exploreBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginRight: 2
  }
});
