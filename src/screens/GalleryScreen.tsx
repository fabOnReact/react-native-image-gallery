import React from 'react';
import {Dimensions, Image} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const GalleryScreen = () => {
  const image = {
    src: {
      portrait:
        'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
    },
  };

  // Shared values for scale and translation
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
      }
    });

  // Pan Gesture (Dragging) - Only works when zoomed in
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (scale.value > 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // Combine gestures
  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[{flex: 1}, animatedStyle]}>
          <Image
            source={{uri: image.src.portrait}}
            style={{width, height}}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default GalleryScreen;
