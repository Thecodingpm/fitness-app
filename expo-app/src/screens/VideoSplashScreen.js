import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  View
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

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

  // Safety Timeout Fallback (Max 4 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Tap-Anywhere Container to skip intro immediately */}
      <TouchableOpacity
        style={styles.touchableArea}
        activeOpacity={1}
        onPress={handleFinish}
      >
        <Video
          source={require('../../assets/lift_intro_animation.mp4')}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          style={StyleSheet.absoluteFillObject}
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
    position: 'relative'
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});
