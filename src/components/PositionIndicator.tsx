import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Canvas, RoundedRect} from '@shopify/react-native-skia';
import {useDerivedValue} from 'react-native-reanimated';
import {PositionIndicatorProps} from '../types/types';

function PositionIndicator(props: PositionIndicatorProps) {
  const {currentIndex, numberOfImages} = props;
  const {width} = useWindowDimensions();

  // Set the thickness (height) of the progress bar.
  const barHeight = 5;

  // Calculate the progress width as a derived value.
  // If there's more than one image, progress is computed relative to (numberOfImages - 1);
  // otherwise, the indicator spans the full width.
  const animatedWidth = useDerivedValue(() => {
    return numberOfImages > 1
      ? (currentIndex.value / (numberOfImages - 1)) * width
      : width;
  }, [currentIndex, numberOfImages, width]);

  return (
    <View style={[styles.container, {height: barHeight}]}>
      <Canvas style={{width, height: barHeight}}>
        {/* Background progress bar */}
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={barHeight}
          color="#333"
          r={barHeight / 2}
        />
        {/* Foreground progress bar with animated width */}
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
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// Wrap the component in React.memo to prevent unnecessary re-renders when props don't change.
export default React.memo(PositionIndicator);
