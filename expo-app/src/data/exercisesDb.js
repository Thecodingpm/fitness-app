// =========================================================================
// 🏋️ ENTERPRISE FITNESS APP - EXERCISES & ROUTINES DATABASE
// =========================================================================

export const EXERCISES_DB = [
  // =========================================================================
  // 🏋️ CHEST EXERCISES (5 VARIATIONS)
  // =========================================================================
  {
    id: 'chest_1',
    name: 'Chest (Variation 1)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'chest_2',
    name: 'Chest (Variation 2)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'chest_3',
    name: 'Chest (Variation 3)',
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
      { num: 1, reps: 12, weight: 20, done: false },
      { num: 2, reps: 10, weight: 25, done: false },
      { num: 3, reps: 10, weight: 30, done: false }
    ]
  },
  {
    id: 'chest_4',
    name: 'Chest (Variation 4)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'chest_5',
    name: 'Chest (Variation 5)',
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
      { num: 1, reps: 12, weight: 25, done: false },
      { num: 2, reps: 10, weight: 30, done: false },
      { num: 3, reps: 10, weight: 35, done: false }
    ]
  },

  // =========================================================================
  // ⚡ BACK EXERCISES (5 VARIATIONS)
  // =========================================================================
  {
    id: 'back_1',
    name: 'Back (Variation 1)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'back_2',
    name: 'Back (Variation 2)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'back_3',
    name: 'Back (Variation 3)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'back_4',
    name: 'Back (Variation 4)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'back_5',
    name: 'Back (Variation 5)',
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
    name: 'Legs (Variation 1)',
    shortName: 'Var. 1',
    tagline: 'Leg Extension & Quad Power',
    muscle: 'Legs',
    equipment: 'Legs & Core Power',
    tempo: '3-0-1-0 (3s Descent, Explosive Ascent)',
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Barbell Squat. Stand tall, brace your abdomen 360 degrees.',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'legs_2',
    name: 'Legs (Variation 2)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'legs_3',
    name: 'Legs (Variation 3)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },
  {
    id: 'legs_4',
    name: 'Legs (Variation 4)',
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
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 10, weight: 70, done: false },
      { num: 3, reps: 8, weight: 80, done: false }
    ]
  },

  // =========================================================================
  // 💪 ARMS EXERCISES (3 VARIATIONS)
  // =========================================================================
  {
    id: 'arms_1',
    name: 'Arms (Variation 1)',
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
      { num: 1, reps: 12, weight: 20, done: false },
      { num: 2, reps: 10, weight: 25, done: false },
      { num: 3, reps: 10, weight: 30, done: false }
    ]
  },
  {
    id: 'arms_2',
    name: 'Arms (Variation 2)',
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
      { num: 1, reps: 12, weight: 20, done: false },
      { num: 2, reps: 10, weight: 25, done: false },
      { num: 3, reps: 10, weight: 30, done: false }
    ]
  },
  {
    id: 'arms_3',
    name: 'Arms (Variation 3)',
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
      { num: 1, reps: 12, weight: 20, done: false },
      { num: 2, reps: 10, weight: 25, done: false },
      { num: 3, reps: 10, weight: 30, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ SHOULDERS EXERCISES (1 VARIATION)
  // =========================================================================
  {
    id: 'shoulders',
    name: 'Shoulders (Variation 1)',
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
      { num: 1, reps: 10, weight: 40, done: false },
      { num: 2, reps: 10, weight: 45, done: false },
      { num: 3, reps: 8, weight: 50, done: false }
    ]
  }
];

// =========================================================================
// 📅 DYNAMIC 7-DAY SCHEDULE & PROGRAM ROUTINES
// =========================================================================
export const WEEKLY_ROUTINES_DB = [
  {
    dayIndex: 0, // Sunday
    dayCode: 'S',
    dayName: 'Sunday',
    isRest: false,
    title: 'Push Hypertrophy',
    splitLabel: 'Chest, Shoulders & Triceps',
    dayNum: 1,
    focus: 'Hypertrophy & Upper Body Pressing',
    durationMin: 45,
    image: require('../../assets/workouts/day_0_push.png'),
    exercises: [EXERCISES_DB[0], EXERCISES_DB[1], EXERCISES_DB[2]]
  },
  {
    dayIndex: 1, // Monday
    dayCode: 'M',
    dayName: 'Monday',
    isRest: false,
    title: 'Core & Mobility Blast',
    splitLabel: 'Core & Dynamic Mobility',
    dayNum: 2,
    focus: 'Core Stabilization & Hip Mobility',
    durationMin: 35,
    image: require('../../assets/workouts/day_1_core.png'),
    exercises: [EXERCISES_DB[10], EXERCISES_DB[11]]
  },
  {
    dayIndex: 2, // Tuesday
    dayCode: 'T',
    dayName: 'Tuesday',
    isRest: false,
    title: 'Pull Strength & Lats',
    splitLabel: 'Back & Biceps Power',
    dayNum: 3,
    focus: 'Lat Width & Thickness',
    durationMin: 50,
    image: require('../../assets/workouts/day_2_pull.png'),
    exercises: [EXERCISES_DB[5], EXERCISES_DB[6], EXERCISES_DB[7]]
  },
  {
    dayIndex: 3, // Wednesday
    dayCode: 'W',
    dayName: 'Wednesday',
    isRest: false,
    title: 'Back Day Hypertrophy',
    splitLabel: 'Upper & Lower Back Power',
    dayNum: 4,
    focus: 'Rhomboids, Mid-Traps & Rear Delts',
    durationMin: 45,
    image: require('../../assets/workouts/day_3_back.png'),
    exercises: [EXERCISES_DB[5], EXERCISES_DB[8], EXERCISES_DB[9]]
  },
  {
    dayIndex: 4, // Thursday
    dayCode: 'T',
    dayName: 'Thursday',
    isRest: false,
    title: 'Legs & Quad Power',
    splitLabel: 'Legs (Quads, Glutes & Abs)',
    dayNum: 5,
    focus: 'Quad Hypertrophy, Glutes & Deep Core',
    durationMin: 55,
    image: require('../../assets/workouts/day_4_legs.png'),
    exercises: [EXERCISES_DB[10], EXERCISES_DB[11], EXERCISES_DB[12], EXERCISES_DB[13]]
  },
  {
    dayIndex: 5, // Friday
    dayCode: 'F',
    dayName: 'Friday',
    isRest: false,
    title: 'Upper Body Shred',
    splitLabel: 'Shoulders, Chest & Arms',
    dayNum: 6,
    focus: 'Deltoid Definition & Triceps',
    durationMin: 45,
    image: require('../../assets/workouts/day_5_upper.png'),
    exercises: [EXERCISES_DB[17], EXERCISES_DB[14], EXERCISES_DB[15]]
  },
  {
    dayIndex: 6, // Saturday
    dayCode: 'S',
    dayName: 'Saturday',
    isRest: false,
    title: 'Arms & Conditioning',
    splitLabel: 'Biceps, Triceps & Forearms',
    dayNum: 7,
    focus: 'Full Lower Body & Arm Explosive Strength',
    durationMin: 45,
    image: require('../../assets/workouts/day_6_arms.png'),
    exercises: [EXERCISES_DB[14], EXERCISES_DB[15], EXERCISES_DB[16]]
  }
];
