import API from './apiService';
import localCourseData from '../../data/courseData';

// Simpler cache with better performance
const courseCache = {
  allCourses: null,
  categories: null,
  timestamp: null,
  CACHE_DURATION: 1 * 60 * 1000 // 1 minute (reduced from 3 minutes)
};

/**
 * Course service for handling course operations
 */
const CourseService = {
  /**
   * Get all courses with optional filtering
   * @param {Object} filters - Optional filters for courses
   * @returns {Promise} Promise with courses data
   */
  getCourses: async (filters = {}) => {
    try {
      const hasFilters = Object.keys(filters).some(k => filters[k]);
      
      // Check if we have a valid cached result
      if (!hasFilters && 
          courseCache.allCourses && 
          courseCache.timestamp && 
          Date.now() - courseCache.timestamp < courseCache.CACHE_DURATION) {
        return courseCache.allCourses;
      }

      // Shorter timeout for faster failures (reduced from 8 seconds to 4)
      const response = await API.get('/courses', { 
        params: filters,
        timeout: 4000 // 4 seconds timeout for faster failure/recovery
      });

      // Update cache for unfiltered results
      if (!hasFilters && response && response.data) {
        courseCache.allCourses = response.data;
        courseCache.timestamp = Date.now();
      }

      return response.data;
    } catch (error) {
      console.error('CourseService error:', error);
      
      // Return fallback data for specific error scenarios
      if (!navigator.onLine || error.message?.includes('Network Error') || error.code === 'ECONNABORTED') {
        return filterLocalCourses(filters);
      }
      
      throw error;
    }
  },
  
  /**
   * Get course categories with simpler caching
   * @returns {Promise} Promise with categories data
   */
  getCategories: async () => {
    try {
      // Return cached categories if available
      if (courseCache.categories && 
          courseCache.timestamp && 
          Date.now() - courseCache.timestamp < courseCache.CACHE_DURATION) {
        return courseCache.categories;
      }

      const response = await API.get('/courses/categories', {
        timeout: 3000 // 3 seconds timeout (reduced from 5)
      });

      if (response && response.data) {
        // Cache the categories
        courseCache.categories = response.data;
        courseCache.timestamp = Date.now();
        return response.data;
      }
      
      throw new Error('No categories data received');
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Return local categories as fallback
      return [...new Set(localCourseData.map(course => course.category))];
    }
  },
  
  /**
   * Get a single course by ID
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with course data
   */
  getCourseById: async (courseId) => {
    try {
      // Handle local course IDs
      if (courseId.startsWith('local-')) {
        const localId = parseInt(courseId.replace('local-', ''));
        const course = localCourseData.find(c => c.id === localId);
        if (course) {
          return {
            ...course,
            _id: courseId
          };
        }
        throw new Error('Course not found');
      }

      const response = await API.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch course details' };
    }
  },
  
  /**
   * Create a new course (instructor/admin only)
   * @param {Object} courseData - Course data
   * @returns {Promise} Promise with created course data
   */
  createCourse: async (courseData) => {
    try {
      const response = await API.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create course' };
    }
  },
  
  /**
   * Update an existing course (instructor/admin only)
   * @param {String} courseId - Course ID
   * @param {Object} courseData - Updated course data
   * @returns {Promise} Promise with updated course data
   */
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await API.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update course' };
    }
  },
  
  /**
   * Delete a course (instructor/admin only)
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with deletion confirmation
   */
  deleteCourse: async (courseId) => {
    try {
      const response = await API.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete course' };
    }
  },
  
  /**
   * Enroll in a course
   * @param {String} courseId - Course ID to enroll in
   * @returns {Promise} Promise with enrollment confirmation
   */
  enrollInCourse: async (courseId) => {
    try {
      const response = await API.post('/users/enroll', { courseId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to enroll in course' };
    }
  },
  
  /**
   * Mark a lesson as completed
   * @param {String} courseId - Course ID
   * @param {String} lessonId - Lesson ID
   * @returns {Promise} Promise with completion confirmation
   */
  completeLesson: async (courseId, lessonId) => {
    try {
      const response = await API.post('/users/complete-lesson', { courseId, lessonId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark lesson as completed' };
    }
  },
  
  /**
   * Clear the course cache
   */
  clearCache: () => {
    courseCache.allCourses = null;
    courseCache.categories = null;
    courseCache.timestamp = null;
  }
};

// Helper function for local course filtering
const filterLocalCourses = (filters = {}) => {
  const { category, level, search } = filters;
  
  return localCourseData
    .filter(course => {
      if (category && course.category !== category) return false;
      if (level && course.level !== level) return false;
      if (search) {
        const term = search.toLowerCase();
        return course.title.toLowerCase().includes(term) || 
               course.description.toLowerCase().includes(term);
      }
      return true;
    })
    .map(course => ({
      ...course,
      _id: `local-${course.id}`
    }));
};

export default CourseService;