import React from 'react';

const StatCard = ({ title, value, icon, description, color = "teal", onClick, isClickable }) => {
  
  // Updated with dark mode support for the icon backgrounds
  const colorVariants = {
    teal: "bg-brand-teal/10 text-brand-teal", // Teal handles itself via opacity
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400", // Added purple variant used in dashboard
  };

  return (
    <div 
        onClick={isClickable ? onClick : undefined}
        className={`
            bg-skin-surface p-6 rounded-2xl shadow-sm border border-skin-border flex items-start justify-between 
            transition-all duration-200
            ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-brand-teal/30 hover:-translate-y-0.5' : ''}
        `}
    >
      <div>
        <p className="text-sm font-medium text-skin-muted mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-skin-text font-serif tracking-tight">{value}</h3>
        {description && <p className="text-xs font-medium text-skin-muted/80 mt-2">{description}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorVariants[color] || colorVariants.teal}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;