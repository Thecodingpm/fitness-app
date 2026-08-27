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
import { Search, Volume2, ChevronRight } from 'lucide-react-native';
import { C } from '../constants/theme';
import { EXERCISES_DB } from '../data/exercisesDb';

// Memoized Single Exercise Item for Maximum 60FPS Performance
const ExerciseListItem = React.memo(({ item, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.exCard}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.gifUrl }}
        style={styles.exThumb}
        resizeMode="contain"
      />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.exName}>{item.name}</Text>
        <Text style={styles.exMeta}>{item.muscle} • {item.equipment}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Volume2 size={11} color={C.white} />
          <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>3D GIF & AUDIO COACH</Text>
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

      <Text style={styles.pageTitle}>3D Anatomy Library</Text>
      <Text style={styles.pageSub}>Real-time 3D animated GIFs with active muscle highlights</Text>

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
      <View style={{ height: 38, marginBottom: 10 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms']}
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

      {/* High-Performance Virtualized Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 110 }}
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 12, height: 44, marginVertical: 8, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, marginLeft: 8, color: C.white, fontSize: 13 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: C.surface, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle, height: 32, justifyContent: 'center' },
  filterChipActive: { backgroundColor: C.white, borderColor: C.white },
  filterText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  exThumb: { width: 58, height: 58, borderRadius: 12, backgroundColor: '#FFFFFF' },
  exName: { color: C.white, fontSize: 14, fontWeight: '700' },
  exMeta: { color: C.zinc, fontSize: 11, marginTop: 2 }
});
