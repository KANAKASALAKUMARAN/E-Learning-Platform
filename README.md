# E-Learning Platform

A modern, full-stack e-learning platform built with React, Node.js, Express, and MongoDB. This application provides a comprehensive learning experience with course management, user authentication, and interactive learning features.

## Features

- **User Authentication**: Secure signup, login, and user management system
- **Course Catalog**: Browse, filter, and search through available courses
- **Course Details**: In-depth information about each course with lesson structure
- **User Dashboard**: Track progress, enrolled courses, and achievements
- **Responsive Design**: Full mobile and desktop compatibility

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **React Router**: Navigation and routing
- **Bootstrap 5**: Responsive design framework
- **Axios**: API requests and data handling
- **FontAwesome**: Icons and visual elements

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (local installation or MongoDB Atlas account)

## MongoDB Setup

### Option 1: Local MongoDB Installation

1. **Download and Install MongoDB Community Server**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select your operating system (Windows/macOS/Linux)
   - Download and run the installer
   - Follow the installation wizard
   - Choose "Complete" installation type
   - Select "Install MongoDB as a Service" option

2. **Verify Installation**
   - Open Command Prompt or PowerShell
   - Run `mongod --version` to verify MongoDB server is installed
   - Run `mongo --version` to verify MongoDB shell is installed

3. **Create Admin User**
   - Open MongoDB Shell by typing `mongosh` in Command Prompt
   - Switch to admin database: `use admin`
   - Create admin user:
   ```
   db.createUser({
     user: "admin",
     pwd: "admin123",
     roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
   })
   ```
   - Exit the shell by typing `exit`

4. **Create the E-Learning Database**
   - Open MongoDB Shell: `mongosh -u admin -p admin123 --authenticationDatabase admin`
   - Create and switch to elearning database: `use elearning`
   - The database will be created when you first insert data into it via the seeder script

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a new cluster (free tier is available)

2. **Set Up Network Access**
   - In Atlas dashboard, go to Network Access
   - Add your current IP address or allow access from anywhere for development

3. **Create Database User**
   - Go to Database Access
   - Add a new database user with password authentication
   - Assign read/write permissions

4. **Get Connection String**
   - Go to Clusters and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your credentials and "elearning" as database name

5. **Update Your .env File**
   - Use the connection string from Atlas in your .env file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/elearning?retryWrites=true&w=majority
   ```

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd E-Learning-Platform
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the project root with the following variables:

```
MONGODB_URI=mongodb://admin:admin123@localhost:27017/elearning?authSource=admin
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

Make sure to update the MongoDB URI with your credentials if they differ.

### Step 3: Install Dependencies

```bash
# Install server dependencies
npm install

# Install frontend dependencies (if you're using a separate package.json for frontend)
npm install
```

### Step 4: Seed the Database

Run the following command to create test users and courses in your MongoDB database:

```bash
node server/seeder.js
```

This will create the following test users:
- Admin: admin@elearning.com / admin123
- Student: john@example.com / password123
- Instructor: jane@example.com / password123

### Step 5: Start the Application

#### Development Mode (Running Frontend and Backend Separately)

Terminal 1 - Start the Backend Server:
```bash
npm run server
```

Terminal 2 - Start the React Development Server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Mode (Single Command)

```bash
npm run dev
```

This uses concurrently to start both servers simultaneously.

## Project Structure

```
E-Learning-Platform/
├── server/                 # Backend server code
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose database models
│   ├── routes/             # Express API routes
│   ├── seeder.js           # Database seed script
│   └── server.js           # Express server configuration
├── src/                    # React frontend code
│   ├── assets/             # Static assets (CSS, images)
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── App.js              # Main React component
│   └── index.js            # React entry point
├── public/                 # Public static files
├── package.json            # Project dependencies and scripts
├── .env                    # Environment variables
└── README.md               # Project documentation
```

## API Routes

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login an existing user

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course

### Enrollment
- `POST /api/users/enroll` - Enroll in a course
- `POST /api/users/complete-lesson` - Mark a lesson as completed

## Troubleshooting

### MongoDB Connection Issues
If you're experiencing database connection issues:
1. Ensure MongoDB is running
2. Verify your connection string in the `.env` file
3. Check if MongoDB requires authentication

### Login/Registration Issues
If authentication is not working:
1. Make sure the server is running
2. Check if users exist in the database
3. Verify that the JWT secret is correctly configured

## License

MIT