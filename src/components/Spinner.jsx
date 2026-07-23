import React from 'react';

/**
 * Spinner component that provides visual feedback during plan generation.
 */
const Spinner = ({ message = "Analyzing biometrics & generating plan..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-in fade-in duration-300" role="status" aria-live="polite">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#ff4b2b] rounded-full animate-spin shadow-lg shadow-[#ff4b2b]/20" id="spinner-loader" />
      <p className="text-sm font-semibold text-gray-300 tracking-wide">{message}</p>
    </div>
  );
};

export default Spinner;
