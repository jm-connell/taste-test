import React from 'react';
import '../../App.css';

const ChartWrapper = ({ title, children, loading, error }) => {
  if (loading) {
    return (
      <div className="chart-container">
        <h2>{title}</h2>
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <h2>{title}</h2>
        <div className="chart-error">
          <p>Error: {error}</p>
          <p>Please try refreshing the page or sign in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <div className="chart-content">{children}</div>
    </div>
  );
};

export default ChartWrapper;
