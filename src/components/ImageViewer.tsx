import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  ListRenderItem,
  ViewToken,
  TouchableWithoutFeedback,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDerivedValue, useSharedValue} from 'react-native-reanimated';
import {ImageViewerProps, Media} from '../types/types';
import PositionIndicator from '../components/PositionIndicator';
import PinchableImage from '../components/PinchableImage';
import FavoriteButton from '../components/FavoriteButton'; // Import Favorite Button
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import {useEffect, useState} from 'react';
import HeartWithLiquidButton from './HearthWithLiquidButton';

const {width, height} = Dimensions.get('window');

type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

function ImageViewer(props: ImageViewerProps) {
  const media: Media[] = props.media;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [withAnimation, setWithAnimation] = useState(true);

  const isFavorited =
    favorites === null || media[currentIndex] == null
      ? false
      : favorites.some(fav => fav?.id === media[currentIndex].id);

  const [valueWithAnimation, setValueWithAnimation] = useState(
    isFavorited ? 100 : 0,
  );

  const renderItem: ListRenderItem<Media> = ({item}) => (
    <View style={[{width, height}, styles.imageContainer]}>
      <PinchableImage item={item} />
    </View>
  );

  const onViewableItemsChanged = (props: ViewableItemsType) => {
    const {viewableItems} = props;
    if (viewableItems.length > 0) {
      setWithAnimation(false);
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50, // 50% of an image should be visible
  };

  const toggleFavorite = () => {
    // setWithAnimation(true);
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
      />
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          right: '50%',
          transform: [{translateX: 50}],
        }}>
        <TouchableWithoutFeedback onPress={toggleFavorite}>
          <View style={styles.containerButton} />
        </TouchableWithoutFeedback>
        <HeartWithLiquidButton
          size={100}
          value={isFavorited ? 100 : 0}
          withAnimation={withAnimation}
        />
      </View>
      {/*
      <PositionIndicator
        currentIndex={currentIndex}
        numberOfImages={numberOfImages}
      />
      */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerButton: {
    position: 'absolute',
    bottom: 10,
    right: '50%',
    transform: [{translateX: 50}],
    height: 100,
    width: 100,
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageViewer;
