import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUser,
  faSignOutAlt,
  faCog,
  faGraduationCap,
  faUserGraduate,
  faBell,
  faShoppingCart,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import AuthService from '../../services/api/authService';

function Header() {
  // Get user state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'User Name',
    avatar: '/assets/images/avatar-placeholder.jpg'
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Configuration for pages that should have dark navbar text
  const darkNavbarPages = ['/courses', '/about-us', '/contact', '/login', '/signup', '/dashboard', '/profile', '/settings'];

  // Check if current page should have dark navbar
  const shouldUseDarkNavbar = darkNavbarPages.includes(location.pathname) || isScrolled;
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
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

  // Focus search input when search is active
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchActive]);
  
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
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  return (
    <header>
      <nav className={`navbar navbar-expand-lg navbar-light fixed-top transition-all ${shouldUseDarkNavbar ? 'bg-white shadow-sm py-2' : 'bg-transparent py-3'}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold slide-in-left" to="/">
            <div className="d-flex align-items-center">
              <div className="brand-logo me-2 rounded-circle bg-primary d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faGraduationCap} className="text-white" />
              </div>
              <div>
                <span className={`${shouldUseDarkNavbar ? 'text-primary' : 'text-white'}`}>Learn</span>
                <span className={shouldUseDarkNavbar ? 'text-dark' : 'text-white'}>Hub</span>
              </div>
            </div>
          </Link>
          
          <button
            className={`navbar-toggler border-0 hover-shadow ${shouldUseDarkNavbar ? '' : 'text-white'}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
          >
            <span className={`navbar-toggler-icon ${shouldUseDarkNavbar ? '' : 'text-white'}`}></span>
          </button>
          
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              {[
                { path: '/', label: 'Home' },
                { path: '/courses', label: 'Courses' },
                { path: '/about-us', label: 'About Us' },
                { path: '/contact', label: 'Contact' }
              ].map((nav, index) => (
                <li className="nav-item fade-in" style={{animationDelay: `${0.1 * (index + 1)}s`}} key={nav.path}>
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link position-relative transition-all px-3 mx-1 ${isActive ? 'active fw-bold' : ''} ${shouldUseDarkNavbar ? 'text-dark' : 'text-white'}`
                    }
                    to={nav.path}
                  >
                    {nav.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            <div className="d-flex align-items-center gap-3 slide-in-right">
              {/* Search button and form */}
              <div className={`search-container position-relative ${searchActive ? 'active' : ''}`}>
                <button
                  className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center transition-all ${
                    shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                  } ${searchActive ? 'd-none' : ''}`}
                  onClick={toggleSearch}
                  style={{ width: '38px', height: '38px' }}
                >
                  <FontAwesomeIcon icon={faSearch} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                </button>
                
                <form 
                  className={`search-form position-absolute end-0 bg-white rounded-pill shadow transition-all ${
                    searchActive ? 'active scale-in' : 'opacity-0'
                  }`} 
                  onSubmit={handleSearch}
                  style={{ 
                    top: 0,
                    width: searchActive ? '280px' : '50px',
                    overflow: 'hidden'
                  }}
                >
                  <div className="input-group">
                    <input
                      type="text"
                      ref={searchInputRef}
                      className="form-control border-0 shadow-none"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-link text-primary" type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <button 
                      className="btn btn-link text-muted" 
                      type="button"
                      onClick={() => {
                        setSearchActive(false);
                        setSearchQuery('');
                      }}
                    >
                      ×
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Notification and Wishlist for logged in users */}
              {isLoggedIn && (
                <>
                  <div className="position-relative mx-1">
                    <button
                      className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center hover-lift transition-all ${
                        shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                    >
                      <FontAwesomeIcon icon={faBell} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        2
                      </span>
                    </button>
                  </div>
                  
                  <div className="position-relative mx-1">
                    <Link
                      to="/wishlist"
                      className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center hover-lift transition-all ${
                        shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                    >
                      <FontAwesomeIcon icon={faHeart} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                    </Link>
                  </div>
                  
                  <div className="position-relative mx-1">
                    <Link
                      to="/cart"
                      className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center hover-lift transition-all ${
                        shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                        3
                      </span>
                    </Link>
                  </div>
                </>
              )}
              
              {/* Login/Register buttons for non-logged in users */}
              {!isLoggedIn ? (
                <div className="login-buttons d-flex gap-2">
                  <button 
                    className="btn btn-animated btn-success btn-sm rounded-pill hover-lift"
                    onClick={handleDemoLogin}
                  >
                    <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                    Demo
                  </button>
                  <Link to="/login" className={`btn btn-animated ${shouldUseDarkNavbar ? 'btn-outline-primary' : 'btn-outline-light'} btn-sm rounded-pill hover-lift`}>Log In</Link>
                  <Link to="/signup" className="btn btn-animated btn-primary btn-sm rounded-pill hover-lift">Sign Up</Link>
                </div>
              ) : (
                <div className="dropdown">
                  <button
                    className="dropdown-toggle text-decoration-none d-flex align-items-center hover-lift btn btn-link border-0 p-0"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center">
                      {user.avatar ? (
                        <div className="img-hover-zoom rounded-circle overflow-hidden border border-2 shadow-sm" style={{ width: '38px', height: '38px' }}>
                          <img 
                            src={user.avatar} 
                            alt="Profile" 
                            className="w-100 h-100" 
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center transition-all hover-scale"
                             style={{ width: '38px', height: '38px' }}>
                          <FontAwesomeIcon icon={faUser} size="sm" />
                        </div>
                      )}
                      <span className={`user-name d-none d-md-inline ms-2 fw-medium ${shouldUseDarkNavbar ? 'text-dark' : 'text-white'}`}>
                        {user.name}
                      </span>
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 scale-in" aria-labelledby="userDropdown" style={{ minWidth: '220px' }}>
                    <li className="px-3 py-2 d-flex align-items-center border-bottom">
                      <div className="rounded-circle overflow-hidden me-2" style={{ width: '32px', height: '32px' }}>
                        <img src={user.avatar} alt="User" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div className="fw-bold">{user.name}</div>
                        <div className="text-muted small">Student</div>
                      </div>
                    </li>
                    {[
                      {to: '/dashboard', icon: faGraduationCap, text: 'My Dashboard', color: '#4a6bff'},
                      {to: '/profile', icon: faUser, text: 'My Profile', color: '#00c16e'},
                      {to: '/settings', icon: faCog, text: 'Account Settings', color: '#6a11cb'},
                    ].map((item, i) => (
                      <li key={item.to}>
                        <Link 
                          className="dropdown-item py-2 hover-bg transition-colors" 
                          to={item.to}
                          style={{animationDelay: `${0.05 * (i + 1)}s`}}
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-2 rounded-circle d-flex align-items-center justify-content-center" 
                                style={{ width: '28px', height: '28px', backgroundColor: `${item.color}15` }}>
                              <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} />
                            </div>
                            {item.text}
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item py-2 hover-bg transition-colors" 
                        onClick={handleLogout}
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-2 rounded-circle d-flex align-items-center justify-content-center" 
                              style={{ width: '28px', height: '28px', backgroundColor: '#ff506915' }}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-danger" />
                          </div>
                          Logout
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Custom CSS for navbar */}
      <style jsx="true">{`
        .search-form.active {
          z-index: 100;
        }

        .dropdown-toggle::after {
          display: none;
        }

        /* Ensure no underlines on nav links */
        .navbar-nav .nav-link {
          text-decoration: none !important;
          border-bottom: none !important;
        }

        .navbar-nav .nav-link:focus,
        .navbar-nav .nav-link:active {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </header>
  );
}

export default Header;