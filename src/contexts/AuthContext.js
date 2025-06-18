import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/api/authService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize authentication state on component mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check for stored token
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (storedToken && storedUser && Object.keys(storedUser).length > 0) {
        // Check if it's a demo token
        if (storedToken.startsWith('demo-token-')) {
          // Use demo user data
          setUser(storedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Try to validate real token with backend
          try {
            const userData = await authService.getUserProfile();
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Token validation failed:', error);
            // Clear invalid token
            clearAuth();
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials, rememberMe = false) => {
    try {
      setIsLoading(true);
      const userData = await authService.login(credentials);
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', userData.token);
      } else {
        sessionStorage.setItem('token', userData.token);
      }
      
      // Store user data
      const userToStore = {
        id: userData._id || userData.id || userData.user?._id || userData.user?.id,
        name: userData.fullName || userData.name || userData.user?.fullName || userData.user?.name,
        email: userData.email || userData.user?.email,
        role: userData.role || userData.user?.role || 'student',
        avatar: userData.avatar || userData.user?.avatar
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      setUser(userToStore);
      setToken(userData.token);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      const userToStore = {
        id: response._id,
        name: response.fullName,
        email: response.email,
        role: response.role || 'student',
        avatar: response.avatar
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      setUser(userToStore);
      setToken(response.token);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = () => {
    try {
      setIsLoading(true);
      const { user: demoUser, token: demoToken } = authService.demoLogin();
      
      setUser(demoUser);
      setToken(demoToken);
      setIsAuthenticated(true);
      
      return { user: demoUser, token: demoToken };
    } catch (error) {
      console.error('Demo login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    // Redirect to home page
    window.location.href = '/';
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      
      // Check if demo user
      if (token && token.startsWith('demo-token-')) {
        // Update demo user locally
        updateUser(profileData);
        return { ...user, ...profileData };
      } else {
        // Update real user via API
        const updatedUser = await authService.updateProfile(profileData);
        updateUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    token,
    
    // Methods
    login,
    register,
    demoLogin,
    logout,
    updateUser,
    updateProfile,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
