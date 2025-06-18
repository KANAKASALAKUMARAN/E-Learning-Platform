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
import { useAuth } from '../contexts/AuthContext';
import ProfilePictureUpload from '../components/common/ProfilePictureUpload';
import { DEFAULT_AVATAR } from '../constants/images';
import { getUserDisplayName, getUserRole, getWelcomeMessage } from '../utils/userUtils';

function ProfilePage() {
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
  const { user, updateProfile } = useAuth();

  // Get consistent user display values
  const displayName = getUserDisplayName(user, 'User');
  const userRole = getUserRole(user, 'Student');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        if (user) {
          populateFormData(user);
        } else {
          setError('Unable to load profile. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Unable to load profile. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);
  
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

  const handleAvatarChange = (avatarUrl) => {
    setFormData({ ...formData, avatar: avatarUrl });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem('token');

      await updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
                      <h3 className="fw-bold">{displayName}</h3>
                      <p className="text-muted mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        {user?.email || 'No email provided'}
                      </p>
                      {user?.occupation && (
                        <p className="text-muted mb-2">
                          <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                          {user.occupation}
                        </p>
                      )}
                      {user?.location && (
                        <p className="text-muted mb-2">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {user.location}
                        </p>
                      )}
                      {user?.website && (
                        <p className="mb-2">
                          <i className="fas fa-globe me-2"></i>
                          <a href={user.website} target="_blank" rel="noopener noreferrer">
                            {user.website}
                          </a>
                        </p>
                      )}
                      <p className="text-muted mb-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Joined {user?.joinDate || "May 2025"}
                      </p>
                    </div>
                    
                    {user?.bio ? (
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
                      {user?.education && user.education.length > 0 ? (
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
                      {user?.skills && user.skills.length > 0 ? (
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
                <div className="mb-4">
                  {isEditing ? (
                    <ProfilePictureUpload
                      currentAvatar={formData.avatar}
                      onAvatarChange={handleAvatarChange}
                      size="large"
                    />
                  ) : (
                    <div className="mx-auto" style={{ width: '120px', height: '120px' }}>
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt={displayName}
                          className="rounded-circle img-fluid border"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />
                      ) : (
                        <img
                          src={DEFAULT_AVATAR}
                          alt="Default Profile"
                          className="rounded-circle img-fluid border"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          onError={(e) => {
                            // If default avatar fails, show icon
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      )}
                      {/* Fallback icon for broken images */}
                      <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white position-absolute top-0 start-0"
                        style={{ width: '120px', height: '120px', display: 'none' }}
                      >
                        <FontAwesomeIcon icon={faUser} size="3x" />
                      </div>
                    </div>
                  )}
                </div>

                <h4 className="fw-bold">{displayName}</h4>
                <p className="text-muted mb-0">{userRole}</p>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">Learning Statistics</h5>
                
                <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                  <span>Courses Enrolled</span>
                  <span className="badge bg-primary">{user?.enrolledCourses?.length || 3}</span>
                </div>

                <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                  <span>Courses Completed</span>
                  <span className="badge bg-success">{user?.completedCourses?.length || 1}</span>
                </div>

                <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                  <span>Certificates Earned</span>
                  <span className="badge bg-info">{user?.certificates?.length || 1}</span>
                </div>

                <div className="stat-item d-flex justify-content-between align-items-center">
                  <span>Achievements</span>
                  <span className="badge bg-warning">{user?.achievements?.length || 2}</span>
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
                  <strong>Membership:</strong> {user?.membership || "Free"}
                </p>
                <p className="mb-0">
                  <strong>Joined:</strong> {user?.joinDate || "May 2025"}
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