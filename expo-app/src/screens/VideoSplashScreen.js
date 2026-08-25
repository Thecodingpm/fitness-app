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
import { LinearGradient } from 'expo-linear-gradient';

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

      {/* 🔴 Studio Crimson Linear Gradient Backdrop */}
      <LinearGradient
        colors={['#5A0F17', '#25060A', '#09090B']}
        locations={[0, 0.38, 0.85]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* Tap-Anywhere Container (Clean, uninterrupted view) */}
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
  }
});
