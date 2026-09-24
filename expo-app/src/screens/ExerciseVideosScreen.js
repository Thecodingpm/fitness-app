import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Search, X } from 'lucide-react-native';
import { EXERCISES_DB } from '../data/exercisesDb';
import { FullscreenVideoModal } from '../modals/FullscreenVideoModal';

const RED = '#F04444';
const SIDE = 20;
const GAP = 12;
const CARD_WIDTH = (Dimensions.get('window').width - SIDE * 2 - GAP) / 2;
const FILTERS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Mobility'];

const ExerciseCard = React.memo(({ exercise, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(exercise)} activeOpacity={0.82}
    accessibilityRole="button" accessibilityLabel={`Watch ${exercise.name} exercise guide`}>
    <View style={styles.imageWrap}>
      {exercise.image ? <Image source={exercise.image} style={styles.image} resizeMode="cover" fadeDuration={0} /> : <View style={[styles.image, styles.imageFallback]} />}
      <View style={styles.playButton}><Play size={14} color="#FFFFFF" fill="#FFFFFF" /></View>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardMuscle} numberOfLines={1}>{exercise.muscle}</Text>
      <Text style={styles.cardName} numberOfLines={2}>{exercise.shortName || exercise.name}</Text>
      <Text style={styles.cardEquipment} numberOfLines={1}>{exercise.equipment || 'Exercise guide'}</Text>
    </View>
  </TouchableOpacity>
));

export function ExerciseVideosScreen({ routine = null, onClearRoutine }) {
  const insets = useSafeAreaInsets();
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [query, setQuery] = useState('');
  const [activeExercise, setActiveExercise] = useState(null);

  const filtered = useMemo(() => {
    // Do not present unverified media as exercise instruction.
    const available = EXERCISES_DB.filter(exercise => exercise.videoVerified !== false);
    if (routine) {
      const ids = new Set((routine.exercises || []).map(exercise => exercise.id));
      return available.filter(exercise => ids.has(exercise.id));
    }
    const search = query.trim().toLowerCase();
    return available.filter(exercise =>
      (selectedMuscle === 'All' || exercise.muscle === selectedMuscle) &&
      (!search || `${exercise.name} ${exercise.equipment} ${exercise.muscle}`.toLowerCase().includes(search))
    );
  }, [routine, selectedMuscle, query]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{routine ? `${routine.dayName?.toUpperCase()} · DAY ${routine.dayNum}` : 'EXERCISE LIBRARY'}</Text>
        <Text style={styles.title}>{routine ? routine.title : 'Exercises'}</Text>
        <Text style={styles.subtitle}>{routine ? `${routine.focus} · Video guides for this workout` : 'Clear guides for every move in your plan.'}</Text>
      </View>

      {routine ? (
        <TouchableOpacity style={styles.backButton} onPress={onClearRoutine} accessibilityRole="button" accessibilityLabel="Show all exercises">
          <ArrowLeft size={17} color="#FFFFFF" /><Text style={styles.backText}>All exercises</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.searchBox}>
            <Search size={18} color="#8A8A94" />
            <TextInput style={styles.searchInput} value={query} onChangeText={setQuery}
              placeholder="Search exercises or equipment" placeholderTextColor="#777780"
              returnKeyType="search" accessibilityLabel="Search exercises" />
            {!!query && <TouchableOpacity onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear search"><X size={17} color="#A1A1AA" /></TouchableOpacity>}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {FILTERS.map(muscle => {
              const active = selectedMuscle === muscle;
              return (
                <TouchableOpacity key={muscle} style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedMuscle(muscle)} accessibilityRole="button" accessibilityState={{ selected: active }}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{muscle}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{routine ? 'Workout guides' : 'Browse library'}</Text>
        <Text style={styles.count}>{filtered.length} {filtered.length === 1 ? 'exercise' : 'exercises'}</Text>
      </View>
      <FlatList data={filtered} keyExtractor={item => item.id} numColumns={2}
        contentContainerStyle={styles.grid} columnWrapperStyle={styles.row} showsVerticalScrollIndicator={false}
        initialNumToRender={6} maxToRenderPerBatch={4} windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        renderItem={({ item }) => <ExerciseCard exercise={item} onPress={setActiveExercise} />}
        ListEmptyComponent={<View style={styles.empty}>
          <Text style={styles.emptyTitle}>{routine ? 'No guides available' : 'No matching exercises'}</Text>
          <Text style={styles.emptyText}>{routine ? 'Exercise guides for this day are being checked.' : 'Try a different search or muscle group.'}</Text>
        </View>}
      />
      {activeExercise && <FullscreenVideoModal visible exercise={activeExercise} onClose={() => setActiveExercise(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0D' },
  header: { paddingHorizontal: SIDE, paddingTop: 18, paddingBottom: 22 },
  eyebrow: { color: RED, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 9 },
  title: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1.1, lineHeight: 42 },
  subtitle: { color: '#A2A2AA', fontSize: 14, lineHeight: 20, marginTop: 8 },
  searchBox: { height: 48, marginHorizontal: SIDE, borderRadius: 14, borderWidth: 1, borderColor: '#2B2B30', backgroundColor: '#19191D', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, height: '100%', color: '#FFFFFF', fontSize: 14, paddingVertical: 0 },
  filterScroll: { flexGrow: 0, height: 64, marginTop: 13 },
  filterContent: { alignItems: 'center', paddingHorizontal: SIDE, paddingRight: SIDE + 2, gap: 8 },
  chip: { minHeight: 39, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#35353B', backgroundColor: '#19191D', justifyContent: 'center', alignItems: 'center' },
  chipActive: { borderColor: RED, backgroundColor: RED },
  chipText: { color: '#B5B5BE', fontSize: 13, fontWeight: '700', lineHeight: 17 },
  chipTextActive: { color: '#FFFFFF' },
  backButton: { alignSelf: 'flex-start', minHeight: 42, marginHorizontal: SIDE, marginBottom: 18, paddingHorizontal: 13, borderRadius: 12, backgroundColor: '#202024', flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: SIDE, paddingTop: 10, paddingBottom: 14 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  count: { color: '#8A8A94', fontSize: 12, fontWeight: '600' },
  grid: { paddingHorizontal: SIDE, paddingBottom: 135 },
  row: { gap: GAP, marginBottom: GAP },
  card: { width: CARD_WIDTH, borderRadius: 18, borderWidth: 1, borderColor: '#2A2A30', backgroundColor: '#18181B', overflow: 'hidden' },
  imageWrap: { width: '100%', height: CARD_WIDTH * 0.86, backgroundColor: '#252529' },
  image: { width: '100%', height: '100%' },
  imageFallback: { backgroundColor: '#252529' },
  playButton: { position: 'absolute', right: 10, bottom: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  cardBody: { minHeight: 91, paddingHorizontal: 11, paddingTop: 10, paddingBottom: 12 },
  cardMuscle: { color: RED, fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  cardName: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', lineHeight: 19, marginTop: 5 },
  cardEquipment: { color: '#96969F', fontSize: 11, lineHeight: 14, marginTop: 4 },
  empty: { paddingHorizontal: 24, paddingVertical: 45, alignItems: 'center' },
  emptyTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  emptyText: { color: '#A1A1AA', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18 },
});

export default ExerciseVideosScreen;
