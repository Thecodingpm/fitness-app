package com.fitpulse.app.feature.exercises

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.ExerciseAnimationPlayer
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.EquipmentType
import com.fitpulse.app.core.domain.model.Exercise
import com.fitpulse.app.core.domain.model.MuscleGroup
import com.fitpulse.app.core.domain.model.UserProfile
import com.fitpulse.app.core.domain.model.WorkoutPlan

@Composable
fun ExerciseDetailScreen(
    exercise: Exercise? = null,
    workoutPlan: WorkoutPlan? = null,
    userProfile: UserProfile? = null,
    onBack: () -> Unit,
    onStartWorkout: () -> Unit = {}
) {
    val currentExercise = exercise ?: Exercise(
        name = workoutPlan?.title ?: "Barbell Bench Press",
        primaryMuscle = MuscleGroup.CHEST,
        equipment = EquipmentType.BARBELL,
        instructions = listOf(
            "Lie flat on the bench with feet firmly planted.",
            "Grip the bar slightly wider than shoulder-width.",
            "Lower the bar smoothly to your mid-chest.",
            "Drive forcefully through your palms to lockout."
        ),
        formCues = listOf("Retract shoulder blades", "Keep elbows at 45°", "Maintain arched lower back"),
        commonMistakes = listOf("Bouncing bar off chest", "Flaring elbows at 90°"),
        animationGifUrl = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0025.gif"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(14.dp))

        // Top Navigation Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onBack() }
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimaryDark,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Back",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimaryDark
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(DarkSurfaceVariant)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(12.dp))
                    .padding(horizontal = 10.dp, vertical = 5.dp)
            ) {
                Text(
                    text = currentExercise.primaryMuscle.displayName.uppercase(),
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black, fontSize = 10.sp),
                    color = PurpleAccent
                )
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 1. Live 3D Exercise Demonstration Player
        ExerciseAnimationPlayer(
            exercise = currentExercise,
            height = 230.dp,
            showBadges = true,
            showFormCueBadge = true
        )

        Spacer(modifier = Modifier.height(18.dp))

        // 2. Exercise Title & Equipment Info
        Text(
            text = currentExercise.name,
            style = MaterialTheme.typography.headlineSmall.copy(
                fontWeight = FontWeight.Black,
                fontSize = 24.sp
            ),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 3. Recommended Parameters (Sets, Reps, Rest)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            val stats = listOf(
                Pair("Sets", "${currentExercise.recommendedSets} Sets"),
                Pair("Reps", "${currentExercise.recommendedReps} Reps"),
                Pair("Rest", "${currentExercise.restSeconds}s Rest")
            )

            stats.forEach { (label, value) ->
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
                        .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = label, style = MaterialTheme.typography.labelSmall, color = TextSecondaryDark)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = value,
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 4. Step-by-Step Form Instructions
        Text(
            text = "Step-by-Step Execution",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(10.dp))

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            currentExercise.instructions.forEachIndexed { index, step ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorderSubtle, RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(PurplePrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${index + 1}",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black),
                            color = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = step,
                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 13.5.sp, lineHeight = 19.sp),
                        color = TextPrimaryDark,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 5. Common Mistakes Box
        if (currentExercise.commonMistakes.isNotEmpty()) {
            Text(
                text = "Mistakes to Avoid ⚠️",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                color = TextPrimaryDark
            )
            Spacer(modifier = Modifier.height(10.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0xFF261018))
                    .border(1.dp, Rose500.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    currentExercise.commonMistakes.forEach { mistake ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("❌", fontSize = 12.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = mistake,
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                                color = Rose400
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(26.dp))

        // Start Workout Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(PurplePrimary, PurpleSecondary)
                    )
                )
                .clickable { onStartWorkout() },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Add to Today's Routine ▶",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                color = Color.White
            )
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}
