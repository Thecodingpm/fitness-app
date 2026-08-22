package com.fitpulse.app.core.domain.repository

import com.fitpulse.app.core.domain.model.*
import kotlinx.coroutines.flow.Flow

interface FitPulseRepository {
    // User & Profile
    fun getUserProfile(): Flow<UserProfile?>
    suspend fun saveUserProfile(profile: UserProfile)
    suspend fun updateWeight(newWeightKg: Double)
    suspend fun updateGamification(earnedXp: Int, checkInStreak: Boolean)

    // Workout Plans & Exercises
    fun getTodaysWorkout(): Flow<WorkoutPlan?>
    fun getAllWorkoutPlans(): Flow<List<WorkoutPlan>>
    fun getExerciseLibrary(): Flow<List<Exercise>>
    suspend fun getExerciseById(id: String): Exercise?
    suspend fun saveCustomWorkout(plan: WorkoutPlan)
    suspend fun saveWorkoutSession(session: WorkoutSession)
    fun getWorkoutSessions(): Flow<List<WorkoutSession>>

    // Nutrition
    fun getDailyNutrition(epochDay: Long): Flow<DailyNutrition>
    suspend fun logMealItem(entry: MealEntry)
    suspend fun removeMealItem(entryId: String)
    suspend fun updateWaterIntake(litersDelta: Double)
    fun searchFoodDatabase(query: String): Flow<List<FoodItem>>

    // Progress & PRs
    fun getProgressHistory(): Flow<List<ProgressMetric>>
    fun getPersonalRecords(): Flow<List<PersonalRecord>>
    suspend fun savePersonalRecord(record: PersonalRecord)

    // Recovery & Check-In
    fun getRecoveryMetrics(): Flow<RecoveryMetrics>
    suspend fun saveDailyCheckIn(sleepHours: Double, soreness: Int, stress: Int, energy: Int)

    // Gamification & Challenges
    fun getAchievements(): Flow<List<Achievement>>
    fun getActiveChallenges(): Flow<List<Challenge>>

    // AI Coach Chat
    fun getAIConversation(): Flow<List<AICoachMessage>>
    suspend fun sendUserMessageToAI(message: String): AICoachMessage
    suspend fun generateAIWorkout(prompt: String): WorkoutPlan

    // Step Tracker & Activity
    fun getStepTrackerData(): Flow<StepTrackerData>
    suspend fun updateStepGoal(newTarget: Int)
    suspend fun simulateStepWalk(steps: Int)
}
