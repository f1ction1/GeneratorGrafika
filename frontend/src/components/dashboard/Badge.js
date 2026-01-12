import React from 'react';
import './Badge.css';

/**
 * Badge component for labels and counts
 * @param {string} color - Badge color
 * @param {string} variant - Badge variant (solid, outline)
 * @param {boolean} pill - Rounded pill style
 * @param {ReactNode} children - Badge content
 */
function Badge({ 
  color = 'primary',
  variant = 'solid',
  pill = false,
  className = '',
  children 
}) {
  return (
    <span className={`
      badge 
      badge-${variant}-${color} 
      ${pill ? 'badge-pill' : ''}
      ${className}
    `}>
      {children}
    </span>
  );
}

export default Badge;
