import {useInfiniteQuery} from '@tanstack/react-query';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getCollections} from '../api/api';
import {useCallback} from 'react';
import {Collection, CollectionItemProps, NavigationProp} from '../types/types';
import {useNavigation} from '@react-navigation/native';

const CollectionItem: React.FC<CollectionItemProps> = ({item}) => {
  const navigation = useNavigation<NavigationProp>();
  const onPress = () => navigation.navigate('Gallery', {item});
  return (
    <TouchableOpacity onPress={onPress} style={styles.collectionItem}>
      <Text>
        {item.title} - {item.media_count}
      </Text>
    </TouchableOpacity>
  );
};

const ErrorMessage: React.FC<{onRetry: () => void}> = ({onRetry}) => (
  <View
    testID="error-message"
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
    <Text style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>
      Oops! Something went wrong.
    </Text>
    <Text style={{color: 'gray', fontSize: 14, marginTop: 8}}>
      Please try again later.
    </Text>
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
    queryFn: ({pageParam = 1}) => getCollections(PEXELS_API_KEY, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.nextPage ?? null,
  });

  const collections: Collection[] =
    data?.pages.flatMap(page => page.collections) ?? [];

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          testID="loading-indicator"
        />
      </View>
    );
  }

  if (isError) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const renderItem: ListRenderItem<Collection> = ({item}) => (
    <CollectionItem item={item} />
  );

  return (
    <FlatList
      testID="collection-list"
      data={collections}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  collectionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeScreen;
