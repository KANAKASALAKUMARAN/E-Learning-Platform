# 🚀 E-Learning Platform API Examples

This document provides comprehensive examples of how to use all the REST API endpoints in your E-Learning Platform.

## 🔐 Authentication APIs

### 1. User Registration
```javascript
// Frontend example using fetch
const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: data._id,
        name: data.fullName,
        email: data.email,
        role: data.role
      }));
      console.log('Registration successful:', data);
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### 2. User Login
```javascript
// Frontend example using axios (your current implementation)
import authService from './services/api/authService';

const loginUser = async () => {
  try {
    const userData = await authService.login({
      email: 'john@example.com',
      password: 'password123'
    });
    
    // Token is automatically stored by the service
    console.log('Login successful:', userData);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

## 📚 Course Management APIs

### 3. Get All Courses
```javascript
// Frontend example
import CourseService from './services/api/courseService';

const fetchCourses = async () => {
  try {
    // Get all courses
    const courses = await CourseService.getCourses();
    console.log('All courses:', courses);
    
    // Get courses with filters
    const filteredCourses = await CourseService.getCourses({
      category: 'Web Development',
      level: 'Beginner',
      search: 'React'
    });
    console.log('Filtered courses:', filteredCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};
```

### 4. Get Single Course
```javascript
const fetchCourseDetails = async (courseId) => {
  try {
    const course = await CourseService.getCourseById(courseId);
    console.log('Course details:', course);
  } catch (error) {
    console.error('Error fetching course:', error);
  }
};
```

### 5. Create New Course (Admin/Instructor only)
```javascript
const createCourse = async () => {
  try {
    const courseData = {
      title: 'Advanced React Development',
      description: 'Learn advanced React concepts and patterns',
      category: 'Web Development',
      image: '/assets/images/react-course.jpg',
      price: 99.99,
      originalPrice: 199.99,
      level: 'Advanced',
      duration: '40 hours',
      lessons: [
        {
          title: 'React Hooks Deep Dive',
          description: 'Understanding advanced React hooks',
          duration: '2 hours',
          content: 'Lesson content here...'
        }
      ]
    };
    
    const newCourse = await CourseService.createCourse(courseData);
    console.log('Course created:', newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
  }
};
```

## 🎓 Enrollment APIs

### 6. Enroll in Course
```javascript
const enrollInCourse = async (courseId) => {
  try {
    const result = await CourseService.enrollInCourse(courseId);
    console.log('Enrollment successful:', result);
  } catch (error) {
    console.error('Enrollment failed:', error);
  }
};
```

### 7. Get User Enrollments
```javascript
import authService from './services/api/authService';

const getUserEnrollments = async () => {
  try {
    const userProfile = await authService.getUserProfile();
    console.log('User enrollments:', userProfile.enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
};
```

## 📊 Progress Tracking APIs

### 8. Get User Progress
```javascript
import ProgressService from './services/api/progressService';

const fetchUserProgress = async (userId) => {
  try {
    const progressData = await ProgressService.getUserProgress(userId);
    console.log('User progress:', progressData);
    
    // Access specific progress data
    console.log('Overall stats:', progressData.overallProgress);
    console.log('Course progress:', progressData.courseProgress);
    console.log('Achievements:', progressData.achievements);
  } catch (error) {
    console.error('Error fetching progress:', error);
  }
};
```

### 9. Update Progress (Mark Lesson Complete)
```javascript
const markLessonComplete = async (courseId, lessonId) => {
  try {
    const result = await ProgressService.markLessonCompleted(courseId, lessonId);
    console.log('Lesson marked complete:', result);
    
    // Check for new achievements
    if (result.newAchievements && result.newAchievements.length > 0) {
      console.log('New achievements unlocked:', result.newAchievements);
    }
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};
```

## 🧠 Quiz APIs

### 10. Get Quizzes for Course
```javascript
import QuizService from './services/api/quizService';

const fetchCourseQuizzes = async (courseId) => {
  try {
    const quizzes = await QuizService.getQuizzesByCourse(courseId);
    console.log('Course quizzes:', quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  }
};
```

### 11. Take a Quiz
```javascript
const takeQuiz = async (quizId) => {
  try {
    const quiz = await QuizService.getQuizById(quizId);
    console.log('Quiz data:', quiz);
    
    // Quiz questions are available without correct answers
    quiz.questions.forEach((question, index) => {
      console.log(`Question ${index + 1}: ${question.question}`);
      question.options.forEach((option, optIndex) => {
        console.log(`  ${optIndex + 1}. ${option.text}`);
      });
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
  }
};
```

### 12. Submit Quiz Answers
```javascript
const submitQuiz = async (quizId, userAnswers) => {
  try {
    const startTime = new Date('2025-01-16T10:00:00Z'); // When user started
    const timeSpent = Math.floor((new Date() - startTime) / 1000); // in seconds
    
    const submissionData = {
      quizId: quizId,
      answers: [
        { selectedOption: 0 }, // Answer for question 1
        { selectedOption: 2 }, // Answer for question 2
        { selectedOption: 1 }, // Answer for question 3
        // ... more answers
      ],
      timeSpent: timeSpent,
      startedAt: startTime
    };
    
    const result = await QuizService.submitQuiz(submissionData);
    console.log('Quiz result:', result);
    
    // Access result details
    console.log(`Score: ${result.result.percentage}%`);
    console.log(`Passed: ${result.result.passed}`);
    console.log(`Correct answers: ${result.result.correctAnswers}/${result.result.totalQuestions}`);
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
```

### 13. Get Quiz Results
```javascript
const fetchQuizResults = async (userId) => {
  try {
    const results = await QuizService.getQuizResults(userId);
    console.log('Quiz results:', results);
    
    // Display results
    results.forEach(result => {
      console.log(`Quiz: ${result.quizId.title}`);
      console.log(`Score: ${result.percentage}%`);
      console.log(`Passed: ${result.passed}`);
      console.log(`Attempt: ${result.attemptNumber}`);
      console.log(`Date: ${new Date(result.completedAt).toLocaleDateString()}`);
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
  }
};
```

## 🔒 Authentication Headers

All protected routes require the JWT token in the Authorization header:

```javascript
// Automatic token inclusion (your current setup)
// The apiService.js automatically adds the token to all requests

// Manual token inclusion example
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🎯 Complete User Journey Example

```javascript
// Complete example: User registration to course completion
const completeUserJourney = async () => {
  try {
    // 1. Register user
    const userData = await authService.register({
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123'
    });
    
    // 2. Get available courses
    const courses = await CourseService.getCourses();
    const selectedCourse = courses[0];
    
    // 3. Enroll in course
    await CourseService.enrollInCourse(selectedCourse._id);
    
    // 4. Get course quizzes
    const quizzes = await QuizService.getQuizzesByCourse(selectedCourse._id);
    
    // 5. Take first quiz
    if (quizzes.length > 0) {
      const quiz = await QuizService.getQuizById(quizzes[0]._id);
      
      // 6. Submit quiz answers
      const answers = quiz.questions.map(() => ({ selectedOption: 0 })); // All first options
      const quizResult = await QuizService.submitQuiz({
        quizId: quiz._id,
        answers: answers,
        timeSpent: 300, // 5 minutes
        startedAt: new Date()
      });
      
      console.log('Quiz completed:', quizResult);
    }
    
    // 7. Mark lesson as completed
    if (selectedCourse.lessons && selectedCourse.lessons.length > 0) {
      await ProgressService.markLessonCompleted(
        selectedCourse._id, 
        selectedCourse.lessons[0]._id
      );
    }
    
    // 8. Check overall progress
    const progress = await ProgressService.getUserProgress(userData._id);
    console.log('User progress:', progress);
    
  } catch (error) {
    console.error('Error in user journey:', error);
  }
};
```

## 🛠️ Testing the APIs

You can test these APIs using:

1. **Frontend Components** (React)
2. **Postman** or **Insomnia**
3. **curl** commands
4. **Browser Developer Tools**

### Example curl commands:

```bash
# Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'

# Get courses
curl -X GET http://localhost:5000/api/courses

# Get user progress (requires token)
curl -X GET http://localhost:5000/api/progress/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

This completes the comprehensive API integration guide for your E-Learning Platform! 🎉
