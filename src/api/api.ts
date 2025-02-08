import {CollectionAPIResponse, MediaAPIResponse} from '../types/types';
const PEXELS_URL = 'https://api.pexels.com/v1';

export const getCollectionsMedia = async (
  apiKey: string,
  id: string,
  pageParam: number = 1,
  perPage: number = 30,
) => {
  const GET_MEDIA_URL = `${PEXELS_URL}/collections/${id}?type=photos&per_page=${perPage}&page=${pageParam}`;
  try {
    const response = await fetch(GET_MEDIA_URL, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: MediaAPIResponse = await response.json();
    if (!data.media || !Array.isArray(data.media)) {
      console.error(
        `Invalid API response structure from ${PEXELS_URL}/collections/featured with data: `,
        data,
      );
      return {media: [], total_results: 0, nextPage: null};
    }

    return {
      media: data.media,
      total_results: data.total_results,
      nextPage: data.next_page ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error(
      `Error fetching media from ${GET_MEDIA_URL} with error: `,
      error,
    );
    throw error;
  }
};

export const getCollections = async (
  apiKey: string,
  pageParam: number = 1,
  perPage: number = 30,
) => {
  const GET_COLLECTIONS_URL = `${PEXELS_URL}/collections/featured?per_page=${perPage}&page=${pageParam}`;
  try {
    const response = await fetch(GET_COLLECTIONS_URL, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: CollectionAPIResponse = await response.json();

    if (!data.collections || !Array.isArray(data.collections)) {
      console.error(
        `Invalid API response structure from ${PEXELS_URL}/collections/featured with data: `,
        data,
      );
      return {collections: [], nextPage: null};
    }

    if (data.collections.length < perPage && data.collections.length > 0) {
      console.warn(
        `Unexpected API response. Requested ${perPage} items, but received ${data.collections.length}.`,
      );
    }

    return {
      collections: data.collections,
      nextPage: data.next_page ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error(
      `Error fetching collections from ${GET_COLLECTIONS_URL} with error: `,
      error,
    );
    throw error;
  }
};
