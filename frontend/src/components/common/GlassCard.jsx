import React from 'react';

const GlassCard = ({ children, className = '', glow = 'cyan', ...props }) => {
  const glowClass = glow ? `glow-${glow}` : '';
  return (
    <div 
      className={`glass-card ${glowClass} p-6 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
