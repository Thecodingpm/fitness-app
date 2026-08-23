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
  }
];
