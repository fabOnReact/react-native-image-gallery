import {Text, View} from 'react-native';
import {ImageScreenProps} from '../types/types';

function ImageScreen(props: ImageScreenProps) {
  const {item} = props.route.params;
  return (
    <View>
      <Text>{item.title}</Text>
    </View>
  );
}

export default ImageScreen;
