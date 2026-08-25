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

    // 🎬 Smooth 350ms Crossfade Transition into Next Screen (Auth / Login)
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true
    }).start(() => {
      onFinish();
    });
  };

  useEffect(() => {
    // ⏱️ Enable invisible tap-to-skip after 1.5 seconds for returning athletes
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 1500);

    // 🛡️ Safety timeout (6.2s) ensures app always progresses seamlessly
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 6200);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="#000000" />

      {/* Tap-Anywhere Area (Active after 1.5s, no distracting buttons) */}
      <TouchableOpacity
        style={styles.touchableArea}
        activeOpacity={1}
        onPress={() => {
          if (canSkip) {
            handleFinish();
          }
        }}
      >
        {/* Full-Screen Edge-to-Edge Autoplaying Muted Video */}
        <Video
          ref={videoRef}
          source={require('../../assets/logo_final_lift.mp4')}
          rate={1.0}
          volume={0}
          isMuted={true}
          resizeMode={ResizeMode.COVER}
          shouldPlay={true}
          isLooping={false}
          style={styles.fullScreenVideo}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              handleFinish();
            }
          }}
          onError={() => {
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
    height: SCREEN_HEIGHT
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000'
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000'
  }
});
