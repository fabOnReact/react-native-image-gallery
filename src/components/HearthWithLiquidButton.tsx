import {area, scaleLinear} from 'd3';
import {useEffect, useMemo} from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, Group, Path, Skia} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {HearthPathFunction, HeartWithLiquidButtonProps} from '../types/types';

// An adaptation of the react-native-liquid-gauge to render a heart animation
// https://github.com/dimaportenko/react-native-liquid-gauge-tutorial
function HeartWithLiquidButton(props: HeartWithLiquidButtonProps) {
  const {size, value, withAnimation, style, testID} = props;
  const {
    borderColor = 'white',
    animationDuration = 6000,
    waveHeightRatio = 0.05,
    waveCount = 4,
    waterColor = 'red',
    waterSpeed = 500,
  } = props;

  // Calculate fixed constants based on size.
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;
  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;
  const minValue = 0;
  const maxValue = 100;
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;
  const waveClipCount = waveCount + 1;
  const waveLength = (fillCircleRadius * 2) / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleRadius * waveHeightRatio;

  // Memoize the data array – this creates 40 points per wave.
  const data = useMemo(() => {
    const arr: Array<[number, number]> = [];
    const totalPoints = 40 * waveClipCount;
    for (let i = 0; i <= totalPoints; i++) {
      arr.push([i / totalPoints, i / 40]);
    }
    return arr;
  }, [waveClipCount]);

  // Memoize d3 scale functions so they only update when waveClipWidth or waveHeight change.
  const waveScaleX = useMemo(
    () => scaleLinear().range([0, waveClipWidth]).domain([0, 1]),
    [waveClipWidth],
  );
  const waveScaleY = useMemo(
    () => scaleLinear().range([0, waveHeight]).domain([0, 1]),
    [waveHeight],
  );

  // Build the area function and compute the clip path SVG.
  const clipSvgPath = useMemo(() => {
    const clipArea = area()
      .x((d: any) => waveScaleX(d[0]))
      .y0((d: any) => waveScaleY(Math.sin(d[1] * 2 * Math.PI)))
      .y1(() => fillCircleRadius * 2 + waveHeight);
    return clipArea(data);
  }, [data, waveScaleX, waveScaleY, fillCircleRadius, waveHeight]);

  // Create animated shared values.
  const translateXAnimated = useSharedValue(0);
  const translateYPercent = useSharedValue(0);

  // Animate vertical filling.
  useEffect(() => {
    if (withAnimation) {
      translateYPercent.value = withTiming(fillPercent, {
        duration: animationDuration,
        easing: Easing.linear,
      });
    } else {
      translateYPercent.value = fillPercent;
    }
    // Note: If animationDuration may change, add it to dependency array.
  }, [fillPercent, withAnimation, animationDuration]);

  // Animate horizontal wave movement.
  useEffect(() => {
    translateXAnimated.value = withRepeat(
      withTiming(1, {
        duration: waterSpeed,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [waterSpeed]);

  // Use a derived value to compute the transformed clip path.
  const clipPath = useDerivedValue(() => {
    const clipP =
      Skia.Path.MakeFromSVGString(clipSvgPath ?? '') || Skia.Path.Make();
    const transformMatrix = Skia.Matrix();
    const translateX = fillCircleMargin - waveLength * translateXAnimated.value;
    const translateY =
      fillCircleMargin +
      (1 - translateYPercent.value) * fillCircleRadius * 2 -
      waveHeight;
    transformMatrix.translate(translateX, translateY);
    clipP.transform(transformMatrix);
    return clipP;
  }, [
    translateXAnimated,
    translateYPercent,
    clipSvgPath,
    fillCircleMargin,
    waveLength,
    fillCircleRadius,
    waveHeight,
  ]);

  // Cache heart paths so they're not re-computed on every render.
  const outerHeartPath = useMemo(() => getHeartPath(size), [size]);
  const innerHeartPath = useMemo(() => getHeartPath(size, 13), [size]);

  return (
    <View style={style} testID={testID}>
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

// getHeartPath creates and transforms a heart shape from an SVG string.
const getHeartPath: HearthPathFunction = (size, padding = 0) => {
  const HEART_SVG = 'M50,15 C35,0,0,25,50,60,100,25,65,0,50,15 Z';
  const skiaHeartPath =
    Skia.Path.MakeFromSVGString(HEART_SVG) ?? Skia.Path.Make();
  const bounds = skiaHeartPath.getBounds();
  const effectiveSize = size - 2 * padding;
  const scaleX = effectiveSize / bounds.width;
  const scaleY = effectiveSize / bounds.height;
  const scale = Math.min(scaleX, scaleY);
  const matrix = Skia.Matrix();
  // Translate the path so its top-left is at (0,0)
  matrix.translate(-bounds.x, -bounds.y);
  // Scale the path
  matrix.scale(scale, scale);
  // Center the path in the effective drawing area and offset by padding.
  const offsetX = padding + (effectiveSize - bounds.width * scale) / 2;
  const offsetY = padding + (effectiveSize - bounds.height * scale) / 2;
  matrix.translate(offsetX / scale, offsetY / scale);
  skiaHeartPath.transform(matrix);
  return skiaHeartPath;
};

export default HeartWithLiquidButton;
