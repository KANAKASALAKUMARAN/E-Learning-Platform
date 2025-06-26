const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Helper functions for testing CRUD operations
class CRUDTester {
  constructor() {
    this.tokens = {};
    this.users = {};
  }

  // Create different types of users
  async createAdmin(name = 'Test Admin', email = null) {
    const user = {
      fullName: name,
      email: email || `admin_${Date.now()}@example.com`,
      password: 'admin123'
    };
    
    try {
      const response = await axios.post(`${API_BASE}/users/create-test-admin`, user);
      console.log(`✅ Admin created: ${response.data.fullName}`);
      this.tokens.admin = response.data.token;
      this.users.admin = response.data;
      return response.data;
    } catch (error) {
      console.log(`❌ Admin creation failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  async createStudent(name = 'Test Student', email = null) {
    const user = {
      fullName: name,
      email: email || `student_${Date.now()}@example.com`,
      password: 'student123'
    };
    
    try {
      const response = await axios.post(`${API_BASE}/users/register`, user);
      console.log(`✅ Student created: ${response.data.fullName}`);
      this.tokens.student = response.data.token;
      this.users.student = response.data;
      return response.data;
    } catch (error) {
      console.log(`❌ Student creation failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  async promoteToInstructor(userId, role = 'instructor') {
    if (!this.tokens.admin) {
      console.log('❌ Admin token required for role changes');
      return null;
    }

    try {
      const response = await axios.put(`${API_BASE}/users/${userId}/role`, 
        { role }, 
        { headers: { Authorization: `Bearer ${this.tokens.admin}` } }
      );
      console.log(`✅ User promoted to ${role}: ${response.data.fullName}`);
      return response.data;
    } catch (error) {
      console.log(`❌ Role promotion failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  // Course CRUD operations
  async createCourse(instructorToken, courseData = null) {
    const defaultCourse = {
      title: `Test Course ${Date.now()}`,
      description: 'A comprehensive test course for CRUD operations',
      category: 'Technology',
      price: 99.99,
      level: 'Beginner',
      duration: '5 hours',
      lessons: [
        {
          title: 'Introduction',
          content: 'Getting started with the course',
          duration: 30,
          videoUrl: 'https://example.com/video1'
        }
      ]
    };

    const course = courseData || defaultCourse;
    
    try {
      const response = await axios.post(`${API_BASE}/courses`, course, {
        headers: { Authorization: `Bearer ${instructorToken}` }
      });
      console.log(`✅ Course created: "${response.data.title}"`);
      return response.data;
    } catch (error) {
      console.log(`❌ Course creation failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  async getCourses(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const url = `${API_BASE}/courses${queryString ? '?' + queryString : ''}`;
    
    try {
      const response = await axios.get(url);
      console.log(`✅ Retrieved ${response.data.courses.length} courses`);
      return response.data;
    } catch (error) {
      console.log(`❌ Course retrieval failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  async updateCourse(courseId, instructorToken, updateData) {
    try {
      const response = await axios.put(`${API_BASE}/courses/${courseId}`, updateData, {
        headers: { Authorization: `Bearer ${instructorToken}` }
      });
      console.log(`✅ Course updated: "${response.data.title}"`);
      return response.data;
    } catch (error) {
      console.log(`❌ Course update failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  async deleteCourse(courseId, instructorToken) {
    try {
      const response = await axios.delete(`${API_BASE}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${instructorToken}` }
      });
      console.log(`✅ Course deleted: ${response.data.message}`);
      return true;
    } catch (error) {
      console.log(`❌ Course deletion failed: ${error.response?.data?.message}`);
      return false;
    }
  }

  // Quiz CRUD operations
  async createQuiz(courseId, instructorToken, quizData = null) {
    const defaultQuiz = {
      title: `Test Quiz ${Date.now()}`,
      courseId: courseId,
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
      timeLimit: 10,
      passingScore: 70
    };

    const quiz = quizData || defaultQuiz;
    
    try {
      const response = await axios.post(`${API_BASE}/quiz`, quiz, {
        headers: { Authorization: `Bearer ${instructorToken}` }
      });
      console.log(`✅ Quiz created: "${response.data.title}"`);
      return response.data;
    } catch (error) {
      console.log(`❌ Quiz creation failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  // User management
  async getAllUsers() {
    if (!this.tokens.admin) {
      console.log('❌ Admin token required to get all users');
      return null;
    }

    try {
      const response = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${this.tokens.admin}` }
      });
      console.log(`✅ Retrieved ${response.data.users.length} users`);
      return response.data;
    } catch (error) {
      console.log(`❌ User retrieval failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  // Enrollment
  async enrollInCourse(courseId, studentToken) {
    try {
      const response = await axios.post(`${API_BASE}/users/enroll`, 
        { courseId }, 
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      console.log(`✅ Enrolled in course: ${response.data.course?.title || 'Course'}`);
      return response.data;
    } catch (error) {
      console.log(`❌ Enrollment failed: ${error.response?.data?.message}`);
      return null;
    }
  }

  // Quick test scenarios
  async quickTest() {
    console.log('🚀 Running Quick CRUD Test...\n');

    // Setup users
    const admin = await this.createAdmin();
    const student = await this.createStudent();
    
    if (!admin || !student) return;

    // Promote student to instructor
    const instructor = await this.promoteToInstructor(student._id);
    if (!instructor) return;

    // Create course
    const course = await this.createCourse(this.tokens.student);
    if (!course) return;

    // Create quiz
    const quiz = await this.createQuiz(course._id, this.tokens.student);

    // Get all courses
    await this.getCourses();

    // Get all users
    await this.getAllUsers();

    console.log('\n✅ Quick test completed!');
  }

  async fullCRUDDemo() {
    console.log('🎯 Running Full CRUD Demonstration...\n');

    try {
      // 1. Create users
      console.log('1. Creating users...');
      const admin = await this.createAdmin('CRUD Admin', 'crud.admin@test.com');
      const student = await this.createStudent('CRUD Student', 'crud.student@test.com');
      
      if (!admin || !student) return;

      // 2. Promote to instructor
      console.log('\n2. Promoting student to instructor...');
      await this.promoteToInstructor(student._id);

      // 3. Course operations
      console.log('\n3. Course CRUD operations...');
      const course = await this.createCourse(this.tokens.student, {
        title: 'Complete CRUD Mastery',
        description: 'Master all CRUD operations in this comprehensive course',
        category: 'Programming',
        price: 199.99,
        level: 'Advanced',
        duration: '10 hours',
        lessons: [
          { title: 'CRUD Basics', content: 'Introduction to CRUD', duration: 60, videoUrl: 'https://example.com/1' },
          { title: 'Advanced Patterns', content: 'Advanced CRUD patterns', duration: 90, videoUrl: 'https://example.com/2' }
        ]
      });

      if (course) {
        // Update course
        await this.updateCourse(course._id, this.tokens.student, {
          title: 'Ultimate CRUD Mastery',
          price: 249.99
        });

        // 4. Quiz operations
        console.log('\n4. Quiz CRUD operations...');
        const quiz = await this.createQuiz(course._id, this.tokens.student, {
          title: 'CRUD Mastery Assessment',
          courseId: course._id,
          questions: [
            {
              question: 'Which operation is used to create new records?',
              options: [
                { text: 'CREATE', isCorrect: true },
                { text: 'READ', isCorrect: false },
                { text: 'UPDATE', isCorrect: false },
                { text: 'DELETE', isCorrect: false }
              ]
            },
            {
              question: 'Which HTTP method is typically used for READ operations?',
              options: [
                { text: 'POST', isCorrect: false },
                { text: 'GET', isCorrect: true },
                { text: 'PUT', isCorrect: false },
                { text: 'DELETE', isCorrect: false }
              ]
            }
          ],
          timeLimit: 15,
          passingScore: 80
        });

        // 5. Filter and search
        console.log('\n5. Testing filters and search...');
        await this.getCourses({ category: 'Programming', level: 'Advanced' });
        await this.getCourses({ search: 'CRUD', sortBy: 'price', sortOrder: 'desc' });

        // 6. User management
        console.log('\n6. User management...');
        await this.getAllUsers();

        console.log('\n🎉 Full CRUD demonstration completed successfully!');
      }
    } catch (error) {
      console.error('❌ Full CRUD demo failed:', error.message);
    }
  }
}

// Usage examples
async function runTests() {
  const tester = new CRUDTester();
  
  console.log('Choose a test to run:');
  console.log('1. Quick Test (basic CRUD operations)');
  console.log('2. Full Demo (comprehensive CRUD demonstration)');
  
  // For demo purposes, run the full demo
  await tester.fullCRUDDemo();
}

// Export for use in other files or run directly
if (require.main === module) {
  runTests();
}

module.exports = CRUDTester;
