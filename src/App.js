import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 pt-5 mt-5">
          <Routes>
            <Route path="/" element={<CoursesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;