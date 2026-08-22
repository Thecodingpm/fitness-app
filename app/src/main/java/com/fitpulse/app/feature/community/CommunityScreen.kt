package com.fitpulse.app.feature.community

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
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
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*
import kotlinx.coroutines.delay

enum class CommunityTab(val title: String, val icon: String) {
    RACES("🏁 Live Races", "🏁"),
    CHALLENGES("🏆 Challenges", "🏆"),
    FEED("👥 Friend Feed", "👥"),
    LEADERBOARD("🥇 Leaderboard", "🥇")
}

@Composable
fun CommunityScreen(
    userProfile: UserProfile? = null,
    onOpenChallengeDetail: (CommunityChallenge) -> Unit = {},
    onChallengeComplete: (CommunityChallenge) -> Unit = {}
) {
    var selectedTab by remember { mutableStateOf(CommunityTab.RACES) }
    var showChallengeFriendDialog by remember { mutableStateOf(false) }
    var showCreateChallengeDialog by remember { mutableStateOf(false) }
    var showMatchmakingDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showCompletionCelebration by remember { mutableStateOf(false) }

    var userPoints by remember { mutableIntStateOf(395) }
    var successToastMessage by remember { mutableStateOf<String?>(null) }

    // Sample Racers for Live 7-Day Fitness Race
    val racers = remember {
        mutableStateListOf(
            RaceRacer(name = "Alex Vance", avatar = "🏃‍♂️", points = 420, progressPercentage = 0.85f, rank = 1, recentActivity = "Logged 45m Strength"),
            RaceRacer(name = "${userProfile?.name ?: "Sarah"} (You)", avatar = "🏃‍♀️", points = userPoints, progressPercentage = 0.78f, rank = 2, recentActivity = "Completed 25m HIIT", isCurrentUser = true),
            RaceRacer(name = "Emma Watson", avatar = "🧘‍♀️", points = 370, progressPercentage = 0.72f, rank = 3, recentActivity = "Finished 20m Yoga"),
            RaceRacer(name = "John Doe", avatar = "🚴‍♂️", points = 340, progressPercentage = 0.65f, rank = 4, recentActivity = "Walked 8,500 steps")
        )
    }

    // Sample Community Challenges
    val sampleChallenges = remember {
        mutableStateListOf(
            CommunityChallenge(
                id = "global_1",
                title = "Global 1 Million Step Challenge",
                description = "Join 124,000+ walkers worldwide to reach 1,000,000 collective steps.",
                category = ChallengeCategory.GLOBAL,
                durationDays = 14,
                daysRemaining = 6,
                currentParticipants = 124892,
                totalGoal = 1000000L,
                currentProgress = 782430L,
                unit = "Steps",
                countriesCount = 87,
                rewardBadge = "🌎 Global Challenger",
                rewardXp = 600,
                isJoined = true
            ),
            CommunityChallenge(
                id = "healthy_prog_1",
                title = "30-Day Healthy Progress Challenge",
                description = "Ranked on daily consistency, workout minutes, and healthy habits. No starvation or extreme dieting.",
                category = ChallengeCategory.WEIGHT_PROGRESS,
                durationDays = 30,
                daysRemaining = 18,
                currentParticipants = 45210,
                totalGoal = 30L,
                currentProgress = 12L,
                unit = "Days",
                countriesCount = 64,
                rewardBadge = "🏆 Progress Champion",
                rewardXp = 800,
                isJoined = true
            ),
            CommunityChallenge(
                id = "strength_1",
                title = "30-Day Strength & PR Challenge",
                description = "Build raw functional strength. Points awarded for personal records, squat/bench overload, and consistency.",
                category = ChallengeCategory.STRENGTH,
                durationDays = 30,
                daysRemaining = 21,
                currentParticipants = 32800,
                totalGoal = 20L,
                currentProgress = 9L,
                unit = "Strength Sessions",
                countriesCount = 52,
                rewardBadge = "💪 Strength Master",
                rewardXp = 750,
                isJoined = false
            ),
            CommunityChallenge(
                id = "yoga_flex_1",
                title = "Global 14-Day Yoga & Mobility Flow",
                description = "Enhance spinal flexibility and full body mobility with guided daily 10-minute routines.",
                category = ChallengeCategory.YOGA,
                durationDays = 14,
                daysRemaining = 9,
                currentParticipants = 28140,
                totalGoal = 14L,
                currentProgress = 5L,
                unit = "Yoga Flows",
                countriesCount = 49,
                rewardBadge = "🧘 Zen Master",
                rewardXp = 500,
                isJoined = false
            ),
            CommunityChallenge(
                id = "race_friend_1",
                title = "7-Day Workout Friend Race",
                description = "Who can complete the most workouts and stay consistent in 7 days?",
                category = ChallengeCategory.WORKOUT,
                durationDays = 7,
                daysRemaining = 3,
                currentParticipants = 4,
                totalGoal = 7L,
                currentProgress = 4L,
                unit = "Workouts",
                countriesCount = 1,
                rewardBadge = "🏅 7-Day Warrior",
                rewardXp = 400,
                isJoined = true
            )
        )
    }

    // Friend Feed items
    val friendFeed = remember {
        mutableStateListOf(
            FriendActivityFeedItem(userName = "Sarah Jenkins", avatar = "♀", activityText = "completed a 25-minute Full Body HIIT workout! 🔥", timestamp = "5m ago", likesCount = 18, fireCount = 12, clapsCount = 9, strongCount = 14),
            FriendActivityFeedItem(userName = "Alex Rivera", avatar = "♂", activityText = "hit a new Personal Record: Squat 130 kg (+5kg)! 🏆", timestamp = "22m ago", likesCount = 34, fireCount = 28, clapsCount = 15, strongCount = 42),
            FriendActivityFeedItem(userName = "Emma Watson", avatar = "♀", activityText = "completed Day 12 of the 30-Day Healthy Progress Challenge! 🥗", timestamp = "1h ago", likesCount = 15, fireCount = 10, clapsCount = 20, strongCount = 8),
            FriendActivityFeedItem(userName = "David Chen", avatar = "♂", activityText = "finished 15-minute Morning Yoga & Spine Mobility! 🧘", timestamp = "3h ago", likesCount = 11, fireCount = 5, clapsCount = 14, strongCount = 6)
        )
    }

    // Toast Dismiss Timer
    LaunchedEffect(successToastMessage) {
        if (successToastMessage != null) {
            delay(3000)
            successToastMessage = null
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // 1. Top Header: Community Brand & Quick Status
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Community & Races",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 24.sp
                    ),
                    color = TextPrimaryDark
                )
                Text(
                    text = "Compete, inspire, and grow together globally",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondaryDark
                )
            }

            // Privacy & Settings Button
            IconButton(
                onClick = { showPrivacyDialog = true },
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceVariant)
            ) {
                Icon(Icons.Default.Security, contentDescription = "Privacy", tint = PurpleAccent, modifier = Modifier.size(20.dp))
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Toast Feedback Message
        if (successToastMessage != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(PurplePrimary)
                    .padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = successToastMessage!!,
                    fontWeight = FontWeight.Black,
                    color = TextPrimaryDark,
                    fontSize = 13.sp
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // 2. Action Hub: [ Challenge a Friend ] & [ + Create Challenge ]
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(PurpleBrandGradient)
                    .clickable { showChallengeFriendDialog = true },
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("⚡", fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Challenge Friend",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Black),
                        color = TextPrimaryDark
                    )
                }
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
                    .clickable { showCreateChallengeDialog = true },
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("+", fontWeight = FontWeight.Black, fontSize = 18.sp, color = PurpleAccent)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Create Challenge",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Smart Matchmaking Strip
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(DarkSurfaceVariant)
                .clickable { showMatchmakingDialog = true }
                .padding(horizontal = 14.dp, vertical = 8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("🤝", fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Find a Fitness Match", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = PurpleAccent)
                }
                Text("Match Now →", fontSize = 11.sp, color = TextSecondaryDark, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 3. Sub-Navigation Tabs Strip
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            CommunityTab.values().forEach { tab ->
                val isSelected = selectedTab == tab
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .background(if (isSelected) PurplePrimary else DarkSurface)
                        .border(1.dp, if (isSelected) PurpleAccent else DarkBorderSubtle, RoundedCornerShape(18.dp))
                        .clickable { selectedTab = tab }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = tab.title,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        color = if (isSelected) TextPrimaryDark else TextSecondaryDark
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // =========================================================================
        // CONTENT SECTIONS
        // =========================================================================
        when (selectedTab) {
            // =====================================================================
            // 1. LIVE FITNESS RACE TRACK
            // =====================================================================
            CommunityTab.RACES -> {
                // Live Race Banner
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFF261A45), Color(0xFF130E26))
                            )
                        )
                        .border(1.dp, PurpleAccent.copy(alpha = 0.5f), RoundedCornerShape(22.dp))
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
                                Text("🏁 7-DAY FITNESS RACE", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = PurpleAccent)
                            }
                            Text("⏱ 3 Days Left", fontSize = 11.sp, color = AmberOrange, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "Friend Workout & Consistency Sprint",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black, fontSize = 18.sp),
                            color = TextPrimaryDark
                        )

                        Text(
                            text = "Score points by logging workouts, hitting step targets, and staying consistent.",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )

                        Spacer(modifier = Modifier.height(18.dp))

                        // Game-like Visual Multi-Lane Race Track
                        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                            racers.forEach { racer ->
                                Column {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text(
                                                text = "${racer.rank}.",
                                                fontWeight = FontWeight.Black,
                                                fontSize = 14.sp,
                                                color = if (racer.rank == 1) AmberOrange else if (racer.isCurrentUser) PurpleAccent else TextSecondaryDark
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(
                                                text = racer.name,
                                                fontWeight = if (racer.isCurrentUser) FontWeight.Black else FontWeight.Bold,
                                                fontSize = 13.sp,
                                                color = if (racer.isCurrentUser) PurpleAccent else TextPrimaryDark
                                            )
                                        }

                                        Text(
                                            text = "${racer.points} pts",
                                            fontWeight = FontWeight.Black,
                                            fontSize = 13.sp,
                                            color = TextPrimaryDark
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    // Dynamic Track Lane with Avatar Marker
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(26.dp)
                                            .clip(RoundedCornerShape(13.dp))
                                            .background(DarkSurfaceVariant)
                                            .padding(horizontal = 4.dp),
                                        contentAlignment = Alignment.CenterStart
                                    ) {
                                        // Progress fill bar
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(racer.progressPercentage)
                                                .fillMaxHeight(0.7f)
                                                .clip(RoundedCornerShape(10.dp))
                                                .background(
                                                    if (racer.isCurrentUser) Brush.horizontalGradient(listOf(PurplePrimary, PurpleAccent))
                                                    else Brush.horizontalGradient(listOf(Color(0xFF4C3580), Color(0xFF6B4CAE)))
                                                )
                                        )

                                        // Moving Athlete Avatar Icon
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(racer.progressPercentage)
                                                .wrapContentWidth(Alignment.End)
                                                .size(24.dp)
                                                .clip(CircleShape)
                                                .background(if (racer.isCurrentUser) PurpleAccent else DarkSurface)
                                                .border(1.dp, PurplePrimary, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(racer.avatar, fontSize = 12.sp)
                                        }
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        // Real-Time Live Ticker Feed Card
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(DarkSurface)
                                .padding(12.dp)
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("🔥", fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("LIVE RACE UPDATES", fontWeight = FontWeight.Bold, color = PurpleAccent, fontSize = 11.sp)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Alex just completed a 45m workout! You're only 25 points behind for 1st place! ⚡",
                                    fontSize = 12.sp,
                                    color = TextSecondaryDark,
                                    lineHeight = 16.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Log Activity & Boost Points CTA
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(46.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(PurpleBrandGradient)
                                .clickable {
                                    userPoints += 30
                                    val idx = racers.indexOfFirst { it.isCurrentUser }
                                    if (idx >= 0) {
                                        racers[idx] = racers[idx].copy(points = userPoints, progressPercentage = 0.88f, rank = 1)
                                        racers[0] = racers[0].copy(rank = 2)
                                    }
                                    successToastMessage = "🔥 Activity Logged! You gained +30 pts and moved to 1st Place! 🎉"
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text("⚡ Log Activity (+30 pts)", fontWeight = FontWeight.Black, color = TextPrimaryDark, fontSize = 14.sp)
                        }
                    }
                }
            }

            // =====================================================================
            // 2. BROWSE ALL CHALLENGES (Global, Weight, Strength, Yoga)
            // =====================================================================
            CommunityTab.CHALLENGES -> {
                Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    sampleChallenges.forEach { challenge ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(DarkSurface)
                                .border(1.dp, if (challenge.isJoined) PurpleAccent.copy(alpha = 0.6f) else DarkBorderSubtle, RoundedCornerShape(20.dp))
                                .padding(16.dp)
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
                                            .background(PurplePrimary.copy(alpha = 0.25f))
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = "${challenge.category.icon} ${challenge.category.displayName.uppercase()}",
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = PurpleAccent
                                        )
                                    }

                                    Text(
                                        text = "${challenge.daysRemaining} days left",
                                        fontSize = 11.5.sp,
                                        color = TextSecondaryDark,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = challenge.title,
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, fontSize = 16.sp),
                                    color = TextPrimaryDark
                                )

                                Text(
                                    text = challenge.description,
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp, lineHeight = 16.sp),
                                    color = TextSecondaryDark
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Community Stats Strip (Participants & Countries)
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("👥 ${challenge.currentParticipants} Athletes", fontSize = 11.sp, color = TextSecondaryDark)
                                    Text("🌎 ${challenge.countriesCount} Countries", fontSize = 11.sp, color = TextSecondaryDark)
                                    Text("⭐ +${challenge.rewardXp} XP", fontSize = 11.sp, color = PurpleAccent, fontWeight = FontWeight.Bold)
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                // Join / Joined Status Button
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(44.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (challenge.isJoined) DarkSurfaceVariant else PurplePrimary)
                                        .border(1.dp, if (challenge.isJoined) PurpleAccent else Color.Transparent, RoundedCornerShape(12.dp))
                                        .clickable {
                                            challenge.isJoined = !challenge.isJoined
                                            successToastMessage = if (challenge.isJoined) "Joined ${challenge.title}! 🎉" else "Left challenge."
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = if (challenge.isJoined) "✓ Joined • Active in Challenge" else "Join Challenge →",
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimaryDark,
                                        fontSize = 13.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // =====================================================================
            // 3. FRIENDS ACTIVITY FEED & REACTIONS
            // =====================================================================
            CommunityTab.FEED -> {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    friendFeed.forEach { item ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(18.dp))
                                .background(DarkSurface)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(18.dp))
                                .padding(16.dp)
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(40.dp)
                                            .clip(CircleShape)
                                            .background(PurpleDark)
                                            .border(1.dp, PurpleAccent, CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(item.avatar, fontSize = 18.sp, color = TextPrimaryDark)
                                    }

                                    Spacer(modifier = Modifier.width(12.dp))

                                    Column {
                                        Text(item.userName, fontWeight = FontWeight.Black, color = TextPrimaryDark, fontSize = 14.sp)
                                        Text(item.timestamp, fontSize = 11.sp, color = TextTertiaryDark)
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = item.activityText,
                                    fontSize = 13.sp,
                                    color = TextPrimaryDark,
                                    lineHeight = 18.sp
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Social Reactions Bar (❤️ Like, 🔥 Fire, 👏 Clap, 💪 Strong)
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    ReactionButton("❤️", item.likesCount) { item.likesCount++ }
                                    ReactionButton("🔥", item.fireCount) { item.fireCount++ }
                                    ReactionButton("👏", item.clapsCount) { item.clapsCount++ }
                                    ReactionButton("💪", item.strongCount) { item.strongCount++ }
                                }
                            }
                        }
                    }
                }
            }

            // =====================================================================
            // 4. LEADERBOARDS (Podium & Rankings)
            // =====================================================================
            CommunityTab.LEADERBOARD -> {
                val leaders = listOf(
                    LeaderboardEntry(rank = 1, name = "Alex Vance", avatar = "♂", scoreText = "1,420 pts", badge = "🏆 1st Place"),
                    LeaderboardEntry(rank = 2, name = "${userProfile?.name ?: "Sarah"} (You)", avatar = "♀", scoreText = "1,240 pts", badge = "🥈 2nd Place", isCurrentUser = true),
                    LeaderboardEntry(rank = 3, name = "Emma Watson", avatar = "♀", scoreText = "1,180 pts", badge = "🥉 3rd Place"),
                    LeaderboardEntry(rank = 4, name = "David Chen", avatar = "♂", scoreText = "1,050 pts"),
                    LeaderboardEntry(rank = 5, name = "Maria Santos", avatar = "♀", scoreText = "980 pts")
                )

                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    leaders.forEach { leader ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (leader.isCurrentUser) PurplePrimary.copy(alpha = 0.2f) else DarkSurface)
                                .border(1.dp, if (leader.isCurrentUser) PurpleAccent else DarkBorderSubtle, RoundedCornerShape(16.dp))
                                .padding(14.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "${leader.rank}",
                                        fontWeight = FontWeight.Black,
                                        fontSize = 16.sp,
                                        color = when (leader.rank) {
                                            1 -> AmberOrange
                                            2 -> PurpleAccent
                                            3 -> Color(0xFFCD7F32)
                                            else -> TextSecondaryDark
                                        }
                                    )

                                    Spacer(modifier = Modifier.width(14.dp))

                                    Box(
                                        modifier = Modifier
                                            .size(36.dp)
                                            .clip(CircleShape)
                                            .background(DarkSurfaceVariant),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(leader.avatar, fontSize = 16.sp)
                                    }

                                    Spacer(modifier = Modifier.width(10.dp))

                                    Column {
                                        Text(
                                            text = leader.name,
                                            fontWeight = if (leader.isCurrentUser) FontWeight.Black else FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = TextPrimaryDark
                                        )
                                        Text(leader.badge, fontSize = 11.sp, color = PurpleAccent)
                                    }
                                }

                                Text(
                                    text = leader.scoreText,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 14.sp,
                                    color = TextPrimaryDark
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }

    // =========================================================================
    // DIALOGS & MODALS
    // =========================================================================

    // 1. Challenge a Friend Dialog
    if (showChallengeFriendDialog) {
        var selectedFriend by remember { mutableStateOf("Sarah") }
        var selectedChallengeType by remember { mutableStateOf("7-Day Workout Race") }

        AlertDialog(
            onDismissRequest = { showChallengeFriendDialog = false },
            title = { Text("⚡ Challenge a Friend", color = TextPrimaryDark, fontWeight = FontWeight.Black) },
            text = {
                Column {
                    Text("Select a friend to invite:", color = TextSecondaryDark, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    val friends = listOf("Sarah", "Alex", "Emma", "David", "Maria")
                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        friends.forEach { f ->
                            val isSel = selectedFriend == f
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) PurplePrimary else DarkSurfaceVariant)
                                    .clickable { selectedFriend = f }
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(f, fontSize = 12.sp, color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text("Choose Race Format:", color = TextSecondaryDark, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    val types = listOf(
                        "7-Day Workout Race",
                        "Running Distance Challenge",
                        "Daily Step Sprint",
                        "Strength PR Battle",
                        "14-Day Consistency Challenge",
                        "Yoga & Mobility Race",
                        "Healthy Habit Challenge"
                    )
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        types.take(4).forEach { t ->
                            val isSel = selectedChallengeType == t
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) PurplePrimary.copy(alpha = 0.25f) else DarkSurface)
                                    .border(1.dp, if (isSel) PurpleAccent else DarkBorderSubtle, RoundedCornerShape(8.dp))
                                    .clickable { selectedChallengeType = t }
                                    .padding(10.dp)
                            ) {
                                Text(t, fontSize = 12.sp, color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showChallengeFriendDialog = false
                        successToastMessage = "⚡ Challenge sent to $selectedFriend for $selectedChallengeType!"
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Send Challenge ⚡", fontWeight = FontWeight.Black, color = TextPrimaryDark)
                }
            },
            dismissButton = {
                TextButton(onClick = { showChallengeFriendDialog = false }) {
                    Text("Cancel", color = TextSecondaryDark)
                }
            },
            containerColor = DarkSurfaceVariant
        )
    }

    // 2. Create Challenge Dialog
    if (showCreateChallengeDialog) {
        var challengeName by remember { mutableStateOf("30-Day Morning Workout Challenge") }
        var privacy by remember { mutableStateOf(ChallengePrivacy.PUBLIC) }
        var duration by remember { mutableIntStateOf(30) }

        AlertDialog(
            onDismissRequest = { showCreateChallengeDialog = false },
            title = { Text("+ Create New Challenge", color = TextPrimaryDark, fontWeight = FontWeight.Black) },
            text = {
                Column {
                    Text("Challenge Name", color = TextSecondaryDark, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = challengeName,
                        onValueChange = { challengeName = it },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PurplePrimary,
                            unfocusedBorderColor = DarkBorderSubtle,
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text("Privacy Setting", color = TextSecondaryDark, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        ChallengePrivacy.values().forEach { p ->
                            val isSel = privacy == p
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) PurplePrimary else DarkSurface)
                                    .clickable { privacy = p }
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            ) {
                                Text(p.displayName, fontSize = 11.sp, color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text("Duration: $duration Days", color = TextSecondaryDark, fontSize = 12.sp)
                    Slider(
                        value = duration.toFloat(),
                        onValueChange = { duration = it.toInt() },
                        valueRange = 7f..60f,
                        colors = SliderDefaults.colors(thumbColor = PurpleAccent, activeTrackColor = PurplePrimary)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showCreateChallengeDialog = false
                        successToastMessage = "🎉 '$challengeName' created successfully!"
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Create Challenge", fontWeight = FontWeight.Black, color = TextPrimaryDark)
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateChallengeDialog = false }) {
                    Text("Cancel", color = TextSecondaryDark)
                }
            },
            containerColor = DarkSurfaceVariant
        )
    }

    // 3. Privacy & Safety Dialog
    if (showPrivacyDialog) {
        var isPrivateProfile by remember { mutableStateOf(false) }
        var hideWeight by remember { mutableStateOf(true) }
        var hideProgress by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = { Text("🔒 Community Privacy & Safety", color = TextPrimaryDark, fontWeight = FontWeight.Black) },
            text = {
                Column {
                    Text("We protect your privacy. Body weight is never shared publicly.", color = TextSecondaryDark, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text("Hide Body Weight", color = TextPrimaryDark, fontSize = 13.sp)
                        Switch(checked = hideWeight, onCheckedChange = { hideWeight = it }, colors = SwitchDefaults.colors(checkedTrackColor = PurplePrimary))
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text("Private Profile", color = TextPrimaryDark, fontSize = 13.sp)
                        Switch(checked = isPrivateProfile, onCheckedChange = { isPrivateProfile = it }, colors = SwitchDefaults.colors(checkedTrackColor = PurplePrimary))
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text("Hide Progress from Feed", color = TextPrimaryDark, fontSize = 13.sp)
                        Switch(checked = hideProgress, onCheckedChange = { hideProgress = it }, colors = SwitchDefaults.colors(checkedTrackColor = PurplePrimary))
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = { showPrivacyDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Save Privacy Settings", color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = DarkSurfaceVariant
        )
    }

    // 4. Matchmaking Dialog
    if (showMatchmakingDialog) {
        AlertDialog(
            onDismissRequest = { showMatchmakingDialog = false },
            title = { Text("🤝 Fitness Matchmaking", color = TextPrimaryDark, fontWeight = FontWeight.Black) },
            text = {
                Column {
                    Text("We matched you with a training partner based on your fitness level and 30-min goal duration:", color = TextSecondaryDark, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(14.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(DarkSurface)
                            .padding(14.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🏃‍♀️", fontSize = 28.sp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("Emma • 94% Compatibility", fontWeight = FontWeight.Black, color = PurpleAccent, fontSize = 14.sp)
                                Text("Goal: Consistency & HIIT • 4 days/wk", fontSize = 11.5.sp, color = TextSecondaryDark)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showMatchmakingDialog = false
                        successToastMessage = "🤝 Connected with Emma! You are now challenge partners."
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Partner Up ⚡", fontWeight = FontWeight.Black, color = TextPrimaryDark)
                }
            },
            dismissButton = {
                TextButton(onClick = { showMatchmakingDialog = false }) {
                    Text("Cancel", color = TextSecondaryDark)
                }
            },
            containerColor = DarkSurfaceVariant
        )
    }
}

@Composable
private fun ReactionButton(
    emoji: String,
    count: Int,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(DarkSurfaceVariant)
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 6.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(emoji, fontSize = 12.sp)
            Spacer(modifier = Modifier.width(4.dp))
            Text("$count", fontSize = 11.sp, color = TextSecondaryDark, fontWeight = FontWeight.Bold)
        }
    }
}
