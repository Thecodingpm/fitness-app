import React from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, AudioLines, ChevronRight, ScanLine, X } from 'lucide-react-native';
import { LiftBrandLogo } from '../components/LiftLogo';
import { useAndroidBackHandler, BACK_PRIORITY } from '../services/navigation/backHandlerService';

const FEATURES = [
  {
    icon: Activity,
    title: 'Deeper progress insights',
    description: 'Explore longer-term strength and training trends.'
  },
  {
    icon: ScanLine,
    title: 'Form analysis',
    description: 'Understand your movement with guided visual feedback.'
  },
  {
    icon: AudioLines,
    title: 'Audio coaching',
    description: 'Stay focused with cues during each set.'
  }
];

const PREVIEW_PLANS = [
  { name: 'Monthly', price: '$5', period: '/month', detail: 'Flexible plan' },
  { name: 'Yearly', price: '$50', period: '/year', detail: 'Save $10 vs monthly', highlight: true },
  { name: 'Lifetime', price: '$99', period: 'once', detail: 'One-time plan' }
];

export function PaywallModal({ visible, onClose }) {
  useAndroidBackHandler(onClose, BACK_PRIORITY.PROFILE_MODAL, Boolean(visible));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#09090B" />
        <LinearGradient
          colors={['#381217', '#170D10', '#09090B']}
          locations={[0, 0.42, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <LiftBrandLogo size={24} color="#FFFFFF" />
              <Text style={styles.brandText}>LIFT <Text style={styles.brandAccent}>PRO</Text></Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close Pro preview"
              hitSlop={10}
            >
              <X size={20} color="#F4F4F5" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.previewPill}>
              <View style={styles.previewDot} />
              <Text style={styles.previewText}>COMING SOON · PREVIEW</Text>
            </View>

            <Text style={styles.headline}>More insight.{ '\n' }More intention.</Text>
            <Text style={styles.intro}>
              A first look at the advanced tools we’re designing to make every workout more useful.
            </Text>

            <View style={styles.showcaseCard}>
              <View style={styles.showcaseTop}>
                <Text style={styles.showcaseEyebrow}>YOUR TRAINING, IN FOCUS</Text>
                <Activity size={20} color="#F87171" />
              </View>
              <Text style={styles.showcaseTitle}>See the bigger picture.</Text>
              <Text style={styles.showcaseCopy}>
                Your current workout logs and Analytics stay available. Pro will build on them with more ways to understand your progress.
              </Text>
              <View style={styles.miniChart} accessibilityLabel="Illustration of an upward training trend">
                {[28, 39, 35, 52, 61, 74, 88].map((height, index) => (
                  <View
                    key={index}
                    style={[styles.miniBar, { height: `${height}%`, opacity: index === 6 ? 1 : 0.35 + index * 0.08 }]}
                  />
                ))}
              </View>
            </View>

            <Text style={styles.sectionLabel}>PREVIEW PRICING</Text>
            <View style={styles.pricingList}>
              {PREVIEW_PLANS.map((plan, index) => (
                <View key={plan.name} style={[styles.planRow, index > 0 && styles.featureDivider, plan.highlight && styles.planRowHighlight]}>
                  <View style={styles.planText}>
                    <View style={styles.planNameRow}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      {plan.highlight && <Text style={styles.planBadge}>BEST VALUE</Text>}
                    </View>
                    <Text style={styles.planDetail}>{plan.detail}</Text>
                  </View>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>WHAT WE’RE PLANNING</Text>
            <View style={styles.featureList}>
              {FEATURES.map(({ icon: Icon, title, description }, index) => (
                <View key={title} style={[styles.featureRow, index > 0 && styles.featureDivider]}>
                  <View style={styles.featureIcon}><Icon size={20} color="#F87171" /></View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{title}</Text>
                    <Text style={styles.featureDescription}>{description}</Text>
                  </View>
                  <ChevronRight size={16} color="#52525B" />
                </View>
              ))}
            </View>

            <Text style={styles.disclaimer}>
              Prices are previews, not an offer to purchase. Pro tools are not available yet; no subscription or payment is active.
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.continueText}>Continue with LIFT</Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  safeArea: { flex: 1 },
  topBar: { height: 64, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandText: { color: '#FAFAFA', fontSize: 17, fontWeight: '900', letterSpacing: 1.2 },
  brandAccent: { color: '#F87171' },
  closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3F3F46', backgroundColor: '#1C1C20' },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 28 },
  previewPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#714047', backgroundColor: '#351B20', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 8 },
  previewDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F87171' },
  previewText: { color: '#FCA5A5', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  headline: { color: '#FAFAFA', fontSize: 39, lineHeight: 45, fontWeight: '900', letterSpacing: -1.6, marginTop: 22 },
  intro: { color: '#A1A1AA', fontSize: 15, lineHeight: 23, marginTop: 12, marginBottom: 28 },
  showcaseCard: { backgroundColor: '#17171A', borderWidth: 1, borderColor: '#393034', borderRadius: 24, padding: 22, overflow: 'hidden' },
  showcaseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  showcaseEyebrow: { color: '#F87171', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  showcaseTitle: { color: '#FAFAFA', fontSize: 23, fontWeight: '800', letterSpacing: -0.5, marginTop: 22 },
  showcaseCopy: { color: '#A1A1AA', fontSize: 13, lineHeight: 20, marginTop: 8 },
  miniChart: { height: 98, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginTop: 24 },
  miniBar: { flex: 1, backgroundColor: '#EF4444', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  sectionLabel: { color: '#71717A', fontSize: 11, fontWeight: '800', letterSpacing: 1.8, marginTop: 32, marginBottom: 12 },
  pricingList: { backgroundColor: '#141416', borderWidth: 1, borderColor: '#393034', borderRadius: 22, paddingHorizontal: 18, overflow: 'hidden' },
  planRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  planRowHighlight: { backgroundColor: '#21171A', marginHorizontal: -18, paddingHorizontal: 18 },
  planText: { flex: 1, paddingRight: 8 },
  planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planName: { color: '#FAFAFA', fontSize: 14, fontWeight: '800' },
  planBadge: { color: '#FCA5A5', fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  planDetail: { color: '#8E8E98', fontSize: 11, marginTop: 4 },
  planPriceRow: { alignItems: 'flex-end' },
  planPrice: { color: '#FAFAFA', fontSize: 19, fontWeight: '900' },
  planPeriod: { color: '#8E8E98', fontSize: 10, marginTop: 1 },
  featureList: { backgroundColor: '#141416', borderWidth: 1, borderColor: '#2A2A2E', borderRadius: 22, paddingHorizontal: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 17 },
  featureDivider: { borderTopWidth: 1, borderTopColor: '#29292D' },
  featureIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2B191D', marginRight: 14 },
  featureText: { flex: 1, paddingRight: 10 },
  featureTitle: { color: '#F4F4F5', fontSize: 14, fontWeight: '800' },
  featureDescription: { color: '#8E8E98', fontSize: 12, lineHeight: 17, marginTop: 3 },
  disclaimer: { color: '#71717A', fontSize: 11, lineHeight: 17, marginTop: 18 },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 10, borderTopWidth: 1, borderTopColor: '#27272A', backgroundColor: '#0D0D0F' },
  continueButton: { minHeight: 56, borderRadius: 16, backgroundColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' }
});
