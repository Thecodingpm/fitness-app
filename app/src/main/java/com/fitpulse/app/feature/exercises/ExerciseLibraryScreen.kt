package com.fitpulse.app.feature.exercises

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.fitpulse.app.core.components.*
import com.fitpulse.app.core.designsystem.*
import com.fitpulse.app.core.domain.model.Exercise
import com.fitpulse.app.core.domain.model.MuscleGroup

@Composable
fun ExerciseLibraryScreen(
    exercises: List<Exercise>,
    onSelectExercise: (Exercise) -> Unit,
    onBack: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedMuscle by remember { mutableStateOf<MuscleGroup?>(null) }

    val filteredExercises = remember(exercises, searchQuery, selectedMuscle) {
        exercises.filter { ex ->
            val matchQuery = searchQuery.isBlank() || ex.name.lowercase().contains(searchQuery.lowercase().trim())
            val matchMuscle = selectedMuscle == null || ex.primaryMuscle == selectedMuscle
            matchQuery && matchMuscle
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
            .padding(horizontal = 20.dp)
    ) {
        Spacer(modifier = Modifier.height(14.dp))

        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(DarkSurfaceVariant)
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                text = "3D Exercise Library",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp
                ),
                color = TextPrimaryDark
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search 3D exercises, equipment...", color = TextTertiaryDark, fontSize = 13.5.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = PurpleAccent) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Close, contentDescription = "Clear", tint = TextSecondaryDark)
                    }
                }
            },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PurplePrimary,
                unfocusedBorderColor = DarkBorderSubtle,
                focusedTextColor = TextPrimaryDark,
                unfocusedTextColor = TextPrimaryDark,
                focusedContainerColor = DarkSurface,
                unfocusedContainerColor = DarkSurface
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Muscle Group Filter Chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            item {
                FilterChip(
                    selected = selectedMuscle == null,
                    onClick = { selectedMuscle = null },
                    label = { Text("All Muscles", fontSize = 11.5.sp, fontWeight = FontWeight.Bold) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = PurplePrimary,
                        selectedLabelColor = Color.White,
                        containerColor = DarkSurface,
                        labelColor = TextSecondaryDark
                    ),
                    shape = RoundedCornerShape(12.dp)
                )
            }
            items(MuscleGroup.values()) { muscle ->
                val isSelected = selectedMuscle == muscle
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedMuscle = if (isSelected) null else muscle },
                    label = { Text(muscle.displayName, fontSize = 11.5.sp, fontWeight = FontWeight.Bold) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = PurplePrimary,
                        selectedLabelColor = Color.White,
                        containerColor = DarkSurface,
                        labelColor = TextSecondaryDark
                    ),
                    shape = RoundedCornerShape(12.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        if (filteredExercises.isEmpty()) {
            EmptyState(
                title = "No Exercises Found",
                description = "Try searching for a different muscle or clear search filter.",
                icon = Icons.Default.FitnessCenter,
                actionText = "Reset Filters",
                onActionClick = {
                    searchQuery = ""
                    selectedMuscle = null
                }
            )
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredExercises) { exercise ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(DarkSurface)
                            .border(1.dp, DarkBorderSubtle, RoundedCornerShape(18.dp))
                            .clickable { onSelectExercise(exercise) }
                            .padding(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            // 3D Animation Mini Preview Thumbnail
                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(DarkSurfaceVariant),
                                contentAlignment = Alignment.Center
                            ) {
                                if (exercise.animationGifUrl != null) {
                                    AsyncImage(
                                        model = exercise.animationGifUrl,
                                        contentDescription = exercise.name,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                } else {
                                    Text("🏋️", fontSize = 22.sp)
                                }
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = exercise.name,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp
                                    ),
                                    color = TextPrimaryDark
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(PurplePrimary.copy(alpha = 0.2f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = exercise.primaryMuscle.displayName,
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp),
                                            color = PurpleAccent
                                        )
                                    }
                                    Text(
                                        text = "•",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = TextTertiaryDark
                                    )
                                    Text(
                                        text = exercise.equipment.displayName,
                                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.5.sp),
                                        color = TextSecondaryDark
                                    )
                                }
                            }

                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = null,
                                tint = TextSecondaryDark,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }
}
