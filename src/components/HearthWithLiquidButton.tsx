import {area, scaleLinear} from 'd3';
import {useEffect} from 'react';
import {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, Group, Path, Skia} from '@shopify/react-native-skia';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';

type Props = {
  size: number;
  value: number;
};

function HeartWithLiquidButton({size, value, withAnimation, style}: Props) {
  const radius = size * 0.5; // outer circle
  const circleThickness = radius * 0.05; // 0.05 just coefficient can be anything you like

  const circleFillGap = 0.05 * radius; // 0.05 just coefficient can be anything you like
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin; // inner circle radius

  const minValue = 0; // min possible value
  const maxValue = 100; // max possible value
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue; // percent of how much progress filled

  const waveCount = 2; // how many full waves will be seen in the circle
  const waveClipCount = waveCount + 1; // extra wave for translate x animation
  const waveLength = (fillCircleRadius * 2) / waveCount; // wave length base on wave count
  const waveClipWidth = waveLength * waveClipCount; // extra width for translate x animation
  const waveHeight = fillCircleRadius * 0.05; // wave height relative to the circle radius, if we change component size it will look same

  // Data for building the clip wave area.
  // [number, number] represent point
  // we have 40 points per wave
  // we generate as many points as 40 * waveClipCount
  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveClipWidth
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveHeight

  // area take our data points
  // output area with points (x, y0) and (x, y1)
  const clipArea = area()
    .x(function (d) {
      return waveScaleX(d[0]); // interpolate value between 0 and 1 to value between 0 and waveClipWidth
    })
    .y0(function (d) {
      // interpolate value between 0 and 1 to value between 0 and waveHeight
      return waveScaleY(Math.sin(d[1] * 2 * Math.PI));
    })
    .y1(function (_d) {
      // same y1 value for each point
      return fillCircleRadius * 2 + waveHeight;
    });

  const clipSvgPath = clipArea(data); // convert data points as wave area and output as svg path string

  const translateXAnimated = useSharedValue(0); // animated value translate wave horizontally
  const translateYPercent = useSharedValue(0); // animated value translate wave vertically

  useEffect(() => {
    if (withAnimation) {
      translateYPercent.value = withTiming(fillPercent, {
        // timing animation from 0 to `fillPercent`
        duration: 1000, // animation duration
        easing: Easing.linear, // easing function
      });
    } else {
      translateYPercent.value = fillPercent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillPercent]);

  // useEffect(() => {
  //   translateYPercent.value = withTiming(valueWithAnimation, {
  //     // timing animation from 0 to `valueWithAnimation`
  //     duration: 3000, // animation duration
  //     easing: Easing.linear, // easing function
  //   });
  // }, [valueWithAnimation]);

  useEffect(() => {
    translateXAnimated.value = withRepeat(
      // repeat animation
      withTiming(1, {
        // animate from 0 to 1
        duration: 1000, // animation duration
        easing: Easing.linear, // easing function
      }),
      -1, // repeat forever
    );
  }, []);

  const clipPath = useDerivedValue(() => {
    // animated value for clip wave path
    const clipP = Skia.Path.MakeFromSVGString(clipSvgPath); // convert svg path string to skia format path
    const transformMatrix = Skia.Matrix(); // create Skia tranform matrix
    transformMatrix.translate(
      fillCircleMargin - waveLength * translateXAnimated.value, // translate left from start of the first wave to the length of first wave
      fillCircleMargin +
        (1 - translateYPercent.value) * fillCircleRadius * 2 -
        waveHeight, // translate y to position where lower point of the wave in the innerCircleHeight * fillPercent
      // since Y axis 0 is in the top, we do animation from 1 to (1 - fillPercent)
    );
    clipP.transform(transformMatrix); // apply transform matrix to our clip path
    return clipP;
  }, [translateXAnimated, translateYPercent]);

  const outerHeartPath = getHeartPath(size);
  const innerHeartPath = getHeartPath(size, 13);

  return (
    <View style={style}>
      <Canvas style={{width: size, height: size}}>
        <Path
          path={outerHeartPath}
          color="red"
          style="stroke"
          strokeWidth={7}
        />
        <Group clip={clipPath}>
          <Path path={innerHeartPath} color="red" />
        </Group>
      </Canvas>
    </View>
  );
}

function getHeartPath(size: number, padding = 0) {
  const HEART_SVG = 'M50,15 C35,0,0,25,50,60,100,25,65,0,50,15 Z';
  const skiaHeartPath = Skia.Path.MakeFromSVGString(HEART_SVG);

  // Get the bounds of thepath (returns { x, y, width, height })
  const bounds = skiaHeartPath.getBounds();

  // Compute the effective drawing area (reserve padding on all sides)
  const effectiveSize = size - 2 * padding;

  // Compute the scale factor using the effective size (preserving aspect ratio)
  const scaleX = effectiveSize / bounds.width;
  const scaleY = effectiveSize / bounds.height;
  const scale = Math.min(scaleX, scaleY);

  // Create a transformation matrix
  const matrix = Skia.Matrix();

  // Step 1: Translate the path so that its top-left is at (0,0)
  matrix.translate(-bounds.x, -bounds.y);

  // Step 2: Scale the path
  matrix.scale(scale, scale);

  // Step 3: Center the scaled path within the effective drawing area,
  // then offset by the padding.
  const offsetX = padding + (effectiveSize - bounds.width * scale) / 2;
  const offsetY = padding + (effectiveSize - bounds.height * scale) / 2;
  matrix.translate(offsetX / scale, offsetY / scale);

  // Apply the transformation matrix to the path and return it.
  skiaHeartPath.transform(matrix);
  return skiaHeartPath;
}

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

export default HeartWithLiquidButton;
