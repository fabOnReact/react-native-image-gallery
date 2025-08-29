import React, {useCallback, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Media, GalleryScreenProps} from '../types/types';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getCollectionsMedia} from '../api/api';
import ImageViewer from '../components/ImageViewer';
import HeartWithLiquidActivityIndicator from '../components/HearthWithLiquidActivityIndicator';
import {PEXELS_API_KEY} from '../config/env';

const GalleryScreen: React.FC<GalleryScreenProps> = props => {
  const {item} = props.route.params;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['collectionMedia', item.id],
    queryFn: async ({pageParam}) =>
      getCollectionsMedia(PEXELS_API_KEY, item.id, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.next_page ?? undefined,
  });

  const onEndReachedCallback = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten pages into a single array and memoize it.
  const media: Media[] = useMemo(() => {
    return data?.pages.flatMap(page => page?.media ?? []) ?? [];
  }, [data]);

  // Get total results from the first page, if available.
  const numberOfImages = data?.pages?.[0]?.total_results ?? 0;

  if (isLoading) {
    return <HeartWithLiquidActivityIndicator />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load images.</Text>
      </View>
    );
  }

  if (media.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No images in this collection.</Text>
      </View>
    );
  }

  return (
    <ImageViewer
      media={media}
      numberOfImages={numberOfImages}
      onEndReachedCallback={onEndReachedCallback}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default GalleryScreen;
