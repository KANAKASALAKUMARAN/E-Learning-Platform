# E-Learning Platform

A modern, responsive online learning platform built with React that provides an intuitive interface for course browsing, user authentication, and interactive learning experiences.

![E-Learning Platform](https://img.shields.io/badge/React-18.2.0-blue) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Project Overview

The E-Learning Platform is a comprehensive web application designed to deliver high-quality online education. It features a modern, responsive design with smooth animations and an intuitive user interface that works seamlessly across all devices.

### ✨ Key Features

- **📚 Course Catalog**: Browse and search through a comprehensive course library
- **🔐 User Authentication**: Secure login/signup with demo account functionality
- **👤 User Profiles**: Personalized user dashboards and profile management
- **📱 Responsive Design**: Mobile-first design that works on all screen sizes
- **🎨 Modern UI/UX**: Clean, professional interface with smooth animations
- **🔍 Advanced Search**: Filter courses by category, level, price, and rating
- **📊 Progress Tracking**: Monitor learning progress and achievements
- **⚡ Fast Performance**: Optimized for speed and smooth user experience
- **♿ Accessibility**: WCAG compliant with screen reader support
- **🌙 Theme Support**: Light and dark mode options

### 🛠️ Technology Stack

- **Frontend**: React 18.2.0, React Router 6.x
- **Styling**: Bootstrap 5.3.0, Custom CSS with animations
- **Icons**: FontAwesome 6.x
- **State Management**: React Context API
- **Database**: MongoDB (Local or Atlas)
- **Development**: Create React App, ES6+, JSX
- **Version Control**: Git & GitHub

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

- **Node.js**: Version 16.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm or Yarn**: Package manager (npm comes with Node.js)
  - Verify npm: `npm --version`
  - Or install Yarn: `npm install -g yarn`

- **Git**: Version control system
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

- **MongoDB**: Database (choose one option below)
  - **Option A**: Local MongoDB installation
  - **Option B**: MongoDB Atlas (cloud database)

### Recommended VS Code Extensions

For the best development experience, install these VS Code extensions:

```
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)
- MongoDB for VS Code
```

## 🔧 VS Code Setup Instructions

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/KANAKASALAKUMARAN/E-Learning-Platform.git

# Navigate to project directory
cd E-Learning-Platform
```

### 2. Open in VS Code

```bash
# Open project in VS Code
code .
```

### 3. Install Recommended Extensions

1. Open VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Extensions: Show Recommended Extensions"
3. Install all recommended extensions for this workspace

### 4. Configure VS Code Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "javascriptreact"
  }
}
```

### 5. Configure Debugging

Create `.vscode/launch.json` for React debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

## 🗄️ MongoDB Setup Instructions

Choose one of the following options to set up MongoDB:

### Option A: Local MongoDB Installation

1. **Download and Install MongoDB**:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for your OS
   - Follow installation instructions for your platform

2. **Start MongoDB Service**:
   ```bash
   # Windows (as Administrator)
   net start MongoDB

   # macOS (using Homebrew)
   brew services start mongodb-community

   # Linux (Ubuntu/Debian)
   sudo systemctl start mongod
   ```

3. **Install MongoDB Compass** (GUI Tool):
   - Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
   - **Connection string for MongoDB Compass**: `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**:
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Choose "Build a Database" → "Shared" (Free tier)
   - Select your preferred cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Configure Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Add your current IP or use `0.0.0.0/0` for development (not recommended for production)

5. **Get Connection String**:
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **MongoDB Compass Connection**:
   - Open MongoDB Compass
   - **Connection string for MongoDB Compass**: `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/`
   - **Connection string for MongoDB Compass_1**: 'mongodb://admin:admin123@localhost:27017/elearning?authSource=admin'

### Database Schema Setup

The application will automatically create the necessary collections. Initial data structure:

```javascript
// Users Collection
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String,
  createdAt: Date,
  updatedAt: Date
}

// Courses Collection
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  instructor: String,
  price: Number,
  rating: Number,
  students: Number,
  createdAt: Date
}
```

## 📦 Project Installation Steps

### 1. Install Dependencies

```bash
# Using npm
npm install

# Or using Yarn
yarn install
```

### 2. Environment Variables Setup

Create a `.env` file in the project root:

```env
# Database Configuration
REACT_APP_MONGODB_URI=mongodb://localhost:27017/elearning
# For MongoDB Atlas, use your connection string:
# REACT_APP_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/elearning

# Application Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_JWT_SECRET=your-super-secret-jwt-key-here
REACT_APP_ENVIRONMENT=development

# Optional: Email Configuration (for contact forms)
REACT_APP_EMAIL_SERVICE=gmail
REACT_APP_EMAIL_USER=your-email@gmail.com
REACT_APP_EMAIL_PASS=your-app-password
```

### 3. Start Development Server

```bash
# Using npm
npm start

# Or using Yarn
yarn start
```

The application will open in your browser at `http://localhost:3000`

### 4. Build for Production

```bash
# Using npm
npm run build

# Or using Yarn
yarn build
```

## 📁 Project Structure

```
E-Learning-Platform/
├── public/                 # Static files
│   ├── index.html         # Main HTML template
│   └── favicon.ico        # App icon
├── src/                   # Source code
│   ├── components/        # Reusable React components
│   │   ├── common/        # Shared components
│   │   ├── courses/       # Course-related components
│   │   └── layout/        # Layout components (Header, Footer)
│   ├── pages/             # Page components
│   │   ├── HomePage.js    # Landing page
│   │   ├── CoursesPage.js # Course catalog
│   │   ├── AboutUsPage.js # About page
│   │   └── ContactUsPage.js # Contact page
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.js # Authentication state
│   │   └── ThemeContext.js # Theme management
│   ├── assets/            # Static assets
│   │   ├── css/           # Stylesheets
│   │   └── images/        # Images and icons
│   ├── data/              # Mock data and constants
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

### Key Files Description

- **`src/App.js`**: Main application component with routing
- **`src/components/layout/Header.js`**: Navigation bar with authentication
- **`src/pages/CoursesPage.js`**: Course catalog with search and filters
- **`src/contexts/AuthContext.js`**: Global authentication state management
- **`src/assets/css/style.css`**: Main stylesheet with custom styles
- **`src/data/courseData.js`**: Mock course data for development

## 🎯 Available Scripts

In the project directory, you can run:

### Development Scripts

```bash
# Start development server
npm start
# Runs the app in development mode on http://localhost:3000

# Run tests
npm test
# Launches the test runner in interactive watch mode

# Build for production
npm run build
# Builds the app for production to the `build` folder

# Eject configuration (⚠️ irreversible)
npm run eject
# Removes the single build dependency and copies configuration files
```

### Custom Scripts

```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## 🔧 Troubleshooting Section

### Common Setup Issues and Solutions

#### Port Already in Use
```bash
# Error: Port 3000 is already in use
# Solution: Kill the process or use a different port
npx kill-port 3000
# Or set a different port
PORT=3001 npm start
```

#### Node.js Version Issues
```bash
# Check your Node.js version
node --version
# If version is below 16.0, update Node.js
# Download from https://nodejs.org/
```

#### MongoDB Connection Issues
```bash
# Local MongoDB not starting
# Windows: Start MongoDB service
net start MongoDB

# macOS: Start with Homebrew
brew services start mongodb-community

# Linux: Start with systemctl
sudo systemctl start mongod
```

#### Dependency Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use Yarn instead
yarn install
```

#### VS Code Extensions Not Working
1. Restart VS Code after installing extensions
2. Check if extensions are enabled in the Extensions panel
3. Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"

#### Build Errors
```bash
# Clear build cache
rm -rf build
npm run build

# Check for ESLint errors
npm run lint
```

### Environment Variables Issues
- Ensure `.env` file is in the project root
- Check that all required variables are set
- Restart the development server after changing `.env`

### MongoDB Compass Connection Issues
- **Local MongoDB**: Use `mongodb://localhost:27017`
- **MongoDB Atlas**: Use the full connection string with credentials
- Ensure MongoDB service is running (for local installations)
- Check network access settings (for Atlas)

## 🤝 Contributing Guidelines

We welcome contributions to the E-Learning Platform! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   # Clone your fork
   git clone https://github.com/YOUR-USERNAME/E-Learning-Platform.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: your descriptive commit message"
   ```

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Create a pull request on GitHub
   ```

### Code Style Guidelines

#### JavaScript/React
- Use ES6+ features (arrow functions, destructuring, etc.)
- Follow React Hooks best practices
- Use functional components over class components
- Keep components small and focused

#### CSS
- Use Bootstrap classes when possible
- Follow BEM naming convention for custom CSS
- Keep styles organized and commented
- Use CSS variables for consistent theming

#### File Naming
- Use PascalCase for React components: `CourseCard.js`
- Use camelCase for utilities and services: `authService.js`
- Use kebab-case for CSS files: `course-card.css`

### Pull Request Process

1. **Description**: Provide a clear description of changes
2. **Screenshots**: Include screenshots for UI changes
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update README if needed
5. **Review**: Address feedback from code review

### Reporting Issues

When reporting bugs or requesting features:

1. **Search Existing Issues**: Check if the issue already exists
2. **Use Templates**: Follow the issue templates provided
3. **Provide Details**: Include steps to reproduce, expected behavior, and screenshots
4. **Environment Info**: Include OS, browser, Node.js version

### Development Setup for Contributors

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/E-Learning-Platform.git
cd E-Learning-Platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing React framework
- **Bootstrap Team** for the responsive design framework
- **FontAwesome** for the beautiful icons
- **MongoDB** for the flexible database solution
- **All Contributors** who have helped improve this project

## 📞 Support

If you need help or have questions:

- 📧 **Email**: support@elearning-platform.com
- 💬 **Discord**: [Join our community](https://discord.gg/elearning)
- 📖 **Documentation**: [Full documentation](https://docs.elearning-platform.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/KANAKASALAKUMARAN/E-Learning-Platform/issues)

---

**Happy Learning! 🎓**