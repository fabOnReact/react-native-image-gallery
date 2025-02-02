import {Text, View} from 'react-native';
import {Props} from '../types/types';

const ImageScreen = ({route}: Props) => {
  const {item} = route.params;
  return (
    <View>
      <Text>{item.title}</Text>
    </View>
  );
};

export default ImageScreen;
