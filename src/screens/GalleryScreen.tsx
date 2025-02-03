import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Media, PinchableImageProps, Props} from '../types/types';
import {useQuery} from '@tanstack/react-query';
import {getCollectionsMedia} from '../api/api';

const {width, height} = Dimensions.get('window');

// Dummy media list
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
        'https://images.pexels.com/photos/1034678/pexels-photo-1034678.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
    },
  },
  {
    id: 3,
    src: {
      portrait:
        'https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
    },
  },
];

export default function GalleryScreen({route}: Props) {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY || PEXELS_API_KEY === '') {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }
  const {item} = route.params;

  const {data, isLoading, error} = useQuery({
    queryKey: ['collectionMedia', item.id],
    queryFn: () => getCollectionsMedia(PEXELS_API_KEY, item.id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>Failed to load images</Text>
      </View>
    );
  }

  const renderItem: ListRenderItem<Media> = ({item}) => (
    <View style={{width, height}}>
      <PinchableImage item={item} />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={data as Media[]}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
}

function PinchableImage({item}: PinchableImageProps) {
  const {portrait} = item.src;
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      // Snap back if zoom < 1
      if (scale.value < 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
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

  // Combine pinch and pan
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

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

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.Image
        source={{uri: portrait}}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    width, // fill the entire screen width
    height, // fill the entire screen height
  },
});
