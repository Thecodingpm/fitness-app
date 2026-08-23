package com.fitpulse.app.core.designsystem

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// =========================================================================
// Pure Obsidian Black, Crisp White, & Platinum Grey Luxury Design System
// =========================================================================

// Backgrounds (AMOLED Black & Obsidian Charcoal)
val BlackBackground = Color(0xFF000000)
val DarkBackground = Color(0xFF0A0A0A)
val DarkSurface = Color(0xFF141414)
val DarkSurfaceVariant = Color(0xFF1C1C1E)
val DarkSurfaceElevated = Color(0xFF282828)
val DarkBorder = Color(0xFF2E2E32)
val DarkBorderSubtle = Color(0xFF1C1C1E)

// Monochrome Brand Palette (Crisp White & Silver Greys)
val PurpleDark = Color(0xFFFFFFFF)
val PurplePrimary = Color(0xFFFFFFFF)
val PurpleSecondary = Color(0xFFE4E4E7)
val PurpleLight = Color(0xFFD4D4D8)
val PurpleAccent = Color(0xFFFFFFFF)
val PurpleGlow = Color(0x33FFFFFF)
val PurpleSubtleGlow = Color(0x1AFFFFFF)

// Primary Text & Accents
val TextPrimaryDark = Color(0xFFFFFFFF)
val TextSecondaryDark = Color(0xFFA1A1AA)
val TextTertiaryDark = Color(0xFF71717A)

// Functional Badges (High Contrast Monochrome & Subtle Accents)
val EmeraldSuccess = Color(0xFFFFFFFF)
val Emerald500 = Color(0xFF10B981)
val Emerald400 = Color(0xFF34D399)
val EmeraldGlow = Color(0x3310B981)

val AmberWarning = Color(0xFFFF9800)
val AmberOrange = Color(0xFFFFFFFF)
val AmberOrangeGlow = Color(0x33FFFFFF)
val Amber500 = Color(0xFFFF8A00)
val Amber400 = Color(0xFFFF9800)

val CyanAccent = Color(0xFFFFFFFF)
val Teal500 = Color(0xFFE4E4E7)
val Teal400 = Color(0xFFD4D4D8)
val Violet500 = Color(0xFFFFFFFF)
val Violet400 = Color(0xFFE4E4E7)

val Rose500 = Color(0xFFEF4444)
val Rose400 = Color(0xFFF87171)
val ElectricLime = Color(0xFFFFFFFF)
val ElectricLimeDark = Color(0xFFE4E4E7)

// Light Theme Fallbacks
val LightBackground = Color(0xFFF4F4F5)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFE4E4E7)
val LightSurfaceElevated = Color(0xFFD4D4D8)
val LightBorder = Color(0xFFD4D4D8)
val LightBorderSubtle = Color(0xFFE4E4E7)
val TextPrimaryLight = Color(0xFF09090B)
val TextSecondaryLight = Color(0xFF71717A)

// Brand Gradients (Luxury Monochrome)
val PrimaryGradient = Brush.horizontalGradient(
    colors = listOf(Color(0xFFFFFFFF), Color(0xFFE4E4E7))
)

val PurpleBrandGradient = Brush.horizontalGradient(
    colors = listOf(Color(0xFFFFFFFF), Color(0xFFE4E4E7))
)

val HeroCardGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFF222225), Color(0xFF111113))
)

val PurpleGlowGradient = Brush.verticalGradient(
    colors = listOf(Color(0x33FFFFFF), Color.Transparent)
)

val CardGlowGradient = Brush.verticalGradient(
    colors = listOf(DarkSurfaceVariant, DarkSurface)
)

val WelcomeHeroGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFF1E1E22), DarkBackground)
)
