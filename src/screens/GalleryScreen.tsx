import React from 'react';
import {View, ActivityIndicator, Text, useWindowDimensions} from 'react-native';
import {Media, Props} from '../types/types';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getCollectionsMedia} from '../api/api';
import ImageViewer from '../components/ImageViewer';

function GalleryScreen({route}: Props) {
  useWindowDimensions(); // for responsive layouts
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }

  const {item} = route.params;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['collectionMedia', item.id],
    queryFn: ({pageParam = 1}) =>
      getCollectionsMedia(PEXELS_API_KEY, item.id, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage || undefined,
  });

  if (isLoading) {
    // implement your own activity indicator
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>Failed to load images</Text>
      </View>
    );
  }

  // Combine pages into one flat array
  const media: Media[] = data?.pages.flatMap((page: any) => page.media) ?? [];
  const numberOfImages = data?.pages[0].total_results ?? 0;

  // onEndReached callback: if there is a next page and we are not already fetching, then fetch it.
  const onEndReachedCallback = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ImageViewer
      media={media}
      numberOfImages={numberOfImages}
      onEndReachedCallback={onEndReachedCallback}
    />
  );
}

export default GalleryScreen;
