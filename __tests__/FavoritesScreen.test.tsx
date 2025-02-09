import React from 'react';
import {render} from '@testing-library/react-native';
import FavoritesScreen from '../src/screens/FavoritesScreen';
import {useAtom} from 'jotai';

// Mock ImageViewer so we can check if it is rendered.
jest.mock('../src/components/ImageViewer', () => {
  return jest.fn(() => null);
});

// Mock useAtom from jotai.
jest.mock('jotai', () => ({
  useAtom: jest.fn(),
}));

describe('FavoritesScreen', () => {
  // Get the typed mock of useAtom.
  const mockedUseAtom = useAtom as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when favorites array is empty', () => {
    // Simulate no favorites.
    mockedUseAtom.mockReturnValue([[]]);

    const {getByText} = render(<FavoritesScreen />);

    // Expect the empty message to be displayed.
    expect(getByText('No favorites yet.')).toBeTruthy();
  });

  it('renders ImageViewer when favorites exist', () => {
    // Create dummy favorites data.
    const dummyFavorites = [
      {id: '1', src: {portrait: 'https://example.com/portrait1.jpg'}},
      {id: '2', src: {portrait: 'https://example.com/portrait2.jpg'}},
    ];

    // Simulate favorites present.
    mockedUseAtom.mockReturnValue([dummyFavorites]);

    const {queryByText} = render(<FavoritesScreen />);

    // The empty message should not be rendered.
    expect(queryByText('No favorites yet.')).toBeNull();

    // Check that ImageViewer was rendered with correct props.
    const ImageViewer = require('../src/components/ImageViewer');
    expect(ImageViewer).toHaveBeenCalledWith(
      expect.objectContaining({
        numberOfImages: dummyFavorites.length,
        media: dummyFavorites,
      }),
      {},
    );
  });
});
