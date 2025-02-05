import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {useAtom} from 'jotai';
import {Media} from '../types/types';
import {favoritesAtom} from '../store/store';

type FavoriteButtonProps = {
  picture: Media;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({picture}) => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  // TODO - Verify that jotai makes check on the data type entered in favorites
  // for now I only check for null, as I want to know if the data is not null
  const isFavorited =
    favorites === null ? false : favorites.some(fav => fav.id === picture.id);

  const toggleFavorite = (picture: Media) => {
    if (isFavorited) {
      console.log('remove from favorites');
      setFavorites(favorites.filter(fav => fav.id !== picture.id));
      console.log('TESTING ' + 'favorites: ', favorites);
    } else {
      console.log('add to favorites');
      setFavorites([...favorites, picture]);
      console.log('TESTING ' + 'favorites: ', favorites);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => toggleFavorite(picture)}>
        <Text style={styles.icon}>{isFavorited ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 120,
    left: '50%',
    transform: [{translateX: -25}],
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
});

export default FavoriteButton;
