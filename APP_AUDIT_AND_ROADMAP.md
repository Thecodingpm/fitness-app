# 📋 LIFT FITNESS APP — FULL CODEBASE AUDIT & TECHNICAL ROADMAP

> **Target Audience:** AI Engineering Assistants, Lead Mobile Engineers, Product Managers.  
> **Repository:** `Thecodingpm/fitness-app`  
> **Active Application Directory:** `expo-app/`  
> **Platform & Stack:** React Native 0.86.3 · React 19.2.3 · Expo SDK 57 · Cloud Firestore & Firebase Auth · JavaScript (ESNext / JSX)

---

## 1. Executive Summary & Architecture Overview

### 1.1 Architecture Paradigm
The **LIFT** mobile app is a cross-platform (iOS & Android) workout tracking and strength performance application. It is developed using **Expo (SDK 57)** and **React Native (0.86.3)** with a dark, high-contrast, premium aesthetic (AMOLED black `#000000` / `#09090B`, slate card surfaces, and Crimson Red accents `#EF4444`).

```
                              ┌────────────────────────────────────────┐
                              │            expo-app/App.js             │
                              │  (Central State & Screen Coordinator)  │
                              └───────────────────┬────────────────────┘
                                                  │
            ┌─────────────────────────────┬───────┴───────────────────────┬───────────────────────────────┐
            │                             │                               │                               │
            ▼                             ▼                               ▼                               ▼
    ┌───────────────┐           ┌───────────────────┐           ┌───────────────────┐           ┌───────────────────┐
    │  AUTH SCREEN  │           │ ONBOARDING WIZARD │           │     MAIN TABS     │           │  ACTIVE WORKOUT   │
    │  Email/Pass & │           │ 7-Step Biometrics │           │ Home · Videos ·   │           │  WorkoutPreview   │
    │ Google OAuth  │           │ & Goal Onboarding │           │ Rank · Analytics  │           │  Modal + Timer    │
    └───────┬───────┘           └─────────┬─────────┘           │ · Profile         │           └─────────┬─────────┘
            │                             │                     └─────────┬─────────┘                     │
            └─────────────────────────────┼───────────────────────────────┴───────────────────────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │       DATA & STORAGE LAYER      │
                         │                                 │
                         │ • AsyncStorage (Local Cache)    │
                         │ • SecureStore (Refresh Tokens)  │
                         │ • Cloud Firestore REST API      │
                         │ • Google Identity Toolkit       │
                         └─────────────────────────────────┘
```

- **Navigation Pattern:** Single-root state-based coordinator in `expo-app/App.js` (`appScreen: 'AUTH' | 'ONBOARDING' | 'MAIN'`). Bottom navigation manages 5 tabs: `home`, `videos` (Exercises), `rank` (Leaderboard), `analytics`, and `profile`.
- **Data & Cloud Layer:** Direct REST API calls to Cloud Firestore (`https://firestore.googleapis.com/v1/projects/lift-e44ad/...`) with Google Identity Toolkit token refreshing.
- **Offline-First:** All workout history, completed sets, and profile records are saved to `@react-native-async-storage/async-storage` immediately before queuing background cloud sync.

---

## 2. Full Inventory: What Is Currently In The App

### 2.1 Core Screens (`expo-app/src/screens/`)

| File | Size (Bytes) | Role & Features |
| :--- | :--- | :--- |
| **`VideoSplashScreen.js`** | 4,041 | Autoplays high-definition intro brand video (`Animate_the_provided_LIFT_fitn.mp4`), supports tap-to-skip, smooth fade-in to Auth/Main. |
| **`AuthScreen.js`** | 37,509 | • Live email format validation & 6+ char password checking.<br>• Direct Google OAuth flow via `expo-web-browser` exchanged with Firebase Identity Toolkit.<br>• Debounced username availability checker against Firestore.<br>• Guest sign-in with offline fallback. |
| **`OnboardingScreen.js`** | 84,667 | • 7-step wizard: Name, Gender, Birthday wheel-picker (`@quidone/react-native-wheel-picker`), Height (cm), Weight (kg), Fitness Objective, Experience level, and Workout split.<br>• Persists initial athlete profile to local session and Firestore. |
| **`HomeScreen.js`** | 61,274 | • Monday-indexed weekly day detection.<br>• Dynamic "Today's Workout" card matched to athlete's split.<br>• 7-day consistency tracker with streak calculation.<br>• Muscle group quick-launch cards (Chest, Back, Shoulders, Legs, Arms, Core).<br>• Real-time volume recap. |
| **`ExerciseVideosScreen.js`** | 37,492 | • Muscle-categorized video exercise database.<br>• Full video playback controls with form guidance and audio coach studio cues.<br>• Direct button to launch set logger from any exercise card. |
| **`LeaderboardScreen.js`** | 23,753 | • Minimalist, high-contrast dark leaderboard.<br>• Dual ranking modes: **Heavy Lifters** (ranked by real completed volume tonnage in kg) and **Daily Consistency** (ranked by verified completed workout days).<br>• Real user rank banner with badge and volume display. |
| **`AnalyticsScreen.js`** | 37,539 | • Total tonnage volume charts.<br>• 1RM compound lift strength estimation (Bench Press, Squat, Deadlift, Overhead Press).<br>• Muscle distribution radar/bar breakdown.<br>• Workout consistency calendar heatmap. |
| **`ProfileScreen.js`** | 46,338 | • Circular avatar selector (17 presets + camera roll image picker).<br>• Verified Personal Records (PRs) computed directly from completed sets.<br>• **In-place Personal Information modal** with quick steppers for weight & height.<br>• **In-place Training Goals & Split modal**.<br>• Unit toggles (kg/lbs, cm/in, km/mi).<br>• Native JSON data export via Share Sheet & local cache purge tool. |
| **`ConsistencyScreen.js`** | 43,045 | Detailed monthly consistency calendar with color-coded workout statuses (`completed`, `in_progress`, `rest`). |

### 2.2 Modals & Overlays (`expo-app/src/modals/`)

| File | Size (Bytes) | Role & Implementation |
| :--- | :--- | :--- |
| **`WorkoutPreviewModal.js`** | 48,806 | The primary workout engine. Routine preview, exercise reordering, custom exercise insertion, live workout timer, interactive set logger (reps, load, completed state), and post-workout summary generation. |
| **`FullscreenVideoModal.js`** | 34,620 | Comprehensive form guide modal featuring HD video demo, primary/secondary muscle tags, form cues, breathing cadence, and integrated set logger. |
| **`ProfilePreferencesModals.js`** | 46,932 | In-place modals for **Personal Information** (biometrics steppers), **Training Goals**, **Notifications**, **Workout Preferences & Units**, and **Help & Support FAQ**. |
| **`LegalModals.js`** | 22,408 | Legally compliant in-app **Privacy Policy** (GDPR/CCPA/Apple App Store guidelines) and **Terms of Service**. |
| **`PaywallModal.js`** | 10,360 | "LIFT ATHLETE PRO" preview card showcasing upcoming features (advanced analytics, audio coaching, visual form scan). |
| **`ActiveWorkoutModal.js`** | 5,856 | *Legacy/Unused* — compact workout modal superseded by `WorkoutPreviewModal.js`. |
| **`ExerciseDetailModal.js`** | 9,044 | *Legacy/Unused* — superseded by `FullscreenVideoModal.js`. |

### 2.3 Services & Data Utilities (`expo-app/src/services/` & `src/data/`)

| File | Role & Implementation |
| :--- | :--- |
| **`firestore.js`** | Direct REST client for Firestore (`users/{uid}/workouts`, `completed_sets`, `statuses`, `profile`). |
| **`firebaseAuthTokens.js`** | Handles SecureStore caching of refresh tokens and token refresh via Google SecureToken API. |
| **`sessionStorage.js`** | Local AsyncStorage wrapper for user session, offline completed sets, and day custom exercises. |
| **`completedSets.mjs`** | Pure mathematical calculations for verified volume tonnage (`totalVolumeKg`), PR calculation, and cloud-to-local set reconciliation. Covered by unit tests (`completedSets.test.mjs`). |
| **`exercisesDb.js`** | Static master database of 30+ exercises, weekly routines (Push, Pull, Legs, Upper, Lower, Full Body), and muscle metadata. |

---

## 3. Comprehensive Audit: What Needs To Be Fixed

### 🔴 Critical & High-Priority Issues

#### 1. Firestore 403 Forbidden Error on Cloud Sync
- **Observed Behavior:** The Metro runtime logs report:
  ```
  Set cloud load pending: Cloud load failed (403).
  ⚠️ Firestore getUserWorkouts error: [Error: Cloud load failed (403).]
  ```
- **Root Cause:** In the Firebase Project (`lift-e44ad`), Firestore security rules have expired (test mode default 30 days) or do not allow the authenticated user to access subcollections.
- **Required Fix:** Deploy the following Firestore security rules via the Firebase Console:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /{document=**} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
  ```

#### 2. Android Hardware Back Button Dismissal Trap
- **Observed Behavior:** All sub-screens and modals (`WorkoutPreviewModal`, `FullscreenVideoModal`, `ConsistencyScreen`, `ProfilePreferencesModals`) rely on React state variables (e.g., `visible={true}`).
- **Problem:** When an Android user taps the physical back button or uses the back swipe gesture, the app closes or backgrounds because `BackHandler` is not listening to dismiss open modals first.
- **Required Fix:** Add a `BackHandler` hook in `App.js` or within modals:
  ```javascript
  useEffect(() => {
    const onBackPress = () => {
      if (selectedPreviewRoutine) { setSelectedPreviewRoutine(null); return true; }
      if (showConsistency) { setShowConsistency(false); return true; }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [selectedPreviewRoutine, showConsistency]);
  ```

#### 3. Rest Timer Drift on Device Screen Lock / Backgrounding
- **Observed Behavior:** In `WorkoutPreviewModal.js` and `FullscreenVideoModal.js`, the rest countdown timer uses `setInterval(() => setRestSeconds(s => s - 1), 1000)`.
- **Problem:** When the athlete locks their iPhone/Android or switches to Spotify, the OS throttles JavaScript timers. When the phone is unlocked 2 minutes later, the timer may have only counted down 15 seconds.
- **Required Fix:** Store a target completion timestamp (`Date.now() + restDurationMs`) and recalculate remaining seconds from the delta on state tick or app state focus (`AppState.addEventListener('change', ...)`). Trigger a local push notification (`expo-notifications`) when rest completes.

#### 4. Dead / Legacy Files Cluttering the Repository
- The following files are completely unreferenced in `App.js` and should be archived or deleted to prevent confusion:
  1. `expo-app/src/modals/ActiveWorkoutModal.js` (Superseded by `WorkoutPreviewModal.js`)
  2. `expo-app/src/screens/ExercisesScreen.js` (Superseded by `ExerciseVideosScreen.js`)
  3. `expo-app/src/modals/ExerciseDetailModal.js` (Superseded by `FullscreenVideoModal.js`)
  4. Root `/app/` directory (Old native Android Gradle project, ~50MB of unused build files).

---

### 🟡 Medium-Priority Issues (Architecture & Performance)

#### 5. Monolithic Component File Sizes
- **Current State:** Several key components are very large:
  - `OnboardingScreen.js`: 2,628 lines
  - `HomeScreen.js`: 1,994 lines
  - `ProfileScreen.js`: 1,634 lines
  - `WorkoutPreviewModal.js`: 1,497 lines
  - `FullscreenVideoModal.js`: 1,195 lines
- **Impact:** Re-rendering performance during typing or timer ticks can trigger full-tree reconciliation of huge JSX hierarchies.
- **Recommendation:** Extract sub-components (e.g., `WorkoutSetRow.js`, `WeeklyCalendarStrip.js`, `AvatarPickerSheet.js`) with `React.memo` to isolate updates.

#### 6. Transition to Formal Navigation Architecture (React Navigation)
- **Current State:** Navigation relies on state variables in `App.js` (`appScreen` and `currentTab`).
- **Limitation:** Lacks deep-linking support, native screen transitions, tab memory, and iOS native swipe-to-pop navigation.
- **Recommendation:** Migrate to `@react-navigation/native` with `@react-navigation/bottom-tabs` and `@react-navigation/native-stack` while keeping the custom UI floating tab bar.

#### 7. Offline Sync Retry Queue with Exponential Backoff
- **Current State:** If an athlete logs a workout in an underground gym without signal, `saveCompletedSetToFirestore` catches the error and logs it to `console.log`.
- **Recommendation:** Implement a persistent `pending_sync_queue` in AsyncStorage. When network connectivity restores (`@react-native-community/netinfo`), automatically drain and sync pending records with exponential backoff.

#### 8. Paywall / In-App Purchases (IAP) Integration
- **Current State:** `PaywallModal.js` is a static visual showcase.
- **Recommendation:** Integrate **RevenueCat (`react-native-purchases`)** to support real Apple StoreKit 2 and Google Play Billing subscriptions ($9.99/mo, $59.99/yr).

---

### 🟢 Low-Priority & Polish Suggestions

#### 9. Dynamic Type & Small-Screen Responsiveness
- Test on small-factor devices (e.g., iPhone SE 3rd Gen, 375px width). Replace fixed heights on cards and headers with `minHeight` and flex layout to avoid text clipping.

#### 10. React Error Boundary
- Wrap `App.js` in a global `<ErrorBoundary>` to catch runtime errors (e.g., malformed analytics payloads) gracefully and display a "Something went wrong — Reload" screen instead of crashing to the home launcher.

---

## 4. Strategic Feature Roadmap: What To Add Next

### 🚀 Phase 1: High-Impact Workout Tools (Immediate Wins)

1. **Barbell Plate Loading Calculator:**
   - When logging barbell movements (Bench Press, Squat, Deadlift), tap a calculator icon next to the weight field.
   - Automatically computes plate configuration per side (e.g., 100 kg = 20kg bar + 2x20kg + 2x15kg + 2x5kg plates) with a visual barbell graphic.

2. **Warm-up Set Generator:**
   - Based on the working weight entered for the first working set, automatically suggest 3-4 warm-up sets:
     - Set 1: Empty Bar (20 kg) × 10 reps
     - Set 2: 50% Working Weight × 6 reps
     - Set 3: 70% Working Weight × 3 reps
     - Set 4: 90% Working Weight × 1 rep (potentiator)

3. **In-Workout Supersets & Drop Sets:**
   - Allow lifters to link two exercises together as a Superset (e.g., Bicep Curls + Tricep Pushdowns) with a shared rest timer.

4. **1RM (One Rep Max) Live Predictor:**
   - Use verified formulas (Brzycki & Epley) to estimate and display the athlete's theoretical 1RM as they type reps and weight during set logging.

---

### 📱 Phase 2: Ecosystem & OS Integrations

5. **Apple Health (HealthKit) & Google Health Connect Sync:**
   - Automatically write completed workout sessions (duration, estimated active calories, timestamps) to Apple Health and Android Health Connect.

6. **iOS Dynamic Island & Live Activities:**
   - Show active workout duration, current exercise, and live rest countdown on the iPhone Lock Screen and Dynamic Island so users don't have to keep the app open between sets.

7. **Audio Cues Over Music (Audio Ducking):**
   - When the rest timer reaches 3, 2, 1, play subtle haptic pulses and short beeps that duck background Spotify/Apple Music playback without interrupting it.

---

### 👥 Phase 3: Social & Retention Engine

8. **Aesthetic Instagram Story & Social Share Cards:**
   - After completing a workout or hitting a new PR, generate a dark-mode branded graphic summarizing:
     - Total Volume Lifted (e.g., `12,450 kg`)
     - Routine Name & Duration
     - Verified PRs hit
     - Streak counter
   - Direct share to Instagram Stories, WhatsApp, and Twitter.

9. **Custom Workout Routine Creator:**
   - Enable athletes to build, customize, and name their own weekly workout templates from the exercise database.

10. **Routine Import via Deep Link / QR Code:**
    - Lifters can share their custom routines with friends or gym partners via a shareable link (e.g., `liftapp://routine/push-hypertrophy`).

---

## 5. Technical Specifications for Another AI Assistant

If handing this codebase over to another AI agent, use the following execution notes:

```yaml
Runtime: React Native (Expo SDK 57)
Main Entry: expo-app/App.js
Node Version: 18+ (tested on Node v24.1.0)
Testing Command: node src/data/completedSets.test.mjs (inside expo-app)
Syntax Checking: node -e "const p = require('@babel/parser'); p.parse(...)"
Active Git Branch: codex/lift-exercise-routing-20260923 (synchronized with main)
Firebase Project ID: lift-e44ad
Key State Objects:
  - completedSets: Array<{ id, sessionId, exerciseName, weightKg, reps, loggedAt, muscle }>
  - dailyWorkoutStatuses: Record<string, 'completed' | 'in_progress' | 'rest'>
  - workoutHistory: Array<{ id, routineName, durationSeconds, exercisesCount, totalVolumeKg, date }>
```

### Immediate Next Tasks for the Next Engineer:
1. **Fix Firestore 403:** Update Firestore security rules in the Firebase console for project `lift-e44ad`.
2. **Clean Up Dead Files:** Remove or archive `expo-app/src/modals/ActiveWorkoutModal.js` and `expo-app/src/screens/ExercisesScreen.js`.
3. **Add BackHandler:** Intercept Android hardware back presses to dismiss active modals.
4. **Upgrade Rest Timer:** Switch from `setInterval` to timestamp delta calculation with background awareness.
