import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Moon, Sun, LayoutGrid } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary-600 dark:text-primary-400">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">VoiceConnect</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Dashboard
                </Link>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    onClick={toggleProfileMenu}
                  >
                    <span>{user.displayName || 'User'}</span>
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              type="button" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <LayoutGrid className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;