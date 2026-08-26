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
  Dimensions
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
  UploadCloud
} from 'lucide-react-native';
import { C } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 10 Polished Preset Avatar Slots (Prepared for custom illustrations)
const AVATAR_SLOTS = [
  { id: 'slot-1', label: '01', name: 'Alpha' },
  { id: 'slot-2', label: '02', name: 'Stealth' },
  { id: 'slot-3', label: '03', name: 'Titan' },
  { id: 'slot-4', label: '04', name: 'Vanguard' },
  { id: 'slot-5', label: '05', name: 'Apex' },
  { id: 'slot-6', label: '06', name: 'Phantom' },
  { id: 'slot-7', label: '07', name: 'Rogue' },
  { id: 'slot-8', label: '08', name: 'Strike' },
  { id: 'slot-9', label: '09', name: 'Ghost' },
  { id: 'slot-10', label: '10', name: 'Prime' }
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
            {/* Left: Completely Clean Circular Avatar */}
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

      {/* ========================================================================= */}
      {/* 🖼️ COMPLETELY REDESIGNED PROFILE PICTURE & 10-AVATAR CUSTOMIZATION MODAL */}
      {/* ========================================================================= */}
      <Modal visible={showAvatarPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdropTap}
            activeOpacity={1}
            onPress={() => setShowAvatarPicker(false)}
          />

          <View style={styles.avatarSheetContainer}>
            {/* Top Sheet Drag Indicator */}
            <View style={styles.sheetDragHandle} />

            {/* Modal Header */}
            <View style={styles.sheetHeaderRow}>
              <View>
                <Text style={styles.sheetTitle}>Profile Picture</Text>
                <Text style={styles.sheetSubtitle}>Choose how you appear in LIFT</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAvatarPicker(false)}
                style={styles.sheetCloseBtn}
                activeOpacity={0.7}
              >
                <X size={16} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            {/* Segment Tab Selector: Primary Actions vs 10 Avatars */}
            <View style={styles.modalSegmentRow}>
              <TouchableOpacity
                style={[styles.modalSegmentBtn, activeModalTab === 'MAIN' && styles.modalSegmentBtnActive]}
                onPress={() => setActiveModalTab('MAIN')}
                activeOpacity={0.8}
              >
                <ImageIcon size={14} color={activeModalTab === 'MAIN' ? '#FFFFFF' : '#71717A'} style={{ marginRight: 6 }} />
                <Text style={[styles.modalSegmentText, activeModalTab === 'MAIN' && styles.modalSegmentTextActive]}>
                  Upload Options
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSegmentBtn, activeModalTab === 'AVATARS' && styles.modalSegmentBtnActive]}
                onPress={() => setActiveModalTab('AVATARS')}
                activeOpacity={0.8}
              >
                <Sparkles size={14} color={activeModalTab === 'AVATARS' ? '#EF4444' : '#71717A'} style={{ marginRight: 6 }} />
                <Text style={[styles.modalSegmentText, activeModalTab === 'AVATARS' && styles.modalSegmentTextActive]}>
                  Choose Avatar (10)
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB 1: MAIN UPLOAD OPTIONS */}
            {activeModalTab === 'MAIN' && (
              <View style={styles.modalActionsList}>
                {/* 1. Choose from Gallery Action Card */}
                <TouchableOpacity
                  style={styles.customActionCard}
                  onPress={handlePickFromGallery}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#1E1E24', '#16161A']}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  <View style={styles.customActionIconCircle}>
                    <UploadCloud size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.customActionTextCol}>
                    <Text style={styles.customActionTitle}>Choose from Gallery</Text>
                    <Text style={styles.customActionSub}>Select any photo from your device camera roll</Text>
                  </View>
                  <ChevronRight size={18} color="#71717A" />
                </TouchableOpacity>

                {/* 2. Choose Avatar Preset Card */}
                <TouchableOpacity
                  style={[styles.customActionCard, { borderColor: '#42161C' }]}
                  onPress={() => setActiveModalTab('AVATARS')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#241116', '#1A0E12']}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  <View style={[styles.customActionIconCircle, { backgroundColor: '#38141C', borderColor: '#7A1D28' }]}>
                    <Sparkles size={20} color="#EF4444" />
                  </View>
                  <View style={styles.customActionTextCol}>
                    <Text style={styles.customActionTitle}>Choose Athlete Avatar</Text>
                    <Text style={styles.customActionSub}>Select from 10 exclusive preset character slots</Text>
                  </View>
                  <ChevronRight size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            {/* TAB 2: 10 POLISHED EMPTY / PRESET AVATAR BOXES */}
            {activeModalTab === 'AVATARS' && (
              <View style={styles.avatarSectionBlock}>
                <View style={styles.avatarGridHeaderRow}>
                  <Text style={styles.avatarGridHeaderLabel}>SELECT AVATAR SLOT</Text>
                  <Text style={styles.avatarGridCountBadge}>10 Slots Available</Text>
                </View>

                {/* 10 Aesthetic Placeholder Avatar Cards */}
                <View style={styles.avatarCardsGrid}>
                  {AVATAR_SLOTS.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <TouchableOpacity
                        key={slot.id}
                        style={[
                          styles.avatarSlotCard,
                          isSelected && styles.avatarSlotCardSelected
                        ]}
                        onPress={() => handleSelectAvatarSlot(slot)}
                        activeOpacity={0.75}
                      >
                        <LinearGradient
                          colors={isSelected ? ['#2B1116', '#1F0D12'] : ['#1C1C20', '#141417']}
                          style={StyleSheet.absoluteFillObject}
                          pointerEvents="none"
                        />

                        {/* Centered Minimal Silhouette Placeholder */}
                        <View style={[styles.avatarPlaceholderCircle, isSelected && styles.avatarPlaceholderCircleSelected]}>
                          <User size={22} color={isSelected ? '#FFFFFF' : '#71717A'} />
                        </View>

                        {/* Slot Label */}
                        <Text style={[styles.avatarSlotLabel, isSelected && styles.avatarSlotLabelSelected]}>
                          {slot.name}
                        </Text>

                        {/* Active Selection Checkmark Badge */}
                        {isSelected && (
                          <View style={styles.slotCheckBadge}>
                            <Check size={10} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
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
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative'
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#3F3F46'
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3F3F46'
  },
  profileInfoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
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
  avatarCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  avatarSlotCard: {
    width: (SCREEN_WIDTH - 64) / 5,
    height: 76,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A32',
    overflow: 'hidden',
    position: 'relative'
  },
  avatarSlotCardSelected: {
    borderColor: '#EF4444',
    borderWidth: 1.5
  },
  avatarPlaceholderCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#303038'
  },
  avatarPlaceholderCircleSelected: {
    backgroundColor: '#3D1219',
    borderColor: '#7A1D28'
  },
  avatarSlotLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700'
  },
  avatarSlotLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  slotCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center'
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
