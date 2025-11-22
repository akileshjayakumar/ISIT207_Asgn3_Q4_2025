/**
 * Pet Surrender Form Component
 * Allows pet owners to submit their pets for surrender to the society
 */

import React, { useState } from 'react';
import { createSurrenderRequest } from '../../services/supabaseService';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { validateField } from '../../utils/formValidation';
import './PetSurrenderForm.css';

const PetSurrenderForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    petGender: '',
    reason: '',
    medicalHistory: '',
    additionalInfo: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.ownerName = validateField(formData.ownerName, { required: true });
    newErrors.ownerEmail = validateField(formData.ownerEmail, { required: true, email: true });
    newErrors.ownerPhone = validateField(formData.ownerPhone, { required: true, phone: true });
    newErrors.ownerAddress = validateField(formData.ownerAddress, { required: true });
    newErrors.petName = validateField(formData.petName, { required: true });
    newErrors.petType = validateField(formData.petType, { required: true });
    newErrors.petBreed = validateField(formData.petBreed, { required: true });
    newErrors.petAge = validateField(formData.petAge, { required: true });
    newErrors.petGender = validateField(formData.petGender, { required: true });
    newErrors.reason = validateField(formData.reason, { required: true });

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
      // Prepare surrender request data
      const surrenderData = {
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        ownerAddress: formData.ownerAddress,
        petName: formData.petName,
        petType: formData.petType,
        petBreed: formData.petBreed,
        petAge: formData.petAge,
        petGender: formData.petGender,
        reason: formData.reason,
        medicalHistory: formData.medicalHistory || null,
        additionalInfo: formData.additionalInfo || null,
      };

      console.log('📋 Surrender form submission - calling Supabase...', {
        ownerName: surrenderData.ownerName,
        ownerEmail: surrenderData.ownerEmail,
        petName: surrenderData.petName,
        petType: surrenderData.petType,
      });

      // Submit to Supabase
      const dbResult = await createSurrenderRequest(surrenderData);

      if (!dbResult.success) {
        setErrors({ submit: dbResult.error || 'Failed to submit request. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          ownerAddress: '',
          petName: '',
          petType: '',
          petBreed: '',
          petAge: '',
          petGender: '',
          reason: '',
          medicalHistory: '',
          additionalInfo: '',
        });
        setErrors({});
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Surrender form submission error:', error);
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Submission Successful" size="small">
        <div className="success-message">
          <p>✅ Thank you for your submission!</p>
          <p>We have received your pet surrender request and will contact you shortly.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pet Surrender Form" size="large">
      <form onSubmit={handleSubmit} className="surrender-form">
        {errors.submit && (
          <div className="form-error-message">{errors.submit}</div>
        )}

        <div className="form-section">
          <h3 className="section-title">Owner Information</h3>
          
          <FormInput
            label="Full Name"
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.ownerName}
            required
          />

          <FormInput
            label="Email"
            type="text"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleChange}
            placeholder="Enter your email address"
            error={errors.ownerEmail}
            required
          />

          <FormInput
            label="Phone Number"
            type="text"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            error={errors.ownerPhone}
            required
          />

          <FormTextarea
            label="Address"
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={handleChange}
            placeholder="Enter your full address"
            error={errors.ownerAddress}
            rows={3}
            required
          />
        </div>

        <div className="form-section">
          <h3 className="section-title">Pet Information</h3>

          <FormInput
            label="Pet Name"
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            placeholder="Enter pet's name"
            error={errors.petName}
            required
          />

          <div className="form-row">
            <FormSelect
              label="Pet Type"
              name="petType"
              value={formData.petType}
              onChange={handleChange}
              placeholder="Select pet type"
              options={[
                { value: 'cat', label: 'Cat' },
                { value: 'dog', label: 'Dog' },
              ]}
              error={errors.petType}
              required
            />

            <FormInput
              label="Breed"
              type="text"
              name="petBreed"
              value={formData.petBreed}
              onChange={handleChange}
              placeholder="Enter breed"
              error={errors.petBreed}
              required
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Age (years)"
              type="number"
              name="petAge"
              value={formData.petAge}
              onChange={handleChange}
              placeholder="Enter age"
              error={errors.petAge}
              required
              min="0"
              max="30"
            />

            <FormSelect
              label="Gender"
              name="petGender"
              value={formData.petGender}
              onChange={handleChange}
              placeholder="Select gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'unknown', label: 'Unknown' },
              ]}
              error={errors.petGender}
              required
            />
          </div>

          <FormTextarea
            label="Reason for Surrender"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Please explain why you need to surrender your pet..."
            error={errors.reason}
            rows={4}
            required
          />

          <FormTextarea
            label="Medical History"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Any known medical conditions, vaccinations, medications, etc."
            rows={4}
          />

          <FormTextarea
            label="Additional Information"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Any other information that might be helpful..."
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PetSurrenderForm;

