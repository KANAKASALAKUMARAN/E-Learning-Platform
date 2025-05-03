import API from './apiService';
import localCourseData from '../../data/courseData';

// Enhanced cache with better performance
const courseCache = {
  allCourses: null,
  categories: null,
  filteredResults: new Map(),
  timestamp: null,
  CACHE_DURATION: 3 * 60 * 1000 // 3 minutes
};

/**
 * Course service for handling course operations with optimized performance
 */
const CourseService = {
  /**
   * Get all courses with optional filtering
   * @param {Object} filters - Optional filters for courses
   * @returns {Promise} Promise with courses data
   */
  getCourses: async (filters = {}) => {
    try {
      const filterKey = JSON.stringify(filters);
      const hasFilters = Object.keys(filters).some(k => filters[k]);
      
      // Check if we have a cached result for this exact filter
      if (courseCache.timestamp && 
          Date.now() - courseCache.timestamp < courseCache.CACHE_DURATION) {
        
        // Return cached filtered results if available
        if (hasFilters && courseCache.filteredResults.has(filterKey)) {
          return courseCache.filteredResults.get(filterKey);
        }
        
        // Return all courses if no filters and we have cached all courses
        if (!hasFilters && courseCache.allCourses) {
          return courseCache.allCourses;
        }
      }

      // Set a short timeout for faster failures
      const response = await API.get('/courses', { 
        params: filters,
        timeout: 8000 // 8 seconds timeout for faster failure/recovery
      });

      // Ensure we have data
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }

      // Update cache
      const now = Date.now();
      if (!hasFilters) {
        courseCache.allCourses = response.data;
        courseCache.timestamp = now;
      } else {
        courseCache.filteredResults.set(filterKey, response.data);
      }

      return response.data;
    } catch (error) {
      // Improved error handling with fallback
      console.error('CourseService error:', error);
      
      // Return fallback data for specific error scenarios
      if (!navigator.onLine || error.message?.includes('Network Error') || error.code === 'ECONNABORTED') {
        return filterLocalCourses(filters);
      }
      
      throw error.response?.data || { message: 'Failed to load courses. Please try again.' };
    }
  },
  
  /**
   * Filter local course data
   * Private helper function
   */
  filterLocalCourses: (filters = {}) => {
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
  },
  
  /**
   * Get course categories with caching
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
        timeout: 5000 // 5 seconds timeout
      });

      if (!response || !response.data) {
        throw new Error('No categories data received');
      }

      // Cache the categories
      courseCache.categories = response.data;
      courseCache.timestamp = courseCache.timestamp || Date.now();
      
      return response.data;
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
    courseCache.filteredResults.clear();
    courseCache.timestamp = null;
  }
};

// Helper function for local course filtering
const filterLocalCourses = (filters = {}) => {
  return CourseService.filterLocalCourses(filters);
};

export default CourseService;