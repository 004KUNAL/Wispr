import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'cyan' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className={`${sizeClasses[size]} rounded-full border-t-[var(--neon-${color})] border-r-transparent border-b-transparent border-l-transparent animate-spin`}
        style={{ filter: `drop-shadow(0 0 8px var(--neon-${color}))` }}
      />
    </div>
  );
};

export default LoadingSpinner;
