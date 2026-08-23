import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Image,
  Alert,
  Modal,
  LogBox,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreAllLogs(true);
import * as Speech from 'expo-speech';
import Svg, { Path, Rect, G } from 'react-native-svg';
import {
  Home,
  Dumbbell,
  List,
  User,
  Clock,
  Play,
  Pause,
  Check,
  Search,
  ChevronRight,
  Flame,
  ArrowLeft,
  X,
  RotateCw,
  Zap,
  Activity,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Crown,
  Trophy,
  Target,
  Layers,
  ChevronDown,
  Edit3,
  Volume2,
  VolumeX,
  Sliders,
  CheckCircle2,
  Mic,
  LogOut,
  ArrowRight,
  Mail,
  Lock,
  MoreVertical
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// =========================================================================
// 🔥 LIVE FIREBASE REST AUTH CONFIGURATION (Project: lift-e44ad)
// =========================================================================
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCMRvZ7Zk9vn2wPaNmWEecFopCNrdMbZUw',
  projectId: 'lift-e44ad',
  appId: '1:1065207297774:android:05bb11ae1b3e4b88ec25ff',
  storageBucket: 'lift-e44ad.firebasestorage.app'
};

// =========================================================================
// 🖤 LUXURY MONOCHROME DESIGN SYSTEM (MATCHING FATIMA'S APK DESIGN)
// =========================================================================
const C = {
  bg: '#000000',
  surface: '#0E0E10',
  surfaceVariant: '#17171A',
  surfaceElevated: '#222226',
  border: '#27272A',
  borderSubtle: '#1C1C1F',
  borderGlow: 'rgba(255, 255, 255, 0.25)',
  white: '#FFFFFF',
  platinum: '#F4F4F5',
  zincLight: '#E4E4E7',
  zinc: '#A1A1AA',
  zincDark: '#71717A',
  zincMuted: '#3F3F46',
  emerald: '#10B981',
  blue: '#38BDF8',
  amber: '#F59E0B',
  rose: '#F43F5E'
};

// 💎 Official High-Resolution 'LIFT' Logo Component (Matching Fatima's APK Screen)
function LiftBrandLogo({ size = 'large' }) {
  return (
    <View style={styles.brandLogoRow}>
      <Image
        source={require('./assets/lift_logo.png')}
        style={size === 'small' ? styles.liftLogoImgSmall : styles.liftLogoImg}
        resizeMode="contain"
      />
    </View>
  );
}

// Auto-Scanning Gallery Carousel (Matching Fatima's Image 1)
const HERO_GALLERY = [
  {
    uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
    tag: 'LIFT GALLERY'
  },
  {
    uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    tag: 'LIFT GALLERY'
  },
  {
    uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop',
    tag: 'LIFT GALLERY'
  },
  {
    uri: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop',
    tag: 'LIFT GALLERY'
  },
  {
    uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop',
    tag: 'LIFT GALLERY'
  }
];

function AutoSwipingHeroGallery() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_GALLERY.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_GALLERY[activeIdx];

  return (
    <View style={styles.carouselContainer}>
      <Image
        source={{ uri: slide.uri }}
        style={styles.carouselImg}
        resizeMode="cover"
      />
      <View style={styles.carouselOverlay} />

      {/* Top Left 'LIFT GALLERY' Pill Badge */}
      <View style={styles.galleryBadge}>
        <Text style={styles.galleryBadgeText}>LIFT GALLERY</Text>
      </View>

      {/* 5 Pagination Dots at bottom of image */}
      <View style={styles.carouselDotsContainer}>
        {HERO_GALLERY.map((_, i) => (
          <View
            key={i}
            style={[
              styles.galleryDot,
              activeIdx === i ? styles.galleryDotActive : styles.galleryDotInactive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// 3D Anatomical Animated GIF Database (With Red Highlighted Active Muscles)
const EXERCISES_DB = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell & Flat Bench',
    tempo: '3-1-1-0 (3s Lower, 1s Pause, 1s Press)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0025-EIeI8Vf.jpg',
    audioCues: {
      intro: 'Barbell Bench Press. Grip bar 1.5 times shoulder width. Unrack and brace your core.',
      lower: 'Lower the bar slowly... 3, 2, 1... hold at mid-chest...',
      press: 'Explode up! Drive through your feet and exhale!',
      finish: 'Great rep! Keep your shoulder blades locked into the bench.'
    },
    biomechanics: {
      jointAngle: 'Elbow Flare: 45° - 60° (Protects rotator cuffs)',
      barPath: 'Bar Path: Controlled J-Curve down to mid-sternum',
      footwork: 'Scapula: Pinched tightly into bench throughout'
    },
    targetMuscles: [
      { name: 'Pectoralis Major (Chest)', role: 'Primary Target (95%)' },
      { name: 'Triceps Brachii', role: 'Lockout Driver (70%)' },
      { name: 'Anterior Deltoids', role: 'Stabilizer (55%)' }
    ],
    mistakes: [
      'Flaring elbows out to 90° (causes extreme shoulder impingement)',
      'Bouncing the bar violently off your ribcage',
      'Lifting glutes off the bench during heavy effort'
    ],
    sets: [
      { num: 1, reps: 10, weight: 50, done: false },
      { num: 2, reps: 10, weight: 55, done: false },
      { num: 3, reps: 8, weight: 60, done: false }
    ]
  },
  {
    id: '2',
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    equipment: 'Dumbbells & 30° Incline Bench',
    tempo: '2-1-1-0 (2s Lower, 1s Stretch, 1s Squeeze)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0314-ns0SIbU.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0314-ns0SIbU.jpg',
    audioCues: {
      intro: 'Incline Dumbbell Press. Bench at 30 degrees. Kick weights up and pack your lats.',
      lower: 'Lower weights smoothly... feel the upper chest stretch...',
      press: 'Press upward in a slight triangle arc... squeeze the clavicular pecs!',
      finish: 'Control the descent. Do not clang weights together at the top.'
    },
    biomechanics: {
      jointAngle: 'Bench Angle: 30° Optimal (Avoid >45°)',
      barPath: 'Dumbbell Arc: Converging upward triangle arc',
      footwork: 'Wrists: Kept neutral directly above elbows'
    },
    targetMuscles: [
      { name: 'Upper Pectorals (Clavicular)', role: 'Primary Target (92%)' },
      { name: 'Anterior Deltoids', role: 'Secondary Driver (65%)' },
      { name: 'Triceps', role: 'Stabilizer (50%)' }
    ],
    mistakes: [
      'Setting bench angle too steep (>45° becomes shoulder press)',
      'Clanging dumbbells together at top (disengages chest tension)',
      'Losing wrist neutrality and bending wrists backward'
    ],
    sets: [
      { num: 1, reps: 10, weight: 20, done: false },
      { num: 2, reps: 10, weight: 22, done: false },
      { num: 3, reps: 8, weight: 24, done: false }
    ]
  },
  {
    id: '3',
    name: 'Barbell Back Squat',
    muscle: 'Legs',
    equipment: 'Squat Rack & Barbell',
    tempo: '3-0-1-0 (3s Descent, Explosive Ascent)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0043-qXTaZnJ.jpg',
    audioCues: {
      intro: 'Barbell Back Squat. Create a tight shelf on upper traps. Deep 360 degree belly breath.',
      lower: 'Hinge hips back and push knees out... sinking 3, 2, 1... break parallel...',
      press: 'Drive the floor away through your midfoot! Stand tall!',
      finish: 'Solid lockout! Keep knees aligned over your pinky toes.'
    },
    biomechanics: {
      jointAngle: 'Depth: Hip crease breaks below knee cap',
      barPath: 'Bar Path: Perfectly vertical straight line over midfoot',
      footwork: 'Knee Tracking: Push knees outward over pinky toes'
    },
    targetMuscles: [
      { name: 'Quadriceps Femoris', role: 'Prime Mover (95%)' },
      { name: 'Gluteus Maximus', role: 'Hip Extensor (85%)' },
      { name: 'Core & Spinal Erectors', role: 'Spinal Armor (75%)' }
    ],
    mistakes: [
      'Knees caving inward on ascent (valgus knee collapse)',
      'Heels lifting off ground due to ankle stiffness',
      'Good-morning squat (hips shooting up before chest)'
    ],
    sets: [
      { num: 1, reps: 8, weight: 70, done: false },
      { num: 2, reps: 8, weight: 75, done: false },
      { num: 3, reps: 6, weight: 80, done: false }
    ]
  },
  {
    id: '4',
    name: 'Wide Lat Pulldown',
    muscle: 'Back',
    equipment: 'Cable Machine & Wide Lat Bar',
    tempo: '2-1-1-1 (1s Hold Squeeze, 2s Full Stretch)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/2330-LEprlgG.jpg',
    audioCues: {
      intro: 'Wide-Grip Lat Pulldown. Grip wide, lock thighs under pads, sit tall.',
      lower: 'Pull shoulder blades down and back... drive elbows down into your back pockets...',
      press: 'Hold the contraction at your chest for 1 full second... squeeze the lats!',
      finish: 'Control the stretch all the way back up to full extension.'
    },
    biomechanics: {
      jointAngle: 'Torso: Slight 10-15° lean (no excessive swinging)',
      barPath: 'Elbows: Pull down and back directly into back pockets',
      footwork: 'Thigh Pad: Locked securely against quads'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi (Lats)', role: 'Width Driver (95%)' },
      { name: 'Rhomboids & Traps', role: 'Retractors (70%)' },
      { name: 'Biceps Brachii', role: 'Synergist (55%)' }
    ],
    mistakes: [
      'Swinging whole body back to heave weight down',
      'Pulling bar behind the neck (cervical spine risk)',
      'Cutting the top stretch short'
    ],
    sets: [
      { num: 1, reps: 10, weight: 45, done: false },
      { num: 2, reps: 10, weight: 50, done: false },
      { num: 3, reps: 8, weight: 55, done: false }
    ]
  },
  {
    id: '5',
    name: 'Standing Military Press',
    muscle: 'Shoulders',
    equipment: 'Barbell & Rack',
    tempo: '2-0-1-0 (Controlled Descent, Pure Power)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0091-kTbSH9h.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0091-kTbSH9h.jpg',
    audioCues: {
      intro: 'Overhead Military Press. Forearms vertical, squeeze your glutes rock-solid.',
      lower: 'Lower the bar with control to your clavicle...',
      press: 'Tilt chin back... press straight up and push head through the window!',
      finish: 'Lock bar directly over your spine at the top!'
    },
    biomechanics: {
      jointAngle: 'Forearms: 100% vertical under bar at start',
      barPath: 'Bar Path: Straight vertical line past chin into overhead slot',
      footwork: 'Glute Lock: Squeeze glutes hard to prevent back arching'
    },
    targetMuscles: [
      { name: 'Anterior & Lateral Deltoids', role: 'Primary Target (95%)' },
      { name: 'Triceps Brachii', role: 'Lockout Driver (75%)' },
      { name: 'Core & Upper Traps', role: 'Postural Pillar (80%)' }
    ],
    mistakes: [
      'Hyperextending lower back to mimic incline bench',
      'Pressing the bar in a wide looping forward arc',
      'Soft knees and loose core'
    ],
    sets: [
      { num: 1, reps: 8, weight: 35, done: false },
      { num: 2, reps: 8, weight: 40, done: false },
      { num: 3, reps: 6, weight: 42.5, done: false }
    ]
  },
  {
    id: '6',
    name: 'Barbell Bicep Curl',
    muscle: 'Arms',
    equipment: 'Barbell / EZ-Bar',
    tempo: '2-1-1-0 (2s Lower, 1s Peak Squeeze)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0023-Yza7XrQ.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0023-Yza7XrQ.jpg',
    audioCues: {
      intro: 'Barbell Bicep Curl. Pin your elbows strictly to your ribs. Chest tall.',
      lower: 'Lower the bar slowly for 2 seconds down to full arm extension...',
      press: 'Curl the bar up with pure bicep power! Squeeze the peak for 1 second!',
      finish: 'No swinging! Control every inch of the lift.'
    },
    biomechanics: {
      jointAngle: 'Elbow Fixation: Pinned strictly to ribs with zero drift',
      barPath: 'Arc Path: Smooth upward curve without forward elbow flare',
      footwork: 'Stance: Hip-width with tight glute brace'
    },
    targetMuscles: [
      { name: 'Biceps Brachii (Short & Long Head)', role: 'Peak Target (95%)' },
      { name: 'Brachialis & Forearms', role: 'Grip & Arm Thickness (65%)' }
    ],
    mistakes: [
      'Swinging hips or rocking back to cheat weight up',
      'Letting elbows flare forward (shifts load to shoulders)',
      'Short half-reps without full bottom extension'
    ],
    sets: [
      { num: 1, reps: 10, weight: 25, done: false },
      { num: 2, reps: 10, weight: 27.5, done: false },
      { num: 3, reps: 8, weight: 30, done: false }
    ]
  },
  {
    id: '7',
    name: 'Tricep Cable Pushdown',
    muscle: 'Arms',
    equipment: 'Cable Machine & Rope Attachment',
    tempo: '2-1-1-0 (2s Eccentric, 1s Lockout Squeeze)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0201-3ZflifB.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0201-3ZflifB.jpg',
    audioCues: {
      intro: 'Tricep Pushdown. Lock elbows at your sides like door hinges.',
      lower: 'Let forearms rise to 90 degrees under control...',
      press: 'Push down forcefully and flare the ends apart! Flex triceps hard!',
      finish: 'Hold that horseshoe squeeze for 1 second!'
    },
    biomechanics: {
      jointAngle: 'Elbows: Locked in place like door hinges at sides',
      barPath: 'Rope Separation: Spread ends wide apart past thighs',
      footwork: 'Posture: Slight athletic hinge from hips with rigid core'
    },
    targetMuscles: [
      { name: 'Triceps Lateral & Medial Heads', role: 'Horseshoe Target (95%)' },
      { name: 'Anconeus', role: 'Stabilizer (45%)' }
    ],
    mistakes: [
      'Leaning your entire body weight over the rope',
      'Allowing elbows to swing backward during negative',
      'Not spreading the rope at the bottom of the rep'
    ],
    sets: [
      { num: 1, reps: 12, weight: 20, done: false },
      { num: 2, reps: 12, weight: 22.5, done: false },
      { num: 3, reps: 10, weight: 25, done: false }
    ]
  },
  {
    id: '8',
    name: 'Barbell Romanian Deadlift (RDL)',
    muscle: 'Legs',
    equipment: 'Barbell & Plates',
    tempo: '3-1-1-0 (3s Hip Hinge, 1s Glute Squeeze)',
    gifUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0085-wQ2c4XD.gif',
    thumbUrl: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0085-wQ2c4XD.jpg',
    audioCues: {
      intro: 'Romanian Deadlift. Unlock knees slightly. Flat spine and packed lats.',
      lower: 'Send your hips straight back like closing a car door... lower 3, 2, 1...',
      press: 'Feel that deep hamstring stretch... now drive hips forward into the bar!',
      finish: 'Lock glutes at the top without hyperextending your lower back.'
    },
    biomechanics: {
      jointAngle: 'Hip Hinge: Push hips straight backward like closing a door',
      barPath: 'Knee Bend: Soft 15° bend (this is a hinge, not a squat)',
      footwork: 'Bar Contact: Bar stays in continuous contact with shins'
    },
    targetMuscles: [
      { name: 'Hamstrings (Biceps Femoris)', role: 'Prime Target (95%)' },
      { name: 'Gluteus Maximus', role: 'Hip Extensor (90%)' },
      { name: 'Erector Spinae & Lats', role: 'Spinal Shield (80%)' }
    ],
    mistakes: [
      'Rounding the lower back (extreme lumbar disc risk)',
      'Bending knees excessively turning it into a squat',
      'Allowing the bar to drift away from legs'
    ],
    sets: [
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 65, done: false },
      { num: 3, reps: 8, weight: 70, done: false }
    ]
  }
];

// =========================================================================
// 🎙️ 3D ANATOMICAL GIF & AUDIO VOICE COACH STUDIO
// =========================================================================
function ExerciseAudioCoachStudio({ exercise, compact = false }) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [coachSubtitle, setCoachSubtitle] = useState(exercise.audioCues.intro);
  const [cadencePhase, setCadencePhase] = useState('READY');

  const speak = (text) => {
    try {
      Speech.stop();
      Speech.speak(text, { rate: 0.95, pitch: 1.0 });
    } catch (e) {}
  };

  const startVoiceCoaching = () => {
    setIsVoiceActive(true);
    setCoachSubtitle(exercise.audioCues.intro);
    speak(exercise.audioCues.intro);

    setTimeout(() => {
      setCadencePhase('LOWER (3s)');
      setCoachSubtitle(exercise.audioCues.lower);
      speak(exercise.audioCues.lower);
    }, 4500);

    setTimeout(() => {
      setCadencePhase('EXPLODE UP! ⚡');
      setCoachSubtitle(exercise.audioCues.press);
      speak(exercise.audioCues.press);
    }, 9000);

    setTimeout(() => {
      setCadencePhase('SET COMPLETE! ✅');
      setCoachSubtitle(exercise.audioCues.finish);
      speak(exercise.audioCues.finish);
    }, 13000);
  };

  const stopVoiceCoaching = () => {
    try {
      Speech.stop();
    } catch (e) {}
    setIsVoiceActive(false);
    setCadencePhase('READY');
  };

  return (
    <View style={styles.coachCard}>
      {/* 3D Anatomical GIF Viewport Frame */}
      <View style={compact ? styles.viewportCompact : styles.viewport}>
        <Image
          source={{ uri: exercise.gifUrl }}
          style={styles.viewportImg}
          resizeMode="contain"
        />

        {/* Live HUD Badge */}
        <View style={styles.hudTopBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.hudTopText}>3D ANATOMICAL GIF • RED = ACTIVE MUSCLE</Text>
        </View>

        {/* Voice Coach Play/Pause Button */}
        <TouchableOpacity
          style={[styles.audioCoachPill, isVoiceActive && styles.audioCoachPillActive]}
          onPress={() => (isVoiceActive ? stopVoiceCoaching() : startVoiceCoaching())}
        >
          {isVoiceActive ? <VolumeX size={14} color={C.bg} /> : <Volume2 size={14} color={C.white} />}
          <Text style={[styles.audioCoachPillText, isVoiceActive && { color: C.bg }]}>
            {isVoiceActive ? 'STOP VOICE COACH' : '🎙️ START AUDIO COACH'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Real-Time Live Speech Subtitle Banner */}
      <View style={styles.speechSubtitleBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Mic size={13} color={C.white} />
          <Text style={{ color: C.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>
            AI COACH VOICE-OVER:
          </Text>
          <View style={[styles.cadenceTag, { backgroundColor: isVoiceActive ? C.emerald : C.surfaceElevated }]}>
            <Text style={{ color: isVoiceActive ? '#FFF' : C.zinc, fontSize: 9, fontWeight: '900' }}>
              {cadencePhase}
            </Text>
          </View>
        </View>
        <Text style={styles.speechSubtitleText}>"{coachSubtitle}"</Text>
      </View>

      {/* Biomechanics Cues */}
      <View style={styles.biomechBox}>
        <View style={styles.cueItemRow}>
          <ShieldCheck size={13} color={C.white} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.jointAngle}</Text>
        </View>
        <View style={styles.cueItemRow}>
          <Activity size={13} color={C.zinc} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.barPath}</Text>
        </View>
      </View>

      {/* Target Muscle Load Map */}
      <View style={styles.muscleMapSection}>
        <Text style={styles.muscleMapTitle}>Target Muscle Activation (Red Highlight)</Text>
        {exercise.targetMuscles.map((m, i) => (
          <View key={i} style={styles.muscleRow}>
            <View style={styles.muscleRowHeader}>
              <Text style={styles.muscleName}>{m.name}</Text>
              <Text style={styles.muscleRole}>{m.role}</Text>
            </View>
            <View style={styles.muscleTrack}>
              <View
                style={[
                  styles.muscleFill,
                  { width: i === 0 ? '95%' : i === 1 ? '70%' : '55%' }
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// =========================================================================
// 🚀 MAIN APPLICATION
// =========================================================================
export default function App() {
  // App Flow State: 'AUTH' | 'ONBOARDING' | 'MAIN'
  const [appScreen, setAppScreen] = useState('AUTH');
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null);

  // User Profile & Auth State
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [userName, setUserName] = useState('ahmdhjh');
  const [userEmail, setUserEmail] = useState('ahmdhjh@gmail.com');
  const [userGoal, setUserGoal] = useState('Build Lean Muscle');
  const [nameInput, setNameInput] = useState('ahmdhjh');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Active Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState(EXERCISES_DB.slice(0, 3));
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  // Rest Timer Effect
  useEffect(() => {
    let interval;
    if (isResting && restSeconds > 0) {
      interval = setInterval(() => setRestSeconds(prev => prev - 1), 1000);
    } else if (restSeconds === 0) {
      setIsResting(false);
      setRestSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isResting, restSeconds]);

  // Workout Clock
  useEffect(() => {
    let timer;
    if (isWorkoutActive) {
      timer = setInterval(() => setWorkoutDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutActive]);

  // Fast Account Login (Matching Fatima's One-Tap Login)
  const handleQuickLogin = async (selectedEmail, selectedName) => {
    setIsSigningIn(true);
    try {
      if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('REPLACE_')) {
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ returnSecureToken: true })
        });
        const data = await res.json();
        if (data.localId) {
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {}

    setUserEmail(selectedEmail);
    setNameInput(selectedName);
    setUserName(selectedName);
    setIsSigningIn(false);
    setShowGoogleModal(false);
    setAppScreen('ONBOARDING');
  };

  // Live Firebase Email & Password REST Auth
  const handleFirebaseEmailAuth = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setIsSigningIn(true);
    try {
      if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('REPLACE_')) {
        let res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailInput.trim(),
            password: passwordInput.trim(),
            returnSecureToken: true
          })
        });
        let data = await res.json();

        if (data.error && data.error.message.includes('EMAIL_NOT_FOUND')) {
          res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailInput.trim(),
              password: passwordInput.trim(),
              returnSecureToken: true
            })
          });
          data = await res.json();
        }

        if (data.localId) {
          setFirebaseUid(data.localId);
        }
      }
    } catch (e) {}

    const extractedName = emailInput.split('@')[0] || 'Athlete';
    setUserEmail(emailInput.trim());
    setNameInput(extractedName);
    setUserName(extractedName);
    setIsSigningIn(false);
    setShowEmailModal(false);
    setAppScreen('ONBOARDING');
  };

  const handleFinishOnboarding = () => {
    if (!nameInput.trim()) {
      Alert.alert('Please enter your name', 'Your AI coach needs your name to personalize your workouts.');
      return;
    }
    setUserName(nameInput.trim());
    setAppScreen('MAIN');
  };

  const handleLogOut = () => {
    setUserName('');
    setNameInput('');
    setUserEmail('');
    setFirebaseUid(null);
    setAppScreen('AUTH');
  };

  const startWorkout = () => {
    setWorkoutExercises(JSON.parse(JSON.stringify(EXERCISES_DB.slice(0, 3))));
    setCurrentExIndex(0);
    setWorkoutDuration(0);
    setIsResting(false);
    setIsWorkoutActive(true);
  };

  const toggleSetComplete = (setIndex) => {
    const updated = [...workoutExercises];
    const currentSets = updated[currentExIndex].sets;
    currentSets[setIndex].done = !currentSets[setIndex].done;
    setWorkoutExercises(updated);

    if (currentSets[setIndex].done) {
      setRestSeconds(60);
      setIsResting(true);
    }
  };

  const adjustWeight = (setIndex, delta) => {
    const updated = [...workoutExercises];
    const currentSets = updated[currentExIndex].sets;
    currentSets[setIndex].weight = Math.max(2.5, currentSets[setIndex].weight + delta);
    setWorkoutExercises(updated);
  };

  const filteredExercises = EXERCISES_DB.filter(ex => {
    const matchName = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
    return matchName && matchMuscle;
  });

  const currentWorkoutEx = workoutExercises[currentExIndex];

  // =========================================================================
  // 🔑 SCREEN 1: LOGIN SCREEN (100% MATCHING FATIMA'S APK DESIGN IN IMAGE 1)
  // =========================================================================
  if (appScreen === 'AUTH') {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        <ScrollView contentContainerStyle={styles.authContentScroll} showsVerticalScrollIndicator={false}>
          {/* Top Stylized '|_ LIFT' Logo */}
          <View style={styles.authHeader}>
            <LiftBrandLogo />
          </View>

          {/* Auto-Swiping Hero Gallery with LIFT GALLERY Pill */}
          <AutoSwipingHeroGallery />

          {/* Headline (Matching Fatima's APK Screen) */}
          <Text style={styles.authHeadline}>
            Turn your training into visible{'\n'}progress.
          </Text>

          {/* Account Selection Section */}
          <View style={styles.authSectionBox}>
            <Text style={styles.authPromptLabel}>Select an account to log in to LIFT</Text>

            {/* Main Log in as Account Button */}
            <TouchableOpacity
              style={styles.primaryAccountBtn}
              activeOpacity={0.85}
              onPress={() => handleQuickLogin('ahmdhjh@gmail.com', 'ahmdhjh')}
            >
              <View style={styles.accountAvatarCircle}>
                <User size={18} color="#71717A" />
              </View>
              <Text style={styles.accountBtnText}>Log in as ahmdhjh</Text>
              <MoreVertical size={18} color="#000000" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            {/* Log in using another account Button */}
            <TouchableOpacity
              style={styles.secondaryAccountBtn}
              activeOpacity={0.85}
              onPress={() => setShowGoogleModal(true)}
            >
              <Text style={styles.secondaryBtnText}>Log in using another account</Text>
            </TouchableOpacity>

            {/* Bottom 'New to LIFT? Sign up' */}
            <View style={styles.authFooterRow}>
              <Text style={styles.authFooterText}>New to LIFT? </Text>
              <TouchableOpacity onPress={() => setShowEmailModal(true)}>
                <Text style={styles.authFooterLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Google Account Picker Modal */}
        <Modal visible={showGoogleModal} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.googlePickerCard}>
              <View style={styles.googleHeaderRow}>
                <LiftBrandLogo />
                <TouchableOpacity onPress={() => setShowGoogleModal(false)} style={styles.modalCloseBtn}>
                  <X size={16} color={C.zinc} />
                </TouchableOpacity>
              </View>

              <Text style={styles.googlePromptText}>Choose an account to continue to LIFT</Text>

              {isSigningIn ? (
                <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={C.white} />
                  <Text style={{ color: C.zincLight, marginTop: 12, fontSize: 13, fontWeight: '600' }}>
                    Signing in...
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 8, marginVertical: 10 }}>
                  <TouchableOpacity
                    style={styles.googleAccountRow}
                    activeOpacity={0.7}
                    onPress={() => handleQuickLogin('ahmdhjh@gmail.com', 'ahmdhjh')}
                  >
                    <View style={styles.googleAvatar}>
                      <Text style={styles.avatarText}>A</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.accountName}>ahmdhjh</Text>
                      <Text style={styles.accountEmail}>ahmdhjh@gmail.com</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.googleAccountRow}
                    activeOpacity={0.7}
                    onPress={() => handleQuickLogin('ahmad.muaaz@gmail.com', 'Ahmad Muaaz')}
                  >
                    <View style={[styles.googleAvatar, { backgroundColor: '#1E293B' }]}>
                      <Text style={styles.avatarText}>M</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.accountName}>Ahmad Muaaz</Text>
                      <Text style={styles.accountEmail}>ahmad.muaaz@gmail.com</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.googleAccountRow, { borderStyle: 'dashed' }]}
                    activeOpacity={0.7}
                    onPress={() => setShowEmailModal(true)}
                  >
                    <View style={[styles.googleAvatar, { backgroundColor: C.surfaceElevated }]}>
                      <Mail size={16} color={C.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.accountName}>Sign in with Email & Password</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Email & Password Modal */}
        <Modal visible={showEmailModal} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.googlePickerCard}>
              <View style={styles.googleHeaderRow}>
                <Mail size={20} color={C.white} />
                <Text style={styles.googleHeaderTitle}>LIFT Email Sign In</Text>
                <TouchableOpacity onPress={() => setShowEmailModal(false)} style={styles.modalCloseBtn}>
                  <X size={16} color={C.zinc} />
                </TouchableOpacity>
              </View>

              <Text style={styles.googlePromptText}>Enter your email to sign in or register</Text>

              <View style={{ gap: 10, marginVertical: 12 }}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Email address..."
                  placeholderTextColor={C.zincDark}
                  value={emailInput}
                  onChangeText={setEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.emailInput}
                  placeholder="Password..."
                  placeholderTextColor={C.zincDark}
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  secureTextEntry
                />
              </View>

              {isSigningIn ? (
                <ActivityIndicator size="small" color={C.white} style={{ marginVertical: 12 }} />
              ) : (
                <TouchableOpacity style={styles.saveProfileBtn} onPress={handleFirebaseEmailAuth}>
                  <Text style={styles.saveProfileBtnText}>Continue to LIFT</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // =========================================================================
  // 📝 SCREEN 2: ENTER NAME / ONBOARDING SCREEN (100% MATCHING LIFT REFERENCE)
  // =========================================================================
  if (appScreen === 'ONBOARDING') {
    const isNameValid = nameInput.trim().length > 0;

    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        <View style={styles.namePageContainer}>
          {/* Top Bar with Back Button */}
          <View style={styles.nameTopBar}>
            <TouchableOpacity
              onPress={() => setAppScreen('AUTH')}
              style={styles.nameBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={C.white} />
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          <ScrollView
            contentContainerStyle={styles.nameScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 💎 Main Pure White LIFT Logo (No small grey logo above) */}
            <View style={styles.nameLogoWrapper}>
              <Image
                source={require('./assets/lift_logo.png')}
                style={styles.nameLiftLogo}
              />
            </View>

            {/* Welcoming Heading */}
            <Text style={styles.nameHeading}>What should we call you?</Text>

            {/* Short Subtitle */}
            <Text style={styles.nameSubhead}>Let's personalize your fitness journey.</Text>

            {/* Clean Name Input Field */}
            <View style={styles.nameInputContainer}>
              <TextInput
                style={styles.nameInputField}
                placeholder="Enter your name"
                placeholderTextColor="#71717A"
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (isNameValid) handleFinishOnboarding();
                }}
              />
            </View>
          </ScrollView>

          {/* Prominent Bottom Continue Button */}
          <View style={styles.nameBottomBar}>
            <TouchableOpacity
              style={[styles.nameContinueBtn, !isNameValid && styles.nameContinueBtnDisabled]}
              disabled={!isNameValid}
              onPress={handleFinishOnboarding}
              activeOpacity={0.85}
            >
              <Text style={[styles.nameContinueBtnText, !isNameValid && styles.nameContinueBtnTextDisabled]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // ⚡ SCREEN 3: MAIN APP DASHBOARD & TABS
  // =========================================================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ======================================================== */}
      {/* 1. DASHBOARD HOME TAB */}
      {/* ======================================================== */}
      {currentTab === 'home' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Brand Header */}
          <View style={styles.headerRow}>
            <LiftBrandLogo />

            <TouchableOpacity style={styles.userBadge} onPress={() => setCurrentTab('profile')}>
              <User size={13} color={C.white} />
              <Text style={styles.userBadgeText}>{userName || 'Athlete'}</Text>
              <Edit3 size={11} color={C.zinc} />
            </TouchableOpacity>
          </View>

          {/* Dynamic Personalized Greeting */}
          <Text style={styles.welcomeSub}>Ready for today's session,</Text>
          <Text style={styles.welcomeTitle}>{userName || 'Athlete'}? 👋</Text>

          {/* Today's Target Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroTag}><Text style={styles.heroTagText}>TODAY'S WORKOUT</Text></View>
              <Text style={{ color: C.zinc, fontSize: 12, fontWeight: '700' }}>3 Exercises • 45 Mins</Text>
            </View>

            <Text style={styles.heroTitle}>Push Hypertrophy Day</Text>
            <Text style={styles.heroSub}>Custom-tailored for {userName}'s goal: {userGoal}</Text>

            {/* Quick Metrics */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}><Text style={styles.chipText}>🔥 320 kcal</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>⚡ +250 XP</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>🎯 Chest & Triceps</Text></View>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startWorkout}>
              <Play size={16} color={C.bg} fill={C.bg} />
              <Text style={styles.startBtnText}>Start Workout Session ▶</Text>
            </TouchableOpacity>
          </View>

          {/* 7-Day Gym Split Strip */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Gym Split</Text>
            <Text style={styles.sectionSub}>Phase 1 Roadmap</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {[
              { day: 'Mon', split: 'Push (Chest/Tri)', active: true },
              { day: 'Tue', split: 'Pull (Back/Bi)', active: false },
              { day: 'Wed', split: 'Legs & Core', active: false },
              { day: 'Thu', split: 'Rest / Mobility', active: false },
              { day: 'Fri', split: 'Upper Body', active: false },
              { day: 'Sat', split: 'Lower Body', active: false },
              { day: 'Sun', split: 'Active Recovery', active: false }
            ].map((item, idx) => (
              <View key={idx} style={[styles.dayCard, item.active && styles.dayCardActive]}>
                <Text style={[styles.dayText, item.active && { color: C.white, fontWeight: '900' }]}>{item.day}</Text>
                <Text style={[styles.daySplitText, item.active && { color: C.white }]} numberOfLines={2}>{item.split}</Text>
              </View>
            ))}
          </ScrollView>

          {/* AI Progressive Overload Banner */}
          <View style={styles.aiCoachCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color={C.white} />
              <Text style={{ color: C.white, fontWeight: '900', fontSize: 12 }}>AI VOICE COACH READY</Text>
            </View>
            <Text style={{ color: C.zinc, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
              "Put your headphones on, {userName}! The Audio Coach will guide your cadence (3s lower, hold, explode) hands-free."
            </Text>
          </View>

          {/* Muscle Focus Selector */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Explore by Muscle</Text>
          <View style={styles.categoryRow}>
            {['Chest', 'Back', 'Legs', 'Arms'].map((muscle, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryCard}
                onPress={() => {
                  setSelectedMuscle(muscle);
                  setCurrentTab('exercises');
                }}
              >
                <Dumbbell size={18} color={C.white} />
                <Text style={styles.categoryLabel}>{muscle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 2. WORKOUTS TAB */}
      {/* ======================================================== */}
      {currentTab === 'workouts' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Training Programs</Text>
          <Text style={styles.pageSub}>Structured multi-week programs for {userName}</Text>

          {[
            { title: 'Beginner 3-Day Hypertrophy', sub: '3 days/week • 45 mins • Perfect for newcomers', xp: 200 },
            { title: 'Push / Pull / Legs (PPL)', sub: '6 days/week • 60 mins • Classic muscle builder', xp: 350 },
            { title: 'Upper / Lower Power Split', sub: '4 days/week • 50 mins • Strength & power', xp: 300 }
          ].map((plan, idx) => (
            <View key={idx} style={styles.planCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>+{plan.xp} XP</Text></View>
              </View>
              <Text style={styles.planSub}>{plan.sub}</Text>
              <TouchableOpacity style={styles.planBtn} onPress={startWorkout}>
                <Text style={styles.planBtnText}>Start Routine ▶</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 3. EXERCISE LIBRARY TAB */}
      {/* ======================================================== */}
      {currentTab === 'exercises' && (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
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
                onPress={() => setSelectedExerciseDetail(ex)}
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
      )}

      {/* ======================================================== */}
      {/* 4. PROFILE & PRO SUBSCRIPTION TAB */}
      {/* ======================================================== */}
      {currentTab === 'profile' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Athlete Profile</Text>

          {/* User Card */}
          <View style={styles.planCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={[styles.planTitle, { fontSize: 20 }]}>{userName || 'Athlete'}</Text>
                <Text style={styles.planSub}>Level 12 • {userEmail || 'Firebase Athlete'}</Text>
              </View>
              <TouchableOpacity style={styles.editPill} onPress={() => setAppScreen('ONBOARDING')}>
                <Text style={styles.editPillText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatNum}>14</Text>
                <Text style={styles.profileStatLabel}>Day Streak</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatNum}>24</Text>
                <Text style={styles.profileStatLabel}>Workouts</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatNum}>4,850</Text>
                <Text style={styles.profileStatLabel}>Total XP</Text>
              </View>
            </View>
          </View>

          {/* Pro Subscription Banner */}
          <View style={styles.proCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Crown size={16} color={C.white} />
              <Text style={{ color: C.white, fontWeight: '900', fontSize: 13, letterSpacing: 0.5 }}>LIFT PRO</Text>
            </View>
            <Text style={{ color: C.zinc, fontSize: 12, marginTop: 4 }}>
              Unlock Unlimited 1-on-1 AI Voice Coach, Custom Splits, and Progressive Overload Tracking.
            </Text>
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => setShowPaywall(true)}>
              <Text style={styles.upgradeBtnText}>Start 7-Day Free Trial ⭐</Text>
            </TouchableOpacity>
          </View>

          {/* Personal Records */}
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Personal Records (PRs)</Text>
            <Text style={styles.planSub}>• Bench Press: 70 kg</Text>
            <Text style={styles.planSub}>• Squat: 85 kg</Text>
            <Text style={styles.planSub}>• Pull-Ups: 10 reps</Text>
          </View>

          {/* Log Out Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
            <LogOut size={16} color={C.rose} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 5. PRO SUBSCRIPTION PAYWALL MODAL */}
      {/* ======================================================== */}
      <Modal visible={showPaywall} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 }}>
          <View style={styles.paywallCard}>
            <TouchableOpacity onPress={() => setShowPaywall(false)} style={styles.closeBtn}>
              <X size={18} color={C.white} />
            </TouchableOpacity>

            <View style={styles.crownCircle}>
              <Crown size={28} color={C.bg} />
            </View>

            <Text style={styles.paywallTitle}>Unlock LIFT Pro</Text>
            <Text style={styles.paywallSub}>Your Complete AI Personal Trainer in your pocket</Text>

            <View style={{ gap: 10, marginVertical: 18 }}>
              {[
                'Real-Time Live Voice Coach & Tempo Prompts',
                '3D Medical-Grade Muscle Anatomy Animated GIFs',
                'Smart Progressive Overload Calculator',
                'Exclusive Recovery & Fatigue Tracking'
              ].map((benefit, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Check size={16} color={C.white} />
                  <Text style={{ color: C.zincLight, fontSize: 13, fontWeight: '600' }}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={() => {
                Alert.alert('⭐ Subscribed!', 'Welcome to LIFT Pro. Your 7-day free trial has started.');
                setShowPaywall(false);
              }}
            >
              <Text style={styles.subscribeBtnText}>Start 7-Day Free Trial ($9.99/mo)</Text>
            </TouchableOpacity>
            <Text style={{ color: C.zincDark, fontSize: 11, textAlign: 'center', marginTop: 10 }}>
              Cancel anytime in Apple App Store. No commitment.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ======================================================== */}
      {/* 6. EXERCISE DETAIL MODAL */}
      {/* ======================================================== */}
      <Modal visible={!!selectedExerciseDetail} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          {selectedExerciseDetail && (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => setSelectedExerciseDetail(null)} style={styles.iconCircle}>
                  <ArrowLeft size={18} color={C.white} />
                </TouchableOpacity>
                <View style={styles.badge}><Text style={styles.badgeText}>{selectedExerciseDetail.muscle.toUpperCase()}</Text></View>
              </View>

              <Text style={styles.detailTitle}>{selectedExerciseDetail.name}</Text>
              <Text style={styles.detailEquipment}>{selectedExerciseDetail.equipment}</Text>

              {/* 3D Anatomy GIF & Audio Coach Studio */}
              <ExerciseAudioCoachStudio exercise={selectedExerciseDetail} />

              {/* Mistakes to Avoid */}
              <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Rookie Mistakes to Avoid ⚠️</Text>
              {selectedExerciseDetail.mistakes.map((m, i) => (
                <View key={i} style={styles.mistakeRow}>
                  <AlertTriangle size={14} color={C.white} />
                  <Text style={{ color: C.zincLight, fontSize: 12, flex: 1 }}>{m}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.startBtn, { marginTop: 22 }]}
                onPress={() => {
                  setSelectedExerciseDetail(null);
                  startWorkout();
                }}
              >
                <Text style={styles.startBtnText}>Start This Exercise ▶</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* ======================================================== */}
      {/* 7. GUIDED WORKOUT PLAYER */}
      {/* ======================================================== */}
      <Modal visible={isWorkoutActive} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          {currentWorkoutEx && (
            <View style={{ flex: 1, padding: 18 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setIsWorkoutActive(false)} style={styles.iconCircle}>
                  <X size={18} color={C.white} />
                </TouchableOpacity>
                <Text style={{ fontWeight: '900', color: C.white, fontSize: 15 }}>
                  Exercise {currentExIndex + 1} of {workoutExercises.length}
                </Text>
                <Text style={{ color: C.white, fontWeight: '900' }}>
                  ⏱️ {Math.floor(workoutDuration / 60)}:{String(workoutDuration % 60).padStart(2, '0')}
                </Text>
              </View>

              <ScrollView style={{ flex: 1, marginTop: 10 }}>
                <Text style={[styles.detailTitle, { fontSize: 20 }]}>{currentWorkoutEx.name}</Text>

                {/* Compact Coach Studio */}
                <ExerciseAudioCoachStudio exercise={currentWorkoutEx} compact />

                {/* Sets Logger */}
                <Text style={[styles.sectionTitle, { marginVertical: 10 }]}>Log Sets & Reps</Text>
                {currentWorkoutEx.sets.map((s, idx) => (
                  <View key={idx} style={[styles.setRow, s.done && styles.setRowDone]}>
                    <View style={[styles.setNumPill, s.done && { backgroundColor: C.emerald }]}>
                      <Text style={{ color: C.white, fontWeight: '900', fontSize: 11 }}>{s.num}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: C.white, fontWeight: '700', fontSize: 14 }}>{s.weight} kg</Text>
                      <TouchableOpacity onPress={() => adjustWeight(idx, -2.5)}><Text style={styles.stepBtn}>-</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => adjustWeight(idx, 2.5)}><Text style={styles.stepBtn}>+</Text></TouchableOpacity>
                    </View>
                    <Text style={{ color: C.white, fontWeight: '700', fontSize: 14 }}>{s.reps} reps</Text>
                    <TouchableOpacity
                      style={[styles.checkBtn, s.done && { backgroundColor: C.emerald }]}
                      onPress={() => toggleSetComplete(idx)}
                    >
                      <Check size={16} color={s.done ? C.white : C.zinc} />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Rest Timer Banner */}
                {isResting && (
                  <View style={styles.restBanner}>
                    <Text style={{ color: C.white, fontWeight: '800' }}>⏱️ REST: {restSeconds}s left</Text>
                    <TouchableOpacity onPress={() => setIsResting(false)}>
                      <Text style={{ color: C.white, fontWeight: '900', textDecorationLine: 'underline' }}>Skip</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              {/* Next Button */}
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => {
                  if (currentExIndex < workoutExercises.length - 1) {
                    setCurrentExIndex(prev => prev + 1);
                    setIsResting(false);
                  } else {
                    Alert.alert('🎉 Workout Finished!', `Awesome job, ${userName}! You earned +250 XP!`);
                    setIsWorkoutActive(false);
                  }
                }}
              >
                <Text style={styles.startBtnText}>
                  {currentExIndex < workoutExercises.length - 1 ? 'Next Exercise →' : 'Finish Workout 🎉'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ======================================================== */}
      {/* 8. BOTTOM NAVIGATION BAR */}
      {/* ======================================================== */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <Home size={20} color={currentTab === 'home' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'home' && { color: C.white, fontWeight: '800' }]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('workouts')}>
          <Dumbbell size={20} color={currentTab === 'workouts' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'workouts' && { color: C.white, fontWeight: '800' }]}>Programs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('exercises')}>
          <List size={20} color={currentTab === 'exercises' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'exercises' && { color: C.white, fontWeight: '800' }]}>3D Anatomy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('profile')}>
          <User size={20} color={currentTab === 'profile' ? C.white : C.zincDark} />
          <Text style={[styles.navText, currentTab === 'profile' && { color: C.white, fontWeight: '800' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  userBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  userBadgeText: { color: C.white, fontSize: 11, fontWeight: '800' },
  welcomeSub: { color: C.zinc, fontSize: 13 },
  welcomeTitle: { color: C.white, fontSize: 26, fontWeight: '900', marginBottom: 16 },
  heroCard: { backgroundColor: C.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 22 },
  heroBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  heroTag: { backgroundColor: C.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  heroTagText: { color: C.bg, fontSize: 9, fontWeight: '900' },
  heroTitle: { color: C.white, fontSize: 20, fontWeight: '900', marginTop: 4 },
  heroSub: { color: C.zinc, fontSize: 12, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 6, marginVertical: 14 },
  chip: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  chipText: { color: C.white, fontSize: 11, fontWeight: '600' },
  startBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  startBtnText: { color: C.bg, fontWeight: '900', fontSize: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: C.white, fontSize: 16, fontWeight: '900' },
  sectionSub: { color: C.zinc, fontSize: 11, fontWeight: '700' },
  dayCard: { width: 85, backgroundColor: C.surface, borderRadius: 14, padding: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle, alignItems: 'center' },
  dayCardActive: { borderColor: C.white, backgroundColor: C.surfaceElevated },
  dayText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
  daySplitText: { color: C.zinc, fontSize: 10, marginTop: 4, textAlign: 'center' },
  categoryRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  categoryCard: { flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  categoryLabel: { color: C.white, fontSize: 11, fontWeight: '700', marginTop: 4 },
  aiCoachCard: { backgroundColor: C.surfaceVariant, borderRadius: 16, padding: 14, marginVertical: 10, borderWidth: 1, borderColor: C.border },
  pageTitle: { color: C.white, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  pageSub: { color: C.zinc, fontSize: 12, marginBottom: 14 },
  planCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  planTitle: { color: C.white, fontSize: 16, fontWeight: '800' },
  planSub: { color: C.zinc, fontSize: 12, marginTop: 4 },
  planBtn: { backgroundColor: C.white, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  planBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },
  badge: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  badgeText: { color: C.white, fontSize: 10, fontWeight: '800' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 12, height: 44, marginVertical: 10, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, marginLeft: 8, color: C.white, fontSize: 13 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle },
  filterChipActive: { backgroundColor: C.white, borderColor: C.white },
  filterText: { color: C.zinc, fontSize: 12, fontWeight: '700' },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  exThumb: { width: 58, height: 58, borderRadius: 12, backgroundColor: '#FFFFFF' },
  exName: { color: C.white, fontSize: 14, fontWeight: '700' },
  exMeta: { color: C.zinc, fontSize: 11, marginTop: 2 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  detailTitle: { color: C.white, fontSize: 22, fontWeight: '900' },
  detailEquipment: { color: C.zinc, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  mistakeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surfaceVariant, padding: 10, borderRadius: 10, marginVertical: 4, borderWidth: 1, borderColor: C.border },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, padding: 12, marginVertical: 4, borderWidth: 1, borderColor: C.border },
  setRowDone: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: C.emerald },
  setNumPill: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  stepBtn: { color: C.white, fontSize: 18, fontWeight: '900', paddingHorizontal: 4 },
  checkBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  restBanner: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, borderWidth: 1, borderColor: C.border },
  bottomNav: { flexDirection: 'row', height: 65, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: C.zincDark, fontSize: 10, marginTop: 4, fontWeight: '600' },

  // Coach Studio Styles
  coachCard: { backgroundColor: C.surface, borderRadius: 20, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: C.border },
  viewport: { width: '100%', height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
  viewportCompact: { width: '100%', height: 190, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
  viewportImg: { width: '92%', height: '92%' },
  hudTopBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: C.border },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald },
  hudTopText: { color: C.white, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  audioCoachPill: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.85)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.border },
  audioCoachPillActive: { backgroundColor: C.white },
  audioCoachPillText: { color: C.white, fontSize: 10, fontWeight: '900' },
  speechSubtitleBox: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  cadenceTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 'auto' },
  speechSubtitleText: { color: C.white, fontSize: 12, lineHeight: 17, fontStyle: 'italic' },
  biomechBox: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 10, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  cueItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  cueItemText: { color: C.zincLight, fontSize: 11, fontWeight: '600', flex: 1 },
  muscleMapSection: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.borderSubtle },
  muscleMapTitle: { color: C.white, fontSize: 12, fontWeight: '800', marginBottom: 8 },
  muscleRow: { marginVertical: 4 },
  muscleRowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  muscleName: { color: C.zincLight, fontSize: 11, fontWeight: '700' },
  muscleRole: { color: C.white, fontSize: 10, fontWeight: '800' },
  muscleTrack: { height: 5, backgroundColor: C.surfaceVariant, borderRadius: 3, overflow: 'hidden' },
  muscleFill: { height: '100%', backgroundColor: C.white, borderRadius: 3 },

  // Profile & Paywall Styles
  editPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  editPillText: { color: C.white, fontSize: 11, fontWeight: '700' },
  profileStat: { flex: 1, backgroundColor: C.surfaceVariant, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  profileStatNum: { color: C.white, fontSize: 16, fontWeight: '900' },
  profileStatLabel: { color: C.zinc, fontSize: 10, marginTop: 2 },
  proCard: { backgroundColor: C.surfaceElevated, borderRadius: 16, padding: 16, marginVertical: 10, borderWidth: 1, borderColor: C.border },
  upgradeBtn: { backgroundColor: C.white, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  upgradeBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.surfaceVariant, height: 44, borderRadius: 12, marginTop: 14, borderWidth: 1, borderColor: C.border },
  logoutBtnText: { color: C.rose, fontWeight: '800', fontSize: 13 },

  // Paywall Styles
  paywallCard: { backgroundColor: C.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border },
  closeBtn: { position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  crownCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
  paywallTitle: { color: C.white, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  paywallSub: { color: C.zinc, fontSize: 12, textAlign: 'center', marginTop: 4 },
  subscribeBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  subscribeBtnText: { color: C.bg, fontWeight: '900', fontSize: 14 },

  // 🌟 EXACT STYLING FROM FATIMA'S APK SCREEN (IMAGE 1)
  authContainer: { flex: 1, backgroundColor: C.bg },
  authContentScroll: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 30, alignItems: 'center' },
  authHeader: { marginTop: 10, marginBottom: 20, alignItems: 'center' },
  brandLogoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  liftLogoImg: { width: 120, height: 38 },
  liftLogoImgSmall: { width: 90, height: 28 },

  // Carousel in Image 1
  carouselContainer: { width: width - 44, height: 230, borderRadius: 24, overflow: 'hidden', position: 'relative', backgroundColor: '#111' },
  carouselImg: { width: '100%', height: '100%' },
  carouselOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  galleryBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  galleryBadgeText: { color: C.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  carouselDotsContainer: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6, alignItems: 'center' },
  galleryDot: { height: 4, borderRadius: 2 },
  galleryDotActive: { width: 22, backgroundColor: C.white },
  galleryDotInactive: { width: 5, backgroundColor: 'rgba(255,255,255,0.35)' },

  // Headline in Image 1
  authHeadline: { color: C.white, fontSize: 21, fontWeight: '900', textAlign: 'center', marginTop: 22, marginBottom: 40, lineHeight: 28 },

  // Action Buttons Section in Image 1
  authSectionBox: { width: '100%', gap: 12 },
  authPromptLabel: { color: '#8E8E93', fontSize: 13, textAlign: 'center', marginBottom: 4 },
  primaryAccountBtn: { height: 56, borderRadius: 28, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  accountAvatarCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E4E4E7', justifyContent: 'center', alignItems: 'center' },
  accountBtnText: { color: '#000000', fontSize: 15, fontWeight: '700' },
  secondaryAccountBtn: { height: 56, borderRadius: 28, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.white, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: C.white, fontSize: 15, fontWeight: '700' },
  authFooterRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  authFooterText: { color: '#8E8E93', fontSize: 13, fontWeight: '500' },
  authFooterLink: { color: C.blue, fontSize: 13, fontWeight: '700' },

  // Onboarding Styles
  onboardScroll: { padding: 24, paddingTop: 20 },
  stepHeader: { marginBottom: 20 },
  stepPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: C.borderSubtle, marginBottom: 10 },
  stepPillText: { color: C.white, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  onboardHeading: { color: C.white, fontSize: 26, fontWeight: '900' },
  onboardSubhead: { color: C.zinc, fontSize: 13, marginTop: 6, lineHeight: 18 },
  inputGroup: { marginVertical: 12 },
  inputGroupLabel: { color: C.zinc, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  nameTextInput: { height: 52, backgroundColor: C.surfaceVariant, borderRadius: 14, paddingHorizontal: 16, color: C.white, fontSize: 16, fontWeight: '700', borderWidth: 1.5, borderColor: C.border },
  goalSection: { marginVertical: 10 },
  goalSelectCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surfaceVariant, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: C.borderSubtle },
  goalSelectCardActive: { backgroundColor: C.white, borderColor: C.white },
  goalSelectTitle: { color: C.white, fontSize: 14, fontWeight: '800' },
  goalSelectDesc: { color: C.zinc, fontSize: 11, marginTop: 2 },
  continueBtn: { height: 52, borderRadius: 14, backgroundColor: C.white, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 40 },
  continueBtnText: { color: C.bg, fontSize: 15, fontWeight: '900' },

  // Google & Email Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  googlePickerCard: { backgroundColor: '#131316', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, borderWidth: 1, borderColor: C.border },
  googleHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  googleHeaderTitle: { color: C.white, fontSize: 17, fontWeight: '800', flex: 1 },
  modalCloseBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  googlePromptText: { color: C.zinc, fontSize: 12, marginBottom: 12 },
  googleAccountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surfaceVariant, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.borderSubtle },
  googleAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  accountName: { color: C.white, fontSize: 14, fontWeight: '700' },
  accountEmail: { color: C.zinc, fontSize: 12, marginTop: 1 },
  emailInput: { height: 48, backgroundColor: C.surfaceVariant, borderRadius: 12, paddingHorizontal: 14, color: C.white, fontSize: 14, borderWidth: 1, borderColor: C.border },
  saveProfileBtn: { backgroundColor: C.white, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  saveProfileBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },

  // 💎 LIFT Name Personalization Page Styles (Matching Reference Design)
  namePageContainer: { flex: 1, justifyContent: 'space-between' },
  nameTopBar: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
  nameBackBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2E2E32' },
  nameScrollContent: { paddingHorizontal: 24, alignItems: 'center', paddingTop: 30 },
  nameLogoWrapper: { marginBottom: 32, alignItems: 'center' },
  nameLiftLogo: { width: 140, height: 44, resizeMode: 'contain' },
  nameHeading: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  nameSubhead: { color: '#A1A1AA', fontSize: 14, textAlign: 'center', marginBottom: 36, lineHeight: 20 },
  nameInputContainer: { width: '100%', marginBottom: 20 },
  nameInputField: { width: '100%', height: 56, backgroundColor: '#141414', borderRadius: 16, borderWidth: 1, borderColor: '#2E2E32', paddingHorizontal: 18, color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  nameBottomBar: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
  nameContinueBtn: { width: '100%', height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  nameContinueBtnDisabled: { backgroundColor: '#1E1E22', borderWidth: 1, borderColor: '#2E2E32' },
  nameContinueBtnText: { color: '#000000', fontSize: 16, fontWeight: '900' },
  nameContinueBtnTextDisabled: { color: '#71717A', fontSize: 16, fontWeight: '900' }
});
