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
  ScrollView,
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
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
  const insets = useSafeAreaInsets();
  const [bgSlideIdx, setBgSlideIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // 0 = Bicep Curl, 1 = Lat Pulldown
  const [showingSecond, setShowingSecond] = useState(false);
  const [authView, setAuthView] = useState('HERO'); // 'HERO' | 'SIGN_UP' | 'SIGN_IN'
  const [usernameInput, setUsernameInput] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 🔄 Silky 60FPS Continuous Cross-dissolve Between the 2 Exercises Every 4.5s
  const showingSecondRef = useRef(false);
  useEffect(() => {
    if (authView !== 'HERO') return;

    const interval = setInterval(() => {
      const nextVal = !showingSecondRef.current;
      showingSecondRef.current = nextVal;
      Animated.timing(fadeAnim, {
        toValue: nextVal ? 1 : 0,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web'
      }).start();
      setShowingSecond(nextVal);
    }, 4500);

    return () => clearInterval(interval);
  }, [authView]);

  const handleHeroTap = () => {
    const nextVal = !showingSecondRef.current;
    showingSecondRef.current = nextVal;
    Animated.timing(fadeAnim, {
      toValue: nextVal ? 1 : 0,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web'
    }).start();
    setShowingSecond(nextVal);
  };

  // 🚀 Direct Google OAuth via WebBrowser (bypasses broken expo-auth-session)
  // iOS Client ID's reversed scheme — ASWebAuthenticationSession intercepts this
  const IOS_CLIENT_ID = FIREBASE_CONFIG.iosClientId;
  const ANDROID_CLIENT_ID = FIREBASE_CONFIG.androidClientId;
  const WEB_CLIENT_ID = FIREBASE_CONFIG.webClientId;


  const handleGoogleSignInPress = async () => {
    setIsGoogleLoading(true);
    try {
      const clientId = IOS_CLIENT_ID || WEB_CLIENT_ID;
      const reversedId = IOS_CLIENT_ID
        ? `com.googleusercontent.apps.${IOS_CLIENT_ID.replace('.apps.googleusercontent.com', '')}`
        : '';
      const redirectUri = `${reversedId}:/oauthredirect`;
      const responseType = 'code';

      const authUrl =
        'https://accounts.google.com/o/oauth2/v2/auth?' +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=${responseType}` +
        '&scope=' + encodeURIComponent('profile email') +
        '&include_granted_scopes=true' +
        '&prompt=select_account';

      console.log('🔑 [Google OAuth] Opening auth URL with redirect:', redirectUri);

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      console.log('🔑 [Google OAuth] Browser result type:', result.type);

      if (result.type === 'success' && result.url) {
        console.log('🔑 [Google OAuth] Success URL:', result.url);
        
        // 1. Check for access_token in URL fragment (#access_token=...)
        if (result.url.includes('#')) {
          const fragment = result.url.split('#')[1] || '';
          const hashParams = {};
          fragment.split('&').forEach(pair => {
            const [key, val] = pair.split('=');
            if (key && val) hashParams[key] = decodeURIComponent(val);
          });
          if (hashParams.access_token) {
            console.log('🔑 [Google OAuth] Got access_token directly from fragment');
            await fetchGoogleUserProfile(hashParams.access_token);
            return;
          }
        }

        // 2. Check for authorization code in query string (?code=...)
        const urlParts = result.url.split('?');
        const queryString = urlParts[1] || '';
        const params = {};
        queryString.split('&').forEach(pair => {
          const [key, val] = pair.split('=');
          if (key && val) params[key] = decodeURIComponent(val);
        });

        if (params.code) {
          console.log('🔑 [Google OAuth] Got auth code, exchanging for token...');
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body:
              `code=${encodeURIComponent(params.code)}` +
              `&client_id=${encodeURIComponent(clientId)}` +
              `&redirect_uri=${encodeURIComponent(redirectUri)}` +
              '&grant_type=authorization_code'
          });
          const tokenData = await tokenRes.json();
          console.log('🔑 [Google OAuth] Token exchange result:', tokenData.access_token ? 'GOT TOKEN' : tokenData.error);

          if (tokenData.access_token) {
            await fetchGoogleUserProfile(tokenData.access_token);
            return;
          } else {
            setIsGoogleLoading(false);
            onQuickLogin('athlete@lift.app', 'Athlete');
          }
        } else {
          setIsGoogleLoading(false);
          onQuickLogin('athlete@lift.app', 'Athlete');
        }
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log('🔑 [Google OAuth] User cancelled or dismissed');
        setIsGoogleLoading(false);
      } else {
        setIsGoogleLoading(false);
        onQuickLogin('athlete@lift.app', 'Athlete');
      }
    } catch (e) {
      console.error('🔑 [Google OAuth] Error:', e);
      setIsGoogleLoading(false);
      onQuickLogin('athlete@lift.app', 'Athlete');
    }
  };

  // Fetch Profile from Google API & Connect to Firebase
  const fetchGoogleUserProfile = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = await res.json();
      setIsGoogleLoading(false);
      if (user.email) {
        console.log('🔑 [Google OAuth] Profile fetched:', user.email, user.name);
        onQuickLogin(user.email, user.name || user.given_name || 'Athlete', token);
      } else {
        Alert.alert('Sign-In Issue', 'Could not get email from Google profile.');
      }
    } catch (err) {
      console.error('🔑 [Google OAuth] Profile fetch error:', err);
      setIsGoogleLoading(false);
    }
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
  // 📝 DEDICATED SIGN UP PAGE (Clean Linear Gradient Background)
  // ==========================================
  if (authView === 'SIGN_UP') {
    const isFormValid =
      isEmailValid &&
      isPasswordValid &&
      isUsernameLengthValid &&
      isUsernameAvailable;

    return (
      <View style={styles.crimsonAuthContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* 🔴 Studio Crimson Top Linear Gradient (Matches Reference Screenshot) */}
        <LinearGradient
          colors={['#5A0F17', '#25060A', '#09090B']}
          locations={[0, 0.38, 0.85]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View style={{ flex: 1, paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 16) }}>
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

              {/* 1. Email Field */}
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
                        <Check size={16} color="#22C55E" />
                      ) : (
                        <X size={16} color="#EF4444" />
                      )}
                    </View>
                  )}
                </View>
                {emailInput.length > 0 && !isEmailValid && (
                  <Text style={styles.validationErrorText}>Please enter a valid email address</Text>
                )}
              </View>

              {/* 2. Password Field */}
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
                        <Check size={16} color="#22C55E" />
                      ) : (
                        <X size={16} color="#EF4444" />
                      )}
                    </View>
                  )}
                </View>
                {passwordInput.length > 0 && !isPasswordValid && (
                  <Text style={styles.validationErrorText}>Password must be at least 6 characters</Text>
                )}
              </View>

              {/* 3. Username Field */}
              <View style={styles.signupFieldGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.signupFieldLabel}>Username</Text>
                  <Text style={{ color: '#71717A', fontSize: 11, fontWeight: '700' }}>{usernameInput.length}/10</Text>
                </View>
                <View style={styles.signupInputWithStatusRow}>
                  <TextInput
                    style={styles.signupUnderlineInputFlex}
                    placeholder="username"
                    placeholderTextColor="#52525B"
                    value={usernameInput}
                    onChangeText={(text) => setUsernameInput(text.slice(0, 10))}
                    maxLength={10}
                    autoCapitalize="none"
                  />
                  {usernameInput.length > 0 && (
                    <View style={styles.validationStatusIconBox}>
                      {isCheckingUsername ? (
                        <ActivityIndicator size="small" color="#A1A1AA" />
                      ) : isUsernameAvailable && isUsernameLengthValid ? (
                        <Check size={16} color="#22C55E" />
                      ) : (
                        <X size={16} color="#EF4444" />
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

              {/* ⚡ Powered by Eon Developers Footer */}
              <Text style={styles.poweredByText}>Powered by Eon Developers</Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }

  // ==========================================
  // 🔑 DEDICATED SIGN IN PAGE (Clean Linear Gradient Background)
  // ==========================================
  if (authView === 'SIGN_IN') {
    const isFormValid = emailInput.trim().length > 0 && passwordInput.length > 0;

    return (
      <View style={styles.crimsonAuthContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* 🔴 Studio Crimson Top Linear Gradient (Matches Reference Screenshot) */}
        <LinearGradient
          colors={['#5A0F17', '#25060A', '#09090B']}
          locations={[0, 0.38, 0.85]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View style={{ flex: 1, paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 16) }}>
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

              {/* ⚡ Powered by Eon Developers Footer */}
              <Text style={styles.poweredByText}>Powered by Eon Developers</Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }

  // ==========================================
  // 🌟 CRIMSON ATHLETE HERO AUTH SCREEN (Matches Reference & 60FPS Cross-fade)
  // ==========================================
  return (
    <View style={styles.crimsonAuthContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. STRICT BACKGROUND LAYER (Fixed exactly to screen size, cannot expand) */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', overflow: 'hidden' }}
      >
        <Image
          source={require('../../assets/athlete_hero.jpg')}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          resizeMode="cover"
        />
        <Animated.Image
          source={require('../../assets/athlete_hero_2.jpg')}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: fadeAnim }}
          resizeMode="cover"
        />

        {/* Atmospheric Crimson Vignette */}
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9, 9, 11, 0.38)' }} />

        {/* Natural Bottom Gradient Vignette */}
        <LinearGradient
          colors={['transparent', 'rgba(9, 9, 11, 0.65)', 'rgba(9, 9, 11, 0.98)']}
          locations={[0, 0.4, 1]}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 440 }}
        />
      </View>

      {/* 2. PRIMARY FOREGROUND CONTENT (Fixed exactly to screen, anchored to bottom) */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'flex-end',
          paddingHorizontal: 24,
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24)
        }}
      >
          {/* Floating Feature Badge 1: Top Right */}
          <View style={styles.floatingBadgeRight}>
            <Text style={styles.featureBadgeValue}>Personalized</Text>
            <Text style={styles.featureBadgeLabel}>Plans</Text>
          </View>

          {/* Floating Feature Badge 2: Lower Left */}
          <View style={styles.floatingBadgeLeft}>
            <Text style={styles.featureBadgeValue}>250+</Text>
            <Text style={styles.featureBadgeLabel}>Exercises</Text>
          </View>

          {/* Bottom Branding & Action Sheet */}
          <View style={styles.bottomBrandContainer}>
            {/* Official LIFT Brand Logo with Micro Powered By Caption */}
            <View style={styles.brandHeaderRow}>
              <Image
                source={require('../../assets/lift_logo.png')}
                style={styles.heroLiftLogo}
                resizeMode="contain"
              />
              <Text style={styles.poweredByUnderLogoText}>Powered by Eon Developers</Text>
            </View>

            {/* Subtitle / Value Proposition */}
            <Text style={styles.brandSubtitleText}>
              Your AI coach for smarter training{'\n'}and real progress.
            </Text>

            {/* Optimized High-Converting Button Stack */}
            <View style={styles.heroButtonStack}>
              {/* Primary 1-Tap Action: Continue with Google */}
              <TouchableOpacity
                style={styles.heroGooglePillBtn}
                activeOpacity={0.85}
                onPress={handleGoogleSignInPress}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#18181B" />
                ) : (
                  <>
                    <GoogleIcon />
                    <Text style={styles.heroGooglePillBtnText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Secondary Action: Sign in with Email */}
              <TouchableOpacity
                style={styles.heroEmailPillBtn}
                activeOpacity={0.85}
                onPress={() => setAuthView('SIGN_IN')}
              >
                <Mail size={16} color="#FFFFFF" />
                <Text style={styles.heroEmailPillBtnText}>Sign in with Email</Text>
              </TouchableOpacity>

              {/* Tertiary Action: Create an Account Link */}
              <View style={styles.heroFooterRow}>
                <Text style={styles.heroFooterText}>New to LIFT? </Text>
                <TouchableOpacity onPress={() => setAuthView('SIGN_UP')}>
                  <Text style={styles.heroFooterLink}>Create an Account</Text>
                </TouchableOpacity>
              </View>

              {/* ⚡ 1-Tap Guest Access to explore the app instantly */}
              <TouchableOpacity
                onPress={() => onQuickLogin('athlete@lift.app', 'Athlete')}
                style={{ marginTop: 12, alignItems: 'center', paddingVertical: 8 }}
                activeOpacity={0.7}
              >
                <Text style={{ color: '#A1A1AA', fontSize: 13, textDecorationLine: 'underline' }}>
                  Explore as Guest →
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#09090B' },

  // 🔴 Subtle Professional Crimson Hero Login Styles
  crimsonAuthContainer: {
    flex: 1,
    backgroundColor: '#09090B',
    position: 'relative'
  },
  authTopGlow: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 280,
    height: 180,
    backgroundColor: '#991B1B',
    opacity: 0.08,
    borderRadius: 140,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 80
  },
  authBottomGlow: {
    position: 'absolute',
    bottom: -80,
    alignSelf: 'center',
    width: 320,
    height: 200,
    backgroundColor: '#991B1B',
    opacity: 0.09,
    borderRadius: 160,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 80
  },
  athleteHeroBgImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  crimsonAtmosphericOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.38)',
    zIndex: 2
  },
  heroBottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
    zIndex: 3
  },
  crimsonHeroContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    zIndex: 10,
    elevation: 10
  },
  floatingBadgeRight: {
    position: 'absolute',
    top: 130,
    right: 28,
    alignItems: 'flex-start',
    zIndex: 12,
    elevation: 12
  },
  floatingBadgeLeft: {
    position: 'absolute',
    top: 185,
    left: 28,
    alignItems: 'flex-start',
    zIndex: 12,
    elevation: 12
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
    marginBottom: 4
  },
  heroLiftLogo: {
    width: 145,
    height: 44
  },
  poweredByUnderLogoText: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: -2,
    marginBottom: 6,
    opacity: 0.85
  },
  brandSubtitleText: {
    color: '#E4E4E7',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
    opacity: 0.95
  },
  heroButtonStack: {
    width: '100%',
    gap: 10
  },
  heroGooglePillBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EDE7E6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  heroGooglePillBtnText: {
    color: '#18181B',
    fontSize: 15,
    fontWeight: '800'
  },
  heroEmailPillBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  heroEmailPillBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  heroFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6
  },
  heroFooterText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '500'
  },
  heroFooterLink: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },

  // 📝 Full-Screen Sign Up & Sign In Styles
  signupPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
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
    backgroundColor: 'rgba(30, 8, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
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
    borderBottomColor: '#3F3F46'
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
    borderBottomColor: '#3F3F46',
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
    color: '#A1A1AA'
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
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
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
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
    fontWeight: '800'
  },
  poweredByText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4
  }
});
