import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export interface PaginatedResponse {
  page: number;
  per_page: number;
  total_results: number;
}

export interface Collection {
  id: string;
  title: string;
  photos_count: number;
}

export interface CollectionAPIResponse extends PaginatedResponse {
  collections: Collection[];
}

export interface CollectionItemProps {
  item: Collection;
}

export interface Media {
  id: string;
  src: {
    portrait: string;
  };
}

export interface MediaAPIResponse extends PaginatedResponse {
  media: Media[];
}

export type ImageViewerProps = {
  media: Media[];
  numberOfImages: number;
  onEndReachedCallback?: () => void;
};

export type PinchableImageProps = {
  item: Media;
  firstItem: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  Gallery: {item: Collection};
  Favorites: undefined;
};

export type GalleryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Gallery'
>;

export type FavoritesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Favorites'
>;

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
