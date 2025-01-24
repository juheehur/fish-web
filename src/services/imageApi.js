import axios from 'axios';

const PIXABAY_API_KEY = '48432941-a3a77c821ed20f3402d7c369d';  // Free API key

export const getLocationImage = async (locationName) => {
  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: PIXABAY_API_KEY,
        q: encodeURIComponent(`${locationName} underwater ocean`),
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 3,
        safesearch: true,
        category: 'nature'
      }
    });

    if (response.data.hits && response.data.hits.length > 0) {
      // Get the first image URL with large size
      return response.data.hits[0].largeImageURL;
    }
    return null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}; 