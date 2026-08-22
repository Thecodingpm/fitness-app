package com.fitpulse.app.core.data.billing

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

enum class SubscriptionPlan(val sku: String, val title: String, val priceFormatted: String, val period: String) {
    MONTHLY("fitpulse_pro_monthly", "FitPulse Pro Monthly", "$9.99", "/month"),
    ANNUAL("fitpulse_pro_annual", "FitPulse Pro Annual", "$69.99", "/year (Save 42%)")
}

data class BillingState(
    val isPremium: Boolean = true,
    val activeSku: String? = "fitpulse_pro_annual",
    val isTrialActive: Boolean = false,
    val trialDaysRemaining: Int = 7,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class BillingManager {
    private val _billingState = MutableStateFlow(BillingState())
    val billingState: StateFlow<BillingState> = _billingState.asStateFlow()

    fun purchaseSubscription(plan: SubscriptionPlan) {
        _billingState.value = _billingState.value.copy(
            isPremium = true,
            activeSku = plan.sku,
            errorMessage = null
        )
    }

    fun restorePurchases() {
        _billingState.value = _billingState.value.copy(
            isPremium = true,
            errorMessage = null
        )
    }
}
