import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import ImageViewer from '../components/ImageViewer';
import {FavoritesType} from '../types/types';

const FavoritesScreen: React.FC = () => {
  const [favorites]: FavoritesType = useAtom(favoritesAtom);

  return (
    <>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
        </View>
      ) : (
        <ImageViewer numberOfImages={favorites.length} media={favorites} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default FavoritesScreen;
