package com.fitpulse.app.feature.nutrition

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.*
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*

@Composable
fun NutritionScreen(
    dailyNutrition: DailyNutrition,
    userProfile: UserProfile,
    onOpenFoodLogging: (MealType) -> Unit,
    onOpenAIFoodScanner: () -> Unit,
    onOpenAIMealPlanner: () -> Unit,
    onAddWater: (Double) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Header & Quick AI Action
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Nutrition Tracker",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.Black
                ),
                color = TextPrimaryDark
            )

            IconButton(
                onClick = onOpenAIFoodScanner,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Emerald500)
            ) {
                Icon(Icons.Default.CameraAlt, contentDescription = "AI Food Scanner", tint = DarkBackground)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // AI Meal Planner Card
        FitnessCard(
            onClick = onOpenAIMealPlanner,
            backgroundColor = DarkSurfaceVariant,
            borderColor = Violet500.copy(alpha = 0.4f)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "AI MACRO MEAL PLANNER",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = Violet400
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Generate Targeted Meal Splits",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimaryDark
                    )
                }
                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Violet400)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Daily Calories & Macro Target Dashboard
        GlowCard {
            Text(
                text = "DAILY ENERGY INTAKE",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                ),
                color = Amber400
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom
            ) {
                Column {
                    Text(
                        text = "${dailyNutrition.totalCaloriesConsumed}",
                        style = MaterialTheme.typography.displayMedium.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark
                    )
                    Text(
                        text = "of ${userProfile.dailyCalorieTarget} kcal target",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondaryDark
                    )
                }

                val remaining = (userProfile.dailyCalorieTarget - dailyNutrition.totalCaloriesConsumed).coerceAtLeast(0)
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "$remaining",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = Emerald400
                    )
                    Text(
                        text = "kcal remaining",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondaryDark
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Macro Progress Bars
            MacroProgressBar(
                label = "Protein",
                current = dailyNutrition.totalProteinGrams.toInt(),
                target = userProfile.dailyProteinTargetGrams,
                unit = "g",
                color = Emerald400
            )

            Spacer(modifier = Modifier.height(10.dp))

            MacroProgressBar(
                label = "Carbohydrates",
                current = dailyNutrition.totalCarbsGrams.toInt(),
                target = userProfile.dailyCarbsTargetGrams,
                unit = "g",
                color = Teal400
            )

            Spacer(modifier = Modifier.height(10.dp))

            MacroProgressBar(
                label = "Healthy Fats",
                current = dailyNutrition.totalFatGrams.toInt(),
                target = userProfile.dailyFatTargetGrams,
                unit = "g",
                color = Amber400
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Water Hydration Tracker
        FitnessCard {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "HYDRATION TRACKER",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = Teal400
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${"%.1f".format(dailyNutrition.waterIntakeLiters)} / ${userProfile.dailyWaterTargetLiters} L",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimaryDark
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(Teal500)
                            .clickable { onAddWater(0.25) }
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Text("+250ml", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold), color = DarkBackground)
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(Teal500)
                            .clickable { onAddWater(0.5) }
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Text("+500ml", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold), color = DarkBackground)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Today's Meals",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Meal Sections
        MealType.values().forEach { mealType ->
            val mealsForType = dailyNutrition.meals.filter { it.mealType == mealType }
            val cals = mealsForType.sumOf { (it.foodItem.calories * it.servings).toInt() }
            val prot = mealsForType.sumOf { (it.foodItem.proteinGrams * it.servings).toInt() }

            FitnessCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                backgroundColor = DarkSurface,
                borderColor = DarkBorder
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = mealType.displayName,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "$cals kcal • ${prot}g protein",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )
                    }

                    IconButton(
                        onClick = { onOpenFoodLogging(mealType) },
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(DarkSurfaceElevated)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add Food", tint = Emerald400, modifier = Modifier.size(18.dp))
                    }
                }

                if (mealsForType.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(10.dp))
                    mealsForType.forEach { entry ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "• ${entry.foodItem.name} (${entry.foodItem.servingSize})",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondaryDark
                            )
                            Text(
                                text = "${(entry.foodItem.calories * entry.servings).toInt()} kcal",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                color = TextPrimaryDark
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}

@Composable
private fun MacroProgressBar(
    label: String,
    current: Int,
    target: Int,
    unit: String,
    color: Color
) {
    val progress = if (target > 0) (current.toFloat() / target.toFloat()).coerceIn(0f, 1f) else 0f

    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium), color = TextSecondaryDark)
            Text("$current / $target $unit", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = color,
            trackColor = DarkBorder
        )
    }
}
