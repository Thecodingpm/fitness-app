package com.fitpulse.app.core.data.sensor

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class StepSensorManager(context: Context? = null) : SensorEventListener {

    private val sensorManager: SensorManager? =
        context?.getSystemService(Context.SENSOR_SERVICE) as? SensorManager

    private val stepCounterSensor: Sensor? =
        sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

    private val stepDetectorSensor: Sensor? =
        sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)

    private val _liveSteps = MutableStateFlow(8420)
    val liveSteps: StateFlow<Int> = _liveSteps.asStateFlow()

    private val _isSensorAvailable = MutableStateFlow(stepCounterSensor != null || stepDetectorSensor != null)
    val isSensorAvailable: StateFlow<Boolean> = _isSensorAvailable.asStateFlow()

    private var initialStepOffset = -1

    fun startListening() {
        if (sensorManager == null) return

        stepCounterSensor?.let { sensor ->
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI)
        } ?: stepDetectorSensor?.let { sensor ->
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI)
        }
    }

    fun stopListening() {
        sensorManager?.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            if (it.sensor.type == Sensor.TYPE_STEP_COUNTER) {
                val totalHardwareSteps = it.values[0].toInt()
                if (initialStepOffset == -1) {
                    initialStepOffset = totalHardwareSteps
                }
                val deltaSteps = (totalHardwareSteps - initialStepOffset).coerceAtLeast(0)
                _liveSteps.value = 8420 + deltaSteps
            } else if (it.sensor.type == Sensor.TYPE_STEP_DETECTOR) {
                if (it.values[0] == 1.0f) {
                    _liveSteps.value += 1
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // No-op for step sensors
    }

    /**
     * Simulation support for emulators and preview testing
     */
    fun simulateSteps(additionalSteps: Int) {
        _liveSteps.value += additionalSteps
    }

    fun resetDailySteps() {
        _liveSteps.value = 0
        initialStepOffset = -1
    }
}
