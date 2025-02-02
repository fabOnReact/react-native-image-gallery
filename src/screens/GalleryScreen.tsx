import React from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {Media, Props} from '../types/types';
import {getCollectionsMedia} from '../api/api';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const GalleryScreen = ({route}: Props) => {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';

  if (!PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }

  const {item} = route.params;

  // Fetch media collection with React Query
  const {data, isLoading, error} = useQuery({
    queryKey: ['collectionMedia', item.id],
    queryFn: () => getCollectionsMedia(PEXELS_API_KEY, item.id),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  // Show loading spinner while fetching data
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Show error message if API request fails
  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>Failed to load images</Text>
      </View>
    );
  }

  // Ensure `media` is always an array to prevent crashes
  const media: Media[] = Array.isArray(data) ? data : [];

  if (media.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'gray'}}>
          No images available in this collection
        </Text>
      </View>
    );
  }

  // Zoom & Pan Variables
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch-to-Zoom Handler
  const pinchHandler = useAnimatedGestureHandler({
    onActive: event => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1); // Reset zoom when gesture ends
    },
  });

  // Pan (Drag) Handler
  const panHandler = useAnimatedGestureHandler({
    onActive: event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

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
        data={media}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View style={{flex: 1}}>
              <PanGestureHandler onGestureEvent={panHandler}>
                <Animated.View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Animated.Image
                    source={{uri: item.src.portrait}}
                    style={[
                      {width, height, resizeMode: 'contain'},
                      animatedStyle,
                    ]}
                  />
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        )}
      />
    </GestureHandlerRootView>
  );
};

export default GalleryScreen;
