import React from 'react';
import {render} from '@testing-library/react-native';
import HeartWithLiquidButton from '../src/components/HearthWithLiquidButton';

// --- MOCKS --- //

// Mock react-native-skia so that Canvas, RoundedRect, Path, Group, and Skia are available.
jest.mock('@shopify/react-native-skia', () => {
  return {
    Canvas: (props: any) => <div {...props} />,
    RoundedRect: (props: any) => <div {...props} />,
    Path: (props: any) => <div {...props} />,
    Group: (props: any) => <div {...props} />,
    Skia: {
      Path: {
        MakeFromSVGString: jest.fn(() => ({
          getBounds: () => ({x: 0, y: 0, width: 100, height: 100}),
          transform: jest.fn(),
        })),
        Make: jest.fn(() => ({
          transform: jest.fn(),
        })),
      },
      Matrix: jest.fn(() => ({
        translate: jest.fn(),
        scale: jest.fn(),
      })),
    },
  };
});

// Mock react-native-reanimated hooks and functions.
jest.mock('react-native-reanimated', () => {
  return {
    useSharedValue: (initial: any) => ({value: initial}),
    useDerivedValue: (callback: () => any) => ({value: callback()}),
    withTiming: (value: any, _config: any) => value,
    withRepeat: (value: any, _repeat: number) => value,
    Easing: {linear: (t: number) => t},
  };
});

// Mock d3 functions so that area() and scaleLinear() are available.
jest.mock('d3', () => {
  return {
    area: () => {
      return (data: any) => 'M0,0 L100,0';
    },
    scaleLinear: () => {
      return () => 50;
    },
  };
});

// --- TESTS --- //

describe('HeartWithLiquidButton', () => {
  it('renders without crashing and uses the provided testID', () => {
    const props = {
      size: 200,
      value: 50,
      withAnimation: true,
      style: {backgroundColor: 'transparent'},
      testID: 'heart-indicator',
      borderColor: 'blue',
      animationDuration: 6000,
      waveHeightRatio: 0.05,
      waveCount: 4,
      waterColor: 'red',
      waterSpeed: 500,
    };

    const {getByTestId} = render(<HeartWithLiquidButton {...props} />);
    // Check that the root view has the testID
    expect(getByTestId('heart-indicator')).toBeTruthy();
  });
});
