import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-primary-600 dark:text-primary-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">VoiceConnect</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect with strangers around the world through voice conversations. Break language barriers and make new friends.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} VoiceConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;