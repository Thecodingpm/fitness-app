import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

/**
 * 🔒 Memoized Native VideoView layer.
 * Prevents re-assigning playerViewController.player on iOS AVPlayerViewController,
 * which eliminates the catastrophic re-attachment / pause loop.
 */
const MemoizedAppVideoView = memo(
  function MemoizedAppVideoView({ player, contentFit, nativeControls, onFirstFrameRender, ...props }) {
    if (!player) return null;
    return (
      <VideoView
        style={StyleSheet.absoluteFillObject}
        player={player}
        nativeControls={nativeControls}
        contentFit={contentFit}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        onFirstFrameRender={onFirstFrameRender}
        {...props}
      />
    );
  },
  (prev, next) => prev.player === next.player && prev.contentFit === next.contentFit && prev.nativeControls === next.nativeControls
);

/**
 * Universal Modern Video Player component using official SDK 57 expo-video.
 * Supports poster fallback, audioMixingMode to prevent iOS conflicts, and smooth looping.
 */
export function AppVideoPlayer({
  source,
  poster,
  style,
  contentFit = 'contain',
  loop = true,
  muted = true,
  autoPlay = true,
  onEnd,
  nativeControls = false,
  ...props
}) {
  const [isReady, setIsReady] = useState(false);

  if (!source) {
    if (poster) {
      return (
        <View style={[styles.container, style]}>
          <Image
            source={poster}
            style={StyleSheet.absoluteFillObject}
            resizeMode={contentFit === 'cover' ? 'cover' : 'contain'}
          />
        </View>
      );
    }
    return <View style={style} />;
  }

  const player = useVideoPlayer(source, (p) => {
    p.loop = loop;
    p.muted = muted;
    try {
      p.audioMixingMode = 'mixWithOthers';
    } catch (_) {}
    if (autoPlay) {
      p.play();
    }
  });

  useEffect(() => {
    if (!player) return;

    player.loop = loop;
    player.muted = muted;
    try {
      player.audioMixingMode = 'mixWithOthers';
    } catch (_) {}

    if (player.status === 'readyToPlay' || player.playing) {
      setIsReady(true);
    }

    if (autoPlay && !player.playing) {
      try {
        player.play();
      } catch (_) {}
    }

    const statusSub = player.addListener('statusChange', (event) => {
      if (event.status === 'readyToPlay') {
        setIsReady(true);
        if (autoPlay) {
          try {
            player.play();
          } catch (_) {}
        }
      }
    });

    let endSub;
    if (onEnd) {
      endSub = player.addListener('playToEnd', () => {
        onEnd();
      });
    }

    return () => {
      if (statusSub && typeof statusSub.remove === 'function') statusSub.remove();
      if (endSub && typeof endSub.remove === 'function') endSub.remove();
    };
  }, [player, loop, muted, autoPlay, onEnd]);

  return (
    <View style={[styles.container, style]}>
      {/* 🖼️ High-Definition 3D Visual Poster (Always in background so screen is NEVER black) */}
      {poster && (
        <Image
          source={poster}
          style={StyleSheet.absoluteFillObject}
          resizeMode={contentFit === 'cover' ? 'cover' : 'contain'}
        />
      )}

      {/* 🎬 Native Hardware Video Layer (Always active, memoized to prevent re-attachment) */}
      <MemoizedAppVideoView
        player={player}
        nativeControls={nativeControls}
        contentFit={contentFit}
        onFirstFrameRender={() => setIsReady(true)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000'
  }
});

export default AppVideoPlayer;
