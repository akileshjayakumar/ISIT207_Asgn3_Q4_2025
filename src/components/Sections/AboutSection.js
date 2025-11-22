/**
 * About Section Component
 * Information about Pet Heaven's purpose, facilities, and services
 */

import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About Pet Heaven</h2>
        <p className="section-subtitle">
          Our mission is to provide a safe haven for animals in need
        </p>

        <div className="what-we-do-section">
          <h3 className="what-we-do-title">What We Do</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h4>Rescue & Care</h4>
              <p>We rescue abandoned and surrendered pets, providing them with medical care, shelter, and love.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h4>Find Homes</h4>
              <p>We match pets with loving families through our comprehensive adoption process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h4>Support Community</h4>
              <p>We offer support and resources to pet owners and build a community of animal lovers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h4>Education</h4>
              <p>We educate the public about responsible pet ownership and animal welfare.</p>
            </div>
          </div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>Our Purpose</h3>
            <p>
              Pet Heaven Animal Welfare Society was founded with a simple yet powerful mission: 
              to rescue, rehabilitate, and rehome cats and dogs who have been abandoned, 
              surrendered, or are in need of care. We believe every animal deserves a loving 
              home and a chance at a happy life.
            </p>

            <h3>Our Facilities</h3>
            <p>
              Our state-of-the-art facility includes:
            </p>
            <ul>
              <li>Spacious kennels and cat condos for comfortable living</li>
              <li>On-site veterinary clinic for medical care</li>
              <li>Indoor and outdoor play areas for exercise and socialization</li>
              <li>Grooming facilities to keep our pets looking their best</li>
              <li>Quarantine area for new arrivals</li>
              <li>Adoption center where families can meet potential pets</li>
            </ul>

            <h3>Our Services</h3>
            <div className="services-grid">
              <div className="service-item">
                <h4>Pet Adoption</h4>
                <p>Find your perfect companion through our comprehensive adoption process.</p>
              </div>
              <div className="service-item">
                <h4>Pet Surrender</h4>
                <p>We accept pets from owners who can no longer care for them.</p>
              </div>
              <div className="service-item">
                <h4>Volunteer Program</h4>
                <p>Join our team of dedicated volunteers helping animals in need.</p>
              </div>
              <div className="service-item">
                <h4>Education & Outreach</h4>
                <p>Learn about responsible pet ownership and animal welfare.</p>
              </div>
            </div>

            <h3>How You Can Help</h3>
            <p>
              There are many ways to support Pet Heaven:
            </p>
            <ul>
              <li><strong>Adopt:</strong> Give a pet a forever home</li>
              <li><strong>Foster:</strong> Provide temporary care for pets awaiting adoption</li>
              <li><strong>Donate:</strong> Financial contributions help us care for more animals</li>
              <li><strong>Volunteer:</strong> Your time and skills make a difference</li>
              <li><strong>Spread the Word:</strong> Share our mission with friends and family</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

