package com.fitpulse.app.feature.steptracker

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.*
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.HourlyStepBucket
import com.fitpulse.app.core.domain.model.StepTrackerData

@Composable
fun StepTrackerScreen(
    stepData: StepTrackerData,
    onUpdateGoal: (Int) -> Unit,
    onSimulateSteps: (Int) -> Unit,
    onBack: () -> Unit
) {
    val progress = (stepData.currentSteps.toFloat() / stepData.targetSteps.toFloat()).coerceIn(0f, 1f)
    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(1200, easing = FastOutSlowInEasing),
        label = "StepRingProgress"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Top Navigation Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceVariant)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimaryDark
                )
            }

            Text(
                text = "Step Activity Hub",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = TextPrimaryDark
            )

            // Sensor Status Pill
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Emerald500.copy(alpha = 0.15f))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(Emerald400)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "LIVE",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Black,
                            fontSize = 10.sp
                        ),
                        color = Emerald400
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Hero Circular Progress Ring Card
        FitnessCard(
            backgroundColor = DarkSurface,
            borderColor = DarkBorder
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(220.dp)
                        .padding(12.dp)
                ) {
                    // Custom Glowing Step Ring Canvas
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val strokeWidth = 18.dp.toPx()
                        val diameter = size.minDimension - strokeWidth
                        val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)
                        val arcSize = Size(diameter, diameter)

                        // Background track
                        drawArc(
                            color = DarkBorder,
                            startAngle = -90f,
                            sweepAngle = 360f,
                            useCenter = false,
                            topLeft = topLeft,
                            size = arcSize,
                            style = Stroke(strokeWidth, cap = StrokeCap.Round)
                        )

                        // Active gradient arc
                        drawArc(
                            brush = Brush.sweepGradient(
                                listOf(Emerald400, Teal400, Amber400, Emerald400)
                            ),
                            startAngle = -90f,
                            sweepAngle = animatedProgress * 360f,
                            useCenter = false,
                            topLeft = topLeft,
                            size = arcSize,
                            style = Stroke(strokeWidth, cap = StrokeCap.Round)
                        )
                    }

                    // Inside Text
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.DirectionsWalk,
                            contentDescription = null,
                            tint = Emerald400,
                            modifier = Modifier.size(28.dp)
                        )
                        Text(
                            text = "%,d".format(stepData.currentSteps),
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 34.sp
                            ),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "/ %,d steps".format(stepData.targetSteps),
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${(animatedProgress * 100).toInt()}% Done",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold
                            ),
                            color = Emerald400
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Cadence indicator pill
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurfaceVariant)
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "⚡ Cadence: 108 steps/min • Normal Walking",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextSecondaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Metric Triad (Distance, Calories, Active Time)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            MetricCard(
                title = "Distance",
                value = "${stepData.distanceKm}",
                unit = "km",
                icon = Icons.Default.Straighten,
                accentColor = Teal400,
                modifier = Modifier.weight(1f)
            )

            MetricCard(
                title = "Active Burn",
                value = "${stepData.caloriesBurned}",
                unit = "kcal",
                icon = Icons.Default.LocalFireDepartment,
                accentColor = Amber400,
                modifier = Modifier.weight(1f)
            )

            MetricCard(
                title = "Active Time",
                value = "${stepData.activeMinutes}",
                unit = "mins",
                icon = Icons.Default.Timer,
                accentColor = Violet400,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 24-Hour Hourly Breakdown Chart
        FitnessCard(
            backgroundColor = DarkSurface,
            borderColor = DarkBorder
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TODAY'S STEP DISTRIBUTION",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    ),
                    color = TextSecondaryDark
                )

                Text(
                    text = "Peak: 5 PM",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = Emerald400
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            HourlyStepsBarCanvas(
                hourlyBuckets = stepData.hourlyBreakdown,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("6 AM", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp), color = TextTertiaryDark)
                Text("12 PM", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp), color = TextTertiaryDark)
                Text("6 PM", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp), color = TextTertiaryDark)
                Text("10 PM", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp), color = TextTertiaryDark)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // AI Walking Coach Insight
        AIInsightCard(
            insight = if (stepData.currentSteps >= stepData.targetSteps) {
                "Incredible dedication! You've crushed your daily step target of %,d steps (+100 XP awarded). This consistency sustains your metabolic burn.".format(stepData.targetSteps)
            } else {
                val remaining = stepData.targetSteps - stepData.currentSteps
                "You're only %,d steps away from your daily goal. A quick 15-min evening walk will close your ring, burn ~110 kcal, and keep your 14-day streak alive!".format(remaining)
            },
            onActionClick = { onSimulateSteps(1000) }
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Daily Step Target Goal Quick Selectors
        Text(
            text = "Daily Step Target",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Bold
            ),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf(6000, 8000, 10000, 12000).forEach { goal ->
                val isSelected = stepData.targetSteps == goal
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) Emerald500 else DarkSurfaceVariant)
                        .clickable { onUpdateGoal(goal) }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${goal / 1000}k",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Bold
                        ),
                        color = if (isSelected) DarkBackground else TextSecondaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick Simulation Action Buttons (For Testing / Walking Simulation)
        Text(
            text = "Simulate Walk Activity",
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            ),
            color = TextSecondaryDark
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            SecondaryButton(
                text = "+500 Steps (5m Walk)",
                onClick = { onSimulateSteps(500) },
                icon = Icons.Default.DirectionsWalk,
                modifier = Modifier.weight(1f)
            )

            SecondaryButton(
                text = "+1,000 Steps (10m Walk)",
                onClick = { onSimulateSteps(1000) },
                icon = Icons.Default.DirectionsRun,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
private fun HourlyStepsBarCanvas(
    hourlyBuckets: List<HourlyStepBucket>,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier) {
        val maxSteps = (hourlyBuckets.maxOfOrNull { it.steps } ?: 2000).toFloat().coerceAtLeast(500f)
        val barCount = 24
        val barSpacing = size.width / barCount
        val barWidth = (barSpacing * 0.6f).coerceAtLeast(3f)

        // Draw baseline
        drawLine(
            color = DarkBorder,
            start = Offset(0f, size.height),
            end = Offset(size.width, size.height),
            strokeWidth = 1.dp.toPx()
        )

        // Draw each hour's bar
        for (hour in 0 until 24) {
            val stepBucket = hourlyBuckets.find { it.hour == hour }
            val steps = stepBucket?.steps ?: 0
            val barHeight = if (steps > 0) (steps / maxSteps) * (size.height - 10.dp.toPx()) else 4.dp.toPx()
            val left = hour * barSpacing + (barSpacing - barWidth) / 2
            val top = size.height - barHeight

            val isPeak = steps >= 1500
            val barBrush = when {
                isPeak -> Brush.verticalGradient(listOf(Amber400, Emerald400))
                steps > 0 -> Brush.verticalGradient(listOf(Emerald400, Teal400))
                else -> Brush.verticalGradient(listOf(DarkBorder, DarkBorder))
            }

            drawRoundRect(
                brush = barBrush,
                topLeft = Offset(left, top),
                size = Size(barWidth, barHeight),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(4.dp.toPx(), 4.dp.toPx())
            )
        }
    }
}
