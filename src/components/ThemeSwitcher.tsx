import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <button
        onClick={toggleDropdown}
        className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none"
        aria-label="Toggle theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-64">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md flex flex-col items-center ${
                  theme === 'light' ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Sun className="w-5 h-5 mb-1" />
                <span className="text-xs">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md flex flex-col items-center ${
                  theme === 'dark' ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Moon className="w-5 h-5 mb-1" />
                <span className="text-xs">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md flex flex-col items-center ${
                  theme === 'system' ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Monitor className="w-5 h-5 mb-1" />
                <span className="text-xs">System</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Accent Color</h3>
            <div className="grid grid-cols-5 gap-2">
              {['blue', 'purple', 'orange', 'green', 'pink'].map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color as any)}
                  className={`w-full aspect-square rounded-full ${
                    accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''
                  }`}
                  style={{
                    backgroundColor: getColorForName(color),
                  }}
                  aria-label={`Set accent color to ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color values for the accent color buttons
function getColorForName(name: string): string {
  const colors = {
    blue: '#0ea5e9',    // primary-500
    purple: '#8b5cf6',  // secondary-500
    orange: '#f97316',  // accent-500
    green: '#22c55e',   // success-500
    pink: '#ec4899',    // A nice pink shade
  };
  
  return colors[name as keyof typeof colors] || colors.blue;
}

export default ThemeSwitcher;