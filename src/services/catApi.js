/**
 * The Cat API Service
 * Handles all API calls to The Cat API
 * Documentation: https://thecatapi.com/
 */

import { API_CONFIG, getApiHeaders } from '../config/apiConfig';

const BASE_URL = API_CONFIG.CAT_API.BASE_URL;

/**
 * Fetch cat images with breed information
 * @param {number} limit - Number of images to fetch (default: 20)
 * @param {boolean} hasBreeds - Only return images with breed information (default: true)
 * @returns {Promise<Array>} Array of cat images with breed data
 */
export const fetchCatImages = async (limit = 20, hasBreeds = true) => {
  try {
    const url = `${BASE_URL}/images/search?limit=${limit}&has_breeds=${hasBreeds}&size=med`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders('CAT'),
    });

    if (!response.ok) {
      throw new Error(`Cat API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cat images:', error);
    throw error;
  }
};

/**
 * Fetch all cat breeds
 * @returns {Promise<Array>} Array of cat breed information
 */
export const fetchCatBreeds = async () => {
  try {
    const url = `${BASE_URL}/breeds`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders('CAT'),
    });

    if (!response.ok) {
      throw new Error(`Cat API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    throw error;
  }
};

/**
 * Fetch a specific cat image by ID
 * @param {string} imageId - The image ID
 * @returns {Promise<Object>} Cat image data
 */
export const fetchCatImageById = async (imageId) => {
  try {
    const url = `${BASE_URL}/images/${imageId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders('CAT'),
    });

    if (!response.ok) {
      throw new Error(`Cat API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cat image by ID:', error);
    throw error;
  }
};

