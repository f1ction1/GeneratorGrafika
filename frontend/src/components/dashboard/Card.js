import React from 'react';
import './Card.css';

/**
 * Reusable Card component for dashboard widgets
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Card content
 * @param {string} header - Card header text
 * @param {ReactNode} headerActions - Actions to display in header
 * @param {string} color - Card accent color (primary, success, warning, danger, info)
 */
function Card({ 
  className = '', 
  children, 
  header, 
  headerActions,
  color
}) {
  return (
    <div className={`card ${color ? `card-accent-${color}` : ''} ${className}`}>
      {header && (
        <div className="card-header">
          <div className="card-header-title">{header}</div>
          {headerActions && <div className="card-header-actions">{headerActions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default Card;
