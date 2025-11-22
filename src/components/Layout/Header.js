/**
 * Header Component
 * Navigation header with logo and menu items
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { getUserData, isAuthenticated, logout } = useAuth();
  const userData = getUserData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'adoption', label: 'Adoption' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo" onClick={() => scrollToSection('home')}>
          <span className="logo-icon">🐾</span>
          <span className="logo-text">Pet Heaven</span>
        </div>

        <nav className={`header-nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          {navItems.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              className="nav-link"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated && userData ? (
            <>
              <span className="user-greeting">Hello, {userData.name}</span>
              <button 
                className="btn-logout" 
                onClick={(e) => {
                  e.preventDefault();
                  logout().catch(err => {
                    console.error('Logout error:', err);
                  });
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn-login"
              onClick={() => scrollToSection('contact')}
            >
              Login / Register
            </button>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

