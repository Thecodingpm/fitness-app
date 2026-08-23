import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { Search, Volume2, ChevronRight } from 'lucide-react-native';
import { C } from '../constants/theme';
import { EXERCISES_DB } from '../data/exercisesDb';

export function ExercisesScreen({
  searchQuery,
  setSearchQuery,
  selectedMuscle,
  setSelectedMuscle,
  onSelectExercise
}) {
  const filteredExercises = EXERCISES_DB.filter((ex) => {
    const matchName = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
    return matchName && matchMuscle;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>3D Anatomy Library</Text>
      <Text style={styles.pageSub}>Real-time 3D animated GIFs with red active muscle highlights</Text>

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

      {/* Muscle Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 36, marginBottom: 12 }}>
        {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'].map((muscle, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.filterChip, selectedMuscle === muscle && styles.filterChipActive]}
            onPress={() => setSelectedMuscle(muscle)}
          >
            <Text style={[styles.filterText, selectedMuscle === muscle && { color: C.bg, fontWeight: '900' }]}>
              {muscle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {filteredExercises.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={styles.exCard}
            onPress={() => onSelectExercise(ex)}
          >
            <Image
              source={{ uri: ex.gifUrl }}
              style={styles.exThumb}
              resizeMode="contain"
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.exName}>{ex.name}</Text>
              <Text style={styles.exMeta}>{ex.muscle} • {ex.equipment}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Volume2 size={11} color={C.white} />
                <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>3D GIF & AUDIO COACH</Text>
              </View>
            </View>
            <ChevronRight size={18} color={C.zincDark} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  pageTitle: { color: C.white, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  pageSub: { color: C.zinc, fontSize: 12, marginBottom: 14 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 12, height: 44, marginVertical: 10, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, marginLeft: 8, color: C.white, fontSize: 13 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle },
  filterChipActive: { backgroundColor: C.white, borderColor: C.white },
  filterText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  exThumb: { width: 58, height: 58, borderRadius: 12, backgroundColor: '#FFFFFF' },
  exName: { color: C.white, fontSize: 14, fontWeight: '700' },
  exMeta: { color: C.zinc, fontSize: 11, marginTop: 2 }
});
