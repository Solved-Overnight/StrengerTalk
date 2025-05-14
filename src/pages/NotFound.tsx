import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center btn-primary"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;