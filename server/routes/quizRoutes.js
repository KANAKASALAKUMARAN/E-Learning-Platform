const express = require('express');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { protect, instructor, admin } = require('../middleware/authMiddleware');

const router = express.Router();

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

// @route   POST /api/quiz
// @desc    Create a new quiz (instructor/admin only)
// @access  Private/Instructor
router.post('/', protect, instructor, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
