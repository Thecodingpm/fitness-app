# FitPulse AI — Premium Android Fitness Platform

![Android](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Language-Kotlin%202.0-7F52FF?logo=kotlin&logoColor=white)
![Compose](https://img.shields.io/badge/UI-Jetpack%20Compose%20M3-4285F4?logo=jetpackcompose&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20MVVM-FF6F00)
![Room](https://img.shields.io/badge/Database-Room%20(KSP)-009688)

FitPulse AI is a personalized, production-ready AI fitness application built with modern Android architecture. It delivers an adaptive training loop:

$$\text{Set Goal} \longrightarrow \text{Personalized AI Plan} \longrightarrow \text{Train} \longrightarrow \text{Log Results} \longrightarrow \text{Analyze Progress} \longrightarrow \text{Adapt Plan} \longrightarrow \text{Improve}$$

---

## 📱 Features

* **AI Coach & Dynamic Adaptation**: Context-aware AI coach adjusting training volume based on fatigue ("I'm tired today" $\to$ $-20\%$ set volume reduction) and strict medical safety guardrails.
* **Distraction-Free Live Workout Tracker**: Set tracking (reps $\times$ kg), real-time countdown rest timer ($+30\text{s}$ controls), previous vs current load comparison, RPE scoring, and biomechanical exercise substitutions.
* **Mifflin-St Jeor Fitness Engine**: Deterministic calculation of BMR, TDEE, goal-based caloric surplus/deficit, and macronutrient targets ($2.2\text{ g/kg}$ protein).
* **Progressive Overload Algorithm**: Auto-suggests $+2.5\text{kg}$ working weight or rep progression based on RPE and completion rates.
* **Nutrition & AI Photo Log**: Calorie and macro target rings, water intake tracker, meal breakdowns, and AI food vision scanner.
* **Progress & Analytics**: Interactive Bezier trend charts (Body Weight, 1RM Strength, Workout Volume), private progress photo comparison slider, and Personal Record trophy cabinet.
* **Gamification & Daily Check-In**: Level ranks (*Iron Builder*, *Apex Athlete*), XP reward curves, weekly challenges, and $0\text{--}100$ recovery readiness scoring.
* **Google Play Billing & Health Connect**: Integrated entitlement layer for FitPulse Pro tiers and Health Connect step/sleep synchronization.

---

## 🛠️ Tech Stack & Architecture

* **UI**: Jetpack Compose, Material 3, Navigation Compose, Coil
* **Architecture**: MVVM, Clean Architecture (Presentation $\to$ Use Cases $\to$ Repositories $\to$ Data Sources)
* **Local Persistence**: Room Database (KSP) + DataStore Preferences
* **Asynchronous**: Kotlin Coroutines & StateFlow
* **Health & Monitization**: Android Health Connect & Google Play Billing

---

## 🚀 Getting Started

### 1. Open in Android Studio
1. Clone this repository:
   ```bash
   git clone https://github.com/fatimamaaz80-svg/fitness-app.git
   ```
2. Open the project in **Android Studio (Ladybug / Koala or newer)**.
3. Allow Gradle to sync dependencies from `gradle/libs.versions.toml`.
4. Run on an Android Device or Emulator (API 26+).

### 2. Interactive Preview
You can also preview and test the complete app experience in your browser by opening `preview/index.html`.
