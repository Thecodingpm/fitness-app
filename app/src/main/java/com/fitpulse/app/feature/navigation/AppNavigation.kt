package com.fitpulse.app.feature.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.data.repository.FitPulseRepositoryImpl
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.*
import com.fitpulse.app.feature.ai.AICoachChatScreen
import com.fitpulse.app.feature.auth.AuthScreen
import com.fitpulse.app.feature.dashboard.HomeScreen
import com.fitpulse.app.feature.exercises.ExerciseDetailScreen
import com.fitpulse.app.feature.exercises.ExerciseLibraryScreen
import com.fitpulse.app.feature.gamification.GamificationScreen
import com.fitpulse.app.feature.nutrition.AIFoodScannerScreen
import com.fitpulse.app.feature.nutrition.AIMealPlannerScreen
import com.fitpulse.app.feature.nutrition.FoodLoggingDialog
import com.fitpulse.app.feature.community.CommunityScreen
import com.fitpulse.app.feature.nutrition.NutritionScreen
import com.fitpulse.app.feature.onboarding.OnboardingScreen
import com.fitpulse.app.feature.profile.ProfileScreen
import com.fitpulse.app.feature.profile.SubscriptionPaywallScreen
import com.fitpulse.app.feature.progress.PersonalRecordsScreen
import com.fitpulse.app.feature.progress.ProgressPhotosScreen
import com.fitpulse.app.feature.progress.ProgressScreen
import com.fitpulse.app.feature.recovery.DailyCheckInScreen
import com.fitpulse.app.feature.steptracker.StepTrackerScreen
import com.fitpulse.app.feature.workout.ActiveWorkoutScreen
import com.fitpulse.app.feature.workout.WorkoutCompleteScreen
import com.fitpulse.app.feature.workout.WorkoutPlanScreen
import com.fitpulse.app.feature.yoga.YogaScreen
import kotlinx.coroutines.launch

enum class MainTab(val title: String, val icon: ImageVector) {
    HOME("Home", Icons.Default.Home),
    WORKOUTS("Workouts", Icons.Default.FitnessCenter),
    EXERCISES("Exercises", Icons.Default.FormatListBulleted),
    PROFILE("Profile", Icons.Default.Person)
}

enum class ScreenRoute {
    MAIN,
    AUTH,
    ONBOARDING,
    ACTIVE_WORKOUT,
    WORKOUT_COMPLETE,
    EXERCISE_LIBRARY,
    EXERCISE_DETAIL,
    AI_COACH_CHAT,
    DAILY_CHECKIN,
    AI_FOOD_SCANNER,
    AI_MEAL_PLANNER,
    PROGRESS_PHOTOS,
    PERSONAL_RECORDS,
    GAMIFICATION,
    PAYWALL,
    STEP_TRACKER,
    NUTRITION
}

@Composable
fun FitPulseAppNavHost(
    repository: FitPulseRepositoryImpl = remember { FitPulseRepositoryImpl() }
) {
    val coroutineScope = rememberCoroutineScope()

    // State Collection
    val userProfile by repository.getUserProfile().collectAsState(initial = null)
    val todaysWorkout by repository.getTodaysWorkout().collectAsState(initial = null)
    val allPlans by repository.getAllWorkoutPlans().collectAsState(initial = emptyList())
    val exercises by repository.getExerciseLibrary().collectAsState(initial = emptyList())
    val dailyNutrition by repository.getDailyNutrition(1).collectAsState(
        initial = DailyNutrition(1, 1840, 142.0, 180.0, 62.0, 2.4, emptyList())
    )
    val stepTrackerData by repository.getStepTrackerData().collectAsState(
        initial = StepTrackerData()
    )
    val progressMetrics by repository.getProgressHistory().collectAsState(initial = emptyList())
    val personalRecords by repository.getPersonalRecords().collectAsState(initial = emptyList())
    val recoveryMetrics by repository.getRecoveryMetrics().collectAsState(
        initial = RecoveryMetrics(82, 7.8, 2, 2, 4, "Optimal neuromuscular recovery. You're primed to attack your top sets today.", "Prime for PRs")
    )
    val achievements by repository.getAchievements().collectAsState(initial = emptyList())
    val challenges by repository.getActiveChallenges().collectAsState(initial = emptyList())
    val aiMessages by repository.getAIConversation().collectAsState(initial = emptyList())

    // Navigation State
    val firebaseUser = remember { com.google.firebase.auth.FirebaseAuth.getInstance().currentUser }
    var currentRoute by remember { mutableStateOf(if (firebaseUser != null) ScreenRoute.MAIN else ScreenRoute.AUTH) }
    var selectedTab by remember { mutableStateOf(MainTab.HOME) }
    var selectedExerciseForDetail by remember { mutableStateOf<Exercise?>(null) }
    var selectedWorkoutForDetail by remember { mutableStateOf<WorkoutPlan?>(null) }
    var activeWorkoutPlan by remember { mutableStateOf<WorkoutPlan?>(null) }
    var completedWorkoutSession by remember { mutableStateOf<WorkoutSession?>(null) }
    var foodLoggingMealType by remember { mutableStateOf<MealType?>(null) }

    Scaffold(
        containerColor = BlackBackground,
        bottomBar = {
            if (currentRoute == ScreenRoute.MAIN) {
                NavigationBar(
                    containerColor = DarkSurface,
                    contentColor = TextPrimaryDark,
                    tonalElevation = 0.dp,
                    modifier = Modifier.height(72.dp)
                ) {
                    MainTab.values().forEach { tab ->
                        val isSelected = selectedTab == tab
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = { selectedTab = tab },
                            icon = {
                                Icon(
                                    imageVector = tab.icon,
                                    contentDescription = tab.title,
                                    tint = if (isSelected) PurpleAccent else TextTertiaryDark
                                )
                            },
                            label = {
                                Text(
                                    text = tab.title,
                                    color = if (isSelected) PurpleAccent else TextTertiaryDark,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = Color.Transparent
                            )
                        )
                    }
                }
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when (currentRoute) {
                ScreenRoute.AUTH -> {
                    AuthScreen(
                        onAuthSuccess = {
                            currentRoute = ScreenRoute.MAIN
                        },
                        onStartOnboarding = {
                            currentRoute = ScreenRoute.ONBOARDING
                        }
                    )
                }
                ScreenRoute.ONBOARDING -> {
                    OnboardingScreen(
                        onFinishOnboarding = { profile ->
                            coroutineScope.launch {
                                repository.saveUserProfile(profile)
                            }
                            currentRoute = ScreenRoute.MAIN
                        }
                    )
                }
                ScreenRoute.MAIN -> {
                    val profile = userProfile ?: return@Box
                    when (selectedTab) {
                        MainTab.HOME -> HomeScreen(
                            userProfile = profile,
                            todaysWorkout = todaysWorkout,
                            dailyNutrition = dailyNutrition,
                            recoveryMetrics = recoveryMetrics,
                            stepTrackerData = stepTrackerData,
                            onStartWorkout = {
                                activeWorkoutPlan = todaysWorkout
                                currentRoute = ScreenRoute.ACTIVE_WORKOUT
                            },
                            onOpenAICoach = { currentRoute = ScreenRoute.AI_COACH_CHAT },
                            onOpenExercises = {
                                selectedTab = MainTab.EXERCISES
                            },
                            onOpenWorkouts = { selectedTab = MainTab.WORKOUTS }
                        )
                        MainTab.WORKOUTS -> WorkoutPlanScreen(
                            userProfile = profile,
                            workoutPlans = allPlans,
                            onSelectPlanToStart = { plan ->
                                activeWorkoutPlan = plan
                                currentRoute = ScreenRoute.ACTIVE_WORKOUT
                            },
                            onOpenWorkoutDetail = { plan ->
                                selectedWorkoutForDetail = plan
                                currentRoute = ScreenRoute.EXERCISE_DETAIL
                            },
                            onNavigateExerciseLibrary = { selectedTab = MainTab.EXERCISES },
                            onCreateCustomRoutine = {
                                activeWorkoutPlan = todaysWorkout
                                currentRoute = ScreenRoute.ACTIVE_WORKOUT
                            }
                        )
                        MainTab.EXERCISES -> ExerciseLibraryScreen(
                            exercises = exercises,
                            onSelectExercise = { ex ->
                                selectedExerciseForDetail = ex
                                currentRoute = ScreenRoute.EXERCISE_DETAIL
                            },
                            onBack = { selectedTab = MainTab.HOME }
                        )
                        MainTab.PROFILE -> ProfileScreen(
                            userProfile = profile,
                            onOpenGamification = { currentRoute = ScreenRoute.GAMIFICATION },
                            onOpenSubscriptionPaywall = { currentRoute = ScreenRoute.PAYWALL },
                            onLogout = {
                                try {
                                    com.google.firebase.auth.FirebaseAuth.getInstance().signOut()
                                } catch (e: Exception) {}
                                currentRoute = ScreenRoute.AUTH
                            }
                        )
                    }
                }
                ScreenRoute.ACTIVE_WORKOUT -> {
                    val plan = activeWorkoutPlan ?: todaysWorkout
                    if (plan != null) {
                        ActiveWorkoutScreen(
                            workoutPlan = plan,
                            onFinishWorkout = { session ->
                                completedWorkoutSession = session
                                coroutineScope.launch {
                                    repository.saveWorkoutSession(session)
                                }
                                currentRoute = ScreenRoute.WORKOUT_COMPLETE
                            },
                            onCancelWorkout = { currentRoute = ScreenRoute.MAIN }
                        )
                    }
                }
                ScreenRoute.WORKOUT_COMPLETE -> {
                    val sess = completedWorkoutSession ?: WorkoutSession(
                        workoutPlanId = "",
                        workoutTitle = "Upper Body Strength",
                        startTimeMs = System.currentTimeMillis() - 2700000,
                        totalVolumeKg = 4850.0,
                        caloriesBurned = 320,
                        completedExercisesCount = 5,
                        totalSetsCompleted = 16
                    )
                    WorkoutCompleteScreen(
                        session = sess,
                        onDone = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.EXERCISE_LIBRARY -> {
                    ExerciseLibraryScreen(
                        exercises = exercises,
                        onSelectExercise = { ex ->
                            selectedExerciseForDetail = ex
                            currentRoute = ScreenRoute.EXERCISE_DETAIL
                        },
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.EXERCISE_DETAIL -> {
                    ExerciseDetailScreen(
                        exercise = selectedExerciseForDetail,
                        workoutPlan = selectedWorkoutForDetail,
                        userProfile = userProfile,
                        onBack = {
                            selectedWorkoutForDetail = null
                            selectedExerciseForDetail = null
                            currentRoute = ScreenRoute.MAIN
                        },
                        onStartWorkout = {
                            activeWorkoutPlan = selectedWorkoutForDetail ?: todaysWorkout
                            currentRoute = ScreenRoute.ACTIVE_WORKOUT
                        }
                    )
                }
                ScreenRoute.AI_COACH_CHAT -> {
                    AICoachChatScreen(
                        messages = aiMessages,
                        onSendMessage = { msg ->
                            coroutineScope.launch {
                                repository.sendUserMessageToAI(msg)
                            }
                        },
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.DAILY_CHECKIN -> {
                    DailyCheckInScreen(
                        onSaveCheckIn = { sleep, sore, stress, nrg ->
                            coroutineScope.launch {
                                repository.saveDailyCheckIn(sleep, sore, stress, nrg)
                            }
                        },
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.AI_FOOD_SCANNER -> {
                    AIFoodScannerScreen(
                        onFoodLogged = { entry ->
                            coroutineScope.launch {
                                repository.logMealItem(entry)
                            }
                        },
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.AI_MEAL_PLANNER -> {
                    AIMealPlannerScreen(
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.PROGRESS_PHOTOS -> {
                    ProgressPhotosScreen(
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.PERSONAL_RECORDS -> {
                    PersonalRecordsScreen(
                        records = personalRecords,
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.GAMIFICATION -> {
                    userProfile?.let { prof ->
                        GamificationScreen(
                            userProfile = prof,
                            achievements = achievements,
                            challenges = challenges,
                            onBack = { currentRoute = ScreenRoute.MAIN }
                        )
                    }
                }
                ScreenRoute.PAYWALL -> {
                    SubscriptionPaywallScreen(
                        onSubscribed = { /* Updated billing state */ },
                        onClose = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.STEP_TRACKER -> {
                    StepTrackerScreen(
                        stepData = stepTrackerData,
                        onUpdateGoal = { goal ->
                            coroutineScope.launch {
                                repository.updateStepGoal(goal)
                            }
                        },
                        onSimulateSteps = { delta ->
                            coroutineScope.launch {
                                repository.simulateStepWalk(delta)
                            }
                        },
                        onBack = { currentRoute = ScreenRoute.MAIN }
                    )
                }
                ScreenRoute.NUTRITION -> {
                    userProfile?.let { prof ->
                        NutritionScreen(
                            dailyNutrition = dailyNutrition,
                            userProfile = prof,
                            onOpenFoodLogging = { mType -> foodLoggingMealType = mType },
                            onOpenAIFoodScanner = { currentRoute = ScreenRoute.AI_FOOD_SCANNER },
                            onOpenAIMealPlanner = { currentRoute = ScreenRoute.AI_MEAL_PLANNER },
                            onAddWater = { delta ->
                                coroutineScope.launch {
                                    repository.updateWaterIntake(delta)
                                }
                            }
                        )
                    }
                }
            }

            // Food Logging Modal Dialog
            foodLoggingMealType?.let { mType ->
                FoodLoggingDialog(
                    mealType = mType,
                    onDismiss = { foodLoggingMealType = null },
                    onFoodLogged = { entry ->
                        coroutineScope.launch {
                            repository.logMealItem(entry)
                        }
                    }
                )
            }
        }
    }
}
