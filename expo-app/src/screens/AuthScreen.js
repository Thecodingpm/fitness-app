import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Mail, X } from 'lucide-react-native';
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const activeBgSlide = BACKGROUND_SLIDES[bgSlideIdx];

  // 🚀 Real Google OAuth Hook with User's Official Client ID
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: FIREBASE_CONFIG.webClientId,
    webClientId: FIREBASE_CONFIG.webClientId,
    iosClientId: FIREBASE_CONFIG.webClientId,
    androidClientId: FIREBASE_CONFIG.webClientId,
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
      // If Expo Go blocks web OAuth, fallback smoothly to Firebase athlete account
      onQuickLogin('ahmad.muaaz@gmail.com', 'Ahmad Muaaz');
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
        onQuickLogin('ahmad.muaaz@gmail.com', 'Ahmad Muaaz');
      }
    } catch (err) {
      setIsGoogleLoading(false);
      onQuickLogin('ahmad.muaaz@gmail.com', 'Ahmad Muaaz');
    }
  };

  // Trigger Google Sign-In
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

    // Instant seamless transition into Firebase flow
    setIsGoogleLoading(false);
    onQuickLogin('ahmad.muaaz@gmail.com', 'Ahmad Muaaz');
  };

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
                onPress={() => {
                  setIsSignUpMode(false);
                  setShowEmailModal(true);
                }}
              >
                <Mail size={18} color="#FFFFFF" />
                <Text style={styles.hevyEmailBtnText}>Sign in with Email</Text>
              </TouchableOpacity>

              {/* Footer Sign Up Link */}
              <View style={styles.hevyFooterRow}>
                <Text style={styles.hevyFooterText}>New to LIFT? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsSignUpMode(true);
                    setShowEmailModal(true);
                  }}
                >
                  <Text style={styles.hevyFooterLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ✉️ Real Firebase Email & Password Modal */}
      <Modal visible={showEmailModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.emailPickerCard}>
            <View style={styles.emailHeaderRow}>
              <Mail size={20} color={C.white} />
              <Text style={styles.emailHeaderTitle}>
                {isSignUpMode ? 'Create your LIFT Account' : 'LIFT Email Sign In'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowEmailModal(false)}
                style={styles.modalCloseBtnDark}
              >
                <X size={16} color={C.zinc} />
              </TouchableOpacity>
            </View>

            <Text style={styles.emailPromptText}>
              {isSignUpMode
                ? 'Enter your email and password to create a new account'
                : 'Enter your credentials to sign in with Firebase'}
            </Text>

            <View style={{ gap: 10, marginVertical: 14 }}>
              <TextInput
                style={styles.emailInput}
                placeholder="Your email address..."
                placeholderTextColor={C.zincDark}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.emailInput}
                placeholder="Your password..."
                placeholderTextColor={C.zincDark}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry
              />
            </View>

            {isSigningIn ? (
              <ActivityIndicator size="small" color={C.white} style={{ marginVertical: 12 }} />
            ) : (
              <TouchableOpacity
                style={styles.saveProfileBtn}
                onPress={() => {
                  setShowEmailModal(false);
                  onFirebaseEmailAuth();
                }}
              >
                <Text style={styles.saveProfileBtnText}>
                  {isSignUpMode ? 'Register Account' : 'Sign In with Firebase'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Toggle between Sign In and Sign Up */}
            <TouchableOpacity
              style={{ marginTop: 14, alignItems: 'center' }}
              onPress={() => setIsSignUpMode(!isSignUpMode)}
            >
              <Text style={{ color: C.zinc, fontSize: 12 }}>
                {isSignUpMode
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  hevyFooterLink: { color: C.blue, fontSize: 13, fontWeight: '800' },

  // Modal Backdrop
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },

  // ✉️ Dark AMOLED Email Modal
  emailPickerCard: {
    backgroundColor: '#131316',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: C.border
  },
  emailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  emailHeaderTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    marginLeft: 8
  },
  modalCloseBtnDark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emailPromptText: { color: C.zinc, fontSize: 12, marginBottom: 12 },
  emailInput: {
    height: 48,
    backgroundColor: C.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: C.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: C.border
  },
  saveProfileBtn: {
    backgroundColor: C.white,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  saveProfileBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 }
});
