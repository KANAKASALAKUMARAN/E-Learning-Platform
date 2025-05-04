const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate JWT token function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      enrolledCourses: [],
      completedLessons: [],
      achievements: []
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request received:', { email, password });

    // Check if user exists
    const user = await User.findOne({ email });
    console.log('User found:', user ? user.email : 'No user found');
    
    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    console.log(`Password match for ${email}: ${isMatch ? 'Success' : 'Failed'}`);
    
    if (isMatch) {
      // Create token
      const token = generateToken(user._id);
      console.log(`Login successful for user: ${email}`);
      
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: token
      });
    } else {
      console.log(`Login failed: Invalid password for user ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      
      // Only update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      user.updatedAt = Date.now();
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    user.enrolledCourses.push(courseId);
    user.updatedAt = Date.now();
    
    await user.save();
    
    res.status(200).json({ message: 'Successfully enrolled in course', enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/complete-lesson
// @desc    Mark a lesson as completed
// @access  Private
router.post('/complete-lesson', protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if lesson already completed
    const lessonCompleted = user.completedLessons.some(
      lesson => lesson.courseId.toString() === courseId && lesson.lessonId.toString() === lessonId
    );
    
    if (lessonCompleted) {
      return res.status(400).json({ message: 'Lesson already marked as completed' });
    }
    
    user.completedLessons.push({
      courseId,
      lessonId,
      completedAt: Date.now()
    });
    
    user.updatedAt = Date.now();
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Lesson marked as completed', 
      completedLessons: user.completedLessons 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;