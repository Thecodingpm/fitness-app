package com.fitpulse.app.feature.recovery

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.FitnessCard
import com.fitpulse.app.core.components.PrimaryButton
import com.fitpulse.app.core.designsystem.*

@Composable
fun DailyCheckInScreen(
    onSaveCheckIn: (Double, Int, Int, Int) -> Unit,
    onBack: () -> Unit
) {
    var sleepHours by remember { mutableFloatStateOf(7.5f) }
    var selectedMoodIndex by remember { mutableIntStateOf(1) } // 0: Great, 1: Good, 2: Okay, 3: Tired, 4: Exhausted
    var sorenessLevel by remember { mutableIntStateOf(2) } // 1 to 5
    var stressLevel by remember { mutableIntStateOf(2) } // 1 to 5
    var energyLevel by remember { mutableIntStateOf(4) } // 1 to 5

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
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
                text = "Daily Recovery Check-In",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Mood Picker
        FitnessCard {
            Text("How are you feeling today?", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                val moods = listOf("😀" to "Great", "🙂" to "Good", "😐" to "Okay", "😫" to "Tired", "😴" to "Exhausted")
                moods.forEachIndexed { index, (emoji, label) ->
                    val isSelected = selectedMoodIndex == index
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) Emerald500 else DarkSurfaceElevated)
                            .clickable { selectedMoodIndex = index }
                            .padding(horizontal = 10.dp, vertical = 8.dp)
                    ) {
                        Text(emoji, fontSize = 24.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = label,
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                            color = if (isSelected) DarkBackground else TextSecondaryDark
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Sleep Duration
        FitnessCard {
            Text("Sleep Duration: ${"%.1f".format(sleepHours)} Hours", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Teal400)
            Slider(
                value = sleepHours,
                onValueChange = { sleepHours = it },
                valueRange = 4f..11f,
                colors = SliderDefaults.colors(thumbColor = Teal400, activeTrackColor = Teal400)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Muscle Soreness
        FitnessCard {
            Text("Muscle Soreness: Level $sorenessLevel / 5", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Amber400)
            Text("1 = Fresh, 5 = Severe DOMS / Inability to contract", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark)
            Slider(
                value = sorenessLevel.toFloat(),
                onValueChange = { sorenessLevel = it.toInt() },
                valueRange = 1f..5f,
                steps = 3,
                colors = SliderDefaults.colors(thumbColor = Amber400, activeTrackColor = Amber400)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Energy Level
        FitnessCard {
            Text("Perceived Energy: Level $energyLevel / 5", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Emerald400)
            Slider(
                value = energyLevel.toFloat(),
                onValueChange = { energyLevel = it.toInt() },
                valueRange = 1f..5f,
                steps = 3,
                colors = SliderDefaults.colors(thumbColor = Emerald400, activeTrackColor = Emerald400)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        PrimaryButton(
            text = "Save Check-In (+50 XP)",
            onClick = {
                onSaveCheckIn(sleepHours.toDouble(), sorenessLevel, stressLevel, energyLevel)
                onBack()
            },
            icon = Icons.Default.Check
        )

        Spacer(modifier = Modifier.height(30.dp))
    }
}
