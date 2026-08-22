package com.fitpulse.app.core.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.designsystem.*

data class ChartDataPoint(
    val label: String,
    val value: Float,
    val secondaryValue: Float? = null
)

@Composable
fun InteractiveBezierChart(
    dataPoints: List<ChartDataPoint>,
    modifier: Modifier = Modifier,
    lineColor: Color = Emerald400,
    fillGradientColors: List<Color> = listOf(Emerald400.copy(alpha = 0.35f), Color.Transparent),
    unit: String = "kg"
) {
    if (dataPoints.isEmpty()) return

    var selectedIndex by remember { mutableStateOf<Int?>(null) }

    val minValue = remember(dataPoints) { dataPoints.minOf { it.value } * 0.95f }
    val maxValue = remember(dataPoints) { dataPoints.maxOf { it.value } * 1.05f }
    val valueRange = remember(minValue, maxValue) { (maxValue - minValue).coerceAtLeast(1f) }

    Column(modifier = modifier) {
        // Selected Value Tooltip Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            val point = selectedIndex?.let { dataPoints.getOrNull(it) } ?: dataPoints.last()
            Text(
                text = "${point.label}: ${"%.1f".format(point.value)} $unit",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                ),
                color = Emerald400
            )
            Text(
                text = "Tap point to inspect",
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                color = TextTertiaryDark
            )
        }

        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .clip(RoundedCornerShape(12.dp))
                .pointerInput(dataPoints) {
                    detectTapGestures { offset ->
                        val stepX = size.width / (dataPoints.size - 1).coerceAtLeast(1)
                        val index = (offset.x / stepX).toInt().coerceIn(0, dataPoints.size - 1)
                        selectedIndex = index
                    }
                }
        ) {
            val width = size.width
            val height = size.height
            val stepX = width / (dataPoints.size - 1).coerceAtLeast(1)

            val points = dataPoints.mapIndexed { index, dataPoint ->
                val x = index * stepX
                val normalizedY = (dataPoint.value - minValue) / valueRange
                val y = height - (normalizedY * (height * 0.8f) + (height * 0.1f))
                Offset(x, y)
            }

            // Draw Background Grid Lines
            val gridLines = 4
            for (i in 0..gridLines) {
                val gridY = (height / gridLines) * i
                drawLine(
                    color = DarkBorderSubtle,
                    start = Offset(0f, gridY),
                    end = Offset(width, gridY),
                    strokeWidth = 1.dp.toPx()
                )
            }

            // Smooth Bezier Curve Path
            val path = Path()
            val fillPath = Path()

            if (points.isNotEmpty()) {
                path.moveTo(points.first().x, points.first().y)
                fillPath.moveTo(points.first().x, height)
                fillPath.lineTo(points.first().x, points.first().y)

                for (i in 0 until points.size - 1) {
                    val p0 = points[i]
                    val p1 = points[i + 1]
                    val controlX = (p0.x + p1.x) / 2f

                    path.cubicTo(
                        controlX, p0.y,
                        controlX, p1.y,
                        p1.x, p1.y
                    )
                    fillPath.cubicTo(
                        controlX, p0.y,
                        controlX, p1.y,
                        p1.x, p1.y
                    )
                }

                fillPath.lineTo(points.last().x, height)
                fillPath.close()

                // Draw Gradient Area Fill
                drawPath(
                    path = fillPath,
                    brush = Brush.verticalGradient(fillGradientColors)
                )

                // Draw Stroke Line
                drawPath(
                    path = path,
                    color = lineColor,
                    style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                )

                // Draw Data Points
                points.forEachIndexed { index, offset ->
                    val isSelected = selectedIndex == index || (selectedIndex == null && index == points.size - 1)
                    val radius = if (isSelected) 6.dp.toPx() else 3.5.dp.toPx()

                    drawCircle(
                        color = if (isSelected) Emerald400 else DarkBorder,
                        radius = radius + 2.dp.toPx(),
                        center = offset
                    )
                    drawCircle(
                        color = if (isSelected) TextPrimaryDark else lineColor,
                        radius = radius,
                        center = offset
                    )
                }
            }
        }
    }
}
