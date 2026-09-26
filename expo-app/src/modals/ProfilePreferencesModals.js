// ProfilePreferencesModals.js — Real Modals for Personal Info, Notifications, Workout Prefs, and Help/Support
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  StatusBar,
  Alert,
  Dimensions,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  User,
  Sliders,
  Bell,
  Dumbbell,
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Check,
  Calendar,
  Scale,
  Ruler,
  Target,
  Flame,
  Award,
  Sparkles,
  Info,
  Clock,
  Volume2,
  Vibrate,
  ExternalLink
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// 1. PERSONAL INFORMATION MODAL
// ============================================================================
export function PersonalInformationModal({
  visible,
  onClose,
  userName = 'Athlete',
  userEmail = '',
  userGender = 'male',
  birthDay = 23,
  birthMonth = 'August',
  birthYear = 2008,
  userWeight = 72,
  userHeightCm = 170,
  topGoal = 'build_muscle',
  trainingExperience = 'beginner',
  workoutGuidance = 'build_own',
  unitWeight = 'kg',
  onEditInWizard
}) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24));

  // Compute calculated age
  const calculatedAge = new Date().getFullYear() - (birthYear || 2008);

  const goalTitleMap = {
    build_muscle: 'Build Muscle & Hypertrophy',
    gain_strength: 'Gain Pure Strength',
    fat_loss: 'Fat Loss & Conditioning'
  };

  const experienceTitleMap = {
    beginner: 'Beginner (0-1 year)',
    intermediate: 'Intermediate (1-3 years)',
    advanced: 'Advanced (3+ years)'
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <LinearGradient
          colors={['rgba(239, 68, 68, 0.16)', '#09090B']}
          locations={[0, 0.3]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* Header */}
        <View style={[styles.headerBar, { paddingTop: safeTop + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <User size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Personal Information</Text>
              <Text style={styles.headerSub}>Athlete Biometrics & Profile Data</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Identity Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>ACCOUNT CREDENTIALS</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Athlete Tag</Text>
              <Text style={styles.infoValue}>{userName || 'Athlete'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userEmail || 'athlete@lift.app'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Auth Provider</Text>
              <Text style={styles.infoValueHighlight}>Firebase Cloud Auth</Text>
            </View>
          </View>

          {/* Physical Attributes Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>PHYSICAL BIOMETRICS</Text>
            <View style={styles.infoRow}>
              <View style={styles.rowLabelGroup}>
                <Scale size={15} color="#A1A1AA" />
                <Text style={styles.infoLabel}>Current Bodyweight</Text>
              </View>
              <Text style={styles.infoValue}>{userWeight} {unitWeight}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.rowLabelGroup}>
                <Ruler size={15} color="#A1A1AA" />
                <Text style={styles.infoLabel}>Height</Text>
              </View>
              <Text style={styles.infoValue}>{userHeightCm} cm</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.rowLabelGroup}>
                <Calendar size={15} color="#A1A1AA" />
                <Text style={styles.infoLabel}>Age & Birthday</Text>
              </View>
              <Text style={styles.infoValue}>{birthMonth} {birthDay}, {birthYear} ({calculatedAge} yrs)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={[styles.infoValue, { textTransform: 'capitalize' }]}>{userGender || 'Male'}</Text>
            </View>
          </View>

          {/* Training Focus Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>TRAINING PRESCRIPTION</Text>
            <View style={styles.infoRow}>
              <View style={styles.rowLabelGroup}>
                <Target size={15} color="#A1A1AA" />
                <Text style={styles.infoLabel}>Primary Objective</Text>
              </View>
              <Text style={styles.infoValue}>{goalTitleMap[topGoal] || 'Build Muscle'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.rowLabelGroup}>
                <Award size={15} color="#A1A1AA" />
                <Text style={styles.infoLabel}>Experience Level</Text>
              </View>
              <Text style={styles.infoValue}>{experienceTitleMap[trainingExperience] || 'Beginner'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.rowLabelGroup}>
                <Sparkles size={15} color="#A1A1AA" />
                <Text style={styles.infoLabel}>Guidance Style</Text>
              </View>
              <Text style={styles.infoValue}>
                {workoutGuidance === 'build_own' ? 'Build My Own Routine' : 'AI Coach Prescribed'}
              </Text>
            </View>
          </View>

          {/* Action CTA to re-run full onboarding wizard */}
          <TouchableOpacity
            style={styles.editWizardBtn}
            onPress={() => {
              onClose();
              if (onEditInWizard) onEditInWizard();
            }}
            activeOpacity={0.85}
          >
            <Sliders size={16} color="#FFFFFF" />
            <Text style={styles.editWizardBtnText}>Edit in Onboarding Wizard</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================================
// 2. NOTIFICATIONS PREFERENCES MODAL
// ============================================================================
export function NotificationsPreferencesModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24));

  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakWarning, setStreakWarning] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [rankAlerts, setRankAlerts] = useState(true);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <LinearGradient
          colors={['rgba(239, 68, 68, 0.16)', '#09090B']}
          locations={[0, 0.3]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View style={[styles.headerBar, { paddingTop: safeTop + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Bell size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSub}>Workout Alerts & Reminders</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>WORKOUT SCHEDULE ALERTS</Text>

            {/* Toggle 1: Daily Reminder */}
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Daily Workout Reminder</Text>
                <Text style={styles.switchSub}>Sends an alert at 6:00 PM if no session has been logged today</Text>
              </View>
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: '#27272A', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Toggle 2: Streak Warning */}
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Streak Freeze Warning</Text>
                <Text style={styles.switchSub}>Alerts you 4 hours before your active streak lapses</Text>
              </View>
              <Switch
                value={streakWarning}
                onValueChange={setStreakWarning}
                trackColor={{ false: '#27272A', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>ARENA & PROGRESS REPORTS</Text>

            {/* Toggle 3: Weekly Digest */}
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Sunday Weekly Digest</Text>
                <Text style={styles.switchSub}>Weekly volume recap, new PRs established, and consistency score</Text>
              </View>
              <Switch
                value={weeklyDigest}
                onValueChange={setWeeklyDigest}
                trackColor={{ false: '#27272A', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Toggle 4: Rank Alerts */}
            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Diamond League Arena Alerts</Text>
                <Text style={styles.switchSub}>Notifies when an athlete passes your volume rank</Text>
              </View>
              <Switch
                value={rankAlerts}
                onValueChange={setRankAlerts}
                trackColor={{ false: '#27272A', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Done</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================================
// 3. WORKOUT PREFERENCES & UNITS MODAL
// ============================================================================
export function WorkoutPreferencesModal({
  visible,
  onClose,
  unitWeight = 'kg',
  unitDistance = 'kilometers',
  unitBody = 'cm',
  onUpdateUnits
}) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24));

  const [weightUnit, setWeightUnit] = useState(unitWeight);
  const [distanceUnit, setDistanceUnit] = useState(unitDistance);
  const [bodyUnit, setBodyUnit] = useState(unitBody);
  const [restTimer, setRestTimer] = useState(90);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleSelectWeight = (val) => {
    setWeightUnit(val);
    if (onUpdateUnits) onUpdateUnits({ unitWeight: val });
  };

  const handleSelectDistance = (val) => {
    setDistanceUnit(val);
    if (onUpdateUnits) onUpdateUnits({ unitDistance: val });
  };

  const handleSelectBody = (val) => {
    setBodyUnit(val);
    if (onUpdateUnits) onUpdateUnits({ unitBody: val });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <LinearGradient
          colors={['rgba(239, 68, 68, 0.16)', '#09090B']}
          locations={[0, 0.3]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View style={[styles.headerBar, { paddingTop: safeTop + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Dumbbell size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Workout Preferences</Text>
              <Text style={styles.headerSub}>Measurement Units & Rest Timers</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Units Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>MEASUREMENT UNITS</Text>

            {/* Weight Unit */}
            <View style={styles.unitRow}>
              <View>
                <Text style={styles.unitRowTitle}>Weight Unit</Text>
                <Text style={styles.unitRowSub}>Applies to barbell plates & dumbbells</Text>
              </View>
              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  style={[styles.segmentBtn, weightUnit === 'kg' && styles.segmentBtnActive]}
                  onPress={() => handleSelectWeight('kg')}
                >
                  <Text style={[styles.segmentText, weightUnit === 'kg' && styles.segmentTextActive]}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, weightUnit === 'lbs' && styles.segmentBtnActive]}
                  onPress={() => handleSelectWeight('lbs')}
                >
                  <Text style={[styles.segmentText, weightUnit === 'lbs' && styles.segmentTextActive]}>lbs</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Distance Unit */}
            <View style={styles.unitRow}>
              <View>
                <Text style={styles.unitRowTitle}>Distance Unit</Text>
                <Text style={styles.unitRowSub}>Applies to cardio & running metrics</Text>
              </View>
              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  style={[styles.segmentBtn, distanceUnit === 'kilometers' && styles.segmentBtnActive]}
                  onPress={() => handleSelectDistance('kilometers')}
                >
                  <Text style={[styles.segmentText, distanceUnit === 'kilometers' && styles.segmentTextActive]}>km</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, distanceUnit === 'miles' && styles.segmentBtnActive]}
                  onPress={() => handleSelectDistance('miles')}
                >
                  <Text style={[styles.segmentText, distanceUnit === 'miles' && styles.segmentTextActive]}>mi</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Height Unit */}
            <View style={styles.unitRow}>
              <View>
                <Text style={styles.unitRowTitle}>Body Dimensions</Text>
                <Text style={styles.unitRowSub}>Athlete height & body measurements</Text>
              </View>
              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  style={[styles.segmentBtn, bodyUnit === 'cm' && styles.segmentBtnActive]}
                  onPress={() => handleSelectBody('cm')}
                >
                  <Text style={[styles.segmentText, bodyUnit === 'cm' && styles.segmentTextActive]}>cm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, bodyUnit === 'ft_in' && styles.segmentBtnActive]}
                  onPress={() => handleSelectBody('ft_in')}
                >
                  <Text style={[styles.segmentText, bodyUnit === 'ft_in' && styles.segmentTextActive]}>ft/in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Rest Timer Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>REST INTERVAL TIMER</Text>
            <Text style={styles.unitRowSub}>Default rest duration between compound lifting sets</Text>

            <View style={styles.restTimerRow}>
              {[60, 90, 120, 180].map((seconds) => (
                <TouchableOpacity
                  key={seconds}
                  style={[styles.restTimerBtn, restTimer === seconds && styles.restTimerBtnActive]}
                  onPress={() => setRestTimer(seconds)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.restTimerText, restTimer === seconds && styles.restTimerTextActive]}>
                    {seconds}s
                  </Text>
                  <Text style={styles.restTimerSub}>{seconds === 90 ? 'Recommended' : seconds < 90 ? 'Hypertrophy' : 'Strength'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sensory Feedback Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>HAPTICS & AUDIO FEEDBACK</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Haptic Feedback</Text>
                <Text style={styles.switchSub}>Vibration feedback when logging sets and finishing intervals</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: '#27272A', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Set Audio Completion Ping</Text>
                <Text style={styles.switchSub}>Plays a subtle chime when the rest countdown completes</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#27272A', true: '#EF4444' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Apply Preferences</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================================
// 4. HELP & SUPPORT MODAL
// ============================================================================
export function HelpSupportModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24));

  const [expandedFaq, setExpandedFaq] = useState(null);

  const FAQS = [
    {
      q: 'How does LIFT calculate my 1RM and total volume?',
      a: 'Tonnage volume is computed by multiplying weight (kg) by repetitions for every submitted set. Your estimated One-Rep Maximum (1RM) is calculated via the validated Epley formula: Weight × (1 + Reps / 30). Only weighted resistance sets establish 1RM points; bodyweight sets do not fabricate synthetic weight.'
    },
    {
      q: 'Does the app work without internet connection?',
      a: 'Yes, 100%. Every workout session, set log, and daily calendar status is written to local sandbox storage (AsyncStorage) with immediate reactivity. When an active connection is detected, the app automatically reconciles and syncs your logs with Cloud Firestore.'
    },
    {
      q: 'How do Diamond League rankings work?',
      a: 'The Arena Leaderboard tracks two competitive disciplines: "Heavy Lifters" (ranked by total weekly volume in kg and verified PRs) and "Consistency Kings" (ranked by days trained per week and active day streaks). The competition cycle resets every Sunday at midnight UTC.'
    },
    {
      q: 'How do I toggle between kg and lbs?',
      a: 'Go to Profile → Workout Preferences. Tap the "kg" or "lbs" segment button. The app will immediately update all exercise logging screens to reflect your preferred unit.'
    },
    {
      q: 'How do I request account deletion or data export?',
      a: 'Under GDPR/CCPA regulations, you can export all your workout history directly in Profile → Privacy & Security → Export Workout Data. To permanently erase your account, tap "Request Account Deletion" or email support@liftfitness.app.'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleEmailSupport = () => {
    Alert.alert(
      'Official Support Desk',
      'For technical issues, bug reports, or feature requests, email:\n\nsupport@liftfitness.app\n\nOur team replies within 24 hours.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <LinearGradient
          colors={['rgba(239, 68, 68, 0.16)', '#09090B']}
          locations={[0, 0.3]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View style={[styles.headerBar, { paddingTop: safeTop + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <HelpCircle size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Help & Support</Text>
              <Text style={styles.headerSub}>FAQs, Diagnostics & Help Desk</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Contact Card */}
          <View style={[styles.card, styles.contactSupportCard]}>
            <View style={styles.contactSupportHeader}>
              <Mail size={18} color="#EF4444" />
              <Text style={styles.contactSupportTitle}>Need Direct Athlete Support?</Text>
            </View>
            <Text style={styles.contactSupportSub}>
              Have an issue with your workout tracking, sets, or cloud sync? Our engineers and certified trainers are ready to help.
            </Text>
            <TouchableOpacity style={styles.contactEmailBtn} onPress={handleEmailSupport} activeOpacity={0.85}>
              <Text style={styles.contactEmailBtnText}>Contact support@liftfitness.app</Text>
              <ExternalLink size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Interactive FAQs Accordion */}
          <Text style={styles.sectionHeaderLabel}>FREQUENTLY ASKED QUESTIONS</Text>
          <View style={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestionRow}
                    onPress={() => toggleFaq(index)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.faqQuestionText}>{faq.q}</Text>
                    {isExpanded ? (
                      <ChevronUp size={18} color="#EF4444" />
                    ) : (
                      <ChevronDown size={18} color="#71717A" />
                    )}
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqAnswerBox}>
                      <Text style={styles.faqAnswerText}>{faq.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Diagnostics Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>APP DIAGNOSTICS & SYSTEM INFO</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>v1.2.0 (Build 2026.09.26)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Runtime Engine</Text>
              <Text style={styles.infoValue}>Expo SDK 57 · React Native</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Backend Infrastructure</Text>
              <Text style={styles.infoValueHighlight}>Google Cloud Firestore</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Offline Persistence</Text>
              <Text style={styles.infoValueHighlight}>Active (AsyncStorage Sandbox)</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#09090B'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  headerSub: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40
  },
  card: {
    backgroundColor: 'rgba(18, 18, 22, 0.90)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 14
  },
  cardHeader: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  rowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  infoLabel: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600'
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  infoValueHighlight: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800'
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 10
  },
  editWizardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8
  },
  editWizardBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  switchTextCol: {
    flex: 1
  },
  switchTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2
  },
  switchSub: {
    color: '#71717A',
    fontSize: 11.5,
    lineHeight: 16
  },
  saveBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  unitRowTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  unitRowSub: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  segmentBtnActive: {
    backgroundColor: '#EF4444'
  },
  segmentText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  restTimerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  restTimerBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  restTimerBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444'
  },
  restTimerText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '800'
  },
  restTimerTextActive: {
    color: '#EF4444'
  },
  restTimerSub: {
    color: '#71717A',
    fontSize: 8.5,
    marginTop: 2
  },
  contactSupportCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)'
  },
  contactSupportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  contactSupportTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  contactSupportSub: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12
  },
  contactEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6
  },
  contactEmailBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  sectionHeaderLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 4
  },
  faqList: {
    gap: 8,
    marginBottom: 14
  },
  faqItem: {
    backgroundColor: 'rgba(18, 18, 22, 0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden'
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14
  },
  faqQuestionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 10
  },
  faqAnswerBox: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10
  },
  faqAnswerText: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 18
  }
});
