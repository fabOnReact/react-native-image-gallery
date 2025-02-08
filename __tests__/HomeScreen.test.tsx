import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock API call
const mockCollections = [];

jest.mock('../src/api/api', () => ({
  getCollections: jest.fn(() =>
    Promise.resolve({
      collections: mockCollections,
      nextPage: 2,
    }),
  ),
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useInfiniteQuery: jest.fn(),
  };
});

const collectionMock = Array.from({length: 30}, (_, i) => ({
  id: i + 1,
  title: `title ${i + 1}`,
}));

describe('HomeScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading indicator when loading', () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
    });

    const {getByTestId} = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  test('renders error message when there is an error', () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    const {getByText} = render(<HomeScreen />);
    expect(getByText('Oops! Something went wrong.')).toBeTruthy();
  });

  test('displays collections from API data', async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [{id: '1', title: 'Nature', media_count: 10}],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const {findByText} = render(<HomeScreen />);
    expect(await findByText('Nature - 10')).toBeTruthy();
  });

  test('calls fetchNextPage when scrolling to bottom', async () => {
    const fetchNextPage = jest.fn();
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: collectionMock,
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    const {getByTestId} = render(<HomeScreen />);

    const list = getByTestId('collection-list');
    fireEvent(list, 'endReached');

    await waitFor(() => {
      expect(fetchNextPage).toHaveBeenCalled();
    });
  });

  test('navigates to Gallery screen when a collection is tapped', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({navigate: mockNavigate});

    // Mock API response
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [{id: '1', title: 'Nature', media_count: 10}],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const {getByText} = render(<HomeScreen />);

    fireEvent.press(getByText('Nature - 10'));
    expect(mockNavigate).toHaveBeenCalledWith('Gallery', {
      item: {id: '1', title: 'Nature', media_count: 10},
    });
  });

  test('calls onRetry when retry button is pressed', () => {
    const refetch = jest.fn();
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch,
    });

    const {getByText} = render(<HomeScreen />);
    fireEvent.press(getByText('Retry'));
    expect(refetch).toHaveBeenCalled();
  });
});
