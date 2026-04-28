import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-12 w-full h-full">
    <div className="w-7 h-7 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;