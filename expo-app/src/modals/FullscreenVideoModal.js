// FullscreenVideoModal.js — Top-tier gym app exercise form guide & set logger (Hevy / Strong pattern)
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Check,
  Plus,
  Trash2,
  Clock,
  Dumbbell,
  Trophy,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useVideoPlayer, VideoView } from 'expo-video';
import { totalVolumeKg } from '../data/completedSets.mjs';
import { useRestTimer } from '../hooks/useRestTimer';
import { BACK_PRIORITY, useAndroidBackHandler } from '../services/navigation/backHandlerService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_WIDTH = SCREEN_WIDTH - 32;
const VIDEO_HEIGHT = Math.min(230, Math.round(VIDEO_WIDTH * 0.62));

export function FullscreenVideoModal({
  visible,
  exercise,
  routine = null,
  completedSets = [],
  userId = 'guest',
  onLogSet,
  onLogBatchSets,
  onClose
}) {
  const insets = useSafeAreaInsets();
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Background-Safe Rest Countdown Timer
  const {
    remainingSeconds: restTimerSeconds,
    startRest,
    skipRest,
    addTime
  } = useRestTimer({
    sessionId: routine?.title || null,
    autoRestore: true,
    enableNotifications: true,
    enableHaptics: true
  });

  const ex = exercise;
  const source = ex?.localVideo ?? ex?.videoUri ?? null;

  // Video looping player
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    try {
      p.audioMixingMode = 'mixWithOthers';
    } catch (_) {}
  });

  useEffect(() => {
    if (!player) return;
    if (visible) {
      const playWhenReady = ({ status }) => {
        if (status === 'readyToPlay') {
          try {
            player.play();
          } catch (_) {}
        }
      };
      playWhenReady({ status: player.status });
      const subscription = player.addListener('statusChange', playWhenReady);
      return () => subscription.remove();
    } else {
      try {
        player.pause();
      } catch (_) {}
    }
  }, [visible, player]);


  // 1. Gather all past logged sets for this specific exercise
  const allExerciseSets = useMemo(() => {
    if (!ex) return [];
    const exId = String(ex.id || '').toLowerCase();
    const exName = String(ex.name || '').toLowerCase();
    return completedSets.filter((s) => {
      const sId = String(s.exerciseId || '').toLowerCase();
      const sName = String(s.exerciseName || '').toLowerCase();
      return (exId && sId === exId) || (exName && sName === exName);
    });
  }, [ex, completedSets]);

  // Sets logged in the current active session (within 2 hours or same routine title)
  const currentSessionSets = useMemo(() => {
    if (!routine && allExerciseSets.length === 0) return [];
    const now = Date.now();
    return allExerciseSets.filter((s) => {
      const matchRoutine = routine?.title && s.routineTitle === routine.title;
      const parsedTime = Date.parse(s.loggedAt);
      const isRecent = Number.isFinite(parsedTime) && now - parsedTime < 7200000;
      return matchRoutine || isRecent;
    });
  }, [allExerciseSets, routine]);

  // Historical sets logged BEFORE this current session (for the PREVIOUS column)
  const historicalSets = useMemo(() => {
    const currentIds = new Set(currentSessionSets.map((s) => s.id));
    return allExerciseSets.filter((s) => !currentIds.has(s.id));
  }, [allExerciseSets, currentSessionSets]);

  // Local table rows state
  const [setRows, setSetRows] = useState([]);

  // Initialize or synchronize local rows with exercise prescription & existing logged sets
  useEffect(() => {
    if (!visible || !ex) return;

    const prescribedCount = ex.sets?.length || 3;
    const defaultReps = String(ex.sets?.[0]?.reps || 10);
    const defaultWeight = ex.sets?.[0]?.weight > 0 ? String(ex.sets[0].weight) : '60';

    const maxCount = Math.max(prescribedCount, currentSessionSets.length);
    const rows = [];

    for (let i = 0; i < maxCount; i++) {
      const logged = currentSessionSets[i];
      const hist = historicalSets[i] || historicalSets[historicalSets.length - 1];
      const prevString = hist ? `${hist.weightKg}kg × ${hist.reps}` : '—';

      if (logged) {
        rows.push({
          setNum: i + 1,
          prev: prevString,
          weight: String(logged.weightKg || 0),
          reps: String(logged.reps || 10),
          done: true,
          loggedId: logged.id
        });
      } else {
        const prevRow = rows[i - 1];
        rows.push({
          setNum: i + 1,
          prev: prevString,
          weight: prevRow?.weight || defaultWeight,
          reps: prevRow?.reps || defaultReps,
          done: false,
          loggedId: null
        });
      }
    }

    setSetRows(rows);
  }, [visible, ex?.id, currentSessionSets.length]);

  // Handle checking/unchecking a single set
  const handleToggleSet = async (index) => {
    if (!ex) return;
    const target = setRows[index];
    if (!target) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    if (!target.done) {
      // Mark as done and log to DB
      const numReps = parseInt(target.reps, 10) || 10;
      const numWeight = parseFloat(target.weight) || 0;

      const updated = [...setRows];
      updated[index] = { ...target, done: true };
      setSetRows(updated);

      // Start rest timer (default 60s or 90s)
      startRest(60);

      if (onLogSet) {
        try {
          await onLogSet({
            exercise: ex,
            routineTitle: routine?.title || 'Workout Session',
            reps: numReps,
            weightKg: numWeight,
            setNumber: index + 1
          });
        } catch (e) {
          console.log('Error logging set:', e.message);
        }
      }
    } else {
      // Uncheck
      const updated = [...setRows];
      updated[index] = { ...target, done: false, loggedId: null };
      setSetRows(updated);
    }
  };

  // Update Weight or Reps on a specific row
  const handleUpdateRowValue = (index, field, value) => {
    const updated = [...setRows];
    updated[index] = { ...updated[index], [field]: value };
    setSetRows(updated);
  };

  // Add a new set row
  const handleAddSet = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    const last = setRows[setRows.length - 1];
    const newSetNum = setRows.length + 1;
    const hist = historicalSets[setRows.length] || historicalSets[historicalSets.length - 1];
    const prevString = hist ? `${hist.weightKg}kg × ${hist.reps}` : '—';

    setSetRows([
      ...setRows,
      {
        setNum: newSetNum,
        prev: prevString,
        weight: last?.weight || '60',
        reps: last?.reps || '10',
        done: false,
        loggedId: null
      }
    ]);
  };

  // Delete a set row (if > 1 set)
  const handleDeleteRow = (index) => {
    if (setRows.length <= 1) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    const updated = setRows
      .filter((_, i) => i !== index)
      .map((row, i) => ({ ...row, setNum: i + 1 }));
    setSetRows(updated);
  };

  // Quick Action: Complete All Sets
  const handleCompleteAll = async () => {
    if (!ex || isSubmitting) return;
    const uncompleted = setRows.filter((r) => !r.done);
    if (uncompleted.length === 0) {
      Alert.alert('All Completed', 'All sets for this exercise are already logged!');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    setIsSubmitting(true);
    try {
      // Mark all rows as done locally
      const updated = setRows.map((r) => ({ ...r, done: true }));
      setSetRows(updated);

      if (onLogBatchSets) {
        // Average or use last row values
        const primaryWeight = parseFloat(uncompleted[0].weight) || 0;
        const primaryReps = parseInt(uncompleted[0].reps, 10) || 10;
        await onLogBatchSets({
          exercise: ex,
          routineTitle: routine?.title || 'Workout Session',
          setsCount: uncompleted.length,
          reps: primaryReps,
          weightKg: primaryWeight
        });
      } else if (onLogSet) {
        for (const row of uncompleted) {
          await onLogSet({
            exercise: ex,
            routineTitle: routine?.title || 'Workout Session',
            reps: parseInt(row.reps, 10) || 10,
            weightKg: parseFloat(row.weight) || 0,
            setNumber: row.setNum
          });
        }
      }

      startRest(60);
      Alert.alert(
        'Exercise Completed! 🎉',
        `Logged all ${setRows.length} sets for ${ex.shortName || ex.name}. Data saved to cloud & analytics updated!`
      );
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not log sets.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics for summary
  const completedCount = setRows.filter((r) => r.done).length;
  const totalRepsDone = setRows.reduce((sum, r) => sum + (r.done ? parseInt(r.reps, 10) || 0 : 0), 0);
  const totalVolumeDone = setRows.reduce(
    (sum, r) => sum + (r.done ? (parseInt(r.reps, 10) || 0) * (parseFloat(r.weight) || 0) : 0),
    0
  );

  const handleClose = useCallback(() => {
    try {
      player?.pause();
    } catch (_) {}
    onClose?.();
    return true;
  }, [onClose, player]);

  useAndroidBackHandler(handleClose, BACK_PRIORITY.VIDEO_MODAL, visible);

  const formatRestTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!visible || !ex) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.screen}>
        {/* Background Ambient Glow */}
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.22)', 'rgba(24, 24, 27, 0.95)', '#09090B']}
          locations={[0, 0.25, 0.6]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* 🔝 Sticky Top Navigation Bar */}
        <View style={[styles.topBar, { paddingTop: (insets.top || 44) + 6 }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Close exercise form guide"
          >
            <X size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.topBarTitleCol}>
            <Text style={styles.topBarEyebrow} numberOfLines={1}>
              {routine?.dayName ? `${routine.dayName.toUpperCase()} · ${routine.title || 'WORKOUT'}` : 'EXERCISE LOG & GUIDE'}
            </Text>
            <Text style={styles.topBarMainTitle} numberOfLines={1}>
              {ex.shortName || ex.name}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.doneTopBtn, completedCount > 0 && styles.doneTopBtnActive]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.doneTopBtnText, completedCount > 0 && styles.doneTopBtnTextActive]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content: Looping Video + Sets Logger Table */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: (insets.bottom || 24) + 40 }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* 🎬 1. Contained Looping Animated Video Demonstration */}
            <View style={styles.videoCard}>
              <View style={styles.videoWrapper}>
                <VideoView
                  style={styles.video}
                  player={player}
                  contentFit="cover"
                  nativeControls={false}
                  allowsFullscreen={false}
                  allowsPictureInPicture={false}
                  onFirstFrameRender={() => setFirstFrameReady(true)}
                />

                {/* Poster fallback image while buffering */}
                {!firstFrameReady && ex.image && (
                  <View style={styles.posterWrap}>
                    <Image source={ex.image} style={styles.poster} resizeMode="cover" fadeDuration={0} />
                    <ActivityIndicator style={styles.posterSpinner} color="#EF4444" size="small" />
                  </View>
                )}

                {/* Looping indicator badge */}
                <View style={styles.loopBadge}>
                  <RotateCcw size={11} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.loopBadgeText}>Looping Form Demo</Text>
                </View>
              </View>
            </View>

            {/* 🏷️ 2. Exercise Info & Prescriptions */}
            <View style={styles.infoBlock}>
              <View style={styles.tagsRow}>
                <View style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>
                    {(ex.muscle || 'Full Body').toUpperCase()}
                  </Text>
                </View>

                {!!ex.equipment && (
                  <View style={styles.equipmentTag}>
                    <Dumbbell size={11} color="#A1A1AA" style={{ marginRight: 4 }} />
                    <Text style={styles.equipmentTagText}>{ex.equipment}</Text>
                  </View>
                )}

                {!!ex.tempo && (
                  <View style={styles.tempoTag}>
                    <Clock size={11} color="#A1A1AA" style={{ marginRight: 4 }} />
                    <Text style={styles.tempoTagText}>{ex.tempo}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.exerciseTitle}>{ex.name}</Text>

              {!!ex.tagline && (
                <Text style={styles.exerciseTagline}>
                  {ex.tagline}
                </Text>
              )}
            </View>

            {/* ⏱️ 3. Rest Timer Floating Banner (Strong / Hevy pattern) */}
            {restTimerSeconds > 0 && (
              <View style={styles.restTimerBanner}>
                <View style={styles.restTimerLeft}>
                  <Clock size={16} color="#10B981" />
                  <Text style={styles.restTimerLabel}>Resting:</Text>
                  <Text style={styles.restTimerCountdown}>
                    {formatRestTimer(restTimerSeconds)}
                  </Text>
                </View>

                <View style={styles.restTimerActions}>
                  <TouchableOpacity
                    style={styles.restTimerPillBtn}
                    onPress={() => addTime(30)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.restTimerPillBtnText}>+30s</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.restTimerPillBtn, styles.restTimerSkipBtn]}
                    onPress={() => skipRest()}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.restTimerSkipText}>Skip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 📊 4. The Clean Hevy / Strong Gym Sets Table */}
            <View style={styles.tableCard}>
              {/* Table Header Row */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.colSet]}>SET</Text>
                <Text style={[styles.tableHeaderCell, styles.colPrev]}>PREVIOUS</Text>
                <Text style={[styles.tableHeaderCell, styles.colKg]}>KG</Text>
                <Text style={[styles.tableHeaderCell, styles.colReps]}>REPS</Text>
                <Text style={[styles.tableHeaderCell, styles.colCheck]}>✓</Text>
              </View>

              {/* Set Rows */}
              {setRows.map((row, index) => {
                const isDone = row.done;
                return (
                  <View
                    key={row.setNum}
                    style={[
                      styles.tableRow,
                      isDone && styles.tableRowDone,
                      index === setRows.length - 1 && styles.tableRowLast
                    ]}
                  >
                    {/* Set Number Column */}
                    <View style={styles.colSet}>
                      <View style={[styles.setNumBadge, isDone && styles.setNumBadgeDone]}>
                        <Text style={[styles.setNumText, isDone && styles.setNumTextDone]}>
                          {row.setNum}
                        </Text>
                      </View>
                    </View>

                    {/* Previous Performance Column */}
                    <View style={styles.colPrev}>
                      <Text style={styles.prevText} numberOfLines={1}>
                        {row.prev}
                      </Text>
                    </View>

                    {/* KG Input Column */}
                    <View style={styles.colKg}>
                      <TextInput
                        style={[styles.inputBox, isDone && styles.inputBoxDone]}
                        value={row.weight}
                        onChangeText={(val) => handleUpdateRowValue(index, 'weight', val)}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor="#71717A"
                        textAlign="center"
                        selectTextOnFocus
                      />
                    </View>

                    {/* REPS Input Column */}
                    <View style={styles.colReps}>
                      <TextInput
                        style={[styles.inputBox, isDone && styles.inputBoxDone]}
                        value={row.reps}
                        onChangeText={(val) => handleUpdateRowValue(index, 'reps', val)}
                        keyboardType="number-pad"
                        placeholder="10"
                        placeholderTextColor="#71717A"
                        textAlign="center"
                        selectTextOnFocus
                      />
                    </View>

                    {/* Check Action Column */}
                    <View style={styles.colCheck}>
                      <TouchableOpacity
                        style={[styles.checkBtn, isDone && styles.checkBtnDone]}
                        onPress={() => handleToggleSet(index)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Mark set ${row.setNum} complete`}
                      >
                        <Check
                          size={15}
                          color={isDone ? '#FFFFFF' : '#71717A'}
                          strokeWidth={isDone ? 3 : 2}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* Table Action Buttons: + Add Set & Complete All */}
              <View style={styles.tableFooterActions}>
                <TouchableOpacity
                  style={styles.addSetBtn}
                  onPress={handleAddSet}
                  activeOpacity={0.8}
                >
                  <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addSetBtnText}>Add Set</Text>
                </TouchableOpacity>

                {completedCount < setRows.length && (
                  <TouchableOpacity
                    style={styles.completeAllBtn}
                    onPress={handleCompleteAll}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    <Zap size={13} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.completeAllBtnText}>Complete All</Text>
                  </TouchableOpacity>
                )}

                {setRows.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeSetBtn}
                    onPress={() => handleDeleteRow(setRows.length - 1)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={13} color="#71717A" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 🏆 5. Exercise Session Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statCol}>
                <Text style={styles.statVal}>
                  {completedCount}/{setRows.length}
                </Text>
                <Text style={styles.statLbl}>SETS LOGGED</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <Text style={styles.statVal}>{totalRepsDone}</Text>
                <Text style={styles.statLbl}>TOTAL REPS</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <Text style={[styles.statVal, { color: '#10B981' }]}>
                  {totalVolumeDone >= 1000
                    ? `${(totalVolumeDone / 1000).toFixed(1)}k`
                    : totalVolumeDone}
                  <Text style={styles.statUnit}> kg</Text>
                </Text>
                <Text style={styles.statLbl}>VOLUME</Text>
              </View>
            </View>

            {/* 6. Form Technique Cues / Tips */}
            <View style={styles.techniqueBlock}>
              <View style={styles.techniqueHeader}>
                <Sparkles size={14} color="#EF4444" />
                <Text style={styles.techniqueTitle}>Execution Cues</Text>
              </View>
              <Text style={styles.techniqueText}>
                • Maintain steady control throughout the movement.{'\n'}
                • Breathe in on the eccentric (lowering) phase, exhale forcefully as you drive up.{'\n'}
                • Keep your core braced and joints aligned with the path of resistance.
              </Text>
            </View>

            {/* 🎯 7. Bottom Done Button */}
            <TouchableOpacity
              style={[
                styles.saveExerciseBtn,
                completedCount > 0 && styles.saveExerciseBtnActive
              ]}
              onPress={handleClose}
              activeOpacity={0.85}
            >
              <Check
                size={18}
                color={completedCount > 0 ? '#FFFFFF' : '#A1A1AA'}
                strokeWidth={3}
              />
              <Text
                style={[
                  styles.saveExerciseBtnText,
                  completedCount > 0 && styles.saveExerciseBtnTextActive
                ]}
              >
                {completedCount > 0
                  ? `Done with Exercise (${completedCount} Sets Saved)`
                  : 'Done with Exercise'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    backgroundColor: '#09090B',
    zIndex: 10,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  topBarTitleCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  topBarEyebrow: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  topBarMainTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  doneTopBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  doneTopBtnActive: {
    backgroundColor: '#EF4444',
  },
  doneTopBtnText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700',
  },
  doneTopBtnTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  videoCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: '#121215',
    marginBottom: 16,
  },
  videoWrapper: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#121215',
  },
  video: {
    width: '100%',
    height: VIDEO_HEIGHT,
  },
  posterWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121215',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterSpinner: {
    position: 'absolute',
    alignSelf: 'center',
    top: '46%',
  },
  loopBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 5,
  },
  loopBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoBlock: {
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  muscleTag: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  muscleTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  equipmentTagText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '600',
  },
  tempoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tempoTagText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  exerciseTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 28,
    marginBottom: 4,
  },
  exerciseTagline: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  restTimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  restTimerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restTimerLabel: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  restTimerCountdown: {
    color: '#10B981',
    fontSize: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  restTimerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restTimerPillBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  restTimerPillBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  restTimerSkipBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  restTimerSkipText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
  },
  tableCard: {
    backgroundColor: '#141417',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222226',
  },
  tableHeaderCell: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  colSet: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colPrev: {
    flex: 1.2,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colKg: {
    width: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colReps: {
    width: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colCheck: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E22',
  },
  tableRowDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.07)',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  setNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#222226',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumBadgeDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  setNumText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '800',
  },
  setNumTextDone: {
    color: '#10B981',
  },
  prevText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputBox: {
    width: 58,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1E1E22',
    borderWidth: 1,
    borderColor: '#2E2E34',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  inputBoxDone: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222226',
    borderWidth: 1,
    borderColor: '#333338',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  tableFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: '#222226',
    marginTop: 2,
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  addSetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  completeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.28)',
  },
  completeAllBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  removeSetBtn: {
    padding: 8,
    borderRadius: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#121215',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222226',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  statLbl: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#27272A',
  },
  techniqueBlock: {
    backgroundColor: '#121215',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222226',
    padding: 14,
    marginBottom: 18,
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  techniqueTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  techniqueText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  saveExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  saveExerciseBtnActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  saveExerciseBtnText: {
    color: '#A1A1AA',
    fontSize: 15,
    fontWeight: '800',
  },
  saveExerciseBtnTextActive: {
    color: '#FFFFFF',
  },
});

export default FullscreenVideoModal;
