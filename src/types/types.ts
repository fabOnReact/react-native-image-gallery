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
  /* title of the pexels collection */
  title: string;
  /* number of photos in the pexels collection */
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
    /* url to display an image as portrait. */
    portrait: string;
  };
}

export interface MediaAPIResponse extends PaginatedResponse {
  media: Media[];
}

export type ImageViewerProps = {
  media: Media[];
  /* number of photos in the pexels collection */
  numberOfImages: number;
  onEndReachedCallback?: () => void;
};

export type PinchableImageProps = {
  item: Media;
  /* boolean value used to display a loading indicator on the first image */
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
  /** The size (width & height) of the heart animation. */
  size: number;

  /** The starting vertical height of the water level in the heart. A value between 0 and 100. */
  value: number;

  /** Enables/disables the water vertical animation. It does not disable the horizontal water animation (waves). */
  withAnimation: boolean;

  /** Change the border color for the heart outline. The default is white. */
  borderColor?: string;

  /** Duration of the fill animation in milliseconds. The default is 6000 ms. */
  animationDuration?: number;

  /** Sets the height of the waves. The default is 0.05. */
  waveHeightRatio?: number;

  /** The number of waves in the water inside the heart. The default is 4. */
  waveCount?: number;

  /** Color of the water inside the heart. The default is red. */
  waterColor?: string;

  /** Speed of the waves animation. The default is 500. */
  waterSpeed?: number;

  /** Custom styles applied to the container */
  style?: StyleProp<ViewStyle>;

  testID?: string;
};

export type HearthPathFunction = (
  /* The size is used to scale and translate the heart svg and center it in the parent container, to be correctly centered should have the same size of the HeartWithLiquidButton width. */
  size: number,
  /* The padding is used to scale correctly the inner heart svg. This heart path is nested inside the outer heart path. */
  padding?: number,
) => AnimatedProp<PathDef>;

export type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

export type MaybeArray<T> = ArrayLike<T> | null | undefined;

export type FavoritesType = [Awaited<Media[]>, (args: any) => any];

export type GetItemLayoutFunction = (
  data: ArrayLike<Collection> | null | undefined,
  index: number,
) => {length: number; offset: number; index: number};
