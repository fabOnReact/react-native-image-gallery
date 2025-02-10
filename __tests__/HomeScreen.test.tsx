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
jest.mock('../src/api/api', () => ({
  getCollections: jest.fn(() =>
    Promise.resolve({
      collections: [
        {id: '1', title: 'Nature', photos_count: 10},
        {id: '2', title: 'Architecture', photos_count: 20},
      ],
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

describe('HomeScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading indicator when loading', () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    const {getByTestId} = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  test('renders error message and retry button when there is an error', async () => {
    const refetch = jest.fn();
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch,
    });

    const {getByText} = render(<HomeScreen />);

    expect(getByText('Oops! Something went wrong.')).toBeTruthy();
    expect(getByText('Please try again later.')).toBeTruthy();

    fireEvent.press(getByText('Retry'));
    expect(refetch).toHaveBeenCalled();
  });

  test('displays collections from API data', async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [
              {id: '1', title: 'Nature', photos_count: 10},
              {id: '2', title: 'Architecture', photos_count: 20},
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const {findByText} = render(<HomeScreen />);

    expect(await findByText('Nature')).toBeTruthy();
    expect(await findByText('Architecture')).toBeTruthy();
  });

  test('does not render items with missing data', async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [
              {id: '1', title: 'Nature', photos_count: 10},
              {id: null, title: 'Missing ID', photos_count: 15},
              {id: '3', title: '', photos_count: 0}, // Invalid collection
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const {findByText, queryByText} = render(<HomeScreen />);

    expect(await findByText('Nature')).toBeTruthy();
    expect(queryByText('Missing ID - 15')).toBeNull(); // Should not be rendered
    expect(queryByText(' - 0')).toBeNull(); // Should not be rendered
  });

  test('adds more items to the flatlist when scrolling down', async () => {
    const fetchNextPage = jest.fn();
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [
              {id: '3', title: 'Computers', photos_count: 10},
              {id: '4', title: 'Trips', photos_count: 20},
            ],
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

    expect(getByTestId('flatlist-item-4')).toBeTruthy();
  });

  test('does not call fetchNextPage when hasNextPage is false', async () => {
    const fetchNextPage = jest.fn();
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [{id: '1', title: 'Nature', photos_count: 10}],
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage,
      hasNextPage: false, // No more pages
      isFetchingNextPage: false,
    });

    const {getByTestId} = render(<HomeScreen />);

    fireEvent.scroll(getByTestId('collection-list'), {
      nativeEvent: {
        contentOffset: {y: 1000},
        layoutMeasurement: {height: 500},
        contentSize: {height: 2000},
      },
    });

    await waitFor(() => {
      expect(fetchNextPage).not.toHaveBeenCalled();
    });
  });

  test('navigates to Gallery screen when a collection is tapped', async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({navigate: mockNavigate});

    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [{id: '1', title: 'Nature', photos_count: 10}],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const {findByText} = render(<HomeScreen />);
    fireEvent.press(await findByText('Nature'));

    expect(mockNavigate).toHaveBeenCalledWith('Gallery', {
      item: {id: '1', title: 'Nature', photos_count: 10},
    });
  });

  test('renders loading indicator when fetching next page', async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [
              {id: '1', title: 'Nature', photos_count: 10},
              {id: '2', title: 'Architecture', photos_count: 20},
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      hasNextPage: true,
      isFetchingNextPage: true, // Simulate loading new page
    });

    const {getByTestId} = render(<HomeScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  test('does not display footer loading indicator when not fetching next page', async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            collections: [{id: '1', title: 'Nature', photos_count: 10}],
          },
        ],
      },
      isLoading: false,
      isError: false,
      hasNextPage: true,
      isFetchingNextPage: false, // Not fetching next page
    });

    const {queryByTestId} = render(<HomeScreen />);

    expect(queryByTestId('loading-indicator')).toBeNull();
  });
});
