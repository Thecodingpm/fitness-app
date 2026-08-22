package com.fitpulse.app.core.designsystem

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = PurplePrimary,
    onPrimary = TextPrimaryDark,
    primaryContainer = PurpleDark,
    onPrimaryContainer = PurpleAccent,
    secondary = PurpleLight,
    onSecondary = BlackBackground,
    secondaryContainer = DarkSurfaceElevated,
    onSecondaryContainer = PurpleAccent,
    tertiary = PurpleAccent,
    onTertiary = BlackBackground,
    background = BlackBackground,
    onBackground = TextPrimaryDark,
    surface = DarkSurface,
    onSurface = TextPrimaryDark,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = TextSecondaryDark,
    outline = DarkBorder,
    outlineVariant = DarkBorderSubtle,
    error = Rose500,
    onError = TextPrimaryDark
)

private val LightColorScheme = lightColorScheme(
    primary = PurplePrimary,
    onPrimary = TextPrimaryDark,
    primaryContainer = PurpleLight,
    onPrimaryContainer = PurpleDark,
    secondary = PurpleSecondary,
    onSecondary = TextPrimaryDark,
    secondaryContainer = LightSurfaceVariant,
    onSecondaryContainer = PurpleDark,
    tertiary = PurpleAccent,
    onTertiary = TextPrimaryDark,
    background = LightBackground,
    onBackground = TextPrimaryLight,
    surface = LightSurface,
    onSurface = TextPrimaryLight,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = TextSecondaryLight,
    outline = LightBorder,
    outlineVariant = LightBorder,
    error = Rose500,
    onError = TextPrimaryDark
)

@Composable
fun FitPulseTheme(
    darkTheme: Boolean = true, // Default to sleek dark mode
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = !darkTheme
                isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    CompositionLocalProvider(
        LocalFitPulseSpacing provides FitPulseSpacing()
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = FitPulseTypography,
            shapes = FitPulseShapes,
            content = content
        )
    }
}
