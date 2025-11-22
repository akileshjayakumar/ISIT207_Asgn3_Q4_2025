/**
 * Pet Card Component
 * Reusable card component for displaying pet information
 */

import React from 'react';
import Card from '../UI/Card';
import './PetCard.css';

const PetCard = ({ pet, onClick }) => {
  if (!pet) return null;

  return (
    <Card className="pet-card" hover={!!onClick} onClick={onClick}>
      <div className="pet-card-image-container">
        <img 
          src={pet.imageUrl} 
          alt={pet.name || `${pet.type} ${pet.breed}`}
          className="pet-card-image"
          loading="lazy"
        />
        {!pet.available && (
          <div className="pet-card-badge pet-card-badge-unavailable">
            Adopted
          </div>
        )}
        {pet.available && (
          <div className="pet-card-badge pet-card-badge-available">
            Looking for Home
          </div>
        )}
      </div>
      
      <div className="pet-card-content">
        <h3 className="pet-card-name">{pet.name}</h3>
        <p className="pet-card-breed">{pet.breed}</p>
        <div className="pet-card-info">
          <span className="pet-card-type">
            {pet.type === 'cat' ? '🐱' : '🐶'} {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
          </span>
          <span className="pet-card-age">Age: {pet.age}</span>
        </div>
        <p className="pet-card-description">{pet.description}</p>
      </div>
    </Card>
  );
};

export default PetCard;

