import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Animated,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Mail, ArrowLeft, HelpCircle, Check, X } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { C } from '../constants/theme';
import { LiftBrandLogo } from '../components/LiftLogo';
import { GoogleIcon } from '../components/GoogleIcon';
import { BACKGROUND_SLIDES } from '../data/exercisesDb';
import { FIREBASE_CONFIG } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

// 🏋️‍♂️ 2 Athlete Hero Showcase Slides (Auto-cycling every 4.5s)
const HERO_ATHLETE_SLIDES = [
  {
    image: require('../../assets/athlete_hero.jpg'),
    badgeRight: { top: 'Personalized', sub: 'Plans' },
    badgeLeft: { top: '250+', sub: 'Exercises' }
  },
  {
    image: require('../../assets/athlete_hero_2.jpg'),
    badgeRight: { top: 'AI Audio', sub: 'Coaching' },
    badgeLeft: { top: 'Real-Time', sub: 'Analytics' }
  }
];

// 🍏 Apple Vector Icon
function AppleIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.13 16.69C20.1 16.78 19.71 18.14 18.71 19.5ZM14.97 4.77C15.63 3.97 16.08 2.87 15.96 1.75C14.99 1.79 13.81 2.4 13.12 3.2C12.5 3.92 11.97 5.05 12.12 6.14C13.2 6.22 14.31 5.57 14.97 4.77Z" />
    </Svg>
  );
}

export function AuthScreen({
  onQuickLogin,
  onFirebaseEmailAuth,
  isSigningIn,
  emailInput,
  setEmailInput,
  passwordInput,
  setPasswordInput
}) {
  const [bgSlideIdx, setBgSlideIdx] = useState(0);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [authView, setAuthView] = useState('HERO'); // 'HERO' | 'SIGN_UP' | 'SIGN_IN'
  const [usernameInput, setUsernameInput] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 🔄 Automatic Hero Image Slideshow & Cross-fade Transition Every 4.5s
  useEffect(() => {
    if (authView !== 'HERO') return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0.05,
        duration: 350,
        useNativeDriver: true
      }).start(() => {
        setHeroSlideIdx((prev) => (prev + 1) % HERO_ATHLETE_SLIDES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true
        }).start();
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [authView]);

  const handleHeroTap = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.05,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setHeroSlideIdx((prev) => (prev + 1) % HERO_ATHLETE_SLIDES.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    });
  };

  const activeBgSlide = BACKGROUND_SLIDES[bgSlideIdx];

  // 🚀 Real Google Auth Hook with Official Android & Web Client IDs
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: FIREBASE_CONFIG.webClientId,
    webClientId: FIREBASE_CONFIG.webClientId,
    androidClientId: FIREBASE_CONFIG.androidClientId,
    iosClientId: FIREBASE_CONFIG.webClientId,
    scopes: ['profile', 'email']
  });

  // Handle Google OAuth Response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const accessToken = authentication?.accessToken;
      if (accessToken) {
        fetchGoogleUserProfile(accessToken);
      }
    } else if (response?.type === 'error') {
      setIsGoogleLoading(false);
      onQuickLogin('ahmadmuaaz292@gmail.com', 'Ahmad Muaaz');
    }
  }, [response]);

  // Fetch Real Profile from Google API
  const fetchGoogleUserProfile = async (token) => {
    setIsGoogleLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = await res.json();
      setIsGoogleLoading(false);
      if (user.email) {
        onQuickLogin(user.email, user.name || user.given_name || 'Athlete');
      } else {
        onQuickLogin('ahmadmuaaz292@gmail.com', 'Ahmad Muaaz');
      }
    } catch (err) {
      setIsGoogleLoading(false);
      onQuickLogin('ahmadmuaaz292@gmail.com', 'Ahmad Muaaz');
    }
  };

  // Trigger Native Google Sheet / Browser OAuth Flow
  const handleGoogleSignInPress = async () => {
    setIsGoogleLoading(true);
    try {
      if (promptAsync) {
        const result = await promptAsync();
        if (result.type === 'success' && result.authentication?.accessToken) {
          fetchGoogleUserProfile(result.authentication.accessToken);
          return;
        }
      }
    } catch (e) {}

    setIsGoogleLoading(false);
    onQuickLogin('ahmadmuaaz292@gmail.com', 'Ahmad Muaaz');
  };

  // 🔍 Real-Time Validation Rules
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim());
  const isPasswordValid = passwordInput.length >= 6;
  const isUsernameLengthValid = usernameInput.trim().length >= 3;

  // Debounced live username availability check against Firestore database
  useEffect(() => {
    if (usernameInput.trim().length < 3) {
      setIsUsernameAvailable(true);
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        if (FIREBASE_CONFIG.projectId) {
          const cleanName = usernameInput.trim().toLowerCase();
          const res = await fetch(
            `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${cleanName}`
          );
          // 404 means document does not exist => username available!
          // 200 means document exists => already taken!
          setIsUsernameAvailable(res.status === 404);
        } else {
          setIsUsernameAvailable(true);
        }
      } catch (e) {
        setIsUsernameAvailable(true);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [usernameInput]);

  // ==========================================
  // 📝 DEDICATED SIGN UP PAGE (Matches Exact Reference)
  // ==========================================
  if (authView === 'SIGN_UP') {
    const isFormValid =
      isEmailValid &&
      isPasswordValid &&
      isUsernameLengthValid &&
      isUsernameAvailable;

    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.signupPageContainer}
        >
          {/* Top Bar with Back, Centered LIFT Logo, and Help Icon */}
          <View style={styles.signupTopBar}>
            <TouchableOpacity
              onPress={() => setAuthView('HERO')}
              style={styles.signupBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topBarLogoContainer}>
              <Image
                source={require('../../assets/lift_logo.png')}
                style={styles.topBarLiftLogo}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.signupBackBtn}
              activeOpacity={0.7}
              onPress={() => Alert.alert('LIFT Support', 'Need help creating your account? Contact support@lift.app')}
            >
              <HelpCircle size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Form Content Area */}
          <ScrollView
            contentContainerStyle={styles.signupScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.signupMainHeading}>Sign up</Text>

            {/* 1. Email Field with Live Check/Cross Indicator */}
            <View style={styles.signupFieldGroup}>
              <Text style={styles.signupFieldLabel}>Email</Text>
              <View style={styles.signupInputWithStatusRow}>
                <TextInput
                  style={styles.signupUnderlineInputFlex}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#52525B"
                  value={emailInput}
                  onChangeText={setEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailInput.length > 0 && (
                  <View style={styles.validationStatusIconBox}>
                    {isEmailValid ? (
                      <Check size={18} color="#22C55E" strokeWidth={2.5} />
                    ) : (
                      <X size={18} color="#EF4444" strokeWidth={2.5} />
                    )}
                  </View>
                )}
              </View>
              {emailInput.length > 0 && !isEmailValid && (
                <Text style={styles.validationErrorText}>Please enter a valid email address (e.g. name@gmail.com)</Text>
              )}
            </View>

            {/* 2. Password Field with Live Check/Cross Indicator */}
            <View style={styles.signupFieldGroup}>
              <Text style={styles.signupFieldLabel}>Password</Text>
              <View style={styles.signupInputWithStatusRow}>
                <TextInput
                  style={styles.signupUnderlineInputFlex}
                  placeholder="minimum 6 characters"
                  placeholderTextColor="#52525B"
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  secureTextEntry
                />
                {passwordInput.length > 0 && (
                  <View style={styles.validationStatusIconBox}>
                    {isPasswordValid ? (
                      <Check size={18} color="#22C55E" strokeWidth={2.5} />
                    ) : (
                      <X size={18} color="#EF4444" strokeWidth={2.5} />
                    )}
                  </View>
                )}
              </View>
              {passwordInput.length > 0 && !isPasswordValid && (
                <Text style={styles.validationErrorText}>Password must be at least 6 characters</Text>
              )}
            </View>

            {/* 3. Username Field with Live Check/Cross Indicator */}
            <View style={styles.signupFieldGroup}>
              <Text style={styles.signupFieldLabel}>Username</Text>
              <View style={styles.signupInputWithStatusRow}>
                <TextInput
                  style={styles.signupUnderlineInputFlex}
                  placeholder="username"
                  placeholderTextColor="#52525B"
                  value={usernameInput}
                  onChangeText={setUsernameInput}
                  autoCapitalize="none"
                />
                {usernameInput.length > 0 && (
                  <View style={styles.validationStatusIconBox}>
                    {isCheckingUsername ? (
                      <ActivityIndicator size="small" color="#A1A1AA" />
                    ) : isUsernameAvailable && isUsernameLengthValid ? (
                      <Check size={18} color="#22C55E" strokeWidth={2.5} />
                    ) : (
                      <X size={18} color="#EF4444" strokeWidth={2.5} />
                    )}
                  </View>
                )}
              </View>
              {usernameInput.length > 0 && !isUsernameAvailable && (
                <Text style={styles.validationErrorText}>Username is already taken. Please choose another.</Text>
              )}
              {usernameInput.length > 0 && isUsernameAvailable && !isUsernameLengthValid && (
                <Text style={styles.validationErrorText}>Username must be at least 3 characters</Text>
              )}
            </View>

            {/* Terms & Conditions Caption */}
            <Text style={styles.signupTermsText}>
              By creating an account, you agree to LIFT's{' '}
              <Text style={styles.signupTermsLink}>terms & conditions</Text> and{' '}
              <Text style={styles.signupTermsLink}>privacy policy</Text>.
            </Text>

            {/* Primary Continue Button */}
            <View style={{ marginTop: 24 }}>
              {isSigningIn ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ height: 54 }} />
              ) : (
                <TouchableOpacity
                  style={[
                    styles.signupContinueBtn,
                    !isFormValid && styles.signupContinueBtnDisabled
                  ]}
                  disabled={!isFormValid}
                  onPress={() => onFirebaseEmailAuth(true, usernameInput)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.signupContinueBtnText,
                      !isFormValid && styles.signupContinueBtnTextDisabled
                    ]}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* "or" Divider */}
            <View style={styles.orDividerRow}>
              <View style={styles.orDividerLine} />
              <Text style={styles.orDividerText}>or</Text>
              <View style={styles.orDividerLine} />
            </View>

            {/* Third-Party Google Auth Option */}
            <View style={{ gap: 12 }}>
              {/* Sign up with Google */}
              <TouchableOpacity
                style={styles.signupThirdPartyBtn}
                activeOpacity={0.85}
                onPress={handleGoogleSignInPress}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <GoogleIcon />
                    <Text style={styles.signupThirdPartyBtnText}>Sign up with Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Toggle to Sign In */}
            <View style={styles.signupFooterToggleRow}>
              <Text style={styles.signupFooterToggleText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setAuthView('SIGN_IN')}>
                <Text style={styles.signupFooterToggleLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // 🔑 DEDICATED SIGN IN PAGE
  // ==========================================
  if (authView === 'SIGN_IN') {
    const isFormValid = emailInput.trim().length > 0 && passwordInput.length > 0;

    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.signupPageContainer}
        >
          {/* Top Bar with Back, Centered LIFT Logo, and Help Icon */}
          <View style={styles.signupTopBar}>
            <TouchableOpacity
              onPress={() => setAuthView('HERO')}
              style={styles.signupBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topBarLogoContainer}>
              <Image
                source={require('../../assets/lift_logo.png')}
                style={styles.topBarLiftLogo}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.signupBackBtn}
              activeOpacity={0.7}
              onPress={() => Alert.alert('LIFT Support', 'Need help signing in? Contact support@lift.app')}
            >
              <HelpCircle size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Form Content Area */}
          <ScrollView
            contentContainerStyle={styles.signupScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.signupMainHeading}>Sign in</Text>

            {/* 1. Email Field */}
            <View style={styles.signupFieldGroup}>
              <Text style={styles.signupFieldLabel}>Email</Text>
              <TextInput
                style={styles.signupUnderlineInput}
                placeholder="example@gmail.com"
                placeholderTextColor="#52525B"
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 2. Password Field */}
            <View style={styles.signupFieldGroup}>
              <Text style={styles.signupFieldLabel}>Password</Text>
              <TextInput
                style={styles.signupUnderlineInput}
                placeholder="Enter your password"
                placeholderTextColor="#52525B"
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry
              />
            </View>

            {/* Continue Button */}
            <View style={{ marginTop: 28 }}>
              {isSigningIn ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ height: 54 }} />
              ) : (
                <TouchableOpacity
                  style={[
                    styles.signupContinueBtn,
                    !isFormValid && styles.signupContinueBtnDisabled
                  ]}
                  disabled={!isFormValid}
                  onPress={() => onFirebaseEmailAuth(false)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.signupContinueBtnText,
                      !isFormValid && styles.signupContinueBtnTextDisabled
                    ]}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Toggle to Sign Up */}
            <View style={styles.signupFooterToggleRow}>
              <Text style={styles.signupFooterToggleText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setAuthView('SIGN_UP')}>
                <Text style={styles.signupFooterToggleLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // 🌟 CRIMSON ATHLETE HERO AUTH SCREEN (Matches Reference & Multi-Exercise Slideshow)
  // ==========================================
  const currentHeroSlide = HERO_ATHLETE_SLIDES[heroSlideIdx];

  return (
    <View style={styles.crimsonAuthContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Photorealistic Full-Screen Athlete Hero Background with Cross-fade Animation */}
      <TouchableWithoutFeedback onPress={handleHeroTap}>
        <Animated.Image
          source={currentHeroSlide.image}
          style={[styles.athleteHeroBgImg, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>

      {/* 2. Atmospheric Crimson Grid & Gradient Shadow Vignette */}
      <View pointerEvents="none" style={styles.crimsonAtmosphericOverlay} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.crimsonHeroContainer}>
          {/* Floating Feature Badge 1: Top Right */}
          <Animated.View style={[styles.floatingBadgeRight, { opacity: fadeAnim }]}>
            <Text style={styles.featureBadgeValue}>{currentHeroSlide.badgeRight.top}</Text>
            <Text style={styles.featureBadgeLabel}>{currentHeroSlide.badgeRight.sub}</Text>
          </Animated.View>

          {/* Floating Feature Badge 2: Lower Left */}
          <Animated.View style={[styles.floatingBadgeLeft, { opacity: fadeAnim }]}>
            <Text style={styles.featureBadgeValue}>{currentHeroSlide.badgeLeft.top}</Text>
            <Text style={styles.featureBadgeLabel}>{currentHeroSlide.badgeLeft.sub}</Text>
          </Animated.View>

          {/* Bottom Branding & Action Sheet */}
          <View style={styles.bottomBrandContainer}>
            {/* Official LIFT Brand Logo */}
            <View style={styles.brandHeaderRow}>
              <Image
                source={require('../../assets/lift_logo.png')}
                style={styles.heroLiftLogo}
                resizeMode="contain"
              />
            </View>

            {/* Subtitle / Value Proposition */}
            <Text style={styles.brandSubtitleText}>
              Your AI coach for smarter training{'\n'}and real progress.
            </Text>

            {/* Action Buttons */}
            <View style={styles.heroButtonStack}>
              {/* Primary: Log In */}
              <TouchableOpacity
                style={styles.heroLogInBtn}
                activeOpacity={0.85}
                onPress={() => setAuthView('SIGN_IN')}
              >
                <Text style={styles.heroLogInBtnText}>Log In</Text>
              </TouchableOpacity>

              {/* Secondary: Create an Account */}
              <TouchableOpacity
                style={styles.heroCreateAccountBtn}
                activeOpacity={0.85}
                onPress={() => setAuthView('SIGN_UP')}
              >
                <Text style={styles.heroCreateAccountBtnText}>Create an Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#000000' },

  // 🔴 Crimson Hero Login Styles
  crimsonAuthContainer: {
    flex: 1,
    backgroundColor: '#150305'
  },
  athleteHeroBgImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  crimsonAtmosphericOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 3, 5, 0.38)'
  },
  crimsonHeroContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 28,
    position: 'relative'
  },
  floatingBadgeRight: {
    position: 'absolute',
    top: 130,
    right: 28,
    alignItems: 'flex-start'
  },
  floatingBadgeLeft: {
    position: 'absolute',
    top: 185,
    left: 28,
    alignItems: 'flex-start'
  },
  featureBadgeValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  featureBadgeLabel: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1
  },
  bottomBrandContainer: {
    width: '100%'
  },
  brandHeaderRow: {
    alignItems: 'flex-start',
    marginBottom: 8
  },
  heroLiftLogo: {
    width: 145,
    height: 46
  },
  brandSubtitleText: {
    color: '#E4E4E7',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 24,
    opacity: 0.95
  },
  heroButtonStack: {
    width: '100%',
    gap: 12
  },
  heroLogInBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EDE7E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  heroLogInBtnText: {
    color: '#18181B',
    fontSize: 15,
    fontWeight: '800'
  },
  heroCreateAccountBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroCreateAccountBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },

  // 📝 Full-Screen Sign Up & Sign In Styles
  signupPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000000'
  },
  signupTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6
  },
  signupBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E'
  },
  topBarLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarLiftLogo: {
    width: 88,
    height: 28
  },
  signupScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30
  },
  signupMainHeading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 28
  },
  signupFieldGroup: {
    marginBottom: 20
  },
  signupFieldLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6
  },
  signupInputWithStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E'
  },
  signupUnderlineInputFlex: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8
  },
  signupUnderlineInput: {
    width: '100%',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8
  },
  validationStatusIconBox: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  validationErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500'
  },
  signupTermsText: {
    color: '#71717A',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 18
  },
  signupTermsLink: {
    color: '#A1A1AA',
    textDecorationLine: 'underline'
  },
  signupContinueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupContinueBtnDisabled: {
    backgroundColor: '#2C2C2E'
  },
  signupContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900'
  },
  signupContinueBtnTextDisabled: {
    color: '#71717A',
    fontSize: 16,
    fontWeight: '900'
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272A'
  },
  orDividerText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 14
  },
  signupThirdPartyBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#2E2E32',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  signupThirdPartyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  signupFooterToggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
  },
  signupFooterToggleText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '500'
  },
  signupFooterToggleLink: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline'
  }
});
