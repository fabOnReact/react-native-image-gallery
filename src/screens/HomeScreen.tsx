import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getCollections} from '../api/api';
import {
  Collection,
  CollectionItemProps,
  GetItemLayoutFunction,
  NavigationProp,
} from '../types/types';
import {useNavigation} from '@react-navigation/native';
import HeartWithLiquidActivityIndicator from '../components/HearthWithLiquidActivityIndicator';

const ITEM_HEIGHT = 60;
const SEPARATOR_HEIGHT = 12;

/**
 * A memoized collection item component.
 */
const CollectionItem = React.memo(
  ({item}: CollectionItemProps) => {
    const navigation = useNavigation<NavigationProp>();

    const onPress = useCallback(() => {
      navigation.navigate('Gallery', {item});
    }, [navigation, item]);

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.countText}>{item.photos_count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.photos_count === nextProps.item.photos_count
    );
  },
);

const ErrorMessage: React.FC<{onRetry: () => void}> = ({onRetry}) => (
  <View testID="error-message" style={styles.container}>
    <Text style={styles.errorMessageOne}>Oops! Something went wrong.</Text>
    <Text style={styles.errorMessageTwo}>Please try again later.</Text>
    <Button title="Retry" onPress={onRetry} />
  </View>
);

const HomeScreen: React.FC = () => {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['collections'],
    queryFn: async ({pageParam}) =>
      getCollections(PEXELS_API_KEY, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.next_page ?? null,
  });

  // Flatten the pages into one array and filter out invalid collections.
  const validCollections = useMemo(() => {
    const collections: Collection[] =
      data?.pages.flatMap(page => page?.collections ?? []) ?? [];
    return collections.filter(
      collection =>
        collection?.id &&
        collection?.title &&
        typeof collection?.photos_count === 'number' &&
        collection.photos_count > 0,
    );
  }, [data]);

  // Callback to load more data when FlatList reaches the end.
  const loadMore = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Calculate item layout including the separator.
  const getItemLayout: GetItemLayoutFunction = useCallback(
    (_, index: number) => ({
      length: ITEM_HEIGHT + SEPARATOR_HEIGHT,
      offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback((props: CollectionItemProps) => {
    return <CollectionItem item={props.item} />;
  }, []);

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  if (isLoading) {
    return <HeartWithLiquidActivityIndicator />;
  }

  if (isError) {
    return <ErrorMessage onRetry={refetch} />;
  }

  if (validCollections.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No collections available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="collection-list"
      data={validCollections}
      keyExtractor={item => String(item?.id)}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      initialNumToRender={10}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            testID="loading-indicator"
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: ITEM_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    height: SEPARATOR_HEIGHT,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  countText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
  },
  errorMessageOne: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessageTwo: {
    color: 'gray',
    fontSize: 14,
    marginTop: 8,
  },
});

export default HomeScreen;
