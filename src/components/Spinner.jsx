import React from 'react';

/**
 * Spinner component that provides visual feedback during plan generation.
 */
const Spinner = ({ message = "Analyzing biometrics & generating plan..." }) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" id="spinner-loader"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export default Spinner;
