// =========================================================================
// 🏋️ ENTERPRISE FITNESS APP - EXERCISES & ROUTINES DATABASE
// =========================================================================

export const EXERCISES_DB = [
  // =========================================================================
  // 🏋️ CHEST EXERCISES (5 VARIATIONS)
  // =========================================================================
  {
    id: 'chest_1',
    name: 'Pec Deck Machine Fly',
    shortName: 'Var. 1',
    tagline: 'Pec Deck Machine Fly',
    muscle: 'Chest',
    equipment: 'Chest & Push Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Press)',
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Pec Deck Fly. Retract shoulder blades, plant feet firmly.',
      lower: 'Control the descent down to lower chest... 3, 2, 1...',
      press: 'Drive the weight up! Squeeze pectorals at the top!',
      finish: 'Locked out and controlled! Great chest contraction.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: 45 to 60 degrees relative to torso',
      barPath: 'Bar Path: Slight j-curve to middle sternum',
      footwork: 'Leg Drive: Drive heels into the floor for stability'
    },
    targetMuscles: [
      { name: 'Pectoralis Major', role: 'Prime Mover (100%)' },
      { name: 'Anterior Deltoid', role: 'Synergist (70%)' },
      { name: 'Triceps Brachii', role: 'Elbow Extensor (65%)' }
    ],
    mistakes: [
      'Flaring elbows out to 90 degrees (shoulder strain)',
      'Bouncing weight off the chest',
      'Lifting hips and lower back excessively'
    ],
    sets: [
      { num: 1, reps: 12, weight: 50, done: false },
      { num: 2, reps: 10, weight: 60, done: false },
      { num: 3, reps: 10, weight: 65, done: false }
    ]
  },
  {
    id: 'chest_2',
    name: 'Flat Dumbbell Bench Press',
    shortName: 'Var. 2',
    tagline: 'Flat Dumbbell Bench Press',
    muscle: 'Chest',
    equipment: 'Chest & Push Power',
    tempo: '3-0-1-0 (3s Eccentric, Controlled Press)',
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Dumbbell Press. Position shoulders securely, engage chest.',
      lower: 'Lower the weight smoothly... 3, 2, 1...',
      press: 'Drive and press upward with control!',
      finish: 'Peak chest squeeze! Repetition complete.'
    },
    biomechanics: {
      jointAngle: 'Elbow Alignment: Natural 45-degree angle',
      barPath: 'Press Path: Vertical straight line plane',
      footwork: 'Stability: Strong planted floor base'
    },
    targetMuscles: [
      { name: 'Pectoralis Major & Minor', role: 'Prime Mover (100%)' },
      { name: 'Anterior Deltoid', role: 'Synergist (75%)' }
    ],
    mistakes: [
      'Elbow flare causing rotator cuff strain',
      'Arching spine excessively'
    ],
    sets: [
      { num: 1, reps: 10, weight: 24, done: false },
      { num: 2, reps: 10, weight: 28, done: false },
      { num: 3, reps: 8, weight: 32, done: false }
    ]
  },
  {
    id: 'chest_3',
    name: 'Standing Cable Fly',
    shortName: 'Var. 3',
    tagline: 'Standing Cable Fly',
    muscle: 'Chest',
    equipment: 'Chest & Cable Fly',
    tempo: '3-0-1-0 (3s Eccentric Fly, Peak Squeeze)',
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Chest Cable Fly. Set pulleys, plant feet in staggered stance.',
      lower: 'Open arms wide with slight elbow bend... feel the deep chest stretch... 3, 2, 1...',
      press: 'Hug a wide barrel! Squeeze inner pectorals together!',
      finish: 'Peak chest contraction! Hold and control.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: Constant soft 15-degree bend throughout',
      barPath: 'Fly Path: Smooth arc meeting in front of middle sternum',
      footwork: 'Stance: Staggered split stance for maximum core stability'
    },
    targetMuscles: [
      { name: 'Pectoralis Major (Sternal Head)', role: 'Prime Mover (100%)' },
      { name: 'Anterior Deltoid & Coracobrachialis', role: 'Synergists (70%)' }
    ],
    mistakes: [
      'Bending and extending elbows like a press instead of a fly',
      'Leaning excessively forward with rounded shoulders'
    ],
    sets: [
      { num: 1, reps: 12, weight: 15, done: false },
      { num: 2, reps: 10, weight: 20, done: false },
      { num: 3, reps: 10, weight: 25, done: false }
    ]
  },
  {
    id: 'chest_4',
    name: 'Incline Power Chest Press',
    shortName: 'Var. 4',
    tagline: 'Incline Power Chest Press',
    muscle: 'Chest',
    equipment: 'Chest & Power Push',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Press)',
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Incline Chest Press. Plant feet firmly, brace core.',
      lower: 'Control the descent down smoothly... 3, 2, 1...',
      press: 'Drive the weight up with explosive force!',
      finish: 'Complete repetition! Maximum chest engagement.'
    },
    biomechanics: {
      jointAngle: 'Elbow Position: 45 to 60-degree angle from torso',
      barPath: 'Motion Plane: Smooth vertical pressing line',
      footwork: 'Stability: Solid leg drive rooted into floor'
    },
    targetMuscles: [
      { name: 'Pectoralis Major (Clavicular Head)', role: 'Prime Mover (100%)' },
      { name: 'Anterior Deltoids & Triceps', role: 'Synergists (75%)' }
    ],
    mistakes: [
      'Flaring elbows out excessively',
      'Lifting lower back off the bench'
    ],
    sets: [
      { num: 1, reps: 10, weight: 22, done: false },
      { num: 2, reps: 10, weight: 26, done: false },
      { num: 3, reps: 8, weight: 30, done: false }
    ]
  },
  {
    id: 'chest_5',
    name: 'Low-to-High Cable Fly',
    shortName: 'Var. 5',
    tagline: 'Low-to-High Cable Fly',
    muscle: 'Chest',
    equipment: 'Chest & Pec Fly',
    tempo: '3-0-1-0 (3s Eccentric Fly, Explosive Squeeze)',
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Low Cable Fly. Retract shoulder blades, keep chest elevated.',
      lower: 'Open arms with soft elbows... feel the deep pectoral stretch... 3, 2, 1...',
      press: 'Squeeze pectorals inward and upward to the center!',
      finish: 'Peak upper chest contraction! Complete repetition.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: Constant soft 20-degree bend',
      barPath: 'Fly Path: Diagonal upward arc to upper sternum',
      footwork: 'Stability: Solid staggered stance with braced core'
    },
    targetMuscles: [
      { name: 'Pectoralis Major (Upper & Mid)', role: 'Prime Mover (100%)' },
      { name: 'Anterior Deltoid', role: 'Synergist (70%)' }
    ],
    mistakes: [
      'Overextending shoulders past safe range',
      'Straightening arms and locking elbows'
    ],
    sets: [
      { num: 1, reps: 12, weight: 15, done: false },
      { num: 2, reps: 10, weight: 20, done: false },
      { num: 3, reps: 10, weight: 25, done: false }
    ]
  },

  // =========================================================================
  // ⚡ BACK EXERCISES (5 VARIATIONS)
  // =========================================================================
  {
    id: 'back_1',
    name: 'Wide-Grip Lat Pulldown',
    shortName: 'Var. 1',
    tagline: 'Wide-Grip Lat Pulldown',
    muscle: 'Back',
    equipment: 'Back & Lat Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Pull)',
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'Wide-Grip Lat Pulldown. Retract scapulae, maintain neutral spine.',
      lower: 'Control the eccentric stretch... 3, 2, 1...',
      press: 'Drive elbows down and back! Engage latissimus dorsi!',
      finish: 'Complete pull! Full back contraction.'
    },
    biomechanics: {
      jointAngle: 'Elbow Tracking: Drive elbows tight toward hip crease',
      barPath: 'Pull Trajectory: Smooth straight plane to upper chest',
      footwork: 'Core & Glute Bracing: Zero momentum swing'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi', role: 'Prime Mover (100%)' },
      { name: 'Rhomboids & Mid Trapezius', role: 'Retractors (85%)' },
      { name: 'Biceps Brachii', role: 'Synergist (60%)' }
    ],
    mistakes: [
      'Excessive backward torso swinging using momentum',
      'Failing to depress shoulder blades before pulling',
      'Incomplete range of motion at stretch phase'
    ],
    sets: [
      { num: 1, reps: 10, weight: 55, done: false },
      { num: 2, reps: 10, weight: 65, done: false },
      { num: 3, reps: 8, weight: 75, done: false }
    ]
  },
  {
    id: 'back_2',
    name: 'Seated Cable Row',
    shortName: 'Var. 2',
    tagline: 'Seated Cable Row',
    muscle: 'Back',
    equipment: 'Back & Lat Power',
    tempo: '3-0-1-0 (3s Eccentric, Controlled Row)',
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'Seated Cable Row. Hinge at hips, brace core firmly.',
      lower: 'Lower the weight with full control... 3, 2, 1...',
      press: 'Pull back through your elbows! Squeeze back muscles!',
      finish: 'Strong repetition! Great lat engagement.'
    },
    biomechanics: {
      jointAngle: 'Torso Angle: Solid 45-degree hip hinge',
      barPath: 'Row Path: Direct line to lower ribcage',
      footwork: 'Foot Placement: Shoulder width, rooted into floor'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi & Rhomboids', role: 'Prime Mover (100%)' },
      { name: 'Trapezius & Rear Delts', role: 'Upper Back (85%)' },
      { name: 'Spinal Erectors', role: 'Core Stability (75%)' }
    ],
    mistakes: [
      'Rounding lower spine during the movement',
      'Jerking the weight using hip drive'
    ],
    sets: [
      { num: 1, reps: 10, weight: 50, done: false },
      { num: 2, reps: 10, weight: 60, done: false },
      { num: 3, reps: 8, weight: 70, done: false }
    ]
  },
  {
    id: 'back_3',
    name: 'Single-Arm Dumbbell Row',
    shortName: 'Var. 3',
    tagline: 'Single-Arm Dumbbell Row',
    muscle: 'Back',
    equipment: 'Back & Biceps Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Row)',
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'Single-Arm Row. Set your grip, engage lats firmly.',
      lower: 'Lower the weight smoothly under full control... 3, 2, 1...',
      press: 'Drive elbows back! Squeeze the back and biceps hard!',
      finish: 'Peak back contraction! Excellent execution.'
    },
    biomechanics: {
      jointAngle: 'Elbow Trajectory: Drive elbows straight back along torso',
      barPath: 'Motion Path: Controlled straight plane',
      footwork: 'Core Bracing: Stable posture with neutral spine'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi & Rhomboids', role: 'Prime Mover (100%)' },
      { name: 'Biceps Brachii', role: 'Synergist (85%)' },
      { name: 'Rear Deltoids', role: 'Stabilizer (70%)' }
    ],
    mistakes: [
      'Using momentum or swinging torso',
      'Failing to achieve full contraction at peak'
    ],
    sets: [
      { num: 1, reps: 10, weight: 24, done: false },
      { num: 2, reps: 10, weight: 28, done: false },
      { num: 3, reps: 8, weight: 32, done: false }
    ]
  },
  {
    id: 'back_4',
    name: 'Chest-Supported T-Bar Row',
    shortName: 'Var. 4',
    tagline: 'Chest-Supported T-Bar Row',
    muscle: 'Back',
    equipment: 'Back & Lat Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Drive)',
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'T-Bar Row. Position body firmly, grip and brace.',
      lower: 'Control the descent slowly... 3, 2, 1...',
      press: 'Drive the weight with power! Squeeze the entire back!',
      finish: 'Full lockout and control! Solid back contraction.'
    },
    biomechanics: {
      jointAngle: 'Elbow Tracking: Drive elbows tight into sides',
      barPath: 'Motion Path: Smooth vertical or horizontal arc',
      footwork: 'Stability: Grounded footing for torso balance'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi', role: 'Prime Mover (100%)' },
      { name: 'Middle & Lower Trapezius', role: 'Retractors (85%)' },
      { name: 'Rhomboids & Rear Delts', role: 'Synergists (75%)' }
    ],
    mistakes: [
      'Jerking with body momentum',
      'Failing to control the eccentric phase'
    ],
    sets: [
      { num: 1, reps: 10, weight: 45, done: false },
      { num: 2, reps: 10, weight: 55, done: false },
      { num: 3, reps: 8, weight: 65, done: false }
    ]
  },
  {
    id: 'back_5',
    name: 'Neutral-Grip Lat Pulldown',
    shortName: 'Var. 5',
    tagline: 'Neutral-Grip Lat Pulldown',
    muscle: 'Back',
    equipment: 'Back & Lat Hypertrophy',
    tempo: '3-0-1-0 (3s Eccentric Stretch, Powerful Pull)',
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'Neutral-Grip Pulldown. Set strong posture, engage lats from the start.',
      lower: 'Control the full eccentric lat stretch... 3, 2, 1...',
      press: 'Drive elbows deep and squeeze the upper and mid back!',
      finish: 'Peak contraction! Solid repetition complete.'
    },
    biomechanics: {
      jointAngle: 'Scapular Motion: Full depression and retraction on concentric',
      barPath: 'Pull Trajectory: Smooth arc toward the lower ribcage',
      footwork: 'Core Stability: Brace torso to maintain strict form'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi', role: 'Prime Mover (100%)' },
      { name: 'Rhomboids & Mid Trapezius', role: 'Retractors (85%)' },
      { name: 'Biceps & Rear Deltoids', role: 'Synergists (75%)' }
    ],
    mistakes: [
      'Using body momentum to swing the weight',
      'Rounding the upper back during the eccentric phase'
    ],
    sets: [
      { num: 1, reps: 10, weight: 50, done: false },
      { num: 2, reps: 10, weight: 60, done: false },
      { num: 3, reps: 8, weight: 70, done: false }
    ]
  },

  // =========================================================================
  // 🦵 LEGS EXERCISES (4 VARIATIONS)
  // =========================================================================
  {
    id: 'legs_1',
    name: 'Leg Extension & Quad Power',
    shortName: 'Var. 1',
    tagline: 'Leg Extension & Quad Power',
    muscle: 'Legs',
    equipment: 'Legs & Core Power',
    tempo: '3-0-1-0 (3s Descent, Explosive Ascent)',
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Leg Extension. Align knees with pivot point, lock shins securely.',
      lower: 'Control the eccentric lower slowly... 3, 2, 1...',
      press: 'Drive up with explosive quadriceps force!',
      finish: 'Peak quad squeeze at lockout! Complete control.'
    },
    biomechanics: {
      jointAngle: 'Knee Flexion: Full 90 degrees to complete extension',
      barPath: 'Arc: Pure knee hinge axis of rotation',
      footwork: 'Toes: Point toes straight up for balanced rectus femoris recruitment'
    },
    targetMuscles: [
      { name: 'Quadriceps Femoris (Rectus & Vastus)', role: 'Prime Mover (100%)' },
      { name: 'Patellar Tendon Stabilizers', role: 'Joint Integrity (80%)' }
    ],
    mistakes: [
      'Violent hyperextension at top',
      'Letting the weight stack slam on the descent'
    ],
    sets: [
      { num: 1, reps: 12, weight: 45, done: false },
      { num: 2, reps: 10, weight: 55, done: false },
      { num: 3, reps: 10, weight: 65, done: false }
    ]
  },
  {
    id: 'legs_2',
    name: 'Bulgarian Split Squat',
    shortName: 'Var. 2',
    tagline: 'Bulgarian Split Squat',
    muscle: 'Legs',
    equipment: 'Legs & Core Power',
    tempo: '3-0-1-0 (3s Eccentric, Controlled Drive)',
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Bulgarian Split Squat. Set your foot positioning and brace core.',
      lower: 'Control the descent slowly... 3, 2, 1...',
      press: 'Explode through full range of motion!',
      finish: 'Complete repetition! Maximum leg recruitment.'
    },
    biomechanics: {
      jointAngle: 'Knee Angle: 90 degrees at full depth',
      barPath: 'Path: Controlled biomechanical motion',
      footwork: 'Foot Drive: Full contact on platform'
    },
    targetMuscles: [
      { name: 'Quadriceps & Vastus', role: 'Prime Mover (100%)' },
      { name: 'Hamstrings & Glutes', role: 'Stabilizers (80%)' },
      { name: 'Core', role: 'Support (70%)' }
    ],
    mistakes: [
      'Locking knees violently at apex',
      'Allowing lower back to round'
    ],
    sets: [
      { num: 1, reps: 10, weight: 16, done: false },
      { num: 2, reps: 10, weight: 20, done: false },
      { num: 3, reps: 8, weight: 24, done: false }
    ]
  },
  {
    id: 'legs_3',
    name: '45° Incline Leg Press',
    shortName: 'Var. 3',
    tagline: '45° Incline Leg Press',
    muscle: 'Legs',
    equipment: 'Legs & Quad Power',
    tempo: '3-0-1-0 (3s Descent, Explosive Press)',
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Leg Press. Set your stance firmly, brace abdomen 360 degrees.',
      lower: 'Control the descent down smoothly... 3, 2, 1...',
      press: 'Drive the floor away! Explode with power!',
      finish: 'Complete lockout! Great quad and glute engagement.'
    },
    biomechanics: {
      jointAngle: 'Knee Tracking: Align knees cleanly over toes',
      barPath: 'Motion Path: Controlled biomechanical line',
      footwork: 'Foot Drive: Plant heels firmly into floor'
    },
    targetMuscles: [
      { name: 'Quadriceps Femoris', role: 'Prime Mover (100%)' },
      { name: 'Gluteus Maximus', role: 'Hip Extensor (85%)' },
      { name: 'Hamstrings & Calves', role: 'Stabilizers (70%)' }
    ],
    mistakes: [
      'Allowing knees to cave inward',
      'Lifting heels off the ground'
    ],
    sets: [
      { num: 1, reps: 12, weight: 120, done: false },
      { num: 2, reps: 10, weight: 150, done: false },
      { num: 3, reps: 8, weight: 180, done: false }
    ]
  },
  {
    id: 'legs_4',
    name: 'Dumbbell Goblet Squat',
    shortName: 'Var. 4',
    tagline: 'Dumbbell Goblet Squat',
    muscle: 'Legs',
    equipment: 'Legs & Quad Power',
    tempo: '3-0-1-0 (3s Eccentric Squat, Explosive Drive)',
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Goblet Squat. Brace your core, set athletic stance.',
      lower: 'Descend with control... hips back and down... 3, 2, 1...',
      press: 'Drive the floor away! Power through your quadriceps and glutes!',
      finish: 'Locked out! Powerful repetition complete.'
    },
    biomechanics: {
      jointAngle: 'Knee Tracking: Track knees directly over second toe',
      barPath: 'Force Line: Center of gravity balanced over mid-foot',
      footwork: 'Foot Drive: Tripod foot pressure firmly anchored'
    },
    targetMuscles: [
      { name: 'Quadriceps (Vastus Lateralis/Medialis)', role: 'Prime Mover (100%)' },
      { name: 'Gluteus Maximus & Hamstrings', role: 'Synergists (85%)' },
      { name: 'Core & Spinal Erectors', role: 'Stabilizers (70%)' }
    ],
    mistakes: [
      'Allowing knees to cave inwards (valgus collapse)',
      'Lifting heels off the ground during the movement'
    ],
    sets: [
      { num: 1, reps: 12, weight: 24, done: false },
      { num: 2, reps: 10, weight: 30, done: false },
      { num: 3, reps: 10, weight: 34, done: false }
    ]
  },

  // =========================================================================
  // 💪 ARMS EXERCISES (3 VARIATIONS)
  // =========================================================================
  {
    id: 'arms_1',
    name: 'Standing Biceps Curl',
    shortName: 'Var. 1',
    tagline: 'Standing Biceps Curl',
    muscle: 'Arms',
    equipment: 'Biceps & Triceps Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Curl)',
    image: require('../../assets/workouts/day_6_arms.png'),
    audioCues: {
      intro: 'Biceps Curl. Lock elbows in place, brace core firmly.',
      lower: 'Lower the weight slowly under full tension... 3, 2, 1...',
      press: 'Curl with power! Peak arm contraction at the top!',
      finish: 'Complete repetition! Maximum biceps & triceps pump.'
    },
    biomechanics: {
      jointAngle: 'Elbow Tracking: Keep elbows pinned tight to ribcage',
      barPath: 'Motion Plane: Smooth circular curl arc',
      footwork: 'Foot Drive: Solid grounded stance to prevent swinging'
    },
    targetMuscles: [
      { name: 'Biceps Brachii', role: 'Prime Mover (100%)' },
      { name: 'Brachialis & Forearms', role: 'Synergists (80%)' },
      { name: 'Triceps Brachii', role: 'Antagonist Stabilizer (65%)' }
    ],
    mistakes: [
      'Swinging torso or using momentum from hips',
      'Flaring elbows outward away from the body'
    ],
    sets: [
      { num: 1, reps: 12, weight: 14, done: false },
      { num: 2, reps: 10, weight: 16, done: false },
      { num: 3, reps: 10, weight: 18, done: false }
    ]
  },
  {
    id: 'arms_2',
    name: 'Overhead Triceps Extension',
    shortName: 'Var. 2',
    tagline: 'Overhead Triceps Extension',
    muscle: 'Arms',
    equipment: 'Triceps & Arm Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Extension)',
    image: require('../../assets/workouts/day_6_arms.png'),
    audioCues: {
      intro: 'Triceps Extension. Position shoulders and lock arm angle.',
      lower: 'Control the stretch under full tension... 3, 2, 1...',
      press: 'Extend and drive through the arm muscles!',
      finish: 'Locked out! Peak triceps & arm contraction.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: Full 90-degree flexion to extension',
      barPath: 'Motion Path: Pure hinge motion around elbow joint',
      footwork: 'Stability: Solid athletic stance'
    },
    targetMuscles: [
      { name: 'Triceps Brachii (All Heads)', role: 'Prime Mover (100%)' },
      { name: 'Forearm Flexors & Extensors', role: 'Stabilizers (75%)' }
    ],
    mistakes: [
      'Allowing elbows to flare or drift during extension',
      'Using momentum or shrugging shoulders'
    ],
    sets: [
      { num: 1, reps: 12, weight: 18, done: false },
      { num: 2, reps: 10, weight: 22, done: false },
      { num: 3, reps: 10, weight: 26, done: false }
    ]
  },
  {
    id: 'arms_3',
    name: 'Concentration Hammer Curl',
    shortName: 'Var. 3',
    tagline: 'Concentration Hammer Curl',
    muscle: 'Arms',
    equipment: 'Biceps & Forearm Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Curl)',
    image: require('../../assets/workouts/day_6_arms.png'),
    audioCues: {
      intro: 'Hammer Curl. Lock your posture, plant feet firmly.',
      lower: 'Lower the weight under total control... 3, 2, 1...',
      press: 'Drive the curl up with maximum biceps squeeze!',
      finish: 'Complete repetition! Full arm muscle recruitment.'
    },
    biomechanics: {
      jointAngle: 'Elbow Position: Pinned steady without hip swing',
      barPath: 'Motion Path: Controlled strict arc',
      footwork: 'Stability: Solid athletic base'
    },
    targetMuscles: [
      { name: 'Biceps Brachii (Short & Long Head)', role: 'Prime Mover (100%)' },
      { name: 'Brachialis & Brachioradialis', role: 'Synergists (85%)' }
    ],
    mistakes: [
      'Using torso momentum to swing the weight',
      'Failing to control the lowering phase'
    ],
    sets: [
      { num: 1, reps: 12, weight: 14, done: false },
      { num: 2, reps: 10, weight: 16, done: false },
      { num: 3, reps: 10, weight: 18, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ SHOULDERS EXERCISES (1 VARIATION)
  // =========================================================================
  {
    id: 'shoulders',
    name: 'Overhead Dumbbell Press',
    shortName: 'Var. 1',
    tagline: 'Overhead Dumbbell Press',
    muscle: 'Shoulders',
    equipment: 'Shoulder & Overhead Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Press)',
    image: require('../../assets/workouts/day_5_upper.png'),
    audioCues: {
      intro: 'Overhead Shoulder Press. Plant feet firmly, brace your core 360 degrees.',
      lower: 'Lower the weight under strict control to collarbone... 3, 2, 1...',
      press: 'Drive the weight vertically overhead! Lock elbows at top!',
      finish: 'Solid lockout! Maximum shoulder & deltoid power.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: Tuck elbows slightly at 45 degrees, avoid wide flare',
      barPath: 'Press Path: Vertical straight line clearing face to over crown',
      footwork: 'Glute & Core Bracing: Squeeze glutes to protect lower spine'
    },
    targetMuscles: [
      { name: 'Anterior & Lateral Deltoids', role: 'Prime Mover (100%)' },
      { name: 'Triceps Brachii', role: 'Elbow Extensor (80%)' },
      { name: 'Upper Trapezius & Core', role: 'Stabilizers (75%)' }
    ],
    mistakes: [
      'Arching lower back excessively (lean back)',
      'Flaring elbows out to 90 degrees'
    ],
    sets: [
      { num: 1, reps: 10, weight: 20, done: false },
      { num: 2, reps: 10, weight: 24, done: false },
      { num: 3, reps: 8, weight: 28, done: false }
    ]
  },

  // =========================================================================
  // 🧘 MOBILITY & CORE RESTORATION
  // =========================================================================
  {
    id: 'core_1',
    name: 'Dynamic Hip & Thoracic Mobility',
    shortName: 'Mobility',
    tagline: 'Dynamic Hip & Thoracic Mobility',
    muscle: 'Mobility',
    equipment: 'Bodyweight & Mat',
    tempo: 'Flow (Continuous Controlled Movement)',
    image: require('../../assets/workouts/day_1_core.png'),
    audioCues: {
      intro: 'Thoracic & Hip Opener. Focus on deep diaphragmatic breathing.',
      lower: 'Sink into the deep stretch... expand ribcage...',
      press: 'Rotate through thoracic spine with control.',
      finish: 'Full release achieved! Enhanced joint mobility.'
    },
    biomechanics: {
      jointAngle: 'Spinal Alignment: Lengthen spine without hyper-arching',
      barPath: 'Motion: Smooth rotational flow',
      footwork: 'Grounding: Stable knee and foot anchors'
    },
    targetMuscles: [
      { name: 'Thoracic Spine & Lats', role: 'Mobility (100%)' },
      { name: 'Hip Flexors & Glutes', role: 'Fascial Release (90%)' }
    ],
    mistakes: ['Holding breath during deep stretches', 'Forcing painful ranges'],
    sets: [
      { num: 1, reps: 10, weight: 0, done: false },
      { num: 2, reps: 10, weight: 0, done: false },
      { num: 3, reps: 10, weight: 0, done: false }
    ]
  },
  {
    id: 'core_2',
    name: 'Core Hollow Body Hold & Plank',
    shortName: 'Core',
    tagline: 'Core Hollow Body Hold & Plank',
    muscle: 'Core',
    equipment: 'Bodyweight Armor',
    tempo: 'Isometric Hold (60s Tension)',
    image: require('../../assets/workouts/day_1_core.png'),
    audioCues: {
      intro: 'Hollow Body Hold. Press lumbar spine flat into the floor.',
      lower: 'Maintain 360-degree intra-abdominal pressure...',
      press: 'Lock ribs down to pelvis! Squeeze glutes hard!',
      finish: 'Time complete! Unbreakable core stability.'
    },
    biomechanics: {
      jointAngle: 'Lumbar Spine: Zero gap between lower back and mat',
      barPath: 'Tension: Continuous isometric contraction',
      footwork: 'Legs: Point toes, lock knees straight'
    },
    targetMuscles: [
      { name: 'Transverse Abdominis & Rectus', role: 'Prime Mover (100%)' },
      { name: 'Obliques & Serratus', role: 'Lateral Stabilizers (85%)' }
    ],
    mistakes: ['Lower back arching off floor', 'Shallow breathing'],
    sets: [
      { num: 1, reps: 60, weight: 0, done: false },
      { num: 2, reps: 60, weight: 0, done: false },
      { num: 3, reps: 60, weight: 0, done: false }
    ]
  },
  {
    id: 'rest_1',
    name: 'Full Body Decompression & Recovery',
    shortName: 'Recovery',
    tagline: 'Full Body Decompression & Recovery',
    muscle: 'Recovery',
    equipment: 'Foam Roller & Mat',
    tempo: 'Gentle Fascial Release',
    image: require('../../assets/workouts/day_1_core.png'),
    audioCues: {
      intro: 'Recovery Session. Decompress central nervous system.',
      lower: 'Breathe deeply through your diaphragm...',
      press: 'Release myofascial tension throughout the body.',
      finish: 'Total restoration complete.'
    },
    biomechanics: {
      jointAngle: 'Relaxed posture and decompressed spine',
      barPath: 'Gentle slow rolling',
      footwork: 'Comfortable grounded position'
    },
    targetMuscles: [
      { name: 'Central Nervous System', role: 'Parasympathetic Recovery (100%)' },
      { name: 'Full Body Myofascia', role: 'Restoration (100%)' }
    ],
    mistakes: ['Rushing through relaxation'],
    sets: [
      { num: 1, reps: 15, weight: 0, done: false }
    ]
  }
];

// =========================================================================
// 📅 DYNAMIC 7-DAY SCHEDULE & PROGRAM ROUTINES (MONDAY - SUNDAY)
// =========================================================================
export const WEEKLY_ROUTINES_DB = [
  // 🔴 MONDAY (Day 1 - Index 0): Push Strength
  {
    dayIndex: 0,
    dayCode: 'M',
    dayName: 'Monday',
    dayNum: 1,
    title: 'Push Strength',
    splitLabel: 'Chest, Shoulders & Triceps',
    focus: 'Chest, Shoulders, Triceps',
    intensity: 'High',
    intensityColor: '#EF4444',
    isRest: false,
    durationMin: 50,
    image: require('../../assets/workouts/day_0_push.png'),
    sections: [
      {
        name: 'Chest',
        icon: 'Flame',
        exercises: [EXERCISES_DB[0], EXERCISES_DB[1], EXERCISES_DB[3]]
      },
      {
        name: 'Shoulders',
        icon: 'Zap',
        exercises: [EXERCISES_DB[17]]
      },
      {
        name: 'Triceps',
        icon: 'Dumbbell',
        exercises: [EXERCISES_DB[15]]
      }
    ],
    exercises: [EXERCISES_DB[0], EXERCISES_DB[1], EXERCISES_DB[3], EXERCISES_DB[17], EXERCISES_DB[15]]
  },

  // 🟠 TUESDAY (Day 2 - Index 1): Pull Strength
  {
    dayIndex: 1,
    dayCode: 'T',
    dayName: 'Tuesday',
    dayNum: 2,
    title: 'Pull Strength',
    splitLabel: 'Back & Biceps Power',
    focus: 'Back, Biceps',
    intensity: 'High',
    intensityColor: '#FF4500',
    isRest: false,
    durationMin: 50,
    image: require('../../assets/workouts/day_2_pull.png'),
    sections: [
      {
        name: 'Back',
        icon: 'Flame',
        exercises: [EXERCISES_DB[5], EXERCISES_DB[6], EXERCISES_DB[8]]
      },
      {
        name: 'Biceps',
        icon: 'Dumbbell',
        exercises: [EXERCISES_DB[7], EXERCISES_DB[14], EXERCISES_DB[16]]
      }
    ],
    exercises: [EXERCISES_DB[5], EXERCISES_DB[6], EXERCISES_DB[8], EXERCISES_DB[7], EXERCISES_DB[14], EXERCISES_DB[16]]
  },

  // 🔴 WEDNESDAY (Day 3 - Index 2): Leg Power
  {
    dayIndex: 2,
    dayCode: 'W',
    dayName: 'Wednesday',
    dayNum: 3,
    title: 'Leg Power',
    splitLabel: 'Quads, Hamstrings & Glutes',
    focus: 'Quads, Hamstrings, Glutes',
    intensity: 'High',
    intensityColor: '#EF4444',
    isRest: false,
    durationMin: 55,
    image: require('../../assets/workouts/day_4_legs.png'),
    sections: [
      {
        name: 'Quads',
        icon: 'Zap',
        exercises: [EXERCISES_DB[10], EXERCISES_DB[12]]
      },
      {
        name: 'Hamstrings & Glutes',
        icon: 'Flame',
        exercises: [EXERCISES_DB[11], EXERCISES_DB[13]]
      }
    ],
    exercises: [EXERCISES_DB[10], EXERCISES_DB[12], EXERCISES_DB[11], EXERCISES_DB[13]]
  },

  // 🟢 THURSDAY (Day 4 - Index 3): Active Recovery
  {
    dayIndex: 3,
    dayCode: 'T',
    dayName: 'Thursday',
    dayNum: 4,
    title: 'Active Recovery',
    splitLabel: 'Mobility, Core & Light Cardio',
    focus: 'Mobility, Core, Light Cardio',
    intensity: 'Low',
    intensityColor: '#10B981',
    isRest: false,
    durationMin: 35,
    image: require('../../assets/workouts/day_1_core.png'),
    sections: [
      {
        name: 'Mobility & Core',
        icon: 'Activity',
        exercises: [EXERCISES_DB[18], EXERCISES_DB[19]]
      }
    ],
    exercises: [EXERCISES_DB[18], EXERCISES_DB[19]]
  },

  // 🟣 FRIDAY (Day 5 - Index 4): Upper Body
  {
    dayIndex: 4,
    dayCode: 'F',
    dayName: 'Friday',
    dayNum: 5,
    title: 'Upper Body',
    splitLabel: 'Chest, Back, Shoulders & Arms',
    focus: 'Chest, Back, Shoulders, Arms',
    intensity: 'High',
    intensityColor: '#8B5CF6',
    isRest: false,
    durationMin: 50,
    image: require('../../assets/workouts/day_5_upper.png'),
    sections: [
      {
        name: 'Chest & Shoulders',
        icon: 'Flame',
        exercises: [EXERCISES_DB[2], EXERCISES_DB[17]]
      },
      {
        name: 'Back & Arms',
        icon: 'Dumbbell',
        exercises: [EXERCISES_DB[9], EXERCISES_DB[14], EXERCISES_DB[15]]
      }
    ],
    exercises: [EXERCISES_DB[2], EXERCISES_DB[17], EXERCISES_DB[9], EXERCISES_DB[14], EXERCISES_DB[15]]
  },

  // 🟡 SATURDAY (Day 6 - Index 5): Lower Body
  {
    dayIndex: 5,
    dayCode: 'S',
    dayName: 'Saturday',
    dayNum: 6,
    title: 'Lower Body',
    splitLabel: 'Legs, Glutes & Core',
    focus: 'Legs, Glutes, Core',
    intensity: 'High',
    intensityColor: '#F59E0B',
    isRest: false,
    durationMin: 50,
    image: require('../../assets/workouts/day_4_legs.png'),
    sections: [
      {
        name: 'Legs & Glutes',
        icon: 'Flame',
        exercises: [EXERCISES_DB[12], EXERCISES_DB[11], EXERCISES_DB[13]]
      },
      {
        name: 'Core Armor',
        icon: 'Shield',
        exercises: [EXERCISES_DB[19]]
      }
    ],
    exercises: [EXERCISES_DB[12], EXERCISES_DB[11], EXERCISES_DB[13], EXERCISES_DB[19]]
  },

  // 🔵 SUNDAY (Day 7 - Index 6): Recovery Day
  {
    dayIndex: 6,
    dayCode: 'S',
    dayName: 'Sunday',
    dayNum: 7,
    title: 'Recovery Day',
    splitLabel: 'Rest & Deep Mobility',
    focus: 'Rest, Mobility',
    intensity: 'Low / Recovery',
    intensityColor: '#0EA5E9',
    isRest: true,
    durationMin: 30,
    image: require('../../assets/workouts/day_1_core.png'),
    sections: [
      {
        name: 'Full Body Restoration',
        icon: 'Moon',
        exercises: [EXERCISES_DB[20]]
      }
    ],
    exercises: [EXERCISES_DB[20]]
  }
];
