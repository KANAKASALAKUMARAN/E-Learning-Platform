import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('english');

  // Initialize theme settings on component mount
  useEffect(() => {
    initializeTheme();
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    applyTheme();
  }, [theme, fontSize, reduceAnimations, highContrast]);

  const initializeTheme = () => {
    try {
      // Load theme settings from localStorage
      const savedSettings = JSON.parse(localStorage.getItem('themeSettings') || '{}');
      
      if (savedSettings.theme) setTheme(savedSettings.theme);
      if (savedSettings.fontSize) setFontSize(savedSettings.fontSize);
      if (savedSettings.reduceAnimations !== undefined) setReduceAnimations(savedSettings.reduceAnimations);
      if (savedSettings.highContrast !== undefined) setHighContrast(savedSettings.highContrast);
      if (savedSettings.language) setLanguage(savedSettings.language);
      
      // Check for system preference if no saved theme
      if (!savedSettings.theme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Apply theme class
    root.setAttribute('data-theme', theme);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
    
    // Apply animation preferences
    if (reduceAnimations) {
      root.classList.add('reduce-animations');
    } else {
      root.classList.remove('reduce-animations');
    }
    
    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
    }
  };

  const saveSettings = (settings) => {
    try {
      const currentSettings = JSON.parse(localStorage.getItem('themeSettings') || '{}');
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem('themeSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveSettings({ theme: newTheme });
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    saveSettings({ theme: newTheme });
  };

  const updateFontSize = (newFontSize) => {
    setFontSize(newFontSize);
    saveSettings({ fontSize: newFontSize });
  };

  const updateReduceAnimations = (reduce) => {
    setReduceAnimations(reduce);
    saveSettings({ reduceAnimations: reduce });
  };

  const updateHighContrast = (highContrast) => {
    setHighContrast(highContrast);
    saveSettings({ highContrast });
  };

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    saveSettings({ language: newLanguage });
  };

  const resetToDefaults = () => {
    setTheme('light');
    setFontSize('medium');
    setReduceAnimations(false);
    setHighContrast(false);
    setLanguage('english');
    localStorage.removeItem('themeSettings');
  };

  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#343a40',
        dark: '#f8f9fa',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        textSecondary: '#b0b0b0'
      };
    } else {
      return {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#212529',
        textSecondary: '#6c757d'
      };
    }
  };

  const value = {
    // State
    theme,
    fontSize,
    reduceAnimations,
    highContrast,
    language,
    
    // Computed values
    isDark: theme === 'dark',
    colors: getThemeColors(),
    
    // Methods
    toggleTheme,
    updateTheme,
    updateFontSize,
    updateReduceAnimations,
    updateHighContrast,
    updateLanguage,
    resetToDefaults,
    saveSettings
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
