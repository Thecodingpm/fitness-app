package com.fitpulse.app.core.data.repository

import com.fitpulse.app.core.data.ai.AICoachService
import com.fitpulse.app.core.data.local.FitPulseDatabase
import com.fitpulse.app.core.domain.calculator.FitnessCalculators
import com.fitpulse.app.core.domain.model.*
import com.fitpulse.app.core.domain.repository.FitPulseRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flowOf
import java.util.UUID

class FitPulseRepositoryImpl(
    private val database: FitPulseDatabase? = null,
    private val aiService: AICoachService = AICoachService()
) : FitPulseRepository {

    // Default Seed Data
    private val sampleUserProfile = UserProfile(
        name = "Alex Vance",
        email = "alex.vance@example.com",
        age = 27,
        gender = Gender.MALE,
        heightCm = 180.0,
        weightKg = 78.5,
        targetWeightKg = 82.0,
        goal = FitnessGoal.MUSCLE_GAIN,
        experienceLevel = ExperienceLevel.INTERMEDIATE,
        environment = TrainingEnvironment.GYM,
        availableEquipment = listOf(EquipmentType.BARBELL, EquipmentType.DUMBBELLS, EquipmentType.BENCH, EquipmentType.CABLE_MACHINES),
        workoutDaysPerWeek = 4,
        workoutDurationMinutes = 50,
        dietaryPreference = "High Protein Omnivore",
        dailyCalorieTarget = 2750,
        dailyProteinTargetGrams = 175,
        dailyCarbsTargetGrams = 310,
        dailyFatTargetGrams = 75,
        dailyWaterTargetLiters = 3.2,
        dailyStepTarget = 10000,
        unitSystem = UnitSystem.METRIC,
        isPremium = true,
        level = 12,
        currentXp = 4850,
        nextLevelXp = 6000,
        rankTitle = "IRON BUILDER",
        streakDays = 14
    )

    private val seededExercises = listOf(
        Exercise(
            id = "ex_bench_press",
            name = "Barbell Bench Press",
            primaryMuscle = MuscleGroup.CHEST,
            secondaryMuscles = listOf(MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS),
            equipment = EquipmentType.BARBELL,
            difficulty = ExperienceLevel.BEGINNER,
            instructions = listOf(
                "Lie flat on the bench with feet firmly planted on the ground.",
                "Grip the bar slightly wider than shoulder-width with wrists straight.",
                "Unrack bar, lower under control to mid-chest touching lightly.",
                "Press up forcefully while keeping shoulder blades retracted."
            ),
            formCues = listOf("Retract shoulder blades into bench", "Leg drive through the floor", "Control 2-sec eccentric"),
            commonMistakes = listOf("Flaring elbows out at 90°", "Bouncing bar off chest", "Lifting hips off bench"),
            recommendedSets = 3,
            recommendedReps = "8-10",
            restSeconds = 90,
            alternatives = listOf("Dumbbell Bench Press", "Machine Chest Press"),
            animationGifUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg",
            thumbnailUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg"
        ),
        Exercise(
            id = "ex_incline_db_press",
            name = "Incline Dumbbell Press",
            primaryMuscle = MuscleGroup.CHEST,
            secondaryMuscles = listOf(MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS),
            equipment = EquipmentType.DUMBBELLS,
            difficulty = ExperienceLevel.BEGINNER,
            instructions = listOf(
                "Set bench to a 30-degree incline.",
                "Bring dumbbells to shoulder level with elbows tucked at 45 degrees.",
                "Press dumbbells up in a slight arc until arms are extended without locking."
            ),
            formCues = listOf("Keep chest proud", "Maintain neutral wrists", "Full stretch at bottom"),
            commonMistakes = listOf("Incline set too steep (>45°)", "Clanging weights together"),
            recommendedSets = 3,
            recommendedReps = "10-12",
            restSeconds = 75,
            alternatives = listOf("Incline Barbell Press", "Cable Flyes"),
            animationGifUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg",
            thumbnailUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg"
        ),
        Exercise(
            id = "ex_barbell_squat",
            name = "Barbell Back Squat",
            primaryMuscle = MuscleGroup.LEGS,
            secondaryMuscles = listOf(MuscleGroup.GLUTES, MuscleGroup.CORE),
            equipment = EquipmentType.BARBELL,
            difficulty = ExperienceLevel.BEGINNER,
            instructions = listOf(
                "Rest the bar securely on upper traps or rear delts.",
                "Stand with feet shoulder-width apart, toes flared slightly out.",
                "Brace core, push hips back and knees out in line with toes.",
                "Descend until thighs are parallel to ground, then drive through mid-foot."
            ),
            formCues = listOf("Deep diaphragmatic brace", "Knees track over toes", "Chest upright"),
            commonMistakes = listOf("Knees caving inward", "Excessive forward lean", "Heels lifting off ground"),
            recommendedSets = 3,
            recommendedReps = "8-10",
            restSeconds = 90,
            alternatives = listOf("Goblet Squats", "Leg Press"),
            animationGifUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg",
            thumbnailUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg"
        ),
        Exercise(
            id = "ex_pullup",
            name = "Lat Pulldown / Pull-Ups",
            primaryMuscle = MuscleGroup.BACK,
            secondaryMuscles = listOf(MuscleGroup.BICEPS, MuscleGroup.CORE),
            equipment = EquipmentType.PULL_UP_BAR,
            difficulty = ExperienceLevel.BEGINNER,
            instructions = listOf(
                "Grip the bar slightly wider than shoulder-width with overhand grip.",
                "Hang from a full dead-hang to recruit lats.",
                "Initiate by pulling elbows down and back toward your ribs until chin clears bar."
            ),
            formCues = listOf("Drive elbows down to hips", "Engage core to prevent swinging", "Full stretch at top"),
            commonMistakes = listOf("Swinging body", "Partial range of motion"),
            recommendedSets = 3,
            recommendedReps = "8-10",
            restSeconds = 75,
            alternatives = listOf("Lat Pulldown Machine", "Assisted Pull-Up"),
            animationGifUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
            thumbnailUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg"
        ),
        Exercise(
            id = "ex_overhead_press",
            name = "Standing Overhead Press",
            primaryMuscle = MuscleGroup.SHOULDERS,
            secondaryMuscles = listOf(MuscleGroup.TRICEPS, MuscleGroup.CORE),
            equipment = EquipmentType.BARBELL,
            difficulty = ExperienceLevel.BEGINNER,
            instructions = listOf(
                "Rest barbell on anterior deltoids with hands just outside shoulders.",
                "Squeeze glutes and brace core tightly.",
                "Press bar vertically in a straight path, moving head back slightly, then forward as bar clears."
            ),
            formCues = listOf("Vertical forearm angle", "Glutes locked", "Head through window at top"),
            commonMistakes = listOf("Arching lower back", "Pressing bar too far forward"),
            recommendedSets = 3,
            recommendedReps = "8-10",
            restSeconds = 90,
            alternatives = listOf("Dumbbell Shoulder Press", "Machine Overhead Press"),
            animationGifUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg",
            thumbnailUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg"
        ),
        Exercise(
            id = "ex_rdl",
            name = "Romanian Deadlift (RDL)",
            primaryMuscle = MuscleGroup.LEGS,
            secondaryMuscles = listOf(MuscleGroup.GLUTES, MuscleGroup.BACK),
            equipment = EquipmentType.BARBELL,
            difficulty = ExperienceLevel.BEGINNER,
            instructions = listOf(
                "Hold bar at hip level with shoulder-width overhand grip.",
                "Keep soft bend in knees and hinge hips backward while keeping bar close to shins.",
                "Lower until deep hamstring stretch is felt, then drive hips forward."
            ),
            formCues = listOf("Hips back, not down", "Bar close to thighs", "Neutral spine"),
            commonMistakes = listOf("Rounding lower back", "Bending knees into standard squat"),
            recommendedSets = 3,
            recommendedReps = "8-10",
            restSeconds = 90,
            alternatives = listOf("Dumbbell RDL", "Leg Curl Machine"),
            animationGifUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg",
            thumbnailUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg"
        )
    )

    private val sampleTodaysWorkout = WorkoutPlan(
        id = "plan_upper_strength",
        title = "Upper Body Strength & Hypertrophy",
        subtitle = "Chest • Back • Shoulders • Arms",
        durationMinutes = 45,
        targetMuscles = listOf(MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS),
        exercises = listOf(
            WorkoutExercise(
                exercise = seededExercises[0], // Barbell Bench Press
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 10, targetWeightKg = 70.0, actualReps = 10, actualWeightKg = 70.0, rpe = 7.5, isCompleted = true),
                    ExerciseSet(setNumber = 2, targetReps = 10, targetWeightKg = 70.0, actualReps = 10, actualWeightKg = 70.0, rpe = 8.0, isCompleted = true),
                    ExerciseSet(setNumber = 3, targetReps = 8, targetWeightKg = 72.5, actualReps = 8, actualWeightKg = 72.5, rpe = 8.5, isCompleted = false)
                ),
                previousBestWeightKg = 70.0,
                previousBestReps = 10
            ),
            WorkoutExercise(
                exercise = seededExercises[3], // Pull-Ups
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 10, targetWeightKg = 0.0, actualReps = 10, actualWeightKg = 0.0, isCompleted = true),
                    ExerciseSet(setNumber = 2, targetReps = 8, targetWeightKg = 0.0, actualReps = 8, actualWeightKg = 0.0, isCompleted = true),
                    ExerciseSet(setNumber = 3, targetReps = 8, targetWeightKg = 0.0, actualReps = null, actualWeightKg = null, isCompleted = false)
                ),
                previousBestWeightKg = 0.0,
                previousBestReps = 10
            ),
            WorkoutExercise(
                exercise = seededExercises[1], // Incline Dumbbell Press
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 12, targetWeightKg = 26.0, isCompleted = false),
                    ExerciseSet(setNumber = 2, targetReps = 10, targetWeightKg = 26.0, isCompleted = false),
                    ExerciseSet(setNumber = 3, targetReps = 10, targetWeightKg = 28.0, isCompleted = false)
                ),
                previousBestWeightKg = 26.0,
                previousBestReps = 12
            ),
            WorkoutExercise(
                exercise = seededExercises[4], // Standing Overhead Press
                sets = listOf(
                    ExerciseSet(setNumber = 1, targetReps = 8, targetWeightKg = 45.0, isCompleted = false),
                    ExerciseSet(setNumber = 2, targetReps = 8, targetWeightKg = 45.0, isCompleted = false),
                    ExerciseSet(setNumber = 3, targetReps = 6, targetWeightKg = 47.5, isCompleted = false)
                ),
                previousBestWeightKg = 45.0,
                previousBestReps = 8
            )
        ),
        estimatedCalories = 420,
        isCompletedToday = false
    )

    private val sampleFoods = listOf(
        FoodItem(name = "Grilled Chicken Breast", servingSize = "150g", calories = 247, proteinGrams = 46.5, carbsGrams = 0.0, fatGrams = 5.4, isFavorite = true),
        FoodItem(name = "Brown Rice (Cooked)", servingSize = "200g", calories = 246, proteinGrams = 5.2, carbsGrams = 52.0, fatGrams = 1.8),
        FoodItem(name = "Whole Eggs (3 Large)", servingSize = "150g", calories = 215, proteinGrams = 18.6, carbsGrams = 1.2, fatGrams = 15.0, isFavorite = true),
        FoodItem(name = "Greek Yogurt 0% Fat", servingSize = "200g", calories = 118, proteinGrams = 20.6, carbsGrams = 7.2, fatGrams = 0.4, isFavorite = true),
        FoodItem(name = "Whey Isolate Protein Shake", servingSize = "1 scoop (32g)", calories = 120, proteinGrams = 25.0, carbsGrams = 2.0, fatGrams = 1.0, isFavorite = true),
        FoodItem(name = "Avocado", servingSize = "100g", calories = 160, proteinGrams = 2.0, carbsGrams = 8.5, fatGrams = 14.7),
        FoodItem(name = "Oatmeal with Almond Milk", servingSize = "1 bowl (250g)", calories = 310, proteinGrams = 10.5, carbsGrams = 54.0, fatGrams = 6.2),
        FoodItem(name = "Salmon Fillet (Baked)", servingSize = "180g", calories = 360, proteinGrams = 38.0, carbsGrams = 0.0, fatGrams = 22.0)
    )

    private val sampleMeals = listOf(
        MealEntry(mealType = MealType.BREAKFAST, foodItem = sampleFoods[2], servings = 1.0),
        MealEntry(mealType = MealType.BREAKFAST, foodItem = sampleFoods[6], servings = 1.0),
        MealEntry(mealType = MealType.LUNCH, foodItem = sampleFoods[0], servings = 1.2),
        MealEntry(mealType = MealType.LUNCH, foodItem = sampleFoods[1], servings = 1.0),
        MealEntry(mealType = MealType.SNACKS, foodItem = sampleFoods[4], servings = 1.0)
    )

    private val sampleAchievements = listOf(
        Achievement(id = "ach_first_workout", title = "First Step Taken", description = "Complete your first workout session", iconRes = "🏆", isUnlocked = true, unlockedAt = System.currentTimeMillis() - 1200000, xpReward = 100),
        Achievement(id = "ach_7_streak", title = "Consistency Master", description = "Maintain a 7-day training & logging streak", iconRes = "🔥", isUnlocked = true, unlockedAt = System.currentTimeMillis() - 600000, xpReward = 250),
        Achievement(id = "ach_100_bench", title = "Century Club", description = "Bench press 100 kg or equivalent PR", iconRes = "⚡", isUnlocked = true, unlockedAt = System.currentTimeMillis() - 300000, xpReward = 500),
        Achievement(id = "ach_10k_steps", title = "Road Warrior", description = "Hit 10,000 steps for 5 consecutive days", iconRes = "👟", isUnlocked = true, unlockedAt = System.currentTimeMillis() - 100000, xpReward = 200),
        Achievement(id = "ach_30_workouts", title = "Iron Habit", description = "Complete 30 logged workouts", iconRes = "🛡️", isUnlocked = false, xpReward = 1000)
    )

    private val sampleChallenges = listOf(
        Challenge(id = "ch_week_volume", title = "Weekly Hypertrophy Challenge", description = "Complete 4 progressive strength workouts this week", currentProgress = 3, targetProgress = 4, unit = "workouts", daysRemaining = 2, xpReward = 400),
        Challenge(id = "ch_step_70k", title = "70,000 Steps Crusade", description = "Hit 70,000 active steps across the week", currentProgress = 52400, targetProgress = 70000, unit = "steps", daysRemaining = 3, xpReward = 350),
        Challenge(id = "ch_protein_target", title = "Protein Adherence", description = "Hit your protein target for 6 days straight", currentProgress = 5, targetProgress = 6, unit = "days", daysRemaining = 1, xpReward = 300)
    )

    private val samplePRs = listOf(
        PersonalRecord(exerciseId = "ex_bench_press", exerciseName = "Barbell Bench Press", weightKg = 92.5, reps = 5, achievedDate = System.currentTimeMillis() - 86400000L * 3),
        PersonalRecord(exerciseId = "ex_barbell_squat", exerciseName = "Barbell Back Squat", weightKg = 120.0, reps = 6, achievedDate = System.currentTimeMillis() - 86400000L * 7),
        PersonalRecord(exerciseId = "ex_rdl", exerciseName = "Romanian Deadlift", weightKg = 135.0, reps = 6, achievedDate = System.currentTimeMillis() - 86400000L * 10),
        PersonalRecord(exerciseId = "ex_overhead_press", exerciseName = "Overhead Press", weightKg = 57.5, reps = 5, achievedDate = System.currentTimeMillis() - 86400000L * 14)
    )

    private val sampleProgressMetrics = listOf(
        ProgressMetric(dateEpochDay = 1, weightKg = 81.2, bodyFatPercentage = 16.5, chestCm = 104.0, waistCm = 84.5, armsCm = 37.0, workoutVolumeKg = 8400.0, dailyCalories = 2700, dailySteps = 9800),
        ProgressMetric(dateEpochDay = 7, weightKg = 80.6, bodyFatPercentage = 16.0, chestCm = 104.5, waistCm = 83.8, armsCm = 37.2, workoutVolumeKg = 9200.0, dailyCalories = 2750, dailySteps = 10400),
        ProgressMetric(dateEpochDay = 14, weightKg = 80.0, bodyFatPercentage = 15.4, chestCm = 105.0, waistCm = 83.0, armsCm = 37.5, workoutVolumeKg = 10100.0, dailyCalories = 2720, dailySteps = 10150),
        ProgressMetric(dateEpochDay = 21, weightKg = 79.4, bodyFatPercentage = 14.8, chestCm = 105.8, waistCm = 82.2, armsCm = 38.0, workoutVolumeKg = 11400.0, dailyCalories = 2780, dailySteps = 11200),
        ProgressMetric(dateEpochDay = 28, weightKg = 78.5, bodyFatPercentage = 14.2, chestCm = 106.5, waistCm = 81.5, armsCm = 38.4, workoutVolumeKg = 12600.0, dailyCalories = 2750, dailySteps = 10800)
    )

    // Reactive State Flows
    private val userProfileState = MutableStateFlow<UserProfile?>(sampleUserProfile)
    private val todaysWorkoutState = MutableStateFlow<WorkoutPlan?>(sampleTodaysWorkout)
    private val mealsState = MutableStateFlow<List<MealEntry>>(sampleMeals)
    private val waterIntakeState = MutableStateFlow(2.4)
    private val personalRecordsState = MutableStateFlow(samplePRs)
    private val aiMessagesState = MutableStateFlow(
        listOf(
            AICoachMessage(
                sender = MessageSender.AI_COACH,
                text = "Welcome Alex! I've analyzed your goal (**Muscle Gain**) and recent workouts. Your bench press progression has increased by +7% over the last 3 weeks. Today we're attacking Upper Body Strength with a focus on progressive overload on compound presses."
            )
        )
    )

    override fun getUserProfile(): Flow<UserProfile?> = userProfileState.asStateFlow()

    override suspend fun saveUserProfile(profile: UserProfile) {
        userProfileState.value = profile
    }

    override suspend fun updateWeight(newWeightKg: Double) {
        userProfileState.value = userProfileState.value?.copy(weightKg = newWeightKg)
    }

    override suspend fun updateGamification(earnedXp: Int, checkInStreak: Boolean) {
        val current = userProfileState.value ?: return
        val newXp = current.currentXp + earnedXp
        val newLevel = FitnessCalculators.calculateLevel(newXp)
        val newRank = FitnessCalculators.getRankTitle(newLevel)
        val newStreak = if (checkInStreak) current.streakDays + 1 else current.streakDays
        userProfileState.value = current.copy(
            currentXp = newXp,
            level = newLevel,
            rankTitle = newRank,
            streakDays = newStreak,
            nextLevelXp = FitnessCalculators.getXpForNextLevel(newLevel)
        )
    }

    override fun getTodaysWorkout(): Flow<WorkoutPlan?> = todaysWorkoutState.asStateFlow()

    override fun getAllWorkoutPlans(): Flow<List<WorkoutPlan>> = flowOf(
        listOf(
            sampleTodaysWorkout,
            sampleTodaysWorkout.copy(id = "plan_lower_strength", title = "Lower Body & Posterior Chain", subtitle = "Quads • Hamstrings • Glutes • Calves", targetMuscles = listOf(MuscleGroup.LEGS, MuscleGroup.GLUTES)),
            sampleTodaysWorkout.copy(id = "plan_pull_power", title = "Pull Power & Core Stability", subtitle = "Lats • Rhomboids • Rear Delts • Core", targetMuscles = listOf(MuscleGroup.BACK, MuscleGroup.CORE))
        )
    )

    override fun getExerciseLibrary(): Flow<List<Exercise>> = flowOf(seededExercises)

    override suspend fun getExerciseById(id: String): Exercise? {
        return seededExercises.find { it.id == id }
    }

    override suspend fun saveCustomWorkout(plan: WorkoutPlan) {
        todaysWorkoutState.value = plan
    }

    override suspend fun saveWorkoutSession(session: WorkoutSession) {
        updateGamification(session.earnedXp, checkInStreak = true)
        todaysWorkoutState.value = todaysWorkoutState.value?.copy(isCompletedToday = true)
    }

    override fun getWorkoutSessions(): Flow<List<WorkoutSession>> = flowOf(
        listOf(
            WorkoutSession(
                workoutPlanId = "plan_upper_strength",
                workoutTitle = "Upper Body Strength",
                startTimeMs = System.currentTimeMillis() - 86400000L,
                totalVolumeKg = 12600.0,
                caloriesBurned = 430,
                completedExercisesCount = 4,
                totalSetsCompleted = 12,
                personalRecordsAchieved = listOf("Barbell Bench Press: 92.5kg x 5"),
                earnedXp = 250
            )
        )
    )

    override fun getDailyNutrition(epochDay: Long): Flow<DailyNutrition> {
        val meals = mealsState.value
        val totalCals = meals.sumOf { (it.foodItem.calories * it.servings).toInt() }
        val totalProt = meals.sumOf { it.foodItem.proteinGrams * it.servings }
        val totalCarbs = meals.sumOf { it.foodItem.carbsGrams * it.servings }
        val totalFats = meals.sumOf { it.foodItem.fatGrams * it.servings }

        return flowOf(
            DailyNutrition(
                dateEpochDay = epochDay,
                totalCaloriesConsumed = totalCals,
                totalProteinGrams = totalProt,
                totalCarbsGrams = totalCarbs,
                totalFatGrams = totalFats,
                waterIntakeLiters = waterIntakeState.value,
                meals = meals
            )
        )
    }

    override suspend fun logMealItem(entry: MealEntry) {
        mealsState.value = mealsState.value + entry
    }

    override suspend fun removeMealItem(entryId: String) {
        mealsState.value = mealsState.value.filterNot { it.id == entryId }
    }

    override suspend fun updateWaterIntake(litersDelta: Double) {
        val current = waterIntakeState.value
        waterIntakeState.value = (current + litersDelta).coerceIn(0.0, 10.0)
    }

    override fun searchFoodDatabase(query: String): Flow<List<FoodItem>> {
        val clean = query.trim().lowercase()
        return flowOf(
            if (clean.isEmpty()) sampleFoods else sampleFoods.filter { it.name.lowercase().contains(clean) }
        )
    }

    override fun getProgressHistory(): Flow<List<ProgressMetric>> = flowOf(sampleProgressMetrics)

    override fun getPersonalRecords(): Flow<List<PersonalRecord>> = personalRecordsState.asStateFlow()

    override suspend fun savePersonalRecord(record: PersonalRecord) {
        personalRecordsState.value = personalRecordsState.value.filterNot { it.exerciseId == record.exerciseId } + record
    }

    override fun getRecoveryMetrics(): Flow<RecoveryMetrics> = flowOf(
        FitnessCalculators.calculateRecoveryScore(
            sleepHours = 7.8,
            sorenessLevel = 2,
            stressLevel = 2,
            energyLevel = 4
        )
    )

    override suspend fun saveDailyCheckIn(sleepHours: Double, soreness: Int, stress: Int, energy: Int) {
        updateGamification(earnedXp = 50, checkInStreak = true)
    }

    override fun getAchievements(): Flow<List<Achievement>> = flowOf(sampleAchievements)

    override fun getActiveChallenges(): Flow<List<Challenge>> = flowOf(sampleChallenges)

    override fun getAIConversation(): Flow<List<AICoachMessage>> = aiMessagesState.asStateFlow()

    override suspend fun sendUserMessageToAI(message: String): AICoachMessage {
        val userMsg = AICoachMessage(sender = MessageSender.USER, text = message)
        aiMessagesState.value = aiMessagesState.value + userMsg

        val recovery = FitnessCalculators.calculateRecoveryScore(7.8, 2, 2, 4)
        val aiReply = aiService.generateCoachResponse(message, userProfileState.value, recovery)
        aiMessagesState.value = aiMessagesState.value + aiReply
        return aiReply
    }

    // Step Tracker State
    private val sampleHourlySteps = listOf(
        HourlyStepBucket(6, 180),
        HourlyStepBucket(7, 450),
        HourlyStepBucket(8, 820),
        HourlyStepBucket(9, 1200),
        HourlyStepBucket(10, 420),
        HourlyStepBucket(11, 350),
        HourlyStepBucket(12, 1650),
        HourlyStepBucket(13, 620),
        HourlyStepBucket(14, 480),
        HourlyStepBucket(15, 1100),
        HourlyStepBucket(16, 550),
        HourlyStepBucket(17, 2100),
        HourlyStepBucket(18, 980),
        HourlyStepBucket(19, 1100)
    )

    private val sampleWeeklyHistory = listOf(
        StepDaySummary("2026-08-16", "Mon", 9800, 10000, 7.4, 392, 93),
        StepDaySummary("2026-08-17", "Tue", 10450, 10000, 7.9, 418, 99),
        StepDaySummary("2026-08-18", "Wed", 11200, 10000, 8.5, 448, 106),
        StepDaySummary("2026-08-19", "Thu", 8900, 10000, 6.8, 356, 84),
        StepDaySummary("2026-08-20", "Fri", 10100, 10000, 7.7, 404, 96),
        StepDaySummary("2026-08-21", "Sat", 12300, 10000, 9.4, 492, 117),
        StepDaySummary("2026-08-22", "Sun", 8420, 10000, 6.4, 345, 78)
    )

    private val stepTrackerState = MutableStateFlow(
        StepTrackerData(
            currentSteps = 8420,
            targetSteps = 10000,
            distanceKm = 6.4,
            caloriesBurned = 345,
            activeMinutes = 78,
            hourlyBreakdown = sampleHourlySteps,
            weeklyHistory = sampleWeeklyHistory,
            streakDays = 14,
            isSensorConnected = true
        )
    )

    override fun getStepTrackerData(): Flow<StepTrackerData> = stepTrackerState.asStateFlow()

    override suspend fun updateStepGoal(newTarget: Int) {
        stepTrackerState.value = stepTrackerState.value.copy(targetSteps = newTarget)
        userProfileState.value?.let { profile ->
            userProfileState.value = profile.copy(dailyStepTarget = newTarget)
        }
    }

    override suspend fun simulateStepWalk(steps: Int) {
        val current = stepTrackerState.value
        val updatedSteps = current.currentSteps + steps
        val profile = userProfileState.value
        val height = profile?.heightCm ?: 175.0
        val weight = profile?.weightKg ?: 75.0

        val newDistance = FitnessCalculators.calculateStepDistanceKm(updatedSteps, height)
        val newCalories = FitnessCalculators.calculateStepCalories(updatedSteps, weight)
        val newActiveMins = FitnessCalculators.calculateActiveMinutes(updatedSteps)

        stepTrackerState.value = current.copy(
            currentSteps = updatedSteps,
            distanceKm = newDistance,
            caloriesBurned = newCalories,
            activeMinutes = newActiveMins
        )

        // Award XP on hitting target
        if (current.currentSteps < current.targetSteps && updatedSteps >= current.targetSteps) {
            updateGamification(earnedXp = 100, checkInStreak = false)
        }
    }

    override suspend fun generateAIWorkout(prompt: String): WorkoutPlan {
        return sampleTodaysWorkout.copy(
            id = UUID.randomUUID().toString(),
            title = "AI Adaptive: " + (if (prompt.isNotBlank()) prompt else "Custom Push Split"),
            isAIGenerated = true
        )
    }
}
