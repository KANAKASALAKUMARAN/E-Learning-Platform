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
   * Demo login - creates a demo user session
   * @returns {Object} Demo user data and token
   */
  demoLogin: () => {
    // Create demo token
    const demoToken = 'demo-token-' + Math.random().toString(36).substring(2);
    
    // Create demo user
    const demoUser = {
      _id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'student',
      enrolledCourses: [
        {
          _id: '1',
          title: 'Introduction to Data Science',
          description: 'Learn the basics of data science and analysis',
          progress: 100,
          instructor: { name: 'John Smith' },
          image: '/assets/images/course1.jpg',
          completedAt: '2025-04-28'
        },
        {
          _id: '2',
          title: 'Data Analysis with Python',
          description: 'Master data analysis using Python libraries',
          progress: 65,
          instructor: { name: 'Sarah Johnson' },
          image: '/assets/images/course2.jpg',
          lastAccessed: '2025-05-01'
        },
        {
          _id: '3',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning concepts',
          progress: 0,
          instructor: { name: 'David Chen' },
          image: '/assets/images/course3.jpg'
        }
      ],
      achievements: [
        { 
          id: 1, 
          title: 'First Course Completed', 
          description: 'You completed your first course!',
          date: '2025-04-28',
          icon: 'faTrophy'
        },
        {
          id: 2,
          title: 'Learning Streak',
          description: "You've been learning for 7 consecutive days",
          date: '2025-04-20',
          icon: 'faMedal'
        }
      ]
    };
    
    // Store token and user in localStorage
    localStorage.setItem('token', demoToken);
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    
    return { user: demoUser, token: demoToken };
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