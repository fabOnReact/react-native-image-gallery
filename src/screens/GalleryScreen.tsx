import React from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {Media, Props} from '../types/types';
import {getCollectionsMedia} from '../api/api';
const {width} = Dimensions.get('window');

const GalleryScreen = ({route}: Props) => {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';
  if (!PEXELS_API_KEY || PEXELS_API_KEY === '') {
    console.warn('PEXELS_API_KEY environment variable is not defined');
  }
  const {item} = route.params;

  const {data, isLoading, error} = useQuery({
    queryKey: ['collectionMedia', item.id],
    queryFn: () => getCollectionsMedia(PEXELS_API_KEY, item.id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>Failed to load images</Text>
      </View>
    );
  }

  const media = data as Media[];

  return (
    <FlatList
      data={media}
      keyExtractor={item => item.id.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <View
          style={{
            width,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: item.src.portrait}}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>
      )}
    />
  );
};

export default GalleryScreen;
