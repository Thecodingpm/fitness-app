import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Dimensions,
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { C } from '../constants/theme';

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // 260px
const PADDING = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2; // 104px

// ♂️ Male Gender Icon
function MaleIcon({ color = '#FFFFFF', size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="14" r="5" stroke={color} strokeWidth="2" />
      <Path d="M19 5L13.5 10.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M14 5H19V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ♀️ Female Gender Icon
function FemaleIcon({ color = '#FFFFFF', size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="5" stroke={color} strokeWidth="2" />
      <Path d="M12 14V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M9 18H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// ⚥ Other Gender Icon
function OtherGenderIcon({ color = '#FFFFFF', size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="2" />
      <Path d="M19 5L15.5 8.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M15 5H19V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 16.5V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M9.5 19H14.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(monthName, year) {
  const monthIndex = MONTHS.indexOf(monthName);
  if (monthIndex === -1) return 31;
  return new Date(year, monthIndex + 1, 0).getDate();
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => CURRENT_YEAR - i);

// 🎡 Ultra-Smooth Native-Style Animated Wheel Column
function SmoothWheelColumn({
  data,
  selectedValue,
  onValueChange,
  flex = 1
}) {
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const selectedIndex = data.indexOf(selectedValue);

  // Initial and reactive auto-centering on change
  useEffect(() => {
    if (selectedIndex >= 0 && scrollRef.current) {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: true
      });
    }
  }, [selectedIndex]);

  // Update on Momentum Scroll End / Drag End
  const handleScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), data.length - 1));
    if (data[index] !== undefined && data[index] !== selectedValue) {
      onValueChange(data[index]);
    }
  };

  return (
    <View style={{ flex, height: WHEEL_HEIGHT, overflow: 'hidden' }}>
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        nestedScrollEnabled
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: PADDING }}
      >
        {data.map((item, idx) => {
          const inputRange = [
            (idx - 2) * ITEM_HEIGHT,
            (idx - 1) * ITEM_HEIGHT,
            idx * ITEM_HEIGHT,
            (idx + 1) * ITEM_HEIGHT,
            (idx + 2) * ITEM_HEIGHT
          ];

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.55, 1, 0.55, 0.2],
            extrapolate: 'clamp'
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.82, 0.94, 1.12, 0.94, 0.82],
            extrapolate: 'clamp'
          });

          return (
            <TouchableOpacity
              key={idx}
              style={styles.wheelItemContainer}
              onPress={() => {
                onValueChange(item);
                scrollRef.current?.scrollTo({
                  y: idx * ITEM_HEIGHT,
                  animated: true
                });
              }}
              activeOpacity={0.7}
            >
              <Animated.Text
                style={[
                  styles.wheelItemText,
                  {
                    opacity,
                    transform: [{ scale }]
                  }
                ]}
                numberOfLines={1}
              >
                {item}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

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
  userGender,
  setUserGender,
  birthDay = 23,
  setBirthDay,
  birthMonth = 'August',
  setBirthMonth,
  birthYear = 2008,
  setBirthYear,
  onFinishOnboarding,
  onBackToAuth
}) {
  // ==========================================
  // STEP 1: WHAT SHOULD WE CALL YOU?
  // ==========================================
  if (onboardingStep === 1) {
    const isNameValid = nameInput.trim().length > 0;

    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        <View style={styles.namePageContainer}>
          <View style={styles.nameTopBar}>
            <TouchableOpacity
              onPress={onBackToAuth}
              style={styles.nameBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={C.white} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.nameScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.nameLogoWrapper}>
              <Image
                source={require('../../assets/lift_logo.png')}
                style={styles.nameLiftLogo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.nameHeading}>What should we call you?</Text>
            <Text style={styles.nameSubhead}>Let's personalize your fitness journey.</Text>

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

  // ==========================================
  // STEP 2: SELECT UNITS
  // ==========================================
  if (onboardingStep === 2) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        <View style={styles.namePageContainer}>
          <View style={styles.nameTopBar}>
            <TouchableOpacity
              onPress={() => setOnboardingStep(1)}
              style={styles.nameBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={C.white} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.unitsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.unitsTitle}>Select Units</Text>

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

          <View style={styles.nameBottomBar}>
            <TouchableOpacity
              style={styles.nameContinueBtn}
              onPress={() => setOnboardingStep(3)}
              activeOpacity={0.85}
            >
              <Text style={styles.nameContinueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // STEP 3: WHAT IS YOUR GENDER?
  // ==========================================
  if (onboardingStep === 3) {
    const genderOptions = [
      { id: 'male', label: 'Male', IconComponent: MaleIcon },
      { id: 'female', label: 'Female', IconComponent: FemaleIcon },
      { id: 'other', label: 'Other', IconComponent: OtherGenderIcon }
    ];

    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        <View style={styles.namePageContainer}>
          <View style={styles.nameTopBar}>
            <TouchableOpacity
              onPress={() => setOnboardingStep(2)}
              style={styles.nameBackBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={C.white} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.unitsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.genderTitle}>What is your gender?</Text>

            <View style={styles.genderListContainer}>
              {genderOptions.map((item) => {
                const isSelected = userGender === item.id;
                const { IconComponent } = item;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.genderCard,
                      isSelected && styles.genderCardActive
                    ]}
                    onPress={() => setUserGender(item.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.genderLeftGroup}>
                      <View style={styles.genderIconBox}>
                        <IconComponent color="#FFFFFF" size={22} />
                      </View>
                      <Text style={styles.genderLabel}>{item.label}</Text>
                    </View>

                    <View
                      style={[
                        styles.genderRadioCircle,
                        isSelected && styles.genderRadioCircleActive
                      ]}
                    >
                      {isSelected && <View style={styles.genderRadioInnerDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.genderBottomContainer}>
            <Text style={styles.genderPrivacyText}>Your data is private and secure.</Text>

            <TouchableOpacity
              style={styles.genderContinueBtn}
              onPress={() => setOnboardingStep(4)}
              activeOpacity={0.85}
            >
              <Text style={styles.genderContinueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // STEP 4: WHEN IS YOUR BIRTHDAY?
  // ==========================================
  const maxDays = getDaysInMonth(birthMonth, birthYear);
  const currentDaysList = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Automatically clamp day if month/year changes (e.g. Feb 28 vs 29 vs 31)
  useEffect(() => {
    if (birthDay > maxDays && setBirthDay) {
      setBirthDay(maxDays);
    }
  }, [birthMonth, birthYear, maxDays]);

  const handleContinueBirthday = () => {
    const monthIndex = MONTHS.indexOf(birthMonth);
    const selectedDate = new Date(birthYear, monthIndex, birthDay);
    const today = new Date();

    if (selectedDate > today) {
      Alert.alert('Invalid Birthday', 'Birthday cannot be in the future.');
      return;
    }

    if (onFinishOnboarding) {
      onFinishOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.birthdayPageContainer}>
        {/* Top Bar with Back Button */}
        <View style={styles.nameTopBar}>
          <TouchableOpacity
            onPress={() => setOnboardingStep(3)}
            style={styles.nameBackBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* Balanced Body Area */}
        <View style={styles.birthdayBodyContainer}>
          <View style={styles.birthdayHeaderContainer}>
            <Text style={styles.birthdayTitle}>When is your birthday?</Text>
            <Text style={styles.birthdaySubtitle}>
              This personalizes your workout targets and calorie baseline.
            </Text>
          </View>

          {/* 🎂 Ultra-Smooth Interactive Birthday Wheel Picker */}
          <View style={styles.pickerMainWrapper}>
            {/* Central Highlight Capsule Band */}
            <View pointerEvents="none" style={styles.selectionHighlightCapsule} />

            <View style={styles.pickerColumnsRow}>
              {/* 1. Day Column */}
              <SmoothWheelColumn
                data={currentDaysList}
                selectedValue={birthDay > maxDays ? maxDays : birthDay}
                onValueChange={setBirthDay}
                flex={1}
              />

              {/* 2. Month Column */}
              <SmoothWheelColumn
                data={MONTHS}
                selectedValue={birthMonth}
                onValueChange={setBirthMonth}
                flex={1.4}
              />

              {/* 3. Year Column */}
              <SmoothWheelColumn
                data={YEARS}
                selectedValue={birthYear}
                onValueChange={setBirthYear}
                flex={1.1}
              />
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.genderBottomContainer}>
          <Text style={styles.genderPrivacyText}>Your data is private and secure.</Text>

          <TouchableOpacity
            style={styles.birthdayContinueBtn}
            onPress={handleContinueBirthday}
            activeOpacity={0.85}
          >
            <Text style={styles.birthdayContinueBtnText}>Continue</Text>
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
  nameBackBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2C2C2E' },
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
  unitSegmentTextActive: { color: '#FFFFFF', fontWeight: '900' },

  // 🚻 Gender Screen Styles
  genderTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 24 },
  genderListContainer: { gap: 14 },
  genderCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  genderCardActive: {
    backgroundColor: '#242428',
    borderColor: '#3A3A3C'
  },
  genderLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  genderIconBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  genderLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700'
  },
  genderRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#545458',
    justifyContent: 'center',
    alignItems: 'center'
  },
  genderRadioCircleActive: {
    borderColor: '#FFFFFF'
  },
  genderRadioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF'
  },
  genderBottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12
  },
  genderPrivacyText: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500'
  },
  genderContinueBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  genderContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800'
  },

  // 🎂 Birthday Wheel Picker Styles
  birthdayPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000000'
  },
  birthdayBodyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  birthdayHeaderContainer: {
    marginBottom: 24,
    alignItems: 'center'
  },
  birthdayTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  birthdaySubtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20
  },
  pickerMainWrapper: {
    width: '100%',
    height: WHEEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#0D0D0F',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#242428',
    paddingHorizontal: 10
  },
  selectionHighlightCapsule: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: ITEM_HEIGHT,
    top: PADDING,
    backgroundColor: '#1E1E22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2E2E34',
    zIndex: 0
  },
  pickerColumnsRow: {
    flexDirection: 'row',
    width: '100%',
    height: WHEEL_HEIGHT,
    zIndex: 1
  },
  wheelItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wheelItemText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  birthdayContinueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  birthdayContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900'
  }
});
