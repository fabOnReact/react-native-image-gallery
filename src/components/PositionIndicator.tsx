import React from 'react';
import {View, Dimensions} from 'react-native';
import {Canvas, RoundedRect} from '@shopify/react-native-skia';
import {useDerivedValue} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

type PositionIndicatorProps = {
  currentIndex: any;
  numberOfImages: number;
};

const PositionIndicator = ({
  currentIndex,
  numberOfImages,
}: PositionIndicatorProps) => {
  const barHeight = 5; // Adjust thickness of progress bar

  // Derived value for progress width
  const animatedWidth = useDerivedValue(() => {
    return (currentIndex.value / (numberOfImages - 1)) * width;
  });

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: barHeight,
      }}>
      <Canvas style={{width, height: barHeight}}>
        {/* Background Bar */}
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={barHeight}
          color="#333"
          r={barHeight / 2}
        />

        {/* Animated Progress Bar */}
        <RoundedRect
          x={0}
          y={0}
          width={animatedWidth}
          height={barHeight}
          color="red"
          r={barHeight / 2}
        />
      </Canvas>
    </View>
  );
};

export default PositionIndicator;
