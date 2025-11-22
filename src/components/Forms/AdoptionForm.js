/**
 * Adoption Form Component
 * Allows members to apply for adopting a specific pet
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePet } from '../../contexts/PetContext';
import { createAdoptionApplication } from '../../services/supabaseService';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { validateField } from '../../utils/formValidation';
import './AdoptionForm.css';

const AdoptionForm = ({ isOpen, onClose, selectedPetId = null }) => {
  const { getUserData, isAuthenticated, user } = useAuth();
  const userData = getUserData();
  const { availablePets } = usePet();
  const [formData, setFormData] = useState({
    memberName: '',
    memberEmail: '',
    memberPhone: '',
    memberAddress: '',
    petId: '',
    reason: '',
    homeEnvironment: '',
    experience: '',
    otherPets: '',
    additionalInfo: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (userData && isAuthenticated && isOpen) {
      setFormData(prev => ({
        ...prev,
        memberName: userData.name || prev.memberName || '',
        memberEmail: userData.email || prev.memberEmail || '',
        memberPhone: prev.memberPhone || userData.phone || '',
        memberAddress: userData.address || prev.memberAddress || '',
      }));
    }
  }, [userData, isAuthenticated, isOpen]);

  useEffect(() => {
    if (selectedPetId) {
      setFormData(prev => ({ ...prev, petId: selectedPetId }));
    }
  }, [selectedPetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.memberName = validateField(formData.memberName, { required: true });
    newErrors.memberEmail = validateField(formData.memberEmail, { required: true, email: true });
    newErrors.memberPhone = validateField(formData.memberPhone, { required: true, phone: true });
    newErrors.memberAddress = validateField(formData.memberAddress, { required: true });
    newErrors.petId = validateField(formData.petId, { required: true });
    newErrors.reason = validateField(formData.reason, { required: true });
    newErrors.homeEnvironment = validateField(formData.homeEnvironment, { required: true });
    newErrors.experience = validateField(formData.experience, { required: true });

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== null)
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPet = availablePets.find(p => p.id === formData.petId);

      if (!selectedPet) {
        setErrors({ submit: 'Selected pet not found. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        memberId: user?.id || null,
        petId: formData.petId,
        petName: selectedPet.name,
        petBreed: selectedPet.breed,
        petType: selectedPet.type,
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberPhone: formData.memberPhone,
        memberAddress: formData.memberAddress,
        reason: formData.reason,
        homeEnvironment: formData.homeEnvironment,
        experience: formData.experience,
        otherPets: formData.otherPets || null,
        additionalInfo: formData.additionalInfo || null,
      };

      console.log('📋 Adoption form submission - calling Supabase...', {
        memberId: applicationData.memberId,
        petName: applicationData.petName,
        memberEmail: applicationData.memberEmail,
      });

      // Submit to Supabase
      const dbResult = await createAdoptionApplication(applicationData);

      if (!dbResult.success) {
        setErrors({ submit: dbResult.error || 'Failed to submit application. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          memberName: '',
          memberEmail: '',
          memberPhone: '',
          memberAddress: '',
          petId: '',
          reason: '',
          homeEnvironment: '',
          experience: '',
          otherPets: '',
          additionalInfo: '',
        });
        setErrors({});
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Adoption form submission error:', error);
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const petOptions = availablePets
    .filter(pet => pet.available)
    .map(pet => ({
      value: pet.id,
      label: `${pet.name} - ${pet.breed} (${pet.type})`,
    }));

  if (submitSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Application Submitted" size="small">
        <div className="success-message">
          <p>✅ Thank you for your adoption application!</p>
          <p>We have received your application and will review it shortly.</p>
        </div>
      </Modal>
    );
  }

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const offset = 80;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  if (!isAuthenticated) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Adoption Application" size="medium">
        <div className="auth-warning" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Login Required</h3>
          <p style={{ marginBottom: '1.5rem', color: '#666', lineHeight: '1.6' }}>
            You must be logged in to submit an adoption application. Please create an account or login to continue.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={scrollToContact}
            >
              Go to Login / Register
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adoption Application" size="large">
      <form onSubmit={handleSubmit} className="adoption-form">
        {errors.submit && (
          <div className="form-error-message">{errors.submit}</div>
        )}

        <div className="form-section">
          <h3 className="section-title">Your Information</h3>

          <FormInput
            label="Full Name"
            type="text"
            name="memberName"
            value={formData.memberName}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.memberName}
            required
            disabled={!!userData}
          />

          <FormInput
            label="Email"
            type="text"
            name="memberEmail"
            value={formData.memberEmail}
            onChange={handleChange}
            placeholder="Enter your email address"
            error={errors.memberEmail}
            required
            disabled={!!userData}
          />

          <FormInput
            label="Phone Number"
            type="text"
            name="memberPhone"
            value={formData.memberPhone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            error={errors.memberPhone}
            required
          />

          <FormTextarea
            label="Address"
            name="memberAddress"
            value={formData.memberAddress}
            onChange={handleChange}
            placeholder="Enter your full address"
            error={errors.memberAddress}
            rows={3}
            required
          />
        </div>

        <div className="form-section">
          <h3 className="section-title">Pet Selection</h3>

          <FormSelect
            label="Select Pet for Adoption"
            name="petId"
            value={formData.petId}
            onChange={handleChange}
            placeholder="Choose a pet"
            options={petOptions}
            error={errors.petId}
            required
            disabled={!!selectedPetId}
          />
        </div>

        <div className="form-section">
          <h3 className="section-title">Adoption Details</h3>

          <FormTextarea
            label="Reason for Adoption"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Why do you want to adopt this pet?"
            error={errors.reason}
            rows={4}
            required
          />

          <FormTextarea
            label="Home Environment"
            name="homeEnvironment"
            value={formData.homeEnvironment}
            onChange={handleChange}
            placeholder="Describe your home environment (house/apartment, yard, etc.)"
            error={errors.homeEnvironment}
            rows={3}
            required
          />

          <FormTextarea
            label="Previous Pet Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Tell us about your experience with pets"
            error={errors.experience}
            rows={3}
            required
          />

          <FormInput
            label="Other Pets"
            type="text"
            name="otherPets"
            value={formData.otherPets}
            onChange={handleChange}
            placeholder="Do you have other pets? (Leave blank if none)"
          />

          <FormTextarea
            label="Additional Information"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Any other information you'd like to share..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !isAuthenticated}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdoptionForm;

