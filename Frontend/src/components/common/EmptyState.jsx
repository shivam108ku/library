import React from 'react';

const EmptyState = ({ icon, title, message }) => (
  <div className="text-center p-10 flex flex-col items-center">
    {icon && (
      <div className="w-16 h-16 bg-skin-base rounded-full flex items-center justify-center text-skin-muted mb-4 shadow-inner border border-skin-border">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
    )}
    <h3 className="text-lg font-bold text-skin-text">{title}</h3>
    <p className="text-sm text-skin-muted mt-1 max-w-xs">{message}</p>
  </div>
);


export default EmptyState;