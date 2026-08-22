package com.fitpulse.app.feature.auth

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitpulse.app.core.components.*
import com.fitpulse.app.core.designsystem.*
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class AuthStage {
    SPLASH,
    WELCOME,
    ACCOUNT_OPTIONS,
    EMAIL_FLOW
}

@Composable
fun AuthScreen(
    onAuthSuccess: () -> Unit,
    onStartOnboarding: () -> Unit
) {
    var stage by remember { mutableStateOf(AuthStage.SPLASH) }
    var isSignUp by remember { mutableStateOf(true) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    // Smooth Splash Animation Timer
    LaunchedEffect(Unit) {
        delay(1600)
        stage = AuthStage.WELCOME
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BlackBackground)
    ) {
        when (stage) {
            // ==========================================
            // 1. SPLASH / LOGO SCREEN
            // ==========================================
            AuthStage.SPLASH -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    FitPulseLogoWithText(
                        iconSize = 100.dp,
                        animated = true,
                        tagline = "MEN & WOMEN FITNESS"
                    )
                }
            }

            // ==========================================
            // 2. WELCOME SCREEN
            // ==========================================
            AuthStage.WELCOME -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp)
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Spacer(modifier = Modifier.height(20.dp))

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        // Clean Brand Icon
                        FitPulseLogoIcon(
                            size = 80.dp,
                            animated = true,
                            showGlow = true
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Text(
                            text = "Your Stronger Self\nStarts Here",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 30.sp,
                                lineHeight = 36.sp,
                                textAlign = TextAlign.Center
                            ),
                            color = TextPrimaryDark
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = "Personalized workouts, smarter goals, and real progress — all in one place.",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontSize = 14.sp,
                                lineHeight = 20.sp,
                                textAlign = TextAlign.Center
                            ),
                            color = TextSecondaryDark,
                            modifier = Modifier.padding(horizontal = 12.dp)
                        )

                        Spacer(modifier = Modifier.height(30.dp))

                        // Gender Inclusion Badge
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(DarkSurfaceVariant)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(20.dp))
                                .padding(horizontal = 16.dp, vertical = 8.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("♂ ♀", color = PurpleAccent, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Designed for Both Men & Women",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                    color = TextPrimaryDark
                                )
                            }
                        }
                    }

                    // Welcome Actions
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Get Started (Primary Purple Gradient)
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(
                                    Brush.horizontalGradient(
                                        listOf(PurplePrimary, PurpleSecondary)
                                    )
                                )
                                .clickable {
                                    isSignUp = true
                                    stage = AuthStage.ACCOUNT_OPTIONS
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "Get Started",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    fontSize = 16.sp
                                ),
                                color = TextPrimaryDark
                            )
                        }

                        // Continue with Google
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(DarkSurface)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                                .clickable {
                                    isLoading = true
                                    FirebaseAuth.getInstance().signInAnonymously()
                                        .addOnCompleteListener {
                                            isLoading = false
                                            onStartOnboarding()
                                        }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("G", fontWeight = FontWeight.Black, fontSize = 18.sp, color = TextPrimaryDark)
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "Continue with Google",
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp
                                    ),
                                    color = TextPrimaryDark
                                )
                            }
                        }

                        // Log In (Secondary Outline)
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(DarkSurfaceVariant)
                                .clickable {
                                    isSignUp = false
                                    stage = AuthStage.EMAIL_FLOW
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "Log In with Email",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                ),
                                color = TextSecondaryDark
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                    }
                }
            }

            // ==========================================
            // 3. ACCOUNT CREATION OPTIONS
            // ==========================================
            AuthStage.ACCOUNT_OPTIONS -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp)
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.clickable { stage = AuthStage.WELCOME }
                        ) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Back", color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(28.dp))

                        Text(
                            text = "Create Your Account",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )

                        Text(
                            text = "Join millions achieving their fitness potential worldwide.",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )

                        Spacer(modifier = Modifier.height(32.dp))

                        // Continue with Email
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(
                                    Brush.horizontalGradient(
                                        listOf(PurplePrimary, PurpleSecondary)
                                    )
                                )
                                .clickable { stage = AuthStage.EMAIL_FLOW },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Email, contentDescription = null, tint = TextPrimaryDark, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(10.dp))
                                Text("Continue with Email", fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Continue with Google (Anonymous Firebase Auth)
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(DarkSurface)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                                .clickable {
                                    isLoading = true
                                    FirebaseAuth.getInstance().signInAnonymously()
                                        .addOnCompleteListener {
                                            isLoading = false
                                            onStartOnboarding()
                                        }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("G", fontWeight = FontWeight.Black, fontSize = 18.sp, color = TextPrimaryDark)
                                Spacer(modifier = Modifier.width(10.dp))
                                Text("Continue with Google / Guest", fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Continue with Apple
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(DarkSurface)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(16.dp))
                                .clickable {
                                    onStartOnboarding()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("", fontWeight = FontWeight.Black, fontSize = 20.sp, color = TextPrimaryDark)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Continue with Apple", fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.padding(bottom = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Already have an account? ", color = TextSecondaryDark, fontSize = 13.sp)
                        Text(
                            text = "Log In",
                            color = PurpleAccent,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            modifier = Modifier.clickable {
                                isSignUp = false
                                stage = AuthStage.EMAIL_FLOW
                            }
                        )
                    }
                }
            }

            // ==========================================
            // 4. EMAIL AUTH FLOW
            // ==========================================
            AuthStage.EMAIL_FLOW -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp)
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.clickable { stage = AuthStage.WELCOME }
                        ) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Back", color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Text(
                            text = if (isSignUp) "Create Account" else "Welcome Back",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TextPrimaryDark
                        )

                        Text(
                            text = if (isSignUp) "Enter your email & create a secure password" else "Sign in with your email to continue",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondaryDark
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        // Email Input
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it; errorMessage = null },
                            label = { Text("Email Address", color = TextSecondaryDark) },
                            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null, tint = PurpleAccent) },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = PurplePrimary,
                                unfocusedBorderColor = DarkBorderSubtle,
                                focusedTextColor = TextPrimaryDark,
                                unfocusedTextColor = TextPrimaryDark,
                                focusedContainerColor = DarkSurface,
                                unfocusedContainerColor = DarkSurface
                            ),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Password Input
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it; errorMessage = null },
                            label = { Text("Password", color = TextSecondaryDark) },
                            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = PurpleAccent) },
                            trailingIcon = {
                                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                    Icon(
                                        imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                        contentDescription = null,
                                        tint = TextSecondaryDark
                                    )
                                }
                            },
                            singleLine = true,
                            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = PurplePrimary,
                                unfocusedBorderColor = DarkBorderSubtle,
                                focusedTextColor = TextPrimaryDark,
                                unfocusedTextColor = TextPrimaryDark,
                                focusedContainerColor = DarkSurface,
                                unfocusedContainerColor = DarkSurface
                            ),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth()
                        )

                        if (isSignUp) {
                            Spacer(modifier = Modifier.height(14.dp))

                            // Confirm Password
                            OutlinedTextField(
                                value = confirmPassword,
                                onValueChange = { confirmPassword = it; errorMessage = null },
                                label = { Text("Confirm Password", color = TextSecondaryDark) },
                                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = PurpleAccent) },
                                singleLine = true,
                                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = PurplePrimary,
                                    unfocusedBorderColor = DarkBorderSubtle,
                                    focusedTextColor = TextPrimaryDark,
                                    unfocusedTextColor = TextPrimaryDark,
                                    focusedContainerColor = DarkSurface,
                                    unfocusedContainerColor = DarkSurface
                                ),
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        if (errorMessage != null) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = errorMessage!!,
                                color = Rose500,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(horizontal = 4.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Submit Button
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(
                                    Brush.horizontalGradient(
                                        listOf(PurplePrimary, PurpleSecondary)
                                    )
                                )
                                .clickable {
                                    if (email.isBlank() || password.isBlank()) {
                                        errorMessage = "Please enter email and password"
                                        return@clickable
                                    }
                                    if (isSignUp && password != confirmPassword) {
                                        errorMessage = "Passwords do not match"
                                        return@clickable
                                    }

                                    isLoading = true
                                    errorMessage = null
                                    scope.launch {
                                        try {
                                            val auth = FirebaseAuth.getInstance()
                                            if (isSignUp) {
                                                auth.createUserWithEmailAndPassword(email.trim(), password)
                                                    .addOnCompleteListener { task ->
                                                        isLoading = false
                                                        if (task.isSuccessful) {
                                                            onStartOnboarding()
                                                        } else {
                                                            val err = task.exception?.localizedMessage ?: "Authentication failed"
                                                            errorMessage = "$err. (Tap below to continue in Offline Mode if testing without internet)"
                                                        }
                                                    }
                                            } else {
                                                auth.signInWithEmailAndPassword(email.trim(), password)
                                                    .addOnCompleteListener { task ->
                                                        isLoading = false
                                                        if (task.isSuccessful) {
                                                            onAuthSuccess()
                                                        } else {
                                                            val err = task.exception?.localizedMessage ?: "Login failed"
                                                            errorMessage = "$err. (Tap below to continue in Offline Mode if testing without internet)"
                                                        }
                                                    }
                                            }
                                        } catch (e: Exception) {
                                            isLoading = false
                                            errorMessage = e.localizedMessage ?: "Firebase error. You can continue in Offline Mode."
                                        }
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            if (isLoading) {
                                CircularProgressIndicator(color = TextPrimaryDark, modifier = Modifier.size(24.dp))
                            } else {
                                Text(
                                    text = if (isSignUp) "Create Account" else "Log In",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                                    color = TextPrimaryDark
                                )
                            }
                        }

                        if (errorMessage != null) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(DarkSurfaceVariant)
                                    .clickable {
                                        if (isSignUp) onStartOnboarding() else onAuthSuccess()
                                    }
                                    .padding(12.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "⚡ Continue in Offline / Guest Mode",
                                    color = PurpleAccent,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        // Continue with Google Button
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(DarkSurface)
                                .border(1.dp, DarkBorderSubtle, RoundedCornerShape(14.dp))
                                .clickable {
                                    isLoading = true
                                    FirebaseAuth.getInstance().signInAnonymously()
                                        .addOnCompleteListener {
                                            isLoading = false
                                            if (isSignUp) onStartOnboarding() else onAuthSuccess()
                                        }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("G", fontWeight = FontWeight.Black, fontSize = 16.sp, color = TextPrimaryDark)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Continue with Google / Guest",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = TextPrimaryDark
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.padding(bottom = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isSignUp) "Already have an account? " else "Don't have an account? ",
                            color = TextSecondaryDark,
                            fontSize = 13.sp
                        )
                        Text(
                            text = if (isSignUp) "Log In" else "Sign Up",
                            color = PurpleAccent,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            modifier = Modifier.clickable {
                                isSignUp = !isSignUp
                                errorMessage = null
                            }
                        )
                    }
                }
            }
        }
    }
}
