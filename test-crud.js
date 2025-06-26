const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCRUD() {
  console.log('🚀 Testing CRUD functionality...\n');

  try {
    // Test 1: Get all courses
    console.log('1. Testing GET /api/courses');
    const coursesResponse = await axios.get(`${API_BASE}/courses`);
    console.log(`✅ GET courses: ${coursesResponse.data.courses.length} courses found`);
    console.log(`   Total: ${coursesResponse.data.total}, Page: ${coursesResponse.data.page}/${coursesResponse.data.pages}\n`);

    // Test 2: Test user registration
    console.log('2. Testing POST /api/users/register');
    const testUser = {
      fullName: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/users/register`, testUser);
    console.log('✅ User registration successful');
    console.log(`   User ID: ${registerResponse.data._id}`);
    console.log(`   Token received: ${registerResponse.data.token ? 'Yes' : 'No'}\n`);

    const authToken = registerResponse.data.token;
    const userId = registerResponse.data._id;

    // Test 3: Test creating a course (requires authentication)
    console.log('3. Testing POST /api/courses (Create Course)');
    const newCourse = {
      title: 'Test Course CRUD',
      description: 'This is a test course for CRUD operations',
      category: 'Technology',
      price: 99.99,
      level: 'Beginner',
      duration: '5 hours',
      lessons: [
        {
          title: 'Introduction',
          content: 'Welcome to the course',
          duration: 30,
          videoUrl: 'https://example.com/video1'
        }
      ]
    };

    try {
      const createCourseResponse = await axios.post(`${API_BASE}/courses`, newCourse, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Course creation successful');
      console.log(`   Course ID: ${createCourseResponse.data._id}`);
      console.log(`   Title: ${createCourseResponse.data.title}\n`);

      const courseId = createCourseResponse.data._id;

      // Test 4: Update the course
      console.log('4. Testing PUT /api/courses/:id (Update Course)');
      const updateData = {
        title: 'Updated Test Course CRUD',
        description: 'This course has been updated via CRUD testing',
        price: 149.99
      };

      const updateResponse = await axios.put(`${API_BASE}/courses/${courseId}`, updateData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Course update successful');
      console.log(`   New title: ${updateResponse.data.title}`);
      console.log(`   New price: $${updateResponse.data.price}\n`);

      // Test 5: Get the specific course
      console.log('5. Testing GET /api/courses/:id (Read Course)');
      const getCourseResponse = await axios.get(`${API_BASE}/courses/${courseId}`);
      console.log('✅ Course retrieval successful');
      console.log(`   Title: ${getCourseResponse.data.title}`);
      console.log(`   Instructor: ${getCourseResponse.data.instructor?.fullName || 'N/A'}\n`);

      // Test 6: Delete the course
      console.log('6. Testing DELETE /api/courses/:id (Delete Course)');
      const deleteResponse = await axios.delete(`${API_BASE}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Course deletion successful');
      console.log(`   Message: ${deleteResponse.data.message}\n`);

    } catch (courseErr) {
      console.log('❌ Course operations require instructor/admin role');
      console.log(`   Error: ${courseErr.response?.data?.message || courseErr.message}\n`);
    }

    // Test 7: Test quiz CRUD
    console.log('7. Testing Quiz CRUD operations');
    try {
      // Get all quizzes
      const quizzesResponse = await axios.get(`${API_BASE}/quiz`);
      console.log(`✅ GET quizzes: ${quizzesResponse.data.quizzes.length} quizzes found\n`);
    } catch (quizErr) {
      console.log('❌ Quiz retrieval failed');
      console.log(`   Error: ${quizErr.response?.data?.message || quizErr.message}\n`);
    }

    // Test 8: Test user profile operations
    console.log('8. Testing User Profile operations');
    try {
      const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ User profile retrieval successful');
      console.log(`   Name: ${profileResponse.data.fullName}`);
      console.log(`   Email: ${profileResponse.data.email}`);
      console.log(`   Role: ${profileResponse.data.role}\n`);

      // Update user profile
      const updateProfile = {
        fullName: 'Updated Test User'
      };
      const updateProfileResponse = await axios.put(`${API_BASE}/users/${userId}`, updateProfile, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ User profile update successful');
      console.log(`   New name: ${updateProfileResponse.data.fullName}\n`);

    } catch (userErr) {
      console.log('❌ User profile operations failed');
      console.log(`   Error: ${userErr.response?.data?.message || userErr.message}\n`);
    }

    console.log('🎉 CRUD testing completed!');

  } catch (error) {
    console.error('❌ CRUD testing failed:', error.response?.data || error.message);
  }
}

// Run the test
testCRUD();
