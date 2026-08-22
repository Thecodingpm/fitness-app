package com.fitpulse.app.feature.dashboard

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
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.*
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*

@Composable
fun HomeScreen(
    userProfile: UserProfile,
    todaysWorkout: WorkoutPlan?,
    dailyNutrition: DailyNutrition,
    recoveryMetrics: RecoveryMetrics,
    stepTrackerData: StepTrackerData = StepTrackerData(),
    onStartWorkout: () -> Unit,
    onOpenYoga: () -> Unit = {},
    onOpenAICoach: () -> Unit = {},
    onOpenDailyCheckIn: () -> Unit = {},
    onOpenStepTracker: () -> Unit = {},
    onNavigateNutrition: () -> Unit = {}
) {
    val scrollState = rememberScrollState()

    val workoutTitle = todaysWorkout?.title ?: when (userProfile.goal) {
        FitnessGoal.WEIGHT_LOSS, FitnessGoal.FAT_LOSS -> "Full Body HIIT & Cardio Blast"
        FitnessGoal.WEIGHT_GAIN -> "Hypertrophy Upper Strength & Mass"
        FitnessGoal.BUILD_MUSCLE, FitnessGoal.MUSCLE_GAIN -> "Chest, Shoulders & Triceps Strength"
        FitnessGoal.GET_STRONGER, FitnessGoal.STRENGTH -> "Heavy Compound Power Routine"
        FitnessGoal.IMPROVE_FLEXIBILITY -> "Full Body Flexibility & Joint Mobility"
        else -> "Daily Functional Conditioning"
    }

    val workoutDuration = todaysWorkout?.durationMinutes ?: userProfile.workoutDurationMinutes
    val workoutCalories = todaysWorkout?.estimatedCalories ?: (workoutDuration * 9)

    val currentWeightText = String.format("%.1f kg", userProfile.weightKg)
    val targetWeightText = String.format("%.1f kg", userProfile.targetWeightKg)

    val progressPct = 74

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(scrollState)
    ) {
        Spacer(modifier = Modifier.height(12.dp))

        // FitPulse Brand Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            FitPulseHeaderLogo()
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 1. Top Header: User Greeting + Bell & Avatar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Good morning,",
                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 13.sp),
                    color = TextSecondaryDark
                )
                Text(
                    text = "${userProfile.name} 👋",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 24.sp
                    ),
                    color = TextPrimaryDark
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(DarkSurfaceVariant)
                        .border(1.dp, DarkBorderSubtle, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Notifications,
                        contentDescription = "Notifications",
                        tint = TextPrimaryDark,
                        modifier = Modifier.size(20.dp)
                    )
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .align(Alignment.TopEnd)
                            .offset(x = (-6).dp, y = 6.dp)
                            .clip(CircleShape)
                            .background(PurpleAccent)
                    )
                }

                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(PurpleDark)
                        .border(1.5.dp, PurpleAccent, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = userProfile.name.take(1).uppercase(),
                        fontWeight = FontWeight.Black,
                        color = TextPrimaryDark,
                        fontSize = 16.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 2. Goal & Weight Progress Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color(0xFF1E1738), Color(0xFF120E24))
                    )
                )
                .border(1.dp, PurplePrimary.copy(alpha = 0.4f), RoundedCornerShape(22.dp))
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(PurplePrimary.copy(alpha = 0.3f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "GOAL: ${userProfile.goal.displayName.uppercase()}",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = PurpleAccent
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = currentWeightText,
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "→ $targetWeightText target",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                            color = TextSecondaryDark
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "You're $progressPct% closer to your target goal.",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
                        color = TextSecondaryDark
                    )
                }

                // Progress Ring Canvas
                Box(
                    modifier = Modifier.size(76.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val stroke = 6.dp.toPx()
                        // Track
                        drawCircle(
                            color = Color(0xFF2B224C),
                            radius = size.minDimension / 2f - stroke / 2f,
                            style = Stroke(stroke)
                        )
                        // Arc
                        drawArc(
                            color = PurpleAccent,
                            startAngle = -90f,
                            sweepAngle = progressPct * 3.6f,
                            useCenter = false,
                            style = Stroke(stroke, cap = StrokeCap.Round)
                        )
                    }
                    Text(
                        text = "$progressPct%",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 3. Weekly Workout Progress Strip
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Weekly Workout Progress",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 16.sp),
                    color = TextPrimaryDark
                )
                Text(
                    text = "${userProfile.streakDays} Day Streak 🔥",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    color = AmberOrange
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                val days = listOf("M", "T", "W", "T", "F", "S", "S")
                val completed = listOf(true, true, true, true, false, false, false)

                days.forEachIndexed { index, day ->
                    val isDone = completed[index]
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(CircleShape)
                                .background(if (isDone) PurplePrimary else DarkSurfaceVariant)
                                .border(1.dp, if (isDone) PurpleAccent else DarkBorderSubtle, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isDone) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = TextPrimaryDark, modifier = Modifier.size(16.dp))
                            } else {
                                Text(text = day, fontSize = 12.sp, color = TextSecondaryDark, fontWeight = FontWeight.Bold)
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = day, fontSize = 10.sp, color = TextTertiaryDark, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 4. Activity & Calories Triad
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Calories
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                    .clickable { onNavigateNutrition() }
                    .padding(14.dp)
            ) {
                Column {
                    Text("🔥", fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Calories", style = MaterialTheme.typography.labelSmall, color = TextSecondaryDark)
                    Text("560", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    Text("kcal", fontSize = 10.sp, color = TextTertiaryDark)
                }
            }

            // Steps
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                    .clickable { onOpenStepTracker() }
                    .padding(14.dp)
            ) {
                Column {
                    Text("👟", fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Steps", style = MaterialTheme.typography.labelSmall, color = TextSecondaryDark)
                    Text("7,842", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    Text("steps", fontSize = 10.sp, color = TextTertiaryDark)
                }
            }

            // Active Time
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                    .clickable { onStartWorkout() }
                    .padding(14.dp)
            ) {
                Column {
                    Text("⏱", fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Active", style = MaterialTheme.typography.labelSmall, color = TextSecondaryDark)
                    Text("56", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    Text("min", fontSize = 10.sp, color = TextTertiaryDark)
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 5. Today's Plan Header
        Text(
            text = "Today's Plan",
            style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Black, fontSize = 20.sp),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Card A: Today's Workout
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color(0xFF221A3D), Color(0xFF130E26))
                    )
                )
                .border(1.dp, PurplePrimary.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                .padding(18.dp)
        ) {
            Column {
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
                        Text("TODAY'S WORKOUT", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = PurpleAccent)
                    }
                    Text("⏱ $workoutDuration min • 🔥 $workoutCalories kcal", fontSize = 11.sp, color = TextSecondaryDark)
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = workoutTitle,
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp
                    ),
                    color = TextPrimaryDark
                )

                Text(
                    text = "Personalized for ${userProfile.gender.name.lowercase()} • ${userProfile.experienceLevel.displayName}",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondaryDark
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Quick Start Button
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(46.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(PurplePrimary, PurpleSecondary)
                            )
                        )
                        .clickable { onStartWorkout() },
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("⚡", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Start Workout Now",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, fontSize = 15.sp),
                            color = TextPrimaryDark
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Card B: Today's Yoga & Stretch
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(DarkSurface)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(20.dp))
                .clickable { onOpenYoga() }
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(DarkSurfaceVariant)
                            .border(1.dp, PurpleAccent.copy(alpha = 0.5f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🧘", fontSize = 22.sp)
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = "Morning Yoga & Stretch",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 15.sp),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "10 min • Flexibility & Joint Mobility",
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
                            color = TextSecondaryDark
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(PurplePrimary.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(20.dp))
                }
            }
        }

        Spacer(modifier = Modifier.height(28.dp))
    }
}
