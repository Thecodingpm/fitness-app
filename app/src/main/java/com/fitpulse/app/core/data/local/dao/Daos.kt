package com.fitpulse.app.core.data.local.dao

import androidx.room.*
import com.fitpulse.app.core.data.local.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Query("SELECT * FROM users LIMIT 1")
    fun getUser(): Flow<UserEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    @Query("UPDATE users SET weightKg = :newWeight WHERE id = :userId")
    suspend fun updateWeight(userId: String, newWeight: Double)

    @Query("UPDATE users SET currentXp = currentXp + :earnedXp, level = :newLevel, rankTitle = :newRank, streakDays = CASE WHEN :incrementStreak THEN streakDays + 1 ELSE streakDays END WHERE id = :userId")
    suspend fun updateGamification(userId: String, earnedXp: Int, newLevel: Int, newRank: String, incrementStreak: Boolean)
}

@Dao
interface ExerciseDao {
    @Query("SELECT * FROM exercises")
    fun getAllExercises(): Flow<List<ExerciseEntity>>

    @Query("SELECT * FROM exercises WHERE id = :id")
    suspend fun getExerciseById(id: String): ExerciseEntity?

    @Query("SELECT * FROM exercises WHERE primaryMuscle = :muscle")
    fun getExercisesByMuscle(muscle: String): Flow<List<ExerciseEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(exercises: List<ExerciseEntity>)
}

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workout_plans")
    fun getAllWorkoutPlans(): Flow<List<WorkoutPlanEntity>>

    @Query("SELECT * FROM workout_plans LIMIT 1")
    fun getTodaysWorkout(): Flow<WorkoutPlanEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkoutPlan(plan: WorkoutPlanEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: WorkoutSessionEntity)

    @Query("SELECT * FROM workout_sessions ORDER BY startTimeMs DESC")
    fun getSessions(): Flow<List<WorkoutSessionEntity>>
}

@Dao
interface NutritionDao {
    @Query("SELECT * FROM food_items WHERE name LIKE '%' || :query || '%'")
    fun searchFood(query: String): Flow<List<FoodItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFoodItems(foods: List<FoodItemEntity>)

    @Query("SELECT * FROM meal_logs WHERE epochDay = :epochDay ORDER BY timestamp ASC")
    fun getMealLogsForDay(epochDay: Long): Flow<List<MealLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMealLog(log: MealLogEntity)

    @Query("DELETE FROM meal_logs WHERE id = :id")
    suspend fun deleteMealLog(id: String)

    @Query("SELECT * FROM daily_nutrition_summary WHERE epochDay = :epochDay")
    fun getDailySummary(epochDay: Long): Flow<DailyNutritionSummaryEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateSummary(summary: DailyNutritionSummaryEntity)
}

@Dao
interface ProgressDao {
    @Query("SELECT * FROM progress_metrics ORDER BY epochDay ASC")
    fun getProgressMetrics(): Flow<List<ProgressMetricEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProgressMetric(metric: ProgressMetricEntity)

    @Query("SELECT * FROM personal_records ORDER BY achievedDate DESC")
    fun getPersonalRecords(): Flow<List<PersonalRecordEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPersonalRecord(record: PersonalRecordEntity)
}

@Dao
interface RecoveryDao {
    @Query("SELECT * FROM recovery_logs ORDER BY epochDay DESC LIMIT 1")
    fun getLatestRecovery(): Flow<RecoveryLogEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecovery(log: RecoveryLogEntity)
}

@Dao
interface GamificationDao {
    @Query("SELECT * FROM achievements")
    fun getAchievements(): Flow<List<AchievementEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAchievements(achievements: List<AchievementEntity>)

    @Query("UPDATE achievements SET isUnlocked = 1, unlockedAt = :unlockedAt WHERE id = :id")
    suspend fun unlockAchievement(id: String, unlockedAt: Long)
}

@Dao
interface AIMessageDao {
    @Query("SELECT * FROM ai_messages ORDER BY timestamp ASC")
    fun getMessages(): Flow<List<AIMessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: AIMessageEntity)
}
