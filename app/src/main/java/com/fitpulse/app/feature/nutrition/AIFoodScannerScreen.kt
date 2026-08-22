package com.fitpulse.app.feature.nutrition

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.FitnessCard
import com.fitpulse.app.core.components.PrimaryButton
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.FoodItem
import com.fitpulse.app.core.domain.model.MealEntry
import com.fitpulse.app.core.domain.model.MealType
import kotlinx.coroutines.delay

@Composable
fun AIFoodScannerScreen(
    onFoodLogged: (MealEntry) -> Unit,
    onBack: () -> Unit
) {
    var isAnalyzing by remember { mutableStateOf(true) }
    var detectedFoodName by remember { mutableStateOf("Grilled Salmon & Quinoa Bowl") }
    var detectedServing by remember { mutableStateOf("320g bowl") }
    var detectedCalories by remember { mutableStateOf("520") }
    var detectedProtein by remember { mutableStateOf("42.0") }
    var detectedCarbs by remember { mutableStateOf("48.0") }
    var detectedFat by remember { mutableStateOf("16.0") }

    LaunchedEffect(Unit) {
        delay(1200)
        isAnalyzing = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(20.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.size(36.dp)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextSecondaryDark)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "AI Vision Nutrition",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Camera Viewport Simulation
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(240.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(DarkSurfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            if (isAnalyzing) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(color = Emerald400, strokeWidth = 3.dp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("AI Estimating Food Items & Volume...", style = MaterialTheme.typography.bodyMedium, color = TextPrimaryDark)
                }
            } else {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🥗", fontSize = 56.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Analysis Confidence: 96%", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = Emerald400)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        if (!isAnalyzing) {
            FitnessCard {
                Text(
                    text = "AI ESTIMATION (EDITABLE BEFORE SAVING)",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                    color = Violet400
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = detectedFoodName,
                    onValueChange = { detectedFoodName = it },
                    label = { Text("Detected Meal") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = detectedCalories,
                        onValueChange = { detectedCalories = it },
                        label = { Text("Calories (kcal)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                    OutlinedTextField(
                        value = detectedProtein,
                        onValueChange = { detectedProtein = it },
                        label = { Text("Protein (g)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = detectedCarbs,
                        onValueChange = { detectedCarbs = it },
                        label = { Text("Carbs (g)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                    OutlinedTextField(
                        value = detectedFat,
                        onValueChange = { detectedFat = it },
                        label = { Text("Fats (g)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                PrimaryButton(
                    text = "Confirm & Log to Lunch",
                    onClick = {
                        onFoodLogged(
                            MealEntry(
                                mealType = MealType.LUNCH,
                                foodItem = FoodItem(
                                    name = detectedFoodName,
                                    servingSize = detectedServing,
                                    calories = detectedCalories.toIntOrNull() ?: 500,
                                    proteinGrams = detectedProtein.toDoubleOrNull() ?: 40.0,
                                    carbsGrams = detectedCarbs.toDoubleOrNull() ?: 45.0,
                                    fatGrams = detectedFat.toDoubleOrNull() ?: 15.0
                                )
                            )
                        )
                        onBack()
                    }
                )
            }
        }
    }
}
