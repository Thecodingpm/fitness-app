package com.fitpulse.app.core.data.health

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class HealthSyncState(
    val isConnected: Boolean = true,
    val stepsToday: Int = 8420,
    val activeCaloriesToday: Int = 460,
    val restingHeartRateBpm: Int = 58,
    val sleepDurationHours: Double = 7.8,
    val lastSyncTimestamp: Long = System.currentTimeMillis()
)

class HealthConnectManager {
    private val _syncState = MutableStateFlow(HealthSyncState())
    val syncState: StateFlow<HealthSyncState> = _syncState.asStateFlow()

    fun toggleHealthConnect(enabled: Boolean) {
        _syncState.value = _syncState.value.copy(isConnected = enabled)
    }

    fun syncNow() {
        _syncState.value = _syncState.value.copy(
            lastSyncTimestamp = System.currentTimeMillis()
        )
    }
}
