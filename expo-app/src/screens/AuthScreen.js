import React, { useState } from 'react';
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
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, X } from 'lucide-react-native';
import { C } from '../constants/theme';
import { LiftBrandLogo } from '../components/LiftLogo';
import { GoogleIcon } from '../components/GoogleIcon';
import { BACKGROUND_SLIDES } from '../data/exercisesDb';

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
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const activeBgSlide = BACKGROUND_SLIDES[bgSlideIdx];

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

              {/* Continue with Google Button */}
              <TouchableOpacity
                style={styles.hevyGoogleBtn}
                activeOpacity={0.85}
                onPress={() => setShowGoogleModal(true)}
              >
                <GoogleIcon />
                <Text style={styles.hevyGoogleBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* Sign in with Email Button */}
              <TouchableOpacity
                style={styles.hevyEmailBtn}
                activeOpacity={0.85}
                onPress={() => setShowEmailModal(true)}
              >
                <Mail size={18} color="#FFFFFF" />
                <Text style={styles.hevyEmailBtnText}>Sign in with Email</Text>
              </TouchableOpacity>

              {/* Footer Sign Up Link */}
              <View style={styles.hevyFooterRow}>
                <Text style={styles.hevyFooterText}>New to LIFT? </Text>
                <TouchableOpacity onPress={() => setShowEmailModal(true)}>
                  <Text style={styles.hevyFooterLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Google Account Picker Modal */}
      <Modal visible={showGoogleModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.googlePickerCard}>
            <View style={styles.googleHeaderRow}>
              <GoogleIcon />
              <Text style={styles.googleHeaderTitle}>Sign in with Google</Text>
              <TouchableOpacity onPress={() => setShowGoogleModal(false)} style={styles.modalCloseBtn}>
                <X size={16} color={C.zinc} />
              </TouchableOpacity>
            </View>

            <Text style={styles.googlePromptText}>Choose your Google account to connect with Firebase</Text>

            {isSigningIn ? (
              <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={C.white} />
                <Text style={{ color: C.zincLight, marginTop: 12, fontSize: 13, fontWeight: '600' }}>
                  Authenticating with Firebase...
                </Text>
              </View>
            ) : (
              <View style={{ gap: 8, marginVertical: 10 }}>
                <TouchableOpacity
                  style={styles.googleAccountRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowGoogleModal(false);
                    onQuickLogin('ahmad.muaaz@gmail.com', 'Ahmad Muaaz');
                  }}
                >
                  <View style={styles.googleAvatar}>
                    <Text style={styles.avatarText}>A</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.accountName}>Ahmad Muaaz</Text>
                    <Text style={styles.accountEmail}>ahmad.muaaz@gmail.com</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.googleAccountRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowGoogleModal(false);
                    onQuickLogin('athlete.user@gmail.com', 'Alex Vance');
                  }}
                >
                  <View style={[styles.googleAvatar, { backgroundColor: '#1E293B' }]}>
                    <Text style={styles.avatarText}>V</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.accountName}>Alex Vance</Text>
                    <Text style={styles.accountEmail}>athlete.user@gmail.com</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.googleAccountRow, { borderStyle: 'dashed' }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowGoogleModal(false);
                    setShowEmailModal(true);
                  }}
                >
                  <View style={[styles.googleAvatar, { backgroundColor: C.surfaceElevated }]}>
                    <Mail size={16} color={C.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.accountName}>Use another email account</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.googleDisclaimer}>
              To continue, Google will share your name, email, and profile with LIFT (Firebase lift-e44ad).
            </Text>
          </View>
        </View>
      </Modal>

      {/* Email & Password Modal */}
      <Modal visible={showEmailModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.googlePickerCard}>
            <View style={styles.googleHeaderRow}>
              <Mail size={20} color={C.white} />
              <Text style={styles.googleHeaderTitle}>LIFT Email Sign In</Text>
              <TouchableOpacity onPress={() => setShowEmailModal(false)} style={styles.modalCloseBtn}>
                <X size={16} color={C.zinc} />
              </TouchableOpacity>
            </View>

            <Text style={styles.googlePromptText}>Enter your credentials to sign in or register</Text>

            <View style={{ gap: 10, marginVertical: 12 }}>
              <TextInput
                style={styles.emailInput}
                placeholder="Email address..."
                placeholderTextColor={C.zincDark}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.emailInput}
                placeholder="Password..."
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
                <Text style={styles.saveProfileBtnText}>Continue to LIFT</Text>
              </TouchableOpacity>
            )}
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
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  googlePickerCard: { backgroundColor: '#131316', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, borderWidth: 1, borderColor: C.border },
  googleHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  googleHeaderTitle: { color: C.white, fontSize: 17, fontWeight: '800', flex: 1, marginLeft: 8 },
  modalCloseBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  googlePromptText: { color: C.zinc, fontSize: 12, marginBottom: 12 },
  googleAccountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surfaceVariant, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.borderSubtle },
  googleAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  accountName: { color: C.white, fontSize: 14, fontWeight: '700' },
  accountEmail: { color: C.zinc, fontSize: 12, marginTop: 1 },
  googleDisclaimer: { color: C.zincDark, fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 15 },
  emailInput: { height: 48, backgroundColor: C.surfaceVariant, borderRadius: 12, paddingHorizontal: 14, color: C.white, fontSize: 14, borderWidth: 1, borderColor: C.border },
  saveProfileBtn: { backgroundColor: C.white, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  saveProfileBtnText: { color: C.bg, fontWeight: '900', fontSize: 13 }
});
