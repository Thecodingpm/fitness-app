package com.fitpulse.app.core.designsystem

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// =========================================================================
// Pure Obsidian Black, White, & Electric Violet Brand Design System (2026)
// =========================================================================

// Backgrounds (Deep Obsidian Black & Midnight Charcoal)
val BlackBackground = Color(0xFF08070E)
val DarkBackground = Color(0xFF0D0B18)
val DarkSurface = Color(0xFF131022)
val DarkSurfaceVariant = Color(0xFF1B1630)
val DarkSurfaceElevated = Color(0xFF241D40)
val DarkBorder = Color(0xFF2E2652)
val DarkBorderSubtle = Color(0xFF1F1A38)

// Purple & Violet Brand Palette
val PurpleDark = Color(0xFF5B21B6)
val PurplePrimary = Color(0xFF7C3AED)
val PurpleSecondary = Color(0xFF8B5CF6)
val PurpleLight = Color(0xFFA78BFA)
val PurpleAccent = Color(0xFFC4B5FD)
val PurpleGlow = Color(0x407C3AED)
val PurpleSubtleGlow = Color(0x20A78BFA)

// Primary Text & Accents
val TextPrimaryDark = Color(0xFFFFFFFF)
val TextSecondaryDark = Color(0xFF94A3B8)
val TextTertiaryDark = Color(0xFF64748B)

// Functional Badges (Harmonious & Crisp)
val EmeraldSuccess = Color(0xFF10B981)
val Emerald500 = Color(0xFF10B981)
val Emerald400 = Color(0xFF34D399)
val EmeraldGlow = Color(0x3310B981)

val AmberWarning = Color(0xFFFF9800)
val AmberOrange = Color(0xFFFF7A00)
val AmberOrangeGlow = Color(0x4DFF7A00)
val Amber500 = Color(0xFFFF8A00)
val Amber400 = Color(0xFFFF9800)

val CyanAccent = Color(0xFF00E5FF)
val Teal500 = Color(0xFF8B5CF6)
val Teal400 = Color(0xFFC4B5FD)
val Violet500 = PurplePrimary
val Violet400 = PurpleLight

val Rose500 = Color(0xFFF43F5E)
val Rose400 = Color(0xFFFB7185)
val ElectricLime = Color(0xFFD4FF00)
val ElectricLimeDark = Color(0xFFA6CC00)

// Light Theme Fallbacks
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFF3F0FF)
val LightSurfaceElevated = Color(0xFFE2E8F0)
val LightBorder = Color(0xFFDDD6FE)
val LightBorderSubtle = Color(0xFFE2E8F0)
val TextPrimaryLight = Color(0xFF0F172A)
val TextSecondaryLight = Color(0xFF475569)

// Brand Gradients
val PrimaryGradient = Brush.horizontalGradient(
    colors = listOf(PurplePrimary, PurpleSecondary)
)

val PurpleBrandGradient = Brush.horizontalGradient(
    colors = listOf(PurplePrimary, PurpleSecondary)
)

val HeroCardGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFF241A42), Color(0xFF130E26))
)

val PurpleGlowGradient = Brush.verticalGradient(
    colors = listOf(PurplePrimary.copy(alpha = 0.25f), Color.Transparent)
)

val CardGlowGradient = Brush.verticalGradient(
    colors = listOf(DarkSurfaceVariant, DarkSurface)
)

val WelcomeHeroGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFF1F1640), DarkBackground)
)
