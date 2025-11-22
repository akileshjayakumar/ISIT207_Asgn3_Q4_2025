/**
 * Pet List Component
 * Displays available pets for adoption with search and filter functionality
 */

import React, { useState, useEffect } from 'react';
import { usePet } from '../../contexts/PetContext';
import { searchPetsByBreed, filterPets, getUniqueBreeds } from '../../services/petService';
import PetCard from './PetCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import FormInput from '../Forms/FormInput';
import FormSelect from '../Forms/FormSelect';
import './PetList.css';

const PetList = ({ typeFilter: externalTypeFilter, onTypeFilterChange }) => {
  const { availablePets, isLoading, error, loadAvailablePets } = usePet();
  const [searchTerm, setSearchTerm] = useState('');
  const [internalTypeFilter, setInternalTypeFilter] = useState('all');
  const [breedFilter, setBreedFilter] = useState('all');
  const [filteredPets, setFilteredPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  
  // Use external typeFilter if provided, otherwise use internal state
  const typeFilter = externalTypeFilter !== undefined ? externalTypeFilter : internalTypeFilter;
  const setTypeFilter = onTypeFilterChange || setInternalTypeFilter;

  useEffect(() => {
    loadAvailablePets(15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (availablePets.length > 0) {
      const uniqueBreeds = getUniqueBreeds(availablePets);
      setBreeds(uniqueBreeds);
    }
  }, [availablePets]);

  useEffect(() => {
    let result = [...availablePets];

    // Apply search
    if (searchTerm) {
      result = searchPetsByBreed(searchTerm, result);
    }

    // Apply filters
    const filters = {
      type: typeFilter,
      breed: breedFilter,
    };
    result = filterPets(result, filters);

    setFilteredPets(result);
  }, [availablePets, searchTerm, typeFilter, breedFilter]);

  const breedOptions = [
    { value: 'all', label: 'All Breeds' },
    ...breeds.map(breed => ({ value: breed, label: breed })),
  ];

  if (error) {
    return (
      <div className="pet-list-error">
        <p>Error loading pets: {error}</p>
        <button onClick={() => loadAvailablePets(15)}>Retry</button>
      </div>
    );
  }

  return (
    <div className="pet-list-container">
      <div className="pet-list-header">
        <h3>Available for Adoption</h3>
        <p className="pet-count">
          {filteredPets.length} {filteredPets.length === 1 ? 'pet' : 'pets'} available
        </p>
      </div>

      <div className="pet-list-filters">
        <div className="filter-group">
          <FormInput
            type="text"
            name="search"
            placeholder="Search by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {!externalTypeFilter && (
        <div className="filter-group">
          <FormSelect
            name="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'cat', label: 'Cats' },
              { value: 'dog', label: 'Dogs' },
            ]}
          />
        </div>
        )}

        <div className="filter-group">
          <FormSelect
            name="breed"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            options={breedOptions}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading available pets..." />
      ) : (
        <>
          {filteredPets.length > 0 ? (
            <div className="pet-list-grid">
              {filteredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No pets match your search criteria. Try adjusting your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetList;

