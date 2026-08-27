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
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Crown,
  LogOut,
  User,
  X,
  Image as ImageIcon,
  Bell,
  Settings,
  Target,
  Calendar,
  Dumbbell,
  Shield,
  HelpCircle,
  ChevronRight,
  Sliders,
  Flame,
  Award,
  Sparkles,
  Play,
  Check,
  UploadCloud,
  ArrowLeft
} from 'lucide-react-native';
import { C } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🌟 15 User-Provided Aesthetic 1:1 Circle Avatars (Exact Match to Reference Design)
const AVATAR_PRESETS_DB = [
  { id: 'avatar-1', name: 'Neon Cat', image: require('../../assets/avatars/avatar_1.jpg') },
  { id: 'avatar-2', name: 'Anime Pink', image: require('../../assets/avatars/avatar_2.jpg') },
  { id: 'avatar-3', name: 'Chibi Hoodie', image: require('../../assets/avatars/avatar_3.jpg') },
  { id: 'avatar-4', name: 'Goku Black', image: require('../../assets/avatars/avatar_4.jpg') },
  { id: 'avatar-5', name: 'Panda Warrior', image: require('../../assets/avatars/avatar_5.jpg') },
  { id: 'avatar-6', name: 'Luffy Laugh', image: require('../../assets/avatars/avatar_6.jpg') },
  { id: 'avatar-7', name: 'Little Luffy', image: require('../../assets/avatars/avatar_7.jpg') },
  { id: 'avatar-8', name: 'Lightning McQueen', image: require('../../assets/avatars/avatar_8.jpg') },
  { id: 'avatar-9', name: 'Pink Cat Car', image: require('../../assets/avatars/avatar_9.jpg') },
  { id: 'avatar-10', name: 'Porsche 911', image: require('../../assets/avatars/avatar_10.jpg') },
  { id: 'avatar-11', name: 'Dodge Challenger', image: require('../../assets/avatars/avatar_11.jpg') },
  { id: 'avatar-12', name: 'Dark Supra', image: require('../../assets/avatars/avatar_12.jpg') },
  { id: 'avatar-13', name: 'Fast & Furious Cat', image: require('../../assets/avatars/avatar_13.jpg') },
  { id: 'avatar-14', name: 'Cloud Storm', image: require('../../assets/avatars/avatar_14.jpg') },
  { id: 'avatar-15', name: 'Nature Valley', image: require('../../assets/avatars/avatar_15.jpg') }
];

export function ProfileScreen({
  userName = 'fatimamuaaz9',
  userEmail = 'fatimamuaaz9@gmail.com',
  userAvatar,
  onUpdateAvatar,
  onEditProfile,
  onOpenPaywall,
  onReplayIntroVideo,
  onLogOut
}) {
  const [localAvatar, setLocalAvatar] = useState(userAvatar || require('../../assets/athlete_hero.jpg'));
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('MAIN'); // 'MAIN' | 'AVATARS'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const currentAvatar = userAvatar || localAvatar;
  const displayUsername = (userName || 'Athlete').slice(0, 10);

  const updateAvatar = (newSource) => {
    setLocalAvatar(newSource);
    if (onUpdateAvatar) onUpdateAvatar(newSource);
  };

  // 🖼️ 1. Open Photo Gallery to pick existing photo
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
        setSelectedSlotId(null);
        updateAvatar({ uri: result.assets[0].uri });
        setShowAvatarPicker(false);
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Gallery Error', 'Could not open photo library. Please try again.');
    }
  };

  // 👤 2. Select from 10 Preset Avatar Slots
  const handleSelectAvatarSlot = (slot) => {
    setSelectedSlotId(slot.id);
    // In future this will bind the actual avatar asset. For now, it cleanly sets the slot identifier.
    updateAvatar(require('../../assets/athlete_hero.jpg'));
    setShowAvatarPicker(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Dark Red Gradient Glow at Bottom (Matches LIFT Brand System) */}
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

        {/* 👤 1. Clean Profile Card with Modern Typography & Customization Actions */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            {/* Left: Completely Clean Circular Avatar with Sleek Border Ring */}
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => {
                setActiveModalTab('MAIN');
                setShowAvatarPicker(true);
              }}
              activeOpacity={0.85}
            >
              {currentAvatar ? (
                <Image source={currentAvatar} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={28} color="#FFFFFF" />
                </View>
              )}
              {/* Subtle Camera Edit Badge */}
              <View style={styles.avatarEditBadge}>
                <Sparkles size={11} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Middle: User Name & Athlete Email */}
            <View style={styles.profileInfoContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {displayUsername}
              </Text>
              <Text style={styles.userSubText} numberOfLines={1}>
                Athlete • {userEmail || 'athlete@lift.app'}
              </Text>
            </View>

            {/* Right: Clean Edit Profile Pill */}
            <TouchableOpacity
              style={styles.editPill}
              onPress={onEditProfile}
              activeOpacity={0.7}
            >
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* 🎨 Dedicated Profile Customization Actions Row */}
          <View style={styles.avatarActionsRow}>
            <TouchableOpacity
              style={styles.avatarActionBtn}
              onPress={handlePickFromGallery}
              activeOpacity={0.8}
            >
              <ImageIcon size={14} color="#A1A1AA" style={{ marginRight: 6 }} />
              <Text style={styles.avatarActionBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.avatarActionBtn, styles.avatarActionBtnActive]}
              onPress={() => {
                setActiveModalTab('AVATARS');
                setShowAvatarPicker(true);
              }}
              activeOpacity={0.8}
            >
              <Sparkles size={14} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={[styles.avatarActionBtnText, { color: '#FFFFFF' }]}>Choose Avatar</Text>
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

        {/* 🏆 2. Personal Records (PRs) */}
        <View style={styles.prCard}>
          <Text style={styles.prTitle}>Personal Records (PRs)</Text>
          <View style={styles.prList}>
            <Text style={styles.prItem}>• Bench Press: 70 kg</Text>
            <Text style={styles.prItem}>• Squat: 85 kg</Text>
            <Text style={styles.prItem}>• Pull-Ups: 10 reps</Text>
          </View>
        </View>

        {/* 👑 3. LIFT PRO Subscription Banner */}
        <TouchableOpacity
          style={styles.proCard}
          onPress={onOpenPaywall}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#1F1113', '#2A1116', '#3D121B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proGradient}
          >
            <View style={styles.proLeft}>
              <View style={styles.proIconBox}>
                <Crown size={20} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.proTitle}>LIFT ATHLETE PRO</Text>
                <Text style={styles.proSub}>Unlock full 3D anatomy, advanced coach routines & analytics</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#EF4444" />
          </LinearGradient>
        </TouchableOpacity>

        {/* ⚙️ 4. Organized Settings Sections */}
        {/* Section: ACCOUNT */}
        <Text style={styles.sectionHeaderLabel}>ACCOUNT</Text>
        <View style={styles.optionsCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <User size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Personal Information</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.optionDivider} />

          <TouchableOpacity
            style={styles.optionRow}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <Sliders size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Edit Onboarding Profile</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.optionDivider} />

          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <Bell size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Notifications</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>
        </View>

        {/* Section: FITNESS & TRAINING */}
        <Text style={styles.sectionHeaderLabel}>FITNESS & TRAINING</Text>
        <View style={styles.optionsCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <Target size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Training Goals & Split</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.optionDivider} />

          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <Dumbbell size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Workout Preferences</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>
        </View>

        {/* Section: APP & SUPPORT */}
        <Text style={styles.sectionHeaderLabel}>APP & SUPPORT</Text>
        <View style={styles.optionsCard}>
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <Shield size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Privacy & Security</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.optionDivider} />

          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBox}>
                <HelpCircle size={16} color="#A1A1AA" />
              </View>
              <Text style={styles.optionTitle}>Help & Support</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>

          <View style={styles.optionDivider} />

          <TouchableOpacity
            style={styles.optionRow}
            onPress={onReplayIntroVideo}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconBox, { backgroundColor: 'rgba(220, 38, 38, 0.15)', borderColor: 'rgba(220, 38, 38, 0.4)' }]}>
                <Play size={14} color="#EF4444" fill="#EF4444" />
              </View>
              <Text style={[styles.optionTitle, { color: '#FFFFFF', fontWeight: '800' }]}>Play Intro Video Animation</Text>
            </View>
            <ChevronRight size={16} color="#71717A" />
          </TouchableOpacity>
        </View>

        {/* 🚪 5. Clean Log Out Button at the Very Bottom */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.8}
          >
            <LogOut size={16} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.appVersionText}>LIFT Fitness • v1.2.0</Text>
        </View>
      </ScrollView>

      {/* 🖼️ 5. Choose Avatar Full-Screen Modal (Matching Reference Picture) */}
      <Modal visible={showAvatarPicker} animationType="slide" transparent={false}>
        <View style={styles.chooseAvatarFullScreen}>
          <StatusBar barStyle="light-content" backgroundColor="#09090B" />

          {/* Header Bar */}
          <View style={styles.chooseAvatarHeader}>
            <TouchableOpacity
              style={styles.chooseAvatarBackBtn}
              onPress={() => setShowAvatarPicker(false)}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.chooseAvatarHeaderTitle}>CHOOSE AVATAR</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.chooseAvatarScroll}
            contentContainerStyle={styles.chooseAvatarScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Large Circular Preview */}
            <View style={styles.topAvatarPreviewContainer}>
              <View style={styles.topAvatarPreviewCircle}>
                <Image
                  source={currentAvatar || AVATAR_PRESETS_DB[0].image}
                  style={styles.topAvatarPreviewImg}
                />
              </View>
            </View>

            {/* Choose from Gallery Button */}
            <TouchableOpacity
              style={styles.chooseFromGalleryBtn}
              onPress={handlePickFromGallery}
              activeOpacity={0.8}
            >
              <ImageIcon size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.chooseFromGalleryText}>Upload Custom Photo from Gallery</Text>
            </TouchableOpacity>

            {/* 3-Column Grid of 1:1 Circular Avatars */}
            <View style={styles.avatarGrid3Col}>
              {AVATAR_PRESETS_DB.map((preset) => {
                const isSelected = selectedSlotId === preset.id || userAvatar === preset.image || localAvatar === preset.image;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.avatarGridTile,
                      isSelected && styles.avatarGridTileSelected
                    ]}
                    onPress={() => {
                      setSelectedSlotId(preset.id);
                      setLocalAvatar(preset.image);
                      if (onUpdateAvatar) onUpdateAvatar(preset.image);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image source={preset.image} style={styles.avatarCircleImg} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* 🛡️ 6. Professional Logout Confirmation Modal */}
      <Modal visible={showLogoutConfirm} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmLogoutBox}>
            <View style={styles.logoutIconBadge}>
              <LogOut size={22} color="#EF4444" />
            </View>

            <Text style={styles.logoutConfirmTitle}>Log out of LIFT?</Text>
            <Text style={styles.logoutConfirmSubtitle}>
              Are you sure you want to log out of your account?
            </Text>

            <View style={styles.logoutConfirmActions}>
              <TouchableOpacity
                style={styles.logoutCancelBtn}
                onPress={() => setShowLogoutConfirm(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutActionBtn}
                onPress={() => {
                  setShowLogoutConfirm(false);
                  if (onLogOut) onLogOut();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutActionText}>Log Out</Text>
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

  // 👤 Profile Card Styles
  profileCard: {
    backgroundColor: '#141416',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 16
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#18181B',
    padding: 2.5,
    borderWidth: 2,
    borderColor: '#3F3F46',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    resizeMode: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#09090B'
  },
  profileInfoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10
  },
  userNameText: {
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2
  },
  userSubText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500'
  },
  editPill: {
    backgroundColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F3F46'
  },
  editPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // 🎨 Profile Customization Actions
  avatarActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  avatarActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C20',
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C32'
  },
  avatarActionBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'rgba(220, 38, 38, 0.4)'
  },
  avatarActionBtnText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700'
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#202024',
    paddingTop: 12
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: '#18181C',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242428'
  },
  profileStatNum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2
  },
  profileStatLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },

  // PR Card
  prCard: {
    backgroundColor: '#141416',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#242428'
  },
  prTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10
  },
  prList: {
    gap: 6
  },
  prItem: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600'
  },

  // Pro Subscription Card
  proCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A151E'
  },
  proGradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  proIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#351017',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#7A1D28'
  },
  proTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  proSub: {
    color: '#D4D4D8',
    fontSize: 11,
    lineHeight: 15
  },

  // Settings Section Styles
  sectionHeaderLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 4
  },
  optionsCard: {
    backgroundColor: '#141416',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    marginBottom: 16,
    overflow: 'hidden'
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  optionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1C1C20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2A2A30'
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#1F1F24',
    marginLeft: 58
  },

  // Log Out Section
  logoutContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    width: '100%',
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.35)',
    marginBottom: 14
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8
  },
  appVersionText: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '600'
  },

  // =========================================================================
  // 🖼️ MODERN AVATAR CUSTOMIZATION MODAL & 10-SLOT GRID STYLES
  // =========================================================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end'
  },
  modalBackdropTap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  avatarSheetContainer: {
    backgroundColor: '#141418',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#2A2A32',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '85%'
  },
  sheetDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46',
    alignSelf: 'center',
    marginBottom: 16
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  sheetSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#202026',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303038'
  },

  // Modal Segment Row
  modalSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#0C0C0E',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#222226'
  },
  modalSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10
  },
  modalSegmentBtnActive: {
    backgroundColor: '#222228'
  },
  modalSegmentText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700'
  },
  modalSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // Tab 1: Custom Action Cards
  modalActionsList: {
    gap: 12
  },
  customActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2C2C34',
    overflow: 'hidden',
    position: 'relative'
  },
  customActionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#24242C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#3A3A44'
  },
  customActionTextCol: {
    flex: 1
  },
  customActionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  customActionSub: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16
  },

  // Tab 2: 10 Avatar Slots Grid
  avatarSectionBlock: {
    marginTop: 2
  },
  avatarGridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarGridHeaderLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  avatarGridCountBadge: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700'
  },
  // 🖼️ Choose Avatar Full-Screen Styles
  chooseAvatarFullScreen: {
    flex: 1,
    backgroundColor: '#09090B'
  },
  chooseAvatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#18181B'
  },
  chooseAvatarBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A'
  },
  chooseAvatarHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  chooseAvatarScroll: {
    flex: 1
  },
  chooseAvatarScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    alignItems: 'center'
  },
  topAvatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  topAvatarPreviewCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3F3F46',
    overflow: 'hidden',
    backgroundColor: '#16161A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6
  },
  topAvatarPreviewImg: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover'
  },
  chooseFromGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181B',
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 24
  },
  chooseFromGalleryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  avatarGrid3Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12
  },
  avatarGridTile: {
    width: (SCREEN_WIDTH - 64) / 3,
    height: (SCREEN_WIDTH - 64) / 3,
    backgroundColor: '#121214',
    borderRadius: 18,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#222226'
  },
  avatarGridTileSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
    backgroundColor: '#1A1A1E',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8
  },
  avatarCircleImg: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    resizeMode: 'cover'
  },

  // Logout Modal
  confirmLogoutBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A32',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  logoutIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)'
  },
  logoutConfirmTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center'
  },
  logoutConfirmSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  logoutConfirmActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  logoutCancelBtn: {
    flex: 1,
    backgroundColor: '#202026',
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303038'
  },
  logoutCancelText: {
    color: '#A1A1AA',
    fontWeight: '700',
    fontSize: 14
  },
  logoutActionBtn: {
    flex: 1,
    backgroundColor: '#8B0000',
    borderWidth: 1,
    borderColor: '#B31F1F',
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutActionText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14
  }
});
