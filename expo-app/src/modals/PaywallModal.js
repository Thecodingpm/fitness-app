import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Sparkles,
  Check,
  Zap,
  Activity,
  TrendingUp,
  Volume2,
  ShieldCheck,
  Crown,
  Lock
} from 'lucide-react-native';
import { C } from '../constants/theme';
import { LiftBrandLogo } from '../components/LiftLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PRO_FEATURES = [
  {
    icon: Activity,
    color: '#EF4444',
    title: '3D Biomechanics & Joint Angles',
    desc: 'Real-time skeletal form visuals, tempo cues & joint safety zones.'
  },
  {
    icon: TrendingUp,
    color: '#F59E0B',
    title: 'Advanced 1RM & Volume Analytics',
    desc: 'Progressive overload curves, tonnage tracking & strength projections.'
  },
  {
    icon: Volume2,
    color: '#38BDF8',
    title: 'AI Real-Time Audio Voice Coach',
    desc: 'Audio form cues and cadence count directly into your earbuds.'
  },
  {
    icon: Zap,
    color: '#10B981',
    title: 'Unlimited Custom Workout Routines',
    desc: 'Create, log, and customize unrestricted hypertrophy splits.'
  }
];

export function PaywallModal({ visible, onClose, onProUnlocked }) {
  const [selectedPlan, setSelectedPlan] = useState('annual'); // 'annual' | 'monthly' | 'lifetime'

  const handleSubscribe = () => {
    const planName =
      selectedPlan === 'annual'
        ? 'Annual Plan ($4.99/mo • $59.99/yr)'
        : selectedPlan === 'monthly'
        ? 'Monthly Plan ($9.99/mo)'
        : 'Lifetime Access ($89.99)';

    Alert.alert(
      '⭐ LIFT PRO Activated!',
      `You are now subscribed to the ${planName}.\n\nAll deep analytics, 3D biomechanics, and AI coaching are unlocked!`,
      [
        {
          text: 'Get Started',
          onPress: () => {
            if (onProUnlocked) onProUnlocked();
            onClose();
          }
        }
      ]
    );
  };

  const handleSkipTesting = () => {
    if (onProUnlocked) onProUnlocked();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* 🔴 Studio Crimson Top Ambient Glow */}
        <LinearGradient
          colors={['#5A0F17', '#25060A', '#09090B', '#000000']}
          locations={[0, 0.28, 0.65, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <SafeAreaView style={{ flex: 1 }}>
          {/* Top Bar with Dismiss and Restore */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topLogoWrapper}>
              <LiftBrandLogo size={22} color="#FFFFFF" />
            </View>

            <TouchableOpacity
              onPress={() => Alert.alert('Restore Purchases', 'Your previous subscription records are up to date.')}
              activeOpacity={0.7}
              style={styles.restoreBtn}
            >
              <Text style={styles.restoreText}>Restore</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 👑 Crown & Pill Badge */}
            <View style={styles.badgeRow}>
              <LinearGradient
                colors={['#DC2626', '#991B1B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.crownPill}
              >
                <Crown size={12} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.crownPillText}>LIFT PRO ELITE</Text>
              </LinearGradient>
            </View>

            {/* Headline & Value Proposition */}
            <Text style={styles.headline}>
              Unlock Your True{'\n'}Strength Potential
            </Text>
            <Text style={styles.subheadline}>
              Get full access to AI audio coaching, deep 1RM curves, and 3D musculoskeletal form analysis.
            </Text>

            {/* 🌟 Feature Highlights Grid */}
            <View style={styles.featuresList}>
              {PRO_FEATURES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <View key={idx} style={styles.featureItem}>
                    <View style={[styles.featureIconBox, { backgroundColor: `${item.color}15`, borderColor: `${item.color}35` }]}>
                      <IconComponent size={18} color={item.color} />
                    </View>
                    <View style={styles.featureTextBox}>
                      <Text style={styles.featureTitle}>{item.title}</Text>
                      <Text style={styles.featureDesc}>{item.desc}</Text>
                    </View>
                    <Check size={16} color="#10B981" />
                  </View>
                );
              })}
            </View>

            {/* 💳 Subscription Plan Selectors */}
            <Text style={styles.sectionHeader}>SELECT YOUR PLAN</Text>
            <View style={styles.plansContainer}>
              {/* 1. ANNUAL PLAN (Recommended / Preselected) */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedPlan('annual')}
                style={[
                  styles.planCard,
                  selectedPlan === 'annual' && styles.planCardActive
                ]}
              >
                {/* Save 50% Top Ribbon */}
                <View style={styles.saveRibbon}>
                  <Text style={styles.saveRibbonText}>🔥 7-DAY FREE TRIAL • SAVE 50%</Text>
                </View>

                <View style={styles.planCardHeader}>
                  <View>
                    <Text style={styles.planName}>Annual Plan</Text>
                    <Text style={styles.planBillText}>Billed annually at $59.99/year</Text>
                  </View>
                  <View style={styles.priceColumn}>
                    <Text style={styles.priceMain}>$4.99</Text>
                    <Text style={styles.pricePeriod}>/month</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 2. MONTHLY PLAN */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedPlan('monthly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardActive
                ]}
              >
                <View style={styles.planCardHeader}>
                  <View>
                    <Text style={styles.planName}>Monthly Plan</Text>
                    <Text style={styles.planBillText}>Flexible, cancel anytime</Text>
                  </View>
                  <View style={styles.priceColumn}>
                    <Text style={styles.priceMain}>$9.99</Text>
                    <Text style={styles.pricePeriod}>/month</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 3. LIFETIME ACCESS */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedPlan('lifetime')}
                style={[
                  styles.planCard,
                  selectedPlan === 'lifetime' && styles.planCardActive
                ]}
              >
                <View style={styles.planCardHeader}>
                  <View>
                    <Text style={styles.planName}>Lifetime Access</Text>
                    <Text style={styles.planBillText}>One-time payment • Forever pro</Text>
                  </View>
                  <View style={styles.priceColumn}>
                    <Text style={styles.priceMain}>$89.99</Text>
                    <Text style={styles.pricePeriod}>one-time</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Micro Trust Note */}
            <Text style={styles.trustNote}>
              Cancel anytime in Google Play Store settings • No questions asked.
            </Text>
          </ScrollView>

          {/* ⚡ Bottom CTA Container with Primary Button & Small Testing Skip */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubscribe}
              style={styles.ctaButtonWrapper}
            >
              <LinearGradient
                colors={['#DC2626', '#991B1B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaButton}
              >
                <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.ctaButtonText}>
                  {selectedPlan === 'annual' ? 'Start 7-Day Free Trial' : 'Unlock LIFT PRO Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 🛠️ Discreet Testing Mode Skip Button */}
            <TouchableOpacity
              onPress={handleSkipTesting}
              activeOpacity={0.7}
              style={styles.skipTestingBtn}
            >
              <Text style={styles.skipTestingText}>⚡ Skip & Unlock for Testing</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  topLogoWrapper: {
    alignItems: 'center'
  },
  restoreBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  restoreText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  badgeRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12
  },
  crownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4
  },
  crownPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5
  },
  subheadline: {
    color: '#A1A1AA',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 19,
    paddingHorizontal: 12
  },
  featuresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 16,
    marginBottom: 24
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  featureIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12
  },
  featureTextBox: {
    flex: 1,
    marginRight: 8
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2
  },
  featureDesc: {
    color: '#71717A',
    fontSize: 11,
    lineHeight: 15
  },
  sectionHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4
  },
  plansContainer: {
    gap: 12
  },
  planCard: {
    backgroundColor: '#121215',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#27272A',
    padding: 16,
    position: 'relative'
  },
  planCardActive: {
    borderColor: '#DC2626',
    backgroundColor: '#180A0C',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4
  },
  saveRibbon: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8
  },
  saveRibbonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3
  },
  planBillText: {
    color: '#71717A',
    fontSize: 12
  },
  priceColumn: {
    alignItems: 'flex-end'
  },
  priceMain: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900'
  },
  pricePeriod: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600'
  },
  trustNote: {
    color: '#52525B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 16
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    paddingTop: 8,
    backgroundColor: '#09090B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)'
  },
  ctaButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6
  },
  ctaButton: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  skipTestingBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4
  },
  skipTestingText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});
