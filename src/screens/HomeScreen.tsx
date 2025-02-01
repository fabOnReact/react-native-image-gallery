import {useInfiniteQuery} from '@tanstack/react-query';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {getCollections} from '../api/api';

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

  const collections = data?.pages.flatMap(page => page.collections) ?? [];

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

  return (
    <FlatList
      data={collections}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#ddd'}}>
          <Text>{item.title}</Text>
        </View>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : null
      }
    />
  );
}

export default HomeScreen;
