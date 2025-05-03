const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default: null
  },
  content: {
    type: String,
    default: null
  },
  resourcesUrl: [String],
  order: {
    type: Number,
    required: true
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  instructor: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    }
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: null
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  lessons: [LessonSchema],
  students: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);