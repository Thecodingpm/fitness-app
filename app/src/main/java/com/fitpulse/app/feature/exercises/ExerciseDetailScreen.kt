package com.fitpulse.app.feature.exercises

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.Exercise
import com.fitpulse.app.core.domain.model.InstructorGender
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
    var instructorGender by remember { mutableStateOf(InstructorGender.FEMALE) }

    val title = workoutPlan?.title ?: exercise?.name ?: "Barbell Squat"
    val description = workoutPlan?.subtitle ?: exercise?.instructions?.joinToString(" ")
        ?: "Fundamental lower body compound exercise that develops quadriceps, hamstrings, glutes, and core stability."

    val targetSets = if ((workoutPlan?.exercises?.size ?: 0) > 0) "${workoutPlan?.exercises?.size} sets" else "4 sets"
    val durationText = "${workoutPlan?.durationMinutes ?: 30} minutes"
    val caloriesBurnText = "${workoutPlan?.estimatedCalories ?: 240} Kcal"

    val instructions = exercise?.instructions?.ifEmpty {
        listOf(
            "Set the bar at upper chest height in the rack.",
            "Step under and place the bar across your upper trapezius.",
            "Take two steps back, establish a shoulder-width stance, and brace your core.",
            "Inhale and descend by pushing knees out and sitting between hips until thighs are parallel.",
            "Drive through midfoot and exhale as you return to standing position."
        )
    } ?: listOf(
        "Establish proper posture and align joint kinetic angles.",
        "Engage core and control the eccentric lowering phase.",
        "Drive through target muscle groups with explosive intent."
    )

    val commonMistakes = exercise?.commonMistakes?.ifEmpty {
        listOf(
            "Knees caving inwards during ascent.",
            "Rounding the lower back under heavy load.",
            "Lifting heels off the ground."
        )
    } ?: listOf("Flaring elbows at 90 degrees", "Rushing through repetition tempo")

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

            // Instructor Gender Toggle
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
                    Text("♀ Female", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (instructorGender == InstructorGender.MALE) PurplePrimary else Color.Transparent)
                        .clickable { instructorGender = InstructorGender.MALE }
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text("♂ Male", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Animated Exercise Instructor Demonstration Hero
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(190.dp)
                .clip(RoundedCornerShape(22.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color(0xFF241A40), Color(0xFF130E26))
                    )
                )
                .border(1.dp, PurpleAccent.copy(alpha = 0.4f), RoundedCornerShape(22.dp)),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val w = size.width
                val h = size.height
                drawCircle(color = PurpleGlow, radius = 50.dp.toPx(), center = Offset(w / 2f, h / 2f))
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(if (instructorGender == InstructorGender.FEMALE) "🏋️‍♀️" else "🏋️‍♂️", fontSize = 54.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Text("HD Animated Form Demonstration", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = PurpleAccent)
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Specifications Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(DarkSurface)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(20.dp))
                .padding(18.dp)
        ) {
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black, fontSize = 20.sp),
                    color = TextPrimaryDark
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.5.sp, lineHeight = 18.sp),
                    color = TextSecondaryDark
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Triad Metrics: Target | Time | Burn
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("🎯 Target", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                        Text(targetSets, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    }

                    Column {
                        Text("⏱ Time", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                        Text(durationText, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    }

                    Column {
                        Text("🔥 Burn", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                        Text(caloriesBurnText, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Step-by-Step Instructions
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(DarkSurface)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(18.dp))
                .padding(16.dp)
        ) {
            Column {
                Text("Step-by-Step Execution", fontWeight = FontWeight.Bold, color = TextPrimaryDark, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(8.dp))
                instructions.forEachIndexed { i, stepText ->
                    Row(modifier = Modifier.padding(vertical = 3.dp)) {
                        Text("${i + 1}. ", fontWeight = FontWeight.Bold, color = PurpleAccent, fontSize = 12.sp)
                        Text(stepText, fontSize = 12.sp, color = TextSecondaryDark, lineHeight = 16.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Common Mistakes to Avoid
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(DarkSurfaceVariant)
                .padding(16.dp)
        ) {
            Column {
                Text("⚠️ Common Mistakes to Avoid", fontWeight = FontWeight.Bold, color = Rose500, fontSize = 13.sp)
                Spacer(modifier = Modifier.height(6.dp))
                commonMistakes.forEach { mistake ->
                    Text("• $mistake", fontSize = 12.sp, color = TextSecondaryDark, modifier = Modifier.padding(vertical = 2.dp))
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Sticky Start CTA
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(PurpleBrandGradient)
                .clickable { onStartWorkout() },
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("⚡", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Start Workout",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, fontSize = 16.sp),
                    color = TextPrimaryDark
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))
    }
}
