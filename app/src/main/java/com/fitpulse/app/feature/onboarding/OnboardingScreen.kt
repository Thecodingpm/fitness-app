package com.fitpulse.app.feature.onboarding

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.R
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*

@Composable
fun OnboardingScreen(
    onFinishOnboarding: (UserProfile) -> Unit
) {
    var step by remember { mutableIntStateOf(1) }
    val totalSteps = 11

    // User Setup State
    var userName by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf(Gender.MALE) }
    var goal by remember { mutableStateOf(FitnessGoal.WEIGHT_LOSS) }
    var age by remember { mutableIntStateOf(26) }
    var heightCm by remember { mutableDoubleStateOf(175.0) }
    var weightKg by remember { mutableDoubleStateOf(75.0) }
    var targetWeightKg by remember { mutableDoubleStateOf(70.0) }
    var experience by remember { mutableStateOf(ExperienceLevel.INTERMEDIATE) }
    var daysPerWeek by remember { mutableIntStateOf(4) }
    var workoutDurationMinutes by remember { mutableIntStateOf(30) }

    // Unit toggle states
    var isHeightFt by remember { mutableStateOf(false) }
    var isWeightLb by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 24.dp, vertical = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Navigation Bar & Progress Indicator
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (step > 1) {
                    IconButton(
                        onClick = { step-- },
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(DarkSurfaceVariant)
                    ) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark, modifier = Modifier.size(18.dp))
                    }
                } else {
                    Spacer(modifier = Modifier.size(36.dp))
                }

                Text(
                    text = "Step $step of $totalSteps",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFFA1A1AA)
                )

                // Skip / Info
                Text(
                    text = "${(step * 100) / totalSteps}%",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    color = TextSecondaryDark
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Step Progress Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(DarkSurfaceVariant)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(step.toFloat() / totalSteps)
                        .fillMaxHeight()
                        .clip(RoundedCornerShape(2.dp))
                        .background(Color.White)
                )
            }
        }

        // Main Question Content Body
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(vertical = 16.dp)
                .verticalScroll(rememberScrollState()),
            contentAlignment = Alignment.Center
        ) {
            when (step) {
                // ==========================================
                // 1. NAME PERSONALIZATION (LIFT ONBOARDING PAGE)
                // ==========================================
                1 -> {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 4.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Spacer(modifier = Modifier.height(20.dp))

                        // Main LIFT Branding/Wordmark in PURE WHITE
                        Image(
                            painter = painterResource(id = R.drawable.ic_lift_logo),
                            contentDescription = "LIFT Main Logo",
                            modifier = Modifier
                                .height(44.dp),
                            contentScale = ContentScale.Fit
                        )

                            Spacer(modifier = Modifier.height(36.dp))

                            // 3. Welcoming Heading
                            Text(
                                text = "What should we call you?",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    fontSize = 26.sp,
                                    lineHeight = 32.sp
                                ),
                                color = Color.White,
                                textAlign = TextAlign.Center
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // 4. Short Subtitle
                            Text(
                                text = "Let's personalize your fitness journey.",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontSize = 14.sp,
                                    lineHeight = 20.sp
                                ),
                                color = Color(0xFFA1A1AA),
                                textAlign = TextAlign.Center
                            )

                            Spacer(modifier = Modifier.height(36.dp))

                            // 5. Clean Name Input Field
                            OutlinedTextField(
                                value = userName,
                                onValueChange = { userName = it },
                                placeholder = {
                                    Text(
                                        text = "Enter your name",
                                        color = Color(0xFF71717A),
                                        fontSize = 15.sp
                                    )
                                },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(
                                    capitalization = KeyboardCapitalization.Words,
                                    imeAction = ImeAction.Done
                                ),
                                keyboardActions = KeyboardActions(
                                    onDone = {
                                        if (userName.isNotBlank()) step++
                                    }
                                ),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color.White,
                                    unfocusedBorderColor = Color(0xFF2E2E32),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White,
                                    focusedContainerColor = Color(0xFF141414),
                                    unfocusedContainerColor = Color(0xFF141414),
                                    cursorColor = Color.White
                                ),
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(58.dp)
                            )

                            Spacer(modifier = Modifier.height(20.dp))
                        }
                    }

                // ==========================================
                // 2. SELECT UNITS (LIFT MONOCHROME THEME)
                // ==========================================
                2 -> {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 4.dp),
                        horizontalAlignment = Alignment.Start
                    ) {
                        Text(
                            text = "Select Units",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 28.sp
                            ),
                            color = Color.White
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        // 1. Weight Unit
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFF141414))
                                .border(1.dp, Color(0xFF2E2E32), RoundedCornerShape(16.dp))
                                .padding(18.dp)
                        ) {
                            Column {
                                Text("Weight", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color(0xFF0A0A0A))
                                        .border(1.dp, Color(0xFF242428), RoundedCornerShape(12.dp))
                                        .padding(4.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(9.dp))
                                            .background(if (!isWeightLb) Color(0xFF2E2E34) else Color.Transparent)
                                            .clickable { isWeightLb = false }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("kg", color = if (!isWeightLb) Color.White else Color(0xFF71717A), fontWeight = FontWeight.Bold)
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(9.dp))
                                            .background(if (isWeightLb) Color(0xFF2E2E34) else Color.Transparent)
                                            .clickable { isWeightLb = true }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("lbs", color = if (isWeightLb) Color.White else Color(0xFF71717A), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // 2. Distance Unit
                        var isDistanceMiles by remember { mutableStateOf(false) }
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFF141414))
                                .border(1.dp, Color(0xFF2E2E32), RoundedCornerShape(16.dp))
                                .padding(18.dp)
                        ) {
                            Column {
                                Text("Distance", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color(0xFF0A0A0A))
                                        .border(1.dp, Color(0xFF242428), RoundedCornerShape(12.dp))
                                        .padding(4.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(9.dp))
                                            .background(if (!isDistanceMiles) Color(0xFF2E2E34) else Color.Transparent)
                                            .clickable { isDistanceMiles = false }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("kilometers", color = if (!isDistanceMiles) Color.White else Color(0xFF71717A), fontWeight = FontWeight.Bold)
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(9.dp))
                                            .background(if (isDistanceMiles) Color(0xFF2E2E34) else Color.Transparent)
                                            .clickable { isDistanceMiles = true }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("miles", color = if (isDistanceMiles) Color.White else Color(0xFF71717A), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // 3. Body Measurements
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFF141414))
                                .border(1.dp, Color(0xFF2E2E32), RoundedCornerShape(16.dp))
                                .padding(18.dp)
                        ) {
                            Column {
                                Text("Body Measurements", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color(0xFF0A0A0A))
                                        .border(1.dp, Color(0xFF242428), RoundedCornerShape(12.dp))
                                        .padding(4.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(9.dp))
                                            .background(if (!isHeightFt) Color(0xFF2E2E34) else Color.Transparent)
                                            .clickable { isHeightFt = false }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("cm", color = if (!isHeightFt) Color.White else Color(0xFF71717A), fontWeight = FontWeight.Bold)
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(9.dp))
                                            .background(if (isHeightFt) Color(0xFF2E2E34) else Color.Transparent)
                                            .clickable { isHeightFt = true }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("in", color = if (isHeightFt) Color.White else Color(0xFF71717A), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))
                    }
                }

                // ==========================================
                // 3. GENDER
                // ==========================================
                3 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your gender?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "This personalizes your instructor models and caloric plan.",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        val genderOptions = listOf(
                            Triple(Gender.MALE, "Male", "♂"),
                            Triple(Gender.FEMALE, "Female", "♀"),
                            Triple(Gender.OTHER, "Prefer not to say", "⚪")
                        )

                        genderOptions.forEach { (gen, title, icon) ->
                            val isSelected = gender == gen
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(if (isSelected) PurplePrimary.copy(alpha = 0.2f) else DarkSurface)
                                    .border(
                                        width = if (isSelected) 2.dp else 1.dp,
                                        color = if (isSelected) PurpleAccent else DarkBorderSubtle,
                                        shape = RoundedCornerShape(20.dp)
                                    )
                                    .clickable { gender = gen }
                                    .padding(20.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(text = icon, fontSize = 24.sp, color = if (isSelected) PurpleAccent else TextSecondaryDark)
                                        Spacer(modifier = Modifier.width(16.dp))
                                        Text(
                                            text = title,
                                            style = MaterialTheme.typography.titleMedium.copy(
                                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                            ),
                                            color = TextPrimaryDark
                                        )
                                    }
                                    if (isSelected) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PurpleAccent)
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(14.dp))
                        }
                    }
                }

                // ==========================================
                // 4. MAIN GOAL (All 7 Options)
                // ==========================================
                4 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your main goal?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "We will generate your personalized adaptive daily program.",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        val goalOptions = listOf(
                            Pair(FitnessGoal.WEIGHT_LOSS, "📉 Lose Weight"),
                            Pair(FitnessGoal.WEIGHT_GAIN, "📈 Gain Weight"),
                            Pair(FitnessGoal.BUILD_MUSCLE, "🏋️ Build Muscle"),
                            Pair(FitnessGoal.GET_STRONGER, "⚡ Get Stronger"),
                            Pair(FitnessGoal.IMPROVE_FITNESS, "🏃 Improve Fitness"),
                            Pair(FitnessGoal.IMPROVE_FLEXIBILITY, "🧘 Improve Flexibility"),
                            Pair(FitnessGoal.STAY_HEALTHY, "🥗 Stay Healthy")
                        )

                        goalOptions.forEach { (g, title) ->
                            val isSelected = goal == g
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(if (isSelected) PurplePrimary.copy(alpha = 0.2f) else DarkSurface)
                                    .border(
                                        width = if (isSelected) 1.5.dp else 1.dp,
                                        color = if (isSelected) PurpleAccent else DarkBorderSubtle,
                                        shape = RoundedCornerShape(16.dp)
                                    )
                                    .clickable { goal = g }
                                    .padding(horizontal = 16.dp, vertical = 14.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = title,
                                        style = MaterialTheme.typography.titleSmall.copy(
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                        ),
                                        color = TextPrimaryDark
                                    )
                                    if (isSelected) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(20.dp))
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }
                    }
                }

                // ==========================================
                // 5. AGE
                // ==========================================
                5 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your age?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "Helps optimize workout intensity and heart rate zones.",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )

                        Spacer(modifier = Modifier.height(36.dp))

                        Text(
                            text = "$age",
                            style = MaterialTheme.typography.displayLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 64.sp
                            ),
                            color = PurpleAccent
                        )
                        Text(text = "years old", color = TextSecondaryDark, fontSize = 14.sp)

                        Spacer(modifier = Modifier.height(28.dp))

                        Slider(
                            value = age.toFloat(),
                            onValueChange = { age = it.toInt() },
                            valueRange = 16f..80f,
                            colors = SliderDefaults.colors(
                                thumbColor = PurpleAccent,
                                activeTrackColor = PurplePrimary,
                                inactiveTrackColor = DarkSurfaceVariant
                            )
                        )
                    }
                }

                // ==========================================
                // 6. HEIGHT (CM / FT)
                // ==========================================
                6 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your height?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Unit Toggle (cm / ft)
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(DarkSurfaceVariant)
                                .padding(4.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (!isHeightFt) PurplePrimary else Color.Transparent)
                                    .clickable { isHeightFt = false }
                                    .padding(horizontal = 16.dp, vertical = 6.dp)
                            ) {
                                Text("cm", fontWeight = FontWeight.Bold, color = if (!isHeightFt) TextPrimaryDark else TextSecondaryDark)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isHeightFt) PurplePrimary else Color.Transparent)
                                    .clickable { isHeightFt = true }
                                    .padding(horizontal = 16.dp, vertical = 6.dp)
                            ) {
                                Text("ft", fontWeight = FontWeight.Bold, color = if (isHeightFt) TextPrimaryDark else TextSecondaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(28.dp))

                        val displayHeight = if (isHeightFt) {
                            val totalInches = (heightCm / 2.54).toInt()
                            val ft = totalInches / 12
                            val inch = totalInches % 12
                            "$ft' $inch\""
                        } else {
                            "${heightCm.toInt()} cm"
                        }

                        Text(
                            text = displayHeight,
                            style = MaterialTheme.typography.displayLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 52.sp
                            ),
                            color = PurpleAccent
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Slider(
                            value = heightCm.toFloat(),
                            onValueChange = { heightCm = it.toDouble() },
                            valueRange = 130f..220f,
                            colors = SliderDefaults.colors(
                                thumbColor = PurpleAccent,
                                activeTrackColor = PurplePrimary,
                                inactiveTrackColor = DarkSurfaceVariant
                            )
                        )
                    }
                }

                // ==========================================
                // 7. CURRENT WEIGHT (KG / LB)
                // ==========================================
                7 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your current weight?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Unit Toggle (kg / lb)
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(DarkSurfaceVariant)
                                .padding(4.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (!isWeightLb) PurplePrimary else Color.Transparent)
                                    .clickable { isWeightLb = false }
                                    .padding(horizontal = 16.dp, vertical = 6.dp)
                            ) {
                                Text("kg", fontWeight = FontWeight.Bold, color = if (!isWeightLb) TextPrimaryDark else TextSecondaryDark)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isWeightLb) PurplePrimary else Color.Transparent)
                                    .clickable { isWeightLb = true }
                                    .padding(horizontal = 16.dp, vertical = 6.dp)
                            ) {
                                Text("lb", fontWeight = FontWeight.Bold, color = if (isWeightLb) TextPrimaryDark else TextSecondaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(28.dp))

                        val displayWeight = if (isWeightLb) {
                            String.format("%.1f lb", weightKg * 2.20462)
                        } else {
                            String.format("%.1f kg", weightKg)
                        }

                        Text(
                            text = displayWeight,
                            style = MaterialTheme.typography.displayLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 52.sp
                            ),
                            color = PurpleAccent
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Slider(
                            value = weightKg.toFloat(),
                            onValueChange = { weightKg = it.toDouble() },
                            valueRange = 40f..150f,
                            colors = SliderDefaults.colors(
                                thumbColor = PurpleAccent,
                                activeTrackColor = PurplePrimary,
                                inactiveTrackColor = DarkSurfaceVariant
                            )
                        )
                    }
                }

                // ==========================================
                // 8. TARGET WEIGHT (KG / LB)
                // ==========================================
                8 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your target weight?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "We ensure safe, sustainable, and healthy progression.",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        val displayTarget = if (isWeightLb) {
                            String.format("%.1f lb", targetWeightKg * 2.20462)
                        } else {
                            String.format("%.1f kg", targetWeightKg)
                        }

                        Text(
                            text = displayTarget,
                            style = MaterialTheme.typography.displayLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 52.sp
                            ),
                            color = PurpleAccent
                        )

                        val diff = targetWeightKg - weightKg
                        val diffText = if (diff >= 0) "+${String.format("%.1f", diff)} kg goal" else "${String.format("%.1f", diff)} kg goal"
                        Text(text = diffText, color = if (diff < 0) Emerald400 else AmberOrange, fontWeight = FontWeight.Bold, fontSize = 14.sp)

                        Spacer(modifier = Modifier.height(24.dp))

                        Slider(
                            value = targetWeightKg.toFloat(),
                            onValueChange = { targetWeightKg = it.toDouble() },
                            valueRange = 40f..150f,
                            colors = SliderDefaults.colors(
                                thumbColor = PurpleAccent,
                                activeTrackColor = PurplePrimary,
                                inactiveTrackColor = DarkSurfaceVariant
                            )
                        )
                    }
                }

                // ==========================================
                // 9. FITNESS LEVEL
                // ==========================================
                9 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "What is your fitness level?",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        val levels = listOf(
                            Triple(ExperienceLevel.BEGINNER, "Beginner", "New to training or getting back after a break"),
                            Triple(ExperienceLevel.INTERMEDIATE, "Intermediate", "Regularly active with good movement familiarity"),
                            Triple(ExperienceLevel.ADVANCED, "Advanced", "Years of consistent athletic or strength training")
                        )

                        levels.forEach { (lvl, title, desc) ->
                            val isSelected = experience == lvl
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(18.dp))
                                    .background(if (isSelected) PurplePrimary.copy(alpha = 0.2f) else DarkSurface)
                                    .border(
                                        width = if (isSelected) 1.5.dp else 1.dp,
                                        color = if (isSelected) PurpleAccent else DarkBorderSubtle,
                                        shape = RoundedCornerShape(18.dp)
                                    )
                                    .clickable { experience = lvl }
                                    .padding(18.dp)
                            ) {
                                Column {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = title,
                                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                            color = TextPrimaryDark
                                        )
                                        if (isSelected) {
                                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PurpleAccent)
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(text = desc, style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark)
                                }
                            }
                            Spacer(modifier = Modifier.height(14.dp))
                        }
                    }
                }

                // ==========================================
                // 10. DAYS PER WEEK
                // ==========================================
                10 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "How many days per week do you want to exercise?",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Black,
                                textAlign = TextAlign.Center
                            ),
                            color = TextPrimaryDark
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        val daysOptions = listOf(
                            Pair(2, "2 days"),
                            Pair(3, "3 days"),
                            Pair(4, "4 days"),
                            Pair(5, "5 days"),
                            Pair(6, "6 days"),
                            Pair(7, "Every day")
                        )

                        daysOptions.forEach { (d, label) ->
                            val isSelected = daysPerWeek == d
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(if (isSelected) PurplePrimary.copy(alpha = 0.2f) else DarkSurface)
                                    .border(
                                        width = if (isSelected) 1.5.dp else 1.dp,
                                        color = if (isSelected) PurpleAccent else DarkBorderSubtle,
                                        shape = RoundedCornerShape(16.dp)
                                    )
                                    .clickable { daysPerWeek = d }
                                    .padding(horizontal = 18.dp, vertical = 14.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = label,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                        ),
                                        color = TextPrimaryDark
                                    )
                                    if (isSelected) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(20.dp))
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }
                    }
                }

                // ==========================================
                // 11. WORKOUT TIME DURATION
                // ==========================================
                11 -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "How much time can you exercise?",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Black,
                                textAlign = TextAlign.Center
                            ),
                            color = TextPrimaryDark
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        val timeOptions = listOf(
                            Pair(10, "10 minutes"),
                            Pair(20, "20 minutes"),
                            Pair(30, "30 minutes"),
                            Pair(45, "45 minutes"),
                            Pair(60, "60+ minutes")
                        )

                        timeOptions.forEach { (mins, label) ->
                            val isSelected = workoutDurationMinutes == mins
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(if (isSelected) PurplePrimary.copy(alpha = 0.2f) else DarkSurface)
                                    .border(
                                        width = if (isSelected) 1.5.dp else 1.dp,
                                        color = if (isSelected) PurpleAccent else DarkBorderSubtle,
                                        shape = RoundedCornerShape(16.dp)
                                    )
                                    .clickable { workoutDurationMinutes = mins }
                                    .padding(horizontal = 18.dp, vertical = 14.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = label,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                        ),
                                        color = TextPrimaryDark
                                    )
                                    if (isSelected) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(20.dp))
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }
                    }
                }
            }
        }

        // Bottom CTA Button (Matching Luxury Minimal LIFT aesthetic)
        val isStepValid = if (step == 1) userName.isNotBlank() else true

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(if (isStepValid) Color.White else Color(0xFF1E1E22))
                .border(
                    width = 1.dp,
                    color = if (isStepValid) Color.White else Color(0xFF2E2E32),
                    shape = RoundedCornerShape(16.dp)
                )
                .clickable(enabled = isStepValid) {
                    if (step < totalSteps) {
                        step++
                    } else {
                        // Assemble final UserProfile with saved userName
                        val profile = UserProfile(
                            name = userName.trim().ifBlank { if (gender == Gender.FEMALE) "Sarah" else "Alex" },
                            email = "athlete@fitpulse.ai",
                            age = age,
                            gender = gender,
                            heightCm = heightCm,
                            weightKg = weightKg,
                            targetWeightKg = targetWeightKg,
                            goal = goal,
                            experienceLevel = experience,
                            workoutDaysPerWeek = daysPerWeek,
                            workoutDurationMinutes = workoutDurationMinutes,
                            instructorGender = if (gender == Gender.FEMALE) InstructorGender.FEMALE else InstructorGender.MALE,
                            unitSystem = if (isWeightLb) UnitSystem.IMPERIAL else UnitSystem.METRIC
                        )
                        onFinishOnboarding(profile)
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (step == 1) "Continue" else if (step < totalSteps) "Continue →" else "Generate My Personalized Plan ⚡",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp
                ),
                color = if (isStepValid) Color.Black else Color(0xFF71717A)
            )
        }
    }
}
