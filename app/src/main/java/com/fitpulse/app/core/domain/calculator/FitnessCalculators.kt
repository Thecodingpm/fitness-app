package com.fitpulse.app.core.domain.calculator

import com.fitpulse.app.core.domain.model.FitnessGoal
import com.fitpulse.app.core.domain.model.Gender
import com.fitpulse.app.core.domain.model.RecoveryMetrics
import kotlin.math.roundToInt
import kotlin.math.sqrt

object FitnessCalculators {

    /**
     * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
     * Men: BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age) + 5
     * Women: BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age) - 161
     */
    fun calculateBmr(
        weightKg: Double,
        heightCm: Double,
        age: Int,
        gender: Gender
    ): Double {
        val base = (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age)
        return when (gender) {
            Gender.MALE -> base + 5.0
            Gender.FEMALE -> base - 161.0
            Gender.OTHER -> base - 78.0 // Neutral midpoint
        }
    }

    /**
     * Calculates Total Daily Energy Expenditure (TDEE) based on activity level.
     * daysPerWeek: [0..7]
     */
    fun calculateTdee(
        bmr: Double,
        daysPerWeek: Int
    ): Double {
        val activityMultiplier = when {
            daysPerWeek <= 1 -> 1.2    // Sedentary
            daysPerWeek in 2..3 -> 1.375 // Lightly active
            daysPerWeek in 4..5 -> 1.55  // Moderately active
            daysPerWeek == 6 -> 1.725   // Very active
            else -> 1.9                 // Extremely active
        }
        return bmr * activityMultiplier
    }

    /**
     * Computes daily target calories based on user fitness goal.
     */
    fun calculateTargetCalories(
        tdee: Double,
        goal: FitnessGoal
    ): Int {
        val target = when (goal) {
            FitnessGoal.WEIGHT_LOSS, FitnessGoal.FAT_LOSS -> tdee - 500.0      // Sustainable caloric deficit
            FitnessGoal.WEIGHT_GAIN, FitnessGoal.BUILD_MUSCLE, FitnessGoal.MUSCLE_GAIN -> tdee + 350.0   // Controlled hyper-caloric surplus
            FitnessGoal.GET_STRONGER, FitnessGoal.STRENGTH -> tdee + 200.0      // Modest surplus for neuromuscular recovery
            FitnessGoal.IMPROVE_FITNESS, FitnessGoal.GENERAL_FITNESS, FitnessGoal.ENDURANCE -> tdee
            FitnessGoal.IMPROVE_FLEXIBILITY, FitnessGoal.STAY_HEALTHY, FitnessGoal.MAINTENANCE -> tdee
        }
        // Safety bounds: Never advise below 1200 kcal for safety
        return target.coerceAtLeast(1300.0).roundToInt()
    }

    /**
     * Partitions daily macronutrient targets (Protein, Carbs, Fats).
     */
    data class MacroTargets(
        val calories: Int,
        val proteinGrams: Int,
        val carbsGrams: Int,
        val fatGrams: Int,
        val waterLiters: Double
    )

    fun calculateMacroTargets(
        targetCalories: Int,
        weightKg: Double,
        goal: FitnessGoal
    ): MacroTargets {
        // Protein in grams per kg of bodyweight
        val proteinGramsPerKg = when (goal) {
            FitnessGoal.WEIGHT_LOSS, FitnessGoal.FAT_LOSS -> 2.2    // High protein to spare lean mass in deficit
            FitnessGoal.WEIGHT_GAIN, FitnessGoal.BUILD_MUSCLE, FitnessGoal.MUSCLE_GAIN -> 2.2 // 2.2g/kg for maximum muscle protein synthesis
            FitnessGoal.GET_STRONGER, FitnessGoal.STRENGTH -> 2.0
            FitnessGoal.IMPROVE_FITNESS, FitnessGoal.GENERAL_FITNESS, FitnessGoal.ENDURANCE -> 1.8
            FitnessGoal.IMPROVE_FLEXIBILITY, FitnessGoal.STAY_HEALTHY, FitnessGoal.MAINTENANCE -> 1.8
        }
        val proteinGrams = (weightKg * proteinGramsPerKg).roundToInt()
        val proteinCalories = proteinGrams * 4

        // Fats at 0.9g per kg for optimal hormonal health
        val fatGrams = (weightKg * 0.9).roundToInt().coerceIn(40, 110)
        val fatCalories = fatGrams * 9

        // Remaining calories assigned to complex carbohydrates
        val remainingCalories = (targetCalories - (proteinCalories + fatCalories)).coerceAtLeast(200)
        val carbsGrams = (remainingCalories / 4.0).roundToInt()

        // Optimal hydration target: ~35-40ml per kg of body weight
        val waterLiters = ((weightKg * 0.038 * 10).roundToInt()) / 10.0

        return MacroTargets(
            calories = targetCalories,
            proteinGrams = proteinGrams,
            carbsGrams = carbsGrams,
            fatGrams = fatGrams,
            waterLiters = waterLiters.coerceIn(2.5, 4.5)
        )
    }

    /**
     * Progressive Overload Engine:
     * Suggests next working weight & reps based on previous performance and RPE.
     */
    data class ProgressionRecommendation(
        val recommendedWeightKg: Double,
        val recommendedReps: String,
        val rationale: String
    )

    fun calculateProgressiveOverload(
        previousWeightKg: Double,
        previousReps: Int,
        targetRepsMin: Int,
        targetRepsMax: Int,
        rpe: Double // 1 to 10
    ): ProgressionRecommendation {
        return when {
            // Under-stimulated or effortless (RPE <= 7.0) -> increase weight by +2.5kg or +5kg
            rpe <= 7.0 && previousReps >= targetRepsMax -> {
                val newWeight = previousWeightKg + 2.5
                ProgressionRecommendation(
                    recommendedWeightKg = newWeight,
                    recommendedReps = "$targetRepsMin-$targetRepsMax",
                    rationale = "Target reps hit with low RPE ($rpe). Increasing working weight by +2.5kg to drive adaptation."
                )
            }
            // Sweet spot hypertrophy (RPE 7.5 - 8.5) and hit top of rep range -> increase weight slightly
            previousReps >= targetRepsMax && rpe <= 8.5 -> {
                val newWeight = previousWeightKg + 2.5
                ProgressionRecommendation(
                    recommendedWeightKg = newWeight,
                    recommendedReps = "$targetRepsMin-$targetRepsMax",
                    rationale = "Completed top of rep range ($previousReps reps). Progressing weight +2.5kg."
                )
            }
            // In the target rep window with moderate RPE -> add reps at current weight
            previousReps in targetRepsMin until targetRepsMax && rpe <= 8.5 -> {
                val targetNextReps = previousReps + 1
                ProgressionRecommendation(
                    recommendedWeightKg = previousWeightKg,
                    recommendedReps = "$targetNextReps",
                    rationale = "Solid performance. Aim for +1 rep ($targetNextReps reps) at ${previousWeightKg}kg before increasing load."
                )
            }
            // High fatigue (RPE >= 9.5) or under min reps -> maintain weight and consolidate form
            else -> {
                ProgressionRecommendation(
                    recommendedWeightKg = previousWeightKg,
                    recommendedReps = "$targetRepsMin-$targetRepsMax",
                    rationale = "High exertion (RPE $rpe). Holding weight at ${previousWeightKg}kg to consolidate technical mastery."
                )
            }
        }
    }

    /**
     * Calculates One-Rep Max (1RM) using Epley and Brzycki average formula.
     */
    fun calculateOneRepMax(weightKg: Double, reps: Int): Double {
        if (reps <= 1) return weightKg
        val epley = weightKg * (1.0 + (reps / 30.0))
        val brzycki = weightKg * (36.0 / (37.0 - reps))
        val avg = (epley + brzycki) / 2.0
        return (avg * 10.0).roundToInt() / 10.0
    }

    /**
     * Recovery Score Engine:
     * Calculates 0-100 readiness score based on sleep, soreness, energy, and stress.
     */
    fun calculateRecoveryScore(
        sleepHours: Double,
        sorenessLevel: Int, // 1 (None) .. 5 (Severe)
        stressLevel: Int,   // 1 (Low) .. 5 (Extreme)
        energyLevel: Int    // 1 (Exhausted) .. 5 (Peaking)
    ): RecoveryMetrics {
        // Sleep factor (ideal >= 8.0h) -> 0..40 pts
        val sleepScore = ((sleepHours / 8.0).coerceAtMost(1.0) * 40.0)

        // Soreness factor (1 = 20pts, 5 = 0pts) -> 0..20 pts
        val sorenessScore = (5 - sorenessLevel) * 5.0

        // Stress factor (1 = 20pts, 5 = 0pts) -> 0..20 pts
        val stressScore = (5 - stressLevel) * 5.0

        // Energy factor (1 = 0pts, 5 = 20pts) -> 0..20 pts
        val energyScore = energyLevel * 4.0

        val total = (sleepScore + sorenessScore + stressScore + energyScore).roundToInt().coerceIn(0, 100)

        val (readiness, insight) = when {
            total >= 85 -> Pair("Prime for PRs", "Optimal neuromuscular recovery. You're primed to attack your top sets today!")
            total >= 70 -> Pair("Good to Train", "Solid recovery balance. Ready for your scheduled intensity.")
            total >= 50 -> Pair("Moderate Readiness", "Mild systemic fatigue detected. Focus on precise warmups and strict rest intervals.")
            else -> Pair("Active Recovery Advised", "High fatigue accumulated. Consider reducing working sets or taking an active mobility session.")
        }

        return RecoveryMetrics(
            score = total,
            sleepHours = sleepHours,
            sorenessLevel = sorenessLevel,
            stressLevel = stressLevel,
            energyLevel = energyLevel,
            insightText = insight,
            readinessStatus = readiness
        )
    }

    /**
     * Calculates User Level from total XP: Level = floor(sqrt(XP / 50)) + 1
     */
    fun calculateLevel(totalXp: Int): Int {
        return (sqrt(totalXp / 50.0).toInt() + 1).coerceAtLeast(1)
    }

    fun getXpForNextLevel(currentLevel: Int): Int {
        return (currentLevel * currentLevel) * 50
    }

    fun getRankTitle(level: Int): String {
        return when {
            level >= 25 -> "TITAN OF IRON"
            level >= 18 -> "APEX ATHLETE"
            level >= 12 -> "IRON BUILDER"
            level >= 6 -> "FITNESS DISCIPLINE"
            else -> "NOVICE LIFTER"
        }
    }

    /**
     * Calculates walking distance in kilometers based on stride length estimated from user height.
     * Stride length (male/female average) ≈ heightCm * 0.414.
     */
    fun calculateStepDistanceKm(steps: Int, heightCm: Double = 175.0): Double {
        val strideMeters = (heightCm * 0.414) / 100.0
        val distanceKm = (steps * strideMeters) / 1000.0
        return ((distanceKm * 100.0).roundToInt()) / 100.0
    }

    /**
     * Estimates active calories burned based on step count and body weight.
     * Average walking burn is ~0.04 kcal/step for a 70kg individual, scaled proportionally with weight.
     */
    fun calculateStepCalories(steps: Int, weightKg: Double = 75.0): Int {
        val baseKcalPerStep = 0.04 * (weightKg / 70.0)
        return (steps * baseKcalPerStep).roundToInt()
    }

    /**
     * Calculates active walking minutes assuming moderate cadence of ~105 steps/minute.
     */
    fun calculateActiveMinutes(steps: Int): Int {
        return (steps / 105.0).roundToInt()
    }
}
