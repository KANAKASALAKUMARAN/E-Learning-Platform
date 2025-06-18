const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize express app
const app = express();

// Enhanced CORS settings
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow React development server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON request body
app.use(express.json());

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Get MongoDB URI from environment variable or use hardcoded connection string as fallback
const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/elearning?authSource=admin';

console.log(`Attempting to connect to MongoDB with authentication...`);

mongoose.connect(MONGODB_URI, mongoOptions)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('\nIf you are trying to connect to a local MongoDB instance, make sure MongoDB is installed and running.');
    console.log('Make sure MongoDB is installed and the service is running.');
    console.log('\nOr update your .env file with your MongoDB Atlas connection string.');
    console.log('Example: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/elearningdb\n');
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('E-Learning Platform API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});