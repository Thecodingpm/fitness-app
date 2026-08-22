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
  Edit3
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// =========================================================================
// 🖤 LUXURY MONOCHROME (BLACK & WHITE) DESIGN SYSTEM
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
  emeraldGlow: 'rgba(16, 185, 129, 0.2)',
  amber: '#F59E0B',
  rose: '#F43F5E'
};

const EXERCISES_DB = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell & Flat Bench',
    tempo: '3-1-1-0 (3s Lower, 1s Pause, 1s Press)',
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Elbow Flare: 45° - 60° (Protects shoulder joints)',
      barPath: 'Bar Path: Controlled J-Curve down to mid-sternum',
      footwork: 'Scapula: Pinched tightly into bench throughout'
    },
    phases: [
      { title: 'Setup & Grip', cue: 'Plant feet flat, retract shoulder blades, grip 1.5x shoulder width.' },
      { title: 'Controlled Descent (3s)', cue: 'Inhale deep into belly, lower bar smoothly to lower sternum.' },
      { title: 'Explosive Drive', cue: 'Drive feet into floor, press bar up and lock triceps at top.' }
    ],
    targetMuscles: [
      { name: 'Pectoralis Major', role: 'Primary Target (95%)' },
      { name: 'Triceps Brachii', role: 'Lockout Driver (70%)' },
      { name: 'Anterior Deltoid', role: 'Stabilizer (55%)' }
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
    equipment: 'Dumbbells & Incline Bench (30°)',
    tempo: '2-1-1-0 (2s Lower, 1s Stretch, 1s Squeeze)',
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Bench Angle: 30° Optimal (Avoid >45°)',
      barPath: 'Dumbbell Arc: Converging upward triangle arc',
      footwork: 'Wrists: Kept neutral directly above elbows'
    },
    phases: [
      { title: 'Kickup & Set', cue: 'Kick dumbbells up with knees to shoulder level, pack lats.' },
      { title: 'Deep Stretch (2s)', cue: 'Lower weights until thumbs are near upper chest for maximum stretch.' },
      { title: 'Upper Pec Squeeze', cue: 'Press dumbbells up in a slight triangle arc without clanging at top.' }
    ],
    targetMuscles: [
      { name: 'Clavicular Pecs (Upper)', role: 'Primary Target (92%)' },
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
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Depth: Hip crease breaks below knee cap',
      barPath: 'Bar Path: Perfectly vertical straight line over midfoot',
      footwork: 'Knee Tracking: Push knees outward over pinky toes'
    },
    phases: [
      { title: 'Unrack & Shelf', cue: 'Create tight trap shelf, 3-step walkout, 360° belly brace.' },
      { title: 'Hinge & Sink (3s)', cue: 'Push hips back and knees apart, maintaining upright chest.' },
      { title: 'Floor Drive', cue: 'Drive through midfoot, spreading the floor to stand up tall.' }
    ],
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
    name: 'Lat Pulldown',
    muscle: 'Back',
    equipment: 'Cable Machine & Wide Lat Bar',
    tempo: '2-1-1-1 (1s Hold Squeeze, 2s Full Stretch)',
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Torso: Slight 10-15° lean (no heaving)',
      barPath: 'Elbows: Pull down and back directly into back pockets',
      footwork: 'Thigh Pad: Locked securely against quads'
    },
    phases: [
      { title: 'Full Overhead Stretch', cue: 'Allow lats to fully open with arms extended overhead.' },
      { title: 'Scapular Depression', cue: 'Pull shoulder blades down and back before bending elbows.' },
      { title: 'Squeeze at Chest', cue: 'Drive bar to upper collarbone, pinching lats for 1 full second.' }
    ],
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
    name: 'Standing Overhead Press',
    muscle: 'Shoulders',
    equipment: 'Barbell & Rack',
    tempo: '2-0-1-0 (Controlled Descent, Pure Power)',
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Forearms: 100% vertical under bar at start',
      barPath: 'Bar Path: Straight vertical line past chin into overhead slot',
      footwork: 'Glute Lock: Squeeze glutes hard to prevent back arching'
    },
    phases: [
      { title: 'Rack Position', cue: 'Rest bar on front delts, grip outside shoulders, lock glutes.' },
      { title: 'Vertical Launch', cue: 'Tilt chin back, press bar in straight path clearing nose.' },
      { title: 'Head Through Window', cue: 'Push head through arms and lock out barbell directly over spine.' }
    ],
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
    name: 'Dumbbell Bicep Curl',
    muscle: 'Arms',
    equipment: 'Dumbbells',
    tempo: '2-1-1-0 (2s Lower, 1s Peak Squeeze)',
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Elbow Fixation: Pinned strictly to ribs with zero drift',
      barPath: 'Supination: Rotate pinky fingers high at peak contraction',
      footwork: 'Full Extension: Flex triceps at bottom for complete stretch'
    },
    phases: [
      { title: 'Full Extension', cue: 'Start with arms fully extended, palms facing thighs.' },
      { title: 'Supinating Curl', cue: 'Curl weight up while rotating palms up (pinkies pointing high).' },
      { title: 'Peak Squeeze (1s)', cue: 'Hold hard contraction at top without letting elbows move forward.' }
    ],
    targetMuscles: [
      { name: 'Biceps Brachii', role: 'Peak Target (95%)' },
      { name: 'Brachialis & Forearms', role: 'Grip & Arm Thickness (65%)' }
    ],
    mistakes: [
      'Swinging hips or rocking back to cheat weight up',
      'Letting elbows flare forward (shifts load to shoulders)',
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
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Elbows: Locked in place like door hinges at sides',
      barPath: 'Rope Separation: Spread ends wide apart past thighs',
      footwork: 'Posture: Slight athletic hinge from hips with rigid core'
    },
    phases: [
      { title: '90° Starting Angle', cue: 'Forearms at 90°, upper arms pinned to torso.' },
      { title: 'Pushdown & Flare', cue: 'Push down smoothly, then flare rope ends wide apart at bottom.' },
      { title: 'Horseshoe Lockout', cue: 'Squeeze triceps violently for 1 full second before 2s return.' }
    ],
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
    name: 'Romanian Deadlift (RDL)',
    muscle: 'Legs',
    equipment: 'Barbell & Plates',
    tempo: '3-1-1-0 (3s Hip Hinge, 1s Glute Squeeze)',
    videoFrames: {
      front: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg'
      ],
      side: [
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg',
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg'
      ]
    },
    biomechanics: {
      jointAngle: 'Hip Hinge: Push hips straight backward like closing a door',
      barPath: 'Knee Bend: Soft 15° bend (this is a hinge, not a squat)',
      footwork: 'Bar Contact: Bar stays in continuous contact with shins'
    },
    phases: [
      { title: 'Soft Knee Hinge', cue: 'Unlock knees slightly, send hips back with rigid flat spine.' },
      { title: 'Hamstring Loading (3s)', cue: 'Lower bar down shins until deep hamstring stretch is felt.' },
      { title: 'Glute Squeeze Forward', cue: 'Drive hips forcefully forward into bar, locking glutes at top.' }
    ],
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
// 🎥 HD VIDEO MOTION DEMO PLAYER (Black & White Studio)
// =========================================================================
function ExerciseVideoStudio({ exercise, compact = false }) {
  const [selectedAngle, setSelectedAngle] = useState('front');
  const [frameIdx, setFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const frames = exercise.videoFrames[selectedAngle] || exercise.videoFrames.front;

  useEffect(() => {
    let interval;
    if (isPlaying && frames && frames.length > 1) {
      interval = setInterval(() => {
        setFrameIdx(prev => (prev + 1) % frames.length);
      }, 900 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedAngle, speed, frames]);

  const currentUri = frames[frameIdx] || frames[0];

  return (
    <View style={styles.studioCard}>
      {/* Angle Selector Bar */}
      <View style={styles.angleBar}>
        {[
          { key: 'front', label: 'FRONT ANGLE' },
          { key: 'side', label: 'SIDE (FORM CHECK)' }
        ].map((item) => {
          const isActive = selectedAngle === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.angleTab, isActive && styles.angleTabActive]}
              onPress={() => {
                setSelectedAngle(item.key);
                setFrameIdx(0);
              }}
            >
              <Text style={[styles.angleTabText, isActive && { color: C.bg }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Video Viewport Frame */}
      <View style={compact ? styles.viewportCompact : styles.viewport}>
        <Image
          source={{ uri: currentUri }}
          style={styles.viewportImage}
          resizeMode="cover"
        />

        {/* Live HUD Badge */}
        <View style={styles.hudTopBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.hudTopText}>HD FORM LOOP • {selectedAngle.toUpperCase()}</Text>
        </View>

        {/* Playback Controls Overlay */}
        <View style={styles.controlOverlay}>
          <TouchableOpacity
            style={styles.playPauseBtn}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} color={C.bg} /> : <Play size={14} color={C.bg} fill={C.bg} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedPill, speed === 0.5 && styles.speedPillActive]}
            onPress={() => setSpeed(speed === 1 ? 0.5 : 1)}
          >
            <Text style={[styles.speedText, speed === 0.5 && { color: C.bg }]}>
              {speed === 0.5 ? '0.5x SLOW-MO' : '1.0x'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Biomechanics Cues Callout */}
      <View style={styles.biomechBox}>
        <View style={styles.cueItemRow}>
          <ShieldCheck size={14} color={C.white} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.jointAngle}</Text>
        </View>
        <View style={styles.cueItemRow}>
          <Activity size={14} color={C.zinc} />
          <Text style={styles.cueItemText}>{exercise.biomechanics.barPath}</Text>
        </View>
      </View>

      {/* Execution Stepper */}
      <View style={styles.phaseStepperContainer}>
        <Text style={styles.phaseHeaderTitle}>FORM CHECKPOINTS ({frameIdx + 1}/{exercise.phases.length})</Text>
        <View style={styles.phaseChipsRow}>
          {exercise.phases.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.phaseChip, frameIdx === idx && styles.phaseChipActive]}
              onPress={() => {
                setFrameIdx(idx);
                setIsPlaying(false);
              }}
            >
              <Text style={[styles.phaseNum, frameIdx === idx && { backgroundColor: C.white, color: C.bg }]}>
                {idx + 1}
              </Text>
              <Text style={[styles.phaseChipLabel, frameIdx === idx && { color: C.white }]} numberOfLines={1}>
                {p.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.activePhaseCard}>
          <Text style={styles.activePhaseDesc}>
            💡 {exercise.phases[frameIdx]?.cue}
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
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'workouts' | 'exercises' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null);

  // User Profile & Onboarding State
  const [userName, setUserName] = useState('Alex');
  const [userGoal, setUserGoal] = useState('Build Lean Muscle');
  const [userLevel, setUserLevel] = useState('Beginner');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState('Alex');
  const [showPaywall, setShowPaywall] = useState(false);

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
      {/* 1. DASHBOARD HOME TAB */}
      {/* ======================================================== */}
      {currentTab === 'home' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Brand Header */}
          <View style={styles.headerRow}>
            <View style={styles.brandPill}>
              <Text style={{ color: C.white, fontWeight: '900', fontSize: 13, letterSpacing: 1 }}>⚡ FITPULSE</Text>
            </View>

            <TouchableOpacity style={styles.userBadge} onPress={() => setIsEditingProfile(true)}>
              <User size={13} color={C.white} />
              <Text style={styles.userBadgeText}>{userName}</Text>
              <Edit3 size={11} color={C.zinc} />
            </TouchableOpacity>
          </View>

          {/* Dynamic Personalized Greeting */}
          <Text style={styles.welcomeSub}>Ready for today's session,</Text>
          <Text style={styles.welcomeTitle}>{userName}? 👋</Text>

          {/* Today's Target Hero Card (Monochrome Luxury) */}
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

          {/* AI Coach Progressive Overload Banner */}
          <View style={styles.aiCoachCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color={C.white} />
              <Text style={{ color: C.white, fontWeight: '900', fontSize: 12 }}>AI COACH INSIGHT</Text>
            </View>
            <Text style={{ color: C.zinc, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
              "Great progress, {userName}! You completed your last Bench Press at 50kg. Today we are targeting 52.5kg (+5%) on your top set."
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
          <Text style={styles.pageTitle}>Exercise Library</Text>
          <Text style={styles.pageSub}>Multi-angle video loops, biomechanics & form cues</Text>

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
                  source={{ uri: ex.videoFrames.front[0] }}
                  style={styles.exThumb}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exMeta}>{ex.muscle} • {ex.equipment}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <ShieldCheck size={11} color={C.white} />
                    <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>HD FORM CHECK AVAILABLE</Text>
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
                <Text style={[styles.planTitle, { fontSize: 20 }]}>{userName}</Text>
                <Text style={styles.planSub}>Level 12 • Iron Athlete • 14 Day Streak</Text>
              </View>
              <TouchableOpacity style={styles.editPill} onPress={() => setIsEditingProfile(true)}>
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
              <Text style={{ color: C.white, fontWeight: '900', fontSize: 13, letterSpacing: 0.5 }}>FITPULSE PRO</Text>
            </View>
            <Text style={{ color: C.zinc, fontSize: 12, marginTop: 4 }}>
              Unlock Unlimited 1-on-1 AI Form Coaching, Custom Splits, and Progressive Overload Tracking.
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
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* 5. PROFILE EDIT / ONBOARDING MODAL */}
      {/* ======================================================== */}
      <Modal visible={isEditingProfile} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)', justifyContent: 'center', padding: 20 }}>
          <View style={styles.onboardModal}>
            <Text style={styles.onboardTitle}>Customize Your Profile</Text>
            <Text style={styles.onboardSub}>Personalize your AI Coach and Dashboard greeting</Text>

            <Text style={styles.inputLabel}>YOUR NAME</Text>
            <TextInput
              style={styles.onboardInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your name..."
              placeholderTextColor={C.zincDark}
            />

            <Text style={styles.inputLabel}>PRIMARY FITNESS GOAL</Text>
            <View style={{ gap: 8, marginVertical: 6 }}>
              {['Build Lean Muscle', 'Lose Fat & Shred', 'Gain Pure Strength'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.goalChoice, userGoal === g && styles.goalChoiceActive]}
                  onPress={() => setUserGoal(g)}
                >
                  <Text style={[styles.goalChoiceText, userGoal === g && { color: C.bg, fontWeight: '900' }]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveProfileBtn}
              onPress={() => {
                if (tempName.trim().length > 0) {
                  setUserName(tempName.trim());
                }
                setIsEditingProfile(false);
              }}
            >
              <Text style={styles.saveProfileBtnText}>Save Profile & Update Dashboard</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ======================================================== */}
      {/* 6. PRO SUBSCRIPTION PAYWALL MODAL */}
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

            <Text style={styles.paywallTitle}>Unlock FitPulse Pro</Text>
            <Text style={styles.paywallSub}>Your Complete AI Personal Trainer in your pocket</Text>

            <View style={{ gap: 10, marginVertical: 18 }}>
              {[
                'Unlimited 1-on-1 AI Workout Programs',
                'HD Multi-Angle Video Demonstrations',
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
                Alert.alert('⭐ Subscribed!', 'Welcome to FitPulse Pro. Your 7-day free trial has started.');
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
      {/* 7. EXERCISE DETAIL MODAL */}
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

              {/* Video Studio */}
              <ExerciseVideoStudio exercise={selectedExerciseDetail} />

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
      {/* 8. GUIDED WORKOUT PLAYER */}
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

                {/* Video Demo */}
                <ExerciseVideoStudio exercise={currentWorkoutEx} compact />

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
      {/* 9. BOTTOM NAVIGATION BAR */}
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
          <Text style={[styles.navText, currentTab === 'exercises' && { color: C.white, fontWeight: '800' }]}>Exercises</Text>
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
  brandPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: C.border },
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
  exThumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: C.surfaceVariant },
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

  // Studio Styles
  studioCard: { backgroundColor: C.surface, borderRadius: 20, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: C.border },
  angleBar: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  angleTab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.borderSubtle },
  angleTabActive: { backgroundColor: C.white, borderColor: C.white },
  angleTabText: { color: C.zinc, fontSize: 9, fontWeight: '800' },
  viewport: { width: '100%', height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#000', borderWidth: 1, borderColor: C.border },
  viewportCompact: { width: '100%', height: 190, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#000', borderWidth: 1, borderColor: C.border },
  viewportImage: { width: '100%', height: '100%' },
  hudTopBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: C.border },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald },
  hudTopText: { color: C.white, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  controlOverlay: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', gap: 6 },
  playPauseBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center' },
  speedPill: { backgroundColor: 'rgba(0, 0, 0, 0.85)', paddingHorizontal: 6, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  speedPillActive: { backgroundColor: C.white, borderColor: C.white },
  speedText: { color: C.white, fontSize: 9, fontWeight: '800' },
  biomechBox: { backgroundColor: C.surfaceElevated, borderRadius: 12, padding: 10, marginTop: 10, borderWidth: 1, borderColor: C.borderSubtle },
  cueItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  cueItemText: { color: C.zincLight, fontSize: 11, fontWeight: '600', flex: 1 },
  phaseStepperContainer: { marginTop: 12 },
  phaseHeaderTitle: { color: C.zinc, fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  phaseChipsRow: { flexDirection: 'row', gap: 6 },
  phaseChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surfaceVariant, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 8, borderWidth: 1, borderColor: C.borderSubtle },
  phaseChipActive: { backgroundColor: C.surfaceElevated, borderColor: C.white },
  phaseNum: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.surfaceElevated, textAlign: 'center', color: C.zinc, fontSize: 10, fontWeight: '900', lineHeight: 16 },
  phaseChipLabel: { color: C.zinc, fontSize: 10, fontWeight: '700', flex: 1 },
  activePhaseCard: { backgroundColor: C.surfaceElevated, padding: 10, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: C.borderSubtle },
  activePhaseDesc: { color: C.white, fontSize: 11, lineHeight: 16 },

  // Profile & Paywall Styles
  editPill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  editPillText: { color: C.white, fontSize: 11, fontWeight: '700' },
  profileStat: { flex: 1, backgroundColor: C.surfaceVariant, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.borderSubtle },
  profileStatNum: { color: C.white, fontSize: 16, fontWeight: '900' },
  profileStatLabel: { color: C.zinc, fontSize: 10, marginTop: 2 },
  proCard: { backgroundColor: C.surfaceElevated, borderRadius: 16, padding: 16, marginVertical: 10, borderWidth: 1, borderColor: C.border },
  upgradeBtn: { backgroundColor: C.white, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  upgradeBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },

  // Onboard Modal Styles
  onboardModal: { backgroundColor: C.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: C.border },
  onboardTitle: { color: C.white, fontSize: 20, fontWeight: '900' },
  onboardSub: { color: C.zinc, fontSize: 12, marginTop: 2, marginBottom: 16 },
  inputLabel: { color: C.zinc, fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  onboardInput: { backgroundColor: C.surfaceVariant, borderRadius: 12, height: 46, paddingHorizontal: 14, color: C.white, fontSize: 14, borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  goalChoice: { backgroundColor: C.surfaceVariant, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: C.borderSubtle },
  goalChoiceActive: { backgroundColor: C.white, borderColor: C.white },
  goalChoiceText: { color: C.white, fontSize: 12, fontWeight: '700' },
  saveProfileBtn: { backgroundColor: C.white, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  saveProfileBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 },

  // Paywall Styles
  paywallCard: { backgroundColor: C.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border },
  closeBtn: { position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  crownCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
  paywallTitle: { color: C.white, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  paywallSub: { color: C.zinc, fontSize: 12, textAlign: 'center', marginTop: 4 },
  subscribeBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  subscribeBtnText: { color: C.bg, fontWeight: '900', fontSize: 14 }
});
