const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB using the exact connection string
const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/elearning?authSource=admin';

console.log('Attempting to connect to MongoDB with exact connection string');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample courses data
const coursesData = [
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node and more to become a full-stack web developer",
    image: "/assets/images/course-web-dev.jpg",
    category: "Web Development",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 12542,
    instructor: {
      name: "Jane Smith",
      image: "/assets/images/instructor-jane.jpg",
      bio: "Senior Web Developer with 10+ years of experience"
    },
    duration: "42 hours",
    price: 49.99,
    originalPrice: 199.99,
    level: "Beginner",
    students: 187450,
    lastUpdated: new Date("2025-03-15"),
    lessons: [
      {
        title: "Introduction to HTML",
        description: "Learn the basics of HTML structure and tags",
        duration: "25:15",
        order: 1,
        videoUrl: "/assets/videos/html-intro.mp4",
        content: "HTML is the standard markup language for Web pages..."
      },
      {
        title: "CSS Fundamentals",
        description: "Learn how to style web pages using CSS",
        duration: "30:45",
        order: 2,
        videoUrl: "/assets/videos/css-basics.mp4",
        content: "CSS is the language we use to style HTML documents..."
      },
      {
        title: "JavaScript Basics",
        description: "Introduction to JavaScript programming",
        duration: "45:20",
        order: 3,
        videoUrl: "/assets/videos/js-basics.mp4",
        content: "JavaScript is the programming language of the Web..."
      }
    ]
  },
  {
    title: "Python for Data Science and Machine Learning",
    description: "Master Python for data analysis, visualization, and machine learning algorithms",
    image: "/assets/images/course-python.jpg",
    category: "Data Science",
    badge: "Hot & New",
    rating: 4.8,
    reviews: 8735,
    instructor: {
      name: "Michael Johnson",
      image: "/assets/images/instructor-michael.jpg",
      bio: "Data Scientist and AI Researcher"
    },
    duration: "38 hours",
    price: 59.99,
    originalPrice: 149.99,
    level: "Intermediate",
    students: 123500,
    lastUpdated: new Date("2025-04-10"),
    lessons: [
      {
        title: "Python Basics",
        description: "Introduction to Python programming",
        duration: "35:10",
        order: 1,
        videoUrl: "/assets/videos/python-basics.mp4",
        content: "Python is a popular programming language..."
      },
      {
        title: "NumPy and Pandas",
        description: "Working with numerical data in Python",
        duration: "50:25",
        order: 2,
        videoUrl: "/assets/videos/numpy-pandas.mp4",
        content: "NumPy and Pandas are powerful libraries for data manipulation..."
      },
      {
        title: "Data Visualization",
        description: "Creating charts and graphs with Matplotlib and Seaborn",
        duration: "40:15",
        order: 3,
        videoUrl: "/assets/videos/data-viz.mp4",
        content: "Data visualization is a key skill for any data scientist..."
      }
    ]
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Learn user interface and user experience design principles for digital products",
    image: "/assets/images/course-design.jpg",
    category: "Design",
    badge: "",
    rating: 4.7,
    reviews: 3214,
    instructor: {
      name: "Sarah Williams",
      image: "/assets/images/instructor-sarah.jpg",
      bio: "UX Designer with experience at top tech companies"
    },
    duration: "24 hours",
    price: 39.99,
    originalPrice: 129.99,
    level: "Beginner",
    students: 98750,
    lastUpdated: new Date("2025-02-28"),
    lessons: [
      {
        title: "Introduction to UI/UX",
        description: "Understanding the difference between UI and UX",
        duration: "20:30",
        order: 1,
        videoUrl: "/assets/videos/uiux-intro.mp4",
        content: "UI and UX are often confused but represent different aspects of design..."
      },
      {
        title: "User Research",
        description: "Methods for understanding user needs and behaviors",
        duration: "35:45",
        order: 2,
        videoUrl: "/assets/videos/user-research.mp4",
        content: "User research is the foundation of effective UX design..."
      },
      {
        title: "Wireframing and Prototyping",
        description: "Creating low and high fidelity prototypes",
        duration: "42:20",
        order: 3,
        videoUrl: "/assets/videos/wireframing.mp4",
        content: "Wireframes help visualize the basic structure of your design..."
      }
    ]
  }
];

// Sample users data
const usersData = [
  {
    fullName: 'Admin User',
    email: 'admin@elearning.com',
    password: 'admin123',
    role: 'admin',
    enrolledCourses: [],
    completedLessons: [],
    achievements: []
  },
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student',
    enrolledCourses: [],
    completedLessons: [],
    achievements: []
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'instructor',
    enrolledCourses: [],
    completedLessons: [],
    achievements: []
  }
];

// Hash user passwords
async function hashPasswords(users) {
  const salt = await bcrypt.genSalt(10);
  return Promise.all(users.map(async user => {
    user.password = await bcrypt.hash(user.password, salt);
    return user;
  }));
}

// Seed data
async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    
    console.log('Data cleared');
    
    // Insert new courses
    const courses = await Course.insertMany(coursesData);
    console.log(`${courses.length} courses inserted`);
    
    // Hash user passwords and insert users
    const hashedUsers = await hashPasswords(usersData);
    
    // Update enrolledCourses for second user (John Doe)
    hashedUsers[1].enrolledCourses = [courses[0]._id, courses[1]._id];
    
    // Insert users with hashed passwords
    const users = await User.insertMany(hashedUsers);
    console.log(`${users.length} users inserted`);
    
    console.log('Data seeding completed successfully!');
    console.log('\nYou can now log in with the following credentials:');
    console.log('  Admin: admin@elearning.com / admin123');
    console.log('  Student: john@example.com / password123');
    console.log('  Instructor: jane@example.com / password123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();