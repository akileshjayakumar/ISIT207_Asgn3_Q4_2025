/**
 * Footer Component
 * Site footer with contact information and links
 */

import React from 'react';
import './Footer.css';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">🐾</span>
          <h3 className="footer-title">Pet Heaven</h3>
          </div>
          <p className="footer-description">
            Providing loving homes for cats and dogs in need. 
            Together, we can make a difference in the lives of our furry friends.
          </p>
          <div className="footer-social">
            <button 
              className="footer-social-button footer-social-instagram" 
              onClick={scrollToTop}
              aria-label="Visit our Instagram"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
              </svg>
            </button>
            <button 
              className="footer-social-button footer-social-youtube" 
              onClick={scrollToTop}
              aria-label="Visit our YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
              </svg>
            </button>
            <button 
              className="footer-social-button footer-social-linkedin" 
              onClick={scrollToTop}
              aria-label="Visit our LinkedIn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => scrollToSection('home')}>Home</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('about')}>About Us</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('adoption')}>Meet Our Pets</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('contact')}>Contact</button>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <span className="footer-contact-label">Email:</span>
              <a href="mailto:info@petheaven.sg" className="footer-link">info@petheaven.sg</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-label">Phone:</span>
              <a href="tel:+6512345678" className="footer-link">+65 1234 5678</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-label">Address:</span>
              <address className="footer-address">
                123 Pet Care Street<br />
                Block 456, Unit 789<br />
                Singapore 123456
              </address>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Opening Hours</h4>
          <div className="footer-hours">
            <div className="footer-hours-item">
              <span className="footer-hours-day">Monday - Friday</span>
              <span className="footer-hours-time">9am - 6pm</span>
            </div>
            <div className="footer-hours-item">
              <span className="footer-hours-day">Saturday</span>
              <span className="footer-hours-time">10am - 4pm</span>
            </div>
            <div className="footer-hours-item">
              <span className="footer-hours-day">Sunday</span>
              <span className="footer-hours-time">Closed</span>
            </div>
            <div className="footer-hours-item">
              <span className="footer-hours-day">Public Holidays</span>
              <span className="footer-hours-time">Closed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Pet Heaven Animal Welfare Society. All rights reserved.
        </p>
        <p className="footer-credits">
          Made by Akilesh Jayakumar | UOW ID: 7901240 | ISIT207 - Assignment 3
        </p>
      </div>
    </footer>
  );
};

export default Footer;

