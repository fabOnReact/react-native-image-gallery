import {PEXELS_API_KEY} from '@env';

const PEXELS_URL = 'https://api.pexels.com/v1';

export const getCollections = async (
  pageParam: number = 1,
  perPage: number = 30,
) => {
  try {
    const response = await fetch(
      `${PEXELS_URL}/collections/featured?per_page=${perPage}&page=${pageParam}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    );

    if (!response.ok) {
      console.error(
        'API request failed: ',
        response.status,
        response.statusText,
      );
      return {collections: [], nextPage: null};
    }

    const data = await response.json();

    if (!data.collections || !Array.isArray(data.collections)) {
      console.error('Invalid API response structure:', data);
      return {collections: [], nextPage: null};
    }

    return {
      collections: data.collections,
      nextPage: data.collections.length === perPage ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return {collections: [], nextPage: null};
  }
};
