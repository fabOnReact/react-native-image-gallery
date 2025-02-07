import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {useAtom} from 'jotai';
import {Media} from '../types/types';
import {favoritesAtom} from '../store/store';
import HeartWithLiquidButton from './HearthWithLiquidButton';

type FavoriteButtonProps = {
  picture: Media;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorited,
  onPress,
}) => {
  console.log('TESTING ' + 'FavoriteButton');
  return (
    <View style={styles.container}>
      <HeartWithLiquidButton
        size={100}
        value={isFavorited ? 100 : 0}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: '50%',
    transform: [{translateX: 50}],
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
});

export default FavoriteButton;
