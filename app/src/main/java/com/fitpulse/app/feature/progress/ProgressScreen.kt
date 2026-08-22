package com.fitpulse.app.feature.progress

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
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.PersonalRecord
import com.fitpulse.app.core.domain.model.ProgressMetric

@Composable
fun ProgressScreen(
    progressMetrics: List<ProgressMetric>,
    personalRecords: List<PersonalRecord>,
    onOpenProgressPhotos: () -> Unit = {},
    onOpenPersonalRecords: () -> Unit = {}
) {
    var selectedTab by remember { mutableStateOf("Overview") }
    val tabs = listOf("Overview", "Weight History", "Personal Records")
    var showWeightDialog by remember { mutableStateOf(false) }
    var currentWeight by remember { mutableDoubleStateOf(72.4) }

    val weeklyCalories = listOf(
        "Mon" to 450f,
        "Tue" to 620f,
        "Wed" to 510f,
        "Thu" to 900f,
        "Fri" to 540f,
        "Sat" to 680f,
        "Sun" to 460f
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Header
        Text(
            text = "Progress & Analytics",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                fontSize = 24.sp
            ),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Segmented Control Tabs: [ Overview ] | [ Weight History ] | [ Personal Records ]
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkSurfaceVariant)
                .padding(4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            tabs.forEach { tab ->
                val isSelected = selectedTab == tab
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) PurplePrimary else Color.Transparent)
                        .clickable { selectedTab = tab }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = tab,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                        color = if (isSelected) TextPrimaryDark else TextSecondaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 4-Stat Metric Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("WORKOUTS", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = TextTertiaryDark)
                Text("5", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                Text("Sessions", fontSize = 10.sp, color = TextSecondaryDark)
            }

            Column(modifier = Modifier.weight(1f)) {
                Text("CALORIES", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = TextTertiaryDark)
                Text("2,450", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                Text("KCAL", fontSize = 10.sp, color = TextSecondaryDark)
            }

            Column(modifier = Modifier.weight(1f)) {
                Text("ACTIVE TIME", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = TextTertiaryDark)
                Text("4h 35m", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                Text("This Week", fontSize = 10.sp, color = TextSecondaryDark)
            }

            Column(modifier = Modifier.weight(1f)) {
                Text("STEPS", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = TextTertiaryDark)
                Text("52,843", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                Text("Total Steps", fontSize = 10.sp, color = TextSecondaryDark)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Body Weight Progression Card with Update CTA
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(DarkSurface)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(22.dp))
                .padding(18.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Body Weight History",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimaryDark
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "$currentWeight kg",
                                style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Black),
                                color = TextPrimaryDark
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "↓ 1.6 kg vs last month",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                color = PurpleAccent
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(PurplePrimary.copy(alpha = 0.2f))
                            .clickable { showWeightDialog = true }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text("+ Update", color = PurpleAccent, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Smooth Glowing Curve Canvas
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(90.dp)
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val w = size.width
                        val h = size.height

                        val path = Path().apply {
                            moveTo(0f, h * 0.25f)
                            cubicTo(w * 0.3f, h * 0.3f, w * 0.5f, h * 0.65f, w * 0.85f, h * 0.75f)
                            lineTo(w, h * 0.8f)
                        }

                        drawPath(
                            path = path,
                            color = PurpleAccent,
                            style = Stroke(width = 3.5.dp.toPx(), cap = StrokeCap.Round)
                        )

                        // Glow endpoint node
                        drawCircle(color = PurpleGlow, radius = 10.dp.toPx(), center = Offset(w, h * 0.8f))
                        drawCircle(color = PurpleAccent, radius = 4.dp.toPx(), center = Offset(w, h * 0.8f))
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Calories Burned Weekly Bar Chart Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(DarkSurface)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(22.dp))
                .padding(18.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Weekly Activity & Calories",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimaryDark
                    )
                    Text("This Week ⌄", fontSize = 12.sp, color = TextSecondaryDark)
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    weeklyCalories.forEach { (day, kcal) ->
                        val maxKcal = 1000f
                        val heightFraction = (kcal / maxKcal).coerceIn(0.1f, 1f)

                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Bottom,
                            modifier = Modifier.fillMaxHeight()
                        ) {
                            Box(
                                modifier = Modifier
                                    .width(22.dp)
                                    .fillMaxHeight(heightFraction)
                                    .clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp))
                                    .background(
                                        if (kcal >= 800f) PurpleAccent else PurplePrimary
                                    )
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(text = day, fontSize = 10.sp, color = TextSecondaryDark, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Personal Records Showcase
        Text(
            text = "Personal Records (PRs)",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 16.sp),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(10.dp))

        val records = if (personalRecords.isNotEmpty()) personalRecords else listOf(
            PersonalRecord(exerciseId = "1", exerciseName = "Barbell Back Squat", weightKg = 120.0, reps = 5, achievedDate = System.currentTimeMillis()),
            PersonalRecord(exerciseId = "2", exerciseName = "Bench Press", weightKg = 85.0, reps = 6, achievedDate = System.currentTimeMillis()),
            PersonalRecord(exerciseId = "3", exerciseName = "Deadlift", weightKg = 145.0, reps = 3, achievedDate = System.currentTimeMillis())
        )

        records.forEach { pr ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(pr.exerciseName, fontWeight = FontWeight.Bold, color = TextPrimaryDark, fontSize = 14.sp)
                        Text("${pr.reps} Reps", fontSize = 11.sp, color = TextSecondaryDark)
                    }
                    Text("${pr.weightKg} kg 🏆", fontWeight = FontWeight.Black, color = PurpleAccent, fontSize = 15.sp)
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))
    }

    // Update Weight Dialog
    if (showWeightDialog) {
        AlertDialog(
            onDismissRequest = { showWeightDialog = false },
            title = { Text("Log Current Weight", color = TextPrimaryDark, fontWeight = FontWeight.Black) },
            text = {
                Column {
                    Text("Enter your new measured weight:", color = TextSecondaryDark, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = currentWeight.toString(),
                        onValueChange = { currentWeight = it.toDoubleOrNull() ?: currentWeight },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PurplePrimary,
                            unfocusedBorderColor = DarkBorderSubtle,
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showWeightDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Save Weight", color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showWeightDialog = false }) {
                    Text("Cancel", color = TextSecondaryDark)
                }
            },
            containerColor = DarkSurfaceVariant
        )
    }
}
