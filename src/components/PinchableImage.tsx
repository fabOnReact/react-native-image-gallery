import React, {useCallback, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ImageStyle,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {PinchableImageProps} from '../types/types';
import HeartWithLiquidActivityIndicator from './HearthWithLiquidActivityIndicator';

function PinchableImage(props: PinchableImageProps) {
  const {item, firstItem} = props;
  const {width, height} = useWindowDimensions();
  const portrait = item?.src?.portrait;
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // **Double-Tap Gesture for Zoom**
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value === 1) {
        // Zoom in
        scale.value = withTiming(2, {duration: 300});
      } else {
        // Zoom out: reset scale and translation
        scale.value = withTiming(1, {duration: 300});
        translateX.value = withTiming(0, {duration: 300});
        translateY.value = withTiming(0, {duration: 300});
      }
    });

  // **Pinch Gesture for Manual Zooming**
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      // Limit zoom between 1x and 3x.
      scale.value = Math.max(1, Math.min(event.scale, 3));
    })
    .onEnd(() => {
      if (scale.value < 1) {
        // Snap back if zoom is less than 1.
        scale.value = withTiming(1, {duration: 300});
        translateX.value = withTiming(0, {duration: 300});
        translateY.value = withTiming(0, {duration: 300});
      }
    });

  // **Pan Gesture (Move)**
  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      // If only one finger is present and not zoomed, let FlatList handle horizontal paging.
      if (event.allTouches.length === 1 && scale.value === 1) {
        stateManager.fail();
      } else {
        stateManager.activate();
      }
    })
    .onUpdate(event => {
      // Only update translation when zoomed in.
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      // Reset translations if not zoomed.
      if (scale.value <= 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  // **Combine Gestures (Pinch, Pan, and Double Tap)**
  const combinedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture,
  );

  // Animated style for image transformations.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  // Static image style with opacity toggled by loading state.
  const imageStyles: StyleProp<ImageStyle> = {
    width,
    height,
    opacity: loaded ? 1 : 0,
  };

  // Early return if the image URL is missing or loading fails.
  if (!portrait || loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>Image not found.</Text>
      </View>
    );
  }

  // Memoized callbacks for image load events.
  const onLoadCallback = useCallback(() => {
    setLoaded(true);
  }, []);

  const onErrorCallback = useCallback(() => {
    console.error(`Failed to load image: ${portrait}`);
    setLoadError(true);
  }, [portrait]);

  return (
    <>
      <GestureDetector gesture={combinedGesture}>
        <Animated.Image
          source={{uri: portrait}}
          style={[imageStyles, animatedStyle]}
          resizeMode="cover"
          onLoadEnd={onLoadCallback}
          onError={onErrorCallback}
        />
      </GestureDetector>
      {!loaded && firstItem && (
        <HeartWithLiquidActivityIndicator value={55} animationDuration={1000} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
});

export default PinchableImage;
