/**
 * Login Form Component
 * Handles user login functionality
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../Forms/FormInput';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { validateEmail, validateRequired } from '../../utils/formValidation';
import './LoginForm.css';

const LoginForm = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setFormData({ email: '', password: '' });
      setErrors({});
      onClose();
    } else {
      setLoginError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login" size="small">
      <form onSubmit={handleSubmit} className="login-form">
        {loginError && (
          <div className="form-error-message">{loginError}</div>
        )}

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        <div className="form-actions">
          <Button type="submit" variant="primary" size="large">
            Login
          </Button>
        </div>

        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginForm;

