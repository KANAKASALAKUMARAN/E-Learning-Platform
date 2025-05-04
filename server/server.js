const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  authSource: 'admin' // Specify auth database (usually 'admin')
};

// Connect to MongoDB
// Use either environment variables for username/password or connect to local DB with no auth
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost:27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'elearningdb';

// Construct the connection string based on whether credentials are provided
let MONGODB_URI;
if (MONGODB_USER && MONGODB_PASSWORD) {
  MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}`;
} else {
  // Fallback to unauthenticated local connection
  MONGODB_URI = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`;
}

console.log(`Attempting to connect to MongoDB at ${MONGODB_HOST}/${MONGODB_DATABASE}`);

mongoose.connect(MONGODB_URI, mongoOptions)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('\nIf you are trying to connect to a local MongoDB instance, make sure MongoDB is installed and running.');
    console.log('You may need to create a user with appropriate permissions:');
    console.log('1. Connect to MongoDB shell: mongosh');
    console.log('2. Switch to admin database: use admin');
    console.log('3. Create a user: db.createUser({user: "elearning_user", pwd: "password", roles: [{role: "readWrite", db: "elearningdb"}]})');
    console.log('\nOr update your .env file with your MongoDB Atlas connection string.');
    console.log('Example: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/elearningdb\n');
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

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