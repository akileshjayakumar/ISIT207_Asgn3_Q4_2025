/**
 * Pet Gallery Component
 * Displays pet gallery with filtering by type (cats/dogs)
 */

import React, { useState, useEffect } from 'react';
import { usePet } from '../../contexts/PetContext';
import PetCard from './PetCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';
import './PetGallery.css';

const PetGallery = () => {
  const { pets, isLoading, error, loadPets } = usePet();
  const [filter, setFilter] = useState('all'); // 'all', 'cat', 'dog'
  const [displayedPets, setDisplayedPets] = useState([]);

  useEffect(() => {
    // Load all pets on mount
    loadPets(10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setDisplayedPets(pets);
    } else {
      setDisplayedPets(pets.filter(pet => pet.type === filter));
    }
  }, [pets, filter]);

  if (error) {
    return (
      <div className="gallery-error">
        <p>Error loading pets: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <h2 className="section-title">Pet Gallery</h2>
        <p className="section-subtitle">
          Meet our wonderful cats and dogs looking for loving homes
        </p>

        <div className="gallery-filters">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
            size="medium"
          >
            All Pets
          </Button>
          <Button
            variant={filter === 'cat' ? 'primary' : 'outline'}
            onClick={() => setFilter('cat')}
            size="medium"
          >
            🐱 Cats
          </Button>
          <Button
            variant={filter === 'dog' ? 'primary' : 'outline'}
            onClick={() => setFilter('dog')}
            size="medium"
          >
            🐶 Dogs
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading pets..." />
        ) : (
          <div className="gallery-grid">
            {displayedPets.length > 0 ? (
              displayedPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))
            ) : (
              <p className="no-pets-message">No pets found. Please try again later.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PetGallery;

