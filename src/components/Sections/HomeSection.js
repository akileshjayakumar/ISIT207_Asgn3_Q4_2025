/**
 * Home Section Component
 * Hero section and introduction to Pet Heaven
 */

import React from 'react';
import Button from '../UI/Button';
import FloatingPetSlideshow from './FloatingPetSlideshow';
import './HomeSection.css';

const HomeSection = ({ onScrollToSection }) => {
  return (
    <section id="home" className="home-section">
      <div className="home-hero">
        <FloatingPetSlideshow />
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Pet Heaven</h1>
          <p className="hero-subtitle">
            A safe haven for cats and dogs in need of loving homes
          </p>
          <p className="hero-description">
            At Pet Heaven, we are dedicated to rescuing, caring for, and finding 
            forever homes for abandoned and surrendered pets. Join us in making 
            a difference in the lives of our furry friends.
          </p>
          <div className="hero-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => onScrollToSection('adoption')}
            >
              Adopt a Pet
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => onScrollToSection('adoption')}
            >
              Meet Our Pets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;

