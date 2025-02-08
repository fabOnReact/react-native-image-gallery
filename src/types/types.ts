import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export interface CollectionItemProps {
  item: Collection;
}

export interface Collection {
  id: string;
  title: string;
  media_count: number;
}

export interface CollectionAPIResponse {
  collections: Collection[];
  nextPage: number | null;
}

export interface MediaAPIResponse {
  media: Media[];
  total_results: number;
  nextPage: number | null;
}

export type ImageViewerProps = {
  media: Media[];
  numberOfImages: number;
  onEndReachedCallback?: () => void;
};

export type Media = {
  id: number;
  src: {
    portrait: string;
  };
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

export type GalleryScreenProps = {
  route: {
    item: Media;
  };
};

export type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
