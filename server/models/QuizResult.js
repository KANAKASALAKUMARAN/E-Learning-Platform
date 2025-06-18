const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: Number, // index of selected option
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  points: {
    type: Number,
    default: 0
  }
});

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: null
  },
  passed: {
    type: Boolean,
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
QuizResultSchema.index({ userId: 1, quizId: 1 });
QuizResultSchema.index({ courseId: 1 });

module.exports = mongoose.model('QuizResult', QuizResultSchema);
