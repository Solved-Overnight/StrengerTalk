import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="flex items-center justify-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-12 h-12 text-primary-500 animate-pulse"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      </div>
      <div className="voice-wave">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="voice-wave-bar h-8"
            style={{'--index': i} as React.CSSProperties}
          ></div>
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
    </div>
  );
};

export default LoadingScreen;