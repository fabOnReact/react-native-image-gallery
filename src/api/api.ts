import {PEXELS_API_KEY} from '@env';

const PEXELS_URL = 'https://api.pexels.com/v1';

export const getCollections = async () => {
  try {
    const response = await fetch(
      `${PEXELS_URL}/collections/featured?per_page=10`,
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
      return [];
    }

    const data = await response.json();

    if (!data.collections || !Array.isArray(data.collections)) {
      console.error('Invalid API response structure:', data);
    }

    return data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};
