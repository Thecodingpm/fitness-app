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
  // 🏋️ CHEST EXERCISES (2 REAL VIDEO EXERCISES)
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
    image: require('../../assets/exercises/chest.png'),
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
    image: require('../../assets/exercises/chest.png'),
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
    ]
  },

  // =========================================================================
  // 🏋️ BACK EXERCISES (4 REAL VIDEO EXERCISES)
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
    image: require('../../assets/exercises/back.png'),
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
    image: require('../../assets/exercises/back.png'),
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
    image: require('../../assets/exercises/back.png'),
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
    image: require('../../assets/exercises/back.png'),
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
    ]
  },

  // =========================================================================
  // 🏋️ LEGS EXERCISES (5 REAL VIDEO EXERCISES)
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    ]
  },

  // =========================================================================
  // 🏋️ SHOULDERS EXERCISES (3 REAL VIDEO EXERCISES)
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
    image: require('../../assets/exercises/shoulders.png'),
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
    image: require('../../assets/exercises/shoulders.png'),
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
    image: require('../../assets/exercises/shoulders.png'),
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
    ]
  },

  // =========================================================================
  // 🏋️ ARMS EXERCISES (1 REAL VIDEO EXERCISE)
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
    image: require('../../assets/exercises/arms.png'),
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
    ]
  },

  // =========================================================================
  // 🏋️ CORE & MOBILITY EXERCISES (2 REAL VIDEO EXERCISES)
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    image: require('../../assets/exercises/legs_and_core.png'),
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
    ]
  }
];

// Helper to quickly look up exercise by id
const findEx = (id) => EXERCISES_DB.find((ex) => ex.id === id) || EXERCISES_DB[0];

export const WEEKLY_ROUTINES_DB = [
  {
    dayIndex: 0, // Sunday
    dayCode: 'S',
    dayName: 'Sunday',
    isRest: false,
    title: 'Legs & Glutes Power',
    splitLabel: 'Legs (Quads, Glutes & Core)',
    dayNum: 1,
    focus: 'Squat Overload & Pelvic Stability',
    durationMin: 50,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('legs_1'), // Barbell Squats
      findEx('legs_2'), // Leg Press
      findEx('legs_4'), // Hip Thrust
      findEx('core_1')  // Plank
    ]
  },
  {
    dayIndex: 1, // Monday
    dayCode: 'M',
    dayName: 'Monday',
    isRest: false,
    title: 'Chest & Core Power',
    splitLabel: 'Chest & Core Blast',
    dayNum: 2,
    focus: 'Horizontal Pressing & Core Tension',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('chest_1'), // Barbell Bench Press
      findEx('chest_2'), // Push-Up
      findEx('core_1'),  // Plank
      findEx('core_2')   // Cat-Cow Stretch
    ]
  },
  {
    dayIndex: 2, // Tuesday
    dayCode: 'T',
    dayName: 'Tuesday',
    isRest: false,
    title: 'Back & Lat Thickness',
    splitLabel: 'Back Hypertrophy',
    dayNum: 3,
    focus: 'Vertical & Horizontal Pulling',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('back_1'), // Lat Pulldown
      findEx('back_2'), // Seated Cable Row
      findEx('back_4'), // T-Bar Row
      findEx('core_2')  // Cat-Cow Stretch
    ]
  },
  {
    dayIndex: 3, // Wednesday
    dayCode: 'W',
    dayName: 'Wednesday',
    isRest: false,
    title: 'Shoulders & Triceps Precision',
    splitLabel: 'Shoulders & Arms',
    dayNum: 4,
    focus: 'Deltoid Capping & Triceps Horseshoe',
    durationMin: 40,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('shoulders_1'), // Overhead Shoulder Press
      findEx('shoulders_2'), // Lateral Raise
      findEx('shoulders_3'), // Face Pull
      findEx('arms_1')       // Triceps Pushdown
    ]
  },
  {
    dayIndex: 4, // Thursday
    dayCode: 'T',
    dayName: 'Thursday',
    isRest: false,
    title: 'Lower Body Sculpt',
    splitLabel: 'Quads, Glutes & Lunges',
    dayNum: 5,
    focus: 'Quad Isolation & Dynamic Walking Lunges',
    durationMin: 50,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('legs_1'), // Barbell Squats
      findEx('legs_3'), // Leg Extension
      findEx('legs_5'), // Walking Lunges
      findEx('legs_4')  // Hip Thrust
    ]
  },
  {
    dayIndex: 5, // Friday
    dayCode: 'F',
    dayName: 'Friday',
    isRest: false,
    title: 'Upper Body Armor',
    splitLabel: 'Push & Pull Compound Blast',
    dayNum: 6,
    focus: 'Compound Upper Symmetry',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('chest_1'),     // Barbell Bench Press
      findEx('back_1'),      // Lat Pulldown
      findEx('shoulders_1'), // Shoulder Press
      findEx('arms_1')       // Triceps Pushdown
    ]
  },
  {
    dayIndex: 6, // Saturday
    dayCode: 'S',
    dayName: 'Saturday',
    isRest: false,
    title: 'Deadlift & Posterior Chain',
    splitLabel: 'Posterior Chain & Core',
    dayNum: 7,
    focus: 'Deadlift Strength & Rotator Stability',
    durationMin: 45,
    image: require('../../assets/workouts/legs_and_core.png'),
    exercises: [
      findEx('back_3'),      // Deadlift
      findEx('back_2'),      // Seated Cable Row
      findEx('shoulders_3'), // Face Pull
      findEx('core_1')       // Plank
    ]
  }
];
