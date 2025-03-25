"use client"

import React from 'react';

const GradientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-br 
      from-purple-50 
      via-purple-100/50 
      to-purple-200/30 
      dark:from-purple-900/40 
      dark:via-purple-800/30 
      dark:to-purple-700/20">
      <div className="absolute inset-0 
        bg-[radial-gradient(#be00e8_1px,transparent_1px)] 
        [background-size:16px_16px] 
        opacity-[0.03]">
      </div>
    </div>
  );
};

export default GradientBackground;

