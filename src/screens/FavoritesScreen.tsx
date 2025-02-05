import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';

const FavoritesScreen = () => {
  const [favorites] = useAtom(favoritesAtom);
  console.log('TESTING ' + 'favorites: ', favorites);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Images</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.imageContainer}>
              <Image source={{uri: item.src.portrait}} style={styles.image} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default FavoritesScreen;
