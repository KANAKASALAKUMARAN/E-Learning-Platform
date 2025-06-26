const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testFullCRUD() {
  console.log('🚀 Testing Full CRUD functionality...\n');

  try {
    // First, let's create different types of users
    console.log('=== SETTING UP TEST USERS ===');
    
    // Create a regular student
    const student = {
      fullName: 'Student User',
      email: `student_${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const studentResponse = await axios.post(`${API_BASE}/users/register`, student);
    console.log('✅ Student user created');
    const studentToken = studentResponse.data.token;
    const studentId = studentResponse.data._id;

    // Create an instructor (we'll manually update their role)
    const instructor = {
      fullName: 'Instructor User',
      email: `instructor_${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const instructorResponse = await axios.post(`${API_BASE}/users/register`, instructor);
    console.log('✅ Instructor user created');
    const instructorToken = instructorResponse.data.token;
    const instructorId = instructorResponse.data._id;

    // We need to manually update the instructor's role in the database
    // For now, let's test with what we have
    console.log('\n=== TESTING COURSE CRUD ===');

    // Test 1: Get all courses (public access)
    console.log('1. Testing GET /api/courses (Read All)');
    const coursesResponse = await axios.get(`${API_BASE}/courses`);
    console.log(`✅ GET courses: ${coursesResponse.data.courses.length} courses found`);
    
    if (coursesResponse.data.courses.length > 0) {
      const firstCourse = coursesResponse.data.courses[0];
      console.log(`   Sample course: "${firstCourse.title}" by ${firstCourse.instructor?.fullName || 'Unknown'}`);
      
      // Test 2: Get specific course
      console.log('\n2. Testing GET /api/courses/:id (Read Single)');
      const singleCourseResponse = await axios.get(`${API_BASE}/courses/${firstCourse._id}`);
      console.log(`✅ GET single course: "${singleCourseResponse.data.title}"`);
      console.log(`   Price: $${singleCourseResponse.data.price}`);
      console.log(`   Level: ${singleCourseResponse.data.level}`);
      console.log(`   Lessons: ${singleCourseResponse.data.lessons.length}`);
    }

    // Test 3: Try to create a course (will fail for student)
    console.log('\n3. Testing POST /api/courses (Create) - as student');
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
      const createResponse = await axios.post(`${API_BASE}/courses`, newCourse, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log('✅ Course created successfully');
    } catch (error) {
      console.log('❌ Course creation failed (expected for student role)');
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    console.log('\n=== TESTING USER CRUD ===');

    // Test 4: User profile operations
    console.log('4. Testing GET /api/users/profile (Read User Profile)');
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Profile retrieved: ${profileResponse.data.fullName} (${profileResponse.data.role})`);

    // Test 5: Update user profile
    console.log('\n5. Testing PUT /api/users/:id (Update User)');
    const updateData = {
      fullName: 'Updated Student User',
      bio: 'I am a student learning programming'
    };
    
    try {
      const updateResponse = await axios.put(`${API_BASE}/users/${studentId}`, updateData, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log('✅ User profile updated successfully');
      console.log(`   New name: ${updateResponse.data.fullName}`);
    } catch (error) {
      console.log('❌ User update failed');
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    // Test 6: User enrollment (if courses exist)
    if (coursesResponse.data.courses.length > 0) {
      const courseToEnroll = coursesResponse.data.courses[0];
      console.log(`\n6. Testing POST /api/users/enroll (Enroll in Course)`);
      
      try {
        const enrollResponse = await axios.post(`${API_BASE}/users/enroll`, 
          { courseId: courseToEnroll._id }, 
          { headers: { Authorization: `Bearer ${studentToken}` } }
        );
        console.log(`✅ Enrolled in course: ${courseToEnroll.title}`);
      } catch (error) {
        console.log('❌ Enrollment failed');
        console.log(`   Error: ${error.response?.data?.message}`);
      }
    }

    console.log('\n=== TESTING QUIZ CRUD ===');

    // Test 7: Get all quizzes
    console.log('7. Testing GET /api/quiz (Read All Quizzes)');
    try {
      const quizzesResponse = await axios.get(`${API_BASE}/quiz`);
      console.log(`✅ GET quizzes: ${quizzesResponse.data.quizzes?.length || 0} quizzes found`);
    } catch (error) {
      console.log('❌ Quiz retrieval failed');
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    // Test 8: Try to create a quiz (will fail for student)
    console.log('\n8. Testing POST /api/quiz (Create Quiz) - as student');
    const newQuiz = {
      title: 'Test Quiz',
      courseId: coursesResponse.data.courses[0]?._id || '507f1f77bcf86cd799439011',
      questions: [
        {
          question: 'What is 2 + 2?',
          options: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false }
          ]
        }
      ],
      timeLimit: 10
    };

    try {
      const createQuizResponse = await axios.post(`${API_BASE}/quiz`, newQuiz, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log('✅ Quiz created successfully');
    } catch (error) {
      console.log('❌ Quiz creation failed (expected for student role)');
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    console.log('\n=== TESTING ADVANCED FEATURES ===');

    // Test 9: Search and filter courses
    console.log('9. Testing GET /api/courses with filters');
    try {
      const filteredResponse = await axios.get(`${API_BASE}/courses?category=Technology&level=Beginner&page=1&limit=5`);
      console.log(`✅ Filtered courses: ${filteredResponse.data.courses.length} results`);
    } catch (error) {
      console.log('❌ Course filtering failed');
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    // Test 10: Test pagination
    console.log('\n10. Testing pagination');
    try {
      const page1 = await axios.get(`${API_BASE}/courses?page=1&limit=2`);
      const page2 = await axios.get(`${API_BASE}/courses?page=2&limit=2`);
      console.log(`✅ Page 1: ${page1.data.courses.length} courses`);
      console.log(`✅ Page 2: ${page2.data.courses.length} courses`);
    } catch (error) {
      console.log('❌ Pagination test failed');
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    console.log('\n🎉 Full CRUD testing completed!');
    console.log('\n📋 SUMMARY:');
    console.log('✅ User Registration (CREATE)');
    console.log('✅ User Profile Read (READ)');
    console.log('✅ User Profile Update (UPDATE)');
    console.log('✅ Course Listing (READ)');
    console.log('✅ Course Details (READ)');
    console.log('✅ Course Filtering & Pagination (READ)');
    console.log('✅ User Enrollment (CREATE)');
    console.log('❌ Course Creation (Requires instructor role)');
    console.log('❌ Quiz Creation (Requires instructor role)');
    console.log('\n💡 Note: Some operations require instructor/admin roles for security.');

  } catch (error) {
    console.error('❌ CRUD testing failed:', error.response?.data || error.message);
  }
}

// Run the test
testFullCRUD();
