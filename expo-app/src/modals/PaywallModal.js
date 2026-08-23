import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Crown, Check } from 'lucide-react-native';
import { C } from '../constants/theme';

export function PaywallModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.paywallCard}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={C.white} />
          </TouchableOpacity>

          <View style={styles.crownCircle}>
            <Crown size={28} color={C.bg} />
          </View>

          <Text style={styles.paywallTitle}>Unlock LIFT Pro</Text>
          <Text style={styles.paywallSub}>Your Complete AI Personal Trainer in your pocket</Text>

          <View style={{ gap: 10, marginVertical: 18 }}>
            {[
              'Real-Time Live Voice Coach & Tempo Prompts',
              '3D Medical-Grade Muscle Anatomy Animated GIFs',
              'Smart Progressive Overload Calculator',
              'Exclusive Recovery & Fatigue Tracking'
            ].map((benefit, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Check size={16} color={C.white} />
                <Text style={{ color: C.zincLight, fontSize: 13, fontWeight: '600' }}>{benefit}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.subscribeBtn}
            onPress={() => {
              Alert.alert('⭐ Subscribed!', 'Welcome to LIFT Pro. Your 7-day free trial has started.');
              onClose();
            }}
          >
            <Text style={styles.subscribeBtnText}>Start 7-Day Free Trial ($9.99/mo)</Text>
          </TouchableOpacity>
          <Text style={{ color: C.zincDark, fontSize: 11, textAlign: 'center', marginTop: 10 }}>
            Cancel anytime in Apple App Store. No commitment.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 },
  paywallCard: { backgroundColor: C.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border },
  closeBtn: { position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: C.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  crownCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
  paywallTitle: { color: C.white, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  paywallSub: { color: C.zinc, fontSize: 12, textAlign: 'center', marginTop: 4 },
  subscribeBtn: { backgroundColor: C.white, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  subscribeBtnText: { color: C.bg, fontWeight: '900', fontSize: 14 }
});
