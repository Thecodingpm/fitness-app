package com.fitpulse.app.feature.profile

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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.UnitSystem
import com.fitpulse.app.core.domain.model.UserProfile

@Composable
fun ProfileScreen(
    userProfile: UserProfile,
    onOpenGamification: () -> Unit = {},
    onOpenSubscriptionPaywall: () -> Unit = {},
    onLogout: () -> Unit
) {
    var isMetric by remember { mutableStateOf(userProfile.unitSystem == UnitSystem.METRIC) }
    var workoutReminders by remember { mutableStateOf(true) }
    var soundEnabled by remember { mutableStateOf(userProfile.soundAlertsEnabled) }
    var hapticsEnabled by remember { mutableStateOf(userProfile.hapticsEnabled) }

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
            text = "Profile & Settings",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                fontSize = 24.sp
            ),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Profile Identity Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color(0xFF22193E), Color(0xFF130E26))
                    )
                )
                .border(1.dp, PurplePrimary.copy(alpha = 0.5f), RoundedCornerShape(22.dp))
                .padding(18.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape)
                        .background(PurpleDark)
                        .border(2.dp, PurpleAccent, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = userProfile.name.take(1).uppercase(),
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(
                        text = userProfile.name,
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark
                    )
                    Text(
                        text = "${userProfile.gender.name.lowercase().capitalize()} • ${userProfile.goal.displayName}",
                        style = MaterialTheme.typography.bodySmall,
                        color = PurpleAccent
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${userProfile.rankTitle} • Level ${userProfile.level}",
                        fontSize = 11.sp,
                        color = TextSecondaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Stats Summary Strip
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkSurface)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Age", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                    Text("${userProfile.age}", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Height", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                    Text(if (isMetric) "${userProfile.heightCm.toInt()} cm" else "${(userProfile.heightCm/2.54/12).toInt()}' ${(userProfile.heightCm/2.54%12).toInt()}\"", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Weight", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                    Text(if (isMetric) "${userProfile.weightKg} kg" else "${(userProfile.weightKg*2.20462).toInt()} lb", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Target", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                    Text(if (isMetric) "${userProfile.targetWeightKg} kg" else "${(userProfile.targetWeightKg*2.20462).toInt()} lb", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black), color = PurpleAccent)
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "App Preferences",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Preference 1: Units (Metric / Imperial)
        PreferenceToggleRow(
            title = "Units of Measurement",
            subtitle = if (isMetric) "Metric (kg, cm)" else "Imperial (lb, ft)",
            isChecked = isMetric,
            onCheckedChange = { isMetric = it }
        )

        // Preference 2: Workout Reminders
        PreferenceToggleRow(
            title = "Daily Workout Reminders",
            subtitle = "${userProfile.reminderTime} • ${userProfile.reminderDays.joinToString()}",
            isChecked = workoutReminders,
            onCheckedChange = { workoutReminders = it }
        )

        // Preference 3: Sound Alerts & Timer Voice
        PreferenceToggleRow(
            title = "Timer Sound Alerts",
            subtitle = "Audio cues when countdown reaches zero",
            isChecked = soundEnabled,
            onCheckedChange = { soundEnabled = it }
        )

        // Preference 4: Haptic Vibration
        PreferenceToggleRow(
            title = "Haptic Vibration",
            subtitle = "Tactile feedback on exercise transitions",
            isChecked = hapticsEnabled,
            onCheckedChange = { hapticsEnabled = it }
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Account & Support",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Help & Support
        PreferenceActionRow(
            icon = Icons.Default.HelpOutline,
            title = "Help & Global Support",
            subtitle = "FAQ, exercise form guides, contact trainers",
            onClick = {}
        )

        // Privacy Policy
        PreferenceActionRow(
            icon = Icons.Default.Lock,
            title = "Privacy & Data Protection",
            subtitle = "GDPR compliant, local on-device encryption",
            onClick = {}
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Log Out Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(DarkSurfaceVariant)
                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
                .clickable { onLogout() },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Log Out",
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                color = Rose500
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun PreferenceToggleRow(
    title: String,
    subtitle: String,
    isChecked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(DarkSurface)
            .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, color = TextPrimaryDark, fontSize = 14.sp)
                Text(subtitle, fontSize = 11.5.sp, color = TextSecondaryDark)
            }
            Switch(
                checked = isChecked,
                onCheckedChange = onCheckedChange,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = TextPrimaryDark,
                    checkedTrackColor = PurplePrimary,
                    uncheckedThumbColor = TextSecondaryDark,
                    uncheckedTrackColor = DarkSurfaceVariant
                )
            )
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}

@Composable
private fun PreferenceActionRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(DarkSurface)
            .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                Icon(icon, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(title, fontWeight = FontWeight.Bold, color = TextPrimaryDark, fontSize = 14.sp)
                    Text(subtitle, fontSize = 11.5.sp, color = TextSecondaryDark)
                }
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = TextSecondaryDark)
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}
