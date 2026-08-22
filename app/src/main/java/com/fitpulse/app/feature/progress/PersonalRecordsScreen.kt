package com.fitpulse.app.feature.progress

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.FitnessCard
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.calculator.FitnessCalculators
import com.fitpulse.app.core.domain.model.PersonalRecord

@Composable
fun PersonalRecordsScreen(
    records: List<PersonalRecord>,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 20.dp)
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
                text = "Personal Records",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        FitnessCard(borderColor = Amber400.copy(alpha = 0.4f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Amber500.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.EmojiEvents, contentDescription = null, tint = Amber400)
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("HALL OF STRENGTH", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp), color = Amber400)
                    Text("Automatic PR Detection & 1RM Calculations", style = MaterialTheme.typography.bodySmall, color = TextSecondaryDark)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(records) { record ->
                val estimated1RM = FitnessCalculators.calculateOneRepMax(record.weightKg, record.reps)

                FitnessCard(
                    backgroundColor = DarkSurface,
                    borderColor = DarkBorder
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = record.exerciseName,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = TextPrimaryDark
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${record.weightKg} kg × ${record.reps} reps",
                                style = MaterialTheme.typography.bodyMedium,
                                color = Emerald400
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "${estimated1RM.toInt()} kg",
                                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                                color = Amber400
                            )
                            Text(
                                text = "Est. 1RM",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                color = TextSecondaryDark
                            )
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}
