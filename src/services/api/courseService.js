import API from './apiService';

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
      const response = await API.get('/courses', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch courses' };
    }
  },
  
  /**
   * Get a single course by ID
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with course data
   */
  getCourseById: async (courseId) => {
    try {
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
   * Get all course categories
   * @returns {Promise} Promise with categories data
   */
  getCategories: async () => {
    try {
      const response = await API.get('/courses/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  }
};

export default CourseService;