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
import { AppVideoPlayer } from '../components/AppVideoPlayer';
import {
  Search,
  ChevronRight,
  Play,
  Flame,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Activity,
  Target,
  Dumbbell
} from 'lucide-react-native';
import { C } from '../constants/theme';
import { EXERCISES_DB } from '../data/exercisesDb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 💎 Aesthetic Exercise Card
const ExerciseListItem = React.memo(({ item, onSelect }) => {
  const hasLocalVideo = item.localVideo || item.videoUri;

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
        {hasLocalVideo && (
          <View style={styles.videoIndicatorBadge}>
            <Play size={8} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.exInfo}>
        <Text style={styles.exName}>{item.name}</Text>
        <Text style={styles.exMeta}>{item.muscle} • {item.equipment}</Text>
        <View style={styles.exBadgeRow}>
          <Sparkles size={10} color="#EF4444" />
          <Text style={styles.biomechTagText}>HD 1:1 VIDEO • 30 FPS</Text>
        </View>
      </View>

      <ChevronRight size={16} color="#71717A" />
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
  const [selectedShoulderIdx, setSelectedShoulderIdx] = useState(0);
  const [selectedCoreIdx, setSelectedCoreIdx] = useState(0);

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

  const coreExercises = useMemo(() => {
    return EXERCISES_DB.filter((ex) => ex.muscle === 'Core');
  }, []);

  // 🎯 Active Multi-Variation Dataset
  const variationData = useMemo(() => {
    const targetMuscle = selectedMuscle === 'All' ? 'Chest' : selectedMuscle;
    if (targetMuscle === 'Chest') {
      return { list: chestExercises, idx: selectedChestIdx, setIdx: setSelectedChestIdx, label: 'Chest' };
    }
    if (targetMuscle === 'Back') {
      return { list: backExercises, idx: selectedBackIdx, setIdx: setSelectedBackIdx, label: 'Back' };
    }
    if (targetMuscle === 'Legs') {
      return { list: legExercises, idx: selectedLegIdx, setIdx: setSelectedLegIdx, label: 'Legs' };
    }
    if (targetMuscle === 'Shoulders') {
      return { list: shoulderExercises, idx: selectedShoulderIdx, setIdx: setSelectedShoulderIdx, label: 'Shoulders' };
    }
    if (targetMuscle === 'Arms') {
      return { list: armsExercises, idx: selectedArmIdx, setIdx: setSelectedArmIdx, label: 'Arms' };
    }
    if (targetMuscle === 'Core') {
      return { list: coreExercises, idx: selectedCoreIdx, setIdx: setSelectedCoreIdx, label: 'Core' };
    }
    return { list: [], idx: 0, setIdx: () => {}, label: '' };
  }, [
    selectedMuscle,
    selectedChestIdx,
    selectedBackIdx,
    selectedLegIdx,
    selectedShoulderIdx,
    selectedArmIdx,
    selectedCoreIdx,
    chestExercises,
    backExercises,
    legExercises,
    shoulderExercises,
    armsExercises,
    coreExercises
  ]);

  const featuredExercise = useMemo(() => {
    const targetMuscle = selectedMuscle === 'All' ? 'Chest' : selectedMuscle;
    if (targetMuscle === 'Chest') {
      return chestExercises[selectedChestIdx] || chestExercises[0] || null;
    }
    if (targetMuscle === 'Back') {
      return backExercises[selectedBackIdx] || backExercises[0] || null;
    }
    if (targetMuscle === 'Legs') {
      return legExercises[selectedLegIdx] || legExercises[0] || null;
    }
    if (targetMuscle === 'Shoulders') {
      return shoulderExercises[selectedShoulderIdx] || shoulderExercises[0] || null;
    }
    if (targetMuscle === 'Arms') {
      return armsExercises[selectedArmIdx] || armsExercises[0] || null;
    }
    if (targetMuscle === 'Core') {
      return coreExercises[selectedCoreIdx] || coreExercises[0] || null;
    }
    return chestExercises[0] || null;
  }, [
    selectedMuscle,
    selectedLegIdx,
    selectedBackIdx,
    selectedChestIdx,
    selectedShoulderIdx,
    selectedArmIdx,
    selectedCoreIdx,
    legExercises,
    backExercises,
    chestExercises,
    shoulderExercises,
    armsExercises,
    coreExercises
  ]);

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

      {/* High-Performance Unified Virtualized Screen */}
      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 120 }}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
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

            {/* 🏋️ Integrated Video Showcase & Stepper Terminal Card */}
            {featuredExercise && (
              <View style={styles.showcaseCard}>
                <TouchableOpacity
                  style={styles.videoSection}
                  activeOpacity={0.92}
                  onPress={() => onSelectExercise && onSelectExercise(featuredExercise)}
                >
                  <View style={styles.squareVideoViewport} renderToHardwareTextureAndroid={true}>
                    <AppVideoPlayer
                      key={featuredExercise.id}
                      source={featuredExercise.localVideo || featuredExercise.videoUri}
                      contentFit="cover"
                      loop={true}
                      muted={true}
                      autoPlay={true}
                      style={[
                        styles.fullSquareVideo,
                        featuredExercise?.videoOffset && {
                          transform: [
                            { scale: featuredExercise.videoOffset.scale || 1.08 },
                            { translateY: featuredExercise.videoOffset.translateY || 0 }
                          ]
                        }
                      ]}
                    />

                    {/* Bottom Overlay Info (Compact, takes minimal space) */}
                    <View style={styles.squareBottomOverlay}>
                      <View style={styles.compactOverlayBadge}>
                        <Text style={styles.compactOverlayTitle}>
                          {featuredExercise.name} • {variationData.label || featuredExercise.muscle}
                        </Text>
                        <Text style={styles.compactOverlaySubtitle}>
                          {featuredExercise.equipment} • {featuredExercise.tempo}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* 🔴 Connected Numbered Stepper Line (Mockup Style) */}
                {variationData.list.length > 1 && (
                  <View style={styles.stepperContainer}>
                    <View style={styles.stepperTrackRow}>
                      {variationData.list.map((ex, idx) => {
                        const isCurrent = idx === variationData.idx;
                        const isFirst = idx === 0;

                        return (
                          <React.Fragment key={ex.id}>
                            {/* Connector Line before node (if not first) */}
                            {!isFirst && (
                              <View style={styles.connectorContainer}>
                                <View
                                  style={[
                                    styles.connectorLine,
                                    idx <= variationData.idx && styles.connectorLineActive
                                  ]}
                                />
                                <View
                                  style={[
                                    styles.connectorDot,
                                    idx <= variationData.idx && styles.connectorDotActive
                                  ]}
                                />
                              </View>
                            )}

                            {/* Step Node */}
                            <TouchableOpacity
                              style={styles.stepNodeTouchable}
                              onPress={() => variationData.setIdx(idx)}
                              activeOpacity={0.8}
                            >
                              <View
                                style={[
                                  styles.stepNodeCircle,
                                  isCurrent && styles.stepNodeCircleActive
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.stepNodeNumber,
                                    isCurrent && styles.stepNodeNumberActive
                                  ]}
                                >
                                  {idx + 1}
                                </Text>
                              </View>

                              <Text
                                style={[
                                  styles.stepNodeLabel,
                                  isCurrent && styles.stepNodeLabelActive
                                ]}
                                numberOfLines={1}
                              >
                                {ex.shortName || `Var. ${idx + 1}`}
                              </Text>
                            </TouchableOpacity>
                          </React.Fragment>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* List Header Title */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8, paddingHorizontal: 2 }}>
              <Text style={{ color: '#71717A', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 }}>
                EXERCISES ({filteredExercises.length})
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Flame size={32} color="#EF4444" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No Exercises in this Category</Text>
            <Text style={styles.emptySub}>
              Switch to Chest, Back, Legs, Shoulders, Arms, or Core to watch full 1:1 HD biomechanics videos!
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setSelectedMuscle('Chest')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBtnText}>View Chest Exercises ⚡</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#09090B'
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380
  },
  pageTitle: {
    color: C.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  pageSub: {
    color: C.zinc,
    fontSize: 13,
    marginBottom: 12
  },
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: C.white,
    fontSize: 13
  },

  // Category Filter Chips
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

  // 🌟 Main Integrated Terminal Card
  showcaseCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#0F1015',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 10
  },
  videoSection: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#090A0E',
    overflow: 'hidden'
  },
  squareVideoViewport: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#090A0E'
  },
  fullSquareVideo: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ scale: 1.08 }, { translateY: 6 }],
    backgroundColor: '#090A0E'
  },
  squareBottomOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 2,
    backgroundColor: 'transparent'
  },
  compactOverlayBadge: {
    backgroundColor: 'rgba(9, 10, 14, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  compactOverlayTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.1
  },
  compactOverlaySubtitle: {
    color: '#A1A1AA',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 1
  },

  // 🔴 Connected Stepper Track Styles (Mockup Matching)
  stepperContainer: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#111115',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)'
  },
  stepperTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6
  },
  connectorContainer: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  connectorLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  },
  connectorLineActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.5)'
  },
  connectorDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1
  },
  connectorDotActive: {
    backgroundColor: '#EF4444'
  },
  stepNodeTouchable: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepNodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18181D',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepNodeCircleActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6
  },
  stepNodeNumber: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '800'
  },
  stepNodeNumberActive: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  stepNodeLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6
  },
  stepNodeLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // 📋 Exercise Cards
  exCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131317',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  exThumbWrapper: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  exThumb: {
    width: '100%',
    height: '100%'
  },
  videoIndicatorBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 15,
    height: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  exInfo: {
    flex: 1,
    marginLeft: 14
  },
  exName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  exMeta: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  exBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6
  },
  biomechTagText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800'
  },

  // Empty State
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
