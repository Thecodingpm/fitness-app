package com.fitpulse.app.feature.workout

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.WorkoutSession

@Composable
fun WorkoutCompleteScreen(
    session: WorkoutSession,
    onDone: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Spacer(modifier = Modifier.height(28.dp))

            // Trophy / Celebration Icon
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(PurplePrimary, PurpleDark)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🎉", fontSize = 48.sp)
            }

            Spacer(modifier = Modifier.height(18.dp))

            Text(
                text = "Workout Complete 🎉",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.Black,
                    fontSize = 28.sp
                ),
                color = TextPrimaryDark,
                textAlign = TextAlign.Center
            )

            Text(
                text = "Excellent consistency and progressive output!",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondaryDark,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Summary Stats Grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(DarkSurface)
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("⏱ TIME", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                        Text("25 min", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = TextPrimaryDark)
                    }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(DarkSurface)
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🔥 BURN", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                        Text("${session.caloriesBurned} kcal", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = PurpleAccent)
                    }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(DarkSurface)
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("⚡ XP", style = MaterialTheme.typography.labelSmall, color = TextTertiaryDark)
                        Text("+${session.earnedXp}", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black), color = PurpleAccent)
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Coach Summary
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkSurfaceVariant)
                    .padding(16.dp)
            ) {
                Column {
                    Text("✨ AI Training Coach Note", fontWeight = FontWeight.Bold, color = PurpleAccent, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(session.aiSummary, fontSize = 12.sp, color = TextSecondaryDark, lineHeight = 17.sp)
                }
            }
        }

        // Return Home CTA
        Button(
            onClick = onDone,
            colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Text("Back to Dashboard", fontWeight = FontWeight.Black, color = TextPrimaryDark, fontSize = 16.sp)
        }
    }
}
