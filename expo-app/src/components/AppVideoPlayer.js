import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

/**
 * Universal Modern Video Player component using official SDK 57 expo-video.
 * Replaces legacy expo-av Video to ensure full compatibility with Expo Go SDK 57.
 */
export function AppVideoPlayer({
  source,
  style,
  contentFit = 'cover',
  loop = true,
  muted = true,
  autoPlay = true,
  onEnd,
  nativeControls = false,
  ...props
}) {
  if (!source) {
    return <View style={style} />;
  }

  const player = useVideoPlayer(source, (p) => {
    p.loop = loop;
    p.muted = muted;
    if (autoPlay) {
      p.play();
    }
  });

  useEffect(() => {
    if (!player) return;

    player.loop = loop;
    player.muted = muted;
    if (autoPlay) {
      player.play();
    }

    let subscription;
    if (onEnd) {
      subscription = player.addListener('playToEnd', () => {
        onEnd();
      });
    }

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [player, loop, muted, autoPlay, onEnd, source]);

  return (
    <VideoView
      style={style}
      player={player}
      nativeControls={nativeControls}
      contentFit={contentFit}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      {...props}
    />
  );
}

export default AppVideoPlayer;
