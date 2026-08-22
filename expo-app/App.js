import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  LogBox,
  Animated
} from 'react-native';

LogBox.ignoreAllLogs(true);
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
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
  Layers,
  Sparkles
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// High-Tech Obsidian & Electric Violet Theme
const C = {
  bg: '#08070E',
  surface: '#120F22',
  surfaceVariant: '#1B1632',
  surfaceElevated: '#241D44',
  border: '#2E2656',
  borderSubtle: '#1E1938',
  borderGlow: 'rgba(124, 58, 237, 0.5)',
  purple: '#7C3AED',
  purpleDark: '#5B21B6',
  purpleLight: '#A78BFA',
  purpleAccent: '#C4B5FD',
  cyan: '#06B6D4',
  emerald: '#10B981',
  orange: '#F59E0B',
  rose: '#F43F5E',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  muscleInactive: '#211C3D',
  muscleInactiveBorder: '#312A56'
};

// Muscle groups mapping
// 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'glutes', 'hamstrings', 'triceps', 'biceps'
const EXERCISES_DB = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell & Flat Bench',
    tempo: '3-1-1-0 (3s Lower, 1s Pause, 1s Press)',
    defaultView: 'front',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    biomechanics: {
      cue1: 'Elbow Tuck: 45° - 60° (Protects shoulder joints)',
      cue2: 'Bar Path: Controlled J-Curve down to mid-sternum',
      cue3: 'Scapula: Pinched tightly into bench throughout'
    },
    phases: [
      { title: 'Setup & Arch', text: 'Plant feet flat, retract shoulder blades, grip 1.5x shoulder width.' },
      { title: 'Controlled Negative (3s)', text: 'Inhale deep into belly, lower bar slowly to lower chest line.' },
      { title: 'Explosive Press', text: 'Drive feet into floor, press bar up and lock triceps at top.' }
    ],
    muscleLoad: [
      { name: 'Pectoralis Major (Chest)', pct: 95, color: C.purple, type: 'Primary' },
      { name: 'Triceps Brachii', pct: 70, color: C.cyan, type: 'Lockout' },
      { name: 'Anterior Deltoids (Shoulders)', pct: 55, color: C.orange, type: 'Synergist' }
    ],
    mistakes: [
      'Flaring elbows out to 90° (causes extreme rotator cuff impingement)',
      'Bouncing the bar off your ribcage',
      'Lifting your lower back and glutes off the bench'
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
    defaultView: 'front',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    biomechanics: {
      cue1: 'Bench Angle: 30° Optimal (Avoid >45° to prevent shoulder fatigue)',
      cue2: 'Dumbbell Path: Converging upward triangle arc',
      cue3: 'Wrists: Kept neutral directly above elbows'
    },
    phases: [
      { title: 'Kickup & Set', text: 'Kick dumbbells up with knees to shoulder level, pack lats.' },
      { title: 'Deep Stretch (2s)', text: 'Lower weights until thumbs are beside upper chest for maximum stretch.' },
      { title: 'Clavicular Squeeze', text: 'Press dumbbells up without clanging them together at the peak.' }
    ],
    muscleLoad: [
      { name: 'Upper Pectorals (Clavicular Head)', pct: 92, color: C.purple, type: 'Primary' },
      { name: 'Anterior Deltoids', pct: 65, color: C.cyan, type: 'Secondary' },
      { name: 'Triceps', pct: 50, color: C.orange, type: 'Stabilizer' }
    ],
    mistakes: [
      'Setting incline too steep (>45° becomes shoulder press)',
      'Clanging dumbbells at the top (disengages chest tension)',
      'Dropping elbows too low and overstretching shoulders'
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
    defaultView: 'front',
    primaryMuscles: ['legs'],
    secondaryMuscles: ['glutes', 'core'],
    biomechanics: {
      cue1: 'Depth Check: Break parallel (hip crease below knee cap)',
      cue2: 'Knee Tracking: Actively push knees outward over pinky toes',
      cue3: 'Bar Path: Perfectly vertical straight line over midfoot'
    },
    phases: [
      { title: 'Unrack & Shelf', text: 'Create tight trap shelf, 3-step walkout, 360° diaphragmatic brace.' },
      { title: 'Hinge & Sink (3s)', text: 'Push hips back and knees apart, maintaining upright chest angle.' },
      { title: 'Floor Drive', text: 'Drive through midfoot, spreading the floor to stand up tall.' }
    ],
    muscleLoad: [
      { name: 'Quadriceps Femoris', pct: 95, color: C.purple, type: 'Prime Mover' },
      { name: 'Gluteus Maximus', pct: 85, color: C.cyan, type: 'Hip Extensor' },
      { name: 'Erector Spinae & Core', pct: 75, color: C.emerald, type: 'Spinal Shield' }
    ],
    mistakes: [
      'Knees caving inward on ascent (valgus knee collapse)',
      'Heels lifting off floor due to tight ankles',
      'Hips shooting up first turning lift into a good-morning'
    ],
    sets: [
      { num: 1, reps: 8, weight: 70, done: false },
      { num: 2, reps: 8, weight: 75, done: false },
      { num: 3, reps: 6, weight: 80, done: false }
    ]
  },
  {
    id: '4',
    name: 'Lat Pulldown',
    muscle: 'Back',
    equipment: 'Cable Machine & Wide Lat Bar',
    tempo: '2-1-1-1 (1s Hard Squeeze, 2s Full Stretch)',
    defaultView: 'back',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    biomechanics: {
      cue1: 'Torso Angle: Slight 10-15° lean (no excessive swinging)',
      cue2: 'Elbow Drive: Pull elbows down and back toward ribs',
      cue3: 'Scapula: Full elevation stretch at top of rep'
    },
    phases: [
      { title: 'Overhead Hang', text: 'Allow lats to stretch fully with arms extended overhead.' },
      { title: 'Scapular Depression', text: 'Pull shoulder blades down and back before bending elbows.' },
      { title: 'Squeeze to Clavicle', text: 'Drive bar to upper chest, pinching lats for 1 full second.' }
    ],
    muscleLoad: [
      { name: 'Latissimus Dorsi (Lats)', pct: 95, color: C.purple, type: 'Width Driver' },
      { name: 'Rhomboids & Mid-Traps', pct: 70, color: C.cyan, type: 'Retractors' },
      { name: 'Biceps Brachii', pct: 55, color: C.orange, type: 'Synergist' }
    ],
    mistakes: [
      'Swinging whole body back to heave the weight down',
      'Pulling bar behind the neck (dangerous cervical spine load)',
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
    name: 'Standing Overhead Press',
    muscle: 'Shoulders',
    equipment: 'Barbell & Rack',
    tempo: '2-0-1-0 (Controlled Descent, Pure Power)',
    defaultView: 'front',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    biomechanics: {
      cue1: 'Forearms: 100% vertical under bar at start',
      cue2: 'Glute Lock: Squeeze glutes hard to prevent lumbar arching',
      cue3: 'Head Path: Pull chin back, then push head through at top'
    },
    phases: [
      { title: 'Rack Position', text: 'Rest bar on front delts, grip just outside shoulders, lock glutes.' },
      { title: 'Vertical Launch', text: 'Tilt chin back, press bar in straight path clearing nose.' },
      { title: 'Head Through Window', text: 'Push head through arms and lock out barbell directly over spine.' }
    ],
    muscleLoad: [
      { name: 'Anterior & Lateral Deltoids', pct: 95, color: C.purple, type: 'Primary' },
      { name: 'Triceps Brachii', pct: 75, color: C.cyan, type: 'Lockout' },
      { name: 'Core & Upper Traps', pct: 80, color: C.emerald, type: 'Pillar' }
    ],
    mistakes: [
      'Hyperextending lower back to turn it into an incline press',
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
    name: 'Dumbbell Bicep Curl',
    muscle: 'Arms',
    equipment: 'Dumbbells',
    tempo: '2-1-1-0 (2s Lower, 1s Peak Squeeze)',
    defaultView: 'front',
    primaryMuscles: ['biceps', 'arms'],
    secondaryMuscles: ['forearms'],
    biomechanics: {
      cue1: 'Elbow Fixation: Pinned strictly to ribs with zero drift',
      cue2: 'Supination: Rotate pinky fingers high at peak contraction',
      cue3: 'Full Extension: Flex triceps at bottom for complete stretch'
    },
    phases: [
      { title: 'Dead Hang Stretch', text: 'Start with arms fully extended, palms facing thighs.' },
      { title: 'Supinating Curl', text: 'Curl weight up while rotating palms up (pinkies pointing high).' },
      { title: 'Peak Squeeze (1s)', text: 'Hold hard contraction at top without letting elbows move forward.' }
    ],
    muscleLoad: [
      { name: 'Biceps Brachii (Short & Long Head)', pct: 95, color: C.purple, type: 'Peak Target' },
      { name: 'Brachialis & Forearms', pct: 65, color: C.cyan, type: 'Grip & Armor' }
    ],
    mistakes: [
      'Swinging hips or rocking back to cheat the weight up',
      'Letting elbows flare forward (shifts load onto shoulders)',
      'Short half-reps without full bottom extension'
    ],
    sets: [
      { num: 1, reps: 12, weight: 12.5, done: false },
      { num: 2, reps: 12, weight: 12.5, done: false },
      { num: 3, reps: 10, weight: 15, done: false }
    ]
  },
  {
    id: '7',
    name: 'Tricep Rope Pushdown',
    muscle: 'Arms',
    equipment: 'Cable Machine & Rope Attachment',
    tempo: '2-1-1-0 (2s Eccentric, 1s Lockout Squeeze)',
    defaultView: 'back',
    primaryMuscles: ['triceps', 'arms'],
    secondaryMuscles: ['shoulders'],
    biomechanics: {
      cue1: 'Elbows: Locked in place like door hinges at your sides',
      cue2: 'Rope Separation: Spread ends wide apart past your thighs',
      cue3: 'Posture: Slight athletic hinge from hips with rigid core'
    },
    phases: [
      { title: '90° Starting Angle', text: 'Forearms at 90°, upper arms pinned to torso.' },
      { title: 'Pushdown & Flare', text: 'Push down smoothly, then flare the rope ends wide apart at bottom.' },
      { title: 'Horseshoe Lockout', text: 'Squeeze triceps violently for 1 full second before 2s return.' }
    ],
    muscleLoad: [
      { name: 'Triceps Lateral & Medial Heads', pct: 95, color: C.purple, type: 'Horseshoe Target' },
      { name: 'Anconeus & Forearms', pct: 45, color: C.cyan, type: 'Stabilizer' }
    ],
    mistakes: [
      'Leaning your entire body weight over the rope',
      'Allowing elbows to swing backward during the negative',
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
    name: 'Romanian Deadlift (RDL)',
    muscle: 'Legs',
    equipment: 'Barbell & Plates',
    tempo: '3-1-1-0 (3s Hip Hinge, 1s Glute Squeeze)',
    defaultView: 'back',
    primaryMuscles: ['hamstrings', 'glutes', 'legs'],
    secondaryMuscles: ['back', 'core'],
    biomechanics: {
      cue1: 'Hip Hinge: Push hips straight backward like closing a door',
      cue2: 'Knee Bend: Soft 15° bend (this is a hinge, not a squat)',
      cue3: 'Bar Shave: Bar stays in continuous contact with thighs & shins'
    },
    phases: [
      { title: 'Soft Knee Hinge', text: 'Unlock knees slightly, send hips back with rigid flat spine.' },
      { title: 'Hamstring Loading (3s)', text: 'Lower bar down shins until deep hamstring stretch is felt.' },
      { title: 'Glute Squeeze Forward', text: 'Drive hips forcefully forward into bar, locking glutes at top.' }
    ],
    muscleLoad: [
      { name: 'Hamstrings (Biceps Femoris)', pct: 95, color: C.purple, type: 'Prime Target' },
      { name: 'Gluteus Maximus', pct: 90, color: C.cyan, type: 'Hip Extensor' },
      { name: 'Erector Spinae & Lats', pct: 80, color: C.emerald, type: 'Spinal Shield' }
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
// 🌟 NEON 3D ANATOMICAL BODY VECTOR ENGINE
// =========================================================================
function MuscleAnatomyView({
  exercise,
  viewMode = 'front', // 'front' | 'back'
  pulseAnimValue,
  size = 260
}) {
  const isPrimary = (group) => exercise.primaryMuscles.includes(group);
  const isSecondary = (group) => exercise.secondaryMuscles.includes(group);

  const getMuscleStyle = (group) => {
    if (isPrimary(group)) {
      return { fill: 'url(#primaryGlow)', stroke: C.purpleLight, strokeWidth: 1.5 };
    }
    if (isSecondary(group)) {
      return { fill: 'url(#secondaryGlow)', stroke: C.cyan, strokeWidth: 1.2 };
    }
    return { fill: C.muscleInactive, stroke: C.muscleInactiveBorder, strokeWidth: 0.8 };
  };

  const scale = size / 320;

  return (
    <View style={{ width: size, height: size * 1.05, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size * 1.05} viewBox="0 0 200 320">
        <Defs>
          {/* Primary Muscle Glow (Electric Violet) */}
          <SvgGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#6D28D9" stopOpacity="0.95" />
          </SvgGradient>

          {/* Secondary Muscle Glow (Cyan) */}
          <SvgGradient id="secondaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#0891B2" stopOpacity="0.9" />
          </SvgGradient>

          {/* Core Body Silhouette Glow */}
          <SvgGradient id="neutralBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E1938" />
            <Stop offset="100%" stopColor="#131024" />
          </SvgGradient>
        </Defs>

        {viewMode === 'front' ? (
          /* ================= ANTERIOR (FRONT VIEW) ================= */
          <G id="frontBody">
            {/* Head & Neck */}
            <Circle cx="100" cy="22" r="13" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
            <Path d="M 94 35 L 106 35 L 108 44 L 92 44 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />

            {/* Trapezius (Front) */}
            <Path d="M 92 44 L 78 52 L 84 60 L 94 46 Z" {...getMuscleStyle('back')} />
            <Path d="M 108 44 L 122 52 L 116 60 L 106 46 Z" {...getMuscleStyle('back')} />

            {/* Shoulders (Deltoids) */}
            <Path d="M 73 51 C 60 56, 54 68, 54 77 C 62 76, 70 72, 74 65 Z" {...getMuscleStyle('shoulders')} />
            <Path d="M 127 51 C 140 56, 146 68, 146 77 C 138 76, 130 72, 126 65 Z" {...getMuscleStyle('shoulders')} />

            {/* Chest (Pectoralis Major) */}
            <Path d="M 76 56 C 88 56, 98 57, 98 77 C 88 80, 75 76, 73 66 Z" {...getMuscleStyle('chest')} />
            <Path d="M 124 56 C 112 56, 102 57, 102 77 C 112 80, 125 76, 127 66 Z" {...getMuscleStyle('chest')} />

            {/* Biceps */}
            <Path d="M 54 79 C 50 90, 50 102, 54 110 C 62 108, 64 96, 66 80 Z" {...getMuscleStyle('biceps')} />
            <Path d="M 146 79 C 150 90, 150 102, 146 110 C 138 108, 136 96, 134 80 Z" {...getMuscleStyle('biceps')} />

            {/* Forearms */}
            <Path d="M 53 113 C 44 126, 42 142, 47 154 C 54 152, 60 138, 62 114 Z" {...getMuscleStyle('arms')} />
            <Path d="M 147 113 C 156 126, 158 142, 153 154 C 146 152, 140 138, 138 114 Z" {...getMuscleStyle('arms')} />

            {/* Hands */}
            <Circle cx="44" cy="162" r="5" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
            <Circle cx="156" cy="162" r="5" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />

            {/* Core / Abdominals */}
            <Path d="M 86 82 L 98 82 L 98 94 L 86 94 Z" {...getMuscleStyle('core')} />
            <Path d="M 102 82 L 114 82 L 114 94 L 102 94 Z" {...getMuscleStyle('core')} />
            <Path d="M 87 97 L 98 97 L 98 109 L 87 109 Z" {...getMuscleStyle('core')} />
            <Path d="M 102 97 L 113 97 L 113 109 L 102 109 Z" {...getMuscleStyle('core')} />
            <Path d="M 88 112 L 98 112 L 98 126 L 88 126 Z" {...getMuscleStyle('core')} />
            <Path d="M 102 112 L 112 112 L 112 126 L 102 126 Z" {...getMuscleStyle('core')} />

            {/* Obliques */}
            <Path d="M 72 82 C 84 84, 85 106, 85 124 C 76 118, 72 102, 70 86 Z" {...getMuscleStyle('core')} />
            <Path d="M 128 82 C 116 84, 115 106, 115 124 C 124 118, 128 102, 130 86 Z" {...getMuscleStyle('core')} />

            {/* Hips / Groin */}
            <Path d="M 86 128 L 114 128 L 118 144 L 82 144 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />

            {/* Quads (Left & Right) */}
            <Path d="M 81 146 C 96 146, 95 186, 92 210 C 76 210, 68 178, 71 154 Z" {...getMuscleStyle('legs')} />
            <Path d="M 119 146 C 104 146, 105 186, 108 210 C 124 210, 132 178, 129 154 Z" {...getMuscleStyle('legs')} />

            {/* Knees */}
            <Circle cx="83" cy="218" r="5" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
            <Circle cx="117" cy="218" r="5" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />

            {/* Calves (Front Tibialis) */}
            <Path d="M 76 226 C 90 228, 88 266, 85 288 C 76 288, 72 264, 74 236 Z" {...getMuscleStyle('legs')} />
            <Path d="M 124 226 C 110 228, 112 266, 115 288 C 124 288, 128 264, 126 236 Z" {...getMuscleStyle('legs')} />

            {/* Feet */}
            <Path d="M 74 291 L 86 291 L 83 303 L 70 303 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
            <Path d="M 126 291 L 114 291 L 117 303 L 130 303 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
          </G>
        ) : (
          /* ================= POSTERIOR (BACK VIEW) ================= */
          <G id="backBody">
            {/* Head & Neck */}
            <Circle cx="100" cy="22" r="13" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
            <Path d="M 94 35 L 106 35 L 108 44 L 92 44 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />

            {/* Upper Trapezius (Diamond) */}
            <Path d="M 88 38 L 100 48 L 112 38 L 126 54 L 100 70 L 74 54 Z" {...getMuscleStyle('back')} />

            {/* Rear Deltoids */}
            <Path d="M 72 52 C 58 56, 54 68, 54 77 C 62 76, 70 72, 74 65 Z" {...getMuscleStyle('shoulders')} />
            <Path d="M 128 52 C 142 56, 146 68, 146 77 C 138 76, 130 72, 126 65 Z" {...getMuscleStyle('shoulders')} />

            {/* Triceps */}
            <Path d="M 54 79 C 50 90, 50 102, 54 110 C 62 108, 64 96, 66 80 Z" {...getMuscleStyle('triceps')} />
            <Path d="M 146 79 C 150 90, 150 102, 146 110 C 138 108, 136 96, 134 80 Z" {...getMuscleStyle('triceps')} />

            {/* Lats (Latissimus Dorsi Wings) */}
            <Path d="M 76 72 C 96 74, 98 104, 96 122 C 82 116, 74 98, 72 78 Z" {...getMuscleStyle('back')} />
            <Path d="M 124 72 C 104 74, 102 104, 104 122 C 118 116, 126 98, 128 78 Z" {...getMuscleStyle('back')} />

            {/* Lower Back / Spinal Erectors */}
            <Path d="M 88 118 L 112 118 L 110 144 L 90 144 Z" {...getMuscleStyle('back')} />

            {/* Forearms (Back) */}
            <Path d="M 53 113 C 44 126, 42 142, 47 154 C 54 152, 60 138, 62 114 Z" {...getMuscleStyle('arms')} />
            <Path d="M 147 113 C 156 126, 158 142, 153 154 C 146 152, 140 138, 138 114 Z" {...getMuscleStyle('arms')} />

            {/* Glutes (Gluteus Maximus) */}
            <Path d="M 76 146 C 98 146, 96 182, 94 186 C 74 186, 68 168, 72 152 Z" {...getMuscleStyle('glutes')} />
            <Path d="M 124 146 C 102 146, 104 182, 106 186 C 126 186, 132 168, 128 152 Z" {...getMuscleStyle('glutes')} />

            {/* Hamstrings */}
            <Path d="M 74 188 C 94 188, 92 228, 88 232 C 74 232, 68 214, 70 196 Z" {...getMuscleStyle('hamstrings')} />
            <Path d="M 126 188 C 106 188, 108 228, 112 232 C 126 232, 132 214, 130 196 Z" {...getMuscleStyle('hamstrings')} />

            {/* Calves (Gastrocnemius Diamond) */}
            <Path d="M 74 236 C 92 236, 88 274, 85 288 C 74 288, 68 266, 70 244 Z" {...getMuscleStyle('legs')} />
            <Path d="M 126 236 C 108 236, 112 274, 115 288 C 126 288, 132 266, 130 244 Z" {...getMuscleStyle('legs')} />

            {/* Feet */}
            <Path d="M 74 291 L 86 291 L 83 303 L 70 303 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
            <Path d="M 126 291 L 114 291 L 117 303 L 130 303 Z" fill="url(#neutralBody)" stroke={C.muscleInactiveBorder} strokeWidth="1" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =========================================================================
// ⚡ NEON 3D ANATOMY STUDIO CARD
// =========================================================================
function ExerciseNeonStudio({ exercise, compact = false }) {
  const [viewAngle, setViewAngle] = useState(exercise.defaultView || 'front');
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [isCadenceActive, setIsCadenceActive] = useState(true);
  const [cadenceSecond, setCadenceSecond] = useState(3); // 3-2-1 Eccentric, 0 = Drive!
  const [cadenceLabel, setCadenceLabel] = useState('LOWER (3s)');

  // Dynamic Rep Cadence Pulse Timer
  useEffect(() => {
    let timer;
    if (isCadenceActive) {
      timer = setInterval(() => {
        setCadenceSecond((prev) => {
          if (prev > 1) {
            setCadenceLabel(`LOWER (${prev - 1}s)`);
            return prev - 1;
          } else if (prev === 1) {
            setCadenceLabel('PAUSE / STRETCH');
            return 0;
          } else {
            setCadenceLabel('EXPLOSIVE DRIVE! ⚡');
            return 3;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCadenceActive]);

  return (
    <View style={styles.studioCard}>
      {/* Studio Header & View Flip */}
      <View style={styles.studioHeaderRow}>
        <View style={styles.neonBadge}>
          <Sparkles size={12} color={C.purpleLight} />
          <Text style={styles.neonBadgeText}>3D ANATOMICAL ENGINE</Text>
        </View>

        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() => setViewAngle(viewAngle === 'front' ? 'back' : 'front')}
        >
          <RotateCw size={13} color="#FFF" />
          <Text style={styles.flipBtnText}>
            {viewAngle === 'front' ? 'FLIP TO BACK 🔄' : 'FLIP TO FRONT 🔄'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Anatomy Viewport with HUD */}
      <View style={compact ? styles.viewportCompact : styles.viewport}>
        {/* Glow Radial Backdrop */}
        <View style={styles.glowBackdrop} />

        {/* Anatomical Human Blueprint */}
        <MuscleAnatomyView
          exercise={exercise}
          viewMode={viewAngle}
          size={compact ? 200 : 250}
        />

        {/* View Perspective Badge */}
        <View style={styles.hudPerspectiveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.hudPerspectiveText}>
            {viewAngle === 'front' ? 'ANTERIOR (FRONT VIEW)' : 'POSTERIOR (BACK VIEW)'}
          </Text>
        </View>

        {/* Rep Cadence Dynamic Pulse Pill */}
        <TouchableOpacity
          style={styles.cadencePill}
          onPress={() => setIsCadenceActive(!isCadenceActive)}
        >
          <Zap size={13} color={C.cyan} />
          <Text style={styles.cadencePillText}>TEMPO: {cadenceLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Target Muscle Load Legend */}
      <View style={styles.muscleLegendRow}>
        {exercise.muscleLoad.map((m, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: m.color }]} />
            <Text style={styles.legendText}>
              {m.name.split(' ')[0]} ({m.pct}%)
            </Text>
          </View>
        ))}
      </View>

      {/* Biomechanical Cues Breakdown */}
      <View style={styles.biomechBox}>
        <View style={styles.cueItemRow}>
          <Activity size={13} color={C.cyan} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.cue1}</Text>
        </View>
        <View style={styles.cueItemRow}>
          <Activity size={13} color={C.purpleAccent} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.cue2}</Text>
        </View>
      </View>

      {/* Step-by-Step Form Stepper */}
      <View style={styles.phaseStepperContainer}>
        <View style={styles.phaseHeaderRow}>
          <Text style={styles.phaseHeaderTitle}>EXECUTION CHECKPOINTS</Text>
          <Text style={styles.tempoSub}>{exercise.tempo}</Text>
        </View>

        <View style={styles.phaseChipsRow}>
          {exercise.phases.map((p, idx) => {
            const isSelected = activePhaseIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.phaseChip, isSelected && styles.phaseChipActive]}
                onPress={() => setActivePhaseIdx(idx)}
              >
                <Text style={[styles.phaseNum, isSelected && { color: '#FFF' }]}>{idx + 1}</Text>
                <Text style={[styles.phaseChipLabel, isSelected && { color: '#FFF' }]} numberOfLines={1}>
                  {p.title.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Phase Card */}
        <View style={styles.activePhaseCard}>
          <Text style={styles.activePhaseTitle}>
            Step {activePhaseIdx + 1}: {exercise.phases[activePhaseIdx]?.title}
          </Text>
          <Text style={styles.activePhaseDesc}>
            {exercise.phases[activePhaseIdx]?.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 🚀 MAIN APPLICATION
// =========================================================================
export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null);

  // Active Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState(EXERCISES_DB.slice(0, 3));
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  // Rest Timer
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

  // Workout Duration Clock
  useEffect(() => {
    let timer;
    if (isWorkoutActive) {
      timer = setInterval(() => setWorkoutDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutActive]);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ======================================================== */}
      {/* 1. HOME TAB */}
      {/* ======================================================== */}
      {currentTab === 'home' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Brand Header */}
          <View style={styles.headerRow}>
            <View style={styles.brandPill}>
              <Text style={{ color: C.purpleAccent, fontWeight: '900', fontSize: 13 }}>⚡ FITPULSE 3D</Text>
            </View>
            <View style={styles.streakBadge}>
              <Flame size={14} color={C.orange} />
              <Text style={styles.streakText}>14 Days Streak</Text>
            </View>
          </View>

          <Text style={styles.welcomeSub}>Smart Hypertrophy Program</Text>
          <Text style={styles.welcomeTitle}>Push Day — Chest & Triceps</Text>

          {/* Today's Target Hero Card */}
          <LinearGradient
            colors={['#241B48', '#110D24']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroTag}><Text style={styles.heroTagText}>NEON ANATOMY GUIDED</Text></View>
              <Text style={{ color: C.cyan, fontSize: 12, fontWeight: '800' }}>3 Exercises • 45 Mins</Text>
            </View>

            <Text style={styles.heroTitle}>Push Hypertrophy Level 1</Text>
            <Text style={styles.heroSub}>3D muscle vector highlighting • Guided set tempos</Text>

            {/* Quick Stats Chips */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}><Text style={styles.chipText}>🔥 320 kcal</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>⚡ +250 XP</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>🎯 Chest & Arms</Text></View>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startWorkout}>
              <Play size={16} color="#FFF" fill="#FFF" />
              <Text style={styles.startBtnText}>Start Workout Session ▶</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* 7-Day Gym Split Roadmap */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Gym Split</Text>
            <Text style={styles.sectionSub}>Phase 1</Text>
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
                <Text style={[styles.dayText, item.active && { color: C.purpleAccent, fontWeight: '900' }]}>{item.day}</Text>
                <Text style={styles.daySplitText} numberOfLines={2}>{item.split}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Interactive Muscle Group Explorer */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Interactive Muscle Explorer</Text>
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
                <Dumbbell size={20} color={C.purpleAccent} />
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
          <Text style={styles.pageTitle}>Workout Routines</Text>
          <Text style={styles.pageSub}>Full 3D anatomy breakdowns for each training split</Text>

          {[
            { title: 'Beginner 3-Day Full Body', sub: '3 days/week • 45 mins • Perfect for newcomers', xp: 200 },
            { title: 'Push / Pull / Legs (PPL)', sub: '6 days/week • 60 mins • Hypertrophy classic', xp: 350 },
            { title: 'Upper / Lower Strength Split', sub: '4 days/week • 50 mins • Strength & power', xp: 300 }
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
      {/* 3. 3D ANATOMY EXERCISES LIBRARY */}
      {/* ======================================================== */}
      {currentTab === 'exercises' && (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
          <Text style={styles.pageTitle}>3D Muscle Anatomy Library</Text>
          <Text style={styles.pageSub}>Inspect muscle activation, joint angles & execution form</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={16} color={C.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by exercise or muscle..."
              placeholderTextColor={C.textSecondary}
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
                <Text style={[styles.filterText, selectedMuscle === muscle && { color: '#FFF' }]}>{muscle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Exercises List */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
            {filteredExercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.exCard}
                onPress={() => setSelectedExerciseDetail(ex)}
              >
                {/* Mini Vector Thumbnail */}
                <View style={styles.exThumbBox}>
                  <MuscleAnatomyView exercise={ex} viewMode={ex.defaultView || 'front'} size={48} />
                </View>

                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exMeta}>{ex.muscle} • {ex.equipment}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <Sparkles size={10} color={C.cyan} />
                    <Text style={{ color: C.cyan, fontSize: 10, fontWeight: '800' }}>3D ANATOMY & CUES</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={C.textSecondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ======================================================== */}
      {/* 4. PROFILE TAB */}
      {/* ======================================================== */}
      {currentTab === 'profile' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Profile & Records</Text>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Alex Vance</Text>
            <Text style={styles.planSub}>Level 12 • Iron Builder • 14 Day Streak</Text>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>Personal Records (PRs)</Text>
            <Text style={styles.planSub}>• Bench Press: 70 kg</Text>
            <Text style={styles.planSub}>• Squat: 85 kg</Text>
            <Text style={styles.planSub}>• Pull-Ups: 10 reps</Text>
          </View>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 5. 3D EXERCISE DETAIL MODAL */}
      {/* ======================================================== */}
      <Modal visible={!!selectedExerciseDetail} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          {selectedExerciseDetail && (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => setSelectedExerciseDetail(null)} style={styles.iconCircle}>
                  <ArrowLeft size={18} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.badge}><Text style={styles.badgeText}>{selectedExerciseDetail.muscle.toUpperCase()}</Text></View>
              </View>

              <Text style={styles.detailTitle}>{selectedExerciseDetail.name}</Text>
              <Text style={styles.detailEquipment}>{selectedExerciseDetail.equipment}</Text>

              {/* Interactive Neon 3D Studio */}
              <ExerciseNeonStudio exercise={selectedExerciseDetail} />

              {/* Mistakes to Avoid */}
              <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Rookie Mistakes to Avoid ⚠️</Text>
              {selectedExerciseDetail.mistakes.map((m, i) => (
                <View key={i} style={styles.mistakeRow}>
                  <AlertTriangle size={14} color={C.rose} />
                  <Text style={{ color: '#FDA4AF', fontSize: 12, flex: 1 }}>{m}</Text>
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
      {/* 6. GUIDED WORKOUT PLAYER (NEON ANATOMY + SET LOGGER) */}
      {/* ======================================================== */}
      <Modal visible={isWorkoutActive} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          {currentWorkoutEx && (
            <View style={{ flex: 1, padding: 18 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setIsWorkoutActive(false)} style={styles.iconCircle}>
                  <X size={18} color="#FFF" />
                </TouchableOpacity>
                <Text style={{ fontWeight: '900', color: '#FFF', fontSize: 15 }}>
                  Exercise {currentExIndex + 1} of {workoutExercises.length}
                </Text>
                <Text style={{ color: C.cyan, fontWeight: '900' }}>
                  ⏱️ {Math.floor(workoutDuration / 60)}:{String(workoutDuration % 60).padStart(2, '0')}
                </Text>
              </View>

              <ScrollView style={{ flex: 1, marginTop: 10 }}>
                <Text style={[styles.detailTitle, { fontSize: 20 }]}>{currentWorkoutEx.name}</Text>

                {/* Compact Anatomy Studio for Live Workout */}
                <ExerciseNeonStudio exercise={currentWorkoutEx} compact />

                {/* Sets Logger */}
                <Text style={[styles.sectionTitle, { marginVertical: 10 }]}>Log Sets & Reps</Text>
                {currentWorkoutEx.sets.map((s, idx) => (
                  <View key={idx} style={[styles.setRow, s.done && styles.setRowDone]}>
                    <View style={[styles.setNumPill, s.done && { backgroundColor: C.emerald }]}>
                      <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 11 }}>{s.num}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{s.weight} kg</Text>
                      <TouchableOpacity onPress={() => adjustWeight(idx, -2.5)}><Text style={styles.stepBtn}>-</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => adjustWeight(idx, 2.5)}><Text style={styles.stepBtn}>+</Text></TouchableOpacity>
                    </View>
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{s.reps} reps</Text>
                    <TouchableOpacity
                      style={[styles.checkBtn, s.done && { backgroundColor: C.emerald }]}
                      onPress={() => toggleSetComplete(idx)}
                    >
                      <Check size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Rest Timer Banner */}
                {isResting && (
                  <View style={styles.restBanner}>
                    <Text style={{ color: '#FFF', fontWeight: '800' }}>⏱️ REST: {restSeconds}s left</Text>
                    <TouchableOpacity onPress={() => setIsResting(false)}>
                      <Text style={{ color: C.cyan, fontWeight: '900' }}>Skip</Text>
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
                    Alert.alert('🎉 Workout Finished!', 'Awesome session! You earned +250 XP!');
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
      {/* 7. BOTTOM NAVIGATION BAR */}
      {/* ======================================================== */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <Home size={20} color={currentTab === 'home' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'home' && { color: C.purpleAccent }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('workouts')}>
          <Dumbbell size={20} color={currentTab === 'workouts' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'workouts' && { color: C.purpleAccent }]}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('exercises')}>
          <List size={20} color={currentTab === 'exercises' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'exercises' && { color: C.purpleAccent }]}>Anatomy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('profile')}>
          <User size={20} color={currentTab === 'profile' ? C.purpleAccent : C.textSecondary} />
          <Text style={[styles.navText, currentTab === 'profile' && { color: C.purpleAccent }]}>Profile</Text>
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
  brandPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: C.borderSubtle },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakText: { color: C.orange, fontSize: 11, fontWeight: '800' },
  welcomeSub: { color: C.textSecondary, fontSize: 13 },
  welcomeTitle: { color: C.textPrimary, fontSize: 24, fontWeight: '900', marginBottom: 16 },
  heroCard: { borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: C.borderGlow, marginBottom: 22 },
  heroBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  heroTag: { backgroundColor: C.purple, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  heroTagText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  heroTitle: { color: C.textPrimary, fontSize: 19, fontWeight: '900', marginTop: 4 },
  heroSub: { color: C.textSecondary, fontSize: 12, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 6, marginVertical: 14 },
  chip: { backgroundColor: C.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  chipText: { color: C.textPrimary, fontSize: 11 },
  startBtn: { backgroundColor: C.purple, height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  startBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: C.textPrimary, fontSize: 16, fontWeight: '900' },
  sectionSub: { color: C.purpleAccent, fontSize: 11, fontWeight: '700' },
  dayCard: { width: 85, backgroundColor: C.surface, borderRadius: 14, padding: 10, marginRight: 8, borderWidth: 1, borderColor: C.borderSubtle, alignItems: 'center' },
  dayCardActive: { borderColor: C.purple, backgroundColor: 'rgba(124, 58, 237, 0.2)' },
  dayText: { color: C.textSecondary, fontSize: 12, fontWeight: '700' },
  daySplitText: { color: C.textPrimary, fontSize: 10, marginTop: 4, textAlign: 'center' },
  categoryRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  categoryCard: { flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  categoryLabel: { color: C.textPrimary, fontSize: 11, fontWeight: '700', marginTop: 4 },
  pageTitle: { color: C.textPrimary, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  pageSub: { color: C.textSecondary, fontSize: 12, marginBottom: 14 },
  planCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.borderSubtle },
  planTitle: { color: C.textPrimary, fontSize: 16, fontWeight: '800' },
  planSub: { color: C.textSecondary, fontSize: 12, marginTop: 4 },
  planBtn: { backgroundColor: C.surfaceElevated, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  planBtnText: { color: C.purpleAccent, fontWeight: '800', fontSize: 13 },
  badge: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: C.purpleAccent, fontSize: 10, fontWeight: '800' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 12, height: 44, marginVertical: 10, borderWidth: 1, borderColor: C.borderSubtle },
  searchInput: { flex: 1, marginLeft: 8, color: '#FFF', fontSize: 13 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 10, marginRight: 8 },
  filterChipActive: { backgroundColor: C.purple },
  filterText: { color: C.textSecondary, fontSize: 12, fontWeight: '700' },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: C.borderSubtle },
  exThumbBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: C.borderSubtle },
  exName: { color: C.textPrimary, fontSize: 14, fontWeight: '700' },
  exMeta: { color: C.purpleAccent, fontSize: 11, marginTop: 2 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  detailTitle: { color: C.textPrimary, fontSize: 22, fontWeight: '900' },
  detailEquipment: { color: C.purpleAccent, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  mistakeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', padding: 10, borderRadius: 10, marginVertical: 4, borderWidth: 1, borderColor: 'rgba(244, 63, 94, 0.25)' },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, padding: 12, marginVertical: 4, borderWidth: 1, borderColor: C.borderSubtle },
  setRowDone: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: C.emerald },
  setNumPill: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  stepBtn: { color: C.cyan, fontSize: 18, fontWeight: '900', paddingHorizontal: 4 },
  checkBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  restBanner: { backgroundColor: '#20163B', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, borderWidth: 1, borderColor: C.cyan },
  bottomNav: { flexDirection: 'row', height: 65, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.borderSubtle, position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: C.textSecondary, fontSize: 10, marginTop: 4, fontWeight: '600' },

  // Neon Studio Styles
  studioCard: { backgroundColor: C.surface, borderRadius: 20, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: C.borderGlow },
  studioHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  neonBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  neonBadgeText: { color: C.purpleAccent, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  flipBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.purple, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  flipBtnText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  viewport: { width: '100%', height: 270, borderRadius: 16, backgroundColor: '#0B0916', position: 'relative', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle, overflow: 'hidden' },
  viewportCompact: { width: '100%', height: 215, borderRadius: 16, backgroundColor: '#0B0916', position: 'relative', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle, overflow: 'hidden' },
  glowBackdrop: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(124, 58, 237, 0.12)' },
  hudPerspectiveBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(18, 15, 34, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: C.borderSubtle },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald },
  hudPerspectiveText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  cadencePill: { position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: 'rgba(18, 15, 34, 0.9)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.4)' },
  cadencePillText: { color: C.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  muscleLegendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: C.textPrimary, fontSize: 10, fontWeight: '700' },
  biomechBox: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 10, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  cueItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  cueItemText: { color: C.textSecondary, fontSize: 11, fontWeight: '600', flex: 1 },
  phaseStepperContainer: { marginTop: 12 },
  phaseHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  phaseHeaderTitle: { color: C.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  tempoSub: { color: C.cyan, fontSize: 10, fontWeight: '800' },
  phaseChipsRow: { flexDirection: 'row', gap: 6 },
  phaseChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  phaseChipActive: { backgroundColor: 'rgba(124, 58, 237, 0.35)', borderColor: C.purple },
  phaseNum: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.surfaceElevated, textAlign: 'center', color: C.textSecondary, fontSize: 10, fontWeight: '900', lineHeight: 16 },
  phaseChipLabel: { color: C.textSecondary, fontSize: 10, fontWeight: '700', flex: 1 },
  activePhaseCard: { backgroundColor: C.surfaceElevated, padding: 10, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: C.borderSubtle },
  activePhaseTitle: { color: C.purpleAccent, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  activePhaseDesc: { color: C.textPrimary, fontSize: 11, lineHeight: 16 }
});
