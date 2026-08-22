package com.fitpulse.app.feature.profile

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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.*
import com.fitpulse.app.core.data.billing.SubscriptionPlan
import com.fitpulse.app.core.designsystem.*

@Composable
fun SubscriptionPaywallScreen(
    onSubscribed: () -> Unit,
    onClose: () -> Unit
) {
    var selectedPlan by remember { mutableStateOf(SubscriptionPlan.ANNUAL) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondaryDark)
            }
        }

        // Header Logo
        FitPulseLogoIcon(
            size = 72.dp,
            animated = true,
            showGlow = true
        )

        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = "Unlock FitPulse Pro",
            style = MaterialTheme.typography.displaySmall.copy(fontWeight = FontWeight.Black),
            color = TextPrimaryDark
        )

        Text(
            text = "Your Full AI Coaching & Biomechanical Suite",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondaryDark
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Feature list
        val features = listOf(
            "Adaptive Progressive Overload Engine (+2.5kg Auto-Weight Suggestions)",
            "Unlimited FitPulse AI Coach Chat with Live Workout Adaptation",
            "AI Vision Food Photo Scanner & Macro Breakdown",
            "Advanced 1RM Strength Progression & Volume Analytics",
            "Unlimited Custom Splits & Exercise Library"
        )

        FitnessCard {
            features.forEach { feat ->
                Row(
                    modifier = Modifier.padding(vertical = 5.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Amber400, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(feat, style = MaterialTheme.typography.bodySmall, color = TextPrimaryDark)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Annual Plan Card
        val isAnnual = selectedPlan == SubscriptionPlan.ANNUAL
        FitnessCard(
            onClick = { selectedPlan = SubscriptionPlan.ANNUAL },
            backgroundColor = if (isAnnual) DarkSurfaceElevated else DarkSurface,
            borderColor = if (isAnnual) Amber400 else DarkBorder,
            borderWidth = if (isAnnual) 2.dp else 1.dp
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Annual Plan", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(Amber500)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text("SAVE 42%", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = DarkBackground)
                        }
                    }
                    Text("7-Day Free Trial, then $69.99/year ($5.83/mo)", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark)
                }
                RadioButton(
                    selected = isAnnual,
                    onClick = { selectedPlan = SubscriptionPlan.ANNUAL },
                    colors = RadioButtonDefaults.colors(selectedColor = Amber400)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Monthly Plan Card
        val isMonthly = selectedPlan == SubscriptionPlan.MONTHLY
        FitnessCard(
            onClick = { selectedPlan = SubscriptionPlan.MONTHLY },
            backgroundColor = if (isMonthly) DarkSurfaceElevated else DarkSurface,
            borderColor = if (isMonthly) Amber400 else DarkBorder,
            borderWidth = if (isMonthly) 2.dp else 1.dp
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Monthly Plan", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
                    Text("$9.99 / month • Cancel anytime", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark)
                }
                RadioButton(
                    selected = isMonthly,
                    onClick = { selectedPlan = SubscriptionPlan.MONTHLY },
                    colors = RadioButtonDefaults.colors(selectedColor = Amber400)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        PrimaryButton(
            text = if (isAnnual) "Start 7-Day Free Trial" else "Subscribe Now ($9.99/mo)",
            onClick = {
                onSubscribed()
                onClose()
            },
            gradient = Brush.horizontalGradient(listOf(Amber500, Rose500))
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "Restore Purchases",
            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
            color = TextSecondaryDark,
            modifier = Modifier
                .clickable {
                    onSubscribed()
                    onClose()
                }
                .padding(8.dp)
        )

        Spacer(modifier = Modifier.height(30.dp))
    }
}
