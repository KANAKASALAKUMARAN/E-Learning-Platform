const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/progress/:userId
// @desc    Get comprehensive progress data for a user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    // Users can only view their own progress, unless they're admin
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this progress' });
    }
    
    const user = await User.findById(req.params.userId)
      .populate('enrolledCourses')
      .populate('completedLessons.courseId', 'title');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get quiz results for the user
    const quizResults = await QuizResult.find({ userId: req.params.userId })
      .populate('quizId', 'title')
      .populate('courseId', 'title');
    
    // Calculate progress for each enrolled course
    const courseProgress = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const completedLessonsForCourse = user.completedLessons.filter(
          cl => cl.courseId.toString() === course._id.toString()
        );
        
        const quizResultsForCourse = quizResults.filter(
          qr => qr.courseId._id.toString() === course._id.toString()
        );
        
        const totalLessons = course.lessons ? course.lessons.length : 0;
        const completedLessons = completedLessonsForCourse.length;
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        return {
          courseId: course._id,
          courseTitle: course.title,
          totalLessons,
          completedLessons,
          progressPercentage,
          quizResults: quizResultsForCourse.map(qr => ({
            quizId: qr.quizId._id,
            quizTitle: qr.quizId.title,
            score: qr.score,
            percentage: qr.percentage,
            passed: qr.passed,
            attemptNumber: qr.attemptNumber,
            completedAt: qr.completedAt
          }))
        };
      })
    );
    
    // Calculate overall statistics
    const totalEnrolledCourses = user.enrolledCourses.length;
    const totalCompletedLessons = user.completedLessons.length;
    const totalQuizzesTaken = quizResults.length;
    const totalQuizzesPassed = quizResults.filter(qr => qr.passed).length;
    
    const overallProgress = {
      totalEnrolledCourses,
      totalCompletedLessons,
      totalQuizzesTaken,
      totalQuizzesPassed,
      averageQuizScore: quizResults.length > 0 
        ? Math.round(quizResults.reduce((sum, qr) => sum + qr.percentage, 0) / quizResults.length)
        : 0
    };
    
    res.json({
      userId: user._id,
      userName: user.fullName,
      overallProgress,
      courseProgress,
      achievements: user.achievements,
      recentActivity: {
        recentLessons: user.completedLessons
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 5),
        recentQuizzes: quizResults
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/progress/update
// @desc    Update user progress (mark lesson as completed)
// @access  Private
router.post('/update', protect, async (req, res) => {
  try {
    const { courseId, lessonId, action } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (action === 'complete_lesson') {
      // Check if lesson is already completed
      const alreadyCompleted = user.completedLessons.some(
        cl => cl.courseId.toString() === courseId && cl.lessonId.toString() === lessonId
      );
      
      if (!alreadyCompleted) {
        user.completedLessons.push({
          courseId,
          lessonId,
          completedAt: new Date()
        });
        
        user.updatedAt = Date.now();
        await user.save();
        
        // Check if this completion unlocks any achievements
        const achievements = await checkForAchievements(user);
        
        res.json({
          message: 'Lesson marked as completed',
          completedLessons: user.completedLessons,
          newAchievements: achievements
        });
      } else {
        res.json({
          message: 'Lesson already completed',
          completedLessons: user.completedLessons
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to check for achievements
async function checkForAchievements(user) {
  const newAchievements = [];
  
  // First lesson completed
  if (user.completedLessons.length === 1) {
    const achievement = {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Completed your first lesson!',
      earnedAt: new Date()
    };
    
    user.achievements.push(achievement);
    newAchievements.push(achievement);
  }
  
  // 10 lessons completed
  if (user.completedLessons.length === 10) {
    const achievement = {
      id: 'ten_lessons',
      title: 'Learning Momentum',
      description: 'Completed 10 lessons!',
      earnedAt: new Date()
    };
    
    user.achievements.push(achievement);
    newAchievements.push(achievement);
  }
  
  // First course enrollment
  if (user.enrolledCourses.length === 1 && !user.achievements.some(a => a.id === 'first_enrollment')) {
    const achievement = {
      id: 'first_enrollment',
      title: 'Learning Journey Begins',
      description: 'Enrolled in your first course!',
      earnedAt: new Date()
    };
    
    user.achievements.push(achievement);
    newAchievements.push(achievement);
  }
  
  if (newAchievements.length > 0) {
    await user.save();
  }
  
  return newAchievements;
}

module.exports = router;
