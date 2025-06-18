import API from './apiService';

/**
 * Progress service for handling user progress operations
 */
const ProgressService = {
  /**
   * Get comprehensive progress data for a user
   * @param {String} userId - User ID
   * @returns {Promise} Promise with progress data
   */
  getUserProgress: async (userId) => {
    try {
      const response = await API.get(`/progress/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch progress data' };
    }
  },

  /**
   * Update user progress (mark lesson as completed)
   * @param {Object} progressData - Progress update data
   * @returns {Promise} Promise with updated progress
   */
  updateProgress: async (progressData) => {
    try {
      const response = await API.post('/progress/update', progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update progress' };
    }
  },

  /**
   * Mark a lesson as completed
   * @param {String} courseId - Course ID
   * @param {String} lessonId - Lesson ID
   * @returns {Promise} Promise with updated progress
   */
  markLessonCompleted: async (courseId, lessonId) => {
    try {
      const response = await API.post('/progress/update', {
        courseId,
        lessonId,
        action: 'complete_lesson'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark lesson as completed' };
    }
  }
};

export default ProgressService;
