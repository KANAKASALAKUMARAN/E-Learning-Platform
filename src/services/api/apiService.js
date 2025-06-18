import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000, // 15 seconds timeout
  withCredentials: false // Set to true if using cookies for authentication
});

// Add a request interceptor to include auth token in requests
API.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.baseURL);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Only add Authorization header for real JWT tokens, not demo tokens
    if (token && !token.startsWith('demo-token-')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Check if error is due to server not running
    if (!error.response) {
      console.error('Network error - server might be down or not reachable');
      // Format a more user-friendly error
      const connectionError = new Error('Server connection error. Please make sure the backend server is running on port 5000.');
      connectionError.isConnectionError = true;
      return Promise.reject(connectionError);
    }
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;