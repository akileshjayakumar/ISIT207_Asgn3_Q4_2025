/**
 * The Dog API Service
 * Handles all API calls to The Dog API
 * Documentation: https://docs.thedogapi.com/docs/intro
 */

import { API_CONFIG, getApiHeaders } from '../config/apiConfig';

const BASE_URL = API_CONFIG.DOG_API.BASE_URL;

/**
 * Fetch dog images with breed information
 * @param {number} limit - Number of images to fetch (default: 20)
 * @param {boolean} hasBreeds - Only return images with breed information (default: true)
 * @returns {Promise<Array>} Array of dog images with breed data
 */
export const fetchDogImages = async (limit = 20, hasBreeds = true) => {
  try {
    const url = `${BASE_URL}/images/search?limit=${limit}&has_breeds=${hasBreeds}&size=med`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders('DOG'),
    });

    if (!response.ok) {
      throw new Error(`Dog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dog images:', error);
    throw error;
  }
};

/**
 * Fetch all dog breeds
 * @returns {Promise<Array>} Array of dog breed information
 */
export const fetchDogBreeds = async () => {
  try {
    const url = `${BASE_URL}/breeds`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders('DOG'),
    });

    if (!response.ok) {
      throw new Error(`Dog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    throw error;
  }
};

/**
 * Fetch a specific dog image by ID
 * @param {string} imageId - The image ID
 * @returns {Promise<Object>} Dog image data
 */
export const fetchDogImageById = async (imageId) => {
  try {
    const url = `${BASE_URL}/images/${imageId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders('DOG'),
    });

    if (!response.ok) {
      throw new Error(`Dog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dog image by ID:', error);
    throw error;
  }
};

