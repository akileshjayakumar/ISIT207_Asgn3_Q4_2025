/**
 * Pet Context
 * Manages pet data state and API interactions
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllPets, fetchPetsByType, fetchAvailablePets } from '../services/petService';

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [availablePets, setAvailablePets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all pets
  const loadPets = async (limitPerType = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllPets(limitPerType);
      setPets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading pets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pets by type
  const loadPetsByType = async (type, limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPetsByType(type, limit);
      setPets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading pets by type:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available pets
  const loadAvailablePets = async (limitPerType = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAvailablePets(limitPerType);
      setAvailablePets(data);
      setPets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading available pets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load pets on mount
  useEffect(() => {
    loadPets(10);
  }, []);

  const value = {
    pets,
    availablePets,
    isLoading,
    error,
    loadPets,
    loadPetsByType,
    loadAvailablePets,
    setPets,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

