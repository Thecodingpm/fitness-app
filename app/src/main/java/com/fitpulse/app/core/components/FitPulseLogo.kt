package com.fitpulse.app.core.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*

/**
 * Clean, modern FitPulse vector logo mark rendered directly on Compose Canvas.
 */
@Composable
fun FitPulseLogoIcon(
    modifier: Modifier = Modifier,
    size: Dp = 64.dp,
    animated: Boolean = false,
    showGlow: Boolean = true
) {
    val scale = if (animated) {
        val infiniteTransition = rememberInfiniteTransition(label = "pulseScale")
        val animatedScale by infiniteTransition.animateFloat(
            initialValue = 0.94f,
            targetValue = 1.06f,
            animationSpec = infiniteRepeatable(
                animation = tween(1100, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "scale"
        )
        animatedScale
    } else 1f

    Box(
        modifier = modifier
            .size(size)
            .scale(scale),
        contentAlignment = Alignment.Center
    ) {
        // Ambient Radial Glow
        if (showGlow) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                PurplePrimary.copy(alpha = 0.45f),
                                PurpleDark.copy(alpha = 0.15f),
                                Color.Transparent
                            )
                        )
                    )
            )
        }

        // Emblem Container
        Box(
            modifier = Modifier
                .size(size * 0.82f)
                .clip(CircleShape)
                .background(
                    Brush.linearGradient(
                        listOf(DarkSurfaceElevated, DarkSurface)
                    )
                )
                .border(
                    width = 1.5.dp,
                    brush = Brush.linearGradient(
                        listOf(PurpleLight.copy(alpha = 0.8f), PurpleDark.copy(alpha = 0.4f))
                    ),
                    shape = CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            // Clean Vector Canvas
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(size * 0.18f)
            ) {
                val w = this.size.width
                val h = this.size.height

                // Draw Smooth Pulse Wave
                val path = Path().apply {
                    moveTo(0f, h * 0.52f)
                    lineTo(w * 0.22f, h * 0.52f)
                    lineTo(w * 0.36f, h * 0.72f)
                    lineTo(w * 0.50f, h * 0.16f)
                    lineTo(w * 0.65f, h * 0.88f)
                    lineTo(w * 0.76f, h * 0.36f)
                    lineTo(w * 0.84f, h * 0.52f)
                    lineTo(w, h * 0.52f)
                }

                // 1. Shadow / Glow Trace
                drawPath(
                    path = path,
                    color = PurplePrimary.copy(alpha = 0.4f),
                    style = Stroke(
                        width = (size.toPx() * 0.09f),
                        cap = StrokeCap.Round,
                        join = StrokeJoin.Round
                    )
                )

                // 2. Main Sharp Pulse Line
                drawPath(
                    path = path,
                    brush = Brush.horizontalGradient(
                        colors = listOf(PurpleLight, PurpleAccent, Color.White)
                    ),
                    style = Stroke(
                        width = (size.toPx() * 0.055f).coerceAtLeast(3f),
                        cap = StrokeCap.Round,
                        join = StrokeJoin.Round
                    )
                )

                // 3. Apex Energy Spark
                drawCircle(
                    color = Color.White,
                    radius = (size.toPx() * 0.035f).coerceAtLeast(2.5f),
                    center = Offset(w * 0.50f, h * 0.16f)
                )
            }
        }
    }
}

/**
 * Full FitPulse Brand Lockup (Logo + Modern Typography).
 */
@Composable
fun FitPulseLogoWithText(
    modifier: Modifier = Modifier,
    iconSize: Dp = 72.dp,
    animated: Boolean = true,
    tagline: String = "AI FITNESS FOR ALL"
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        FitPulseLogoIcon(
            size = iconSize,
            animated = animated,
            showGlow = true
        )

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = "FITPULSE",
            style = MaterialTheme.typography.headlineLarge.copy(
                fontWeight = FontWeight.Black,
                letterSpacing = 4.sp,
                fontSize = 28.sp
            ),
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = tagline,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                fontSize = 11.sp
            ),
            color = PurpleAccent
        )
    }
}

/**
 * Compact Header Logo Badge for App Bars.
 */
@Composable
fun FitPulseHeaderLogo(
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(DarkSurfaceVariant)
            .border(1.dp, DarkBorderSubtle, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        FitPulseLogoIcon(
            size = 24.dp,
            showGlow = false,
            animated = false
        )
        Text(
            text = "FITPULSE",
            style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.Black,
                letterSpacing = 1.5.sp,
                fontSize = 12.sp
            ),
            color = TextPrimaryDark
        )
    }
}
