import React from 'react';

/**
 * Responsive wrapper for Chart.js charts.
 * @param {string} title - Chart title
 * @param {number} height - Chart canvas height in px
 */
const ChartWrapper = ({ title, height = 300, children }) => (
  <div className="chart-wrapper">
    {title && <div className="chart-title">{title}</div>}
    <div className="chart-container" style={{ height }}>
      {children}
    </div>
  </div>
);

export default ChartWrapper;
