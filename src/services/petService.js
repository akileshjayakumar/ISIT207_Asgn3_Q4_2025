/**
 * Unified Pet Service
 * Combines data from The Cat API and The Dog API into a consistent format
 */

import { fetchCatImages } from './catApi';
import { fetchDogImages } from './dogApi';
import { getPetName, getProperBreed } from '../utils/petNames';

// Track pet index for consistent naming
let petIndexCounter = { cat: 0, dog: 0 };

/**
 * Normalize API response into consistent pet object structure
 * @param {Object} apiData - Raw data from API
 * @param {string} type - 'cat' or 'dog'
 * @returns {Object} Normalized pet object
 */
const normalizePetData = (apiData, type) => {
  const breed = apiData.breeds && apiData.breeds.length > 0 ? apiData.breeds[0] : null;
  
  // Generate a random age estimate (in months) for display
  const ageMonths = Math.floor(Math.random() * 120) + 3; // 3 months to 10 years
  const ageDisplay = ageMonths < 12 
    ? `${ageMonths} months` 
    : `${Math.floor(ageMonths / 12)} years`;

  // Get proper name and breed
  const petName = getPetName(type, petIndexCounter[type]++);
  const breedName = getProperBreed(breed, type);

  return {
    id: apiData.id || `${type}-${Date.now()}-${Math.random()}`,
    name: petName,
    type: type,
    breed: breedName,
    imageUrl: apiData.url || apiData.url,
    age: ageDisplay,
    ageMonths: ageMonths,
    description: breed?.description || `A lovely ${breedName} ${type} looking for a forever home.`,
    available: Math.random() > 0.2, // 80% available for adoption
    metadata: {
      breedId: breed?.id || null,
      temperament: breed?.temperament || 'Friendly',
      origin: breed?.origin || 'Unknown',
      lifeSpan: breed?.life_span || 'Unknown',
      weight: breed?.weight?.metric || 'Unknown',
      height: breed?.height?.metric || 'Unknown',
      imageId: apiData.id,
      apiData: apiData, // Keep original data for reference
    },
  };
};

/**
 * Fetch and combine pets from both APIs
 * @param {number} limitPerType - Number of pets to fetch per type (default: 10)
 * @returns {Promise<Array>} Combined array of normalized pet objects
 */
export const fetchAllPets = async (limitPerType = 10) => {
  try {
    const [catImages, dogImages] = await Promise.all([
      fetchCatImages(limitPerType, true).catch(() => []),
      fetchDogImages(limitPerType, true).catch(() => []),
    ]);

    const cats = catImages.map(img => normalizePetData(img, 'cat'));
    const dogs = dogImages.map(img => normalizePetData(img, 'dog'));

    // Combine and shuffle
    const allPets = [...cats, ...dogs];
    return shuffleArray(allPets);
  } catch (error) {
    console.error('Error fetching all pets:', error);
    throw error;
  }
};

/**
 * Fetch pets by type (cats or dogs)
 * @param {string} type - 'cat' or 'dog'
 * @param {number} limit - Number of pets to fetch (default: 20)
 * @returns {Promise<Array>} Array of normalized pet objects
 */
export const fetchPetsByType = async (type, limit = 20) => {
  try {
    const images = type === 'cat' 
      ? await fetchCatImages(limit, true)
      : await fetchDogImages(limit, true);

    return images.map(img => normalizePetData(img, type));
  } catch (error) {
    console.error(`Error fetching ${type}s:`, error);
    throw error;
  }
};

/**
 * Fetch available pets only
 * @param {number} limitPerType - Number of pets to fetch per type (default: 10)
 * @returns {Promise<Array>} Array of available pets
 */
export const fetchAvailablePets = async (limitPerType = 10) => {
  try {
    const allPets = await fetchAllPets(limitPerType);
    return allPets.filter(pet => pet.available);
  } catch (error) {
    console.error('Error fetching available pets:', error);
    throw error;
  }
};

/**
 * Search pets by breed name
 * @param {string} searchTerm - Search term for breed name
 * @param {Array} pets - Array of pets to search
 * @returns {Array} Filtered pets matching search term
 */
export const searchPetsByBreed = (searchTerm, pets) => {
  if (!searchTerm || searchTerm.trim() === '') return pets;
  
  const term = searchTerm.toLowerCase().trim();
  return pets.filter(pet => 
    pet.breed.toLowerCase().includes(term) ||
    pet.name.toLowerCase().includes(term)
  );
};

/**
 * Filter pets by criteria
 * @param {Array} pets - Array of pets to filter
 * @param {Object} filters - Filter criteria { type, minAge, maxAge, breed }
 * @returns {Array} Filtered pets
 */
export const filterPets = (pets, filters = {}) => {
  let filtered = [...pets];

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(pet => pet.type === filters.type);
  }

  if (filters.breed && filters.breed !== 'all') {
    filtered = filtered.filter(pet => 
      pet.breed.toLowerCase().includes(filters.breed.toLowerCase())
    );
  }

  if (filters.minAge !== undefined) {
    filtered = filtered.filter(pet => pet.ageMonths >= filters.minAge);
  }

  if (filters.maxAge !== undefined) {
    filtered = filtered.filter(pet => pet.ageMonths <= filters.maxAge);
  }

  return filtered;
};

/**
 * Get unique breeds from pets array
 * @param {Array} pets - Array of pets
 * @returns {Array} Array of unique breed names
 */
export const getUniqueBreeds = (pets) => {
  const breeds = new Set();
  pets.forEach(pet => breeds.add(pet.breed));
  return Array.from(breeds).sort();
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

