package com.fitpulse.app.feature.dashboard

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
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
    dailyNutrition: DailyNutrition? = null,
    recoveryMetrics: RecoveryMetrics? = null,
    stepTrackerData: StepTrackerData = StepTrackerData(),
    onStartWorkout: () -> Unit,
    onOpenAICoach: () -> Unit = {},
    onOpenExercises: (MuscleGroup?) -> Unit = {},
    onOpenWorkouts: () -> Unit = {}
) {
    val scrollState = rememberScrollState()

    val workoutTitle = todaysWorkout?.title ?: when (userProfile.goal) {
        FitnessGoal.WEIGHT_LOSS, FitnessGoal.FAT_LOSS -> "Day 1: Full Body Lean Burn"
        FitnessGoal.BUILD_MUSCLE, FitnessGoal.MUSCLE_GAIN -> "Day 1: Chest & Triceps Hypertrophy"
        FitnessGoal.GET_STRONGER, FitnessGoal.STRENGTH -> "Day 1: Heavy Compound Strength"
        else -> "Day 1: Gym Foundation & Form"
    }

    val workoutDuration = todaysWorkout?.durationMinutes ?: userProfile.workoutDurationMinutes
    val exercisesCount = todaysWorkout?.exercises?.size ?: 4

    val weeklySchedule = listOf(
        Pair("Mon", "Chest & Tri"),
        Pair("Tue", "Back & Bi"),
        Pair("Wed", "Rest / Walk"),
        Pair("Thu", "Legs & Core"),
        Pair("Fri", "Shoulders & Arms"),
        Pair("Sat", "Full Body Hiit"),
        Pair("Sun", "Rest Day")
    )
    var selectedDayIndex by remember { mutableIntStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(scrollState)
    ) {
        Spacer(modifier = Modifier.height(14.dp))

        // 1. Top Brand Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            FitPulseHeaderLogo()

            // Streak Badge
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkSurfaceVariant)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(5.dp)
            ) {
                Text("🔥", fontSize = 14.sp)
                Text(
                    text = "${userProfile.streakDays} Days",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black),
                    color = AmberWarning
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 2. User Greeting
        Column {
            Text(
                text = "Welcome back,",
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 13.sp),
                color = TextSecondaryDark
            )
            Text(
                text = "${userProfile.name} 💪",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Black,
                    fontSize = 24.sp
                ),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        // ========================================================
        // 3. THE HERO WORKOUT CARD (Centerpiece of the App)
        // ========================================================
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(26.dp))
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF241A42), Color(0xFF130E26))
                    )
                )
                .border(1.5.dp, PurplePrimary.copy(alpha = 0.6f), RoundedCornerShape(26.dp))
                .padding(22.dp)
        ) {
            Column {
                // Badge Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(PurplePrimary)
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "TODAY'S WORKOUT",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black, fontSize = 10.sp),
                            color = Color.White
                        )
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(Icons.Default.Timer, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(14.dp))
                        Text(
                            text = "$workoutDuration min",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = PurpleAccent
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = workoutTitle,
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp
                    ),
                    color = TextPrimaryDark
                )

                Text(
                    text = "$exercisesCount Exercises with 3D Animations & Auto Rest Timers",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondaryDark,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Exercise Preview Chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf("Bench Press", "Incline DB", "Squats", "Pulldowns").take(3).forEach { exName ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(DarkSurface)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(10.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "• $exName",
                                style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
                                color = TextPrimaryDark
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Big Start Button
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
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Start Workout Now",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                            color = Color.White
                        )
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ========================================================
        // 4. WEEKLY GYM SCHEDULE (Clear Roadmap for Beginners)
        // ========================================================
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Weekly Gym Split",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                color = TextPrimaryDark
            )
            Text(
                text = "Beginner Plan",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                color = PurpleAccent
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(weeklySchedule.mapIndexed { idx, item -> Triple(idx, item.first, item.second) }) { (idx, day, workout) ->
                val isSelected = selectedDayIndex == idx
                Box(
                    modifier = Modifier
                        .width(92.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) PurplePrimary.copy(alpha = 0.25f) else DarkSurface)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) PurplePrimary else DarkBorderSubtle,
                            shape = RoundedCornerShape(16.dp)
                        )
                        .clickable { selectedDayIndex = idx }
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = day,
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                            ),
                            color = if (isSelected) PurpleAccent else TextSecondaryDark
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = workout,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 10.5.sp
                            ),
                            color = TextPrimaryDark,
                            maxLines = 2
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ========================================================
        // 5. 3D EXERCISE CATEGORIES (Search by Muscle)
        // ========================================================
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "3D Exercise Guide",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                color = TextPrimaryDark
            )
            Text(
                text = "View All →",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                color = PurpleAccent,
                modifier = Modifier.clickable { onOpenExercises(null) }
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            val quickCategories = listOf(
                Pair(MuscleGroup.CHEST, "Chest & Tris"),
                Pair(MuscleGroup.BACK, "Back & Lats"),
                Pair(MuscleGroup.LEGS, "Legs & Quads")
            )

            quickCategories.forEach { (muscle, label) ->
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                        .clickable { onOpenExercises(muscle) }
                        .padding(vertical = 14.dp, horizontal = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = when (muscle) {
                                MuscleGroup.CHEST -> "🏋️"
                                MuscleGroup.BACK -> "🧗"
                                else -> "🦵"
                            },
                            fontSize = 22.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = label,
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 11.sp),
                            color = TextPrimaryDark
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}
