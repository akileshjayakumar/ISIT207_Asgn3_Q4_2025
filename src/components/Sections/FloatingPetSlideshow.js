/**
 * Floating Pet Slideshow Component
 * Smooth space-like floating pet images in circles
 * Exactly 6 images (3 cats, 3 dogs) with staggered fade-in
 */

import React, { useState, useEffect, useRef } from 'react';
import { fetchCatImages } from '../../services/catApi';
import { fetchDogImages } from '../../services/dogApi';
import './FloatingPetSlideshow.css';

const FloatingPetSlideshow = () => {
  const [displayedImages, setDisplayedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const slideshowRef = useRef(null);
  
  // Define 6 different trajectories that avoid center area (keep images on edges)
  // Center area is roughly 30-70% horizontally and vertically
  const trajectories = [
    {
      // Left edge: top to bottom
      startX: 5,
      startY: -15,
      endX: 5,
      endY: 115,
      rotation: 360,
    },
    {
      // Right edge: bottom to top
      startX: 95,
      startY: 115,
      endX: 95,
      endY: -15,
      rotation: -360,
    },
    {
      // Top edge: left to right
      startX: -15,
      startY: 10,
      endX: 115,
      endY: 10,
      rotation: 360,
    },
    {
      // Bottom edge: right to left
      startX: 115,
      startY: 90,
      endX: -15,
      endY: 90,
      rotation: -360,
    },
    {
      // Top-left corner arc: moves along top and left edges
      startX: -15,
      startY: 5,
      endX: 5,
      endY: -15,
      rotation: 360,
    },
    {
      // Bottom-right corner arc: moves along bottom and right edges
      startX: 95,
      startY: 115,
      endX: 115,
      endY: 95,
      rotation: -360,
    },
  ];

  // Fetch exactly 3 cats and 3 dogs
  useEffect(() => {
    const loadPetImages = async () => {
      try {
        setIsLoading(true);
        
        // Fetch exactly 3 cats and 3 dogs
        const [catImages, dogImages] = await Promise.all([
          fetchCatImages(3, true).catch(() => []),
          fetchDogImages(3, true).catch(() => []),
        ]);

        // Combine: 3 cats + 3 dogs = 6 images total
        const allImages = [
          ...catImages.map(img => ({ url: img.url, type: 'cat', id: img.id })),
          ...dogImages.map(img => ({ url: img.url, type: 'dog', id: img.id })),
        ];

        // Shuffle to randomize order
        const shuffled = shuffleArray(allImages);
        
        // Assign each image a trajectory and staggered fade-in delay
        setDisplayedImages(shuffled.map((img, index) => {
          const trajectory = trajectories[index % trajectories.length];
          const fadeInDelay = 0.5 + (index * 0.3); // Staggered: 0.5s, 0.8s, 1.1s, 1.4s, 1.7s, 2.0s
          
          // Calculate movement delta for animation
          const deltaX = trajectory.endX - trajectory.startX;
          const deltaY = trajectory.endY - trajectory.startY;
          
          return {
            ...img,
            shape: 'circle', // All images are circles
            trajectory: trajectory,
            fadeInDelay: fadeInDelay,
            animationDuration: 20 + Math.random() * 10, // 20-30 seconds for smooth movement
            isVisible: false, // Start invisible for staggered fade-in
            deltaX: deltaX, // Movement delta for CSS
            deltaY: deltaY,
          };
        }));
      } catch (error) {
        console.error('Error loading pet images for slideshow:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPetImages();
  }, []);

  // Staggered fade-in effect
  useEffect(() => {
    if (displayedImages.length === 0) return;

    const timers = displayedImages.map((img, index) => {
      return setTimeout(() => {
        setDisplayedImages(prevImages => {
          return prevImages.map((prevImg, idx) => 
            idx === index ? { ...prevImg, isVisible: true } : prevImg
          );
        });
      }, img.fadeInDelay * 1000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [displayedImages.length]);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };


  if (isLoading) {
    return null; // Don't show anything while loading
  }

  return (
    <div 
      ref={slideshowRef}
      className="floating-pet-slideshow"
    >
      {displayedImages.map((image, index) => {
        const trajectory = image.trajectory || trajectories[index % trajectories.length];
        return (
          <div
            key={`${image.id}-${index}`}
            className="floating-pet-wrapper"
            style={{
              left: `${trajectory.startX}%`,
              top: `${trajectory.startY}%`,
              opacity: image.isVisible ? 1 : 0,
              transition: `opacity ${image.fadeInDelay ? 1.5 : 0}s ease-in`,
              animationDuration: `${image.animationDuration || 25}s`,
              '--delta-x': `${image.deltaX}vw`,
              '--delta-y': `${image.deltaY}vh`,
            }}
          >
            <div
              className="floating-pet-image circle"
              data-trajectory={index}
              style={{
                animationDuration: `${image.animationDuration || 25}s`,
                '--rotation': `${trajectory.rotation}deg`,
              }}
            >
              <img
                src={image.url}
                alt={`${image.type} floating in background`}
                loading="lazy"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FloatingPetSlideshow;

