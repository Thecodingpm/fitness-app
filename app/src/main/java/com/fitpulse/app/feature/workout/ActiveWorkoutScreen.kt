package com.fitpulse.app.feature.workout

import androidx.compose.animation.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.ExerciseAnimationPlayer
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*
import kotlinx.coroutines.delay

@Composable
fun ActiveWorkoutScreen(
    workoutPlan: WorkoutPlan,
    onFinishWorkout: (WorkoutSession) -> Unit,
    onCancelWorkout: () -> Unit
) {
    val initialExercises = remember(workoutPlan) {
        if (workoutPlan.exercises.isNotEmpty()) workoutPlan.exercises
        else listOf(
            WorkoutExercise(
                exercise = Exercise(
                    id = "ex_bench",
                    name = "Barbell Bench Press",
                    primaryMuscle = MuscleGroup.CHEST,
                    equipment = EquipmentType.BARBELL,
                    instructions = listOf("Lie flat on bench.", "Grip slightly wider than shoulder-width.", "Lower under control to mid-chest.", "Press up forcefully."),
                    formCues = listOf("Retract shoulder blades into bench", "Leg drive through floor", "Control 2-sec descent"),
                    commonMistakes = listOf("Flaring elbows at 90°", "Bouncing bar off chest"),
                    animationGifUrl = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0025.gif"
                ),
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 10, targetWeightKg = 50.0),
                    ExerciseSet(setNumber = 2, targetReps = 10, targetWeightKg = 55.0),
                    ExerciseSet(setNumber = 3, targetReps = 8, targetWeightKg = 60.0)
                )
            ),
            WorkoutExercise(
                exercise = Exercise(
                    id = "ex_incline_db",
                    name = "Incline Dumbbell Press",
                    primaryMuscle = MuscleGroup.CHEST,
                    equipment = EquipmentType.DUMBBELLS,
                    instructions = listOf("Set bench to 30° incline.", "Bring dumbbells to chest level.", "Press dumbbells up in smooth arc."),
                    formCues = listOf("Keep chest proud", "Maintain neutral wrists", "Full stretch at bottom"),
                    commonMistakes = listOf("Incline set too steep (>45°)"),
                    animationGifUrl = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0314.gif"
                ),
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 10, targetWeightKg = 20.0),
                    ExerciseSet(setNumber = 2, targetReps = 10, targetWeightKg = 22.0),
                    ExerciseSet(setNumber = 3, targetReps = 8, targetWeightKg = 24.0)
                )
            )
        )
    }

    var exercises by remember { mutableStateOf(initialExercises) }
    var currentExerciseIndex by remember { mutableIntStateOf(0) }

    // Rest Timer Engine
    var isResting by remember { mutableStateOf(false) }
    var restSeconds by remember { mutableIntStateOf(60) }
    var workoutDurationSeconds by remember { mutableIntStateOf(0) }
    var showExitDialog by remember { mutableStateOf(false) }

    // Workout Clock Timer
    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            workoutDurationSeconds++
        }
    }

    // Rest Countdown
    LaunchedEffect(isResting) {
        if (isResting) {
            while (restSeconds > 0 && isResting) {
                delay(1000)
                restSeconds--
            }
            if (restSeconds <= 0) {
                isResting = false
                restSeconds = 60
            }
        }
    }

    val currentWorkoutExercise = exercises.getOrNull(currentExerciseIndex) ?: return
    val totalExercises = exercises.size
    val allSetsCompletedForCurrent = currentWorkoutExercise.sets.all { it.isCompleted }
    val isLastExercise = currentExerciseIndex == totalExercises - 1

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
    ) {
        Spacer(modifier = Modifier.height(14.dp))

        // 1. Top Header Bar: Exit + Workout Progress + Clock
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { showExitDialog = true },
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceVariant)
            ) {
                Icon(Icons.Default.Close, contentDescription = "Exit", tint = TextSecondaryDark, modifier = Modifier.size(18.dp))
            }

            // Exercise Step Indicator
            Text(
                text = "Exercise ${currentExerciseIndex + 1} of $totalExercises",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                color = TextPrimaryDark
            )

            // Duration Clock
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(DarkSurfaceVariant)
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(Icons.Default.Timer, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(14.dp))
                val mins = workoutDurationSeconds / 60
                val secs = workoutDurationSeconds % 60
                Text(
                    text = String.format("%02d:%02d", mins, secs),
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    color = PurpleAccent
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // 2. Linear Workout Progress Indicator
        LinearProgressIndicator(
            progress = { (currentExerciseIndex + 1).toFloat() / totalExercises.toFloat() },
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp)),
            color = PurplePrimary,
            trackColor = DarkSurfaceVariant
        )

        Spacer(modifier = Modifier.height(14.dp))

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // ==========================================
            // A. 3D LIVE ANIMATION DEMONSTRATION CARD
            // ==========================================
            item {
                ExerciseAnimationPlayer(
                    exercise = currentWorkoutExercise.exercise,
                    height = 220.dp,
                    showBadges = true,
                    showFormCueBadge = true
                )
            }

            // ==========================================
            // B. EXERCISE TITLE & FORM TIPS
            // ==========================================
            item {
                Column {
                    Text(
                        text = currentWorkoutExercise.exercise.name,
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            fontSize = 22.sp
                        ),
                        color = TextPrimaryDark
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Form Cues Box
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(DarkSurface)
                            .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
                            .padding(12.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("💡", fontSize = 12.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("FORM CHECKLIST:", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = PurpleAccent)
                            }
                            currentWorkoutExercise.exercise.formCues.forEach { cue ->
                                Text("• $cue", style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp), color = TextSecondaryDark)
                            }
                        }
                    }
                }
            }

            // ==========================================
            // C. INTERACTIVE SET LOGGER
            // ==========================================
            item {
                Text(
                    text = "Log Sets",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                    color = TextPrimaryDark
                )
            }

            itemsIndexed(currentWorkoutExercise.sets) { setIdx, setItem ->
                var reps by remember(setItem) { mutableIntStateOf(setItem.actualReps ?: setItem.targetReps) }
                var weight by remember(setItem) { mutableDoubleStateOf(setItem.actualWeightKg ?: setItem.targetWeightKg) }
                val isDone = setItem.isCompleted

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isDone) PurplePrimary.copy(alpha = 0.15f) else DarkSurface)
                        .border(
                            width = 1.dp,
                            color = if (isDone) EmeraldSuccess.copy(alpha = 0.8f) else DarkBorderSubtle,
                            shape = RoundedCornerShape(16.dp)
                        )
                        .padding(horizontal = 14.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Set Number Pill
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(CircleShape)
                            .background(if (isDone) EmeraldSuccess else DarkSurfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${setItem.setNumber}",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black),
                            color = Color.White
                        )
                    }

                    // Weight Input (+ / - controls)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "${weight.toInt()} kg",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimaryDark
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        IconButton(
                            onClick = { if (weight > 2.5) weight -= 2.5 },
                            modifier = Modifier.size(26.dp)
                        ) {
                            Text("-", color = PurpleAccent, fontWeight = FontWeight.Black, fontSize = 16.sp)
                        }
                        IconButton(
                            onClick = { weight += 2.5 },
                            modifier = Modifier.size(26.dp)
                        ) {
                            Text("+", color = PurpleAccent, fontWeight = FontWeight.Black, fontSize = 16.sp)
                        }
                    }

                    // Reps Input
                    Text(
                        text = "$reps reps",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimaryDark
                    )

                    // Complete Set Checkbox Button
                    IconButton(
                        onClick = {
                            val updatedSets = currentWorkoutExercise.sets.toMutableList()
                            val newStatus = !isDone
                            updatedSets[setIdx] = setItem.copy(
                                isCompleted = newStatus,
                                actualReps = reps,
                                actualWeightKg = weight
                            )
                            val updatedExercises = exercises.toMutableList()
                            updatedExercises[currentExerciseIndex] = currentWorkoutExercise.copy(sets = updatedSets)
                            exercises = updatedExercises

                            if (newStatus) {
                                // Auto launch rest timer
                                restSeconds = 60
                                isResting = true
                            }
                        },
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isDone) EmeraldSuccess else DarkSurfaceVariant)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Complete Set",
                            tint = if (isDone) Color.White else TextSecondaryDark,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(10.dp)) }
        }

        // ==========================================
        // D. REST TIMER BANNER (Active while resting)
        // ==========================================
        AnimatedVisibility(visible = isResting) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(
                        Brush.horizontalGradient(
                            listOf(Color(0xFF2E1A47), Color(0xFF1B1433))
                        )
                    )
                    .border(1.dp, PurpleAccent, RoundedCornerShape(18.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("⏱️", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text("REST TIME", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black), color = PurpleAccent)
                            Text("$restSeconds seconds left", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TextButton(onClick = { restSeconds += 15 }) {
                            Text("+15s", color = PurpleLight, fontWeight = FontWeight.Bold)
                        }
                        Button(
                            onClick = { isResting = false },
                            colors = ButtonDefaults.buttonColors(containerColor = DarkSurfaceElevated)
                        ) {
                            Text("Skip", color = TextPrimaryDark)
                        }
                    }
                }
            }
        }

        // ==========================================
        // E. NEXT EXERCISE / FINISH WORKOUT BUTTON
        // ==========================================
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 14.dp)
                .height(54.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(
                    if (allSetsCompletedForCurrent || isLastExercise) {
                        Brush.horizontalGradient(listOf(PurplePrimary, PurpleSecondary))
                    } else {
                        Brush.horizontalGradient(listOf(DarkSurfaceElevated, DarkSurfaceVariant))
                    }
                )
                .clickable {
                    if (isLastExercise) {
                        // Finish Workout
                        val session = WorkoutSession(
                            workoutPlanId = workoutPlan.id,
                            workoutTitle = workoutPlan.title,
                            startTimeMs = System.currentTimeMillis() - (workoutDurationSeconds * 1000L),
                            endTimeMs = System.currentTimeMillis(),
                            totalVolumeKg = exercises.sumOf { ex -> ex.sets.filter { it.isCompleted }.sumOf { (it.actualWeightKg ?: 0.0) * (it.actualReps ?: 0) } },
                            caloriesBurned = ((workoutDurationSeconds / 60) * 8 + 40).coerceAtLeast(40),
                            completedExercisesCount = exercises.count { ex -> ex.sets.any { it.isCompleted } },
                            totalSetsCompleted = exercises.sumOf { ex -> ex.sets.count { it.isCompleted } }
                        )
                        onFinishWorkout(session)
                    } else {
                        // Next Exercise
                        isResting = false
                        currentExerciseIndex++
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = if (isLastExercise) "Finish Workout 🎉" else "Next Exercise →",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                    color = Color.White
                )
            }
        }
    }

    // Exit Confirmation Dialog
    if (showExitDialog) {
        AlertDialog(
            onDismissRequest = { showExitDialog = false },
            title = { Text("Quit Workout?", fontWeight = FontWeight.Black, color = TextPrimaryDark) },
            text = { Text("Are you sure you want to stop this workout session?", color = TextSecondaryDark) },
            confirmButton = {
                TextButton(onClick = { showExitDialog = false; onCancelWorkout() }) {
                    Text("Quit", color = Rose500, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showExitDialog = false }) {
                    Text("Continue", color = TextPrimaryDark)
                }
            },
            containerColor = DarkSurfaceVariant,
            shape = RoundedCornerShape(20.dp)
        )
    }
}
