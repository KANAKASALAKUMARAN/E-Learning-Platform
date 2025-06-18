import API from './apiService';

/**
 * Quiz service for handling quiz operations
 */
const QuizService = {
  /**
   * Get all quizzes for a course
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with quizzes data
   */
  getQuizzesByCourse: async (courseId) => {
    try {
      const response = await API.get(`/quiz/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch quizzes' };
    }
  },

  /**
   * Get a single quiz by ID
   * @param {String} quizId - Quiz ID
   * @returns {Promise} Promise with quiz data
   */
  getQuizById: async (quizId) => {
    try {
      const response = await API.get(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch quiz' };
    }
  },

  /**
   * Submit quiz answers
   * @param {Object} quizData - Quiz submission data
   * @returns {Promise} Promise with quiz result
   */
  submitQuiz: async (quizData) => {
    try {
      const response = await API.post('/quiz/submit', quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit quiz' };
    }
  },

  /**
   * Get quiz results for a user
   * @param {String} userId - User ID
   * @returns {Promise} Promise with quiz results
   */
  getQuizResults: async (userId) => {
    try {
      const response = await API.get(`/quiz/results/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch quiz results' };
    }
  },

  /**
   * Create a new quiz (instructor/admin only)
   * @param {Object} quizData - Quiz data
   * @returns {Promise} Promise with created quiz
   */
  createQuiz: async (quizData) => {
    try {
      const response = await API.post('/quiz', quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create quiz' };
    }
  }
};

export default QuizService;
