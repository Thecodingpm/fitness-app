package com.fitpulse.app.core.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.fitpulse.app.core.domain.model.*

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val age: Int,
    val gender: String,
    val heightCm: Double,
    val weightKg: Double,
    val targetWeightKg: Double,
    val goal: String,
    val experienceLevel: String,
    val environment: String,
    val availableEquipment: String, // Comma-separated or JSON
    val workoutDaysPerWeek: Int,
    val workoutDurationMinutes: Int,
    val dietaryPreference: String,
    val dailyCalorieTarget: Int,
    val dailyProteinTargetGrams: Int,
    val dailyCarbsTargetGrams: Int,
    val dailyFatTargetGrams: Int,
    val dailyWaterTargetLiters: Double,
    val dailyStepTarget: Int,
    val unitSystem: String,
    val isPremium: Boolean,
    val level: Int,
    val currentXp: Int,
    val nextLevelXp: Int,
    val rankTitle: String,
    val streakDays: Int,
    val createdAt: Long
)

@Entity(tableName = "exercises")
data class ExerciseEntity(
    @PrimaryKey val id: String,
    val name: String,
    val primaryMuscle: String,
    val secondaryMuscles: String,
    val equipment: String,
    val difficulty: String,
    val instructions: String,
    val formCues: String,
    val commonMistakes: String,
    val recommendedSets: Int,
    val recommendedReps: String,
    val restSeconds: Int,
    val alternatives: String,
    val mediaUrl: String?,
    val isCustom: Boolean
)

@Entity(tableName = "workout_plans")
data class WorkoutPlanEntity(
    @PrimaryKey val id: String,
    val title: String,
    val subtitle: String,
    val durationMinutes: Int,
    val targetMuscles: String,
    val exercisesJson: String,
    val estimatedCalories: Int,
    val difficulty: String,
    val isAIGenerated: Boolean,
    val isCompletedToday: Boolean
)

@Entity(tableName = "workout_sessions")
data class WorkoutSessionEntity(
    @PrimaryKey val id: String,
    val workoutPlanId: String,
    val workoutTitle: String,
    val startTimeMs: Long,
    val endTimeMs: Long,
    val totalVolumeKg: Double,
    val caloriesBurned: Int,
    val completedExercisesCount: Int,
    val totalSetsCompleted: Int,
    val personalRecordsAchievedJson: String,
    val earnedXp: Int,
    val aiSummary: String
)

@Entity(tableName = "food_items")
data class FoodItemEntity(
    @PrimaryKey val id: String,
    val name: String,
    val servingSize: String,
    val calories: Int,
    val proteinGrams: Double,
    val carbsGrams: Double,
    val fatGrams: Double,
    val fiberGrams: Double,
    val barcode: String?,
    val isFavorite: Boolean
)

@Entity(tableName = "meal_logs")
data class MealLogEntity(
    @PrimaryKey val id: String,
    val epochDay: Long,
    val mealType: String,
    val foodItemId: String,
    val foodName: String,
    val calories: Int,
    val proteinGrams: Double,
    val carbsGrams: Double,
    val fatGrams: Double,
    val servings: Double,
    val timestamp: Long
)

@Entity(tableName = "daily_nutrition_summary")
data class DailyNutritionSummaryEntity(
    @PrimaryKey val epochDay: Long,
    val totalCalories: Int,
    val totalProteinGrams: Double,
    val totalCarbsGrams: Double,
    val totalFatGrams: Double,
    val waterIntakeLiters: Double
)

@Entity(tableName = "progress_metrics")
data class ProgressMetricEntity(
    @PrimaryKey val epochDay: Long,
    val weightKg: Double,
    val bodyFatPercentage: Double?,
    val chestCm: Double?,
    val waistCm: Double?,
    val armsCm: Double?,
    val workoutVolumeKg: Double,
    val dailyCalories: Int,
    val dailySteps: Int
)

@Entity(tableName = "personal_records")
data class PersonalRecordEntity(
    @PrimaryKey val exerciseId: String,
    val exerciseName: String,
    val weightKg: Double,
    val reps: Int,
    val achievedDate: Long
)

@Entity(tableName = "recovery_logs")
data class RecoveryLogEntity(
    @PrimaryKey val epochDay: Long,
    val score: Int,
    val sleepHours: Double,
    val sorenessLevel: Int,
    val stressLevel: Int,
    val energyLevel: Int,
    val insightText: String,
    val readinessStatus: String
)

@Entity(tableName = "achievements")
data class AchievementEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val iconRes: String,
    val isUnlocked: Boolean,
    val unlockedAt: Long?,
    val xpReward: Int
)

@Entity(tableName = "ai_messages")
data class AIMessageEntity(
    @PrimaryKey val id: String,
    val sender: String,
    val text: String,
    val timestamp: Long,
    val actionSuggestionJson: String?
)
