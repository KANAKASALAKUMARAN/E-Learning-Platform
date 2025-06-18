import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import CartPage from './pages/CartPage';

// Scroll reveal utility
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Scroll reveal observer setup
const setupScrollReveal = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersect, observerOptions);
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  revealElements.forEach(el => {
    observer.observe(el);
  });
};

function MainContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const nodeRef = useRef(null);

  // Set up scroll reveal
  useEffect(() => {
    // Add small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      setupScrollReveal();
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <main className={`flex-grow-1 ${isHomePage ? 'home-main' : ''}`}>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key}
          classNames="page"
          timeout={400}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className="page-container">
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:id" element={<CourseDetailsPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/cart" element={<CartPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <ScrollToTop />
            <div className="d-flex flex-column min-vh-100">
              <Header />
              <MainContent />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;