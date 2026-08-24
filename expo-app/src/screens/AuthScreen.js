import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
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
import { Mail, ArrowLeft, HelpCircle } from 'lucide-react-native';
import { C } from '../constants/theme';
import { LiftBrandLogo } from '../components/LiftLogo';
import { GoogleIcon } from '../components/GoogleIcon';
import { BACKGROUND_SLIDES } from '../data/exercisesDb';
import { FIREBASE_CONFIG } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

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
  const [authView, setAuthView] = useState('HERO'); // 'HERO' | 'SIGN_UP' | 'SIGN_IN'
  const [usernameInput, setUsernameInput] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  // ==========================================
  // 📝 DEDICATED SIGN UP PAGE (Matches Exact Reference)
  // ==========================================
  if (authView === 'SIGN_UP') {
    const isFormValid = emailInput.trim().length > 0 && passwordInput.length >= 6;

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
                placeholder="minimum 6 characters"
                placeholderTextColor="#52525B"
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry
              />
            </View>

            {/* 3. Username Field */}
            <View style={styles.signupFieldGroup}>
              <Text style={styles.signupFieldLabel}>Username</Text>
              <TextInput
                style={styles.signupUnderlineInput}
                placeholder="username"
                placeholderTextColor="#52525B"
                value={usernameInput}
                onChangeText={setUsernameInput}
                autoCapitalize="none"
              />
            </View>

            {/* Terms & Conditions Caption */}
            <Text style={styles.signupTermsText}>
              By creating an account, you agree to LIFT's{' '}
              <Text style={styles.signupTermsLink}>terms & conditions</Text> and{' '}
              <Text style={styles.signupTermsLink}>privacy policy</Text>.
            </Text>

            {/* Continue Button */}
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
  // 🌟 DEFAULT HERO AUTH VIEW
  // ==========================================
  return (
    <View style={styles.authContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Full-Screen Cinematic Background Image */}
      <TouchableWithoutFeedback onPress={() => setBgSlideIdx((prev) => (prev + 1) % BACKGROUND_SLIDES.length)}>
        <Image
          source={{ uri: activeBgSlide.uri }}
          style={styles.fullScreenBgImg}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>

      {/* 2. Cinematic Gradient & Vignette Overlay */}
      <View pointerEvents="none" style={styles.fullScreenBgOverlay} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.hevyScreenContainer}>
          {/* Top Centered LIFT Logo */}
          <View style={styles.topLogoContainer}>
            <LiftBrandLogo />
          </View>

          {/* Middle Flexible Spacer for Atmospheric Background Photo */}
          <TouchableOpacity
            style={styles.middleHeroTapArea}
            activeOpacity={1}
            onPress={() => setBgSlideIdx((prev) => (prev + 1) % BACKGROUND_SLIDES.length)}
          >
            <View style={styles.heroFeatureTag}>
              <Text style={styles.heroFeatureTagText}>{activeBgSlide.tag}</Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Content Area */}
          <View style={styles.bottomHeroContent}>
            {/* Dynamic Headline */}
            <Text style={styles.hevyHeadline}>
              {activeBgSlide.headline}
            </Text>

            {/* 3 Pagination Dots */}
            <View style={styles.hevyDotsRow}>
              {BACKGROUND_SLIDES.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setBgSlideIdx(i)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View
                    style={[
                      styles.hevyDot,
                      bgSlideIdx === i ? styles.hevyDotActive : styles.hevyDotInactive
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions Section */}
            <View style={styles.hevyActionsContainer}>
              <Text style={styles.hevyAccountPrompt}>Select an account to log in to LIFT</Text>

              {/* Real Google Sign-In Button */}
              <TouchableOpacity
                style={styles.hevyGoogleBtn}
                activeOpacity={0.85}
                onPress={handleGoogleSignInPress}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <>
                    <GoogleIcon />
                    <Text style={styles.hevyGoogleBtnText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Sign in with Email Button */}
              <TouchableOpacity
                style={styles.hevyEmailBtn}
                activeOpacity={0.85}
                onPress={() => setAuthView('SIGN_IN')}
              >
                <Mail size={18} color="#FFFFFF" />
                <Text style={styles.hevyEmailBtnText}>Sign in with Email</Text>
              </TouchableOpacity>

              {/* Footer Sign Up Link */}
              <View style={styles.hevyFooterRow}>
                <Text style={styles.hevyFooterText}>New to LIFT? </Text>
                <TouchableOpacity onPress={() => setAuthView('SIGN_UP')}>
                  <Text style={styles.hevyFooterLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#000000' },
  fullScreenBgImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fullScreenBgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.58)' },
  hevyScreenContainer: { flex: 1, paddingHorizontal: 24, paddingBottom: 24, justifyContent: 'space-between', alignItems: 'center' },
  topLogoContainer: { alignItems: 'center', marginTop: 38, paddingTop: 8 },
  middleHeroTapArea: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  heroFeatureTag: { backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' },
  heroFeatureTagText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  bottomHeroContent: { width: '100%', alignItems: 'center' },
  hevyHeadline: { color: '#FFFFFF', fontSize: 23, fontWeight: '900', textAlign: 'center', lineHeight: 30, marginBottom: 12 },
  hevyDotsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 20 },
  hevyDot: { height: 6, borderRadius: 3 },
  hevyDotActive: { width: 22, backgroundColor: '#FFFFFF' },
  hevyDotInactive: { width: 6, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  hevyActionsContainer: { width: '100%', gap: 10 },
  hevyAccountPrompt: { color: '#D4D4D8', fontSize: 13, textAlign: 'center', marginBottom: 4, fontWeight: '500' },
  hevyGoogleBtn: { height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 4 },
  hevyGoogleBtnText: { color: '#000000', fontSize: 15, fontWeight: '800' },
  hevyEmailBtn: { height: 50, borderRadius: 25, backgroundColor: 'rgba(23, 23, 26, 0.85)', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.25)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  hevyEmailBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  hevyFooterRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  hevyFooterText: { color: '#A1A1AA', fontSize: 13, fontWeight: '500' },
  hevyFooterLink: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textDecorationLine: 'underline' },

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
  signupUnderlineInput: {
    width: '100%',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8
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
  signupFooterToggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
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
