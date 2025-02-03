import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
  Text,
  ViewToken,
  SafeAreaView,
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
import PositionIndicator from '../components/PositionIndicator';

// Replace this with the useWindowDimensions() hook
const {width, height} = Dimensions.get('window');

type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

export default function GalleryScreen({route}: Props) {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY || PEXELS_API_KEY === '') {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }

  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  // Give a default to prevent crashes
  // const { item = { id: '', name: '' } } = route.params || {};
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

  const numberOfImages = data?.total_results ?? 0;
  const media: Media[] = data?.media || [];

  const onViewableItemsChanged = (props: ViewableItemsType) => {
    const {viewableItems} = props;
    if (viewableItems.length > 0) {
      currentIndex.value = viewableItems[0].index ?? 0;
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50, // 50% of an image should be visible
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView style={styles.container}>
        <FlatList
          data={media}
          keyExtractor={item => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={renderItem}
          onScroll={event => {
            scrollX.value = event.nativeEvent.contentOffset.x;
          }}
        />
        <PositionIndicator
          currentIndex={currentIndex}
          numberOfImages={numberOfImages}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

function PinchableImage({item}: PinchableImageProps) {
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
