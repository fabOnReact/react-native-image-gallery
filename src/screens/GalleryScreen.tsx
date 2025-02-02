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
          <PinchableImage item={item} />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

function PinchableImage({item}) {
  const scale = useSharedValue(1);

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

  // Pan Gesture (Move)

  // Animated Styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.Image
        source={{uri: item.src.portrait}}
        style={[{width, height}, animatedStyle]}
      />
    </GestureDetector>
  );
}

export default GalleryScreen;
