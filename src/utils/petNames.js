/**
 * Pet Names and Data
 * Provides proper names and breed information for pets
 */

// List of pet names
const PET_NAMES = {
  cat: [
    'Luna', 'Milo', 'Bella', 'Charlie', 'Lucy', 'Max', 'Daisy', 'Oliver',
    'Lily', 'Simba', 'Nala', 'Whiskers', 'Shadow', 'Mittens', 'Tiger',
    'Smokey', 'Ginger', 'Coco', 'Pepper', 'Oreo', 'Jasper', 'Mocha',
    'Phoenix', 'Zoe', 'Maya', 'Leo', 'Chloe', 'Jack', 'Sophie', 'Felix'
  ],
  dog: [
    'Buddy', 'Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Daisy', 'Milo',
    'Luna', 'Rocky', 'Sadie', 'Bear', 'Molly', 'Duke', 'Stella', 'Tucker',
    'Penny', 'Zeus', 'Lola', 'Jack', 'Roxy', 'Bentley', 'Ruby', 'Oscar',
    'Lily', 'Rex', 'Maya', 'Jax', 'Zoe', 'Thor', 'Nala', 'Apollo'
  ]
};

/**
 * Get a random name for a pet
 * @param {string} type - 'cat' or 'dog'
 * @param {number} index - Index to use for consistent naming
 * @returns {string} Pet name
 */
export const getPetName = (type, index = 0) => {
  const names = PET_NAMES[type] || PET_NAMES.cat;
  return names[index % names.length];
};

/**
 * Get a proper breed name, ensuring it's not "Mixed Breed" if breed data exists
 * @param {Object} breedData - Breed data from API
 * @param {string} type - 'cat' or 'dog'
 * @returns {string} Breed name
 */
export const getProperBreed = (breedData, type) => {
  if (breedData && breedData.name && breedData.name.trim() !== '') {
    return breedData.name;
  }
  // Return common breeds if API doesn't provide breed info
  const commonBreeds = {
    cat: ['Domestic Shorthair', 'Domestic Longhair', 'Siamese', 'Persian', 'Maine Coon', 'British Shorthair'],
    dog: ['Mixed Breed', 'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Beagle']
  };
  const breeds = commonBreeds[type] || commonBreeds.cat;
  return breeds[Math.floor(Math.random() * breeds.length)];
};

