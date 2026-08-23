import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { C } from '../constants/theme';

export function OnboardingScreen({
  onboardingStep,
  setOnboardingStep,
  nameInput,
  setNameInput,
  unitWeight,
  setUnitWeight,
  unitDistance,
  setUnitDistance,
  unitBody,
  setUnitBody,
  onFinishOnboarding,
  onBackToAuth
}) {
  // STEP 1: WHAT SHOULD WE CALL YOU?
  if (onboardingStep === 1) {
    const isNameValid = nameInput.trim().length > 0;

    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        <View style={styles.namePageContainer}>
          {/* Top Bar with Back Button */}
          <View style={styles.nameTopBar}>
            <TouchableOpacity
              onPress={onBackToAuth}
              style={styles.nameBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={C.white} />
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          <ScrollView
            contentContainerStyle={styles.nameScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 💎 Main Pure White LIFT Logo */}
            <View style={styles.nameLogoWrapper}>
              <Image
                source={require('../../assets/lift_logo.png')}
                style={styles.nameLiftLogo}
                resizeMode="contain"
              />
            </View>

            {/* Welcoming Heading */}
            <Text style={styles.nameHeading}>What should we call you?</Text>

            {/* Short Subtitle */}
            <Text style={styles.nameSubhead}>Let's personalize your fitness journey.</Text>

            {/* Clean Name Input Field */}
            <View style={styles.nameInputContainer}>
              <TextInput
                style={styles.nameInputField}
                placeholder="Enter your name"
                placeholderTextColor="#71717A"
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (isNameValid) setOnboardingStep(2);
                }}
              />
            </View>
          </ScrollView>

          {/* Prominent Bottom Continue Button */}
          <View style={styles.nameBottomBar}>
            <TouchableOpacity
              style={[styles.nameContinueBtn, !isNameValid && styles.nameContinueBtnDisabled]}
              disabled={!isNameValid}
              onPress={() => {
                if (isNameValid) setOnboardingStep(2);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.nameContinueBtnText, !isNameValid && styles.nameContinueBtnTextDisabled]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // STEP 2: SELECT UNITS
  return (
    <SafeAreaView style={styles.authContainer}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.namePageContainer}>
        {/* Top Bar with Back Button */}
        <View style={styles.nameTopBar}>
          <TouchableOpacity
            onPress={() => setOnboardingStep(1)}
            style={styles.nameBackBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          contentContainerStyle={styles.unitsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.unitsTitle}>Select Units</Text>

          {/* Unit Cards List */}
          <View style={styles.unitsListContainer}>
            {/* 1. Weight */}
            <View style={styles.unitCard}>
              <Text style={styles.unitCardLabel}>Weight</Text>
              <View style={styles.unitSegmentContainer}>
                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitWeight === 'kg' && styles.unitSegmentBtnActive
                  ]}
                  onPress={() => setUnitWeight('kg')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitWeight === 'kg' && styles.unitSegmentTextActive
                    ]}
                  >
                    kg
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitWeight === 'lbs' && styles.unitSegmentBtnActive
                  ]}
                  onPress={() => setUnitWeight('lbs')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitWeight === 'lbs' && styles.unitSegmentTextActive
                    ]}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Distance */}
            <View style={styles.unitCard}>
              <Text style={styles.unitCardLabel}>Distance</Text>
              <View style={styles.unitSegmentContainer}>
                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitDistance === 'kilometers' && styles.unitSegmentBtnActive
                  ]}
                  onPress={() => setUnitDistance('kilometers')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitDistance === 'kilometers' && styles.unitSegmentTextActive
                    ]}
                  >
                    kilometers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitDistance === 'miles' && styles.unitSegmentBtnActive
                  ]}
                  onPress={() => setUnitDistance('miles')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitDistance === 'miles' && styles.unitSegmentTextActive
                    ]}
                  >
                    miles
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Body Measurements */}
            <View style={styles.unitCard}>
              <Text style={styles.unitCardLabel}>Body Measurements</Text>
              <View style={styles.unitSegmentContainer}>
                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitBody === 'cm' && styles.unitSegmentBtnActive
                  ]}
                  onPress={() => setUnitBody('cm')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitBody === 'cm' && styles.unitSegmentTextActive
                    ]}
                  >
                    cm
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.unitSegmentBtn,
                    unitBody === 'in' && styles.unitSegmentBtnActive
                  ]}
                  onPress={() => setUnitBody('in')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitSegmentText,
                      unitBody === 'in' && styles.unitSegmentTextActive
                    ]}
                  >
                    in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Continue Button */}
        <View style={styles.nameBottomBar}>
          <TouchableOpacity
            style={styles.nameContinueBtn}
            onPress={onFinishOnboarding}
            activeOpacity={0.85}
          >
            <Text style={styles.nameContinueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#000000' },
  namePageContainer: { flex: 1, justifyContent: 'space-between' },
  nameTopBar: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
  nameBackBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2E2E32' },
  nameScrollContent: { paddingHorizontal: 24, alignItems: 'center', paddingTop: 30 },
  nameLogoWrapper: { marginBottom: 32, alignItems: 'center' },
  nameLiftLogo: { width: 140, height: 44 },
  nameHeading: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  nameSubhead: { color: '#A1A1AA', fontSize: 14, textAlign: 'center', marginBottom: 36, lineHeight: 20 },
  nameInputContainer: { width: '100%', marginBottom: 20 },
  nameInputField: { width: '100%', height: 56, backgroundColor: '#141414', borderRadius: 16, borderWidth: 1, borderColor: '#2E2E32', paddingHorizontal: 18, color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  nameBottomBar: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
  nameContinueBtn: { width: '100%', height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  nameContinueBtnDisabled: { backgroundColor: '#1E1E22', borderWidth: 1, borderColor: '#2E2E32' },
  nameContinueBtnText: { color: '#000000', fontSize: 16, fontWeight: '900' },
  nameContinueBtnTextDisabled: { color: '#71717A', fontSize: 16, fontWeight: '900' },

  // Select Units Styles
  unitsScrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 },
  unitsTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 28 },
  unitsListContainer: { gap: 16 },
  unitCard: { backgroundColor: '#141414', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#2E2E32' },
  unitCardLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 14 },
  unitSegmentContainer: { flexDirection: 'row', backgroundColor: '#0A0A0A', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#242428' },
  unitSegmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  unitSegmentBtnActive: { backgroundColor: '#2E2E34', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 2 },
  unitSegmentText: { color: '#71717A', fontSize: 14, fontWeight: '700' },
  unitSegmentTextActive: { color: '#FFFFFF', fontWeight: '900' }
});
