// LegalModals.js — Real, Comprehensive Privacy Policy & Terms of Service Modals for LIFT
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Shield,
  FileText,
  CheckCircle,
  Lock,
  Database,
  Cloud,
  Mail,
  AlertTriangle,
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// 1. PRIVACY POLICY MODAL
// ============================================================================
export function PrivacyPolicyModal({ visible, onClose, onClearCache, onExportData }) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24));

  const handleContactSupport = () => {
    Alert.alert(
      'Privacy Support Contact',
      'For any data requests or deletion inquiries, email us at:\n\nsupport@liftfitness.app\n\nOur compliance team responds within 24-48 hours.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleRequestDeletion = () => {
    Alert.alert(
      'Request Account & Data Deletion',
      'Under GDPR and CCPA, you have the right to request permanent deletion of your account and all associated workout logs.\n\nTo confirm, send an email from your registered address to support@liftfitness.app with the subject "Delete My Account".',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email Request', onPress: handleContactSupport }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Ambient Top Glow */}
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.18)', 'rgba(9, 9, 11, 0.98)', '#09090B']}
          locations={[0, 0.25, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* Header Bar */}
        <View style={[styles.headerBar, { paddingTop: safeTop + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Shield size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Privacy Policy</Text>
              <Text style={styles.headerSub}>LIFT Smart Workout Tracker · v1.2</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close Privacy Policy"
          >
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        {/* Document Body */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Badge */}
          <View style={styles.metaRow}>
            <View style={styles.verifiedBadge}>
              <CheckCircle size={12} color="#10B981" />
              <Text style={styles.verifiedBadgeText}>GDPR & CCPA COMPLIANT</Text>
            </View>
            <Text style={styles.metaDate}>Effective: August 27, 2026</Text>
          </View>

          <Text style={styles.leadParagraph}>
            At <Text style={styles.boldWhite}>LIFT</Text> ("we", "our", or "us"), we prioritize your privacy and are committed to safeguarding the sensitive personal fitness, health metrics, and workout logs you entrust to us. This policy describes our data collection, handling, and security practices.
          </Text>

          {/* Section 1 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Database size={16} color="#EF4444" />
              <Text style={styles.sectionHeading}>1. Information We Collect</Text>
            </View>
            <Text style={styles.sectionText}>
              We collect only the information necessary to provide tailored workout experiences, calculate accurate 1RM strength metrics, and track your fitness progression:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • <Text style={styles.boldWhite}>Account Information:</Text> Your display name and email address when you register via Firebase Authentication.
              </Text>
              <Text style={styles.bulletItem}>
                • <Text style={styles.boldWhite}>Physical & Fitness Metrics:</Text> Height, body weight, gender, birth date, fitness objectives (e.g. Build Muscle, Strength, Fat Loss), and experience level.
              </Text>
              <Text style={styles.bulletItem}>
                • <Text style={styles.boldWhite}>Workout Logs & Activity:</Text> Exercises performed, completed sets, reps, load lifted (kg/lbs), session duration, and daily consistency statuses.
              </Text>
              <Text style={styles.bulletItem}>
                • <Text style={styles.boldWhite}>Device & Diagnostic Data:</Text> Operating system version, screen resolution, and crash logs to optimize stability. We do not track biometric identifiers or sell advertising data.
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Shield size={16} color="#EF4444" />
              <Text style={styles.sectionHeading}>2. How We Use Your Data</Text>
            </View>
            <Text style={styles.sectionText}>
              Your data is utilized strictly for the core functional utility of the LIFT application:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Calculating progressive overload volumes and estimated 1RM personal records.</Text>
              <Text style={styles.bulletItem}>• Powering the weekly Diamond League community leaderboard.</Text>
              <Text style={styles.bulletItem}>• Real-time offline persistence and encrypted cloud synchronization across devices.</Text>
              <Text style={styles.bulletItem}>• Preventing fraudulent ranking logs and diagnosing system crashes.</Text>
            </View>
          </View>

          {/* Section 3 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Cloud size={16} color="#EF4444" />
              <Text style={styles.sectionHeading}>3. Cloud & Third-Party Infrastructure</Text>
            </View>
            <Text style={styles.sectionText}>
              We partner exclusively with enterprise cloud infrastructure providers:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • <Text style={styles.boldWhite}>Google Firebase & Firestore:</Text> Industry-standard encrypted user authentication and NoSQL cloud storage. All transport data is protected using TLS/SSL encryption and AES-256 rest encryption.
              </Text>
              <Text style={styles.bulletItem}>
                • <Text style={styles.boldWhite}>Expo & EAS:</Text> Secure application runtime delivery and over-the-air update mechanisms.
              </Text>
            </View>
          </View>

          {/* Section 4 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Lock size={16} color="#EF4444" />
              <Text style={styles.sectionHeading}>4. Data Security & Retention</Text>
            </View>
            <Text style={styles.sectionText}>
              We enforce multi-tiered defense measures to protect your information against unauthorized access, loss, or alteration. Your local session and workout sets are stored using device sandboxing (AsyncStorage) and verified with cryptographic JWT tokens during cloud sync.
            </Text>
          </View>

          {/* Section 5: User Rights */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <CheckCircle size={16} color="#EF4444" />
              <Text style={styles.sectionHeading}>5. Your Rights & Data Controls</Text>
            </View>
            <Text style={styles.sectionText}>
              You maintain full ownership of your fitness data:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• <Text style={styles.boldWhite}>Right to Access & Rectify:</Text> Update your metrics anytime via Profile settings.</Text>
              <Text style={styles.bulletItem}>• <Text style={styles.boldWhite}>Right to Portability:</Text> Export your complete workout history in JSON format.</Text>
              <Text style={styles.bulletItem}>• <Text style={styles.boldWhite}>Right to Erasure:</Text> Permanently delete your cloud records upon request.</Text>
            </View>

            {/* Quick Action Buttons for Data Privacy */}
            <View style={styles.actionButtonGroup}>
              {onExportData && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={onExportData}
                  activeOpacity={0.8}
                >
                  <Download size={14} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Export Workout Data</Text>
                </TouchableOpacity>
              )}

              {onClearCache && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnSecondary]}
                  onPress={onClearCache}
                  activeOpacity={0.8}
                >
                  <Trash2 size={14} color="#EF4444" />
                  <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Clear Local Cache</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Section 6: Children */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>6. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              LIFT is not directed to individuals under 13 years of age. We do not knowingly collect personal information from children under 13.
            </Text>
          </View>

          {/* Section 7: Contact */}
          <View style={[styles.sectionCard, styles.contactCard]}>
            <View style={styles.sectionHeaderRow}>
              <Mail size={16} color="#F59E0B" />
              <Text style={[styles.sectionHeading, { color: '#FFFFFF' }]}>7. Official Contact & Data Officer</Text>
            </View>
            <Text style={styles.sectionText}>
              For any privacy questions, data requests, or formal inquiries:
            </Text>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Text style={styles.contactEmail}>support@liftfitness.app</Text>
              <ExternalLink size={14} color="#EF4444" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteRequestBtn}
              onPress={handleRequestDeletion}
              activeOpacity={0.8}
            >
              <AlertTriangle size={14} color="#EF4444" />
              <Text style={styles.deleteRequestText}>Request Account Deletion</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================================
// 2. TERMS OF SERVICE MODAL
// ============================================================================
export function TermsOfServiceModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top || 0, Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Ambient Top Glow */}
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.16)', 'rgba(9, 9, 11, 0.98)', '#09090B']}
          locations={[0, 0.25, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        {/* Header Bar */}
        <View style={[styles.headerBar, { paddingTop: safeTop + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <FileText size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Terms of Service</Text>
              <Text style={styles.headerSub}>User Agreement & Safety Disclaimers</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close Terms of Service"
          >
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        {/* Document Body */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Badge */}
          <View style={styles.metaRow}>
            <View style={styles.verifiedBadge}>
              <CheckCircle size={12} color="#10B981" />
              <Text style={styles.verifiedBadgeText}>STANDARD USER AGREEMENT</Text>
            </View>
            <Text style={styles.metaDate}>Updated: August 2026</Text>
          </View>

          {/* Crucial Medical Disclaimer */}
          <View style={[styles.sectionCard, styles.warningCard]}>
            <View style={styles.sectionHeaderRow}>
              <AlertTriangle size={18} color="#F59E0B" />
              <Text style={[styles.sectionHeading, { color: '#F59E0B' }]}>
                Important Health & Exercise Disclaimer
              </Text>
            </View>
            <Text style={[styles.sectionText, { color: '#E4E4E7' }]}>
              LIFT is an athletic workout tracking and progress visualization tool, not a medical provider. Resistance training and heavy barbell lifting carry inherent risks of physical injury.
            </Text>
            <Text style={[styles.sectionText, { color: '#E4E4E7', marginTop: 8 }]}>
              Consult a certified physician or healthcare professional before undertaking any new workout routine. You agree that you participate in physical training voluntarily and assume full responsibility for your health and safety.
            </Text>
          </View>

          {/* Section 1 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By creating an account, browsing exercise demonstrations, or logging workouts in LIFT, you agree to be bound by these Terms of Service. If you do not agree to all terms, please refrain from using the application.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>2. Account & Security</Text>
            <Text style={styles.sectionText}>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted through your account. You agree to notify us immediately of any unauthorized access or security breaches.
            </Text>
          </View>

          {/* Section 3 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>3. Fair Competition in Arena Rankings</Text>
            <Text style={styles.sectionText}>
              The Diamond League and global leaderboards celebrate genuine athlete effort. Fabricating logs, automated bot submission, or recording false 1RM weights to manipulate rankings is strictly prohibited and subject to rank forfeiture or account termination.
            </Text>
          </View>

          {/* Section 4 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>4. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All video demonstrations, animations, 3D anatomical models, branding, UI designs, and proprietary algorithms within LIFT remain the exclusive intellectual property of LIFT.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>5. Termination</Text>
            <Text style={styles.sectionText}>
              We reserve the right to suspend or terminate accounts that violate community rules, engage in harassment, or compromise app infrastructure. You may terminate your account at any time.
            </Text>
          </View>

          {/* Section 6 */}
          <View style={[styles.sectionCard, styles.contactCard]}>
            <Text style={[styles.sectionHeading, { color: '#FFFFFF' }]}>6. Contact Information</Text>
            <Text style={styles.sectionText}>
              Questions concerning these terms may be directed to:
            </Text>
            <Text style={[styles.contactEmail, { marginTop: 6 }]}>support@liftfitness.app</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#09090B'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  headerSub: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    gap: 5
  },
  verifiedBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  metaDate: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600'
  },
  leadParagraph: {
    color: '#D4D4D8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16
  },
  sectionCard: {
    backgroundColor: 'rgba(18, 18, 22, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 14
  },
  warningCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.28)'
  },
  contactCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.22)'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  sectionText: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 20
  },
  bulletList: {
    marginTop: 8,
    gap: 6
  },
  bulletItem: {
    color: '#A1A1AA',
    fontSize: 12.5,
    lineHeight: 19
  },
  boldWhite: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6
  },
  actionBtnSecondary: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10
  },
  contactEmail: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700'
  },
  deleteRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    gap: 6
  },
  deleteRequestText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline'
  }
});
