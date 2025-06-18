import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing navbar theme based on current route and scroll position
 * @returns {Object} Object containing navbar theme state and utilities
 */
export const useNavbarTheme = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Configuration for pages that should have dark navbar text
  // Add new routes here as your application grows
  const darkNavbarRoutes = [
    '/courses',
    '/about-us', 
    '/contact',
    '/login',
    '/signup',
    '/dashboard',
    '/profile',
    '/settings',
    '/cart',
    '/wishlist',
    '/course', // This will match any route starting with /course
  ];

  // Check if current route should use dark navbar
  const isDarkNavbarRoute = darkNavbarRoutes.some(route => {
    if (route === '/course') {
      return location.pathname.startsWith('/course');
    }
    return location.pathname === route;
  });

  // Determine if navbar should use dark theme
  const shouldUseDarkNavbar = isDarkNavbarRoute || isScrolled;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Utility functions for getting appropriate CSS classes
  const getNavbarClasses = () => {
    return `navbar navbar-expand-lg navbar-light fixed-top transition-all ${
      shouldUseDarkNavbar ? 'bg-white shadow-sm py-2' : 'bg-transparent py-3'
    }`;
  };

  const getBrandTextClasses = (isPrimary = false) => {
    return shouldUseDarkNavbar 
      ? (isPrimary ? 'text-primary' : 'text-dark')
      : 'text-white';
  };

  const getNavLinkClasses = (isActive = false) => {
    return `nav-link position-relative transition-all px-3 mx-1 ${
      isActive ? 'active fw-bold' : ''
    } ${shouldUseDarkNavbar ? 'text-dark' : 'text-white'}`;
  };

  const getButtonClasses = (variant = 'light') => {
    if (variant === 'outline') {
      return shouldUseDarkNavbar ? 'btn-outline-primary' : 'btn-outline-light';
    }
    return shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light';
  };

  const getIconClasses = () => {
    return shouldUseDarkNavbar ? 'text-primary' : 'text-white';
  };

  const getTogglerClasses = () => {
    return `navbar-toggler border-0 hover-shadow ${shouldUseDarkNavbar ? '' : 'text-white'}`;
  };

  return {
    // State
    isScrolled,
    shouldUseDarkNavbar,
    isDarkNavbarRoute,
    currentPath: location.pathname,
    
    // Utility functions
    getNavbarClasses,
    getBrandTextClasses,
    getNavLinkClasses,
    getButtonClasses,
    getIconClasses,
    getTogglerClasses,
    
    // Configuration (for debugging or extending)
    darkNavbarRoutes,
  };
};

export default useNavbarTheme;
