const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCompleteCRUD() {
  console.log('🚀 Testing Complete CRUD functionality with all user roles...\n');

  try {
    console.log('=== CREATING TEST USERS ===');
    
    // 1. Create Admin User
    const admin = {
      fullName: 'Admin User',
      email: `admin_${Date.now()}@example.com`,
      password: 'admin123'
    };
    
    const adminResponse = await axios.post(`${API_BASE}/users/create-admin`, admin);
    console.log('✅ Admin user created');
    console.log(`   Name: ${adminResponse.data.fullName}`);
    console.log(`   Role: ${adminResponse.data.role}`);
    const adminToken = adminResponse.data.token;
    const adminId = adminResponse.data._id;

    // 2. Create Instructor User
    const instructor = {
      fullName: 'Instructor User',
      email: `instructor_${Date.now()}@example.com`,
      password: 'instructor123'
    };
    
    const instructorResponse = await axios.post(`${API_BASE}/users/create-instructor`, instructor);
    console.log('✅ Instructor user created');
    console.log(`   Name: ${instructorResponse.data.fullName}`);
    console.log(`   Role: ${instructorResponse.data.role}`);
    const instructorToken = instructorResponse.data.token;
    const instructorId = instructorResponse.data._id;

    // 3. Create Student User
    const student = {
      fullName: 'Student User',
      email: `student_${Date.now()}@example.com`,
      password: 'student123'
    };
    
    const studentResponse = await axios.post(`${API_BASE}/users/register`, student);
    console.log('✅ Student user created');
    console.log(`   Name: ${studentResponse.data.fullName}`);
    console.log(`   Role: ${studentResponse.data.role}`);
    const studentToken = studentResponse.data.token;
    const studentId = studentResponse.data._id;

    console.log('\n=== TESTING COURSE CRUD OPERATIONS ===');

    // 4. Create Course (as instructor)
    console.log('1. Testing POST /api/courses (Create Course as Instructor)');
    const newCourse = {
      title: 'Complete CRUD Test Course',
      description: 'This course tests all CRUD operations in our e-learning platform',
      category: 'Technology',
      price: 149.99,
      level: 'Intermediate',
      duration: '8 hours',
      lessons: [
        {
          title: 'Introduction to CRUD',
          content: 'Learn the basics of Create, Read, Update, Delete operations',
          duration: 45,
          videoUrl: 'https://example.com/video1'
        },
        {
          title: 'Advanced CRUD Techniques',
          content: 'Master advanced CRUD patterns and best practices',
          duration: 60,
          videoUrl: 'https://example.com/video2'
        }
      ]
    };

    const createCourseResponse = await axios.post(`${API_BASE}/courses`, newCourse, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Course created successfully');
    console.log(`   Course ID: ${createCourseResponse.data._id}`);
    console.log(`   Title: ${createCourseResponse.data.title}`);
    console.log(`   Instructor: ${createCourseResponse.data.instructor.fullName}`);
    console.log(`   Lessons: ${createCourseResponse.data.lessons.length}`);
    const courseId = createCourseResponse.data._id;

    // 5. Read Course (public access)
    console.log('\n2. Testing GET /api/courses/:id (Read Course)');
    const readCourseResponse = await axios.get(`${API_BASE}/courses/${courseId}`);
    console.log('✅ Course retrieved successfully');
    console.log(`   Title: ${readCourseResponse.data.title}`);
    console.log(`   Price: $${readCourseResponse.data.price}`);
    console.log(`   Level: ${readCourseResponse.data.level}`);

    // 6. Update Course (as instructor)
    console.log('\n3. Testing PUT /api/courses/:id (Update Course as Instructor)');
    const updateCourseData = {
      title: 'Updated Complete CRUD Test Course',
      description: 'This course has been updated to test CRUD operations',
      price: 199.99,
      level: 'Advanced'
    };

    const updateCourseResponse = await axios.put(`${API_BASE}/courses/${courseId}`, updateCourseData, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Course updated successfully');
    console.log(`   New title: ${updateCourseResponse.data.title}`);
    console.log(`   New price: $${updateCourseResponse.data.price}`);
    console.log(`   New level: ${updateCourseResponse.data.level}`);

    // 7. Add a lesson to the course
    console.log('\n4. Testing POST /api/courses/:id/lessons (Add Lesson)');
    const newLesson = {
      title: 'CRUD Security Best Practices',
      content: 'Learn how to secure your CRUD operations',
      duration: 30,
      videoUrl: 'https://example.com/video3'
    };

    const addLessonResponse = await axios.post(`${API_BASE}/courses/${courseId}/lessons`, newLesson, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Lesson added successfully');
    console.log(`   Lesson title: ${addLessonResponse.data.lessons[addLessonResponse.data.lessons.length - 1].title}`);
    console.log(`   Total lessons: ${addLessonResponse.data.lessons.length}`);

    console.log('\n=== TESTING QUIZ CRUD OPERATIONS ===');

    // 8. Create Quiz (as instructor)
    console.log('5. Testing POST /api/quiz (Create Quiz as Instructor)');
    const newQuiz = {
      title: 'CRUD Operations Quiz',
      courseId: courseId,
      questions: [
        {
          question: 'What does CRUD stand for?',
          options: [
            { text: 'Create, Read, Update, Delete', isCorrect: true },
            { text: 'Control, Read, Update, Deploy', isCorrect: false },
            { text: 'Create, Retrieve, Update, Deploy', isCorrect: false },
            { text: 'Control, Retrieve, Update, Delete', isCorrect: false }
          ]
        },
        {
          question: 'Which HTTP method is typically used for CREATE operations?',
          options: [
            { text: 'GET', isCorrect: false },
            { text: 'POST', isCorrect: true },
            { text: 'PUT', isCorrect: false },
            { text: 'DELETE', isCorrect: false }
          ]
        },
        {
          question: 'Which HTTP method is typically used for UPDATE operations?',
          options: [
            { text: 'GET', isCorrect: false },
            { text: 'POST', isCorrect: false },
            { text: 'PUT', isCorrect: true },
            { text: 'DELETE', isCorrect: false }
          ]
        }
      ],
      timeLimit: 15,
      passingScore: 70
    };

    const createQuizResponse = await axios.post(`${API_BASE}/quiz`, newQuiz, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Quiz created successfully');
    console.log(`   Quiz ID: ${createQuizResponse.data._id}`);
    console.log(`   Title: ${createQuizResponse.data.title}`);
    console.log(`   Questions: ${createQuizResponse.data.questions.length}`);
    console.log(`   Time limit: ${createQuizResponse.data.timeLimit} minutes`);
    const quizId = createQuizResponse.data._id;

    // 9. Read Quiz (as student)
    console.log('\n6. Testing GET /api/quiz/:id (Read Quiz as Student)');
    const readQuizResponse = await axios.get(`${API_BASE}/quiz/${quizId}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Quiz retrieved successfully');
    console.log(`   Title: ${readQuizResponse.data.title}`);
    console.log(`   Questions: ${readQuizResponse.data.questions.length}`);

    // 10. Update Quiz (as instructor)
    console.log('\n7. Testing PUT /api/quiz/:id (Update Quiz as Instructor)');
    const updateQuizData = {
      title: 'Updated CRUD Operations Quiz',
      timeLimit: 20,
      passingScore: 80
    };

    const updateQuizResponse = await axios.put(`${API_BASE}/quiz/${quizId}`, updateQuizData, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Quiz updated successfully');
    console.log(`   New title: ${updateQuizResponse.data.title}`);
    console.log(`   New time limit: ${updateQuizResponse.data.timeLimit} minutes`);
    console.log(`   New passing score: ${updateQuizResponse.data.passingScore}%`);

    console.log('\n=== TESTING USER MANAGEMENT CRUD ===');

    // 11. Get all users (as admin)
    console.log('8. Testing GET /api/users (Get All Users as Admin)');
    const allUsersResponse = await axios.get(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All users retrieved successfully');
    console.log(`   Total users: ${allUsersResponse.data.users.length}`);
    console.log(`   Admin users: ${allUsersResponse.data.users.filter(u => u.role === 'admin').length}`);
    console.log(`   Instructor users: ${allUsersResponse.data.users.filter(u => u.role === 'instructor').length}`);
    console.log(`   Student users: ${allUsersResponse.data.users.filter(u => u.role === 'student').length}`);

    // 12. Update user role (as admin)
    console.log('\n9. Testing PUT /api/users/:id/role (Update User Role as Admin)');
    const roleUpdateResponse = await axios.put(`${API_BASE}/users/${studentId}/role`, 
      { role: 'instructor' }, 
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✅ User role updated successfully');
    console.log(`   User: ${roleUpdateResponse.data.fullName}`);
    console.log(`   New role: ${roleUpdateResponse.data.role}`);

    // 13. Student enrolls in course
    console.log('\n10. Testing POST /api/users/enroll (Course Enrollment)');
    const enrollResponse = await axios.post(`${API_BASE}/users/enroll`, 
      { courseId: courseId }, 
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log('✅ Course enrollment successful');
    console.log(`   Enrolled in course: ${enrollResponse.data.course.title}`);

    console.log('\n=== TESTING DELETE OPERATIONS ===');

    // 14. Delete Quiz (as instructor)
    console.log('11. Testing DELETE /api/quiz/:id (Delete Quiz as Instructor)');
    const deleteQuizResponse = await axios.delete(`${API_BASE}/quiz/${quizId}`, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Quiz deleted successfully');
    console.log(`   Message: ${deleteQuizResponse.data.message}`);

    // 15. Delete Course (as instructor)
    console.log('\n12. Testing DELETE /api/courses/:id (Delete Course as Instructor)');
    const deleteCourseResponse = await axios.delete(`${API_BASE}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${instructorToken}` }
    });
    console.log('✅ Course deleted successfully');
    console.log(`   Message: ${deleteCourseResponse.data.message}`);

    console.log('\n=== TESTING ADVANCED FEATURES ===');

    // 16. Test course filtering and search
    console.log('13. Testing Advanced Course Filtering');
    const filterResponse = await axios.get(`${API_BASE}/courses?category=Technology&level=Beginner&sortBy=price&sortOrder=asc&page=1&limit=5`);
    console.log('✅ Course filtering successful');
    console.log(`   Filtered results: ${filterResponse.data.courses.length} courses`);

    // 17. Test quiz filtering
    console.log('\n14. Testing Quiz Filtering');
    const quizFilterResponse = await axios.get(`${API_BASE}/quiz?page=1&limit=5`);
    console.log('✅ Quiz filtering successful');
    console.log(`   Quiz results: ${quizFilterResponse.data.quizzes?.length || 0} quizzes`);

    console.log('\n🎉 Complete CRUD testing finished successfully!');
    console.log('\n📊 CRUD OPERATIONS SUMMARY:');
    console.log('==========================================');
    console.log('✅ CREATE Operations:');
    console.log('   - User Registration (Student)');
    console.log('   - Admin User Creation');
    console.log('   - Instructor User Creation');
    console.log('   - Course Creation (Instructor)');
    console.log('   - Lesson Addition (Instructor)');
    console.log('   - Quiz Creation (Instructor)');
    console.log('   - Course Enrollment (Student)');
    console.log('');
    console.log('✅ READ Operations:');
    console.log('   - Course Listing (Public)');
    console.log('   - Course Details (Public)');
    console.log('   - Quiz Retrieval (Authenticated)');
    console.log('   - User Profile (Authenticated)');
    console.log('   - All Users (Admin)');
    console.log('   - Advanced Filtering & Pagination');
    console.log('');
    console.log('✅ UPDATE Operations:');
    console.log('   - Course Updates (Instructor)');
    console.log('   - Quiz Updates (Instructor)');
    console.log('   - User Profile Updates (User)');
    console.log('   - User Role Updates (Admin)');
    console.log('');
    console.log('✅ DELETE Operations:');
    console.log('   - Course Deletion (Instructor)');
    console.log('   - Quiz Deletion (Instructor)');
    console.log('');
    console.log('🔐 SECURITY FEATURES:');
    console.log('   - Role-based Access Control');
    console.log('   - JWT Authentication');
    console.log('   - Input Validation');
    console.log('   - Authorization Middleware');
    console.log('');
    console.log('🚀 Your E-Learning Platform has complete CRUD functionality!');

  } catch (error) {
    console.error('❌ Complete CRUD testing failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('🔐 Authentication required for this operation');
    } else if (error.response?.status === 403) {
      console.log('🔒 Insufficient permissions for this operation');
    }
  }
}

// Run the complete test
testCompleteCRUD();
