import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  StatusBar,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';

export function PaywallModal({ visible, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'yearly'

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* 🔴 Dark Red Gradient Glow at Bottom (Matches Select Units screen) */}
        <LinearGradient
          colors={['#000000', '#000000', '#180000', '#3A0000', '#5C0000']}
          locations={[0, 0.42, 0.68, 0.86, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.pageContainer}>
            {/* Top Bar with Back Button & Centered LIFT Logo */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.backBtn}
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

              <View style={styles.topBarRightSpacer} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Headline & Subtext */}
              <Text style={styles.heading}>Choose Your Plan</Text>
              <Text style={styles.subhead}>Pick the plan that works best for you.</Text>

              {/* Plan Cards Container */}
              <View style={styles.plansContainer}>
                {/* 1. Monthly Plan Card */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan('monthly')}
                  style={[
                    styles.planCardWrapper,
                    selectedPlan === 'monthly' && styles.planCardWrapperActive
                  ]}
                >
                  {selectedPlan === 'monthly' ? (
                    <LinearGradient
                      colors={['#7A0000', '#B31F1F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.planCardGradient}
                    >
                      <View style={styles.planCardLeft}>
                        <Text style={styles.planTitle}>Monthly Plan</Text>
                        <Text style={styles.planSubtitle}>Flexible, cancel anytime.</Text>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.planPriceNumber}>$5</Text>
                        <Text style={styles.planPriceUnit}>/month</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.planCardUnselected}>
                      <View style={styles.planCardLeft}>
                        <Text style={styles.planTitle}>Monthly Plan</Text>
                        <Text style={styles.planSubtitle}>Flexible, cancel anytime.</Text>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.planPriceNumber}>$5</Text>
                        <Text style={styles.planPriceUnit}>/month</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                {/* 2. Yearly Plan Card */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan('yearly')}
                  style={[
                    styles.planCardWrapper,
                    selectedPlan === 'yearly' && styles.planCardWrapperActive
                  ]}
                >
                  {selectedPlan === 'yearly' ? (
                    <LinearGradient
                      colors={['#7A0000', '#B31F1F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.planCardGradient}
                    >
                      {/* Best Value Badge */}
                      <View style={styles.bestValueBadge}>
                        <Text style={styles.bestValueBadgeText}>★ Best Value</Text>
                      </View>

                      <View style={styles.planCardLeft}>
                        <Text style={styles.planTitle}>Yearly Plan</Text>
                        <Text style={styles.planSubtitle}>Save more with long-term commitment.</Text>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.planPriceNumber}>$50</Text>
                        <Text style={styles.planPriceUnit}>/year</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.planCardUnselected}>
                      {/* Best Value Badge */}
                      <View style={styles.bestValueBadge}>
                        <Text style={styles.bestValueBadgeText}>★ Best Value</Text>
                      </View>

                      <View style={styles.planCardLeft}>
                        <Text style={styles.planTitle}>Yearly Plan</Text>
                        <Text style={styles.planSubtitle}>Save more with long-term commitment.</Text>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.planPriceNumber}>$50</Text>
                        <Text style={styles.planPriceUnit}>/year</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                {/* 3. Lifetime Plan Card */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan('lifetime')}
                  style={[
                    styles.planCardWrapper,
                    selectedPlan === 'lifetime' && styles.planCardWrapperActive
                  ]}
                >
                  {selectedPlan === 'lifetime' ? (
                    <LinearGradient
                      colors={['#7A0000', '#B31F1F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.planCardGradient}
                    >
                      <View style={styles.planCardLeft}>
                        <Text style={styles.planTitle}>Lifetime Plan</Text>
                        <Text style={styles.planSubtitle}>Pay once, access forever.</Text>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.planPriceNumber}>$99</Text>
                        <Text style={styles.planPriceUnit}>/lifetime</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.planCardUnselected}>
                      <View style={styles.planCardLeft}>
                        <Text style={styles.planTitle}>Lifetime Plan</Text>
                        <Text style={styles.planSubtitle}>Pay once, access forever.</Text>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.planPriceNumber}>$99</Text>
                        <Text style={styles.planPriceUnit}>/lifetime</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Disclaimer Text */}
              <Text style={styles.disclaimerText}>
                Cancel anytime from your account settings.
              </Text>
            </ScrollView>

            {/* Bottom Actions: Skip & Subscribe Side-by-Side */}
            <View style={styles.bottomActionsRow}>
              {/* Skip Button (Secondary Style) */}
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={onClose}
                activeOpacity={0.75}
              >
                <Text style={styles.skipBtnText}>Skip</Text>
              </TouchableOpacity>

              {/* Subscribe Button (Primary Red Style) */}
              <TouchableOpacity
                style={styles.subscribeBtnWrapper}
                onPress={() => {
                  Alert.alert(
                    '⭐ Welcome to LIFT Pro!',
                    `Your ${selectedPlan === 'yearly' ? 'Yearly ($50/year)' : 'Monthly ($5/mo)'} plan is now active.`
                  );
                  onClose();
                }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#7A0000', '#B31F1F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.subscribeBtnGradient}
                >
                  <Text style={styles.subscribeBtnText}>Subscribe</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6
  },
  backBtn: {
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
  topBarRightSpacer: {
    width: 40,
    height: 40
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    alignItems: 'center'
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  subhead: {
    color: '#9A9A9A',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 20
  },
  plansContainer: {
    width: '100%',
    gap: 16
  },
  planCardWrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  planCardWrapperActive: {
    shadowColor: '#B31F1F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6
  },
  planCardGradient: {
    padding: 22,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  planCardUnselected: {
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
  planCardLeft: {
    flex: 1,
    marginRight: 12
  },
  planTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  planSubtitle: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '500'
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  planPriceNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900'
  },
  planPriceUnit: {
    color: '#D4D4D8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2
  },
  bestValueBadge: {
    position: 'absolute',
    top: 10,
    right: 14,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  bestValueBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  disclaimerText: {
    color: '#71717A',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18
  },
  bottomActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
    alignItems: 'center'
  },
  skipBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2E2E34',
    justifyContent: 'center',
    alignItems: 'center'
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  subscribeBtnWrapper: {
    flex: 2,
    height: 54,
    borderRadius: 16,
    overflow: 'hidden'
  },
  subscribeBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  }
});
