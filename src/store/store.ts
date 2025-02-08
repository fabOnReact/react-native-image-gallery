import AsyncStorage from '@react-native-async-storage/async-storage';
import {Media} from '../types/types';
import {atomWithStorage} from 'jotai/utils';

// Atom for storing favorite pictures
export const favoritesAtom = atomWithStorage<Media[]>('favorites', [], {
  getItem: async (key): Promise<Media[]> => {
    try {
      const storedFavorites = await AsyncStorage.getItem(key);
      if (!storedFavorites) return [];

      const parsedData: unknown = JSON.parse(storedFavorites);
      if (!Array.isArray(parsedData)) return [];

      return parsedData as Media[];
    } catch (error) {
      console.error(`Failed to load favorites: ${error}`);
      return [];
    }
  },
  setItem: async (key, newValue): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Failed to save favorites: ${error}`);
    }
  },
  removeItem: async (key): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove favorites: ${error}`);
    }
  },
});
