import fetchMock from 'jest-fetch-mock';
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

fetchMock.enableMocks();

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-gesture-handler', () =>
  require('react-native-gesture-handler/jestSetup'),
);

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@components/HearthWithLiquidButton', () => 'HeartWithLiquidButton');
