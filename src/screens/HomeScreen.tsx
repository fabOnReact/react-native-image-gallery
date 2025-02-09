import {useInfiniteQuery} from '@tanstack/react-query';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getCollections} from '../api/api';
import {useCallback} from 'react';
import {
  Collection,
  CollectionItemProps,
  GetItemLayoutFunction,
  NavigationProp,
} from '../types/types';
import {useNavigation} from '@react-navigation/native';
import HeartWithLiquidActivityIndicator from '../components/HearthWithLiquidActivityIndicator';

function CollectionItem(props: CollectionItemProps) {
  const navigation = useNavigation<NavigationProp>();
  const onPress = () => navigation.navigate('Gallery', {item: props.item});
  return (
    <TouchableOpacity onPress={onPress} style={styles.collectionItem}>
      <Text>
        {props.item?.title} - {props.item?.photos_count}
      </Text>
    </TouchableOpacity>
  );
}

const ErrorMessage: React.FC<{onRetry: () => void}> = ({onRetry}) => (
  <View testID="error-message" style={styles.container}>
    <Text style={styles.errorMessageOne}>Oops! Something went wrong.</Text>
    <Text style={styles.errorMessageTwo}>Please try again later.</Text>
    <Button title="Retry" onPress={onRetry} />
  </View>
);

function HomeScreen() {
  const ITEM_HEIGHT = 60;
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY || PEXELS_API_KEY === '') {
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

  const collections: Collection[] =
    data?.pages.flatMap(page => page?.collections ?? []) ?? [];

  const validCollections = collections.filter(
    collection =>
      collection?.id &&
      collection?.title &&
      typeof collection?.photos_count === 'number' &&
      collection.photos_count > 0,
  );

  const loadMore = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const getItemLayout: GetItemLayoutFunction = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  if (isLoading) {
    return <HeartWithLiquidActivityIndicator />;
  }

  if (isError) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const renderItem: ListRenderItem<Collection> = ({item}) => {
    return <CollectionItem item={item} />;
  };

  return (
    <SafeAreaView>
      <FlatList
        testID="collection-list"
        data={validCollections}
        keyExtractor={item => String(item?.id)}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  collectionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
