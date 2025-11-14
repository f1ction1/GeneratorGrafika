import React from 'react';
import './StatCard.css';

/**
 * Widget card for displaying statistics
 * @param {string} title - Stat title
 * @param {string|number} value - Stat value
 * @param {string} color - Color theme (primary, success, warning, danger, info)
 * @param {ReactNode} icon - Icon component
 * @param {string} change - Percentage change indicator
 * @param {boolean} inverse - Inverse color scheme
 */
function StatCard({ 
  title, 
  value, 
  color = 'primary',
  icon,
  change,
  inverse = false,
  className = ''
}) {
  return (
    <div className={`stat-card stat-card-${color} ${inverse ? 'stat-card-inverse' : ''} ${className}`}>
      <div className="stat-card-body">
        <div className="stat-card-content">
          <div className="stat-card-value">{value}</div>
          <div className="stat-card-title">{title}</div>
          {change && (
            <div className={`stat-card-change ${parseFloat(change) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
            </div>
          )}
        </div>
        {icon && (
          <div className="stat-card-icon">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
