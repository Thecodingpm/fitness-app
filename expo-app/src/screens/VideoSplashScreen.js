import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  View,
  Dimensions
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VideoSplashScreen({ onFinish }) {
  const [hasFinished, setHasFinished] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);

  const handleFinish = () => {
    if (hasFinished) return;
    setHasFinished(true);

    // 🎬 Smooth 350ms Crossfade Transition into App
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true
    }).start(() => {
      if (onFinish) onFinish();
    });
  };

  useEffect(() => {
    // ⏱️ Enable tap-to-skip after 1.5s
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 1500);

    // 🛡️ Safety fallback ensures app always opens even if video finishes or stalls
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 5500);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="#000000" />

      {/* Tap-Anywhere Area to Skip after 1.5s */}
      <TouchableOpacity
        style={styles.touchableArea}
        activeOpacity={1}
        onPress={() => {
          if (canSkip) {
            handleFinish();
          }
        }}
      >
        {/* Full-Screen Edge-to-Edge Animated Intro Video */}
        <Video
          ref={videoRef}
          source={require('../../assets/lift_intro_animation.mp4')}
          rate={1.0}
          volume={0}
          isMuted={true}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping={false}
          style={styles.fullScreenVideo}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              handleFinish();
            }
          }}
          onError={(err) => {
            console.log('Video intro error:', err);
            handleFinish();
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000'
  }
});
