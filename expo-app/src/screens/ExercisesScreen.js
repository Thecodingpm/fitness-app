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
  StatusBar,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ChevronRight } from 'lucide-react-native';
import { C } from '../constants/theme';
import { EXERCISES_DB } from '../data/exercisesDb';

// 💎 Aesthetic Clean Exercise Card
const ExerciseListItem = React.memo(({ item, onSelect }) => {
  const primeMuscle = item.targetMuscles?.[0];

  return (
    <TouchableOpacity
      style={styles.exCard}
      onPress={() => onSelect(item)}
      activeOpacity={0.78}
    >
      {/* 1:1 HD Viewport Thumbnail */}
      <View style={styles.exThumbWrapper}>
        <Image
          source={item.image || require('../../assets/workouts/legs_and_core.png')}
          style={styles.exThumb}
          resizeMode="cover"
        />
      </View>

      <View style={styles.exInfo}>
        <Text style={styles.exName} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.exMeta} numberOfLines={1}>
          {item.muscle} • {item.equipment}
        </Text>

        <View style={styles.exBadgeRow}>
          {primeMuscle ? (
            <Text style={styles.primeMuscleTag}>
              {primeMuscle.name}
            </Text>
          ) : (
            <Text style={styles.biomechTagText}>STRENGTH & FORM</Text>
          )}
          {item.sets && (
            <Text style={styles.setsInfoText}>
              • {item.sets.length} Sets
            </Text>
          )}
        </View>
      </View>

      <View style={styles.exDetailActionBtn}>
        <ChevronRight size={18} color="#71717A" />
      </View>
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
      const matchName = ex.name.toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
      return matchName && matchMuscle;
    });
  }, [searchQuery, selectedMuscle]);

  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 24));

  const renderItem = useCallback(
    ({ item }) => <ExerciseListItem item={item} onSelect={onSelectExercise} />,
    [onSelectExercise]
  );

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

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.pageTitle}>Exercise Anatomy</Text>
            <Text style={styles.pageSub}>High-definition biomechanics and real-time form cues</Text>

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

            {/* Muscle Filter Chips */}
            <View style={{ height: 38, marginBottom: 16, marginTop: 4 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 10, gap: 8 }}
              >
                {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map((muscle) => {
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
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 4
  },
  pageSub: {
    color: '#A1A1AA',
    fontSize: 13,
    marginBottom: 12
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 13
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#16161A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    height: 36,
    justifyContent: 'center'
  },
  filterChipActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4
  },
  filterText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700'
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  exCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  exThumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#27272A'
  },
  exThumb: {
    width: '100%',
    height: '100%'
  },
  exInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  exName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  exMeta: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  exBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  primeMuscleTag: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700'
  },
  biomechTagText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700'
  },
  setsInfoText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  },
  exDetailActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E22'
  }
});

export default ExercisesScreen;
