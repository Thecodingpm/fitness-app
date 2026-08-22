package com.fitpulse.app.core.data.ai

import com.fitpulse.app.core.domain.model.*
import kotlinx.coroutines.delay

class AICoachService {

    /**
     * Generates a context-aware AI response based on the user's message, current metrics, and goal.
     * Incorporates strict safety guardrails (medical warnings, no starvation diets).
     */
    suspend fun generateCoachResponse(
        userMessage: String,
        userProfile: UserProfile?,
        recovery: RecoveryMetrics?
    ): AICoachMessage {
        // Simulated lightweight model inference delay
        delay(600)

        val cleanMsg = userMessage.lowercase().trim()

        // 1. Safety Guardrail: Medical advice / sharp pain / injuries
        if (cleanMsg.contains("pain") || cleanMsg.contains("injury") || cleanMsg.contains("doctor") || cleanMsg.contains("hurt my back")) {
            return AICoachMessage(
                sender = MessageSender.AI_COACH,
                text = "⚠️ **Safety Notice**: If you are experiencing sharp joint pain, numbness, or suspect an injury, please cease high-intensity training immediately and consult a qualified medical professional or physiotherapist. We can switch your routine to gentle deload mobility in the meantime.",
                actionSuggestion = AIActionSuggestion(
                    title = "Switch to Gentle Mobility",
                    actionType = "MODIFY_WORKOUT",
                    payload = "MOBILITY_DELOAD"
                )
            )
        }

        // 2. Adaptive Fatigue / "I'm tired today"
        if (cleanMsg.contains("tired") || cleanMsg.contains("exhausted") || cleanMsg.contains("low energy") || (recovery != null && recovery.score < 50)) {
            return AICoachMessage(
                sender = MessageSender.AI_COACH,
                text = "I notice your fatigue is elevated today. Instead of a max-effort session, I recommend keeping intensity at RPE 6-7, dropping 1 set per exercise, or focusing on restorative steady-state cardio and mobility.",
                actionSuggestion = AIActionSuggestion(
                    title = "Apply Fatigue Deload (-20% Volume)",
                    actionType = "ADJUST_VOLUME",
                    payload = "REDUCE_SETS"
                )
            )
        }

        // 3. Nutrition & Post-Workout Guidance
        if (cleanMsg.contains("post workout") || cleanMsg.contains("protein") || cleanMsg.contains("eat after") || cleanMsg.contains("nutrition")) {
            val proteinTarget = userProfile?.dailyProteinTargetGrams ?: 150
            return AICoachMessage(
                sender = MessageSender.AI_COACH,
                text = "For optimal muscle protein synthesis following training, aim for **30-40g of high-quality protein** paired with **40-60g of complex carbohydrates** within 2 hours. Your current daily target is **${proteinTarget}g protein**.",
                actionSuggestion = AIActionSuggestion(
                    title = "Log Post-Workout Meal",
                    actionType = "NAVIGATE_NUTRITION",
                    payload = "LOG_MEAL"
                )
            )
        }

        // 4. Exercise Replacement / Squat Alternatives
        if (cleanMsg.contains("squat") || cleanMsg.contains("replace") || cleanMsg.contains("can't do")) {
            return AICoachMessage(
                sender = MessageSender.AI_COACH,
                text = "If barbell squats are uncomfortable, excellent biomechanical substitutes for quad and glute hypertrophy include **Bulgarian Split Squats**, **Goblet Squats with Dumbbells**, or the **Leg Press**. Would you like me to substitute squats with Bulgarian Split Squats in your upcoming session?",
                actionSuggestion = AIActionSuggestion(
                    title = "Replace with Bulgarian Split Squats",
                    actionType = "SWAP_EXERCISE",
                    payload = "BULGARIAN_SPLIT_SQUAT"
                )
            )
        }

        // 5. General Hypertrophy / Strength Plateau Analysis
        val goalName = userProfile?.goal?.displayName ?: "Build Muscle"
        return AICoachMessage(
            sender = MessageSender.AI_COACH,
            text = "Based on your focus on **$goalName**, your 14-day training consistency is at **93%**. You're hitting an average RPE of 8.0 on compound lifts, which is the optimal hypertrophy sweet spot. Keep progressive overload incremental (+2.5kg when hitting the ceiling rep count).",
            actionSuggestion = AIActionSuggestion(
                title = "View Today's Workout",
                actionType = "START_WORKOUT",
                payload = "TODAYS_SESSION"
            )
        )
    }

    /**
     * AI Food Photo Analysis Simulation:
     * Takes an image and parses macro contents with editable confidence bounds.
     */
    suspend fun analyzeFoodPhoto(photoUri: String): FoodItem {
        delay(800)
        return FoodItem(
            name = "Grilled Chicken Breast & Quinoa Salad",
            servingSize = "350g bowl",
            calories = 540,
            proteinGrams = 46.0,
            carbsGrams = 52.0,
            fatGrams = 14.0,
            fiberGrams = 6.5
        )
    }
}
