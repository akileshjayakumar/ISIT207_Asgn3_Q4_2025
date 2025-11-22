/**
 * Card Component
 * Reusable card container component
 */

import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '',
  onClick,
  hover = false,
  ...props
}) => {
  const cardClasses = `card ${hover ? 'card-hover' : ''} ${className}`.trim();

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

