package com.fitpulse.app.core.domain.model

import java.time.LocalDate
import java.util.UUID

data class HourlyStepBucket(
    val hour: Int, // 0..23
    val steps: Int
)

data class StepDaySummary(
    val date: String,
    val dayOfWeek: String,
    val steps: Int,
    val targetSteps: Int,
    val distanceKm: Double,
    val caloriesBurned: Int,
    val activeMinutes: Int
)

data class StepTrackerData(
    val id: String = UUID.randomUUID().toString(),
    val date: String = LocalDate.now().toString(),
    val currentSteps: Int = 8420,
    val targetSteps: Int = 10000,
    val distanceKm: Double = 6.4,
    val caloriesBurned: Int = 345,
    val activeMinutes: Int = 78,
    val hourlyBreakdown: List<HourlyStepBucket> = emptyList(),
    val weeklyHistory: List<StepDaySummary> = emptyList(),
    val streakDays: Int = 14,
    val isSensorConnected: Boolean = true
)
