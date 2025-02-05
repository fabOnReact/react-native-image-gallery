import AsyncStorage from '@react-native-async-storage/async-storage';
import {Media} from '../types/types';
import {atomWithStorage} from 'jotai/utils';

// Atom for storing favorite pictures
export const favoritesAtom = atomWithStorage<Media[]>('favorites', [], {
  getItem: async key => {
    const storedFavorites = await AsyncStorage.getItem(key);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  },
  setItem: async (key, newValue) => {
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: async key => {
    await AsyncStorage.removeItem(key);
  },
});
