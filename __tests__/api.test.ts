import {getCollections} from '../src/api/api';

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.resetMocks();
});

const collectionMock = Array.from({length: 30}, (_, i) => ({
  id: i + 1,
  title: `title ${i + 1}`,
}));

describe('getCollections API function', () => {
  it('fetches collections successfully', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        collections: collectionMock,
        nextPage: 2,
      }),
    );

    const result = await getCollections('test-api-key', 1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      collections: collectionMock,
      nextPage: 2,
    });
  });

  it('handles API request failure', async () => {
    fetchMock.mockResponseOnce('', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(getCollections('test-api-key', 1)).rejects.toThrow(
      'API request failed: 500 Internal Server Error',
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles invalid API response structure', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({wrongKey: []}));

    const result = await getCollections('test-api-key', 1);

    expect(result).toEqual({collections: [], nextPage: null});
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles network errors', async () => {
    fetchMock.mockReject(new Error('Network Error'));

    await expect(getCollections('test-api-key', 1)).rejects.toThrow(
      'Network Error',
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
