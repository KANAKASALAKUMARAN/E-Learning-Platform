const express = require('express');
const Course = require('../models/Course');
const { protect, instructor, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const validateCourse = (req, res, next) => {
  const { title, description, category, price, level } = req.body;
  
  if (!title || !description || !category || !price || !level) {
    return res.status(400).json({ 
      message: 'Missing required fields: title, description, category, price, and level are required' 
    });
  }
  
  if (price < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }
  
  const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ 
      message: 'Invalid level. Must be Beginner, Intermediate, or Advanced' 
    });
  }
  
  next();
};

// @route   GET /api/courses
// @desc    Get all courses with advanced filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      level, 
      search, 
      minPrice, 
      maxPrice, 
      rating,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const courses = await Course.find(query)
      .select('-lessons')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);
      
    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limitNum);
    
    res.json({
      courses,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCourses,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
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
// @access  Private/Instructor or Admin
router.post('/', protect, validateCourse, async (req, res) => {
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
      lessons = [],
      tags = []
    } = req.body;
    
    // Check if course with same title already exists
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this title already exists' });
    }
    
    const course = new Course({
      title,
      description,
      category,
      image: image || 'https://streamline-learning.com/wp-content/uploads/2024/10/online-courses-1024x537.png',
      instructor: {
        name: req.user.fullName,
        image: req.body.instructorImage || null
      },
      price,
      originalPrice: originalPrice || price,
      level,
      duration,
      tags,
      lessons: lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      })),
      createdBy: req.user._id
    });
    
    const createdCourse = await course.save();
    res.status(201).json({
      message: 'Course created successfully',
      course: createdCourse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Instructor or Admin
router.put('/:id', protect, validateCourse, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to update this course
    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    const {
      title,
      description,
      category,
      image,
      price,
      originalPrice,
      level,
      duration,
      lessons,
      tags
    } = req.body;
    
    // Check if new title conflicts with existing course (excluding current one)
    if (title !== course.title) {
      const existingCourse = await Course.findOne({ title, _id: { $ne: req.params.id } });
      if (existingCourse) {
        return res.status(400).json({ message: 'Course with this title already exists' });
      }
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        image,
        price,
        originalPrice,
        level,
        duration,
        tags,
        lessons: lessons ? lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        })) : course.lessons,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Instructor or Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to delete this course
    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Course deleted successfully',
      deletedCourseId: req.params.id
    });
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

// @route   GET /api/courses/category/:category
// @desc    Get courses by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const courses = await Course.find({ category })
      .select('-lessons')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
      
    const totalCourses = await Course.countDocuments({ category });
    
    res.json({
      courses,
      totalCourses,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCourses / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/courses/:id/lessons
// @desc    Get all lessons for a specific course
// @access  Public (or Private if you want to restrict)
router.get('/:id/lessons', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('lessons title');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({
      courseTitle: course.title,
      lessons: course.lessons.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/courses/:id/lessons
// @desc    Add a lesson to a course
// @access  Private/Instructor or Admin
router.post('/:id/lessons', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }
    
    const { title, description, duration, videoUrl, content, resourcesUrl } = req.body;
    
    if (!title || !description || !duration) {
      return res.status(400).json({ message: 'Title, description, and duration are required' });
    }
    
    const newLesson = {
      title,
      description,
      duration,
      videoUrl,
      content,
      resourcesUrl: resourcesUrl || [],
      order: course.lessons.length + 1
    };
    
    course.lessons.push(newLesson);
    await course.save();
    
    res.status(201).json({
      message: 'Lesson added successfully',
      lesson: newLesson
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/courses/:courseId/lessons/:lessonId
// @desc    Update a specific lesson
// @access  Private/Instructor or Admin
router.put('/:courseId/lessons/:lessonId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update lessons in this course' });
    }
    
    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const { title, description, duration, videoUrl, content, resourcesUrl } = req.body;
    
    lesson.title = title || lesson.title;
    lesson.description = description || lesson.description;
    lesson.duration = duration || lesson.duration;
    lesson.videoUrl = videoUrl || lesson.videoUrl;
    lesson.content = content || lesson.content;
    lesson.resourcesUrl = resourcesUrl || lesson.resourcesUrl;
    
    await course.save();
    
    res.json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/courses/:courseId/lessons/:lessonId
// @desc    Delete a specific lesson
// @access  Private/Instructor or Admin
router.delete('/:courseId/lessons/:lessonId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete lessons from this course' });
    }
    
    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    course.lessons.pull({ _id: req.params.lessonId });
    await course.save();
    
    res.json({
      message: 'Lesson deleted successfully',
      deletedLessonId: req.params.lessonId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;