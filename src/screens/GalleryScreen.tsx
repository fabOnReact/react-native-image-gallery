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

  // Function to safely scroll FlatList
  const scrollToImage = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index, animated: true});
    }
  };

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

  // Swipe Gesture (Only when not zoomed in)
  const swipeGesture = Gesture.Pan()
    .enabled(scale.value === 1) // Only trigger if not zoomed
    .onEnd(event => {
      if (scale.value > 1) return; // Prevent swipe when zoomed

      const velocityThreshold = 800; // Minimum velocity to trigger a swipe
      const directionThreshold = width * 0.3; // Minimum distance swiped

      if (
        event.velocityX > velocityThreshold ||
        event.translationX > directionThreshold
      ) {
        // Swipe right (previous image)
        if (currentIndex.value > 0) {
          currentIndex.value -= 1;
          runOnJS(scrollToImage)(currentIndex.value);
        }
      } else if (
        event.velocityX < -velocityThreshold ||
        event.translationX < -directionThreshold
      ) {
        // Swipe left (next image)
        if (currentIndex.value < media.length - 1) {
          currentIndex.value += 1;
          runOnJS(scrollToImage)(currentIndex.value);
        }
      }
    });

  // Combine gestures
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    swipeGesture,
  );

  // Animated Styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      <FlatList
        ref={flatListRef}
        data={media}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={{width, height, overflow: 'hidden'}}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={{flex: 1, width, height}}>
                <Animated.Image
                  source={{uri: item.src.portrait}}
                  style={[
                    {width, height, resizeMode: 'contain'},
                    animatedStyle,
                  ]}
                />
              </Animated.View>
            </GestureDetector>
          </View>
        )}
      />
    </GestureHandlerRootView>
  );
};

export default GalleryScreen;
