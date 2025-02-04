import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Media} from '../types/types';

// Atom for storing favorite pictures
export const favoritePicturesAtom = atom<Media[]>([]);

// Load persisted state from AsyncStorage
export const loadFavoritesAtom = atom(null, async (get, set) => {
  try {
    const storedFavorites = await AsyncStorage.getItem('favorite_pictures');
    console.log('Stored favorites:', storedFavorites);
    if (storedFavorites) {
      set(favoritePicturesAtom, JSON.parse(storedFavorites));
    }
  } catch (error) {
    console.error('Failed to load favorites', error);
  }
});

// Atom to toggle favorite pictures and persist changes
export const toggleFavoritePictureAtom = atom(
  null,
  async (get, set, picture: string) => {
    const currentFavorites = get(favoritePicturesAtom);
    const updatedFavorites = currentFavorites.includes(picture)
      ? currentFavorites.filter(fav => fav !== picture)
      : [...currentFavorites, picture];

    set(favoritePicturesAtom, updatedFavorites);

    // Persist the updated state
    try {
      await AsyncStorage.setItem(
        'favorite_pictures',
        JSON.stringify(updatedFavorites),
      );
    } catch (error) {
      console.error('Failed to save favorites', error);
    }
  },
);
