import React, {useCallback, useRef} from 'react';
import {Text, StyleSheet, View, Platform, FlatList} from 'react-native';
import {useAtom} from 'jotai';
import {favoritesAtom} from '../store/store';
import ImageViewer from '../components/ImageViewer';
import {FavoritesType} from '../types/types';

const FavoritesScreen: React.FC = () => {
  const [favorites]: FavoritesType = useAtom(favoritesAtom);
  const imageViewerRef = useRef<FlatList>(null);
  const isPlatformAndroid = Platform.OS === 'android';

  /*
   * This is a workaround for a react-native FlatList issue on Android.
   * Last item delete in horizontal flatlist does not adjust scroll position. #27504
   * https://github.com/facebook/react-native/issues/27504
   */
  const onEndReachedCallback = useCallback(() => {
    if (imageViewerRef?.current && isPlatformAndroid) {
      imageViewerRef.current.scrollToEnd();
    }
  }, [isPlatformAndroid]);

  return (
    <>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
        </View>
      ) : (
        <ImageViewer
          ref={imageViewerRef}
          numberOfImages={favorites.length}
          media={favorites}
          onEndReachedCallback={onEndReachedCallback}
        />
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
