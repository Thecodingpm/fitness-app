package com.fitpulse.app.core.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.fitpulse.app.core.data.local.dao.*
import com.fitpulse.app.core.data.local.entities.*

@Database(
    entities = [
        UserEntity::class,
        ExerciseEntity::class,
        WorkoutPlanEntity::class,
        WorkoutSessionEntity::class,
        FoodItemEntity::class,
        MealLogEntity::class,
        DailyNutritionSummaryEntity::class,
        ProgressMetricEntity::class,
        PersonalRecordEntity::class,
        RecoveryLogEntity::class,
        AchievementEntity::class,
        AIMessageEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class FitPulseDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun exerciseDao(): ExerciseDao
    abstract fun workoutDao(): WorkoutDao
    abstract fun nutritionDao(): NutritionDao
    abstract fun progressDao(): ProgressDao
    abstract fun recoveryDao(): RecoveryDao
    abstract fun gamificationDao(): GamificationDao
    abstract fun aiMessageDao(): AIMessageDao

    companion object {
        @Volatile
        private var INSTANCE: FitPulseDatabase? = null

        fun getDatabase(context: Context): FitPulseDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    FitPulseDatabase::class.java,
                    "fitpulse_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
