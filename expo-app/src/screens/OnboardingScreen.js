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

// 🎡 Apple Alarm 3D Cylindrical Wheel Column
function Apple3DWheelColumn({
  data,
  selectedValue,
  onValueChange,
  flex = 1
}) {
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const selectedIndex = data.indexOf(selectedValue);

  // Auto-Center on initial load & external updates
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
          const itemOffset = idx * ITEM_HEIGHT;
          const inputRange = [
            itemOffset - 2 * ITEM_HEIGHT,
            itemOffset - ITEM_HEIGHT,
            itemOffset,
            itemOffset + ITEM_HEIGHT,
            itemOffset + 2 * ITEM_HEIGHT
          ];

          const rotateX = scrollY.interpolate({
            inputRange,
            outputRange: ['50deg', '25deg', '0deg', '-25deg', '-50deg'],
            extrapolate: 'clamp'
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.78, 0.92, 1.15, 0.92, 0.78],
            extrapolate: 'clamp'
          });

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.18, 0.55, 1.0, 0.55, 0.18],
            extrapolate: 'clamp'
          });

          const translateY = scrollY.interpolate({
            inputRange,
            outputRange: [8, 3, 0, -3, -8],
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
              <Animated.View
                style={{
                  transform: [
                    { perspective: 1000 },
                    { rotateX },
                    { scale },
                    { translateY }
                  ],
                  opacity,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={styles.wheelItemText} numberOfLines={1}>
                  {item}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

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
  onFinishOnboarding,
  onBackToAuth
}) {
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
  if (onboardingStep === 4) {
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
    );
  }

  // ==========================================
  // STEP 5: WHAT IS YOUR WEIGHT?
  // ==========================================
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
    <SafeAreaView style={styles.authContainer}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.weightPageContainer}>
        {/* Top Bar with Back Button */}
        <View style={styles.nameTopBar}>
          <TouchableOpacity
            onPress={() => setOnboardingStep(4)}
            style={styles.nameBackBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={C.white} />
          </TouchableOpacity>
        </View>

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
            onPress={onFinishOnboarding}
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
    backgroundColor: '#000000'
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
    backgroundColor: '#3B82F6',
    borderRadius: 1.5,
    bottom: 12,
    zIndex: 10
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
  }
});
