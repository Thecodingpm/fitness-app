package com.fitpulse.app.feature.nutrition

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.FitnessCard
import com.fitpulse.app.core.components.PrimaryButton
import com.fitpulse.app.core.components.SecondaryButton
import com.fitpulse.app.core.designsystem.*

@Composable
fun AIMealPlannerScreen(
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.size(36.dp)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextSecondaryDark)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "AI Macro Meal Plan",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        FitnessCard(borderColor = Violet500.copy(alpha = 0.4f)) {
            Text("TARGET: 2,750 KCAL • 175G PROTEIN", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp), color = Violet400)
            Spacer(modifier = Modifier.height(6.dp))
            Text("Optimized 4-Meal Split for Hypertrophy & Satiety", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Meal 1
        MealPlanItemCard(
            title = "Breakfast (7:30 AM)",
            cals = 650,
            protein = 42,
            items = listOf("3 Whole Organic Eggs + 2 Egg Whites Scrambled", "100g Rolled Oats with Blueberries & Cinnamon", "1 cup Unsweetened Almond Milk")
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Meal 2
        MealPlanItemCard(
            title = "Lunch (12:30 PM)",
            cals = 780,
            protein = 52,
            items = listOf("180g Grilled Chicken Breast", "200g Brown Jasmine Rice", "150g Steamed Broccoli with 10ml Olive Oil")
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Meal 3
        MealPlanItemCard(
            title = "Pre/Post Workout Snack (4:30 PM)",
            cals = 420,
            protein = 32,
            items = listOf("1 Scoop Whey Isolate in Water", "1 Large Banana", "30g Raw Almonds")
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Meal 4
        MealPlanItemCard(
            title = "Dinner (8:00 PM)",
            cals = 850,
            protein = 50,
            items = listOf("200g Wild Salmon Fillet", "250g Baked Sweet Potato", "Mixed Green Salad with Avocado & Lemon Vinaigrette")
        )

        Spacer(modifier = Modifier.height(24.dp))

        PrimaryButton(
            text = "Export to Grocery List",
            onClick = onBack,
            icon = Icons.Default.ShoppingCart
        )

        Spacer(modifier = Modifier.height(10.dp))

        SecondaryButton(
            text = "Regenerate Meal Variations",
            onClick = { /* Regenerate action */ },
            icon = Icons.Default.Refresh
        )

        Spacer(modifier = Modifier.height(30.dp))
    }
}

@Composable
private fun MealPlanItemCard(
    title: String,
    cals: Int,
    protein: Int,
    items: List<String>
) {
    FitnessCard(
        backgroundColor = DarkSurface,
        borderColor = DarkBorder
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(title, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = TextPrimaryDark)
            Text("$cals kcal • ${protein}g protein", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold), color = Emerald400)
        }

        Spacer(modifier = Modifier.height(8.dp))

        items.forEach { item ->
            Text("• $item", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark, modifier = Modifier.padding(vertical = 2.dp))
        }
    }
}
