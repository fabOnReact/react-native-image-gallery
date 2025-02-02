/**
 * @format
 */

import React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import App from '../src/App';

jest.mock('../src/api/api', () => ({
  fetchCollections: jest.fn(() =>
    Promise.resolve({collections: [], nextPage: null}),
  ),
}));

jest.useFakeTimers();

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test('renders correctly', () => {
  render(<App />);
});
