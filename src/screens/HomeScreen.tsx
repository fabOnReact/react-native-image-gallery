import {useQuery} from '@tanstack/react-query';
import {StyleSheet, Text, View} from 'react-native';
import {getCollections} from '../api/api';

function HomeScreen() {
  const query = useQuery({queryKey: ['collections'], queryFn: getCollections});

  if (query.isLoading) return <Text>Loading...</Text>;
  if (query.isError) return <Text>Error loading collections</Text>;
  if (query.data.length === 0) return <Text>No collections found</Text>;

  // TODO - Use FlatList to render the collections
  return (
    <View style={styles.homeStyle}>
      {query.data?.map((collection: {title: string}) => (
        <Text>{collection.title}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  homeStyle: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default HomeScreen;
