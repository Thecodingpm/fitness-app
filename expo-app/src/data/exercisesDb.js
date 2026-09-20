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
  // =========================================================================
  // 🏋️ CHEST EXERCISES
  // =========================================================================
  {
    id: 'chest_1',
    name: 'Barbell Bench Press',
    shortName: 'Bench Press',
    tagline: 'Compound Chest & Triceps Overload',
    muscle: 'Chest',
    equipment: 'Barbell & Flat Bench',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '3-1-1-0 (3s Control, 1s Pause, Explosive Press)',
    videoUri: require('../../assets/exercises/barbell_bench_press.mp4'),
    localVideo: require('../../assets/exercises/barbell_bench_press.mp4'),
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Barbell Bench Press. Retract your scapula, arch slightly, and plant your feet firmly.',
      lower: 'Control the descent down to lower sternum... 3, 2, 1...',
      press: 'Drive with your legs, press up explosively and squeeze your pecs at lockout!',
      finish: 'Racked cleanly! Tremendous chest activation.'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: 45° to 60° tucked relative to torso',
      barPath: 'Bar Path: Gentle arc from lower sternum to over shoulders',
      footwork: 'Leg Drive: Keep heels drove down for core and arch rigidity'
    },
    targetMuscles: [
      { name: 'Pectoralis Major', role: 'Prime Mover (100%)' },
      { name: 'Anterior Deltoid', role: 'Synergist (75%)' },
      { name: 'Triceps Brachii', role: 'Elbow Extensor (70%)' }
    ],
    mistakes: [
      'Flaring elbows out to 90 degrees (strains the rotator cuff)',
      'Bouncing the bar off your sternum',
      'Lifting your glutes off the bench'
    ],
    sets: [
      { num: 1, reps: 10, weight: 60, done: false },
      { num: 2, reps: 8, weight: 70, done: false },
      { num: 3, reps: 6, weight: 80, done: false },
      { num: 4, reps: 6, weight: 85, done: false }
    ]
  },
  {
    id: 'chest_2',
    name: 'Push-Up',
    shortName: 'Push-Up',
    tagline: 'Bodyweight Chest & Core Alignment',
    muscle: 'Chest',
    equipment: 'Calisthenics / Floor',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-1-1-0 (2s Lower, 1s Hover, Quick Press)',
    videoUri: require('../../assets/exercises/push_up.mp4'),
    localVideo: require('../../assets/exercises/push_up.mp4'),
    image: require('../../assets/workouts/day_0_push.png'),
    audioCues: {
      intro: 'Push-Up. Hands shoulder-width apart, brace your core into a rigid plank.',
      lower: 'Lower your chest smoothly until hovering 2 inches off the ground... 2, 1...',
      press: 'Push the floor away! Full chest contraction at the apex.',
      finish: 'Flawless cadence and straight spinal line!'
    },
    biomechanics: {
      jointAngle: 'Elbow Angle: 45° arrow angle from shoulders',
      barPath: 'Torso: Rigid unbroken straight line from heels to crown',
      footwork: 'Toes: Firmly dug in, glutes tight'
    },
    targetMuscles: [
      { name: 'Pectoralis Major', role: 'Prime Mover (100%)' },
      { name: 'Triceps Brachii', role: 'Synergist (65%)' },
      { name: 'Rectus Abdominis', role: 'Isometric Stabilizer (80%)' }
    ],
    mistakes: [
      'Sagging lower back or hips',
      'Craning the neck forward toward the ground',
      'Flaring elbows straight out sideways'
    ],
    sets: [
      { num: 1, reps: 15, weight: 0, done: false },
      { num: 2, reps: 12, weight: 0, done: false },
      { num: 3, reps: 10, weight: 0, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ BACK EXERCISES
  // =========================================================================
  {
    id: 'back_1',
    name: 'Lat Pulldown',
    shortName: 'Lat Pulldown',
    tagline: 'Wide V-Taper Lat Engagement',
    muscle: 'Back',
    equipment: 'Cable Machine & Lat Bar',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-1 (2s Negative, Explosive Pull, 1s Squeeze)',
    videoUri: require('../../assets/exercises/lat_pulldown.mp4'),
    localVideo: require('../../assets/exercises/lat_pulldown.mp4'),
    image: require('../../assets/workouts/day_2_pull.png'),
    audioCues: {
      intro: 'Lat Pulldown. Grip slightly wider than shoulders, puff out your chest.',
      lower: 'Drive your elbows down and back toward your ribs!',
      press: 'Squeeze the lats at collarbone level... Hold!',
      finish: 'Full stretch at the top without shrugging.'
    },
    biomechanics: {
      jointAngle: 'Shoulder Extension: Drive elbows down into back pockets',
      barPath: 'Bar Path: Vertical pull to upper collarbone',
      footwork: 'Thigh Pads: Locked snug over quadriceps'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi', role: 'Prime Mover (100%)' },
      { name: 'Biceps Brachii', role: 'Synergist (65%)' },
      { name: 'Lower Trapezius & Rhomboids', role: 'Scapular Depressor (80%)' }
    ],
    mistakes: [
      'Swinging torso backwards excessively for momentum',
      'Pulling the bar behind the neck',
      'Rounding shoulders forward at the bottom'
    ],
    sets: [
      { num: 1, reps: 12, weight: 45, done: false },
      { num: 2, reps: 10, weight: 55, done: false },
      { num: 3, reps: 8, weight: 65, done: false }
    ]
  },
  {
    id: 'back_2',
    name: 'Seated Cable Row',
    shortName: 'Cable Row',
    tagline: 'Mid-Back & Rhomboid Thickness',
    muscle: 'Back',
    equipment: 'Low Cable & V-Bar',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-1-1-1 (2s Stretch, 1s Pull, 1s Peak Squeeze)',
    videoUri: require('../../assets/exercises/seated_cable_row.mp4'),
    localVideo: require('../../assets/exercises/seated_cable_row.mp4'),
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'Seated Cable Row. Sit tall, neutral spine, knees slightly unlocked.',
      lower: 'Let the weight stretch your lats forward with control... 2, 1...',
      press: 'Pull the handle to your belly button and retract your shoulder blades!',
      finish: 'Locked in! Perfect back thickness work.'
    },
    biomechanics: {
      jointAngle: 'Torso: Held at 90° to 95° perpendicular to bench',
      barPath: 'Pull Path: Directly toward mid-abdomen',
      footwork: 'Foot Platform: Midfoot planted firmly, knees soft'
    },
    targetMuscles: [
      { name: 'Rhomboids & Mid-Traps', role: 'Prime Mover (100%)' },
      { name: 'Latissimus Dorsi', role: 'Synergist (85%)' },
      { name: 'Erector Spinae', role: 'Isometric Stabilizer (70%)' }
    ],
    mistakes: [
      'Hyperextending or rocking lumbar spine back and forth',
      'Shrugging shoulders into ears',
      'Initiating with arms instead of retracting scapula'
    ],
    sets: [
      { num: 1, reps: 12, weight: 40, done: false },
      { num: 2, reps: 10, weight: 50, done: false },
      { num: 3, reps: 10, weight: 55, done: false }
    ]
  },
  {
    id: 'back_3',
    name: 'Deadlift',
    shortName: 'Deadlift',
    tagline: 'King of Posterior Chain Strength',
    muscle: 'Back',
    equipment: 'Barbell & Olympic Plates',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-1-1-0 (2s Lower, Reset, Explosive Pull)',
    videoUri: require('../../assets/exercises/deadlift.mp4'),
    localVideo: require('../../assets/exercises/deadlift.mp4'),
    image: require('../../assets/workouts/day_3_back.png'),
    audioCues: {
      intro: 'Conventional Deadlift. Bar over midfoot, brace lats, take the slack out.',
      lower: 'Hinge back at the hips, keeping the bar glued to your shins... 2, 1...',
      press: 'Drive the world away through your heels and stand tall with glutes clenched!',
      finish: 'Solid lockout! Heavy posterior chain overload.'
    },
    biomechanics: {
      jointAngle: 'Hip Hinge: Hips between knees and shoulders',
      barPath: 'Bar Path: Purely vertical over midfoot line',
      footwork: 'Stance: Hip-width apart, toes pointed slightly out'
    },
    targetMuscles: [
      { name: 'Gluteus Maximus & Hamstrings', role: 'Prime Mover (100%)' },
      { name: 'Erector Spinae', role: 'Spine Shield (95%)' },
      { name: 'Latissimus Dorsi & Traps', role: 'Upper Stabilizer (85%)' }
    ],
    mistakes: [
      'Rounding the lower back (cat back)',
      'Letting the bar drift away from the legs',
      'Hyperextending lumbar spine at top lockout'
    ],
    sets: [
      { num: 1, reps: 8, weight: 80, done: false },
      { num: 2, reps: 6, weight: 100, done: false },
      { num: 3, reps: 5, weight: 120, done: false },
      { num: 4, reps: 3, weight: 140, done: false }
    ]
  },
  {
    id: 'back_4',
    name: 'T-Bar Row',
    shortName: 'T-Bar Row',
    tagline: 'Upper Back & Lat Hypertrophy',
    muscle: 'Back',
    equipment: 'T-Bar Row Machine / Landmine',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-1 (2s Lower, Powerful Row, 1s Squeeze)',
    videoUri: require('../../assets/exercises/11backk.mp4'),
    localVideo: require('../../assets/exercises/11backk.mp4'),
    image: require('../../assets/workouts/day_2_pull.png'),
    audioCues: {
      intro: 'T-Bar Row. Chest supported or 45-degree hinge, tight lower back.',
      lower: 'Full lat stretch at the bottom without losing spinal neutral... 2, 1...',
      press: 'Row up hard! Squeeze your shoulder blades together!',
      finish: 'Racked! Phenomenal upper back contraction.'
    },
    biomechanics: {
      jointAngle: 'Torso Angle: Rigid 45-degree hinge',
      barPath: 'Pull Path: Arc up toward upper ribs',
      footwork: 'Foot Platform: Solid bilateral base'
    },
    targetMuscles: [
      { name: 'Latissimus Dorsi', role: 'Prime Mover (100%)' },
      { name: 'Rhomboids & Trapezius', role: 'Synergist (90%)' },
      { name: 'Posterior Deltoid', role: 'Synergist (70%)' }
    ],
    mistakes: [
      'Bouncing knees or using hip drive to cheat the weight',
      'Over-flaring elbows',
      'Failing to get full extension at bottom'
    ],
    sets: [
      { num: 1, reps: 10, weight: 35, done: false },
      { num: 2, reps: 8, weight: 45, done: false },
      { num: 3, reps: 8, weight: 50, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ LEGS EXERCISES
  // =========================================================================
  {
    id: 'legs_1',
    name: 'Barbell Squats',
    shortName: 'Squat',
    tagline: 'Foundational Lower Body Overload',
    muscle: 'Legs',
    equipment: 'Barbell & Squat Rack',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '3-1-1-0 (3s Descent, 1s in Hole, Explosive Drive)',
    videoUri: require('../../assets/exercises/barbell_squats.mp4'),
    localVideo: require('../../assets/exercises/barbell_squats.mp4'),
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Barbell Back Squat. Bar racked tight across traps, big breath into the belly.',
      lower: 'Sit back and down, knees tracking over toes... 3, 2, 1...',
      press: 'Drive hard through midfoot! Explode out of the hole!',
      finish: 'Tall lockout! Maximum quad and glute power.'
    },
    biomechanics: {
      jointAngle: 'Depth: Hip crease parallel or below knee joint',
      barPath: 'Bar Path: Straight vertical plumb-line over midfoot',
      footwork: 'Stance: Shoulder-width, toes angled out 15° to 30°'
    },
    targetMuscles: [
      { name: 'Quadriceps', role: 'Prime Mover (100%)' },
      { name: 'Gluteus Maximus', role: 'Hip Extensor (90%)' },
      { name: 'Core & Erector Spinae', role: 'Spinal Armor (85%)' }
    ],
    mistakes: [
      'Knees caving inward (valgus collapse)',
      'Rising onto toes / heels lifting',
      'Excessive forward torso collapse'
    ],
    sets: [
      { num: 1, reps: 10, weight: 70, done: false },
      { num: 2, reps: 8, weight: 90, done: false },
      { num: 3, reps: 6, weight: 105, done: false },
      { num: 4, reps: 6, weight: 115, done: false }
    ]
  },
  {
    id: 'legs_2',
    name: 'Leg Press',
    shortName: 'Leg Press',
    tagline: '45-Degree Quad & Glute Hypertrophy',
    muscle: 'Legs',
    equipment: '45° Leg Press Sled',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '3-0-1-0 (3s Descent, Explosive Press)',
    videoUri: require('../../assets/exercises/leg_press.mp4'),
    localVideo: require('../../assets/exercises/leg_press.mp4'),
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: '45-Degree Leg Press. Hips anchored firmly into the seat back.',
      lower: 'Lower the sled smoothly without rounding your tailbone... 3, 2, 1...',
      press: 'Drive the sled away through your heels! Do not soft lock your knees!',
      finish: 'Safety levers locked! Tremendous quad pump.'
    },
    biomechanics: {
      jointAngle: 'Knee Angle: 90° flexion at bottom',
      barPath: 'Sled Track: Pure 45-degree linear plane',
      footwork: 'Foot Placement: Shoulder-width on middle of platform'
    },
    targetMuscles: [
      { name: 'Quadriceps', role: 'Prime Mover (100%)' },
      { name: 'Gluteus Maximus', role: 'Hip Extensor (75%)' },
      { name: 'Hamstrings', role: 'Stabilizer (40%)' }
    ],
    mistakes: [
      'Locking out knees completely with hyperextension',
      'Allowing lower back or glutes to peel off the pad',
      'Letting knees collapse inward'
    ],
    sets: [
      { num: 1, reps: 12, weight: 120, done: false },
      { num: 2, reps: 10, weight: 160, done: false },
      { num: 3, reps: 8, weight: 200, done: false }
    ]
  },
  {
    id: 'legs_3',
    name: 'Leg Extension',
    shortName: 'Leg Extension',
    tagline: 'Direct Quad Isolation & Rectus Femoris',
    muscle: 'Legs',
    equipment: 'Leg Extension Machine',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-1 (2s Lower, Explosive Kick, 1s Peak Squeeze)',
    videoUri: require('../../assets/exercises/leg_extension.mp4'),
    localVideo: require('../../assets/exercises/leg_extension.mp4'),
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Leg Extension. Align knee joint with the machine pivot point.',
      lower: 'Control the pad on the descent... 2, 1...',
      press: 'Extend your legs to full lockout and squeeze your quads hard!',
      finish: 'Pad rests smoothly. Pure quad definition achieved.'
    },
    biomechanics: {
      jointAngle: 'Knee Joint: Pivot aligned with machine axis of rotation',
      barPath: 'Pad Path: Rotational arc around lower shin',
      footwork: 'Feet: Dorsiflexed (toes pulled up) for quad activation'
    },
    targetMuscles: [
      { name: 'Rectus Femoris', role: 'Prime Mover (100%)' },
      { name: 'Vastus Lateralis', role: 'Prime Mover (100%)' },
      { name: 'Vastus Medialis (Teardrop)', role: 'Knee Stabilizer (95%)' }
    ],
    mistakes: [
      'Kicking the weight using momentum',
      'Lifting hips off the seat',
      'Dropping the weight abruptly at bottom'
    ],
    sets: [
      { num: 1, reps: 15, weight: 35, done: false },
      { num: 2, reps: 12, weight: 45, done: false },
      { num: 3, reps: 10, weight: 55, done: false }
    ]
  },
  {
    id: 'legs_4',
    name: 'Hip Thrust',
    shortName: 'Hip Thrust',
    tagline: 'Glute Isolation & Explosive Hip Extension',
    muscle: 'Legs',
    equipment: 'Barbell & Bench / Thrust Machine',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-2 (2s Lower, Explosive Bridge, 2s Peak Glute Squeeze)',
    videoUri: require('../../assets/exercises/hip_thrust.mp4'),
    localVideo: require('../../assets/exercises/hip_thrust.mp4'),
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Barbell Hip Thrust. Upper back on the bench, bar padded across hip crease.',
      lower: 'Hinge at the hips down toward the floor... 2, 1...',
      press: 'Drive through your heels, thrust up and tuck your chin at top lockout!',
      finish: 'Full glute engagement! Excellent pelvic control.'
    },
    biomechanics: {
      jointAngle: 'Knee Angle: 90° vertical shins at top of thrust',
      barPath: 'Hip Travel: Vertical hinge arc from floor to horizontal',
      footwork: 'Feet: Shoulder-width, toes pointed slightly outward'
    },
    targetMuscles: [
      { name: 'Gluteus Maximus', role: 'Prime Mover (100%)' },
      { name: 'Hamstrings', role: 'Synergist (55%)' },
      { name: 'Adductor Magnus', role: 'Stabilizer (45%)' }
    ],
    mistakes: [
      'Hyperextending the lower back instead of hinging hips',
      'Tilting head backwards instead of keeping chin tucked',
      'Placing feet too far forward or too close'
    ],
    sets: [
      { num: 1, reps: 12, weight: 60, done: false },
      { num: 2, reps: 10, weight: 80, done: false },
      { num: 3, reps: 8, weight: 100, done: false }
    ]
  },
  {
    id: 'legs_5',
    name: 'Walking Lunges',
    shortName: 'Lunges',
    tagline: 'Unilateral Leg Strength & Dynamic Balance',
    muscle: 'Legs',
    equipment: 'Dumbbells / Bodyweight',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-0 (2s Step & Drop, Explosive Step-Through)',
    videoUri: require('../../assets/exercises/walking_lunges.mp4'),
    localVideo: require('../../assets/exercises/walking_lunges.mp4'),
    image: require('../../assets/workouts/day_4_legs.png'),
    audioCues: {
      intro: 'Walking Lunges. Upright torso, take an athletic stride forward.',
      lower: 'Drop your back knee toward the ground with control... 2, 1...',
      press: 'Drive off your front heel and transition smoothly into the next step!',
      finish: 'Set complete! Tremendous functional leg endurance.'
    },
    biomechanics: {
      jointAngle: 'Knee Angle: Both knees at 90° at bottom of stride',
      barPath: 'Torso: Held perfectly vertical and upright',
      footwork: 'Stride: Feet hip-width apart as on railroad tracks'
    },
    targetMuscles: [
      { name: 'Quadriceps', role: 'Prime Mover (90%)' },
      { name: 'Gluteus Medius & Maximus', role: 'Pelvic Stabilizer (85%)' },
      { name: 'Hamstrings & Calves', role: 'Decelerator (60%)' }
    ],
    mistakes: [
      'Front knee drifting far past toes or caving inwards',
      'Leaning torso excessively forward',
      'Banging back knee hard onto the floor'
    ],
    sets: [
      { num: 1, reps: 12, weight: 12, done: false },
      { num: 2, reps: 12, weight: 16, done: false },
      { num: 3, reps: 10, weight: 20, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ SHOULDERS EXERCISES
  // =========================================================================
  {
    id: 'shoulders_1',
    name: 'Overhead Shoulder Press',
    shortName: 'Shoulder Press',
    tagline: 'Vertical Push Power & Deltoid Mass',
    muscle: 'Shoulders',
    equipment: 'Dumbbells / Barbell',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-1-1-0 (2s Lower, Brief Touch, Strong Press)',
    videoUri: require('../../assets/exercises/shoulder_press.mp4'),
    localVideo: require('../../assets/exercises/shoulder_press.mp4'),
    image: require('../../assets/workouts/day_5_upper.png'),
    audioCues: {
      intro: 'Shoulder Press. Brace core, bring weights to ear level with elbows in the scapular plane.',
      lower: 'Control the descent down to chin level... 2, 1...',
      press: 'Drive vertically overhead until arms are extended!',
      finish: 'Locked out overhead with total stability!'
    },
    biomechanics: {
      jointAngle: 'Elbow Path: 30° anterior to frontal plane',
      barPath: 'Press Path: Vertical straight line from chin to overhead',
      footwork: 'Core: Ribcage pinned down, glutes squeezed'
    },
    targetMuscles: [
      { name: 'Anterior Deltoid', role: 'Prime Mover (100%)' },
      { name: 'Lateral Deltoid', role: 'Synergist (80%)' },
      { name: 'Triceps Brachii', role: 'Elbow Extensor (75%)' }
    ],
    mistakes: [
      'Arching lower back excessively',
      'Pressing too far forward in front of head',
      'Flaring elbows directly out to the sides'
    ],
    sets: [
      { num: 1, reps: 10, weight: 20, done: false },
      { num: 2, reps: 8, weight: 24, done: false },
      { num: 3, reps: 8, weight: 26, done: false }
    ]
  },
  {
    id: 'shoulders_2',
    name: 'Dumbbell Lateral Raise',
    shortName: 'Lateral Raise',
    tagline: 'Side Deltoid Width & Shoulder Capping',
    muscle: 'Shoulders',
    equipment: 'Dumbbells',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-1 (2s Lower, Quick Raise, 1s Top Hold)',
    videoUri: require('../../assets/exercises/lateral_raise.mp4'),
    localVideo: require('../../assets/exercises/lateral_raise.mp4'),
    image: require('../../assets/workouts/day_5_upper.png'),
    audioCues: {
      intro: 'Lateral Raise. Slight hinge, lead with your elbows.',
      lower: 'Control the descent without letting dumbbells touch hips... 2, 1...',
      press: 'Sweep outwards to shoulder height! Pour water at the top.',
      finish: 'Burn that side delt! Superb boulder shoulders.'
    },
    biomechanics: {
      jointAngle: 'Arm Angle: Slight 10° elbow bend held constant',
      barPath: 'Path: 20° forward in the scapular plane to parallel',
      footwork: 'Base: Athletic stance, knees soft'
    },
    targetMuscles: [
      { name: 'Lateral Deltoid', role: 'Prime Mover (100%)' },
      { name: 'Supraspinatus', role: 'Abduction Initiator (70%)' },
      { name: 'Upper Trapezius', role: 'Synergist (50%)' }
    ],
    mistakes: [
      'Using body swing / hip bounce',
      'Raising hands higher than elbows',
      'Shrugging traps up to the ears'
    ],
    sets: [
      { num: 1, reps: 15, weight: 8, done: false },
      { num: 2, reps: 12, weight: 10, done: false },
      { num: 3, reps: 12, weight: 12, done: false }
    ]
  },
  {
    id: 'shoulders_3',
    name: 'Rear Delt Face Pull',
    shortName: 'Face Pull',
    tagline: 'Rear Delts & Rotator Cuff Health',
    muscle: 'Shoulders',
    equipment: 'Cable Machine & Rope',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-1 (2s Negative, Smooth Pull, 1s Squeeze)',
    videoUri: require('../../assets/exercises/rear_delt_face_pull.mp4'),
    localVideo: require('../../assets/exercises/rear_delt_face_pull.mp4'),
    image: require('../../assets/workouts/day_5_upper.png'),
    audioCues: {
      intro: 'Face Pull. Set cable at eye height, grasp rope with thumbs pointing back.',
      lower: 'Extend arms forward with tension... 2, 1...',
      press: 'Pull rope toward forehead and rotate knuckles back!',
      finish: 'Rear delts and posture muscles fully fired!'
    },
    biomechanics: {
      jointAngle: 'Shoulder External Rotation: Forearms perpendicular to floor',
      barPath: 'Pull Path: Directly toward bridge of nose / eyes',
      footwork: 'Staggered Stance: One foot back to resist cable pull'
    },
    targetMuscles: [
      { name: 'Posterior Deltoid', role: 'Prime Mover (100%)' },
      { name: 'Infraspinatus & Teres Minor', role: 'Rotator Cuff (90%)' },
      { name: 'Rhomboids & Traps', role: 'Scapular Retractor (80%)' }
    ],
    mistakes: [
      'Using too much weight and leaning backwards',
      'Pulling downward toward neck instead of face',
      'Neglecting the external rotation component'
    ],
    sets: [
      { num: 1, reps: 15, weight: 20, done: false },
      { num: 2, reps: 12, weight: 25, done: false },
      { num: 3, reps: 12, weight: 30, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ ARMS EXERCISES
  // =========================================================================
  {
    id: 'arms_1',
    name: 'Triceps Pushdown',
    shortName: 'Pushdown',
    tagline: 'Cable Triceps Extension & Horseshoe Definition',
    muscle: 'Arms',
    equipment: 'Cable Machine & Straight / V-Bar',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '2-0-1-1 (2s Return, Snappy Pushdown, 1s Lockout)',
    videoUri: require('../../assets/exercises/triceps_pushdown.mp4'),
    localVideo: require('../../assets/exercises/triceps_pushdown.mp4'),
    image: require('../../assets/workouts/day_6_arms.png'),
    audioCues: {
      intro: 'Triceps Pushdown. Pin your elbows to your sides, chest upright.',
      lower: 'Allow forearms to rise up to 90 degrees with control... 2, 1...',
      press: 'Push down aggressively and flare the wrists slightly at lockout!',
      finish: 'Full triceps burn achieved! Lockout held.'
    },
    biomechanics: {
      jointAngle: 'Elbow Joint: Stationary hinge pinned beside torso',
      barPath: 'Pushdown: Vertical downward stroke to full extension',
      footwork: 'Base: Slight forward torso lean, feet grounded'
    },
    targetMuscles: [
      { name: 'Triceps Lateral Head', role: 'Prime Mover (100%)' },
      { name: 'Triceps Medial Head', role: 'Prime Mover (100%)' },
      { name: 'Triceps Long Head', role: 'Extensor (80%)' }
    ],
    mistakes: [
      'Letting elbows drift forward and back like a row',
      'Using bodyweight to lean over the bar',
      'Incomplete lockout at bottom'
    ],
    sets: [
      { num: 1, reps: 15, weight: 25, done: false },
      { num: 2, reps: 12, weight: 30, done: false },
      { num: 3, reps: 10, weight: 35, done: false }
    ]
  },

  // =========================================================================
  // 🏋️ CORE & MOBILITY EXERCISES
  // =========================================================================
  {
    id: 'core_1',
    name: 'Plank',
    shortName: 'Plank',
    tagline: 'Isometric Anti-Extension Core Armor',
    muscle: 'Core',
    equipment: 'Floor / Mat',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: '45-60s Isometric Constant Tension',
    videoUri: require('../../assets/exercises/plank.mp4'),
    localVideo: require('../../assets/exercises/plank.mp4'),
    image: require('../../assets/workouts/day_1_core.png'),
    audioCues: {
      intro: 'Core Plank. Forearms on mat, elbows under shoulders, body in a steel line.',
      lower: 'Pull belly button toward spine, squeeze glutes and quads together.',
      press: 'Breathe steadily while maintaining relentless tension!',
      finish: 'Time! Core completely locked down and strengthened.'
    },
    biomechanics: {
      jointAngle: 'Spine: Neutral alignment, no sagging lumbar arch',
      barPath: 'Forearms: Parallel, pressing floor away through elbows',
      footwork: 'Toes: Firmly dug in, calves flexed'
    },
    targetMuscles: [
      { name: 'Rectus Abdominis', role: 'Prime Mover (100%)' },
      { name: 'Transverse Abdominis', role: 'Deep Core Girdle (100%)' },
      { name: 'Gluteals & Quads', role: 'Stabilizer (70%)' }
    ],
    mistakes: [
      'Sagging hips down toward floor',
      'Piking hips up into an inverted V',
      'Holding breath'
    ],
    sets: [
      { num: 1, reps: 1, weight: 60, done: false },
      { num: 2, reps: 1, weight: 60, done: false },
      { num: 3, reps: 1, weight: 60, done: false }
    ]
  },
  {
    id: 'core_2',
    name: 'Cat-Cow Stretch',
    shortName: 'Cat-Cow',
    tagline: 'Spinal Mobility & Dynamic Decompression',
    muscle: 'Core',
    equipment: 'Floor / Mat',
    videoOffset: { translateY: 0, scale: 1.05 },
    tempo: 'Slow Synchronized Breath (Inhale Cow, Exhale Cat)',
    videoUri: require('../../assets/exercises/cat_cow_stretch.mp4'),
    localVideo: require('../../assets/exercises/cat_cow_stretch.mp4'),
    image: require('../../assets/workouts/day_1_core.png'),
    audioCues: {
      intro: 'Cat-Cow Stretch. Hands and knees on mat, wrists under shoulders.',
      lower: 'Inhale into Cow: drop belly, lift chest and tailbone up.',
      press: 'Exhale into Cat: arch spine toward the sky and tuck your chin.',
      finish: 'Spine fully mobilized, fluid and warmed up.'
    },
    biomechanics: {
      jointAngle: 'Segmental Spinal Articulation: Cervical to lumbar',
      barPath: 'Motion: Smooth wave from pelvic tilt to neck flex',
      footwork: 'Knees: Directly below hips, tops of feet flat'
    },
    targetMuscles: [
      { name: 'Erector Spinae', role: 'Spinal Articulator (100%)' },
      { name: 'Rectus Abdominis & Obliques', role: 'Flexion Synergist (85%)' },
      { name: 'Thoracic & Cervical Spine', role: 'Mobility Decompressor (90%)' }
    ],
    mistakes: [
      'Rushing the movements without breathing',
      'Bending the elbows instead of articulating the spine',
      'Over-compressing the neck'
    ],
    sets: [
      { num: 1, reps: 10, weight: 0, done: false },
      { num: 2, reps: 10, weight: 0, done: false }
    ]
  }
];

// Helper to quickly look up exercise by id
const findEx = (id) => EXERCISES_DB.find((ex) => ex.id === id) || EXERCISES_DB[0];

// =========================================================================
// 🗓️ 7-DAY MONDAY-TO-SUNDAY WORKOUT SCHEDULE
// =========================================================================
export const WEEKLY_ROUTINES_DB = [
  // 🔴 MONDAY (Day 1 - Index 0): Push Power
  {
    dayIndex: 0,
    dayCode: 'M',
    dayName: 'Monday',
    dayNum: 1,
    title: 'Push Power',
    splitLabel: 'Chest, Shoulders & Triceps Overload',
    focus: 'Chest, Shoulders, Triceps',
    intensity: 'High',
    intensityColor: '#DC2626',
    isRest: false,
    durationMin: 50,
    image: require('../../assets/workouts/day_0_push.png'),
    sections: [
      {
        name: 'Chest',
        icon: 'Flame',
        exercises: [findEx('chest_1'), findEx('chest_2')]
      },
      {
        name: 'Shoulders',
        icon: 'Zap',
        exercises: [findEx('shoulders_1')]
      },
      {
        name: 'Triceps',
        icon: 'Dumbbell',
        exercises: [findEx('arms_1')]
      }
    ],
    exercises: [findEx('chest_1'), findEx('chest_2'), findEx('shoulders_1'), findEx('arms_1')]
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
        exercises: [findEx('back_1'), findEx('back_2'), findEx('back_4')]
      }
    ],
    exercises: [findEx('back_1'), findEx('back_2'), findEx('back_4')]
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
        exercises: [findEx('legs_1'), findEx('legs_2'), findEx('legs_3')]
      },
      {
        name: 'Glutes & Posterior',
        icon: 'Flame',
        exercises: [findEx('legs_4'), findEx('legs_5')]
      }
    ],
    exercises: [findEx('legs_1'), findEx('legs_2'), findEx('legs_3'), findEx('legs_4'), findEx('legs_5')]
  },

  // 🟢 THURSDAY (Day 4 - Index 3): Active Recovery & Core
  {
    dayIndex: 3,
    dayCode: 'T',
    dayName: 'Thursday',
    dayNum: 4,
    title: 'Active Recovery',
    splitLabel: 'Mobility, Core & Spinal Health',
    focus: 'Mobility, Core, Spinal Alignment',
    intensity: 'Low',
    intensityColor: '#10B981',
    isRest: false,
    durationMin: 35,
    image: require('../../assets/workouts/day_1_core.png'),
    sections: [
      {
        name: 'Mobility & Core',
        icon: 'Activity',
        exercises: [findEx('core_1'), findEx('core_2')]
      }
    ],
    exercises: [findEx('core_1'), findEx('core_2')]
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
        exercises: [findEx('chest_1'), findEx('shoulders_2'), findEx('shoulders_3')]
      },
      {
        name: 'Back & Arms',
        icon: 'Dumbbell',
        exercises: [findEx('back_1'), findEx('arms_1')]
      }
    ],
    exercises: [findEx('chest_1'), findEx('shoulders_2'), findEx('shoulders_3'), findEx('back_1'), findEx('arms_1')]
  },

  // 🟡 SATURDAY (Day 6 - Index 5): Deadlift & Posterior Chain
  {
    dayIndex: 5,
    dayCode: 'S',
    dayName: 'Saturday',
    dayNum: 6,
    title: 'Posterior Power',
    splitLabel: 'Deadlift, Glutes & Core',
    focus: 'Deadlift, Glutes, Core',
    intensity: 'High',
    intensityColor: '#F59E0B',
    isRest: false,
    durationMin: 50,
    image: require('../../assets/workouts/day_3_back.png'),
    sections: [
      {
        name: 'Posterior Chain',
        icon: 'Flame',
        exercises: [findEx('back_3'), findEx('back_2'), findEx('legs_4')]
      },
      {
        name: 'Core Armor',
        icon: 'Shield',
        exercises: [findEx('core_1')]
      }
    ],
    exercises: [findEx('back_3'), findEx('back_2'), findEx('legs_4'), findEx('core_1')]
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
        exercises: [findEx('core_2')]
      }
    ],
    exercises: [findEx('core_2')]
  }
];
