import React, {useState} from 'react';
import {act, render, fireEvent, userEvent} from '@testing-library/react-native';
import ImageViewer from '../src/components/ImageViewer'; // Adjust the import path as needed
import {useAtom} from 'jotai';

// --- MOCK DEPENDENCIES --- //

// Since ImageViewer renders several components (PinchableImage, HeartWithLiquidButton, PositionIndicator),
// we mock them so that our tests focus on the behavior of ImageViewer.
jest.mock('../src/components/PinchableImage', () => {
  return jest.fn(() => null);
});
jest.mock('../src/components/HearthWithLiquidButton', () => {
  const {View} = require('react-native');
  return jest.fn(props => <View {...props} />);
});
jest.mock('../src/components/PositionIndicator', () => {
  return jest.fn(() => null);
});

// Mock useAtom from jotai to control favorites state.
jest.mock('jotai', () => ({
  useAtom: jest.fn(),
}));

// Mock the GestureHandlerRootView component to simply render its children.
jest.mock('react-native-gesture-handler', () => {
  const {View} = require('react-native');
  return {
    GestureHandlerRootView: (props: any) => <View {...props} />,
    GestureDetector: (props: any) => <View {...props} />,
    // Optionally, include other exports if needed
    // For example:
    // TapGestureHandler: (props: any) => <View {...props} />,
    // PanGestureHandler: (props: any) => <View {...props} />,
    // ...and so on.
  };
});

// --- TESTS --- //

describe('ImageViewer', () => {
  // Dummy media data to simulate images.
  const dummyMedia = [
    {id: '1', src: {portrait: 'https://example.com/image1.jpg'}},
    {id: '2', src: {portrait: 'https://example.com/image2.jpg'}},
  ];

  // Dummy callback for when the end of the list is reached.
  const dummyOnEndReachedCallback = jest.fn();

  // For controlling favorites, we simulate an initial empty array.
  let favorites: any[] = [];
  const setFavorites = jest.fn(newFavs => {
    favorites = newFavs;
  });

  beforeEach(() => {
    favorites = [];
    (useAtom as jest.Mock).mockReturnValue([favorites, setFavorites]);
    dummyOnEndReachedCallback.mockClear();
  });

  it('renders without crashing', () => {
    const {getByTestId} = render(
      <ImageViewer
        numberOfImages={dummyMedia.length}
        media={dummyMedia}
        onEndReachedCallback={dummyOnEndReachedCallback}
      />,
    );

    // Ensure that the FlatList is rendered.
    // Make sure your ImageViewer component sets testID="collection-list" on the FlatList.
    expect(getByTestId('collection-list')).toBeTruthy();
  });

  it('calls onEndReachedCallback when the end is reached', () => {
    const {getByTestId} = render(
      <ImageViewer
        numberOfImages={dummyMedia.length}
        media={dummyMedia}
        onEndReachedCallback={dummyOnEndReachedCallback}
      />,
    );

    // Query the FlatList by its testID.
    const flatList = getByTestId('collection-list');
    // Simulate the end-of-list event.
    fireEvent(flatList, 'onEndReached');
    expect(dummyOnEndReachedCallback).toHaveBeenCalled();
  });

  it('toggles favorite status when the toggle button is pressed', () => {
    const {getByTestId} = render(
      <ImageViewer
        numberOfImages={dummyMedia.length}
        media={dummyMedia}
        onEndReachedCallback={dummyOnEndReachedCallback}
      />,
    );

    // Query the toggle favorite button by its testID.
    // Ensure your ImageViewer component sets testID="toggle-favorite-button" on the TouchableWithoutFeedback.
    const toggleButton = getByTestId('toggle-favorite-button-touchable');
    fireEvent.press(toggleButton);

    // Since favorites are initially empty, after toggling,
    // setFavorites should be called to add the first media item.
    expect(setFavorites).toHaveBeenCalled();
  });

  it('adds more items in the flatlist when scrolling horizontally', async () => {
    function GalleryScreenTestWrapper() {
      const [data, setData] = useState(dummyMedia);
      const newData = [
        {id: '3', src: {portrait: 'https://example.com/image3.jpg'}},
        {id: '4', src: {portrait: 'https://example.com/image4.jpg'}},
      ];
      const onEndReachedCallback = () => setData([...dummyMedia, ...newData]);
      return (
        <ImageViewer
          numberOfImages={dummyMedia.length}
          media={data}
          onEndReachedCallback={onEndReachedCallback}
        />
      );
    }
    const {getByTestId} = render(<GalleryScreenTestWrapper />);

    // Query the FlatList and simulate a scroll event.
    const flatList = getByTestId('collection-list');
    fireEvent(flatList, 'endReached');

    expect(getByTestId('flatlist-item-3')).toBeTruthy();
  });
});
