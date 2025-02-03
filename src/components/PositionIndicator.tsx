import React from 'react';
import {View, Dimensions} from 'react-native';
import {Canvas, Circle} from '@shopify/react-native-skia';
import {useDerivedValue} from 'react-native-reanimated';

const {height} = Dimensions.get('window');

const PositionIndicator = ({
  scrollY,
  contentHeight,
}: {
  scrollY: any;
  contentHeight: number;
}) => {
  const indicatorSize = 40; // Adjust size if needed

  // Derive the indicator position from scroll position
  const animatedIndicatorY = useDerivedValue(() => {
    return (
      (scrollY.value / (contentHeight - height)) * (height - indicatorSize)
    );
  });

  console.log('TESTING ' + 'animatedIndicatorY: ', animatedIndicatorY);

  return (
    <View
      style={{
        position: 'absolute',
        right: 20,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
      }}>
      <Canvas style={{width: 20, height}}>
        <Circle cx={10} cy={animatedIndicatorY} r={10} color="red" />
      </Canvas>
    </View>
  );
};

export default PositionIndicator;
