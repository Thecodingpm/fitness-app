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
  Image,
  Alert,
  Modal,
  LogBox
} from 'react-native';

LogBox.ignoreAllLogs(true);
import { LinearGradient } from 'expo-linear-gradient';
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
  Eye,
  RotateCw,
  Compass,
  Zap,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Obsidian & Electric Violet High-Tech Palette
const C = {
  bg: '#08070E',
  surface: '#131022',
  surfaceVariant: '#1B1630',
  surfaceElevated: '#251D42',
  border: '#2E2652',
  borderSubtle: '#1F1A38',
  borderGlow: 'rgba(124, 58, 237, 0.4)',
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
  textTertiary: '#64748B'
};

const EXERCISES_DB = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell & Flat Bench',
    tempo: '3-1-1-0 (3s Lower, 1s Pause, 1s Press)',
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Elbow Flare: 45° - 60° (Protects Rotator Cuff)',
      barPath: 'Bar Path: Slight J-Curve to Mid-Nipple Line',
      footwork: 'Footwork: Heels Planted, Active Leg Drive'
    },
    phases: [
      {
        title: 'Phase 1: Setup & Retraction',
        cue: 'Pinch shoulder blades together into bench, grip 1.5x shoulder width, brace core.'
      },
      {
        title: 'Phase 2: 3-Second Descent',
        cue: 'Inhale into diaphragm, lower bar smoothly to sternum keeping forearms vertical.'
      },
      {
        title: 'Phase 3: Explosive Drive',
        cue: 'Drive through heels, press bar upward while squeezing chest at lockout.'
      }
    ],
    muscles: [
      { name: 'Pectoralis Major', pct: 95, role: 'Primary Driver', color: C.purple },
      { name: 'Triceps Brachii', pct: 70, role: 'Lockout Driver', color: C.cyan },
      { name: 'Anterior Deltoids', pct: 55, role: 'Synergist', color: C.orange }
    ],
    mistakes: [
      'Flaring elbows out to 90° (causes extreme shoulder impingement)',
      'Bouncing bar violently off sternum',
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
    equipment: 'Dumbbells & Incline Bench (30°)',
    tempo: '2-1-1-0 (2s Lower, 1s Stretch, 1s Press)',
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Bench Angle: 30° Optimal for Clavicular Head',
      barPath: 'Dumbbell Arc: Converging path at peak',
      footwork: 'Wrists Stacked over Elbows throughout'
    },
    phases: [
      {
        title: 'Phase 1: Position & Incline',
        cue: 'Set bench to 30°, kick dumbbells up with knees, pack lats.'
      },
      {
        title: 'Phase 2: Deep Stretch',
        cue: 'Lower weights until thumbs are near chest level feeling deep pec stretch.'
      },
      {
        title: 'Phase 3: Squeeze Clavicular Head',
        cue: 'Press up in a slight triangle arc without clanging dumbbells at top.'
      }
    ],
    muscles: [
      { name: 'Upper Pectorals (Clavicular)', pct: 92, role: 'Primary Target', color: C.purple },
      { name: 'Anterior Deltoids', pct: 65, role: 'Secondary Driver', color: C.cyan },
      { name: 'Triceps', pct: 50, role: 'Stabilizer', color: C.orange }
    ],
    mistakes: [
      'Setting bench angle too steep (>45° becomes shoulder press)',
      'Clanging dumbbells together at top (removes muscle tension)',
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
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Hip Crease: Break Parallel (Depth Check)',
      barPath: 'Bar Path: Perfectly Vertical over Midfoot',
      footwork: 'Knee Tracking: Actively Flare Knees out over Toes'
    },
    phases: [
      {
        title: 'Phase 1: Unrack & Brace',
        cue: 'Tight shelf on traps, 3-step walkout, 360° belly breath brace.'
      },
      {
        title: 'Phase 2: Hip Hinge & Sink',
        cue: 'Push hips back and spread knees apart, descending under control.'
      },
      {
        title: 'Phase 3: Drive Midfoot',
        cue: 'Drive floor away through whole foot, keep chest proud on the ascent.'
      }
    ],
    muscles: [
      { name: 'Quadriceps Femoris', pct: 95, role: 'Prime Mover', color: C.purple },
      { name: 'Gluteus Maximus', pct: 85, role: 'Hip Extensor', color: C.cyan },
      { name: 'Erector Spinae & Core', pct: 75, role: 'Spinal Armor', color: C.emerald }
    ],
    mistakes: [
      'Knees caving inward (Valgus collapse)',
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
    name: 'Lat Pulldown',
    muscle: 'Back',
    equipment: 'Cable Machine & Wide Grip Bar',
    tempo: '2-1-1-1 (1s Hold at Squeeze, 2s Stretch)',
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Torso Angle: Slight 10-15° Backward Lean',
      barPath: 'Elbow Path: Pull Elbows Directly into Back Pockets',
      footwork: 'Thigh Pad: Snug against quads to prevent lifting'
    },
    phases: [
      {
        title: 'Phase 1: Full Overhead Stretch',
        cue: 'Allow lats to fully open and scapula to elevate smoothly at top.'
      },
      {
        title: 'Phase 2: Scapular Depress',
        cue: 'Initiate by pulling shoulder blades down before bending arms.'
      },
      {
        title: 'Phase 3: Squeeze at Collarbone',
        cue: 'Drive elbows down and squeeze lats for 1 full second at chest level.'
      }
    ],
    muscles: [
      { name: 'Latissimus Dorsi', pct: 94, role: 'Width Driver', color: C.purple },
      { name: 'Rhomboids & Mid-Traps', pct: 70, role: 'Retractors', color: C.cyan },
      { name: 'Biceps Brachii', pct: 50, role: 'Synergist', color: C.orange }
    ],
    mistakes: [
      'Swinging whole torso back like a rowing machine',
      'Pulling bar behind neck (dangerous for cervical spine)',
      'Not getting full overhead stretch at top of each rep'
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
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Forearm Angle: 100% Vertical under Bar',
      barPath: 'Bar Path: Straight Line past nose into overhead slot',
      footwork: 'Glute Lock: Squeeze glutes rock-solid to protect lumbar'
    },
    phases: [
      {
        title: 'Phase 1: Rack & Core Lock',
        cue: 'Rest bar on front delts, hands just outside shoulders, lock glutes.'
      },
      {
        title: 'Phase 2: Head Clearance',
        cue: 'Pull chin back slightly as bar launches straight upward.'
      },
      {
        title: 'Phase 3: Push Head Through',
        cue: 'Once bar clears forehead, bring head through window and lock overhead.'
      }
    ],
    muscles: [
      { name: 'Anterior & Lateral Deltoids', pct: 95, role: 'Primary Target', color: C.purple },
      { name: 'Triceps Brachii', pct: 75, role: 'Lockout Driver', color: C.cyan },
      { name: 'Core & Upper Trapezius', pct: 80, role: 'Full Body Pillar', color: C.emerald }
    ],
    mistakes: [
      'Hyperextending and arching lower back to mimic incline bench',
      'Pressing bar too far forward in an awkward curve',
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
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Elbow Fixation: Pinned strictly against ribcage',
      barPath: 'Supination: Turn pinky finger upward at top',
      footwork: 'Solid Athletic Stance with zero body sway'
    },
    phases: [
      {
        title: 'Phase 1: Full Extension',
        cue: 'Start with arms fully extended and triceps flexed at bottom.'
      },
      {
        title: 'Phase 2: Supinating Curl',
        cue: 'Curl weight while rotating wrists outward (pinkies high).'
      },
      {
        title: 'Phase 3: Peak Contraction',
        cue: 'Squeeze bicep peak hard for 1 second without letting elbows drift forward.'
      }
    ],
    muscles: [
      { name: 'Biceps Brachii (Short & Long)', pct: 95, role: 'Primary Peak', color: C.purple },
      { name: 'Brachialis & Forearms', pct: 60, role: 'Grip & Arm Thickness', color: C.cyan }
    ],
    mistakes: [
      'Swinging hips or using lower back momentum',
      'Letting elbows flare forward (shifts load onto shoulders)',
      'Only doing half reps without full bottom stretch'
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
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Elbow Lock: Pinned like hinges at sides',
      barPath: 'Rope Separation: Spread ends apart past thighs',
      footwork: 'Slight athletic forward hinge from hips'
    },
    phases: [
      {
        title: 'Phase 1: 90° Forearm Angle',
        cue: 'Start with forearms at 90° keeping upper arms locked to sides.'
      },
      {
        title: 'Phase 2: Pushdown & Spread',
        cue: 'Push down smoothly, then flare ropes wide apart at bottom.'
      },
      {
        title: 'Phase 3: Lateral Head Squeeze',
        cue: 'Fully lock out triceps and hold intense peak contraction.'
      }
    ],
    muscles: [
      { name: 'Triceps Lateral & Medial Heads', pct: 95, role: 'Horseshoe Target', color: C.purple },
      { name: 'Anconeous', pct: 40, role: 'Stabilizer', color: C.cyan }
    ],
    mistakes: [
      'Leaning body weight directly over the rope',
      'Allowing elbows to swing backward on the return',
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
    equipment: 'Barbell',
    tempo: '3-1-1-0 (3s Hip Hinge, 1s Squeeze)',
    angles: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg'
      ],
      iso3d: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Knee Angle: Soft 15-20° Bend (Do Not Squat)',
      barPath: 'Bar Shave: Bar stays glued to thighs and shins',
      footwork: 'Hip Push: Push hips back as if touching a wall behind'
    },
    phases: [
      {
        title: 'Phase 1: Hip Hinge Initiation',
        cue: 'Unlock knees slightly, send hips straight back with flat back.'
      },
      {
        title: 'Phase 2: Deep Hamstring Load',
        cue: 'Lower bar down shins until maximum hamstring stretch is achieved.'
      },
      {
        title: 'Phase 3: Glute Drive Forward',
        cue: 'Drive hips forward into the bar, squeezing glutes hard at top.'
      }
    ],
    muscles: [
      { name: 'Hamstrings (Biceps Femoris)', pct: 95, role: 'Prime Target', color: C.purple },
      { name: 'Gluteus Maximus', pct: 90, role: 'Hip Extensor', color: C.cyan },
      { name: 'Erector Spinae & Lats', pct: 80, role: 'Spinal Shield', color: C.emerald }
    ],
    mistakes: [
      'Rounding the lower back (extreme spinal strain)',
      'Bending knees excessively turning it into a squat',
      'Letting the bar drift away from shins'
    ],
    sets: [
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 65, done: false },
      { num: 3, reps: 8, weight: 70, done: false }
    ]
  }
];

// =========================================================================
// 🚀 3D MULTI-ANGLE FORM STUDIO COMPONENT
// =========================================================================
function Exercise3DStudio({ exercise, compact = false }) {
  const [selectedAngle, setSelectedAngle] = useState('front'); // 'front' | 'side' | 'iso3d'
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1 = Normal, 0.5 = Slow-Mo Form Analysis

  // Active frames for the chosen angle
  const frames = exercise.angles[selectedAngle] || exercise.angles.front;

  useEffect(() => {
    let interval;
    if (isPlaying && frames && frames.length > 1) {
      interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % frames.length);
      }, 900 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedAngle, speed, frames]);

  const currentFrameUrl = frames[activeStep] || frames[0];

  return (
    <View style={styles.studioCard}>
      {/* Angle Selector Bar */}
      <View style={styles.angleBar}>
        {[
          { key: 'front', label: '🎥 FRONT VIEW', icon: Eye },
          { key: 'side', label: '📐 SIDE VIEW (Form)', icon: Compass },
          { key: 'iso3d', label: '🌐 3D ANGLE', icon: RotateCw }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = selectedAngle === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.angleTab, isActive && styles.angleTabActive]}
              onPress={() => {
                setSelectedAngle(item.key);
                setActiveStep(0);
              }}
            >
              <Icon size={12} color={isActive ? '#FFF' : C.textSecondary} />
              <Text style={[styles.angleTabText, isActive && { color: '#FFF' }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3D Viewport Frame */}
      <View style={compact ? styles.viewportCompact : styles.viewport}>
        <Image
          source={{ uri: currentFrameUrl }}
          style={styles.viewportImage}
          resizeMode="cover"
        />

        {/* Live Biomechanical HUD Overlay */}
        <View style={styles.hudTopBadge}>
          <View style={styles.hudLiveDot} />
          <Text style={styles.hudLiveText}>3D MOTION ANGLE: {selectedAngle.toUpperCase()}</Text>
        </View>

        {/* Joint Alignment Callout */}
        <View style={styles.jointBadge}>
          <Activity size={12} color={C.cyan} />
          <Text style={styles.jointBadgeText}>
            {selectedAngle === 'front'
              ? exercise.biomechanics.barPath
              : selectedAngle === 'side'
              ? exercise.biomechanics.jointAngle
              : exercise.biomechanics.footwork}
          </Text>
        </View>

        {/* Playback Controls Overlay */}
        <View style={styles.controlOverlay}>
          <TouchableOpacity
            style={styles.playPauseBtn}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} color="#FFF" /> : <Play size={14} color="#FFF" fill="#FFF" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedPill, speed === 0.5 && styles.speedPillActive]}
            onPress={() => setSpeed(speed === 1 ? 0.5 : 1)}
          >
            <Text style={styles.speedText}>{speed === 0.5 ? '0.5x SLOW-MO' : '1.0x'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Step-by-Step Motion Phases */}
      <View style={styles.phaseContainer}>
        <View style={styles.phaseHeaderRow}>
          <Text style={styles.phaseHeaderTitle}>KINEMATIC PHASES ({activeStep + 1}/{exercise.phases.length})</Text>
          <Text style={styles.tempoBadge}>{exercise.tempo}</Text>
        </View>

        <View style={styles.phaseStepRow}>
          {exercise.phases.map((p, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.phaseChip, isCurrent && styles.phaseChipActive]}
                onPress={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
              >
                <Text style={[styles.phaseChipNum, isCurrent && { color: '#FFF' }]}>{idx + 1}</Text>
                <Text style={[styles.phaseChipText, isCurrent && { color: '#FFF' }]} numberOfLines={1}>
                  {p.title.split(':')[1] || p.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Cue Card */}
        <View style={styles.activeCueBox}>
          <Zap size={14} color={C.cyan} />
          <Text style={styles.activeCueText}>{exercise.phases[activeStep]?.cue}</Text>
        </View>
      </View>

      {/* Anatomical Muscle Activation Heatmap */}
      {!compact && (
        <View style={styles.muscleSection}>
          <Text style={styles.muscleTitle}>Anatomy & Muscle Activation Map</Text>
          {exercise.muscles.map((m, i) => (
            <View key={i} style={styles.muscleRow}>
              <View style={styles.muscleNameRow}>
                <Text style={styles.muscleName}>{m.name}</Text>
                <Text style={{ color: m.color, fontSize: 11, fontWeight: '800' }}>
                  {m.role} • {m.pct}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${m.pct}%`, backgroundColor: m.color }]} />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// =========================================================================
// MAIN FITPULSE APP
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

  // Workout Clock
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

          <Text style={styles.welcomeSub}>Personalized Beginner Hypertrophy</Text>
          <Text style={styles.welcomeTitle}>Push Day — Chest & Triceps</Text>

          {/* Today's Target Hero Card */}
          <LinearGradient
            colors={['#1E163B', '#110D24']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroTag}><Text style={styles.heroTagText}>3D GUIDED SPLIT</Text></View>
              <Text style={{ color: C.cyan, fontSize: 12, fontWeight: '800' }}>3 Exercises • 45 Mins</Text>
            </View>

            <Text style={styles.heroTitle}>Push Hypertrophy Level 1</Text>
            <Text style={styles.heroSub}>Multi-angle visual biomechanics & set guidance</Text>

            {/* Quick Chips */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}><Text style={styles.chipText}>🔥 320 kcal</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>⚡ +250 XP</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>🎯 Chest & Triceps</Text></View>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startWorkout}>
              <Play size={16} color="#FFF" fill="#FFF" />
              <Text style={styles.startBtnText}>Start Workout in 3D Mode ▶</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* 7-Day Gym Split Roadmap */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Gym Split</Text>
            <Text style={styles.sectionSub}>Phase 1 Roadmap</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {[
              { day: 'Mon', split: 'Push (Chest/Tri)', active: true },
              { day: 'Tue', split: 'Pull (Back/Bi)', active: false },
              { day: 'Wed', split: 'Legs & Core', active: false },
              { day: 'Thu', split: 'Rest & Mobility', active: false },
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

          {/* Muscle Focus Selector */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Learn Form by Muscle</Text>
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
          <Text style={styles.pageSub}>Full 3D angle breakdown for every routine</Text>

          {[
            { title: 'Beginner 3-Day Full Body', sub: '3 days/week • 45 mins • Perfect for newcomers', xp: 200 },
            { title: 'Push / Pull / Legs (PPL)', sub: '6 days/week • 60 mins • Classic muscle builder', xp: 350 },
            { title: 'Upper / Lower Power Split', sub: '4 days/week • 50 mins • Strength & hypertrophy', xp: 300 }
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
      {/* 3. 3D EXERCISE LIBRARY TAB */}
      {/* ======================================================== */}
      {currentTab === 'exercises' && (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
          <Text style={styles.pageTitle}>3D Biomechanics Studio</Text>
          <Text style={styles.pageSub}>Inspect joint angles, muscle maps & multi-angle form</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={16} color={C.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercise..."
              placeholderTextColor={C.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Muscle Filter Chips */}
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

          {/* Exercise List */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
            {filteredExercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.exCard}
                onPress={() => setSelectedExerciseDetail(ex)}
              >
                <Image
                  source={{ uri: ex.angles.front[0] }}
                  style={styles.exThumb}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exMeta}>{ex.muscle} • {ex.equipment}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <RotateCw size={10} color={C.cyan} />
                    <Text style={{ color: C.cyan, fontSize: 10, fontWeight: '800' }}>3 ANGLES & ANATOMY AVAILABLE</Text>
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

              {/* Interactive 3D Studio */}
              <Exercise3DStudio exercise={selectedExerciseDetail} />

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
      {/* 6. GUIDED WORKOUT PLAYER (3D + SET LOGGER) */}
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

                {/* Compact 3D Studio for Live Session */}
                <Exercise3DStudio exercise={currentWorkoutEx} compact />

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
          <Text style={[styles.navText, currentTab === 'exercises' && { color: C.purpleAccent }]}>3D Studio</Text>
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
  exThumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: C.surfaceVariant },
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

  // Studio Styles
  studioCard: { backgroundColor: C.surface, borderRadius: 20, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: C.borderSubtle },
  angleBar: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  angleTab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.borderSubtle },
  angleTabActive: { backgroundColor: C.purple, borderColor: C.purpleLight },
  angleTabText: { color: C.textSecondary, fontSize: 9, fontWeight: '800' },
  viewport: { width: '100%', height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#000' },
  viewportCompact: { width: '100%', height: 190, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#000' },
  viewportImage: { width: '100%', height: '100%' },
  hudTopBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(8, 7, 14, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: C.borderSubtle },
  hudLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald },
  hudLiveText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  jointBadge: { position: 'absolute', bottom: 10, left: 10, right: 90, backgroundColor: 'rgba(8, 7, 14, 0.85)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.4)' },
  jointBadgeText: { color: C.cyan, fontSize: 10, fontWeight: '800' },
  controlOverlay: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', gap: 6 },
  playPauseBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(124, 58, 237, 0.9)', justifyContent: 'center', alignItems: 'center' },
  speedPill: { backgroundColor: 'rgba(8, 7, 14, 0.85)', paddingHorizontal: 6, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  speedPillActive: { borderColor: C.cyan, backgroundColor: 'rgba(6, 182, 212, 0.2)' },
  speedText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  phaseContainer: { marginTop: 12 },
  phaseHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  phaseHeaderTitle: { color: C.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  tempoBadge: { color: C.cyan, fontSize: 10, fontWeight: '800' },
  phaseStepRow: { flexDirection: 'row', gap: 6 },
  phaseChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  phaseChipActive: { backgroundColor: 'rgba(124, 58, 237, 0.35)', borderColor: C.purple },
  phaseChipNum: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.surfaceElevated, textAlign: 'center', color: C.textSecondary, fontSize: 10, fontWeight: '900', lineHeight: 16 },
  phaseChipText: { color: C.textSecondary, fontSize: 10, fontWeight: '700', flex: 1 },
  activeCueBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surfaceElevated, padding: 10, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: C.borderSubtle },
  activeCueText: { color: C.textPrimary, fontSize: 11, fontWeight: '600', flex: 1 },
  muscleSection: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.borderSubtle },
  muscleTitle: { color: C.textPrimary, fontSize: 12, fontWeight: '900', marginBottom: 8 },
  muscleRow: { marginVertical: 4 },
  muscleNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  muscleName: { color: C.textSecondary, fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: C.surfaceVariant, borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 }
});
