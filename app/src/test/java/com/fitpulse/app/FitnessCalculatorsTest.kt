package com.fitpulse.app

import com.fitpulse.app.core.domain.calculator.FitnessCalculators
import com.fitpulse.app.core.domain.model.FitnessGoal
import com.fitpulse.app.core.domain.model.Gender
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class FitnessCalculatorsTest {

    @Test
    fun testBmrCalculation_Male() {
        // Mifflin-St Jeor: 10 * 80kg + 6.25 * 180cm - 5 * 25 + 5 = 800 + 1125 - 125 + 5 = 1805
        val bmr = FitnessCalculators.calculateBmr(
            weightKg = 80.0,
            heightCm = 180.0,
            age = 25,
            gender = Gender.MALE
        )
        assertEquals(1805.0, bmr, 0.1)
    }

    @Test
    fun testBmrCalculation_Female() {
        // Mifflin-St Jeor: 10 * 60kg + 6.25 * 165cm - 5 * 30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
        val bmr = FitnessCalculators.calculateBmr(
            weightKg = 60.0,
            heightCm = 165.0,
            age = 30,
            gender = Gender.FEMALE
        )
        assertEquals(1320.25, bmr, 0.1)
    }

    @Test
    fun testTdeeAndGoalTargetCalories() {
        val bmr = 1800.0
        // 4 workout days per week -> 1.55 multiplier
        val tdee = FitnessCalculators.calculateTdee(bmr, 4)
        assertEquals(2790.0, tdee, 0.1)

        val muscleGainCals = FitnessCalculators.calculateTargetCalories(tdee, FitnessGoal.MUSCLE_GAIN)
        assertEquals(3140, muscleGainCals)

        val fatLossCals = FitnessCalculators.calculateTargetCalories(tdee, FitnessGoal.FAT_LOSS)
        assertEquals(2290, fatLossCals)
    }

    @Test
    fun testMacroPartitioning() {
        val targetCals = 2800
        val weightKg = 80.0
        val macros = FitnessCalculators.calculateMacroTargets(targetCals, weightKg, FitnessGoal.MUSCLE_GAIN)

        // Muscle gain: 80 * 2.2 = 176g protein (704 kcal)
        assertEquals(176, macros.proteinGrams)
        // Fats: 80 * 0.9 = 72g fats (648 kcal)
        assertEquals(72, macros.fatGrams)
        // Carbs: (2800 - 704 - 648) / 4 = 1448 / 4 = 362g carbs
        assertEquals(362, macros.carbsGrams)
        assertTrue("Hydration target should be realistic", macros.waterLiters in 2.5..4.5)
    }

    @Test
    fun testProgressiveOverloadRecommendation_UnderExertion() {
        // RPE <= 7.0 & hit top reps -> recommend +2.5kg
        val rec = FitnessCalculators.calculateProgressiveOverload(
            previousWeightKg = 80.0,
            previousReps = 10,
            targetRepsMin = 8,
            targetRepsMax = 10,
            rpe = 7.0
        )
        assertEquals(82.5, rec.recommendedWeightKg, 0.01)
        assertTrue(rec.rationale.contains("Increasing working weight"))
    }

    @Test
    fun testProgressiveOverloadRecommendation_HypertrophySweetSpot() {
        // In rep window with RPE 8.0 -> progress reps at same weight
        val rec = FitnessCalculators.calculateProgressiveOverload(
            previousWeightKg = 80.0,
            previousReps = 8,
            targetRepsMin = 8,
            targetRepsMax = 10,
            rpe = 8.0
        )
        assertEquals(80.0, rec.recommendedWeightKg, 0.01)
        assertEquals("9", rec.recommendedReps)
    }

    @Test
    fun testOneRepMaxCalculation() {
        // 100kg x 10 reps -> Epley: 100 * (1 + 10/30) = 133.33, Brzycki: 100 * 36/27 = 133.33 -> avg ~133.3
        val orm = FitnessCalculators.calculateOneRepMax(100.0, 10)
        assertEquals(133.3, orm, 0.2)
    }

    @Test
    fun testRecoveryScoreCalculation() {
        val recovery = FitnessCalculators.calculateRecoveryScore(
            sleepHours = 8.0,
            sorenessLevel = 1,
            stressLevel = 1,
            energyLevel = 5
        )
        // 40 (sleep) + 20 (soreness) + 20 (stress) + 20 (energy) = 100
        assertEquals(100, recovery.score)
        assertEquals("Prime for PRs", recovery.readinessStatus)
    }

    @Test
    fun testGamificationLevelCurves() {
        // Level = floor(sqrt(XP / 50)) + 1
        assertEquals(1, FitnessCalculators.calculateLevel(0))
        assertEquals(2, FitnessCalculators.calculateLevel(50))
        assertEquals(11, FitnessCalculators.calculateLevel(5000))
        assertEquals("IRON BUILDER", FitnessCalculators.getRankTitle(12))
        assertEquals("APEX ATHLETE", FitnessCalculators.getRankTitle(18))
        assertEquals("TITAN OF IRON", FitnessCalculators.getRankTitle(25))
    }

    @Test
    fun testStepCalculations() {
        // 10,000 steps with height 175cm: stride = 0.7245m -> ~7.25 km
        val distance = FitnessCalculators.calculateStepDistanceKm(10000, 175.0)
        assertEquals(7.25, distance, 0.05)

        // 10,000 steps with 75kg weight: 10000 * 0.04 * (75/70) ≈ 429 kcal
        val calories = FitnessCalculators.calculateStepCalories(10000, 75.0)
        assertEquals(429, calories)

        // 10,000 steps at ~105 steps/min -> 95 minutes
        val activeMins = FitnessCalculators.calculateActiveMinutes(10000)
        assertEquals(95, activeMins)
    }
}
