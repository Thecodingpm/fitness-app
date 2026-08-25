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
import { LinearGradient } from 'expo-linear-gradient';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { ArrowLeft, BicepsFlexed, Dumbbell, Flame, Scale } from 'lucide-react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { C } from '../constants/theme';

function OnboardingLinearBackdrop({ position = 'bottom' }) {
  if (position === 'top') {
    return (
      <LinearGradient
        colors={['#5C0000', '#3A0000', '#180000', '#000000', '#000000']}
        locations={[0, 0.16, 0.36, 0.62, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    );
  }
  return (
    <LinearGradient
      colors={['#000000', '#000000', '#180000', '#3A0000', '#5C0000']}
      locations={[0, 0.42, 0.68, 0.86, 1]}
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
    />
  );
}

const ITEM_HEIGHT = 46;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // 230px
const PADDING = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2; // 92px

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

const HEIGHTS_CM = Array.from({ length: 131 }, (_, i) => 100 + i); // 100 to 230 cm
const HEIGHTS_CM_LABELS = HEIGHTS_CM.map((h) => `${h} cm`);

const HEIGHTS_FT_IN = [];
for (let ft = 3; ft <= 7; ft++) {
  const minIn = ft === 3 ? 3 : 0;
  const maxIn = ft === 7 ? 6 : 11;
  for (let inch = minIn; inch <= maxIn; inch++) {
    HEIGHTS_FT_IN.push(`${ft} ft ${inch} in`);
  }
}

function parseFtInToCm(ftInStr) {
  const match = ftInStr.match(/(\d+)\s*ft\s*(\d+)\s*in/);
  if (match) {
    const ft = parseInt(match[1], 10);
    const inch = parseInt(match[2], 10);
    return Math.round(ft * 30.48 + inch * 2.54);
  }
  return 170;
}

function cmToNearestFtInStr(cm) {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inch = Math.round(totalInches % 12);
  const clampedFt = Math.max(3, Math.min(7, ft));
  const clampedIn = Math.max(0, Math.min(11, inch));
  return `${clampedFt} ft ${clampedIn} in`;
}

const GOALS_LIST = [
  {
    id: 'build_muscle',
    title: 'Build Muscle',
    icon: BicepsFlexed
  },
  {
    id: 'gain_strength',
    title: 'Gain Strength',
    icon: Dumbbell
  },
  {
    id: 'fat_loss',
    title: 'Fat Loss',
    icon: Flame
  }
];

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    years: '0-1 year'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    years: '1-3 years'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    years: '3+ years'
  }
];

const GUIDANCE_OPTIONS = [
  {
    id: 'build_own',
    title: 'I want to build my own workouts'
  },
  {
    id: 'guided',
    title: 'I want to be guided'
  }
];

// 🎡 Official @quidone/react-native-wheel-picker Column (Memoized for 60FPS)
const Apple3DWheelColumn = React.memo(function Apple3DWheelColumn({
  data,
  selectedValue,
  onValueChange,
  flex = 1
}) {
  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      value: item,
      label: String(item)
    }));
  }, [data]);

  return (
    <View style={{ flex, height: WHEEL_HEIGHT, justifyContent: 'center' }}>
      <WheelPicker
        data={formattedData}
        value={selectedValue}
        onValueChanged={({ item }) => {
          if (item && item.value !== undefined && item.value !== selectedValue) {
            onValueChange(item.value);
          }
        }}
        itemHeight={ITEM_HEIGHT}
        visibleItemCount={VISIBLE_ITEMS}
        enableScrollByTapOnItem={true}
        itemTextStyle={styles.wheelItemText}
        overlayItemStyle={styles.quidoneSelectionOverlay}
      />
    </View>
  );
});

// 📏 Horizontal Interactive Weight Ruler Component
const SCREEN_WIDTH = Dimensions.get('window').width;
const HALF_WIDTH = SCREEN_WIDTH / 2;
const RULER_STEP = 10; // 10px per 0.1 increment => 100px per whole unit

function WeightRulerPicker({
  value,
  onValueChange,
  isLb = false
}) {
  const minVal = isLb ? 66 : 30;
  const maxVal = isLb ? 440 : 200;
  const scrollRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Sync scroll position with value
  useEffect(() => {
    if (!isScrollingRef.current && scrollRef.current) {
      const targetOffset = (value - minVal) * 10 * RULER_STEP;
      scrollRef.current?.scrollTo({ x: targetOffset, animated: false });
    }
  }, [isLb]);

  const handleScroll = (e) => {
    isScrollingRef.current = true;
    const x = e.nativeEvent.contentOffset.x;
    const rawVal = minVal + x / (10 * RULER_STEP);
    const clamped = Math.max(minVal, Math.min(maxVal, rawVal));
    const rounded = Math.round(clamped * 10) / 10;
    if (Math.abs(rounded - value) >= 0.05) {
      onValueChange(rounded);
    }
  };

  const handleScrollEnd = (e) => {
    isScrollingRef.current = false;
    const x = e.nativeEvent.contentOffset.x;
    const rawVal = minVal + x / (10 * RULER_STEP);
    const clamped = Math.max(minVal, Math.min(maxVal, rawVal));
    const rounded = Math.round(clamped * 10) / 10;
    onValueChange(rounded);
  };

  const wholeUnits = [];
  for (let u = minVal; u <= maxVal; u++) {
    wholeUnits.push(u);
  }

  return (
    <View style={styles.rulerContainer}>
      {/* Center Blue / Indicator Needle */}
      <View pointerEvents="none" style={styles.rulerCenterNeedle} />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={RULER_STEP}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{
          paddingHorizontal: HALF_WIDTH
        }}
      >
        {wholeUnits.map((u) => {
          return (
            <View key={u} style={styles.rulerUnitBlock}>
              {/* Unit Number Label */}
              <Text style={styles.rulerNumberLabel}>{u}</Text>

              {/* 10 Sub-division Ticks */}
              <View style={styles.rulerTicksRow}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const isMajor = i === 0;
                  const isMedium = i === 5;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.rulerTick,
                        isMajor
                          ? styles.rulerTickMajor
                          : isMedium
                          ? styles.rulerTickMedium
                          : styles.rulerTickMinor
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// 🔝 Reusable Consistent LIFT Top Header Bar
function OnboardingTopHeader({ onBack, onSkip, showSkip = false }) {
  return (
    <View style={styles.onboardingTopBar}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.nameBackBtn}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color={C.white} />
      </TouchableOpacity>

      <View style={styles.topBarLogoContainer}>
        <Image
          source={require('../../assets/lift_logo.png')}
          style={styles.topBarLiftLogo}
          resizeMode="contain"
        />
      </View>

      {showSkip ? (
        <TouchableOpacity
          onPress={onSkip}
          style={styles.guidanceSkipBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.guidanceSkipBtnText}>Skip</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.topBarRightSpacer} />
      )}
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
  userWeight = 72.0,
  setUserWeight,
  userHeightCm = 170,
  setUserHeightCm,
  topGoal = 'build_muscle',
  setTopGoal,
  trainingExperience = 'beginner',
  setTrainingExperience,
  workoutGuidance = 'build_own',
  setWorkoutGuidance,
  fitnessGoals = ['Build Muscle'],
  setFitnessGoals,
  onFinishOnboarding,
  onBackToAuth
}) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  // Compute valid days and declare hooks at the top of the component
  const maxDays = getDaysInMonth(birthMonth, birthYear);
  const currentDaysList = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Automatically clamp day if month/year changes
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

    setOnboardingStep(5);
  };

  // ==========================================
  // STEP 1: WHAT SHOULD WE CALL YOU?
  // ==========================================
  if (onboardingStep === 1) {
      const isNameValid = nameInput.trim().length > 0;

      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
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
        </View>
      );
    }

    // ==========================================
    // STEP 2: SELECT UNITS
    // ==========================================
    if (onboardingStep === 2) {
      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.namePageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(1)} />

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
        </View>
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
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.namePageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(2)} />

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
        </View>
      );
    }

    // ==========================================
    // STEP 4: WHEN IS YOUR BIRTHDAY? (Apple Clock Timer Style + Bottom Glow)
    // ==========================================
    if (onboardingStep === 4) {
      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          {/* 🔴 Studio Crimson BOTTOM Linear Gradient (Zero Red at Top) */}
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.birthdayPageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(3)} />

              {/* Balanced Body Area */}
              <View style={styles.birthdayBodyContainer}>
                <View style={styles.birthdayHeaderContainer}>
                  <Text style={styles.birthdayTitle}>When is your birthday?</Text>
                  <Text style={styles.birthdaySubtitle}>
                    This personalizes your workout targets and calorie baseline.
                  </Text>
                </View>

                {/* 🎂 Frameless Wheel Picker */}
                <View style={styles.pickerMainWrapper}>
                  {/* Central Frosted Highlight Capsule */}
                  <View pointerEvents="none" style={styles.selectionHighlightCapsule} />

                  <View style={styles.pickerColumnsRow}>
                    {/* 1. Day Column */}
                    <Apple3DWheelColumn
                      data={currentDaysList}
                      selectedValue={birthDay > maxDays ? maxDays : birthDay}
                      onValueChange={setBirthDay}
                      flex={1}
                    />

                    {/* 2. Month Column */}
                    <Apple3DWheelColumn
                      data={MONTHS}
                      selectedValue={birthMonth}
                      onValueChange={setBirthMonth}
                      flex={1.4}
                    />

                    {/* 3. Year Column */}
                    <Apple3DWheelColumn
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
        </View>
      );
    }

    // ==========================================
    // STEP 5: WHAT IS YOUR WEIGHT?
    // ==========================================
    if (onboardingStep === 5) {
      const isWeightLb = unitWeight === 'lbs';

      const handleToggleWeightUnit = (unit) => {
        if (unit === unitWeight) return;
        if (unit === 'lbs') {
          const converted = Math.round(userWeight * 2.20462 * 10) / 10;
          setUserWeight(converted);
          setUnitWeight('lbs');
        } else {
          const converted = Math.round((userWeight / 2.20462) * 10) / 10;
          setUserWeight(converted);
          setUnitWeight('kg');
        }
      };

      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.weightPageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(4)} />

              {/* Weight Content Area */}
              <View style={styles.weightContentContainer}>
                <Text style={styles.weightTitle}>What is your weight?</Text>

                {/* Unit Toggle Segment: Kilograms / Pounds */}
                <View style={styles.weightSegmentContainer}>
                  <TouchableOpacity
                    style={[
                      styles.weightSegmentBtn,
                      !isWeightLb && styles.weightSegmentBtnActive
                    ]}
                    onPress={() => handleToggleWeightUnit('kg')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.weightSegmentBtnText,
                        !isWeightLb && styles.weightSegmentBtnTextActive
                      ]}
                    >
                      Kilograms
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.weightSegmentBtn,
                      isWeightLb && styles.weightSegmentBtnActive
                    ]}
                    onPress={() => handleToggleWeightUnit('lbs')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.weightSegmentBtnText,
                        isWeightLb && styles.weightSegmentBtnTextActive
                      ]}
                    >
                      Pounds
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Big Weight Number Display */}
                <View style={styles.weightDisplayRow}>
                  <Text style={styles.weightLargeNumber}>
                    {Number(userWeight).toFixed(1)}
                  </Text>
                  <Text style={styles.weightUnitLabel}>
                    {isWeightLb ? 'lbs' : 'kg'}
                  </Text>
                </View>

                {/* Interactive Horizontal Ruler Picker */}
                <WeightRulerPicker
                  value={userWeight}
                  onValueChange={setUserWeight}
                  isLb={isWeightLb}
                />
              </View>

              {/* Bottom Bar with Privacy Text and Continue CTA */}
              <View style={styles.genderBottomContainer}>
                <Text style={styles.genderPrivacyText}>Your data is private and secure.</Text>

                <TouchableOpacity
                  style={styles.birthdayContinueBtn}
                  onPress={() => setOnboardingStep(6)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.birthdayContinueBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }

    // ==========================================
    // STEP 6: WHAT IS YOUR HEIGHT?
    // ==========================================
    if (onboardingStep === 6) {
      const isHeightFtIn = unitBody === 'in';

      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.heightPageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(5)} />

              {/* Height Content Area */}
              <View style={styles.heightContentContainer}>
                <Text style={styles.heightTitle}>What is your height?</Text>

                {/* Unit Toggle Segment: Centimeters / Feet and Inches */}
                <View style={styles.weightSegmentContainer}>
                  <TouchableOpacity
                    style={[
                      styles.weightSegmentBtn,
                      !isHeightFtIn && styles.weightSegmentBtnActive
                    ]}
                    onPress={() => setUnitBody('cm')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.weightSegmentBtnText,
                        !isHeightFtIn && styles.weightSegmentBtnTextActive
                      ]}
                    >
                      Centimeters
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.weightSegmentBtn,
                      isHeightFtIn && styles.weightSegmentBtnActive
                    ]}
                    onPress={() => setUnitBody('in')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.weightSegmentBtnText,
                        isHeightFtIn && styles.weightSegmentBtnTextActive
                      ]}
                    >
                      Feet and Inches
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 📏 Quidone Wheel Height Selector */}
                <View style={styles.pickerMainWrapper}>
                  {/* Central Highlight Capsule */}
                  <View pointerEvents="none" style={styles.selectionHighlightCapsule} />

                  <View style={styles.pickerColumnsRow}>
                    {!isHeightFtIn ? (
                      <Apple3DWheelColumn
                        data={HEIGHTS_CM_LABELS}
                        selectedValue={`${userHeightCm} cm`}
                        onValueChange={(selectedStr) => {
                          const num = parseInt(selectedStr, 10);
                          if (!isNaN(num) && setUserHeightCm) setUserHeightCm(num);
                        }}
                        flex={1}
                      />
                    ) : (
                      <Apple3DWheelColumn
                        data={HEIGHTS_FT_IN}
                        selectedValue={cmToNearestFtInStr(userHeightCm)}
                        onValueChange={(selectedStr) => {
                          const cmVal = parseFtInToCm(selectedStr);
                          if (setUserHeightCm) setUserHeightCm(cmVal);
                        }}
                        flex={1}
                      />
                    )}
                  </View>
                </View>
              </View>

              {/* Bottom Bar with Privacy Text and Continue CTA */}
              <View style={styles.genderBottomContainer}>
                <Text style={styles.genderPrivacyText}>Your data is private and secure.</Text>

                <TouchableOpacity
                  style={styles.birthdayContinueBtn}
                  onPress={() => setOnboardingStep(7)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.birthdayContinueBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }

    // ==========================================
    // STEP 7: WHAT IS YOUR TOP GOAL?
    // ==========================================
    if (onboardingStep === 7) {
      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.goalPageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(6)} />

              {/* Goal Content Area */}
              <View style={styles.goalContentContainer}>
                <Text style={styles.goalTitle}>What is your top goal?</Text>

                {/* Goal Options List */}
                <View style={styles.goalListContainer}>
                  {GOALS_LIST.map((item) => {
                    const isSelected = topGoal === item.id;
                    const IconComponent = item.icon;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.goalCard,
                          isSelected && styles.goalCardActive
                        ]}
                        onPress={() => setTopGoal && setTopGoal(item.id)}
                        activeOpacity={0.75}
                      >
                        <View style={styles.goalLeftGroup}>
                          <View style={styles.goalIconBox}>
                            <IconComponent color="#FFFFFF" size={24} />
                          </View>
                          <Text style={styles.goalLabel}>{item.title}</Text>
                        </View>

                        <View
                          style={[
                            styles.goalRadioCircle,
                            isSelected && styles.goalRadioCircleActive
                          ]}
                        >
                          {isSelected && <View style={styles.goalRadioInnerDot} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.genderBottomContainer}>
                <TouchableOpacity
                  style={styles.goalContinueBtn}
                  onPress={() => setOnboardingStep(8)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.goalContinueBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }

    // ==========================================
    // STEP 8: HOW MUCH TRAINING EXPERIENCE DO YOU HAVE?
    // ==========================================
    if (onboardingStep === 8) {
      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.experiencePageContainer}>
              <OnboardingTopHeader onBack={() => setOnboardingStep(7)} />

              {/* Experience Content Area */}
              <View style={styles.experienceContentContainer}>
                <Text style={styles.experienceTitle}>
                  How much training experience do you have?
                </Text>

                {/* Experience Options List */}
                <View style={styles.experienceListContainer}>
                  {EXPERIENCE_LEVELS.map((item) => {
                    const isSelected = trainingExperience === item.id;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.experienceCard,
                          isSelected && styles.experienceCardActive
                        ]}
                        onPress={() => setTrainingExperience && setTrainingExperience(item.id)}
                        activeOpacity={0.75}
                      >
                        <View style={styles.experienceLeftGroup}>
                          <Text style={styles.experienceLabel}>{item.title}</Text>
                          <Text style={styles.experienceSubtitle}>{item.years}</Text>
                        </View>

                        <View
                          style={[
                            styles.experienceRadioCircle,
                            isSelected && styles.experienceRadioCircleActive
                          ]}
                        >
                          {isSelected && <View style={styles.experienceRadioInnerDot} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.genderBottomContainer}>
                <TouchableOpacity
                  style={styles.experienceContinueBtn}
                  onPress={() => setOnboardingStep(9)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.experienceContinueBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }

    // ==========================================
    // STEP 9: WOULD YOU LIKE TO BUILD YOUR OWN WORKOUTS OR BE GUIDED?
    // ==========================================
    if (onboardingStep === 9) {
      return (
        <View style={styles.authContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <OnboardingLinearBackdrop position="bottom" />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.guidancePageContainer}>
              <OnboardingTopHeader
                onBack={() => setOnboardingStep(8)}
                onSkip={() => setOnboardingStep(10)}
                showSkip={true}
              />

              {/* Guidance Content Area */}
              <View style={styles.guidanceContentContainer}>
                <Text style={styles.guidanceTitle}>
                  Would you like to build your own workouts or be guided?
                </Text>

                {/* Guidance Options List */}
                <View style={styles.guidanceListContainer}>
                  {GUIDANCE_OPTIONS.map((item) => {
                    const isSelected = workoutGuidance === item.id;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.guidanceCard,
                          isSelected && styles.guidanceCardActive
                        ]}
                        onPress={() => setWorkoutGuidance && setWorkoutGuidance(item.id)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.guidanceLabel}>{item.title}</Text>

                        <View
                          style={[
                            styles.guidanceRadioCircle,
                            isSelected && styles.guidanceRadioCircleActive
                          ]}
                        >
                          {isSelected && <View style={styles.guidanceRadioInnerDot} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.genderBottomContainer}>
                <TouchableOpacity
                  style={styles.guidanceContinueBtn}
                  onPress={() => setOnboardingStep(10)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.guidanceContinueBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }

    // ==========================================
    // STEP 10: YOUR FITNESS GOAL (Pill Selection Screen)
    // ==========================================
    if (onboardingStep === 10) {
      const currentGoals = Array.isArray(fitnessGoals) ? fitnessGoals : ['Build Muscle'];

      const handleToggleGoal = (goal) => {
        let updated;
        if (currentGoals.includes(goal)) {
          if (currentGoals.length > 1) {
            updated = currentGoals.filter((g) => g !== goal);
          } else {
            updated = currentGoals;
          }
        } else {
          updated = [...currentGoals, goal];
        }
        if (setFitnessGoals) {
          setFitnessGoals(updated);
        }
      };

      return (
        <View style={styles.authContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <OnboardingLinearBackdrop position="bottom" />

        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.fitnessGoalPageContainer}>
            <OnboardingTopHeader onBack={() => setOnboardingStep(9)} />

            {/* Content Area */}
            <ScrollView
              contentContainerStyle={styles.fitnessGoalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Header Title & Subtitle */}
              <View style={styles.fitnessGoalHeaderBlock}>
                <Text style={styles.fitnessGoalTitle}>Your Fitness Goal</Text>
                <Text style={styles.fitnessGoalSubtitle}>
                  Choose the focus that best matches your training journey.
                </Text>
              </View>

              {/* Staggered Capsule Pills Container */}
              <View style={styles.fitnessGoalPillsContainer}>
                {/* Row 1: Build Muscle | Gain Strength */}
                <View style={styles.fitnessGoalPillRow}>
                  {['Build Muscle', 'Gain Strength'].map((goal) => {
                    const isSelected = currentGoals.includes(goal);
                    return (
                      <TouchableOpacity
                        key={goal}
                        style={[
                          styles.fitnessGoalPillBtn,
                          isSelected && styles.fitnessGoalPillBtnSelected
                        ]}
                        onPress={() => handleToggleGoal(goal)}
                        activeOpacity={0.75}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={['#7A0000', '#B31F1F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.fitnessGoalPillGradient}
                          >
                            <Text style={styles.fitnessGoalPillTextSelected}>{goal}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.fitnessGoalPillUnselectedInner}>
                            <Text style={styles.fitnessGoalPillTextUnselected}>{goal}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Row 2: Improve Endurance | Lose Fat */}
                <View style={styles.fitnessGoalPillRow}>
                  {['Improve Endurance', 'Lose Fat'].map((goal) => {
                    const isSelected = currentGoals.includes(goal);
                    return (
                      <TouchableOpacity
                        key={goal}
                        style={[
                          styles.fitnessGoalPillBtn,
                          isSelected && styles.fitnessGoalPillBtnSelected
                        ]}
                        onPress={() => handleToggleGoal(goal)}
                        activeOpacity={0.75}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={['#7A0000', '#B31F1F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.fitnessGoalPillGradient}
                          >
                            <Text style={styles.fitnessGoalPillTextSelected}>{goal}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.fitnessGoalPillUnselectedInner}>
                            <Text style={styles.fitnessGoalPillTextUnselected}>{goal}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Row 3: Increase Flexibility & Mobility */}
                <View style={styles.fitnessGoalPillRow}>
                  {['Increase Flexibility & Mobility'].map((goal) => {
                    const isSelected = currentGoals.includes(goal);
                    return (
                      <TouchableOpacity
                        key={goal}
                        style={[
                          styles.fitnessGoalPillBtnWide,
                          isSelected && styles.fitnessGoalPillBtnSelected
                        ]}
                        onPress={() => handleToggleGoal(goal)}
                        activeOpacity={0.75}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={['#7A0000', '#B31F1F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.fitnessGoalPillGradient}
                          >
                            <Text style={styles.fitnessGoalPillTextSelected}>{goal}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.fitnessGoalPillUnselectedInner}>
                            <Text style={styles.fitnessGoalPillTextUnselected}>{goal}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Row 4: Maintain Shape | General Health */}
                <View style={styles.fitnessGoalPillRow}>
                  {['Maintain Shape', 'General Health'].map((goal) => {
                    const isSelected = currentGoals.includes(goal);
                    return (
                      <TouchableOpacity
                        key={goal}
                        style={[
                          styles.fitnessGoalPillBtn,
                          isSelected && styles.fitnessGoalPillBtnSelected
                        ]}
                        onPress={() => handleToggleGoal(goal)}
                        activeOpacity={0.75}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={['#7A0000', '#B31F1F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.fitnessGoalPillGradient}
                          >
                            <Text style={styles.fitnessGoalPillTextSelected}>{goal}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.fitnessGoalPillUnselectedInner}>
                            <Text style={styles.fitnessGoalPillTextUnselected}>{goal}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Row 5: Rehab / Recovery */}
                <View style={styles.fitnessGoalPillRow}>
                  {['Rehab / Recovery'].map((goal) => {
                    const isSelected = currentGoals.includes(goal);
                    return (
                      <TouchableOpacity
                        key={goal}
                        style={[
                          styles.fitnessGoalPillBtnMedium,
                          isSelected && styles.fitnessGoalPillBtnSelected
                        ]}
                        onPress={() => handleToggleGoal(goal)}
                        activeOpacity={0.75}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={['#7A0000', '#B31F1F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.fitnessGoalPillGradient}
                          >
                            <Text style={styles.fitnessGoalPillTextSelected}>{goal}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.fitnessGoalPillUnselectedInner}>
                            <Text style={styles.fitnessGoalPillTextUnselected}>{goal}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Bottom Section */}
            <View style={styles.genderBottomContainer}>
              <TouchableOpacity
                style={styles.fitnessGoalContinueBtn}
                onPress={() => setOnboardingStep(11)}
                activeOpacity={0.85}
              >
                <Text style={styles.fitnessGoalContinueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ==========================================
  // STEP 11: CHOOSE YOUR PLAN (Redesigned Subscription Screen)
  // ==========================================
  return (
    <View style={styles.authContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <OnboardingLinearBackdrop position="bottom" />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.paywallPageContainer}>
          <OnboardingTopHeader onBack={() => setOnboardingStep(10)} />

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={styles.paywallScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Headline & Subtext */}
            <Text style={styles.paywallHeading}>Choose Your Plan</Text>
            <Text style={styles.paywallSubhead}>Pick the plan that works best for you.</Text>

            {/* Plan Cards Container */}
            <View style={styles.paywallPlansContainer}>
              {/* 1. Monthly Plan Card */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedPlan('monthly')}
                style={[
                  styles.paywallPlanCardWrapper,
                  selectedPlan === 'monthly' && styles.paywallPlanCardWrapperActive
                ]}
              >
                {selectedPlan === 'monthly' ? (
                  <LinearGradient
                    colors={['#7A0000', '#B31F1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.paywallPlanCardGradient}
                  >
                    <View style={styles.paywallPlanCardLeft}>
                      <Text style={styles.paywallPlanTitle}>Monthly Plan</Text>
                      <Text style={styles.paywallPlanSubtitle}>Flexible, cancel anytime.</Text>
                    </View>

                    <View style={styles.paywallPlanPriceRow}>
                      <Text style={styles.paywallPlanPriceNumber}>$5</Text>
                      <Text style={styles.paywallPlanPriceUnit}>/month</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.paywallPlanCardUnselected}>
                    <View style={styles.paywallPlanCardLeft}>
                      <Text style={styles.paywallPlanTitle}>Monthly Plan</Text>
                      <Text style={styles.paywallPlanSubtitle}>Flexible, cancel anytime.</Text>
                    </View>

                    <View style={styles.paywallPlanPriceRow}>
                      <Text style={styles.paywallPlanPriceNumber}>$5</Text>
                      <Text style={styles.paywallPlanPriceUnit}>/month</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* 2. Yearly Plan Card */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedPlan('yearly')}
                style={[
                  styles.paywallPlanCardWrapper,
                  selectedPlan === 'yearly' && styles.paywallPlanCardWrapperActive
                ]}
              >
                {selectedPlan === 'yearly' ? (
                  <LinearGradient
                    colors={['#7A0000', '#B31F1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.paywallPlanCardGradient}
                  >
                    {/* Best Value Badge */}
                    <View style={styles.paywallBestValueBadge}>
                      <Text style={styles.paywallBestValueBadgeText}>★ Best Value</Text>
                    </View>

                    <View style={styles.paywallPlanCardLeft}>
                      <Text style={styles.paywallPlanTitle}>Yearly Plan</Text>
                      <Text style={styles.paywallPlanSubtitle}>Save more with long-term commitment.</Text>
                    </View>

                    <View style={styles.paywallPlanPriceRow}>
                      <Text style={styles.paywallPlanPriceNumber}>$50</Text>
                      <Text style={styles.paywallPlanPriceUnit}>/year</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.paywallPlanCardUnselected}>
                    {/* Best Value Badge */}
                    <View style={styles.paywallBestValueBadge}>
                      <Text style={styles.paywallBestValueBadgeText}>★ Best Value</Text>
                    </View>

                    <View style={styles.paywallPlanCardLeft}>
                      <Text style={styles.paywallPlanTitle}>Yearly Plan</Text>
                      <Text style={styles.paywallPlanSubtitle}>Save more with long-term commitment.</Text>
                    </View>

                    <View style={styles.paywallPlanPriceRow}>
                      <Text style={styles.paywallPlanPriceNumber}>$50</Text>
                      <Text style={styles.paywallPlanPriceUnit}>/year</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Disclaimer Text */}
            <Text style={styles.paywallDisclaimerText}>
              Cancel anytime from your account settings.
            </Text>
          </ScrollView>

          {/* Bottom Actions: Skip & Subscribe Side-by-Side */}
          <View style={styles.paywallBottomActionsRow}>
            {/* Skip Button (Secondary Style) */}
            <TouchableOpacity
              style={styles.paywallSkipBtn}
              onPress={onFinishOnboarding}
              activeOpacity={0.75}
            >
              <Text style={styles.paywallSkipBtnText}>Skip</Text>
            </TouchableOpacity>

            {/* Subscribe Button (Primary Red Style) */}
            <TouchableOpacity
              style={styles.paywallSubscribeBtnWrapper}
              onPress={onFinishOnboarding}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#7A0000', '#B31F1F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.paywallSubscribeBtnGradient}
              >
                <Text style={styles.paywallSubscribeBtnText}>Subscribe</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

  const styles = StyleSheet.create({
    authContainer: { flex: 1, backgroundColor: '#09090B', position: 'relative' },
  // 🎯 "Your Fitness Goal" Screen Styles
  fitnessGoalPageContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  fitnessGoalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center'
  },
  fitnessGoalHeaderBlock: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16
  },
  fitnessGoalTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5
  },
  fitnessGoalSubtitle: {
    color: '#9A9A9A',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500'
  },
  fitnessGoalPillsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14
  },
  fitnessGoalPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  fitnessGoalPillBtn: {
    borderRadius: 25,
    overflow: 'hidden',
    minHeight: 50
  },
  fitnessGoalPillBtnWide: {
    borderRadius: 25,
    overflow: 'hidden',
    minHeight: 50,
    minWidth: 260
  },
  fitnessGoalPillBtnMedium: {
    borderRadius: 25,
    overflow: 'hidden',
    minHeight: 50,
    minWidth: 170
  },
  fitnessGoalPillBtnSelected: {
    shadowColor: '#B31F1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5
  },
  fitnessGoalPillGradient: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fitnessGoalPillUnselectedInner: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2E2E34',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fitnessGoalPillTextSelected: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  fitnessGoalPillTextUnselected: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  fitnessGoalContinueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fitnessGoalContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900'
  },

  // 💎 "Choose Your Plan" Paywall Styles
  paywallPageContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  paywallScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    alignItems: 'center'
  },
  paywallHeading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  paywallSubhead: {
    color: '#9A9A9A',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 20
  },
  paywallPlansContainer: {
    width: '100%',
    gap: 16
  },
  paywallPlanCardWrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  paywallPlanCardWrapperActive: {
    shadowColor: '#B31F1F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6
  },
  paywallPlanCardGradient: {
    padding: 22,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  paywallPlanCardUnselected: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2E2E34',
    padding: 22,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  paywallPlanCardLeft: {
    flex: 1,
    marginRight: 12
  },
  paywallPlanTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  paywallPlanSubtitle: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '500'
  },
  paywallPlanPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  paywallPlanPriceNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900'
  },
  paywallPlanPriceUnit: {
    color: '#D4D4D8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2
  },
  paywallBestValueBadge: {
    position: 'absolute',
    top: 10,
    right: 14,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  paywallBestValueBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  paywallDisclaimerText: {
    color: '#71717A',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18
  },
  paywallBottomActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
    alignItems: 'center'
  },
  paywallSkipBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2E2E34',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paywallSkipBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  paywallSubscribeBtnWrapper: {
    flex: 2,
    height: 54,
    borderRadius: 16,
    overflow: 'hidden'
  },
  paywallSubscribeBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paywallSubscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },

  onboardingTopGlow: {
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
      shadowOpacity: 0.45,
      shadowRadius: 80
    },
    onboardingBottomGlow: {
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
      shadowOpacity: 0.45,
      shadowRadius: 80
    },
    onboardingTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6
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
  topBarRightSpacer: {
    width: 40,
    height: 40
  },
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
    backgroundColor: 'transparent'
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
    backgroundColor: 'transparent'
  },
  selectionHighlightCapsule: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    top: PADDING,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 0
  },
  quidoneSelectionOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  pickerTopFadeMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 10
  },
  pickerBottomFadeMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 10
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
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center'
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
  },

  // ⚖️ Weight Screen Styles
  weightPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  weightContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  weightTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 20
  },
  weightSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 44
  },
  weightSegmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weightSegmentBtnActive: {
    backgroundColor: '#2E2E34',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2
  },
  weightSegmentBtnText: {
    color: '#71717A',
    fontSize: 15,
    fontWeight: '700'
  },
  weightSegmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  weightDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 30
  },
  weightLargeNumber: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -1
  },
  weightUnitLabel: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8
  },
  rulerContainer: {
    height: 110,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  rulerCenterNeedle: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1.5,
    width: 3,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    bottom: 12,
    zIndex: 10,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3
  },
  rulerUnitBlock: {
    width: 100,
    height: 90,
    position: 'relative'
  },
  rulerNumberLabel: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '700',
    position: 'absolute',
    top: 4,
    left: -8,
    width: 30,
    textAlign: 'center'
  },
  rulerTicksRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 40,
    alignItems: 'flex-end'
  },
  rulerTick: {
    width: 2,
    marginRight: 8
  },
  rulerTickMajor: {
    height: 38,
    backgroundColor: '#52525B'
  },
  rulerTickMedium: {
    height: 24,
    backgroundColor: '#3F3F46'
  },
  rulerTickMinor: {
    height: 16,
    backgroundColor: '#27272A'
  },

  // 📏 Height Screen Styles
  heightPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  heightContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  heightTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 20
  },
  heightWheelWrapper: {
    width: '100%',
    height: WHEEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 20
  },
  heightHighlightCapsule: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    top: PADDING,
    backgroundColor: '#1E1E22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2E2E34',
    zIndex: 0
  },

  // 🎯 Top Goal Screen Styles
  goalPageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  goalContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16
  },
  goalTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 28
  },
  goalListContainer: {
    gap: 16
  },
  goalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  goalCardActive: {
    backgroundColor: '#242428',
    borderColor: '#3A3A3C'
  },
  goalLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  goalIconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  goalLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700'
  },
  goalRadioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#545458',
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalRadioCircleActive: {
    borderColor: '#FFFFFF'
  },
  goalRadioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF'
  },
  goalContinueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900'
  },

  // 🏆 Experience Screen Styles
  experiencePageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  experienceContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16
  },
  experienceTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 28
  },
  experienceListContainer: {
    gap: 16
  },
  experienceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  experienceCardActive: {
    backgroundColor: '#242428',
    borderColor: '#3A3A3C'
  },
  experienceLeftGroup: {
    flex: 1
  },
  experienceLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700'
  },
  experienceSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500'
  },
  experienceRadioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#545458',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16
  },
  experienceRadioCircleActive: {
    borderColor: '#FFFFFF'
  },
  experienceRadioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF'
  },
  experienceContinueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  experienceContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900'
  },

  // 🧭 Guidance Screen Styles
  guidancePageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000000'
  },
  guidanceTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6
  },
  guidanceSkipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E'
  },
  guidanceSkipBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  guidanceContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16
  },
  guidanceTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 28
  },
  guidanceListContainer: {
    gap: 16
  },
  guidanceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  guidanceCardActive: {
    backgroundColor: '#242428',
    borderColor: '#3A3A3C'
  },
  guidanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    paddingRight: 12
  },
  guidanceRadioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#545458',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guidanceRadioCircleActive: {
    borderColor: '#FFFFFF'
  },
  guidanceRadioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF'
  },
  guidanceContinueBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guidanceContinueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900'
  }
});
