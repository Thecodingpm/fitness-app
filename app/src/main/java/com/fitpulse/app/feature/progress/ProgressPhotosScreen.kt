package com.fitpulse.app.feature.progress

import androidx.compose.foundation.background
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.FitnessCard
import com.fitpulse.app.core.components.PrimaryButton
import com.fitpulse.app.core.designsystem.*

@Composable
fun ProgressPhotosScreen(
    onBack: () -> Unit
) {
    var sliderPosition by remember { mutableFloatStateOf(0.5f) }

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
                text = "Progress Photos",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Privacy Guarantee Badge
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(DarkSurfaceVariant)
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Lock, contentDescription = null, tint = Emerald400, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "100% Private & Locally Encrypted on Device",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Timeline Comparison",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Before & After Interactive Comparison Viewport
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(DarkSurfaceVariant)
        ) {
            Row(modifier = Modifier.fillMaxSize()) {
                // Before side
                Box(
                    modifier = Modifier
                        .weight(sliderPosition.coerceIn(0.1f, 0.9f))
                        .fillMaxHeight()
                        .background(Color(0xFF1E293B)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Day 1", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextSecondaryDark)
                        Text("81.2 kg • 16.5% BF", style = MaterialTheme.typography.bodySmall, color = TextTertiaryDark)
                    }
                }

                // After side
                Box(
                    modifier = Modifier
                        .weight((1f - sliderPosition).coerceIn(0.1f, 0.9f))
                        .fillMaxHeight()
                        .background(Color(0xFF0F172A)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Current (Day 28)", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = Emerald400)
                        Text("78.5 kg • 14.2% BF", style = MaterialTheme.typography.bodySmall, color = TextPrimaryDark)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        Text("Slide to compare body transformation", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
        Slider(
            value = sliderPosition,
            onValueChange = { sliderPosition = it },
            colors = SliderDefaults.colors(thumbColor = Emerald400, activeTrackColor = Emerald400)
        )

        Spacer(modifier = Modifier.height(24.dp))

        PrimaryButton(
            text = "Add New Progress Photo",
            onClick = { /* Launch camera intent */ },
            icon = Icons.Default.AddAPhoto
        )

        Spacer(modifier = Modifier.height(30.dp))
    }
}
