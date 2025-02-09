import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AnimatedProp, PathDef} from '@shopify/react-native-skia';
import {StyleProp, ViewStyle, ViewToken} from 'react-native';

// A common interface for paginated API responses.
export interface PaginatedResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
}

// A Pexels collection.
export interface Collection {
  id: string;
  /** Title of the Pexels collection */
  title: string;
  /** Number of photos in the Pexels collection */
  photos_count: number;
}

// API response for collections.
export interface CollectionAPIResponse extends PaginatedResponse {
  collections: Collection[];
}

// Props for rendering a collection item.
export interface CollectionItemProps {
  item: Collection;
}

// A media item (photo).
export interface Media {
  id: string;
  src: {
    /** URL to display an image as portrait. */
    portrait: string;
  };
}

// API response for media.
export interface MediaAPIResponse extends PaginatedResponse {
  media: Media[];
}

// Props for an image viewer.
export type ImageViewerProps = {
  media: Media[];
  /** Number of photos in the Pexels collection */
  numberOfImages: number;
  onEndReachedCallback?: () => void;
};

// Props for a pinchable image.
export type PinchableImageProps = {
  item: Media;
  /** Indicates if this is the first image (used to display a loading indicator) */
  firstItem?: boolean;
};

// Navigation parameter list for the app.
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

// Props for the HeartWithLiquidButton component.
export type HeartWithLiquidButtonProps = {
  /** The size (width & height) of the heart animation. */
  size: number;
  /** The starting vertical height of the water level in the heart (0 to 100). */
  value: number;
  /** Enables/disables the water vertical animation. */
  withAnimation: boolean;
  /** Border color for the heart outline (default: white). */
  borderColor?: string;
  /** Duration of the fill animation in milliseconds (default: 6000). */
  animationDuration?: number;
  /** Height ratio of the waves (default: 0.05). */
  waveHeightRatio?: number;
  /** Number of waves inside the heart (default: 4). */
  waveCount?: number;
  /** Color of the water inside the heart (default: red). */
  waterColor?: string;
  /** Speed of the wave animation (default: 500). */
  waterSpeed?: number;
  /** Custom styles applied to the container. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

// Function type for generating a heart path using Skia.
export type HearthPathFunction = (
  /** The size used to scale and center the heart SVG. Should match the HeartWithLiquidButton width. */
  size: number,
  /** Padding for scaling the inner heart SVG. */
  padding?: number,
) => AnimatedProp<PathDef>;

// Type for viewable items (used in FlatList callbacks).
export type ViewableItemsType = {
  viewableItems: Array<ViewToken<Media>>;
};

// Represents a value that can be an array-like type, null, or undefined.
export type MaybeArray<T> = ArrayLike<T> | null | undefined;

// Type for favorites (Consider refining the updater function's type).
export type FavoritesType = [Awaited<Media[]>, (args: any) => any];

// Function type for FlatList's getItemLayout.
export type GetItemLayoutFunction = (
  data: ArrayLike<Collection> | null | undefined,
  index: number,
) => {length: number; offset: number; index: number};
