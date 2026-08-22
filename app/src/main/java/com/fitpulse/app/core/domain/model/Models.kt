package com.fitpulse.app.core.domain.model

import java.util.UUID

// ==========================================
// User & Goal Models
// ==========================================

enum class FitnessGoal(val displayName: String, val description: String) {
    WEIGHT_LOSS("Lose Weight", "Burn fat and maintain lean muscle with dynamic conditioning"),
    WEIGHT_GAIN("Gain Weight", "Healthy weight gain with strength training and balanced surplus nutrition"),
    BUILD_MUSCLE("Build Muscle", "Maximize hypertrophy with progressive overload"),
    GET_STRONGER("Get Stronger", "Build raw power and kinetic functional strength"),
    IMPROVE_FITNESS("Improve Fitness", "Boost cardiovascular stamina, agility, and overall energy"),
    IMPROVE_FLEXIBILITY("Improve Flexibility", "Enhance range of motion, posture, and mobility flow"),
    STAY_HEALTHY("Stay Healthy", "Sustain longevity, joint health, and daily wellness habits"),
    // Backward compatibility aliases
    MUSCLE_GAIN("Build Muscle", "Maximize hypertrophy with progressive overload"),
    FAT_LOSS("Lose Weight", "Burn fat and maintain lean muscle with dynamic conditioning"),
    STRENGTH("Get Stronger", "Build raw power and kinetic functional strength"),
    GENERAL_FITNESS("Improve Fitness", "Boost cardiovascular stamina, agility, and overall energy"),
    ENDURANCE("Improve Fitness", "Increase aerobic capacity, VO2 max, and stamina"),
    MAINTENANCE("Stay Healthy", "Keep current body composition and improve movement quality")
}

enum class InstructorGender(val displayName: String) {
    FEMALE("Female Instructor"),
    MALE("Male Instructor"),
    ANY("All Instructors")
}

enum class ExperienceLevel(val displayName: String) {
    BEGINNER("Beginner (< 6 months)"),
    INTERMEDIATE("Intermediate (1 - 3 years)"),
    ADVANCED("Advanced (3+ years)")
}

enum class TrainingEnvironment(val displayName: String) {
    GYM("Commercial Gym"),
    HOME("Home Workouts"),
    BOTH("Hybrid (Gym & Home)")
}

enum class EquipmentType(val displayName: String) {
    BODYWEIGHT("Bodyweight Only"),
    DUMBBELLS("Dumbbells"),
    BARBELL("Barbell & Plates"),
    BENCH("Adjustable Bench"),
    PULL_UP_BAR("Pull-up Bar"),
    RESISTANCE_BANDS("Resistance Bands"),
    CABLE_MACHINES("Cable Machines"),
    FULL_GYM("Full Commercial Gym")
}

enum class Gender { MALE, FEMALE, OTHER }

enum class UnitSystem { METRIC, IMPERIAL }

data class UserProfile(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val age: Int,
    val gender: Gender,
    val heightCm: Double,
    val weightKg: Double,
    val targetWeightKg: Double,
    val goal: FitnessGoal,
    val experienceLevel: ExperienceLevel,
    val environment: TrainingEnvironment = TrainingEnvironment.BOTH,
    val availableEquipment: List<EquipmentType> = listOf(EquipmentType.BODYWEIGHT, EquipmentType.DUMBBELLS),
    val workoutDaysPerWeek: Int = 4,
    val workoutDurationMinutes: Int = 30,
    val instructorGender: InstructorGender = InstructorGender.ANY,
    val soundAlertsEnabled: Boolean = true,
    val hapticsEnabled: Boolean = true,
    val reminderTime: String = "08:00 AM",
    val reminderDays: List<String> = listOf("Mon", "Tue", "Thu", "Fri"),
    val dietaryPreference: String = "Balanced",
    val dailyCalorieTarget: Int = 2400,
    val dailyProteinTargetGrams: Int = 160,
    val dailyCarbsTargetGrams: Int = 260,
    val dailyFatTargetGrams: Int = 70,
    val dailyWaterTargetLiters: Double = 3.0,
    val dailyStepTarget: Int = 10000,
    val unitSystem: UnitSystem = UnitSystem.METRIC,
    val isPremium: Boolean = true,
    val level: Int = 12,
    val currentXp: Int = 4850,
    val nextLevelXp: Int = 6000,
    val rankTitle: String = "FITNESS PRO",
    val streakDays: Int = 14,
    val createdAt: Long = System.currentTimeMillis()
)

// ==========================================
// Yoga & Flexibility Models
// ==========================================

data class YogaPose(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val sanskritName: String = "",
    val durationSeconds: Int = 45,
    val targetArea: String = "Full Body",
    val instructions: String = "",
    val benefits: String = "",
    val animationType: String = "pose_flow"
)

data class YogaSession(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val category: String, // "Morning Yoga", "Beginner Yoga", "Evening Yoga", "Full Body Stretch", "Flexibility", "Mobility", "Recovery", "Relaxation"
    val durationMinutes: Int,
    val level: String = "All Levels",
    val posesCount: Int = 5,
    val poses: List<YogaPose> = emptyList(),
    val caloriesBurned: Int = 65,
    val description: String = ""
)

// ==========================================
// Exercise & Workout Models
// ==========================================

enum class MuscleGroup(val displayName: String) {
    CHEST("Chest"),
    BACK("Back"),
    SHOULDERS("Shoulders"),
    BICEPS("Biceps"),
    TRICEPS("Triceps"),
    LEGS("Legs"),
    GLUTES("Glutes"),
    CORE("Core"),
    CARDIO("Cardio"),
    FULL_BODY("Full Body")
}

enum class SetType {
    NORMAL, WARMUP, DROPSET, SUPERSET, FAILURE
}

data class Exercise(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val primaryMuscle: MuscleGroup,
    val secondaryMuscles: List<MuscleGroup> = emptyList(),
    val equipment: EquipmentType,
    val difficulty: ExperienceLevel = ExperienceLevel.BEGINNER,
    val instructions: List<String> = emptyList(),
    val formCues: List<String> = emptyList(),
    val commonMistakes: List<String> = emptyList(),
    val recommendedSets: Int = 3,
    val recommendedReps: String = "8-12",
    val restSeconds: Int = 60,
    val alternatives: List<String> = emptyList(),
    val mediaUrl: String? = null,
    val animationGifUrl: String? = null,
    val thumbnailUrl: String? = null,
    val isCustom: Boolean = false
)

data class ExerciseSet(
    val setNumber: Int,
    val setType: SetType = SetType.NORMAL,
    val targetReps: Int = 10,
    val targetWeightKg: Double = 50.0,
    var actualReps: Int? = null,
    var actualWeightKg: Double? = null,
    var rpe: Double? = null, // Rate of Perceived Exertion (1 - 10)
    var isCompleted: Boolean = false,
    val restTimeSeconds: Int = 90,
    val notes: String = ""
)

data class WorkoutExercise(
    val exercise: Exercise,
    val sets: List<ExerciseSet>,
    val targetRpe: Double = 8.0,
    val previousBestWeightKg: Double? = null,
    val previousBestReps: Int? = null
)

data class WorkoutPlan(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val subtitle: String,
    val durationMinutes: Int,
    val targetMuscles: List<MuscleGroup>,
    val exercises: List<WorkoutExercise>,
    val estimatedCalories: Int = 380,
    val difficulty: ExperienceLevel = ExperienceLevel.INTERMEDIATE,
    val isAIGenerated: Boolean = true,
    val isCompletedToday: Boolean = false
)

data class WorkoutSession(
    val id: String = UUID.randomUUID().toString(),
    val workoutPlanId: String,
    val workoutTitle: String,
    val startTimeMs: Long,
    val endTimeMs: Long = System.currentTimeMillis(),
    val totalVolumeKg: Double,
    val caloriesBurned: Int,
    val completedExercisesCount: Int,
    val totalSetsCompleted: Int,
    val personalRecordsAchieved: List<String> = emptyList(),
    val earnedXp: Int = 250,
    val aiSummary: String = "Excellent progressive load on compound sets. Maintained RPE 8.0 throughout."
)

// ==========================================
// Nutrition Models
// ==========================================

enum class MealType(val displayName: String) {
    BREAKFAST("Breakfast"),
    LUNCH("Lunch"),
    DINNER("Dinner"),
    SNACKS("Snacks")
}

data class FoodItem(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val servingSize: String = "100g",
    val calories: Int,
    val proteinGrams: Double,
    val carbsGrams: Double,
    val fatGrams: Double,
    val fiberGrams: Double = 0.0,
    val barcode: String? = null,
    val isFavorite: Boolean = false
)

data class MealEntry(
    val id: String = UUID.randomUUID().toString(),
    val mealType: MealType,
    val foodItem: FoodItem,
    val servings: Double = 1.0,
    val timestamp: Long = System.currentTimeMillis()
)

data class DailyNutrition(
    val dateEpochDay: Long,
    val totalCaloriesConsumed: Int,
    val totalProteinGrams: Double,
    val totalCarbsGrams: Double,
    val totalFatGrams: Double,
    val waterIntakeLiters: Double,
    val meals: List<MealEntry>
)

// ==========================================
// Progress & Recovery Models
// ==========================================

data class ProgressMetric(
    val dateEpochDay: Long,
    val weightKg: Double,
    val bodyFatPercentage: Double? = null,
    val chestCm: Double? = null,
    val waistCm: Double? = null,
    val armsCm: Double? = null,
    val workoutVolumeKg: Double = 0.0,
    val dailyCalories: Int = 0,
    val dailySteps: Int = 0
)

data class PersonalRecord(
    val exerciseId: String,
    val exerciseName: String,
    val weightKg: Double,
    val reps: Int,
    val achievedDate: Long,
    val isNew: Boolean = false
)

data class RecoveryMetrics(
    val score: Int, // 0 - 100
    val sleepHours: Double,
    val sorenessLevel: Int, // 1 (None) - 5 (Severe)
    val stressLevel: Int,   // 1 (Low) - 5 (Extreme)
    val energyLevel: Int,   // 1 (Exhausted) - 5 (Peaking)
    val insightText: String,
    val readinessStatus: String // "Prime for PRs", "Good", "Recovery Advised"
)

// ==========================================
// Gamification & Challenges
// ==========================================

enum class ChallengeCategory(val displayName: String, val icon: String) {
    TRENDING("Trending", "🔥"),
    GLOBAL("Global Movements", "🌎"),
    WORKOUT("Workout Race", "🏋️"),
    RUNNING("Running", "🏃"),
    WALKING("Walking", "🚶"),
    STEPS("Steps", "👟"),
    STRENGTH("Strength & PRs", "💪"),
    CONSISTENCY("Consistency", "📅"),
    YOGA("Yoga & Flexibility", "🧘"),
    WEIGHT_PROGRESS("Healthy Progress", "🏆"),
    HEALTHY_HABIT("Healthy Habits", "🥗")
}

enum class ChallengePrivacy(val displayName: String) {
    PUBLIC("Public"),
    FRIENDS_ONLY("Friends Only"),
    PRIVATE("Private (Invite Code)")
}

data class CommunityChallenge(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val category: ChallengeCategory,
    val privacy: ChallengePrivacy = ChallengePrivacy.PUBLIC,
    val durationDays: Int,
    val daysRemaining: Int,
    val currentParticipants: Int,
    val totalGoal: Long = 1000000L,
    val currentProgress: Long = 782430L,
    val unit: String = "Steps",
    val countriesCount: Int = 87,
    val rewardBadge: String = "🏅 Challenge Champion",
    val rewardXp: Int = 500,
    var isJoined: Boolean = false,
    var userRank: Int = 2,
    var userPoints: Int = 395,
    val scoringRules: String = "Points awarded for consistency, completed workouts, and daily goal adherence."
)

data class RaceRacer(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val avatar: String,
    val points: Int,
    val progressPercentage: Float,
    val rank: Int,
    val recentActivity: String = "Active now",
    val isCurrentUser: Boolean = false
)

data class FriendActivityFeedItem(
    val id: String = UUID.randomUUID().toString(),
    val userName: String,
    val avatar: String,
    val activityText: String,
    val timestamp: String = "10m ago",
    var likesCount: Int = 12,
    var fireCount: Int = 8,
    var clapsCount: Int = 5,
    var strongCount: Int = 15,
    var userReaction: String? = null
)

data class LeaderboardEntry(
    val rank: Int,
    val name: String,
    val avatar: String,
    val scoreText: String,
    val badge: String = "PRO",
    val isCurrentUser: Boolean = false
)

data class Achievement(
    val id: String,
    val title: String,
    val description: String,
    val iconRes: String,
    val isUnlocked: Boolean,
    val unlockedAt: Long? = null,
    val xpReward: Int = 100
)

data class Challenge(
    val id: String,
    val title: String,
    val description: String,
    val currentProgress: Int,
    val targetProgress: Int,
    val unit: String,
    val daysRemaining: Int,
    val xpReward: Int = 300,
    val isCompleted: Boolean = false
)

// ==========================================
// AI Coach Models
// ==========================================

data class AICoachMessage(
    val id: String = UUID.randomUUID().toString(),
    val sender: MessageSender,
    val text: String,
    val timestamp: Long = System.currentTimeMillis(),
    val actionSuggestion: AIActionSuggestion? = null
)

enum class MessageSender { USER, AI_COACH }

data class AIActionSuggestion(
    val title: String,
    val actionType: String,
    val payload: String
)

