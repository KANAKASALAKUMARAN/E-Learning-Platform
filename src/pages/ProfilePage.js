import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faEdit, 
  faSave, 
  faCamera,
  faGraduationCap,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import authService from '../services/api/authService';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    occupation: '',
    location: '',
    website: '',
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Check if this is a demo user first
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (token && token.startsWith('demo-token-')) {
          // Use demo data from localStorage
          setUser(storedUser);
          populateFormData(storedUser);
          setLoading(false);
          return;
        }

        // Try to get user profile from API for real users
        const userData = await authService.getUserProfile();
        setUser(userData);
        populateFormData(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Fallback to localStorage for demo
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (storedUser) {
          setUser(storedUser);
          populateFormData(storedUser);
        } else {
          setError('Unable to load profile. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);
  
  const populateFormData = (userData) => {
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      bio: userData.bio || '',
      occupation: userData.occupation || '',
      location: userData.location || '',
      website: userData.website || '',
      avatar: userData.avatar || ''
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (token && token.startsWith('demo-token-')) {
        // For demo users, just update localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        // Call API to update profile for real users
        await authService.updateProfile(formData);

        // Update user in localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        setUser(updatedUser);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');

      // For demo, update anyway
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For a real implementation, you would upload the file to your server
    // and get back a URL. For this demo, we'll create a local object URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, avatar: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="container py-4">
        {/* Profile Header */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="fw-bold">My Profile</h1>
              {!isEditing ? (
                <button 
                  className="btn btn-outline-primary" 
                  onClick={() => setIsEditing(true)}
                  disabled={saving}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit Profile
                </button>
              ) : (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    populateFormData(user);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
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
          {/* Profile Content */}
          <div className="col-lg-8 order-lg-1 order-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {!isEditing ? (
                  /* View Mode */
                  <div className="profile-view">
                    <div className="mb-4">
                      <h3 className="fw-bold">{user.name}</h3>
                      <p className="text-muted mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        {user.email}
                      </p>
                      {user.occupation && (
                        <p className="text-muted mb-2">
                          <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                          {user.occupation}
                        </p>
                      )}
                      {user.location && (
                        <p className="text-muted mb-2">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {user.location}
                        </p>
                      )}
                      {user.website && (
                        <p className="mb-2">
                          <i className="fas fa-globe me-2"></i>
                          <a href={user.website} target="_blank" rel="noopener noreferrer">
                            {user.website}
                          </a>
                        </p>
                      )}
                      <p className="text-muted mb-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Joined {user.joinDate || "May 2025"}
                      </p>
                    </div>
                    
                    {user.bio ? (
                      <div className="profile-bio mb-4">
                        <h5>About Me</h5>
                        <p>{user.bio}</p>
                      </div>
                    ) : (
                      <div className="profile-bio mb-4">
                        <h5>About Me</h5>
                        <p className="text-muted fst-italic">No bio information added yet.</p>
                      </div>
                    )}
                    
                    {/* Education Section */}
                    <div className="profile-education mb-4">
                      <h5>Education</h5>
                      {user.education && user.education.length > 0 ? (
                        user.education.map((edu, index) => (
                          <div key={index} className="mb-2">
                            <h6 className="mb-0">{edu.degree}</h6>
                            <p className="mb-0">{edu.institution}</p>
                            <p className="text-muted">{edu.year}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted fst-italic">No education information added yet.</p>
                      )}
                    </div>
                    
                    {/* Skills Section */}
                    <div className="profile-skills">
                      <h5>Skills</h5>
                      {user.skills && user.skills.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span key={index} className="badge bg-light text-dark py-2 px-3">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted fst-italic">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="bio" className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        id="bio"
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="occupation" className="form-label">Occupation</label>
                        <input
                          type="text"
                          className="form-control"
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="e.g. Software Developer"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. New York, USA"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="website" className="form-label">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="e.g. https://yourwebsite.com"
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
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Sidebar */}
          <div className="col-lg-4 order-lg-2 order-1 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm text-center mb-4">
              <div className="card-body p-4">
                <div className="position-relative mb-4 mx-auto" style={{ width: '150px', height: '150px' }}>
                  {isEditing && (
                    <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                      <label htmlFor="avatar-upload" className="btn btn-sm btn-primary rounded-circle">
                        <FontAwesomeIcon icon={faCamera} />
                        <input
                          type="file"
                          id="avatar-upload"
                          className="d-none"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  )}
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className="rounded-circle img-fluid border"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                      style={{ width: '150px', height: '150px' }}
                    >
                      <FontAwesomeIcon icon={faUser} size="4x" />
                    </div>
                  )}
                </div>
                
                <h4 className="fw-bold">{user.name}</h4>
                <p className="text-muted mb-0">{user.role || "Student"}</p>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">Learning Statistics</h5>
                
                <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                  <span>Courses Enrolled</span>
                  <span className="badge bg-primary">{user.enrolledCourses?.length || 3}</span>
                </div>
                
                <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                  <span>Courses Completed</span>
                  <span className="badge bg-success">{user.completedCourses?.length || 1}</span>
                </div>
                
                <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                  <span>Certificates Earned</span>
                  <span className="badge bg-info">{user.certificates?.length || 1}</span>
                </div>
                
                <div className="stat-item d-flex justify-content-between align-items-center">
                  <span>Achievements</span>
                  <span className="badge bg-warning">{user.achievements?.length || 2}</span>
                </div>
              </div>
            </div>
            
            {/* Account Info */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold">Account Info</h5>
                <p className="mb-2">
                  <strong>Status:</strong> <span className="text-success">Active</span>
                </p>
                <p className="mb-2">
                  <strong>Membership:</strong> {user.membership || "Free"}
                </p>
                <p className="mb-0">
                  <strong>Joined:</strong> {user.joinDate || "May 2025"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;