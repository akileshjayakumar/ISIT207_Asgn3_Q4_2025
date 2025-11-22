/**
 * Adoption Section Component
 * Unified section for viewing pets and adoption/surrender actions
 */

import React, { useState } from 'react';
import PetList from '../Pets/PetList';
import AdoptionForm from '../Forms/AdoptionForm';
import Button from '../UI/Button';
import PetSurrenderForm from '../Forms/PetSurrenderForm';
import './AdoptionSection.css';

const AdoptionSection = () => {
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [showSurrenderForm, setShowSurrenderForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  return (
    <section id="adoption" className="adoption-section">
      <div className="container">
        <h2 className="section-title">Meet Our Pets</h2>
        <p className="section-subtitle">
          Browse our wonderful cats and dogs looking for loving homes. Each pet has a unique story and is ready to become part of your family.
        </p>

        <div className="adoption-actions">
          <Button
            variant="primary"
            size="large"
            onClick={() => setShowAdoptionForm(true)}
          >
            Apply to Adopt
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => setShowSurrenderForm(true)}
          >
            Surrender a Pet
          </Button>
        </div>

        <div className="adoption-quick-filters">
          <Button
            variant={typeFilter === 'all' ? 'primary' : 'outline'}
            onClick={() => setTypeFilter('all')}
            size="medium"
          >
            All Pets
          </Button>
          <Button
            variant={typeFilter === 'cat' ? 'primary' : 'outline'}
            onClick={() => setTypeFilter('cat')}
            size="medium"
          >
            🐱 Cats
          </Button>
          <Button
            variant={typeFilter === 'dog' ? 'primary' : 'outline'}
            onClick={() => setTypeFilter('dog')}
            size="medium"
          >
            🐶 Dogs
          </Button>
        </div>

        <PetList typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} />

        <AdoptionForm
          isOpen={showAdoptionForm}
          onClose={() => setShowAdoptionForm(false)}
        />

        <PetSurrenderForm
          isOpen={showSurrenderForm}
          onClose={() => setShowSurrenderForm(false)}
        />
      </div>
    </section>
  );
};

export default AdoptionSection;

