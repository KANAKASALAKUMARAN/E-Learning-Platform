const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
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
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    let query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find(query)
      .select('-password')
      .populate('enrolledCourses', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
      
    const totalUsers = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalUsers / limitNum),
        totalUsers,
        hasNext: pageNum < Math.ceil(totalUsers / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own profile)
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is accessing own profile or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this user profile' });
    }
    
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title category instructor price')
      .populate('completedLessons.courseId', 'title');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Admin or own profile)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is updating own profile or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user profile' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { fullName, email, role, profilePicture, bio, skills } = req.body;
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Only admin can change roles
    const updateData = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      profilePicture: profilePicture || user.profilePicture,
      bio: bio || user.bio,
      skills: skills || user.skills,
      updatedAt: Date.now()
    };
    
    if (req.user.role === 'admin' && role) {
      updateData.role = role;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'User profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user account
// @access  Private (Admin or own account)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is deleting own account or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user account' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deletion of the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin account' });
      }
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'User account deleted successfully',
      deletedUserId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/:id/enroll/:courseId
// @desc    Enroll user in a course
// @access  Private
router.post('/:id/enroll/:courseId', protect, async (req, res) => {
  try {
    // Check if user is enrolling themselves or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to enroll this user' });
    }
    
    const user = await User.findById(req.params.id);
    const course = await Course.findById(req.params.courseId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    if (user.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }
    
    user.enrolledCourses.push(req.params.courseId);
    await user.save();
    
    res.json({
      message: 'Successfully enrolled in course',
      courseTitle: course.title
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/users/:id/unenroll/:courseId
// @desc    Unenroll user from a course
// @access  Private
router.delete('/:id/unenroll/:courseId', protect, async (req, res) => {
  try {
    // Check if user is unenrolling themselves or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to unenroll this user' });
    }
    
    const user = await User.findById(req.params.id);
    const course = await Course.findById(req.params.courseId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if enrolled
    if (!user.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({ message: 'User not enrolled in this course' });
    }
    
    user.enrolledCourses.pull(req.params.courseId);
    // Also remove completed lessons for this course
    user.completedLessons = user.completedLessons.filter(
      lesson => lesson.courseId.toString() !== req.params.courseId
    );
    
    await user.save();
    
    res.json({
      message: 'Successfully unenrolled from course',
      courseTitle: course.title
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id/progress/:courseId
// @desc    Get user's progress in a specific course
// @access  Private
router.get('/:id/progress/:courseId', protect, async (req, res) => {
  try {
    // Check if user is accessing own progress or is admin/instructor
    if (req.user._id.toString() !== req.params.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Not authorized to view this progress' });
    }
    
    const user = await User.findById(req.params.id)
      .populate('completedLessons.courseId', 'title')
      .populate('completedLessons.lessonId', 'title duration');
    
    const course = await Course.findById(req.params.courseId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const completedLessonsInCourse = user.completedLessons.filter(
      lesson => lesson.courseId._id.toString() === req.params.courseId
    );
    
    const totalLessons = course.lessons.length;
    const completedCount = completedLessonsInCourse.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    
    res.json({
      courseTitle: course.title,
      totalLessons,
      completedLessons: completedCount,
      progressPercentage,
      completedLessonDetails: completedLessonsInCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/create-admin
// @desc    Create admin user (for development/setup)
// @access  Public (should be protected in production)
router.post('/create-admin', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new admin user
    const user = await User.create({
      fullName,
      email,
      password,
      role: 'admin', // Set role as admin
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

// @route   POST /api/users/create-instructor
// @desc    Create instructor user (for development/setup)
// @access  Public (should be protected in production)
router.post('/create-instructor', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new instructor user
    const user = await User.create({
      fullName,
      email,
      password,
      role: 'instructor', // Set role as instructor
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

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put('/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['student', 'instructor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be student, instructor, or admin' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Simple admin creation route for testing
router.post('/create-test-admin', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await User.create({
      fullName,
      email,
      password,
      role: 'admin'
    });
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;