import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AnimatedProp, PathDef} from '@shopify/react-native-skia';
import {StyleProp, ViewStyle, ViewToken} from 'react-native';

export interface PaginatedResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: 'string';
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
  item: {
    id: number;
    src: {
      portrait?: string;
    };
  };
  firstItem?: boolean;
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

export type HeartWithLiquidButtonProps = {
  /** The size (width & height) of the heart animation */
  size: number;

  /** Value between 0 and 100 that determines how much the heart is filled */
  value: number;

  /** Enables/disables the vertical animation. It does not disable the waves animation. */
  withAnimation: boolean;

  /** Change the border color for the heart outline. The default is white. */
  borderColor?: string;

  /** Duration of the fill animation in milliseconds. The default is 6000 ms. */
  animationDuration?: number;

  /** Sets the height of the waves. The default is 0.05. */
  waveHeightRatio?: number;

  /** The number of waves visible inside the heart. The default is 4. */
  waveCount?: number;

  /** Color of the liquid inside the heart. The default is red. */
  waterColor?: string;

  /** Speed of the waves animation. The default is 500. */
  waterSpeed?: number;

  /** Custom styles applied to the container */
  style?: StyleProp<ViewStyle>;
};

export type HearthPathFunction = (
  size: number,
  padding?: number,
) => AnimatedProp<PathDef>;

export type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};
