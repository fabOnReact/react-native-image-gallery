import {StyleSheet, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {PinchableImageProps} from '../types/types';

function PinchableImage({item}: PinchableImageProps) {
  const {width, height} = useWindowDimensions();
  const {portrait} = item.src;
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(1); // To track previous zoom state

  // **Double-Tap Gesture for Zoom**
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2) // Detect double-tap
    .onEnd(() => {
      if (scale.value === 1) {
        // Zoom in
        scale.value = withTiming(2, {duration: 300});
        lastScale.value = 2;
      } else {
        // Zoom out
        scale.value = withTiming(1, {duration: 300});
        translateX.value = withTiming(0, {duration: 300});
        translateY.value = withTiming(0, {duration: 300});
        lastScale.value = 1;
      }
    });

  // **Pinch Gesture for Manual Zooming**
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = Math.max(1, Math.min(event.scale, 3)); // Min 1x, Max 3x zoom
    })
    .onEnd(() => {
      // Snap back if zoom < 1
      if (scale.value < 1) {
        scale.value = withTiming(1, {duration: 300});
        translateX.value = withTiming(0, {duration: 300});
        translateY.value = withTiming(0, {duration: 300});
      }
    });

  // Pan Gesture (Move)
  const panGesture = Gesture.Pan()
    // Use manual activation so we can decide when to activate/fail
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      /*
        If only one finger is touching AND scale is 1 (i.e., not zoomed),
        we fail the pan gesture so the FlatList can handle horizontal paging.
        If scale > 1 or multiple fingers, we activate the pan gesture.
      */
      if (event.allTouches.length === 1 && scale.value === 1) {
        stateManager.fail();
      } else {
        stateManager.activate();
      }
    })
    .onUpdate(event => {
      // Only update translations if we're zoomed in
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      // Reset if not zoomed in
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

  // Animated styling
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  const styles = {
    image: {
      width,
      height,
    },
  };

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.Image
        source={{uri: portrait}}
        style={[styles.image, animatedStyle]}
        resizeMode="cover"
        onError={() => console.log(`Failed to load image: ${portrait}`)}
      />
    </GestureDetector>
  );
}

export default PinchableImage;
