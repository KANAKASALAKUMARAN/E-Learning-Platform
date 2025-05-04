/**
 * Script to create MongoDB user with appropriate permissions
 * 
 * To use:
 * 1. Start MongoDB: mongod
 * 2. Run: node setupMongoDB.js
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function setupMongoDB() {
  console.log('Starting MongoDB user setup...');
  
  const uri = 'mongodb://localhost:27017/admin';
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');
    
    const adminDb = client.db('admin');
    const dbName = process.env.MONGODB_DATABASE || 'elearningdb';
    const username = process.env.MONGODB_USER || 'elearning_user';
    const password = process.env.MONGODB_PASSWORD || 'your_secure_password';
    
    // Create database if it doesn't exist
    const db = client.db(dbName);
    await db.collection('init').insertOne({ init: true });
    console.log(`Created database: ${dbName}`);
    
    // Check if user already exists and delete if it does
    const users = await adminDb.command({ usersInfo: { user: username, db: 'admin' } });
    if (users.users.length > 0) {
      console.log(`User ${username} already exists, removing...`);
      await adminDb.removeUser(username);
      console.log(`Removed existing user: ${username}`);
    }
    
    // Create the user with appropriate permissions
    await adminDb.addUser(username, password, {
      roles: [
        { role: 'readWrite', db: dbName },
        { role: 'dbAdmin', db: dbName }
      ]
    });
    
    console.log(`✅ User ${username} created successfully with readWrite and dbAdmin roles on ${dbName}`);
    console.log('MongoDB setup completed successfully!');
    
    // Cleanup
    await db.collection('init').deleteOne({ init: true });
    
  } catch (err) {
    console.error('❌ Error setting up MongoDB:', err);
    console.log('\nPossible solutions:');
    console.log('1. Make sure MongoDB is running with --auth disabled for initial setup');
    console.log('2. If using MongoDB Atlas, you need to create users through their interface');
    console.log('3. Check if you have proper permissions to create users');
  } finally {
    await client.close();
  }
}

setupMongoDB().catch(console.error);