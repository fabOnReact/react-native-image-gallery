import {useInfiniteQuery} from '@tanstack/react-query';
import {
  ActivityIndicator,
  Button,
  FlatList,
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

const ITEM_HEIGHT = 60;
const SEPARATOR_HEIGHT = 12;

/*
 *  The Android implementation of RecyclerRecyclerView supports onCreateViewHolder, onBindViewHolder
 *  and has better performances than FlatList. More info here:
 *  https://github.com/andrew-levy/jetpack-compose-react-native/issues/9#issuecomment-2490336411
 *  https://developer.android.com/develop/ui/views/layout/recyclerview#implement-adapter
 */
function CollectionItem(props: CollectionItemProps) {
  const {title, photos_count} = props.item;
  const navigation = useNavigation<NavigationProp>();
  const onPress = () => navigation.navigate('Gallery', {item: props.item});

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.countText}>{photos_count}</Text>
        </View>
      </View>
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
    length: ITEM_HEIGHT + SEPARATOR_HEIGHT,
    offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
    index,
  });

  const renderItem = useCallback((props: CollectionItemProps) => {
    return <CollectionItem item={props.item} />;
  }, []);

  const renderSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  if (isLoading) {
    return <HeartWithLiquidActivityIndicator />;
  }

  if (isError) {
    return <ErrorMessage onRetry={refetch} />;
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    height: ITEM_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 16,
    // Android shadow
    elevation: 3,
    // iOS shadow
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
