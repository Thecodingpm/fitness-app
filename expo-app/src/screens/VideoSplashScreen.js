import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  View,
  Dimensions,
  Platform
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VideoSplashScreen({ onFinish }) {
  // Stages: 1 = First Logo Animation, 2 = Second Intro Video
  const [currentStage, setCurrentStage] = useState(1);
  const [hasFinished, setHasFinished] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const stageTransitionAnim = useRef(new Animated.Value(1)).current;
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const handleFinish = () => {
    if (hasFinished) return;
    setHasFinished(true);

    // 🎬 Smooth 350ms Crossfade Transition into App
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: Platform.OS !== 'web'
    }).start(() => {
      if (onFinish) onFinish();
    });
  };

  const handleNextStage = () => {
    if (currentStage === 1) {
      // Smooth cross-fade to stage 2 (previous intro animation)
      Animated.sequence([
        Animated.timing(stageTransitionAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web'
        }),
        Animated.timing(stageTransitionAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web'
        })
      ]).start();
      setCurrentStage(2);
    } else {
      handleFinish();
    }
  };

  useEffect(() => {
    // ⏱️ Enable tap-to-skip after 1.2s
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 1200);

    // 🛡️ Safety fallback ensures app always opens even if video stalls
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 9000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="#000000" />

      {/* Tap-Anywhere Area to Skip or Advance */}
      <TouchableOpacity
        style={styles.touchableArea}
        activeOpacity={1}
        onPress={() => {
          if (canSkip) {
            handleFinish();
          }
        }}
      >
        {/* 🎬 1. NEW FIRST ANIMATED LOGO VIDEO (Plays First) */}
        {currentStage === 1 && (
          <Animated.View style={[styles.videoWrapper, { opacity: stageTransitionAnim }]}>
            <Video
              ref={videoRef1}
              source={require('../../assets/lift_logo_animated.mp4')}
              rate={1.0}
              volume={0}
              isMuted={true}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              isLooping={false}
              style={styles.fullScreenVideo}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded && status.didJustFinish) {
                  handleNextStage();
                }
              }}
              onError={(err) => {
                console.log('Logo video 1 error:', err);
                handleNextStage();
              }}
            />
          </Animated.View>
        )}

        {/* 🎬 2. PREVIOUS INTRO ANIMATION VIDEO (Plays Second) */}
        {currentStage === 2 && (
          <Animated.View style={[styles.videoWrapper, { opacity: stageTransitionAnim }]}>
            <Video
              ref={videoRef2}
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
                console.log('Intro video 2 error:', err);
                handleFinish();
              }}
            />
          </Animated.View>
        )}
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
  videoWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000'
  }
});
