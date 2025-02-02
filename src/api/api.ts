import {APIResponse} from '../types/types';
const PEXELS_URL = 'https://api.pexels.com/v1';

export const getCollections = async (
  apiKey: string,
  pageParam: number = 1,
  perPage: number = 30,
) => {
  try {
    const response = await fetch(
      `${PEXELS_URL}/collections/featured?per_page=${perPage}&page=${pageParam}`,
      {
        // why I get this error? I'm already checking that the api key defined
        headers: {
          Authorization: apiKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: APIResponse = await response.json();

    if (!data.collections || !Array.isArray(data.collections)) {
      console.error('Invalid API response structure:', data);
      return {collections: [], nextPage: null};
    }

    if (data.collections.length < perPage && data.collections.length > 0) {
      console.warn(
        `Unexpected API response: requested ${perPage} items, but received ${data.collections.length}.`,
      );
    }

    return {
      collections: data.collections,
      nextPage: data.collections.length === perPage ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};
