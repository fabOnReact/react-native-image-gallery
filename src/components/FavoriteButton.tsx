import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {useAtom} from 'jotai';
import {favoritePicturesAtom, toggleFavoritePictureAtom} from '../store/store';
import {Media} from '../types/types';

type FavoriteButtonProps = {
  picture: Media;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({picture}) => {
  const [favorites, toggleFavorite] = useAtom(toggleFavoritePictureAtom);
  const isFavorited = favorites.some(fav => fav.id === picture.id);

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
    bottom: 20,
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
