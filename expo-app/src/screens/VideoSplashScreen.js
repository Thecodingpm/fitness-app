import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

export function VideoSplashScreen({ onFinish }) {
  const [hasFinished, setHasFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleFinish = () => {
    if (hasFinished) return;
    setHasFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true
    }).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 🔴 Ambient Crimson Center & Bottom Glow Behind the Animated Logo */}
      <View pointerEvents="none" style={styles.centerAuraGlow} />
      <View pointerEvents="none" style={styles.bottomAuraGlow} />

      {/* Tap-Anywhere Container (Clean, uninterrupted view without visible skip button) */}
      <TouchableOpacity
        style={styles.touchableArea}
        activeOpacity={1}
        onPress={handleFinish}
      >
        {/* Scaled & Centered Video Animation */}
        <View style={styles.videoWrapper}>
          <Video
            source={require('../../assets/lift_intro_animation.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping={false}
            style={styles.videoPlayer}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                handleFinish();
              }
            }}
            onError={(e) => {
              // Fallback
              handleFinish();
            }}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoWrapper: {
    width: width * 0.82,
    height: height * 0.55,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoPlayer: {
    width: '100%',
    height: '100%'
  },
  centerAuraGlow: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: 260,
    height: 260,
    backgroundColor: '#991B1B',
    opacity: 0.14,
    borderRadius: 130,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 90
  },
  bottomAuraGlow: {
    position: 'absolute',
    bottom: -60,
    alignSelf: 'center',
    width: 320,
    height: 200,
    backgroundColor: '#991B1B',
    opacity: 0.12,
    borderRadius: 160,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 80
  }
});
