import fetchMock from 'jest-fetch-mock';
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Suppress console.log, console.warn, and console.error in test environment
global.console = {
  ...console,
  log: jest.fn(), // Suppress console.log
  warn: jest.fn(), // Suppress console.warn
  error: jest.fn(), // Suppress console.error
};

fetchMock.enableMocks();

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-gesture-handler', () =>
  require('react-native-gesture-handler/jestSetup'),
);

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock(
  './src/components/HearthWithLiquidButton',
  () => 'HeartWithLiquidButton',
);
