const express = require('express');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { protect, instructor, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware for quiz
const validateQuiz = (req, res, next) => {
  const { title, courseId, questions, timeLimit } = req.body;
  
  if (!title || !courseId || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ 
      message: 'Missing required fields: title, courseId, and questions array are required' 
    });
  }
  
  if (questions.length === 0) {
    return res.status(400).json({ message: 'Quiz must have at least one question' });
  }
  
  // Validate each question
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (!question.question || !question.options || !Array.isArray(question.options)) {
      return res.status(400).json({ 
        message: `Question ${i + 1}: Missing question text or options array` 
      });
    }
    
    if (question.options.length < 2) {
      return res.status(400).json({ 
        message: `Question ${i + 1}: Must have at least 2 options` 
      });
    }
    
    const correctAnswers = question.options.filter(opt => opt.isCorrect);
    if (correctAnswers.length === 0) {
      return res.status(400).json({ 
        message: `Question ${i + 1}: Must have at least one correct answer` 
      });
    }
  }
  
  if (timeLimit && (timeLimit < 1 || timeLimit > 300)) {
    return res.status(400).json({ 
      message: 'Time limit must be between 1 and 300 minutes' 
    });
  }
  
  next();
};

// @route   GET /api/quiz/course/:courseId
// @desc    Get all quizzes for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ 
      courseId: req.params.courseId, 
      isActive: true 
    }).select('-questions.options.isCorrect'); // Hide correct answers
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/quiz/:id
// @desc    Get a single quiz (without correct answers for students)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Remove correct answers for security
    const quizForStudent = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options.map(opt => ({ text: opt.text })),
        points: q.points
      }))
    };
    
    res.json(quizForStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', protect, async (req, res) => {
  try {
    const { quizId, answers, timeSpent, startedAt } = req.body;
    
    // Get the quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user has exceeded max attempts
    const previousAttempts = await QuizResult.countDocuments({
      userId: req.user._id,
      quizId: quizId
    });
    
    if (previousAttempts >= quiz.maxAttempts) {
      return res.status(400).json({ 
        message: `Maximum attempts (${quiz.maxAttempts}) exceeded for this quiz` 
      });
    }
    
    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const selectedOption = question.options[answer.selectedOption];
      const isCorrect = selectedOption && selectedOption.isCorrect;
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }
      
      return {
        questionId: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    });
    
    const totalPossiblePoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((totalPoints / totalPossiblePoints) * 100);
    const passed = percentage >= quiz.passingScore;
    
    // Save quiz result
    const quizResult = new QuizResult({
      userId: req.user._id,
      quizId: quizId,
      courseId: quiz.courseId,
      answers: processedAnswers,
      score: totalPoints,
      percentage,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent,
      passed,
      attemptNumber: previousAttempts + 1,
      startedAt: new Date(startedAt),
      completedAt: new Date()
    });
    
    await quizResult.save();
    
    res.status(201).json({
      message: 'Quiz submitted successfully',
      result: {
        score: totalPoints,
        percentage,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passed,
        attemptNumber: previousAttempts + 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/quiz/results/:userId
// @desc    Get quiz results for a user
// @access  Private
router.get('/results/:userId', protect, async (req, res) => {
  try {
    // Users can only view their own results, unless they're admin
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these results' });
    }
    
    const results = await QuizResult.find({ userId: req.params.userId })
      .populate('quizId', 'title description')
      .populate('courseId', 'title')
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/quiz
// @desc    Get all quizzes with filtering and pagination
// @access  Private/Instructor or Admin
router.get('/', protect, async (req, res) => {
  try {
    const { courseId, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Filter by course if specified
    if (courseId) {
      query.courseId = courseId;
    }
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // If user is instructor, only show their quizzes
    if (req.user.role === 'instructor') {
      query.createdBy = req.user._id;
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const quizzes = await Quiz.find(query)
      .populate('courseId', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
      
    const totalQuizzes = await Quiz.countDocuments(query);
    
    res.json({
      quizzes,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalQuizzes / limitNum),
        totalQuizzes,
        hasNext: pageNum < Math.ceil(totalQuizzes / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/quiz
// @desc    Create a new quiz
// @access  Private/Instructor or Admin
router.post('/', protect, validateQuiz, async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      questions,
      timeLimit,
      passingScore,
      maxAttempts,
      isActive
    } = req.body;
    
    // Check if quiz with same title exists for this course
    const existingQuiz = await Quiz.findOne({ title, courseId });
    if (existingQuiz) {
      return res.status(400).json({ 
        message: 'Quiz with this title already exists for this course' 
      });
    }
    
    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
    
    const quiz = new Quiz({
      title,
      description,
      courseId,
      questions: questions.map((q, index) => ({
        ...q,
        order: index + 1,
        points: q.points || 1
      })),
      timeLimit: timeLimit || 30,
      passingScore: passingScore || 70,
      maxAttempts: maxAttempts || 3,
      totalPoints,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });
    
    const createdQuiz = await quiz.save();
    
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: createdQuiz
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/quiz/:id
// @desc    Update a quiz
// @access  Private/Instructor or Admin
router.put('/:id', protect, validateQuiz, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }
    
    const {
      title,
      description,
      courseId,
      questions,
      timeLimit,
      passingScore,
      maxAttempts,
      isActive
    } = req.body;
    
    // Check if new title conflicts with existing quiz (excluding current one)
    if (title !== quiz.title || courseId !== quiz.courseId.toString()) {
      const existingQuiz = await Quiz.findOne({ 
        title, 
        courseId, 
        _id: { $ne: req.params.id } 
      });
      if (existingQuiz) {
        return res.status(400).json({ 
          message: 'Quiz with this title already exists for this course' 
        });
      }
    }
    
    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        courseId,
        questions: questions.map((q, index) => ({
          ...q,
          order: index + 1,
          points: q.points || 1
        })),
        timeLimit,
        passingScore,
        maxAttempts,
        totalPoints,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete a quiz
// @access  Private/Instructor or Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }
    
    // Check if quiz has been attempted by students
    const quizResults = await QuizResult.countDocuments({ quizId: req.params.id });
    if (quizResults > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete quiz that has been attempted by students. Consider deactivating it instead.' 
      });
    }
    
    await Quiz.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Quiz deleted successfully',
      deletedQuizId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/quiz/:id/toggle-status
// @desc    Toggle quiz active status
// @access  Private/Instructor or Admin
router.post('/:id/toggle-status', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this quiz' });
    }
    
    quiz.isActive = !quiz.isActive;
    await quiz.save();
    
    res.json({
      message: `Quiz ${quiz.isActive ? 'activated' : 'deactivated'} successfully`,
      quiz: { _id: quiz._id, title: quiz.title, isActive: quiz.isActive }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/quiz/:id/results
// @desc    Get all results for a quiz
// @access  Private/Instructor or Admin
router.get('/:id/results', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view quiz results' });
    }
    
    const results = await QuizResult.find({ quizId: req.params.id })
      .populate('userId', 'fullName email')
      .sort({ submittedAt: -1 });
    
    // Calculate statistics
    const totalAttempts = results.length;
    const passedAttempts = results.filter(r => r.passed).length;
    const averageScore = totalAttempts > 0 
      ? results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts 
      : 0;
    
    res.json({
      quiz: { _id: quiz._id, title: quiz.title, passingScore: quiz.passingScore },
      results,
      statistics: {
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
        averageScore: Math.round(averageScore * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
