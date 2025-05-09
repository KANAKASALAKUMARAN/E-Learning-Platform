const mongoose = require('mongoose');

// Your exact connection string
const uri = 'mongodb://admin:admin123@localhost:27017/admin?authSource=admin';

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Connection string works!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
