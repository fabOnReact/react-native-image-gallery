import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export interface Collection {
  id: number;
  title: string;
  media_count: number;
}

export interface APIResponse {
  collections: Collection[];
  nextPage: number | null;
}

export type CollectionWithNavigation = {
  item: Collection;
  navigation: NavigationProp;
};

type RootStackParamList = {
  Home: undefined;
  Image: {item: Collection};
  Likes: undefined;
};

export type ImageScreenProps = {
  route: {
    params: {
      item: Collection;
    };
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
