import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Crown,
  LogOut,
  Camera,
  User,
  X,
  Image as ImageIcon
} from 'lucide-react-native';
import { C } from '../constants/theme';

export function ProfileScreen({
  userName = 'fatimamuaaz9',
  userEmail = 'fatimamuaaz9@gmail.com',
  userAvatar,
  onUpdateAvatar,
  onEditProfile,
  onOpenPaywall,
  onLogOut
}) {
  const [localAvatar, setLocalAvatar] = useState(userAvatar || require('../../assets/athlete_hero.jpg'));
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const currentAvatar = userAvatar || localAvatar;

  const updateAvatar = (newSource) => {
    setLocalAvatar(newSource);
    if (onUpdateAvatar) onUpdateAvatar(newSource);
  };

  // 📸 1. Launch Camera to take new photo
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to take a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateAvatar({ uri: result.assets[0].uri });
        setShowAvatarPicker(false);
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Camera Error', 'Could not open the camera. Please try again.');
    }
  };

  // 🖼️ 2. Open Photo Gallery to pick existing photo
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          'Please enable photo gallery access in your device settings to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateAvatar({ uri: result.assets[0].uri });
        setShowAvatarPicker(false);
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Gallery Error', 'Could not open photo library. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Dark Red Gradient Glow at Bottom (Matches Select Units Theme) */}
      <LinearGradient
        colors={['#000000', '#000000', '#180000', '#3A0000', '#5C0000']}
        locations={[0, 0.42, 0.68, 0.86, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Athlete Profile</Text>

        {/* 👤 User Card with Profile Picture on the Left */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            {/* Left: Avatar with Camera / Edit Icon Badge */}
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => setShowAvatarPicker(true)}
              activeOpacity={0.8}
            >
              {currentAvatar ? (
                <Image source={currentAvatar} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={28} color="#FFFFFF" />
                </View>
              )}

              {/* Camera / Edit Badge */}
              <View style={styles.cameraBadge}>
                <Camera size={12} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Middle: Name & Email / Level */}
            <View style={styles.profileInfoContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {userName || 'fatimamuaaz9'}
              </Text>
              <Text style={styles.userSubText} numberOfLines={1}>
                Level 12 • {userEmail || 'fatimamuaaz9@gmail.com'}
              </Text>
            </View>

            {/* Right: Edit Button */}
            <TouchableOpacity
              style={styles.editPill}
              onPress={onEditProfile}
              activeOpacity={0.7}
            >
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row (Day Streak, Workouts, XP) */}
          <View style={styles.statsRow}>
            <View style={styles.profileStatCard}>
              <Text style={styles.profileStatNum}>14</Text>
              <Text style={styles.profileStatLabel}>Day Streak</Text>
            </View>

            <View style={styles.profileStatCard}>
              <Text style={styles.profileStatNum}>24</Text>
              <Text style={styles.profileStatLabel}>Workouts</Text>
            </View>

            <View style={styles.profileStatCard}>
              <Text style={styles.profileStatNum}>4,850</Text>
              <Text style={styles.profileStatLabel}>Total XP</Text>
            </View>
          </View>
        </View>

        {/* 👑 Pro Subscription Banner */}
        <View style={styles.proCard}>
          <View style={styles.proHeaderRow}>
            <Crown size={18} color="#FFFFFF" />
            <Text style={styles.proTitle}>LIFT PRO</Text>
          </View>

          <Text style={styles.proSubtext}>
            Unlock Unlimited 1-on-1 AI Voice Coach, Custom Splits, and Progressive Overload Tracking.
          </Text>

          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={onOpenPaywall}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeBtnText}>Unlock LIFT Pro ⭐</Text>
          </TouchableOpacity>
        </View>

        {/* 🏆 Personal Records (PRs) */}
        <View style={styles.prCard}>
          <Text style={styles.prTitle}>Personal Records (PRs)</Text>
          <View style={styles.prList}>
            <Text style={styles.prItem}>• Bench Press: 70 kg</Text>
            <Text style={styles.prItem}>• Squat: 85 kg</Text>
            <Text style={styles.prItem}>• Pull-Ups: 10 reps</Text>
          </View>
        </View>

        {/* 🚪 Log Out Button at the Bottom */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogOut}
            activeOpacity={0.8}
          >
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🖼️ Compact Aesthetic Photo Upload Modal */}
      <Modal visible={showAvatarPicker} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.compactModalBox}>
            {/* Header */}
            <View style={styles.compactModalHeader}>
              <Text style={styles.compactModalTitle}>Profile Photo</Text>
              <TouchableOpacity
                onPress={() => setShowAvatarPicker(false)}
                style={styles.compactCloseBtn}
                activeOpacity={0.7}
              >
                <X size={15} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            {/* Circular Buttons Row */}
            <View style={styles.compactCircleRow}>
              {/* Take Photo Circle */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={handleTakePhoto}
                activeOpacity={0.8}
              >
                <View style={styles.circleCameraBtn}>
                  <Camera size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.circleActionLabel}>Take Photo</Text>
              </TouchableOpacity>

              {/* From Gallery Circle */}
              <TouchableOpacity
                style={styles.circleActionItem}
                onPress={handlePickFromGallery}
                activeOpacity={0.8}
              >
                <View style={styles.circleGalleryBtn}>
                  <ImageIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.circleActionLabel}>From Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 110
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 18,
    letterSpacing: -0.5
  },
  profileCard: {
    backgroundColor: '#121214',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#242428'
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'visible'
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3F3F46'
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3F3F46'
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#B31F1F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#121214'
  },
  profileInfoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 3
  },
  userSubText: {
    color: '#9A9A9A',
    fontSize: 12,
    fontWeight: '500'
  },
  editPill: {
    backgroundColor: '#242428',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A3A40'
  },
  editPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: '#1A1A1E',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A30'
  },
  profileStatNum: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900'
  },
  profileStatLabel: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500'
  },
  proCard: {
    backgroundColor: '#1E1E24',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2E2E36'
  },
  proHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  proTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1
  },
  proSubtext: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 18
  },
  upgradeBtn: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14
  },
  upgradeBtnText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 14
  },
  prCard: {
    backgroundColor: '#121214',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#242428'
  },
  prTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10
  },
  prList: {
    gap: 6
  },
  prItem: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '500'
  },
  logoutContainer: {
    marginTop: 6,
    marginBottom: 20
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16161A',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2C32'
  },
  logoutBtnText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 14
  },

  // 🖼️ Compact Modal Box Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28
  },
  compactModalBox: {
    width: '100%',
    maxWidth: 310,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2A2A32',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10
  },
  compactModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  compactModalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  compactCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#24242A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  compactCircleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  circleActionItem: {
    alignItems: 'center',
    gap: 8
  },
  circleCameraBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B31F1F',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  circleGalleryBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#202026',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#383842',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  circleActionLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
