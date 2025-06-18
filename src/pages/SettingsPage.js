import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faBell,
  faUserShield,
  faTrash,
  faEnvelope,
  faSave,
  faShieldAlt,
  faMoon,
  faDesktop,
  faUser,
  faSun,
  faPalette,
  faGlobe,
  faTextHeight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getWelcomeMessage } from '../utils/userUtils';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState(null);

  // Use contexts
  const { user, updateProfile } = useAuth();
  const {
    theme,
    fontSize,
    reduceAnimations,
    highContrast,
    language,
    updateTheme,
    updateFontSize,
    updateReduceAnimations,
    updateHighContrast,
    updateLanguage
  } = useTheme();
  
  // Form states
  const [accountSettings, setAccountSettings] = useState({
    email: '',
    language: 'english',
    timeZone: 'UTC',
    contentLanguage: 'english'
  });
  
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailCourseUpdates: true,
    emailNewMessages: true,
    emailPromotions: false,
    emailNewsletter: false,
    browserNotifications: true,
    mobileNotifications: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEnrolledCourses: true,
    showCompletedCourses: true,
    allowMessaging: true,
    shareAchievements: true,
    allowDataCollection: true
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    fontSize: fontSize,
    reduceAnimations: reduceAnimations,
    highContrast: highContrast,
    language: language
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (user) {
          // Use defaults with user's email
          setAccountSettings(prev => ({ ...prev, email: user.email }));
        } else {
          setError('Unable to load user settings. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Unable to load user settings. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);
  
  // Handle form changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings({ ...accountSettings, [name]: value });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordSettings({ ...passwordSettings, [name]: value });
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };
  
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setPrivacySettings({ ...privacySettings, [name]: newValue });
  };
  
  const handleAppearanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setAppearanceSettings({ ...appearanceSettings, [name]: newValue });

    // Apply changes immediately to theme context
    switch (name) {
      case 'theme':
        updateTheme(newValue);
        break;
      case 'fontSize':
        updateFontSize(newValue);
        break;
      case 'reduceAnimations':
        updateReduceAnimations(newValue);
        break;
      case 'highContrast':
        updateHighContrast(newValue);
        break;
      case 'language':
        updateLanguage(newValue);
        break;
      default:
        break;
    }
  };
  
  // Handle form submissions
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      // For a real app, call an API to update settings
      // await authService.updateSettings('account', accountSettings);
      
      // For demo, save to localStorage
      const updatedUser = { 
        ...user, 
        settings: { 
          ...user.settings,
          account: accountSettings 
        } 
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setSuccessMsg('Account settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving account settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordSettings.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // For a real app, call API to change password
      // await authService.changePassword(passwordSettings);
      
      setSuccessMsg('Password changed successfully!');
      setPasswordSettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please verify your current password.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();  // Add this line to prevent form submission
    try {
      setSaving(true);
      setError(null);
      
      // For a real app, call API to update notification settings
      // await authService.updateSettings('notifications', notificationSettings);
      
      // For demo, save to localStorage
      const updatedUser = { 
        ...user, 
        settings: { 
          ...user.settings,
          notifications: notificationSettings 
        } 
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setSuccessMsg('Notification settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving notification settings:', err);
      setError('Failed to save notification settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      // For a real app, call API to update privacy settings
      // await authService.updateSettings('privacy', privacySettings);
      
      // For demo, save to localStorage
      const updatedUser = { 
        ...user, 
        settings: { 
          ...user.settings,
          privacy: privacySettings 
        } 
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setSuccessMsg('Privacy settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      setError('Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleAppearanceSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      // For a real app, call API to update appearance settings
      // await authService.updateSettings('appearance', appearanceSettings);
      
      // For demo, save to localStorage
      const updatedUser = { 
        ...user, 
        settings: { 
          ...user.settings,
          appearance: appearanceSettings 
        } 
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Apply theme changes
      document.documentElement.setAttribute('data-theme', appearanceSettings.theme);
      
      setSuccessMsg('Appearance settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving appearance settings:', err);
      setError('Failed to save appearance settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // For a real app, call API to delete user account
      // await deleteAccount();

      alert('In a real application, your account would be deleted. For this demo, you will be logged out.');
      // Use logout from auth context
      window.location.href = '/';
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your settings...</p>
      </div>
    );
  }
  
  return (
    <div className="settings-container">
      <div className="container py-4">
        {/* Settings Header */}
        <div className="row mb-4">
          <div className="col-md-12">
            <h1 className="fw-bold">Settings</h1>
            <p className="text-muted">{getWelcomeMessage(user, 'settings')}</p>
          </div>
        </div>
        
        {/* Success or Error Messages */}
        {successMsg && (
          <div className="alert alert-success">{successMsg}</div>
        )}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="row">
          {/* Settings Navigation */}
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm">
              <div className="list-group list-group-flush rounded">
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Account
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  Password
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  Notifications
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'privacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  <FontAwesomeIcon icon={faUserShield} className="me-2" />
                  Privacy
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'appearance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <FontAwesomeIcon icon={faDesktop} className="me-2" />
                  Appearance
                </button>
              </div>
              
              <div className="card-body border-top">
                <button 
                  className="btn btn-outline-danger w-100"
                  onClick={handleDeleteAccount}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          
          {/* Settings Content */}
          <div className="col-md-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Account Settings Tab */}
                {activeTab === 'account' && (
                  <>
                    <h4 className="card-title mb-4">Account Settings</h4>
                    <form onSubmit={handleAccountSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={accountSettings.email}
                          onChange={handleAccountChange}
                          disabled
                        />
                        <small className="text-muted">You cannot change your email address directly. Please contact support.</small>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="language" className="form-label">Interface Language</label>
                        <select 
                          className="form-select" 
                          id="language" 
                          name="language"
                          value={accountSettings.language}
                          onChange={handleAccountChange}
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="chinese">Chinese</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="timeZone" className="form-label">Time Zone</label>
                        <select 
                          className="form-select" 
                          id="timeZone" 
                          name="timeZone"
                          value={accountSettings.timeZone}
                          onChange={handleAccountChange}
                        >
                          <option value="UTC">UTC (Coordinated Universal Time)</option>
                          <option value="EST">EST (Eastern Standard Time)</option>
                          <option value="PST">PST (Pacific Standard Time)</option>
                          <option value="CET">CET (Central European Time)</option>
                          <option value="JST">JST (Japan Standard Time)</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="contentLanguage" className="form-label">Content Language Preference</label>
                        <select 
                          className="form-select" 
                          id="contentLanguage" 
                          name="contentLanguage"
                          value={accountSettings.contentLanguage}
                          onChange={handleAccountChange}
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="chinese">Chinese</option>
                        </select>
                        <small className="text-muted">We'll prioritize showing content in this language when available.</small>
                      </div>
                      
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
                
                {/* Password Tab */}
                {activeTab === 'password' && (
                  <>
                    <h4 className="card-title mb-4">Change Password</h4>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordSettings.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={passwordSettings.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                        />
                        <small className="text-muted">Password must be at least 8 characters long</small>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordSettings.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faLock} className="me-2" />
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    
                    <div className="mt-4 border-top pt-4">
                      <h5>Two-Factor Authentication</h5>
                      <p className="text-muted mb-3">Enhance your account security with two-factor authentication.</p>
                      
                      <div className="d-grid gap-2 d-md-flex">
                        <button className="btn btn-outline-primary">
                          <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                          Set Up 2FA
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <>
                    <h4 className="card-title mb-4">Notification Settings</h4>
                    <form onSubmit={handleNotificationsSubmit}>
                      <h5 className="mb-3">Email Notifications</h5>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="emailCourseUpdates"
                          name="emailCourseUpdates"
                          checked={notificationSettings.emailCourseUpdates}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="emailCourseUpdates">
                          Course updates and announcements
                        </label>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="emailNewMessages"
                          name="emailNewMessages"
                          checked={notificationSettings.emailNewMessages}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="emailNewMessages">
                          New messages and comments
                        </label>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="emailPromotions"
                          name="emailPromotions"
                          checked={notificationSettings.emailPromotions}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="emailPromotions">
                          Promotional emails and special offers
                        </label>
                      </div>
                      
                      <div className="mb-4 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="emailNewsletter"
                          name="emailNewsletter"
                          checked={notificationSettings.emailNewsletter}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="emailNewsletter">
                          Weekly newsletter and learning tips
                        </label>
                      </div>
                      
                      <h5 className="mb-3">Push Notifications</h5>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="browserNotifications"
                          name="browserNotifications"
                          checked={notificationSettings.browserNotifications}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="browserNotifications">
                          Browser notifications
                        </label>
                      </div>
                      
                      <div className="mb-4 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="mobileNotifications"
                          name="mobileNotifications"
                          checked={notificationSettings.mobileNotifications}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="mobileNotifications">
                          Mobile app notifications
                        </label>
                      </div>
                      
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
                
                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <>
                    <h4 className="card-title mb-4">Privacy Settings</h4>
                    <form onSubmit={handlePrivacySubmit}>
                      <div className="mb-3">
                        <label htmlFor="profileVisibility" className="form-label">Profile Visibility</label>
                        <select 
                          className="form-select" 
                          id="profileVisibility" 
                          name="profileVisibility"
                          value={privacySettings.profileVisibility}
                          onChange={handlePrivacyChange}
                        >
                          <option value="public">Public - Anyone can view your profile</option>
                          <option value="enrolled">Enrolled - Only users enrolled in your courses</option>
                          <option value="private">Private - Only you can see your profile</option>
                        </select>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="showEnrolledCourses"
                          name="showEnrolledCourses"
                          checked={privacySettings.showEnrolledCourses}
                          onChange={handlePrivacyChange}
                        />
                        <label className="form-check-label" htmlFor="showEnrolledCourses">
                          Show enrolled courses on my profile
                        </label>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="showCompletedCourses"
                          name="showCompletedCourses"
                          checked={privacySettings.showCompletedCourses}
                          onChange={handlePrivacyChange}
                        />
                        <label className="form-check-label" htmlFor="showCompletedCourses">
                          Show completed courses and certificates on my profile
                        </label>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="allowMessaging"
                          name="allowMessaging"
                          checked={privacySettings.allowMessaging}
                          onChange={handlePrivacyChange}
                        />
                        <label className="form-check-label" htmlFor="allowMessaging">
                          Allow other users to send me messages
                        </label>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="shareAchievements"
                          name="shareAchievements"
                          checked={privacySettings.shareAchievements}
                          onChange={handlePrivacyChange}
                        />
                        <label className="form-check-label" htmlFor="shareAchievements">
                          Share my achievements and badges publicly
                        </label>
                      </div>
                      
                      <div className="mb-4 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="allowDataCollection"
                          name="allowDataCollection"
                          checked={privacySettings.allowDataCollection}
                          onChange={handlePrivacyChange}
                        />
                        <label className="form-check-label" htmlFor="allowDataCollection">
                          Allow data collection to improve learning experience
                        </label>
                        <div className="form-text">
                          We collect anonymous usage data to improve our platform and personalize your experience.
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-4 pt-3 border-top">
                        <h5>Download Your Data</h5>
                        <p className="text-muted">You can request a copy of your personal data at any time.</p>
                        <button type="button" className="btn btn-outline-primary">
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Request Data Export
                        </button>
                      </div>
                    </form>
                  </>
                )}
                
                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <>
                    <h4 className="card-title mb-4">Appearance Settings</h4>
                    <form onSubmit={handleAppearanceSubmit}>
                      <div className="mb-4">
                        <label className="form-label d-block">Theme</label>
                        <div className="d-flex gap-3 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="theme"
                              id="lightTheme"
                              value="light"
                              checked={appearanceSettings.theme === 'light'}
                              onChange={handleAppearanceChange}
                            />
                            <label className="form-check-label" htmlFor="lightTheme">
                              <FontAwesomeIcon icon={faDesktop} className="me-2" />
                              Light
                            </label>
                          </div>
                          
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="theme"
                              id="darkTheme"
                              value="dark"
                              checked={appearanceSettings.theme === 'dark'}
                              onChange={handleAppearanceChange}
                            />
                            <label className="form-check-label" htmlFor="darkTheme">
                              <FontAwesomeIcon icon={faMoon} className="me-2" />
                              Dark
                            </label>
                          </div>
                          
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="theme"
                              id="systemTheme"
                              value="system"
                              checked={appearanceSettings.theme === 'system'}
                              onChange={handleAppearanceChange}
                            />
                            <label className="form-check-label" htmlFor="systemTheme">
                              <FontAwesomeIcon icon={faDesktop} className="me-2" />
                              System
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="fontSize" className="form-label">Font Size</label>
                        <select 
                          className="form-select" 
                          id="fontSize" 
                          name="fontSize"
                          value={appearanceSettings.fontSize}
                          onChange={handleAppearanceChange}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="x-large">Extra Large</option>
                        </select>
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="reduceAnimations"
                          name="reduceAnimations"
                          checked={appearanceSettings.reduceAnimations}
                          onChange={handleAppearanceChange}
                        />
                        <label className="form-check-label" htmlFor="reduceAnimations">
                          Reduce animations
                        </label>
                      </div>
                      
                      <div className="mb-4 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="highContrast"
                          name="highContrast"
                          checked={appearanceSettings.highContrast}
                          onChange={handleAppearanceChange}
                        />
                        <label className="form-check-label" htmlFor="highContrast">
                          High contrast mode
                        </label>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="language" className="form-label">
                          <FontAwesomeIcon icon={faGlobe} className="me-2" />
                          Language
                        </label>
                        <select
                          className="form-select"
                          id="language"
                          name="language"
                          value={appearanceSettings.language}
                          onChange={handleAppearanceChange}
                        >
                          <option value="english">English</option>
                          <option value="spanish">Español</option>
                          <option value="french">Français</option>
                          <option value="german">Deutsch</option>
                          <option value="chinese">中文</option>
                          <option value="japanese">日本語</option>
                        </select>
                        <small className="text-muted">Select your preferred language</small>
                      </div>

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;