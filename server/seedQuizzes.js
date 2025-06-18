const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Quiz = require('./models/Quiz');
const Course = require('./models/Course');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elearningdb';

// Sample quiz data
const sampleQuizzes = [
  {
    title: "Web Development Fundamentals Quiz",
    description: "Test your knowledge of HTML, CSS, and JavaScript basics",
    timeLimit: 15, // 15 minutes
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        question: "What does HTML stand for?",
        options: [
          { text: "Hyper Text Markup Language", isCorrect: true },
          { text: "High Tech Modern Language", isCorrect: false },
          { text: "Home Tool Markup Language", isCorrect: false },
          { text: "Hyperlink and Text Markup Language", isCorrect: false }
        ],
        explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
        points: 1
      },
      {
        question: "Which CSS property is used to change the text color of an element?",
        options: [
          { text: "font-color", isCorrect: false },
          { text: "text-color", isCorrect: false },
          { text: "color", isCorrect: true },
          { text: "foreground-color", isCorrect: false }
        ],
        explanation: "The 'color' property in CSS is used to set the color of text.",
        points: 1
      },
      {
        question: "What is the correct way to declare a JavaScript variable?",
        options: [
          { text: "variable myVar;", isCorrect: false },
          { text: "v myVar;", isCorrect: false },
          { text: "var myVar;", isCorrect: true },
          { text: "declare myVar;", isCorrect: false }
        ],
        explanation: "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords.",
        points: 1
      },
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: [
          { text: "<link>", isCorrect: false },
          { text: "<a>", isCorrect: true },
          { text: "<href>", isCorrect: false },
          { text: "<url>", isCorrect: false }
        ],
        explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML.",
        points: 1
      },
      {
        question: "What does CSS stand for?",
        options: [
          { text: "Computer Style Sheets", isCorrect: false },
          { text: "Creative Style Sheets", isCorrect: false },
          { text: "Cascading Style Sheets", isCorrect: true },
          { text: "Colorful Style Sheets", isCorrect: false }
        ],
        explanation: "CSS stands for Cascading Style Sheets, used for styling web pages.",
        points: 1
      }
    ]
  },
  {
    title: "Data Science Basics Quiz",
    description: "Test your understanding of data science fundamentals",
    timeLimit: 20, // 20 minutes
    passingScore: 75,
    maxAttempts: 2,
    questions: [
      {
        question: "Which Python library is primarily used for data manipulation and analysis?",
        options: [
          { text: "NumPy", isCorrect: false },
          { text: "Pandas", isCorrect: true },
          { text: "Matplotlib", isCorrect: false },
          { text: "Scikit-learn", isCorrect: false }
        ],
        explanation: "Pandas is the primary library for data manipulation and analysis in Python.",
        points: 2
      },
      {
        question: "What does 'overfitting' mean in machine learning?",
        options: [
          { text: "The model performs well on training data but poorly on new data", isCorrect: true },
          { text: "The model performs poorly on all data", isCorrect: false },
          { text: "The model is too simple", isCorrect: false },
          { text: "The model has too few parameters", isCorrect: false }
        ],
        explanation: "Overfitting occurs when a model learns the training data too well, including noise, making it perform poorly on new, unseen data.",
        points: 2
      },
      {
        question: "Which of the following is NOT a type of machine learning?",
        options: [
          { text: "Supervised Learning", isCorrect: false },
          { text: "Unsupervised Learning", isCorrect: false },
          { text: "Reinforcement Learning", isCorrect: false },
          { text: "Deterministic Learning", isCorrect: true }
        ],
        explanation: "Deterministic Learning is not a recognized type of machine learning. The main types are Supervised, Unsupervised, and Reinforcement Learning.",
        points: 2
      }
    ]
  }
];

// Connect to MongoDB and seed quizzes
async function seedQuizzes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing courses to associate quizzes with
    const courses = await Course.find({});
    
    if (courses.length === 0) {
      console.log('❌ No courses found. Please run the main seeder first to create courses.');
      process.exit(1);
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('🗑️ Cleared existing quizzes');

    // Associate quizzes with courses
    const quizzesToInsert = sampleQuizzes.map((quiz, index) => ({
      ...quiz,
      courseId: courses[index % courses.length]._id // Distribute quizzes among available courses
    }));

    // Insert sample quizzes
    const insertedQuizzes = await Quiz.insertMany(quizzesToInsert);
    console.log(`✅ Inserted ${insertedQuizzes.length} sample quizzes`);

    // Display quiz information
    insertedQuizzes.forEach((quiz, index) => {
      const course = courses.find(c => c._id.toString() === quiz.courseId.toString());
      console.log(`📝 Quiz ${index + 1}: "${quiz.title}" - Associated with course: "${course.title}"`);
    });

    console.log('\n🎉 Quiz seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('1. View quizzes for a course: GET /api/quiz/course/:courseId');
    console.log('2. Take a quiz: GET /api/quiz/:quizId');
    console.log('3. Submit quiz answers: POST /api/quiz/submit');
    console.log('4. View quiz results: GET /api/quiz/results/:userId');

  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedQuizzes();
}

module.exports = seedQuizzes;
