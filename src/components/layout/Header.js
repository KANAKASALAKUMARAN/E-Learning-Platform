import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faUser,
  faSignOutAlt,
  faCog,
  faGraduationCap,
  faTrophy,
  faBook,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons';
import AuthService from '../../services/api/authService';

function Header() {
  // Get user state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'User Name',
    avatar: '/assets/images/avatar-placeholder.jpg'
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setIsLoggedIn(true);
      const userData = JSON.parse(storedUser);
      setUser({
        name: userData.name,
        avatar: userData.avatar || '/assets/images/avatar-placeholder.jpg'
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleDemoLogin = () => {
    // Use the authService for demo login
    const { user: demoUser } = AuthService.demoLogin();
    
    // Update local state
    setIsLoggedIn(true);
    setUser({
      name: demoUser.name,
      avatar: demoUser.avatar || '/assets/images/avatar-placeholder.jpg'
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
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
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Login/Register buttons for non-logged in users */}
            {!isLoggedIn ? (
              <div className="login-buttons d-flex gap-2">
                <button 
                  className="btn btn-success btn-sm"
                  onClick={handleDemoLogin}
                >
                  <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                  Demo
                </button>
                <Link to="/login" className="btn btn-outline-primary btn-sm">Log In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            ) : (
              <div className="dropdown">
                <a 
                  className="dropdown-toggle text-decoration-none d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="d-flex align-items-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="rounded-circle border" 
                        width="32" 
                        height="32" 
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                           style={{ width: '32px', height: '32px' }}>
                        <FontAwesomeIcon icon={faUser} size="sm" />
                      </div>
                    )}
                    <span className="user-name d-none d-md-inline ms-2 fw-medium text-dark">
                      {user.name}
                    </span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;