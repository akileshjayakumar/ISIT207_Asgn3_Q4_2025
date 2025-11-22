/**
 * API Configuration for Pet Heaven Website
 * Manages API keys and base URLs for The Cat API and The Dog API
 */

export const API_CONFIG = {
  CAT_API: {
    BASE_URL: 'https://api.thecatapi.com/v1',
    API_KEY: process.env.REACT_APP_CAT_API_KEY || '',
  },
  DOG_API: {
    BASE_URL: 'https://api.thedogapi.com/v1',
    API_KEY: process.env.REACT_APP_DOG_API_KEY || '',
  },
};

/**
 * Get headers with API key for authenticated requests
 * Note: APIs work without keys but with lower rate limits
 */
export const getApiHeaders = (apiType = 'CAT') => {
  const config = apiType === 'CAT' ? API_CONFIG.CAT_API : API_CONFIG.DOG_API;
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Only add API key if it exists
  if (config.API_KEY && config.API_KEY.trim() !== '') {
    headers['x-api-key'] = config.API_KEY;
  }
  
  return headers;
};

