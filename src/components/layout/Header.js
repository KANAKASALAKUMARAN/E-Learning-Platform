import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faGraduationCap, 
  faMedal, 
  faUser, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

function Header() {
  // You would typically get this from a global state or context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'User Name',
    avatar: '/assets/images/avatar-placeholder.jpg'
  });
  
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, this would call an API endpoint to logout
    setIsLoggedIn(false);
    navigate('/');
  };
  
  // For demo purposes only - toggle logged in state
  const toggleLoggedIn = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-primary">Learn</span>Hub
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                } 
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                } 
                to="/courses"
              >
                Courses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                } 
                to="/about"
              >
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                } 
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
          </ul>
          
          {/* Login/Signup buttons (shown when not logged in) */}
          {!isLoggedIn ? (
            <div className="d-flex login-buttons">
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          ) : (
            /* User profile dropdown (shown when logged in) */
            <div className="user-profile dropdown">
              <a 
                className="dropdown-toggle text-decoration-none d-flex align-items-center" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img 
                  src={user.avatar} 
                  className="rounded-circle me-2" 
                  width="32" 
                  height="32" 
                  alt="User Avatar" 
                />
                <span className="user-name">{user.name}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/dashboard">
                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/my-courses">
                    <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/achievements">
                    <FontAwesomeIcon icon={faMedal} className="me-2" />
                    Achievements
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
          
          {/* For demo purposes only - button to toggle logged in state */}
          <button 
            className="btn btn-sm btn-secondary ms-2" 
            onClick={toggleLoggedIn} 
            style={{ fontSize: '0.7rem', padding: '2px 5px' }}
          >
            {isLoggedIn ? 'Demo: Logout' : 'Demo: Login'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;