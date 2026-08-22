package com.fitpulse.app.feature.yoga

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.UserProfile
import com.fitpulse.app.core.domain.model.YogaPose
import com.fitpulse.app.core.domain.model.YogaSession
import kotlinx.coroutines.delay

@Composable
fun YogaScreen(
    userProfile: UserProfile? = null,
    onBack: () -> Unit = {}
) {
    var selectedCategory by remember { mutableStateOf("All") }
    var activeSession by remember { mutableStateOf<YogaSession?>(null) }
    var isPlaying by remember { mutableStateOf(false) }
    var currentPoseIndex by remember { mutableIntStateOf(0) }
    var secondsRemaining by remember { mutableIntStateOf(30) }
    var sessionCompleted by remember { mutableStateOf(false) }

    val categories = listOf("All", "Morning Yoga", "Beginner Yoga", "Evening Yoga", "Full Body Stretch", "Flexibility", "Mobility", "Recovery", "Relaxation")

    val sampleSessions = listOf(
        YogaSession(
            id = "1",
            title = "10-Minute Morning Yoga",
            category = "Morning Yoga",
            durationMinutes = 10,
            level = "All Levels",
            posesCount = 5,
            caloriesBurned = 55,
            description = "Energize your body, open tight shoulders, and awaken your spine with gentle flow.",
            poses = listOf(
                YogaPose(name = "Mountain Pose (Tadasana)", durationSeconds = 30, targetArea = "Posture & Grounding", benefits = "Improves posture, body awareness, and grounding."),
                YogaPose(name = "Cat-Cow Flow (Marjaryasana)", durationSeconds = 45, targetArea = "Spine Mobility", benefits = "Warms up spine, relieves lower back tension."),
                YogaPose(name = "Downward Dog (Adho Mukha)", durationSeconds = 45, targetArea = "Hamstrings & Shoulders", benefits = "Lengthens posterior chain, strengthens shoulders."),
                YogaPose(name = "Child's Pose (Balasana)", durationSeconds = 30, targetArea = "Hips & Lower Back", benefits = "Deep restorative relaxation for hips and spine."),
                YogaPose(name = "Full Body Stretch", durationSeconds = 60, targetArea = "Full Body Integration", benefits = "Full body alignment and mental clarity.")
            )
        ),
        YogaSession(
            id = "2",
            title = "Evening Deep Stretch & De-Stress",
            category = "Evening Yoga",
            durationMinutes = 15,
            level = "Beginner",
            posesCount = 6,
            caloriesBurned = 70,
            description = "Slow parasympathetic breathing and deep hip decompression to prepare for restful sleep.",
            poses = listOf(
                YogaPose(name = "Seated Forward Bend", durationSeconds = 45, targetArea = "Hamstrings & Spine"),
                YogaPose(name = "Reclined Butterfly", durationSeconds = 60, targetArea = "Hips & Pelvis"),
                YogaPose(name = "Supine Spinal Twist", durationSeconds = 45, targetArea = "Spine Rotation"),
                YogaPose(name = "Legs Up The Wall", durationSeconds = 60, targetArea = "Circulation & Nervous System")
            )
        ),
        YogaSession(
            id = "3",
            title = "Full Body Joint Mobility & Flow",
            category = "Mobility",
            durationMinutes = 12,
            level = "Intermediate",
            posesCount = 5,
            caloriesBurned = 65,
            description = "Unlock shoulder, thoracic, and hip mobility with active kinetic movement."
        ),
        YogaSession(
            id = "4",
            title = "Post-Workout Athletic Recovery",
            category = "Recovery",
            durationMinutes = 8,
            level = "All Levels",
            posesCount = 4,
            caloriesBurned = 45,
            description = "Accelerates lactic acid clearance and reduces post-workout muscle soreness."
        )
    )

    // Active Pose Countdown Timer
    LaunchedEffect(isPlaying, secondsRemaining, activeSession) {
        if (isPlaying && activeSession != null && !sessionCompleted) {
            while (isPlaying && secondsRemaining > 0) {
                delay(1000)
                secondsRemaining--
            }
            if (secondsRemaining == 0) {
                val poses = activeSession!!.poses
                if (currentPoseIndex < poses.size - 1) {
                    currentPoseIndex++
                    secondsRemaining = poses[currentPoseIndex].durationSeconds
                } else {
                    isPlaying = false
                    sessionCompleted = true
                }
            }
        }
    }

    if (activeSession != null) {
        // ==========================================
        // ACTIVE YOGA SESSION PLAYER
        // ==========================================
        val currentSession = activeSession!!
        val poses = currentSession.poses.ifEmpty {
            listOf(
                YogaPose(name = "Gentle Breath & Centering", durationSeconds = 30),
                YogaPose(name = "Cat-Cow Stretch", durationSeconds = 45),
                YogaPose(name = "Downward Dog", durationSeconds = 45),
                YogaPose(name = "Child's Pose", durationSeconds = 30)
            )
        }
        val currentPose = poses[currentPoseIndex.coerceIn(0, poses.size - 1)]

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(BlackBackground)
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        activeSession = null
                        isPlaying = false
                        sessionCompleted = false
                    }
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = TextPrimaryDark)
                }

                Text(
                    text = currentSession.title,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimaryDark
                )

                Text(
                    text = "${currentPoseIndex + 1}/${poses.size}",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                    color = PurpleAccent
                )
            }

            if (sessionCompleted) {
                // Completed View
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🧘 🎉", fontSize = 54.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Yoga Session Complete!",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Great job restoring your flexibility and mental calm.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondaryDark,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(PurpleBrandGradient)
                            .clickable {
                                activeSession = null
                                sessionCompleted = false
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Done", fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                    }
                }
            } else {
                // Pose Display & Visual Animation Area
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(180.dp)
                            .clip(CircleShape)
                            .background(DarkSurfaceVariant)
                            .border(2.dp, PurpleAccent.copy(alpha = 0.6f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("🧘", fontSize = 48.sp)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = String.format("%02d:%02d", secondsRemaining / 60, secondsRemaining % 60),
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    fontSize = 32.sp
                                ),
                                color = PurpleAccent
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = currentPose.name,
                        style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark,
                        textAlign = TextAlign.Center
                    )

                    Text(
                        text = currentPose.targetArea,
                        style = MaterialTheme.typography.bodySmall.copy(color = PurpleAccent, fontWeight = FontWeight.Bold)
                    )

                    if (currentPose.benefits.isNotBlank()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = currentPose.benefits,
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
                            color = TextSecondaryDark,
                            textAlign = TextAlign.Center
                        )
                    }
                }

                // Player Controls (Prev, Play/Pause, Next)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = {
                            if (currentPoseIndex > 0) {
                                currentPoseIndex--
                                secondsRemaining = poses[currentPoseIndex].durationSeconds
                            }
                        }
                    ) {
                        Icon(Icons.Default.SkipPrevious, contentDescription = "Prev", tint = TextPrimaryDark, modifier = Modifier.size(32.dp))
                    }

                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(PurpleBrandGradient)
                            .clickable { isPlaying = !isPlaying },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = TextPrimaryDark,
                            modifier = Modifier.size(32.dp)
                        )
                    }

                    IconButton(
                        onClick = {
                            if (currentPoseIndex < poses.size - 1) {
                                currentPoseIndex++
                                secondsRemaining = poses[currentPoseIndex].durationSeconds
                            } else {
                                isPlaying = false
                                sessionCompleted = true
                            }
                        }
                    ) {
                        Icon(Icons.Default.SkipNext, contentDescription = "Next", tint = TextPrimaryDark, modifier = Modifier.size(32.dp))
                    }
                }
            }
        }
    } else {
        // ==========================================
        // YOGA CATALOG & BROWSE SCREEN
        // ==========================================
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(BlackBackground)
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(16.dp))

                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Yoga & Flexibility",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black, fontSize = 24.sp),
                            color = TextPrimaryDark
                        )
                        Text(
                            text = "Guided flows for both men & women",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(DarkSurfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🧘", fontSize = 18.sp)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Category Filter Pills
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(categories) { cat ->
                        val isSelected = selectedCategory == cat
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (isSelected) PurplePrimary else DarkSurface)
                                .border(1.dp, if (isSelected) PurpleAccent else DarkBorderSubtle, RoundedCornerShape(20.dp))
                                .clickable { selectedCategory = cat }
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = cat,
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                color = if (isSelected) TextPrimaryDark else TextSecondaryDark
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Hero Featured Routine: 10-Min Morning Yoga
                val featured = sampleSessions.first()
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFF231842), Color(0xFF130E26))
                            )
                        )
                        .border(1.dp, PurplePrimary.copy(alpha = 0.5f), RoundedCornerShape(22.dp))
                        .padding(18.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(PurplePrimary.copy(alpha = 0.3f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("FEATURED MORNING FLOW", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = PurpleAccent)
                            }
                            Text("⏱ ${featured.durationMinutes} min", fontSize = 12.sp, color = TextSecondaryDark)
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = featured.title,
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black, fontSize = 20.sp),
                            color = TextPrimaryDark
                        )

                        Text(
                            text = featured.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Poses Sequence Preview
                        Text("Pose Sequence:", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = PurpleAccent)
                        Spacer(modifier = Modifier.height(4.dp))
                        featured.poses.forEachIndexed { i, p ->
                            Text("${i + 1}. ${p.name} — ${p.durationSeconds}s", fontSize = 11.sp, color = TextSecondaryDark)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(46.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(PurpleBrandGradient)
                                .clickable {
                                    activeSession = featured
                                    currentPoseIndex = 0
                                    secondsRemaining = featured.poses.firstOrNull()?.durationSeconds ?: 30
                                    isPlaying = true
                                    sessionCompleted = false
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("🧘", fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Start Yoga Session", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, fontSize = 14.sp), color = TextPrimaryDark)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "All Yoga & Stretching Programs",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 17.sp),
                    color = TextPrimaryDark
                )

                Spacer(modifier = Modifier.height(12.dp))
            }

            // Session List Items
            items(sampleSessions.drop(1)) { session ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorderSubtle, RoundedCornerShape(18.dp))
                        .clickable {
                            activeSession = session
                            currentPoseIndex = 0
                            secondsRemaining = session.poses.firstOrNull()?.durationSeconds ?: 30
                            isPlaying = true
                            sessionCompleted = false
                        }
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = session.title,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 15.sp),
                                color = TextPrimaryDark
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${session.durationMinutes} min • ${session.category} • ${session.level}",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
                                color = TextSecondaryDark
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(PurplePrimary.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null, tint = PurpleAccent, modifier = Modifier.size(18.dp))
                        }
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))
            }
        }
    }
}
