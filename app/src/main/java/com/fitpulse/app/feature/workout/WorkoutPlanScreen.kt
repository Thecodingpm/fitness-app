package com.fitpulse.app.feature.workout

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Search
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
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*

@Composable
fun WorkoutPlanScreen(
    userProfile: UserProfile? = null,
    workoutPlans: List<WorkoutPlan>,
    onSelectPlanToStart: (WorkoutPlan) -> Unit,
    onOpenWorkoutDetail: (WorkoutPlan) -> Unit = {},
    onNavigateExerciseLibrary: () -> Unit = {},
    onCreateCustomRoutine: () -> Unit = {}
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var selectedInstructorGender by remember { mutableStateOf(userProfile?.instructorGender ?: InstructorGender.ANY) }

    val categories = listOf("All", "Weight Loss", "Weight Gain", "Strength", "Cardio", "HIIT", "Full Body", "Upper Body", "Lower Body", "Core", "Mobility")

    // Generate comprehensive Weight Loss and Weight Gain programs
    val weightLossPlans = listOf(
        WorkoutPlan(
            id = "wl_1",
            title = "Fat Burn HIIT Accelerator",
            subtitle = "High-intensity intervals designed to maximize post-exercise oxygen consumption safely.",
            durationMinutes = 25,
            targetMuscles = listOf(MuscleGroup.FULL_BODY, MuscleGroup.CARDIO),
            estimatedCalories = 280,
            difficulty = ExperienceLevel.INTERMEDIATE,
            exercises = emptyList()
        ),
        WorkoutPlan(
            id = "wl_2",
            title = "Full Body Lean Sculpt",
            subtitle = "Compound bodyweight and light resistance supersets for maximum caloric expenditure.",
            durationMinutes = 30,
            targetMuscles = listOf(MuscleGroup.FULL_BODY, MuscleGroup.CORE),
            estimatedCalories = 240,
            difficulty = ExperienceLevel.BEGINNER,
            exercises = emptyList()
        ),
        WorkoutPlan(
            id = "wl_3",
            title = "Cardio & Core Power Flow",
            subtitle = "Dynamic core stabilization combined with steady-state cardio drills.",
            durationMinutes = 20,
            targetMuscles = listOf(MuscleGroup.CORE, MuscleGroup.CARDIO),
            estimatedCalories = 190,
            difficulty = ExperienceLevel.INTERMEDIATE,
            exercises = emptyList()
        )
    )

    val weightGainPlans = listOf(
        WorkoutPlan(
            id = "wg_1",
            title = "Hypertrophy Upper Body Mass",
            subtitle = "Targeted compound pressing, rows, and shoulder hypertrophy with progressive overload.",
            durationMinutes = 35,
            targetMuscles = listOf(MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS),
            estimatedCalories = 310,
            difficulty = ExperienceLevel.INTERMEDIATE,
            exercises = emptyList()
        ),
        WorkoutPlan(
            id = "wg_2",
            title = "Lower Body & Glute Power Builder",
            subtitle = "Deep squats, Romanian deadlifts, and hip thrusts for lower body muscle growth.",
            durationMinutes = 40,
            targetMuscles = listOf(MuscleGroup.LEGS, MuscleGroup.GLUTES),
            estimatedCalories = 360,
            difficulty = ExperienceLevel.ADVANCED,
            exercises = emptyList()
        ),
        WorkoutPlan(
            id = "wg_3",
            title = "Full Body Strength & Density",
            subtitle = "Foundational kinetic strength building across all major muscle chains.",
            durationMinutes = 30,
            targetMuscles = listOf(MuscleGroup.FULL_BODY),
            estimatedCalories = 270,
            difficulty = ExperienceLevel.INTERMEDIATE,
            exercises = emptyList()
        )
    )

    val allRoutines = (workoutPlans + weightLossPlans + weightGainPlans).distinctBy { it.title }

    val filteredRoutines = allRoutines.filter { plan ->
        val matchesSearch = searchQuery.isBlank() || plan.title.contains(searchQuery, ignoreCase = true) || plan.subtitle.contains(searchQuery, ignoreCase = true)
        val matchesCategory = when (selectedCategory) {
            "All" -> true
            "Weight Loss" -> plan.title.contains("Fat", true) || plan.title.contains("HIIT", true) || plan.title.contains("Cardio", true) || plan.title.contains("Lean", true)
            "Weight Gain" -> plan.title.contains("Mass", true) || plan.title.contains("Builder", true) || plan.title.contains("Strength", true) || plan.title.contains("Hypertrophy", true)
            "Strength" -> plan.targetMuscles.contains(MuscleGroup.CHEST) || plan.title.contains("Strength", true)
            "Cardio" -> plan.targetMuscles.contains(MuscleGroup.CARDIO) || plan.title.contains("Cardio", true)
            "Full Body" -> plan.targetMuscles.contains(MuscleGroup.FULL_BODY)
            "Core" -> plan.targetMuscles.contains(MuscleGroup.CORE)
            else -> true
        }
        matchesSearch && matchesCategory
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp),
        contentPadding = PaddingValues(bottom = 32.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(16.dp))

            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Workout Programs",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black, fontSize = 24.sp),
                        color = TextPrimaryDark
                    )
                    Text(
                        text = "Designed for both men & women",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondaryDark
                    )
                }

                IconButton(
                    onClick = onNavigateExerciseLibrary,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(DarkSurfaceVariant)
                ) {
                    Icon(Icons.Default.MenuBook, contentDescription = "Library", tint = PurpleAccent, modifier = Modifier.size(20.dp))
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Male & Female Instructor Selector Strip
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkSurfaceVariant)
                    .padding(4.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                InstructorGender.values().forEach { genderOption ->
                    val isSelected = selectedInstructorGender == genderOption
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) PurplePrimary else Color.Transparent)
                            .clickable { selectedInstructorGender = genderOption }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        val icon = when (genderOption) {
                            InstructorGender.FEMALE -> "♀ Female Model"
                            InstructorGender.MALE -> "♂ Male Model"
                            InstructorGender.ANY -> "⚡ All Models"
                        }
                        Text(
                            text = icon,
                            fontSize = 11.5.sp,
                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                            color = if (isSelected) TextPrimaryDark else TextSecondaryDark
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Search Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(46.dp)
                    .clip(RoundedCornerShape(23.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(23.dp))
                    .padding(horizontal = 14.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.Search, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (searchQuery.isEmpty()) "Search programs, exercises, muscles..." else searchQuery,
                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 13.sp),
                        color = if (searchQuery.isEmpty()) TextTertiaryDark else TextPrimaryDark
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Category Filter Pills
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                categories.forEach { cat ->
                    val isSelected = selectedCategory == cat
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(18.dp))
                            .background(if (isSelected) PurplePrimary else DarkSurface)
                            .border(1.dp, if (isSelected) PurpleAccent else DarkBorderSubtle, RoundedCornerShape(18.dp))
                            .clickable { selectedCategory = cat }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Text(
                            text = cat,
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = if (isSelected) TextPrimaryDark else TextSecondaryDark
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Nutrition & Healthy Guidance Banner (for Weight Gain & General Health)
            if (selectedCategory == "Weight Gain" || userProfile?.goal == FitnessGoal.WEIGHT_GAIN) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(DarkSurfaceVariant)
                        .border(1.dp, PurpleAccent.copy(alpha = 0.4f), RoundedCornerShape(18.dp))
                        .padding(16.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🥗", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Healthy Weight Gain Guidance", fontWeight = FontWeight.Bold, color = PurpleAccent, fontSize = 13.sp)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Target a moderate 300-500 kcal surplus with nutrient-dense meals: Oats, nut butters, salmon, eggs, complex carbs, and 1.6-2.0g protein/kg body weight.",
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 16.sp),
                            color = TextSecondaryDark
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        // Workout Program Cards
        items(filteredRoutines) { plan ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(18.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = plan.title,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, fontSize = 16.sp),
                                color = TextPrimaryDark
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${plan.durationMinutes} min • ${plan.estimatedCalories} kcal • ${plan.difficulty.name.lowercase().capitalize()}",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
                                color = TextSecondaryDark
                            )
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(DarkSurfaceVariant)
                                    .clickable { onOpenWorkoutDetail(plan) },
                                contentAlignment = Alignment.Center
                            ) {
                                Text("📋", fontSize = 13.sp)
                            }

                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(PurplePrimary)
                                    .clickable { onSelectPlanToStart(plan) },
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.PlayArrow, contentDescription = null, tint = TextPrimaryDark, modifier = Modifier.size(18.dp))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = plan.subtitle,
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.5.sp, lineHeight = 16.sp),
                        color = TextSecondaryDark
                    )
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}
