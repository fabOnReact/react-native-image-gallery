import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ListRenderItem,
  TouchableWithoutFeedback,
  ViewabilityConfig,
  Dimensions,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {
  ImageViewerProps,
  MaybeArray,
  Media,
  ViewableItemsType,
} from '../types/types';
import PositionIndicator from '../components/PositionIndicator';
import PinchableImage from '../components/PinchableImage';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import HeartWithLiquidButton from './HearthWithLiquidButton';

const {width, height} = Dimensions.get('window');

function ImageViewer(props: ImageViewerProps) {
  const {numberOfImages, media, onEndReachedCallback} = props;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useSharedValue<number>(0);
  const currentIndexSharedValue = useSharedValue<number>(0);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [withAnimation, setWithAnimation] = useState(false);

  // Determine if the current image is favorited.
  const isFavorited = useMemo(() => {
    if (!favorites || !media[currentIndex]) return false;
    return favorites.some(fav => fav?.id === media[currentIndex].id);
  }, [favorites, media, currentIndex]);

  // Render each image item.
  const renderItem: ListRenderItem<Media> = useCallback(
    ({item, index}) => (
      <View
        testID={`flatlist-item-${index}`}
        style={[{width, height}, styles.imageContainer]}>
        <PinchableImage item={item} firstItem={index === 0} />
      </View>
    ),
    [],
  );

  // Update current index when viewable items change.
  const onViewableItemsChanged = useCallback(
    (props: ViewableItemsType) => {
      const {viewableItems} = props;
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index ?? 0;
        currentIndexSharedValue.value = newIndex;
        setWithAnimation(false);
        setCurrentIndex(newIndex);
      }
    },
    [currentIndexSharedValue],
  );

  // Use a memoized viewability config.
  const viewabilityConfig: ViewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 50,
    }),
    [],
  );

  // Calculate item layout, including item width.
  const getItemLayout = useCallback(
    (_data: MaybeArray<Media>, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [],
  );

  // Memoize the scroll handler.
  const onScroll = useCallback(
    (event: any) => {
      scrollX.value = event.nativeEvent.contentOffset.x;
    },
    [scrollX],
  );

  // Toggle favorite status for the current image.
  const toggleFavorite = useCallback(() => {
    if (!media[currentIndex]) return;
    setWithAnimation(true);
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav?.id !== media[currentIndex].id));
    } else {
      setFavorites([...favorites, media[currentIndex]]);
    }
  }, [favorites, media, currentIndex, isFavorited, setFavorites]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={media}
        keyExtractor={item => String(item?.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        onScroll={onScroll}
        onEndReached={onEndReachedCallback}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        getItemLayout={getItemLayout}
        testID="collection-list"
      />
      <TouchableWithoutFeedback
        onPress={toggleFavorite}
        testID={'toggle-favorite-button-touchable'}>
        <View style={[styles.invisibleButton, {zIndex: 1}]} />
      </TouchableWithoutFeedback>
      <HeartWithLiquidButton
        size={100}
        value={isFavorited ? 70 : 10}
        withAnimation={withAnimation}
        style={styles.invisibleButton}
        animationDuration={3000}
        testID={'toggle-favorite-button'}
      />
      <PositionIndicator scrollX={scrollX} numberOfImages={numberOfImages} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  invisibleButton: {
    position: 'absolute',
    bottom: 20,
    right: '50%',
    transform: [{translateX: 50}],
    height: 100,
    width: 100,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageViewer;
