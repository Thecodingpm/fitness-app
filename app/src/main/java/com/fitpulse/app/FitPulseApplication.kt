package com.fitpulse.app

import android.app.Application

class FitPulseApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize global configurations, analytics, and local database singletons
    }
}
