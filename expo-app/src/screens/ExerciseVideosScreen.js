// ExerciseVideosScreen.js — Premium Exercise Library
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Zap, ArrowLeft } from 'lucide-react-native';
import { EXERCISES_DB } from '../data/exercisesDb';
import { FullscreenVideoModal } from '../modals/FullscreenVideoModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PAD = 16;
const CARD_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - H_PAD * 2 - CARD_GAP) / 2;
const THUMB_HEIGHT = CARD_WIDTH * 0.85;

const MUSCLE_FILTERS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

const MUSCLE_TAG_COLORS = {
  Chest:     '#EF4444',
  Back:      '#3B82F6',
  Legs:      '#8B5CF6',
  Shoulders: '#F59E0B',
  Arms:      '#10B981',
  Core:      '#EC4899',
  Glutes:    '#F97316',
};

// ─── Exercise Card ─────────────────────────────────────────────────────────
const ExerciseCard = React.memo(({ exercise, onPress }) => {
  const tagColor = MUSCLE_TAG_COLORS[exercise.muscle] || '#EF4444';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(exercise)}
      activeOpacity={0.85}
    >
      {/* Thumbnail */}
      <View style={styles.thumbContainer}>
        {exercise.image ? (
          <Image source={exercise.image} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, { backgroundColor: '#1C1C22' }]} />
        )}

        {/* Gradient overlay bottom-fade */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.72)']}
          style={styles.thumbGrad}
          pointerEvents="none"
        />

        {/* Muscle badge top-left */}
        <View style={[styles.muscleBadge, { backgroundColor: tagColor }]}>
          <Text style={styles.muscleBadgeText}>{exercise.muscle}</Text>
        </View>

        {/* Play button — always red, bottom-right */}
        <View style={styles.playBtn}>
          <Play size={13} color="#fff" fill="#fff" />
        </View>

        {/* Name inside card over gradient */}
        <View style={styles.thumbInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {exercise.shortName || exercise.name}
          </Text>
          <Text style={styles.cardEquipment} numberOfLines={1}>
            {exercise.equipment || ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// ─── Screen ────────────────────────────────────────────────────────────────
export function ExerciseVideosScreen({ routine = null, onClearRoutine }) {
  const insets = useSafeAreaInsets();
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [activeExercise, setActiveExercise] = useState(null);

  const filtered = useMemo(() => {
    if (routine) {
      const ids = new Set((routine.exercises || []).map(exercise => exercise.id));
      return EXERCISES_DB.filter(exercise => ids.has(exercise.id));
    }
    if (selectedMuscle === 'All') return EXERCISES_DB;
    return EXERCISES_DB.filter((ex) => ex.muscle === selectedMuscle);
  }, [routine, selectedMuscle]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerTextBlock}>
          <View style={styles.headerBadge}>
            <Zap size={9} color="#EF4444" fill="#EF4444" />
            <Text style={styles.headerBadgeText}>{routine ? `${routine.dayName?.toUpperCase()} PLAN` : 'EXERCISE LIBRARY'}</Text>
          </View>
          <Text style={styles.headerTitle}>{routine ? routine.title : 'Train Smarter'}</Text>
          <Text style={styles.headerSub}>
            {routine ? `${routine.focus} · Tap an exercise to watch its guide` : 'Tap any card to watch fullscreen'}
          </Text>
        </View>
      </View>

      {routine && (
        <TouchableOpacity style={styles.allExercisesButton} onPress={onClearRoutine} accessibilityRole="button">
          <ArrowLeft size={15} color="#FFFFFF" />
          <Text style={styles.allExercisesText}>All exercises</Text>
        </TouchableOpacity>
      )}

      {/* ── FILTER CHIPS ── */}
      {!routine && <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {MUSCLE_FILTERS.map((m) => {
          const active = selectedMuscle === m;
          return (
            <TouchableOpacity
              key={m}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedMuscle(m)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>}

      {/* ── COUNT ── */}
      <Text style={styles.countLabel}>
        {filtered.length} {filtered.length === 1 ? 'exercise' : 'exercises'}
      </Text>

      {/* ── GRID ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={setActiveExercise} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyRoutine}>
            <Text style={styles.emptyRoutineTitle}>Recovery day</Text>
            <Text style={styles.emptyRoutineText}>No exercises are assigned to this day.</Text>
          </View>
        }
      />

      {/* ── FULLSCREEN VIDEO MODAL ── */}
      <FullscreenVideoModal
        visible={!!activeExercise}
        exercise={activeExercise}
        onClose={() => setActiveExercise(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },

  // Header
  header: {
    paddingHorizontal: H_PAD,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTextBlock: {
    gap: 3,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  headerBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  headerSub: {
    color: '#52525B',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  allExercisesButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: H_PAD,
    marginTop: 10,
    paddingHorizontal: 12,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: '#1C1C22',
  },
  allExercisesText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyRoutine: { padding: 24, alignItems: 'center' },
  emptyRoutineTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  emptyRoutineText: { color: '#71717A', fontSize: 13, marginTop: 8 },

  // Filter chips
  filterScroll: {
    flexGrow: 0,
    marginTop: 16,
  },
  filterContent: {
    paddingHorizontal: H_PAD,
    gap: 7,
  },
  chip: {
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 7,
  },
  chipActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  chipText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Count
  countLabel: {
    color: '#3F3F46',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: H_PAD,
    marginTop: 14,
    marginBottom: 10,
  },

  // Grid
  grid: {
    paddingHorizontal: H_PAD,
    paddingBottom: 130,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },

  // Card
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  thumbContainer: {
    width: '100%',
    height: THUMB_HEIGHT,
    position: 'relative',
    backgroundColor: '#111114',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  muscleBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  muscleBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  playBtn: {
    position: 'absolute',
    bottom: 34,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 17,
  },
  cardEquipment: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
});

export default ExerciseVideosScreen;
