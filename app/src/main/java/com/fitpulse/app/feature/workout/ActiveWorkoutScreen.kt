package com.fitpulse.app.feature.workout

import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*
import kotlinx.coroutines.delay

@Composable
fun ActiveWorkoutScreen(
    workoutPlan: WorkoutPlan,
    onFinishWorkout: (WorkoutSession) -> Unit,
    onCancelWorkout: () -> Unit
) {
    // Generate fallback exercises if empty
    val initialExercises = remember(workoutPlan) {
        if (workoutPlan.exercises.isNotEmpty()) workoutPlan.exercises
        else listOf(
            WorkoutExercise(
                exercise = Exercise(
                    name = "Barbell Squats",
                    primaryMuscle = MuscleGroup.LEGS,
                    equipment = EquipmentType.BARBELL,
                    instructions = listOf("Stand with feet shoulder-width apart.", "Descend until thighs are parallel to floor.", "Drive through midfoot to stand tall."),
                    formCues = listOf("Keep chest proud", "Knees track over toes", "Brace core"),
                    commonMistakes = listOf("Knees caving inwards", "Rounding lower back")
                ),
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 10, targetWeightKg = 60.0),
                    ExerciseSet(setNumber = 2, targetReps = 10, targetWeightKg = 65.0),
                    ExerciseSet(setNumber = 3, targetReps = 8, targetWeightKg = 70.0)
                )
            ),
            WorkoutExercise(
                exercise = Exercise(
                    name = "Dumbbell Bench Press",
                    primaryMuscle = MuscleGroup.CHEST,
                    equipment = EquipmentType.DUMBBELLS,
                    instructions = listOf("Lie flat on bench holding dumbbells.", "Press dumbbells upward until arms are extended.", "Lower under control to chest level."),
                    formCues = listOf("Retract shoulder blades", "Control the eccentric descent"),
                    commonMistakes = listOf("Flaring elbows at 90 degrees")
                ),
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 10, targetWeightKg = 24.0),
                    ExerciseSet(setNumber = 2, targetReps = 10, targetWeightKg = 26.0),
                    ExerciseSet(setNumber = 3, targetReps = 8, targetWeightKg = 28.0)
                )
            )
        )
    }

    var exercises by remember { mutableStateOf(initialExercises) }
    var currentExerciseIndex by remember { mutableIntStateOf(0) }
    var instructorGender by remember { mutableStateOf(InstructorGender.FEMALE) }

    // Timer States
    var isTimerRunning by remember { mutableStateOf(true) }
    var timerSeconds by remember { mutableIntStateOf(30) }
    var isResting by remember { mutableStateOf(false) }
    var restSeconds by remember { mutableIntStateOf(45) }
    var isSoundEnabled by remember { mutableStateOf(true) }
    var isHapticsEnabled by remember { mutableStateOf(true) }
    var showTimesUpAlert by remember { mutableStateOf(false) }

    val currentWorkoutExercise = exercises.getOrNull(currentExerciseIndex) ?: return
    val totalSetsCount = exercises.sumOf { it.sets.size }
    val completedSetsCount = exercises.sumOf { it.sets.count { s -> s.isCompleted } }

    // Countdown / Rest Timer Engine
    LaunchedEffect(isTimerRunning, isResting, timerSeconds, restSeconds) {
        if (isTimerRunning) {
            if (isResting) {
                while (isResting && restSeconds > 0) {
                    delay(1000)
                    restSeconds--
                }
                if (restSeconds == 0) {
                    isResting = false
                    showTimesUpAlert = true
                    delay(1500)
                    showTimesUpAlert = false
                    timerSeconds = 30
                }
            } else {
                while (!isResting && timerSeconds > 0) {
                    delay(1000)
                    timerSeconds--
                }
                if (timerSeconds == 0) {
                    showTimesUpAlert = true
                    delay(1200)
                    showTimesUpAlert = false
                    isResting = true
                    restSeconds = 45
                }
            }
        }
    }

    Scaffold(
        containerColor = BlackBackground,
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface)
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onCancelWorkout) {
                        Icon(Icons.Default.Close, contentDescription = "Cancel", tint = TextPrimaryDark)
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = workoutPlan.title,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, fontSize = 15.sp),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "$completedSetsCount of $totalSetsCount Sets Complete",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = PurpleAccent
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(PurpleBrandGradient)
                            .clickable {
                                val session = WorkoutSession(
                                    workoutPlanId = workoutPlan.id,
                                    workoutTitle = workoutPlan.title,
                                    startTimeMs = System.currentTimeMillis() - (workoutPlan.durationMinutes * 60000),
                                    totalVolumeKg = 3450.0,
                                    caloriesBurned = workoutPlan.estimatedCalories,
                                    completedExercisesCount = exercises.size,
                                    totalSetsCompleted = completedSetsCount
                                )
                                onFinishWorkout(session)
                            }
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text("Finish", fontWeight = FontWeight.Black, color = TextPrimaryDark, fontSize = 13.sp)
                    }
                }
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            // 1. Time's Up Alert Banner
            if (showTimesUpAlert) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(PurplePrimary)
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "⚡ Time's Up! Moving to next interval.",
                            fontWeight = FontWeight.Black,
                            color = TextPrimaryDark,
                            fontSize = 14.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }

            // 2. Animated Exercise Demonstration Hero Area
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFF241A40), Color(0xFF140F26))
                            )
                        )
                        .border(1.dp, PurpleAccent.copy(alpha = 0.4f), RoundedCornerShape(22.dp))
                        .padding(18.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        // Instructor Gender Switcher
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(PurplePrimary.copy(alpha = 0.3f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = if (isResting) "REST INTERVAL" else "EXERCISE ACTIVE",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                    color = if (isResting) AmberOrange else PurpleAccent
                                )
                            }

                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(DarkSurfaceVariant)
                                    .padding(2.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (instructorGender == InstructorGender.FEMALE) PurplePrimary else Color.Transparent)
                                        .clickable { instructorGender = InstructorGender.FEMALE }
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text("♀ Model", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                                }
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (instructorGender == InstructorGender.MALE) PurplePrimary else Color.Transparent)
                                        .clickable { instructorGender = InstructorGender.MALE }
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text("♂ Model", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Animated Character Canvas Demonstration
                        Box(
                            modifier = Modifier.size(130.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                val w = size.width
                                val h = size.height
                                // Glowing Ring
                                drawCircle(
                                    color = if (isResting) AmberOrangeGlow else PurpleGlow,
                                    radius = 58.dp.toPx(),
                                    center = Offset(w / 2f, h / 2f)
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(if (instructorGender == InstructorGender.FEMALE) "🏋️‍♀️" else "🏋️‍♂️", fontSize = 42.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (isResting) String.format("%02d:%02d", restSeconds / 60, restSeconds % 60)
                                    else String.format("%02d:%02d", timerSeconds / 60, timerSeconds % 60),
                                    style = MaterialTheme.typography.headlineLarge.copy(
                                        fontWeight = FontWeight.Black,
                                        fontSize = 28.sp
                                    ),
                                    color = if (isResting) AmberOrange else PurpleAccent
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = currentWorkoutExercise.exercise.name,
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black, fontSize = 20.sp),
                            color = TextPrimaryDark
                        )

                        Text(
                            text = "Target: ${currentWorkoutExercise.exercise.primaryMuscle.displayName} • ${currentWorkoutExercise.exercise.equipment.displayName}",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            // 3. Timer Control Actions (Prev, Pause/Play, Skip, Next)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = {
                            if (currentExerciseIndex > 0) {
                                currentExerciseIndex--
                                timerSeconds = 30
                                isResting = false
                            }
                        }
                    ) {
                        Icon(Icons.Default.SkipPrevious, contentDescription = "Prev", tint = TextPrimaryDark, modifier = Modifier.size(28.dp))
                    }

                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(PurpleBrandGradient)
                            .clickable { isTimerRunning = !isTimerRunning },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isTimerRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = TextPrimaryDark,
                            modifier = Modifier.size(28.dp)
                        )
                    }

                    IconButton(
                        onClick = {
                            if (isResting) {
                                isResting = false
                                timerSeconds = 30
                            } else {
                                isResting = true
                                restSeconds = 45
                            }
                        }
                    ) {
                        Icon(Icons.Default.FastForward, contentDescription = "Skip Interval", tint = TextPrimaryDark, modifier = Modifier.size(28.dp))
                    }

                    IconButton(
                        onClick = {
                            if (currentExerciseIndex < exercises.size - 1) {
                                currentExerciseIndex++
                                timerSeconds = 30
                                isResting = false
                            }
                        }
                    ) {
                        Icon(Icons.Default.SkipNext, contentDescription = "Next", tint = TextPrimaryDark, modifier = Modifier.size(28.dp))
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))
            }

            // 4. Sets Logging Table
            item {
                Text(
                    text = "Sets & Reps",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimaryDark
                )
                Spacer(modifier = Modifier.height(10.dp))
            }

            itemsIndexed(currentWorkoutExercise.sets) { idx, set ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(if (set.isCompleted) PurplePrimary.copy(alpha = 0.15f) else DarkSurface)
                        .border(1.dp, if (set.isCompleted) PurpleAccent else DarkBorderSubtle, RoundedCornerShape(14.dp))
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Set ${set.setNumber}", fontWeight = FontWeight.Bold, color = if (set.isCompleted) PurpleAccent else TextSecondaryDark)
                        Text("${set.targetWeightKg} kg × ${set.targetReps} reps", fontWeight = FontWeight.Bold, color = TextPrimaryDark)

                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(if (set.isCompleted) PurplePrimary else DarkSurfaceVariant)
                                .clickable {
                                    set.isCompleted = !set.isCompleted
                                    if (set.isCompleted) {
                                        isResting = true
                                        restSeconds = 45
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            if (set.isCompleted) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = TextPrimaryDark, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            // 5. Posture Cues & Step Instructions
            item {
                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(DarkSurfaceVariant)
                        .padding(16.dp)
                ) {
                    Column {
                        Text("💡 Posture & Form Tips", fontWeight = FontWeight.Bold, color = PurpleAccent, fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        currentWorkoutExercise.exercise.formCues.forEach { cue ->
                            Text("• $cue", fontSize = 12.sp, color = TextSecondaryDark)
                        }
                    }
                }
            }
        }
    }
}
