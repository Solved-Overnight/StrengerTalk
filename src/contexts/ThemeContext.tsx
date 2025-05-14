import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'orange' | 'green' | 'pink';

interface ThemeContextProps {
  theme: ThemeMode;
  accentColor: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'system';
  });
  
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const savedColor = localStorage.getItem('accentColor') as AccentColor;
    return savedColor || 'blue';
  });

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    
    // Listen for system preference changes if in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply accent color
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    
    // Remove all current accent classes
    document.documentElement.classList.remove(
      'accent-blue', 
      'accent-purple', 
      'accent-orange', 
      'accent-green', 
      'accent-pink'
    );
    
    // Add the current accent class
    document.documentElement.classList.add(`accent-${accentColor}`);
  }, [accentColor]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  const value = {
    theme,
    accentColor,
    setTheme,
    setAccentColor,
    toggleTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};