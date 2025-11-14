import React from 'react';
import './Button.css';

/**
 * Button component
 * @param {string} color - Button color
 * @param {string} variant - Button variant (solid, outline, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} block - Full width button
 * @param {boolean} disabled - Disabled state
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
function Button({ 
  color = 'primary',
  variant = 'solid',
  size = 'md',
  block = false,
  disabled = false,
  onClick,
  className = '',
  children,
  type = 'button'
}) {
  return (
    <button
      type={type}
      className={`
        btn 
        btn-${variant}-${color} 
        btn-${size}
        ${block ? 'btn-block' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
