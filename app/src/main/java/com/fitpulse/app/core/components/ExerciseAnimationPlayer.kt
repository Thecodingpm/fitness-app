package com.fitpulse.app.core.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.compose.AsyncImagePainter
import coil.request.CachePolicy
import coil.request.ImageRequest
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.Exercise

/**
 * High-performance 3D Animated Exercise Player powered by Coil GIF engine.
 */
@Composable
fun ExerciseAnimationPlayer(
    exercise: Exercise,
    modifier: Modifier = Modifier,
    height: Dp = 240.dp,
    showBadges: Boolean = true,
    showFormCueBadge: Boolean = true,
    onExpandClick: (() -> Unit)? = null
) {
    val context = LocalContext.current
    var isImageLoading by remember { mutableStateOf(true) }
    var isImageError by remember { mutableStateOf(false) }

    val animationUrl = exercise.animationGifUrl ?: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/gifs/0025.gif"

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(RoundedCornerShape(22.dp))
            .background(DarkSurfaceVariant)
            .border(1.dp, DarkBorderSubtle, RoundedCornerShape(22.dp)),
        contentAlignment = Alignment.Center
    ) {
        // 1. Live Animated 3D Demonstration Image / GIF
        AsyncImage(
            model = ImageRequest.Builder(context)
                .data(animationUrl)
                .crossfade(true)
                .memoryCachePolicy(CachePolicy.ENABLED)
                .diskCachePolicy(CachePolicy.ENABLED)
                .build(),
            contentDescription = exercise.name,
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            onState = { state ->
                isImageLoading = state is AsyncImagePainter.State.Loading
                isImageError = state is AsyncImagePainter.State.Error
            }
        )

        // 2. Loading State / Shimmer
        AnimatedVisibility(
            visible = isImageLoading,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(DarkSurface),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(
                        color = PurplePrimary,
                        modifier = Modifier.size(32.dp),
                        strokeWidth = 3.dp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Loading 3D Animation...",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondaryDark
                    )
                }
            }
        }

        // 3. Fallback if offline and uncached
        if (isImageError) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(DarkSurfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(16.dp)
                ) {
                    FitPulseLogoIcon(size = 54.dp, animated = false, showGlow = false)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = exercise.name,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimaryDark
                    )
                    Text(
                        text = "${exercise.primaryMuscle.displayName} • ${exercise.equipment.displayName}",
                        style = MaterialTheme.typography.bodySmall,
                        color = PurpleAccent
                    )
                }
            }
        }

        // 4. Subtle Bottom Gradient & Muscle Badges
        if (showBadges) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Transparent,
                                Color.Transparent,
                                DarkSurface.copy(alpha = 0.85f)
                            )
                        )
                    )
            )

            // Top-Left Muscle & Equipment Badges
            Row(
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(PurplePrimary.copy(alpha = 0.9f))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = exercise.primaryMuscle.displayName.uppercase(),
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black, fontSize = 10.sp),
                        color = Color.White
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurfaceElevated.copy(alpha = 0.9f))
                        .border(1.dp, DarkBorderSubtle, RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = exercise.equipment.displayName,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp),
                        color = PurpleAccent
                    )
                }
            }

            // Top-Right Live 3D Indicator Badge
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(DarkSurface.copy(alpha = 0.85f))
                    .border(1.dp, PurplePrimary.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(EmeraldSuccess)
                    )
                    Text(
                        text = "3D LOOP",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black, fontSize = 9.sp),
                        color = TextPrimaryDark
                    )
                }
            }

            // Bottom Form Tip Callout
            if (showFormCueBadge && exercise.formCues.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = EmeraldSuccess,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = exercise.formCues.first(),
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 11.5.sp
                        ),
                        color = TextPrimaryDark
                    )
                }
            }
        }
    }
}
