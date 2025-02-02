import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export interface CollectionItemProps {
  item: Collection;
}

export interface Collection {
  id: number;
  title: string;
  media_count: number;
}

export interface APIResponse {
  collections: Collection[];
  nextPage: number | null;
}

export type RootStackParamList = {
  Home: undefined;
  Image: {item: Collection};
  Likes: undefined;
};

export type ImageScreenProps = {
  route: CollectionItemProps;
};

export type Props = NativeStackScreenProps<RootStackParamList, 'Image'>;

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
