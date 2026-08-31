// =========================================================================
// 🏋️ 3D ANATOMICAL EXERCISE & BIOMECHANICS DATABASE
// =========================================================================
export const BACKGROUND_SLIDES = [
  {
    id: '1',
    uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    tag: 'PROGRESSIVE OVERLOAD',
    headline: 'Turn your training into visible\nprogress.'
  },
  {
    id: '2',
    uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    tag: 'AI VOICE CADENCE',
    headline: 'Hands-free tempo & form coach\nfor AirPods.'
  },
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    tag: '3D ANATOMY',
    headline: 'Master execution with live active\nmuscle highlights.'
  }
];

export const EXERCISES_DB = [
  {
    id: 'chest_1',
    name: 'Chest (Variation 1)',
    muscle: 'Chest',
    equipment: 'Chest & Push Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Press)',
    videoUri: require('../../assets/exercises/chest.mp4'),
    localVideo: require('../../assets/exercises/chest.mp4'),
    image: require('../../assets/exercises/chest.png'),
    audioCues: {
      intro: 'Chest Exercise 1. Retract shoulder blades, plant feet firmly.',
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
    muscle: 'Chest',
    equipment: 'Chest & Push Power',
    tempo: '3-0-1-0 (3s Eccentric, Controlled Press)',
    videoUri: require('../../assets/exercises/44chest.mp4'),
    localVideo: require('../../assets/exercises/44chest.mp4'),
    image: require('../../assets/exercises/chest.png'),
    audioCues: {
      intro: 'Chest Exercise 2. Position shoulders securely, engage chest.',
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
    muscle: 'Chest',
    equipment: 'Chest & Cable Fly',
    tempo: '3-0-1-0 (3s Eccentric Fly, Peak Squeeze)',
    videoUri: require('../../assets/exercises/22back.mp4'),
    localVideo: require('../../assets/exercises/22back.mp4'),
    image: require('../../assets/exercises/chest.png'),
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
    muscle: 'Chest',
    equipment: 'Chest & Power Push',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Press)',
    videoUri: require('../../assets/exercises/100chest.mp4'),
    localVideo: require('../../assets/exercises/100chest.mp4'),
    image: require('../../assets/exercises/chest.png'),
    audioCues: {
      intro: 'Chest Exercise 4. Plant feet firmly, brace core.',
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
      { name: 'Pectoralis Major', role: 'Prime Mover (100%)' },
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
    muscle: 'Chest',
    equipment: 'Chest & Pec Fly',
    tempo: '3-0-1-0 (3s Eccentric Fly, Explosive Squeeze)',
    videoUri: require('../../assets/exercises/fly_chest.mp4'),
    localVideo: require('../../assets/exercises/fly_chest.mp4'),
    image: require('../../assets/exercises/chest.png'),
    audioCues: {
      intro: 'Chest Fly Exercise. Retract shoulder blades, keep chest elevated.',
      lower: 'Open arms with soft elbows... feel the deep pectoral stretch... 3, 2, 1...',
      press: 'Squeeze pectorals inward to the center!',
      finish: 'Peak chest contraction! Complete repetition.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: Constant soft 20-degree bend',
      barPath: 'Fly Path: Smooth horizontal arc to sternum midline',
      footwork: 'Stability: Solid back support and core bracing'
    },
    targetMuscles: [
      { name: 'Pectoralis Major', role: 'Prime Mover (100%)' },
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
  {
    id: 'back_1',
    name: 'Back (Variation 1)',
    muscle: 'Back',
    equipment: 'Back & Lat Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Pull)',
    videoUri: require('../../assets/exercises/back.mp4'),
    localVideo: require('../../assets/exercises/back.mp4'),
    image: require('../../assets/exercises/back.png'),
    audioCues: {
      intro: 'Back Exercise 1. Retract scapulae, maintain neutral spine.',
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
    muscle: 'Back',
    equipment: 'Back & Lat Power',
    tempo: '3-0-1-0 (3s Eccentric, Controlled Row)',
    videoUri: require('../../assets/exercises/1back.mp4'),
    localVideo: require('../../assets/exercises/1back.mp4'),
    image: require('../../assets/exercises/back.png'),
    audioCues: {
      intro: 'Back Exercise 2. Hinge at hips, brace core firmly.',
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
    muscle: 'Back',
    equipment: 'Back & Biceps Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Row)',
    videoUri: require('../../assets/exercises/77back_biceps.mp4'),
    localVideo: require('../../assets/exercises/77back_biceps.mp4'),
    image: require('../../assets/exercises/back.png'),
    audioCues: {
      intro: 'Back & Biceps Exercise. Set your grip, engage lats firmly.',
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
    muscle: 'Back',
    equipment: 'Back & Lat Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Drive)',
    videoUri: require('../../assets/exercises/99backk.mp4'),
    localVideo: require('../../assets/exercises/99backk.mp4'),
    image: require('../../assets/exercises/back.png'),
    audioCues: {
      intro: 'Back Exercise 4. Position body firmly, grip and brace.',
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
    id: 'legs_1',
    name: 'Legs (Variation 1)',
    muscle: 'Legs',
    equipment: 'Legs & Core Power',
    tempo: '3-0-1-0 (3s Descent, Explosive Ascent)',
    videoUri: require('../../assets/exercises/22legs.mp4'),
    localVideo: require('../../assets/exercises/22legs.mp4'),
    image: require('../../assets/workouts/legs_and_core.png'),
    audioCues: {
      intro: 'Legs Exercise 1. Stand tall, brace your abdomen 360 degrees.',
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
    muscle: 'Legs',
    equipment: 'Legs & Core Power',
    tempo: '3-0-1-0 (3s Eccentric, Controlled Drive)',
    videoUri: require('../../assets/exercises/newnew_legs.mp4'),
    localVideo: require('../../assets/exercises/newnew_legs.mp4'),
    image: require('../../assets/workouts/legs_and_core.png'),
    audioCues: {
      intro: 'Legs Exercise 2. Set your foot positioning and brace core.',
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
      { name: 'Quadriceps & VASTUS', role: 'Prime Mover (100%)' },
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
    muscle: 'Legs',
    equipment: 'Legs & Quad Power',
    tempo: '3-0-1-0 (3s Descent, Explosive Press)',
    videoUri: require('../../assets/exercises/0olegs.mp4'),
    localVideo: require('../../assets/exercises/0olegs.mp4'),
    image: require('../../assets/workouts/legs_and_core.png'),
    audioCues: {
      intro: 'Legs Exercise 3. Set your stance firmly, brace abdomen 360 degrees.',
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
    id: 'arms_1',
    name: 'Arms (Variation 1)',
    muscle: 'Arms',
    equipment: 'Biceps & Triceps Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Curl)',
    videoUri: require('../../assets/exercises/arms.mp4'),
    localVideo: require('../../assets/exercises/arms.mp4'),
    image: require('../../assets/exercises/arms.png'),
    audioCues: {
      intro: 'Arms Exercise 1. Lock elbows in place, brace core firmly.',
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
    muscle: 'Arms',
    equipment: 'Triceps & Arm Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Extension)',
    videoUri: require('../../assets/exercises/33arms.mp4'),
    localVideo: require('../../assets/exercises/33arms.mp4'),
    image: require('../../assets/exercises/arms.png'),
    audioCues: {
      intro: 'Arms Exercise 2. Position shoulders and lock arm angle.',
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
    muscle: 'Arms',
    equipment: 'Biceps & Forearm Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Curl)',
    videoUri: require('../../assets/exercises/99arms.mp4'),
    localVideo: require('../../assets/exercises/99arms.mp4'),
    image: require('../../assets/exercises/arms.png'),
    audioCues: {
      intro: 'Arms Exercise 3. Lock your posture, plant feet firmly.',
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
  {
    id: 'shoulders',
    name: 'Shoulders',
    muscle: 'Shoulders',
    equipment: 'Shoulder & Overhead Power',
    tempo: '3-0-1-0 (3s Eccentric, Explosive Press)',
    videoUri: require('../../assets/exercises/shoulder_press.mp4'),
    localVideo: require('../../assets/exercises/shoulder_press.mp4'),
    image: require('../../assets/exercises/shoulders.png'),
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
    title: 'Legs',
    splitLabel: 'Legs (Quads, Glutes & Abs)',
    dayNum: 1,
    focus: 'Legs & Core Power',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  },
  {
    dayIndex: 1, // Monday
    dayCode: 'M',
    dayName: 'Monday',
    isRest: false,
    title: 'Legs & Core Blast',
    splitLabel: 'Legs & Core',
    dayNum: 2,
    focus: 'Core Stabilization & Hip Mobility',
    durationMin: 35,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  },
  {
    dayIndex: 2, // Tuesday
    dayCode: 'T',
    dayName: 'Tuesday',
    isRest: false,
    title: 'Legs Drive',
    splitLabel: 'Legs (Quads & Glutes)',
    dayNum: 3,
    focus: 'Quad Hypertrophy & Hamstrings',
    durationMin: 50,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  },
  {
    dayIndex: 3, // Wednesday
    dayCode: 'W',
    dayName: 'Wednesday',
    isRest: false,
    title: 'Legs Power',
    splitLabel: 'Legs & Posterior Chain',
    dayNum: 4,
    focus: 'Leg Power & Core Armor',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  },
  {
    dayIndex: 4, // Thursday
    dayCode: 'T',
    dayName: 'Thursday',
    isRest: false,
    title: 'Legs',
    splitLabel: 'Legs (Quads, Glutes & Abs)',
    dayNum: 5,
    focus: 'Quad Hypertrophy, Glutes & Deep Core',
    durationMin: 55,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  },
  {
    dayIndex: 5, // Friday
    dayCode: 'F',
    dayName: 'Friday',
    isRest: false,
    title: 'Legs Shred',
    splitLabel: 'Legs & Lower Body',
    dayNum: 6,
    focus: 'Leg Drive & Quad Definition',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  },
  {
    dayIndex: 6, // Saturday
    dayCode: 'S',
    dayName: 'Saturday',
    isRest: false,
    title: 'Legs Conditioning',
    splitLabel: 'Legs, Calves & Core',
    dayNum: 7,
    focus: 'Full Lower Body Explosive Strength',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [EXERCISES_DB[0]]
  }
];
