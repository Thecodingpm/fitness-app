package com.fitpulse.app.feature.nutrition

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.fitpulse.app.core.components.FitnessCard
import com.fitpulse.app.core.components.PrimaryButton
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.FoodItem
import com.fitpulse.app.core.domain.model.MealEntry
import com.fitpulse.app.core.domain.model.MealType

@Composable
fun FoodLoggingDialog(
    mealType: MealType,
    onDismiss: () -> Unit,
    onFoodLogged: (MealEntry) -> Unit
) {
    var activeTab by remember { mutableIntStateOf(0) } // 0: Search, 1: Quick Add, 2: Custom
    var searchQuery by remember { mutableStateOf("") }

    val sampleFoods = listOf(
        FoodItem(name = "Grilled Chicken Breast", servingSize = "150g", calories = 247, proteinGrams = 46.5, carbsGrams = 0.0, fatGrams = 5.4),
        FoodItem(name = "Brown Rice (Cooked)", servingSize = "200g", calories = 246, proteinGrams = 5.2, carbsGrams = 52.0, fatGrams = 1.8),
        FoodItem(name = "Whole Eggs (3 Large)", servingSize = "150g", calories = 215, proteinGrams = 18.6, carbsGrams = 1.2, fatGrams = 15.0),
        FoodItem(name = "Greek Yogurt 0% Fat", servingSize = "200g", calories = 118, proteinGrams = 20.6, carbsGrams = 7.2, fatGrams = 0.4),
        FoodItem(name = "Whey Isolate Shake", servingSize = "1 scoop", calories = 120, proteinGrams = 25.0, carbsGrams = 2.0, fatGrams = 1.0),
        FoodItem(name = "Avocado", servingSize = "100g", calories = 160, proteinGrams = 2.0, carbsGrams = 8.5, fatGrams = 14.7),
        FoodItem(name = "Oatmeal with Milk", servingSize = "250g", calories = 310, proteinGrams = 10.5, carbsGrams = 54.0, fatGrams = 6.2)
    )

    val filteredFoods = sampleFoods.filter {
        searchQuery.isBlank() || it.name.lowercase().contains(searchQuery.lowercase().trim())
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .background(DarkBackground)
                .padding(20.dp),
            color = DarkBackground
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Log ${mealType.displayName}",
                            style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "Search database or quick-add macros",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondaryDark)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Tabs: Database / Quick Add / Custom
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurfaceVariant)
                        .padding(4.dp)
                ) {
                    listOf("Search Food", "Quick Calories", "Custom Food").forEachIndexed { index, label ->
                        val isSelected = activeTab == index
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (isSelected) Emerald500 else Color.Transparent)
                                .clickable { activeTab = index }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = label,
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                color = if (isSelected) DarkBackground else TextSecondaryDark
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                when (activeTab) {
                    0 -> {
                        // Search Tab
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { Text("Search 100,000+ foods...", color = TextTertiaryDark) },
                            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Emerald400) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Emerald400,
                                unfocusedBorderColor = DarkBorder,
                                focusedTextColor = TextPrimaryDark,
                                unfocusedTextColor = TextPrimaryDark,
                                focusedContainerColor = DarkSurface,
                                unfocusedContainerColor = DarkSurface
                            )
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            items(filteredFoods) { food ->
                                FitnessCard(
                                    onClick = {
                                        onFoodLogged(
                                            MealEntry(
                                                mealType = mealType,
                                                foodItem = food,
                                                servings = 1.0
                                            )
                                        )
                                        onDismiss()
                                    },
                                    backgroundColor = DarkSurface,
                                    borderColor = DarkBorder
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column {
                                            Text(food.name, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
                                            Text("${food.servingSize} • ${food.proteinGrams}g Protein • ${food.carbsGrams}g Carbs • ${food.fatGrams}g Fat", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark)
                                        }
                                        Text("${food.calories} kcal", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Emerald400)
                                    }
                                }
                            }
                        }
                    }
                    1 -> {
                        // Quick Add Tab
                        var quickCals by remember { mutableStateOf("450") }
                        var quickProt by remember { mutableStateOf("30") }

                        FitnessCard {
                            Text("Direct Macro Entry", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedTextField(
                                value = quickCals,
                                onValueChange = { quickCals = it },
                                label = { Text("Calories (kcal)") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedTextField(
                                value = quickProt,
                                onValueChange = { quickProt = it },
                                label = { Text("Protein (grams)") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp)
                            )

                            Spacer(modifier = Modifier.height(20.dp))

                            PrimaryButton(
                                text = "Save Quick Entry",
                                onClick = {
                                    val cals = quickCals.toIntOrNull() ?: 300
                                    val prot = quickProt.toDoubleOrNull() ?: 20.0
                                    onFoodLogged(
                                        MealEntry(
                                            mealType = mealType,
                                            foodItem = FoodItem(
                                                name = "Quick Log (${mealType.displayName})",
                                                servingSize = "1 entry",
                                                calories = cals,
                                                proteinGrams = prot,
                                                carbsGrams = 0.0,
                                                fatGrams = 0.0
                                            )
                                        )
                                    )
                                    onDismiss()
                                }
                            )
                        }
                    }
                    else -> {
                        // Custom Food Creator Tab
                        var customName by remember { mutableStateOf("") }
                        var customCals by remember { mutableStateOf("") }
                        var customProt by remember { mutableStateOf("") }
                        var customCarbs by remember { mutableStateOf("") }
                        var customFat by remember { mutableStateOf("") }

                        FitnessCard {
                            Text("Create Custom Food", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedTextField(value = customName, onValueChange = { customName = it }, label = { Text("Food Name") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            OutlinedTextField(value = customCals, onValueChange = { customCals = it }, label = { Text("Calories") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            OutlinedTextField(value = customProt, onValueChange = { customProt = it }, label = { Text("Protein (g)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
                            Spacer(modifier = Modifier.height(16.dp))

                            PrimaryButton(
                                text = "Save & Log Custom Food",
                                onClick = {
                                    if (customName.isNotBlank()) {
                                        onFoodLogged(
                                            MealEntry(
                                                mealType = mealType,
                                                foodItem = FoodItem(
                                                    name = customName,
                                                    servingSize = "1 serving",
                                                    calories = customCals.toIntOrNull() ?: 200,
                                                    proteinGrams = customProt.toDoubleOrNull() ?: 15.0,
                                                    carbsGrams = customCarbs.toDoubleOrNull() ?: 10.0,
                                                    fatGrams = customFat.toDoubleOrNull() ?: 5.0
                                                )
                                            )
                                        )
                                        onDismiss()
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
