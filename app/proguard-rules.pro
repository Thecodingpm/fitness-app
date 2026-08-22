# FitPulse ProGuard & R8 Configuration

# Retain Coroutines & Room
-keepclassmembers class * extends androidx.room.RoomDatabase {
    <init>();
}
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# Retain Domain Models for serialization
-keep class com.fitpulse.app.core.domain.model.** { *; }
-keep class com.fitpulse.app.core.data.local.entities.** { *; }

# Google Play Billing
-keep class com.android.billingclient.api.** { *; }

# Health Connect
-keep class androidx.health.connect.client.** { *; }

# Compose Animation and Layout optimizations
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}
