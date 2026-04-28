import React from 'react';

export const LibraryLogoIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Three vertical books */}
    <rect x="3" y="4" width="4" height="16" rx="0.5" />
    <rect x="10" y="2" width="4" height="18" rx="0.5" />
    <rect x="17" y="6" width="4" height="14" rx="0.5" />
    {/* Optional: lines to represent pages */}
    <line x1="4" y1="6" x2="6" y2="6" />
    <line x1="11" y1="4" x2="13" y2="4" />
    <line x1="18" y1="8" x2="20" y2="8" />
  </svg>
);

export default LibraryLogoIcon;
