import {area, scaleLinear} from 'd3';
import {useEffect} from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, Group, Path, Skia} from '@shopify/react-native-skia';
import {StyleProp, View, ViewStyle} from 'react-native';

type Props = {
  size: number;
  value: number;
  withAnimation: boolean;
  borderColor?: string;
  animationDuration?: number;
  waveHeightRatio?: number;
  waveCount?: number;
  waterColor?: string;
  style?: StyleProp<ViewStyle>;
};

// An adaptation of the react-native-liquid-gauge to render a heart animation
// https://github.com/dimaportenko/react-native-liquid-gauge-tutorial
function HeartWithLiquidButton(props: Props) {
  const {size, value, withAnimation, style} = props;
  const {
    borderColor = 'white',
    animationDuration = 6000,
    waveHeightRatio = 0.05,
    // how many full waves will be seen in the circle
    waveCount = 4,
    waterColor = 'red',
  } = props;

  // outer circle
  const radius = size * 0.5;
  // 0.05 just coefficient can be anything you like
  const circleThickness = radius * 0.05;

  // 0.05 just coefficient can be anything you like
  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  // inner circle radius
  const fillCircleRadius = radius - fillCircleMargin;
  // min possible value
  const minValue = 0;
  // max possible value
  const maxValue = 100;
  // percent of how much progress filled
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;
  // extra wave for translate x animation
  const waveClipCount = waveCount + 1;
  // wave length based on wave count
  const waveLength = (fillCircleRadius * 2) / waveCount;
  // extra width for translate x animation
  const waveClipWidth = waveLength * waveClipCount;
  // wave height relative to the circle radius, if we change component size it will look same
  const waveHeight = fillCircleRadius * waveHeightRatio;

  // Data for building the clip wave area.
  // [number, number] represent point
  // we have 40 points per wave
  // we generate as many points as 40 * waveClipCount
  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  // interpolate value between 0 and 1 to value between 0 and waveClipWidth
  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  // interpolate value between 0 and 1 to value between 0 and waveHeight
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  // area takes our data points
  // outputs area with points (x, y0) and (x, y1)
  const clipArea = area()
    .x(function (d) {
      // interpolate value between 0 and 1 to value between 0 and waveClipWidth
      return waveScaleX(d[0]);
    })
    .y0(function (d) {
      // interpolate value between 0 and 1 to value between 0 and waveHeight
      return waveScaleY(Math.sin(d[1] * 2 * Math.PI));
    })
    .y1(function (_d) {
      // same y1 value for each point
      return fillCircleRadius * 2 + waveHeight;
    });

  // convert data points as wave area and output as svg path string
  const clipSvgPath = clipArea(data);

  // animated value translate wave horizontally
  const translateXAnimated = useSharedValue(0);
  // animated value translate wave vertically
  const translateYPercent = useSharedValue(0);

  useEffect(() => {
    if (withAnimation) {
      // timing animation from 0 to `fillPercent`
      translateYPercent.value = withTiming(fillPercent, {
        // animation duration
        duration: animationDuration,
        // easing function
        easing: Easing.linear,
      });
    } else {
      translateYPercent.value = fillPercent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillPercent]);

  useEffect(() => {
    // repeat animation
    translateXAnimated.value = withRepeat(
      withTiming(1, {
        // animate from 0 to 1
        // animation duration
        duration: Math.floor(Math.random() * (500 - 300 + 1)) + 300,
        // easing function
        easing: Easing.linear,
      }),
      // repeat forever
      -1,
    );
  }, []);

  const clipPath = useDerivedValue(() => {
    // animated value for clip wave path

    // convert svg path string to skia format path
    const clipP =
      Skia.Path.MakeFromSVGString(clipSvgPath ?? '') || Skia.Path.Make();
    // create Skia transform matrix
    const transformMatrix = Skia.Matrix();
    // translate left from start of the first wave to the length of first wave
    const translateX = fillCircleMargin - waveLength * translateXAnimated.value;
    // translate y to position where lower point of the wave in the innerCircleHeight * fillPercent
    // since Y axis 0 is at the top, we do animation from 1 to (1 - fillPercent)
    const translateY =
      fillCircleMargin +
      (1 - translateYPercent.value) * fillCircleRadius * 2 -
      waveHeight;

    transformMatrix.translate(translateX, translateY);
    // apply transform matrix to our clip path
    clipP.transform(transformMatrix);

    return clipP;
  }, [translateXAnimated, translateYPercent]);

  const outerHeartPath = getHeartPath(size);
  const innerHeartPath = getHeartPath(size, 13);

  return (
    <View style={style}>
      <Canvas style={{width: size, height: size}}>
        <Path
          path={outerHeartPath}
          color={borderColor}
          style="stroke"
          strokeWidth={5}
        />
        <Group clip={clipPath}>
          <Path path={innerHeartPath} color={waterColor} />
        </Group>
      </Canvas>
    </View>
  );
}

function getHeartPath(size: number, padding = 0) {
  const HEART_SVG = 'M50,15 C35,0,0,25,50,60,100,25,65,0,50,15 Z';
  const skiaHeartPath =
    Skia.Path.MakeFromSVGString(HEART_SVG) ?? Skia.Path.Make();

  // Get the bounds of the path (returns { x, y, width, height })
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

export default HeartWithLiquidButton;
