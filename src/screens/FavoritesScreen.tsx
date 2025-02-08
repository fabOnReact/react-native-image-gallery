import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import ImageViewer from '../components/ImageViewer';
import {FavoritesType} from '../types/types';

const FavoritesScreen = () => {
  const [favorites]: FavoritesType = useAtom(favoritesAtom);

  return (
    <>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <ImageViewer numberOfImages={favorites.length} media={favorites} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoritesScreen;
