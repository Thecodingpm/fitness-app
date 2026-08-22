package com.fitpulse.app

import android.app.Application
import com.google.firebase.FirebaseApp

class FitPulseApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        try {
            FirebaseApp.initializeApp(this)
        } catch (e: Exception) {
            // Firebase initialized by ContentProvider or error caught
        }
    }
}
