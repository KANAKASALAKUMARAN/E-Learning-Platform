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
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import UserProfileDropdown from '../common/UserProfileDropdown';

function Header() {
  // Use authentication and cart contexts
  const { user, isAuthenticated, demoLogin } = useAuth();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartBounce, setCartBounce] = useState(false);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Cart bounce effect when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Configuration for pages that should have dark navbar text
  const darkNavbarPages = ['/courses', '/about-us', '/contact', '/login', '/signup', '/dashboard', '/profile', '/settings', '/cart'];

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

  // Focus search input when search is active
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchActive]);

  const handleDemoLogin = async () => {
    try {
      demoLogin();
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
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
              {isAuthenticated && (
                <>
                  <div className="position-relative mx-1">
                    <button
                      className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center hover-lift transition-all ${
                        shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                      title="Notifications"
                    >
                      <FontAwesomeIcon icon={faBell} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                      {/* Notification badge will be shown only when there are actual notifications */}
                    </button>
                  </div>

                  <div className="position-relative mx-1">
                    <Link
                      to="/wishlist"
                      className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center hover-lift transition-all ${
                        shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                      title="Wishlist"
                    >
                      <FontAwesomeIcon icon={faHeart} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                    </Link>
                  </div>

                  <div className="position-relative mx-1">
                    <Link
                      to="/cart"
                      className={`btn btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center hover-lift transition-all ${
                        shouldUseDarkNavbar ? 'btn-light' : 'btn-outline-light'
                      } ${cartBounce ? 'cart-bounce' : ''}`}
                      style={{ width: '38px', height: '38px' }}
                      title={`Shopping Cart (${cartCount} items)`}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className={shouldUseDarkNavbar ? 'text-primary' : 'text-white'} />
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary cart-badge">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </>
              )}
              
              {/* Login/Register buttons for non-logged in users */}
              {!isAuthenticated ? (
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
                <UserProfileDropdown />
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

        /* Cart animations */
        .cart-bounce {
          animation: cartBounce 0.6s ease-in-out;
        }

        @keyframes cartBounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.1); }
        }

        .cart-badge {
          animation: badgePulse 0.3s ease-in-out;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        @keyframes badgePulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Hover effects for cart */
        .btn-icon:hover .cart-badge {
          transform: scale(1.1);
        }
      `}</style>
    </header>
  );
}

export default Header;