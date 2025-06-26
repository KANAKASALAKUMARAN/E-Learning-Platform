const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testBasicOperations() {
  console.log('🔍 Testing basic server operations...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const serverResponse = await axios.get('http://localhost:5000/');
    console.log('✅ Server is running');
    console.log(`   Response: ${serverResponse.data}`);

    // Test 2: Test courses endpoint
    console.log('\n2. Testing GET /api/courses...');
    const coursesResponse = await axios.get(`${API_BASE}/courses`);
    console.log('✅ Courses endpoint working');
    console.log(`   Found ${coursesResponse.data.courses.length} courses`);

    // Test 3: Test user registration
    console.log('\n3. Testing POST /api/users/register...');
    const testUser = {
      fullName: 'Test User Basic',
      email: `test_basic_${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/users/register`, testUser);
    console.log('✅ User registration working');
    console.log(`   User ID: ${registerResponse.data._id}`);
    console.log(`   Role: ${registerResponse.data.role}`);

    // Test 4: Test admin creation
    console.log('\n4. Testing POST /api/users/create-admin...');
    const adminUser = {
      fullName: 'Admin User Basic',
      email: `admin_basic_${Date.now()}@example.com`,
      password: 'admin123'
    };
    
    try {
      const adminResponse = await axios.post(`${API_BASE}/users/create-admin`, adminUser);
      console.log('✅ Admin creation working');
      console.log(`   Admin ID: ${adminResponse.data._id}`);
      console.log(`   Role: ${adminResponse.data.role}`);
    } catch (error) {
      console.log('❌ Admin creation failed');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data || error.message}`);
    }

    console.log('\n🎉 Basic operations test completed!');

  } catch (error) {
    console.error('❌ Basic operations test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('🔥 Server is not running. Please start the server first.');
    }
  }
}

testBasicOperations();
