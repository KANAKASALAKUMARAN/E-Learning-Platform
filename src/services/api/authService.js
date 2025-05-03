import API from './apiService';

/**
 * Authentication service for handling user operations
 */
const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with user data and token
   */
  register: async (userData) => {
    try {
      const response = await API.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },
  
  /**
   * Login existing user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} Promise with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await API.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  /**
   * Get user profile
   * @returns {Promise} Promise with user profile data
   */
  getUserProfile: async () => {
    try {
      const response = await API.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Promise with updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await API.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
  
  /**
   * Log out current user
   */
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Redirect to home page or login page
    window.location.href = '/';
  }
};

export default AuthService;