const express = require('express');
const Course = require('../models/Course');
const { protect, instructor, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(query).select('-lessons');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a single course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private/Instructor
router.post('/', protect, instructor, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image,
      price,
      originalPrice,
      level,
      duration,
      lessons = []
    } = req.body;
    
    const course = new Course({
      title,
      description,
      category,
      image,
      instructor: {
        name: req.user.fullName,
        image: req.body.instructorImage || null
      },
      price,
      originalPrice,
      level,
      duration,
      lessons: lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }))
    });
    
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Instructor
router.put('/:id', protect, instructor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if the user is the course instructor or an admin
    if (course.instructor.name !== req.user.fullName && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update course fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'instructor' && key !== 'lessons') {
        course[key] = req.body[key];
      }
    });
    
    // Handle lessons update if provided
    if (req.body.lessons) {
      course.lessons = req.body.lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }));
    }
    
    course.updatedAt = Date.now();
    
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Instructor
router.delete('/:id', protect, instructor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if the user is the course instructor or an admin
    if (course.instructor.name !== req.user.fullName && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/courses/categories
// @desc    Get all course categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;