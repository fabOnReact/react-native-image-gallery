import React from 'react';
import {render} from '@testing-library/react-native';
import GalleryScreen from '../src/screens/GalleryScreen';
import {useInfiniteQuery} from '@tanstack/react-query';

// We'll mock useInfiniteQuery to simulate different query states.
jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(),
}));

// Also, if your API function is used inside GalleryScreen, you can optionally mock it:
jest.mock('../src/api/api', () => ({
  getCollectionsMedia: jest.fn(),
}));

// We'll also mock the components that GalleryScreen renders for clarity.
jest.mock('../src/components/ImageViewer', () => {
  return jest.fn(() => null);
});
jest.mock('../src/components/HearthWithLiquidActivityIndicator', () => {
  return jest.fn(() => null);
});

// Get a typed version of the mocked useInfiniteQuery
const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock;

describe('GalleryScreen', () => {
  // Provide dummy navigation and route props (GalleryScreenProps requires these).
  const navigation = {navigate: jest.fn()};
  const route = {params: {item: {id: '1'}}};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when isLoading is true', () => {
    // Simulate loading state
    mockUseInfiniteQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const {getByTestId} = render(
      <GalleryScreen route={route} navigation={navigation} />,
    );

    // Expect that the HeartWithLiquidActivityIndicator is rendered.
    // Assuming that your HeartWithLiquidActivityIndicator component renders an element with testID "loading-indicator"
    // (or if it's mocked, check that it was called).
    expect(
      require('../src/components/HearthWithLiquidActivityIndicator'),
    ).toHaveBeenCalled();
  });

  it('renders error view when error is present', () => {
    // Simulate error state
    mockUseInfiniteQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Fetch error'),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const {getByText} = render(
      <GalleryScreen route={route} navigation={navigation} />,
    );

    // Expect that an error message is displayed
    expect(getByText('Failed to load images.')).toBeTruthy();
  });

  it('renders empty view when media array is empty', () => {
    // Simulate data with no media
    mockUseInfiniteQuery.mockReturnValue({
      data: {pages: [{media: [], total_results: 0}]},
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const {getByText} = render(
      <GalleryScreen route={route} navigation={navigation} />,
    );

    // Expect that a message indicating no images is displayed.
    expect(getByText('No images in this collection.')).toBeTruthy();
  });

  it('renders ImageViewer when media data is available', () => {
    // Simulate valid data: one page with one media item.
    const mockMedia = [{id: 'media1', src: {portrait: 'url1'}}];
    const totalResults = 1;
    const mockData = {
      pages: [{media: mockMedia, total_results: totalResults}],
    };

    mockUseInfiniteQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const {queryByTestId} = render(
      <GalleryScreen route={route} navigation={navigation} />,
    );

    // ImageViewer is mocked; check that it was called with the correct props.
    const ImageViewer = require('../src/components/ImageViewer');
    expect(ImageViewer).toHaveBeenCalledWith(
      expect.objectContaining({
        media: mockMedia,
        numberOfImages: totalResults,
        onEndReachedCallback: expect.any(Function),
      }),
      {},
    );
  });
});
