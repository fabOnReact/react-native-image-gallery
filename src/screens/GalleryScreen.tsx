import React, {useRef} from 'react';
import {
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {Media, Props} from '../types/types';
import {getCollectionsMedia} from '../api/api';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const GalleryScreen = ({route}: Props) => {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  const {item} = route.params;

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useSharedValue(0);

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

  // Animated Styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView>
        {media.map(item => (
          <GestureDetector gesture={pinchGesture}>
            <Animated.Image
              source={{uri: item.src.portrait}}
              style={[{width, height}, animatedStyle]}
            />
          </GestureDetector>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default GalleryScreen;
