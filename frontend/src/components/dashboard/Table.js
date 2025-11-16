import React from 'react';
import './Table.css';

/**
 * Table component with various styles
 * @param {Array} columns - Column definitions [{key, label, render}]
 * @param {Array} data - Table data
 * @param {boolean} striped - Striped rows
 * @param {boolean} hover - Hover effect
 * @param {boolean} bordered - Show borders
 * @param {string} size - Table size (sm, md, lg)
 */
function Table({ 
  columns = [], 
  data = [],
  striped = false,
  hover = true,
  bordered = false,
  size = 'md',
  className = ''
}) {
  return (
    <div className="table-responsive">
      <table className={`
        table 
        ${striped ? 'table-striped' : ''} 
        ${hover ? 'table-hover' : ''} 
        ${bordered ? 'table-bordered' : ''}
        table-${size}
        ${className}
      `}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx}>
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
