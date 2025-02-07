import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import ImageViewer from '../components/ImageViewer';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../types/types';

const FavoritesScreen = () => {
  const [favorites] = useAtom(favoritesAtom);

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
  container: {
    flex: 1,
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
