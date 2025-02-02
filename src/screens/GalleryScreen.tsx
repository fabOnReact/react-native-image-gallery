import React from 'react';
import {Dimensions} from 'react-native';
import {Media, Props} from '../types/types';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const GalleryScreen = ({route}: Props) => {
  // Dummy media list for testing
  const media: Media[] = [
    {
      id: 1,
      src: {
        portrait:
          'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      },
    },
    {
      id: 2,
      src: {
        portrait:
          'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      },
    },
    {
      id: 3,
      src: {
        portrait:
          'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      },
    },
  ];

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView>
        {media.map(item => (
          <PinchableImage key={item.id} item={item} />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

function PinchableImage({item}) {
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
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  // Pan Gesture (Move)
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  // Combined Gesture (Pinch + Pan)
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animated Styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.Image
        source={{uri: item.src.portrait}}
        style={[{width, height}, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
}

export default GalleryScreen;
