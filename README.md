# 🎓 E-Learning Platform

A full-stack online learning platform with complete CRUD functionality, built with React, Node.js, Express, and MongoDB.

![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-lightgreen) ![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

## 🚀 Features

### ✅ Complete CRUD Operations
- **Users**: Registration, authentication, profile management, role assignment
- **Courses**: Full course management with lessons and instructor capabilities  
- **Quizzes**: Quiz creation, management, and result tracking
- **Progress**: Enrollment tracking, lesson completion, achievements

### 🔐 Security & Authentication
- JWT-based authentication
- Role-based access control (Student, Instructor, Admin)
- Protected routes and middleware
- Input validation and sanitization

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dynamic navbar with route-based styling
- Smooth animations and transitions
- Intuitive user interface

## 🛠️ Technology Stack

**Frontend**: React 18.2.0, React Router, Bootstrap 5.3.0  
**Backend**: Node.js, Express.js, JWT Authentication  
**Database**: MongoDB with Mongoose ODM  
**Development**: Modern ES6+, REST API, Git

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd E-Learning-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/elearning
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   
   **Backend** (Terminal 1):
   ```bash
   cd server
   node server.js
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
E-Learning-Platform/
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   └── utils/          # Utility functions
├── server/             # Express backend
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication middleware
│   └── server.js       # Server entry point
├── public/             # Static assets
└── assets/            # Additional assets
```

## 🔑 User Roles

### 👨‍🎓 Student
- Browse and enroll in courses
- Take quizzes and track progress
- Manage profile and view achievements

### 👨‍🏫 Instructor  
- Create and manage courses
- Add lessons and course content
- Create and manage quizzes
- View student progress

### 👨‍💼 Admin
- Full system access
- User role management
- Course and content moderation
- System analytics and reporting

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Course Management
- `GET /api/courses` - List courses (with filtering)
- `POST /api/courses` - Create course (instructor+)
- `PUT /api/courses/:id` - Update course (instructor+)
- `DELETE /api/courses/:id` - Delete course (instructor+)

### Quiz Management  
- `GET /api/quiz` - List quizzes
- `POST /api/quiz` - Create quiz (instructor+)
- `PUT /api/quiz/:id` - Update quiz (instructor+)
- `DELETE /api/quiz/:id` - Delete quiz (instructor+)

For complete API documentation, see `DOCUMENTATION.md`.

## 🔧 Development

### Available Scripts
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `cd server && node server.js` - Start backend server

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Production Setup
1. Set environment variables for production
2. Build React app: `npm run build`
3. Configure MongoDB Atlas for cloud database
4. Deploy backend to Heroku/AWS/DigitalOcean
5. Deploy frontend to Netlify/Vercel

## 📖 Documentation

- **Complete Documentation**: `DOCUMENTATION.md`
- **CRUD Implementation**: `CRUD_IMPLEMENTATION.md`
- **API Examples**: See documentation files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or support:
- Check the documentation files
- Create an issue in the repository
- Review the API examples

---

**Built with ❤️ using React, Node.js, and MongoDB**
