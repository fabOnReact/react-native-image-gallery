import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Canvas, RoundedRect} from '@shopify/react-native-skia';
import {useDerivedValue} from 'react-native-reanimated';
import {PositionIndicatorProps} from '../types/types';

function PositionIndicator({scrollX, numberOfImages}: PositionIndicatorProps) {
  const {width} = useWindowDimensions();
  const newWidth = width - 100; // available width for the progress indicator
  const barHeight = 5;

  // Total scrollable width: each page is the device width, so:
  const totalScrollableWidth = (numberOfImages - 1) * width;

  // Compute the animated width by mapping scrollX (0 to totalScrollableWidth) to (0 to newWidth)
  const animatedWidth = useDerivedValue(() => {
    return numberOfImages > 1
      ? (scrollX.value / totalScrollableWidth) * newWidth
      : newWidth;
  }, [scrollX, numberOfImages, newWidth, totalScrollableWidth]);

  return (
    <View style={[styles.container, {height: barHeight}]}>
      <Canvas style={{width: newWidth, height: barHeight}}>
        {/* Background bar */}
        <RoundedRect
          x={0}
          y={0}
          width={newWidth}
          height={barHeight}
          color="#333"
          r={barHeight / 2}
        />
        {/* Foreground (red) progress bar */}
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
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 50,
    right: 50,
    bottom: 0,
  },
});

export default React.memo(PositionIndicator);
