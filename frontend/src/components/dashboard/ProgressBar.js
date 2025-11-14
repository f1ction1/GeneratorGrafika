import React from 'react';
import './ProgressBar.css';

/**
 * Progress bar component
 * @param {number} value - Progress value (0-100)
 * @param {string} color - Color theme
 * @param {boolean} animated - Show animation
 * @param {boolean} striped - Show stripes
 * @param {string} label - Label to display inside bar
 * @param {string} height - Bar height (sm, md, lg)
 */
function ProgressBar({ 
  value = 0, 
  color = 'primary',
  animated = false,
  striped = false,
  label,
  height = 'md',
  className = ''
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={`progress progress-${height} ${className}`}>
      <div 
        className={`progress-bar bg-${color} ${striped ? 'progress-bar-striped' : ''} ${animated ? 'progress-bar-animated' : ''}`}
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {label && <span className="progress-label">{label}</span>}
      </div>
    </div>
  );
}

export default ProgressBar;
