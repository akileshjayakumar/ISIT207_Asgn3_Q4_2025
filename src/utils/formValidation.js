/**
 * Form Validation Utilities
 * Provides reusable validation functions for forms
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  // Very basic validation - just check it contains @ symbol
  return email.includes('@');
};

/**
 * Validate phone number (lenient validation for testing)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const validatePhone = (phone) => {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Just check if it contains only digits (very lenient)
  const phoneRegex = /^\d+$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validate required field
 * @param {string} value - Value to check
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Validate minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum required length
 * @returns {boolean} True if value meets minimum length
 */
export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if value is within maximum length
 */
export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

/**
 * Validate age (must be positive number)
 * @param {string|number} age - Age to validate
 * @returns {boolean} True if valid age
 */
export const validateAge = (age) => {
  const ageNum = parseInt(age, 10);
  return !isNaN(ageNum) && ageNum > 0 && ageNum <= 30;
};

/**
 * Get validation error message
 * @param {string} fieldName - Name of the field
 * @param {string} validationType - Type of validation that failed
 * @returns {string} Error message
 */
export const getValidationErrorMessage = (fieldName, validationType) => {
  const messages = {
    required: `${fieldName} is required`,
    email: `Please enter a valid email address`,
    phone: `Please enter a valid phone number`,
    minLength: `${fieldName} is too short`,
    maxLength: `${fieldName} is too long`,
    age: `Please enter a valid age`,
  };

  return messages[validationType] || `${fieldName} is invalid`;
};

/**
 * Validate form field based on rules
 * @param {string} value - Field value
 * @param {Object} rules - Validation rules { required, email, phone, minLength, maxLength, age }
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (value, rules = {}) => {
  if (rules.required && !validateRequired(value)) {
    return getValidationErrorMessage('This field', 'required');
  }

  if (!value || value.trim() === '') {
    return null; // Skip other validations if field is empty and not required
  }

  if (rules.email && !validateEmail(value)) {
    return getValidationErrorMessage('Email', 'email');
  }

  if (rules.phone && !validatePhone(value)) {
    return getValidationErrorMessage('Phone', 'phone');
  }

  if (rules.minLength && !validateMinLength(value, rules.minLength)) {
    return getValidationErrorMessage('This field', 'minLength');
  }

  if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
    return getValidationErrorMessage('This field', 'maxLength');
  }

  if (rules.age && !validateAge(value)) {
    return getValidationErrorMessage('Age', 'age');
  }

  return null;
};

