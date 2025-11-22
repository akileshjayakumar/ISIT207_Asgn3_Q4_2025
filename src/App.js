/**
 * Main App Component
 * Single Page Application for Pet Heaven Animal Welfare Society
 */

import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { initDatabase } from './services/dbInitService';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomeSection from './components/Sections/HomeSection';
import AboutSection from './components/Sections/AboutSection';
import AdoptionSection from './components/Sections/AdoptionSection';
import ContactSection from './components/Sections/ContactSection';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize database on app startup (silently)
    const initializeDb = async () => {
      try {
        await initDatabase();
      } catch (error) {
        // Silently fail - don't show errors to users
        console.error('Database initialization error:', error);
      }
    };

    initializeDb();
  }, []);

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

  return (
    <AuthProvider>
      <PetProvider>
    <div className="App">
          <Header />
          <main className="main-content">
            <HomeSection onScrollToSection={scrollToSection} />
            <AboutSection />
            <AdoptionSection />
            <ContactSection />
          </main>
          <Footer />
    </div>
      </PetProvider>
    </AuthProvider>
  );
}

export default App;
