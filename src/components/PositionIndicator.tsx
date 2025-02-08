import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
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
  // Adjust thickness of progress bar
  const barHeight = 5;
  // Derived value for progress width
  const animatedWidth = useDerivedValue(() => {
    return (currentIndex.value / (numberOfImages - 1)) * width;
  });

  return (
    <View style={[styles.container, {height: barHeight}]}>
      <Canvas style={{width, height: barHeight}}>
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={barHeight}
          color="#333"
          r={barHeight / 2}
        />
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default PositionIndicator;
