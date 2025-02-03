import fetchMock from 'jest-fetch-mock';
import 'react-native-gesture-handler/jestSetup';

fetchMock.enableMocks();

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-gesture-handler', () =>
  require('react-native-gesture-handler/jestSetup'),
);
