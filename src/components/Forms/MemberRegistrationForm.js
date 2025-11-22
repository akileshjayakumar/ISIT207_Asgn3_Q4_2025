/**
 * Member Registration Form Component
 * Allows visitors to register as members or supporters
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../Forms/FormInput';
import FormSelect from '../Forms/FormSelect';
import FormTextarea from '../Forms/FormTextarea';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { validateField } from '../../utils/formValidation';
import './MemberRegistrationForm.css';

const MemberRegistrationForm = ({ isOpen, onClose }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipType: '',
    password: '',
    confirmPassword: '',
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

    newErrors.name = validateField(formData.name, { required: true });
    newErrors.email = validateField(formData.email, { required: true, email: true });
    newErrors.phone = validateField(formData.phone, { required: true, phone: true });
    newErrors.address = validateField(formData.address, { required: true });
    newErrors.membershipType = validateField(formData.membershipType, { required: true });
    newErrors.password = validateField(formData.password, { required: true });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        membershipType: formData.membershipType,
        password: formData.password,
      });

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            membershipType: '',
            password: '',
            confirmPassword: '',
          });
          setErrors({});
          onClose();
        }, 2000);
      } else {
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Registration Successful" size="small">
        <div className="success-message">
          <p>✅ Thank you for registering with Pet Heaven!</p>
          <p>You are now logged in as a {formData.membershipType}.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Become a Member" size="medium">
      <form onSubmit={handleSubmit} className="registration-form" noValidate>
        {errors.submit && (
          <div className="form-error-message">{errors.submit}</div>
        )}

        <FormInput
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />

        <FormInput
          label="Email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          error={errors.email}
          required
        />

        <FormInput
          label="Phone Number"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          error={errors.phone}
          required
        />

        <FormTextarea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your full address"
          error={errors.address}
          rows={3}
          required
        />

        <FormSelect
          label="Membership Type"
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          placeholder="Select membership type"
          options={[
            { value: 'member', label: 'Member - Full access to adoption services' },
            { value: 'supporter', label: 'Supporter - Help us help animals' },
          ]}
          error={errors.membershipType}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password (min. 6 characters)"
          error={errors.password}
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
        />

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
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberRegistrationForm;

