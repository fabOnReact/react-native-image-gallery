import React from 'react';
import {View, Dimensions} from 'react-native';
import {Canvas, Circle} from '@shopify/react-native-skia';
import {useDerivedValue} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const PositionIndicator = ({
  scrollX,
  contentWidth,
}: {
  scrollX: any;
  contentWidth: number;
}) => {
  const indicatorSize = 10; // Adjust size if needed

  // Derive the indicator position from scroll position
  const animatedIndicatorX = useDerivedValue(() => {
    return (
      (scrollX.value / (contentWidth - width)) * (width - indicatorSize) + 10
    );
  });

  console.log('TESTING ' + 'animatedIndicatorY: ', animatedIndicatorX);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 50,
        height: 30,
        alignItems: 'center',
        backgroundColor: 'yellow',
      }}>
      <Canvas style={{width, height: 30}}>
        <Circle cx={animatedIndicatorX} cy={15} r={indicatorSize} color="red" />
      </Canvas>
    </View>
  );
};

export default PositionIndicator;
