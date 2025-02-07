import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  ListRenderItem,
  ViewToken,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {ImageViewerProps, Media} from '../types/types';
import PositionIndicator from '../components/PositionIndicator';
import PinchableImage from '../components/PinchableImage';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import {useState} from 'react';
import HeartWithLiquidButton from './HearthWithLiquidButton';

const {width, height} = Dimensions.get('window');

type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

function ImageViewer(props: ImageViewerProps) {
  const numberOfImages = props.numberOfImages;
  const media: Media[] = props.media;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexSharedValue = useSharedValue(0);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const scrollX = useSharedValue(0);
  const [withAnimation, setWithAnimation] = useState(false);

  const isFavorited =
    favorites === null || media[currentIndex] == null
      ? false
      : favorites.some(fav => fav?.id === media[currentIndex].id);

  const renderItem: ListRenderItem<Media> = ({item}) => (
    <View style={[{width, height}, styles.imageContainer]}>
      <PinchableImage item={item} />
    </View>
  );

  const onViewableItemsChanged = (props: ViewableItemsType) => {
    const {viewableItems} = props;
    if (viewableItems.length > 0) {
      currentIndexSharedValue.value = viewableItems[0].index ?? 0;
      setWithAnimation(false);
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50, // 50% of an image should be visible
  };

  const toggleFavorite = () => {
    setWithAnimation(true);
    if (isFavorited) {
      const newFavorites = favorites.filter(
        fav => fav?.id !== media[currentIndex].id,
      );
      setFavorites(newFavorites);
    } else {
      const newFavorites = [...favorites, media[currentIndex]];
      setFavorites(newFavorites);
    }
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
        <TouchableWithoutFeedback onPress={toggleFavorite}>
          <View style={[styles.invisibleButton, {zIndex: 1}]} />
        </TouchableWithoutFeedback>
        <HeartWithLiquidButton
          size={100}
          value={isFavorited ? 70 : 10}
          withAnimation={withAnimation}
          style={styles.invisibleButton}
        />
        <PositionIndicator
          currentIndex={currentIndexSharedValue}
          numberOfImages={numberOfImages}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  invisibleButton: {
    position: 'absolute',
    bottom: 10,
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
