import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCog,
  faTachometerAlt,
  faSignOutAlt,
  faChevronDown,
  faUserCircle,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_AVATAR } from '../../constants/images';
import { getUserDisplayName, getUserRole } from '../../utils/userUtils';

const UserProfileDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleMenuItemClick = (path) => {
    setIsOpen(false);
    if (path) {
      navigate(path);
    }
  };

  const getAvatarSrc = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return DEFAULT_AVATAR;
  };

  const displayName = getUserDisplayName(user);
  const userRole = getUserRole(user);

  if (!user) {
    return null;
  }

  return (
    <div className={`dropdown user-profile-dropdown ${className}`} ref={dropdownRef}>
      <button
        className="btn btn-link dropdown-toggle d-flex align-items-center text-decoration-none p-0 border-0 bg-transparent"
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="d-flex align-items-center">
          <div className="avatar-container me-2">
            <img
              src={getAvatarSrc()}
              alt={displayName}
              className="rounded-circle"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR;
              }}
            />
          </div>
          <div className="user-info d-none d-md-block text-start">
            <div className="user-name fw-semibold text-dark" style={{ fontSize: '14px', lineHeight: '1.2' }}>
              {displayName}
            </div>
            <div className="user-role text-muted" style={{ fontSize: '12px', lineHeight: '1.2' }}>
              {userRole}
            </div>
          </div>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`ms-2 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
            style={{ fontSize: '12px' }}
          />
        </div>
      </button>

      <div className={`dropdown-menu dropdown-menu-end shadow-lg border-0 ${isOpen ? 'show' : ''}`} style={{ minWidth: '250px' }}>
        {/* User Info Header */}
        <div className="dropdown-header bg-light border-bottom">
          <div className="d-flex align-items-center">
            <img
              src={getAvatarSrc()}
              alt={displayName}
              className="rounded-circle me-3"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <div className="fw-semibold text-dark">{displayName}</div>
              <div className="text-muted small">{user?.email}</div>
              <div className="badge bg-primary small">{userRole}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <Link 
          to="/profile" 
          className="dropdown-item d-flex align-items-center py-2"
          onClick={() => handleMenuItemClick()}
        >
          <FontAwesomeIcon icon={faUser} className="me-3 text-primary" style={{ width: '16px' }} />
          View Profile
        </Link>

        <Link 
          to="/dashboard" 
          className="dropdown-item d-flex align-items-center py-2"
          onClick={() => handleMenuItemClick()}
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="me-3 text-success" style={{ width: '16px' }} />
          Dashboard
        </Link>

        <Link 
          to="/settings" 
          className="dropdown-item d-flex align-items-center py-2"
          onClick={() => handleMenuItemClick()}
        >
          <FontAwesomeIcon icon={faCog} className="me-3 text-info" style={{ width: '16px' }} />
          Settings
        </Link>

        <div className="dropdown-divider"></div>

        {/* Theme Toggle */}
        <button
          className="dropdown-item d-flex align-items-center py-2"
          onClick={() => {
            toggleTheme();
            setIsOpen(false);
          }}
        >
          <FontAwesomeIcon 
            icon={theme === 'dark' ? faSun : faMoon} 
            className="me-3 text-warning" 
            style={{ width: '16px' }} 
          />
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="dropdown-divider"></div>

        {/* Logout */}
        <button
          className="dropdown-item d-flex align-items-center py-2 text-danger"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-3" style={{ width: '16px' }} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
