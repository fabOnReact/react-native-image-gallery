import {View, Dimensions, ActivityIndicator, Text} from 'react-native';
import {Media, Props} from '../types/types';
import {useQuery} from '@tanstack/react-query';
import {getCollectionsMedia} from '../api/api';
import ImageViewer from '../components/ImageViewer';

// Replace this with the useWindowDimensions() hook
Dimensions.get('window');

function GalleryScreen({route}: Props) {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY || PEXELS_API_KEY === '') {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }

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

  const numberOfImages = data?.total_results ?? 0;
  const media: Media[] = data?.media || [];

  return (
    <ImageViewer
      media={media}
      numberOfImages={numberOfImages}
      // onEndReached={onEndReachedCallback}
    />
  );
}

export default GalleryScreen;
