import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import LibraryLogoIcon from '../Icons/LibraryLogoIcon';

const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 bg-skin-base flex flex-col items-center justify-center z-50 transition-colors duration-300">
      <div className="bg-skin-surface p-8 rounded-3xl shadow-xl flex flex-col items-center animate-in zoom-in duration-300 border border-skin-border">
        <div className="bg-brand-teal/10 p-4 rounded-xl mb-4">
            <LibraryLogoIcon className="w-12 h-12 text-brand-teal" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-skin-text mb-2">{import.meta.env.VITE_LIBRARY_NAME + " Library"}</h1>
        <p className="text-skin-muted text-sm mb-6">Admin Panel</p>
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default LoadingComponent;