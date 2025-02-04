  FlatList,
  View,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
  Text,
  ViewToken,
  useWindowDimensions,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {Media, Props} from '../types/types';
import {useQuery} from '@tanstack/react-query';
import {getCollectionsMedia} from '../api/api';
import PositionIndicator from '../components/PositionIndicator';
import PinchableImage from '../components/PinchableImage';

type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

function GalleryScreen({route}: Props) {
  const {width, height} = useWindowDimensions();
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
});

export default GalleryScreen;
