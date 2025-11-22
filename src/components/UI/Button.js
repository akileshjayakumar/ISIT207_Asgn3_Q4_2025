/**
 * Button Component
 * Reusable button component with variants
 */

import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const buttonClasses = `btn btn-${variant} btn-${size} ${className} ${disabled ? 'btn-disabled' : ''}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

