import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Animated
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

export function VideoSplashScreen({ onFinish }) {
  const [hasFinished, setHasFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleFinish = () => {
    if (hasFinished) return;
    setHasFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true
    }).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Video
        source={require('../../assets/lift_intro_animation.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        style={StyleSheet.absoluteFillObject}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            handleFinish();
          }
        }}
        onError={(e) => {
          // Fallback if video format fails on emulator
          handleFinish();
        }}
      />

      {/* Subtle Top Crimson Vignette */}
      <View pointerEvents="none" style={styles.vignetteOverlay} />

      {/* Skip Button */}
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative'
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 16
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
