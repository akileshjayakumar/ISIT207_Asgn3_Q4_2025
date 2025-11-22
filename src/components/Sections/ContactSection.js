/**
 * Contact Section Component
 * Contact information, login, and registration
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../Auth/LoginForm';
import MemberRegistrationForm from '../Forms/MemberRegistrationForm';
import Button from '../UI/Button';
import './ContactSection.css';

const ContactSection = () => {
  const { isAuthenticated, getUserData } = useAuth();
  const userData = getUserData();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">
          Get in touch with Pet Heaven or become a member
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Visit Us</h3>
            <div className="info-item">
              <strong>Address:</strong>
              <p>123 Pet Care Street<br />Block 456, Unit 789<br />Singapore 123456</p>
            </div>
            <div className="info-item">
              <strong>Phone:</strong>
              <p>+65 1234 5678</p>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <p>info@petheaven.sg</p>
            </div>
            <div className="info-item">
              <strong>Hours:</strong>
              <p>
                Monday - Friday: 9am - 6pm<br />
                Saturday: 10am - 4pm<br />
                Sunday: Closed<br />
                Public Holidays: Closed
              </p>
            </div>
          </div>

          <div className="contact-forms">
            <h3>Member Access</h3>
            {isAuthenticated && userData ? (
              <>
                <p className="form-description">
                  You are logged in as {userData.name}
                </p>
                <p className="form-description" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  You can now submit adoption applications and access member features.
                </p>
              </>
            ) : (
              <>
                <p className="form-description">
                  Login to your account or register as a new member or supporter
                </p>
                <div className="form-buttons">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => setShowLoginForm(true)}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    size="large"
                    onClick={() => setShowRegisterForm(true)}
                  >
                    Register
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LoginForm
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSwitchToRegister={() => {
          setShowLoginForm(false);
          setShowRegisterForm(true);
        }}
      />

      <MemberRegistrationForm
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
      />
    </section>
  );
};

export default ContactSection;

