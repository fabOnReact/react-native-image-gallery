import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  ListRenderItem,
  ViewToken,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {ImageViewerProps, Media} from '../types/types';
import PositionIndicator from '../components/PositionIndicator';
import PinchableImage from '../components/PinchableImage';
import FavoriteButton from '../components/FavoriteButton'; // Import Favorite Button

const {width, height} = Dimensions.get('window');

type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

function ImageViewer(props: ImageViewerProps) {
  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const numberOfImages = props.numberOfImages;
  const media: Media[] = props.media;

  const renderItem: ListRenderItem<Media> = ({item}) => (
    <View style={[{width, height}, styles.imageContainer]}>
      <PinchableImage item={item} />
      <FavoriteButton picture={item} />
    </View>
  );

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageViewer;
