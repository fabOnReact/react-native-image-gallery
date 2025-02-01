import {useInfiniteQuery} from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getCollections} from '../api/api';
import {useCallback} from 'react';
import {
  Collection,
  CollectionWithNavigation,
  NavigationProp,
} from '../types/types';
import {useNavigation} from '@react-navigation/native';

const CollectionItem = ({item, navigation}: CollectionWithNavigation) => {
  const onPress = () => navigation.navigate('Image', {item});
  return (
    <TouchableOpacity onPress={onPress} style={styles.collectionItem}>
      <Text>
        {item.title} - {item.media_count}
      </Text>
    </TouchableOpacity>
  );
};

function HomeScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['collections'],
    queryFn: ({pageParam = 1}) => getCollections(pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.nextPage ?? null,
  });

  console.warn('HomeScreen');
  const navigation = useNavigation<NavigationProp>();
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error loading collections</Text>
      </View>
    );
  }

  const renderItem: ListRenderItem<Collection> = ({item}) => (
    <CollectionItem item={item} navigation={navigation} />
  );

  return (
    <FlatList
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
