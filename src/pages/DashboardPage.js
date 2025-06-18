import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCertificate, 
  faChartLine, 
  faBook, 
  faSyncAlt, 
  faLock,
  faStar,
  faStarHalfAlt,
  faTrophy,
  faMedal,
  faAward
} from '@fortawesome/free-solid-svg-icons';
import authService from '../services/api/authService';
import CourseService from '../services/api/courseService';
import { DEFAULT_AVATAR } from '../constants/images';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Check if this is a demo user first
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (token && token.startsWith('demo-token-')) {
          // Use demo data from localStorage
          setUser(storedUser);
          setEnrolledCourses(storedUser.enrolledCourses || []);
          setAchievements(storedUser.achievements || []);
          setLoading(false);
          return;
        }

        // Get user profile data for real users
        const userData = await authService.getUserProfile();
        setUser(userData);
        
        // Get enrolled courses
        if (userData.enrolledCourses && userData.enrolledCourses.length > 0) {
          // If enrolledCourses are objects with IDs
          if (typeof userData.enrolledCourses[0] === 'object') {
            setEnrolledCourses(userData.enrolledCourses);
          } else {
            // If enrolledCourses are just IDs, fetch the course data
            const coursePromises = userData.enrolledCourses.map(courseId => 
              CourseService.getCourseById(courseId)
            );
            const coursesData = await Promise.all(coursePromises);
            setEnrolledCourses(coursesData);
          }
        }
        
        // Get achievements (if available)
        if (userData.achievements) {
          setAchievements(userData.achievements);
        } else {
          // Sample achievements for demo purposes
          setAchievements([
            { 
              id: 1, 
              title: 'First Course Completed', 
              description: 'You completed your first course!',
              date: '2025-04-28',
              icon: faTrophy
            },
            {
              id: 2,
              title: 'Learning Streak',
              description: "You've been learning for 7 consecutive days",
              date: '2025-04-20',
              icon: faMedal
            },
            {
              id: 3,
              title: 'Quiz Master',
              description: 'You scored 100% on a course quiz',
              date: '2025-04-15',
              icon: faAward
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Fallback to localStorage for demo
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
          setUser(storedUser);
          
          // Demo sample courses
          setEnrolledCourses([
            {
              _id: '1',
              title: 'Introduction to Data Science',
              description: 'Learn the basics of data science and analysis',
              progress: 100,
              instructor: { name: 'John Smith' },
              image: '/assets/images/course1.jpg',
              completedAt: '2025-04-28'
            },
            {
              _id: '2',
              title: 'Data Analysis with Python',
              description: 'Master data analysis using Python libraries',
              progress: 65,
              instructor: { name: 'Sarah Johnson' },
              image: '/assets/images/course2.jpg',
              lastAccessed: '2025-05-01'
            },
            {
              _id: '3',
              title: 'Machine Learning Fundamentals',
              description: 'Introduction to machine learning concepts',
              progress: 0,
              instructor: { name: 'David Chen' },
              image: '/assets/images/course3.jpg'
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error && !user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
        <div className="text-center">
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container py-4">
        {/* Dashboard Header */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h1 className="fw-bold">Dashboard</h1>
            <p className="text-muted mb-md-0">Welcome back, {user?.name || 'Student'}! Continue your learning journey.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/courses" className="btn btn-primary">
              <i className="fas fa-plus me-1"></i> Browse More Courses
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="row mb-4">
          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <FontAwesomeIcon icon={faBook} className="text-primary fa-2x" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{enrolledCourses.length}</h3>
                  <p className="text-muted mb-0">Enrolled Courses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <FontAwesomeIcon icon={faCertificate} className="text-success fa-2x" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{enrolledCourses.filter(course => course.progress === 100).length}</h3>
                  <p className="text-muted mb-0">Completed Courses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <FontAwesomeIcon icon={faChartLine} className="text-info fa-2x" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">
                    {Math.round(
                      enrolledCourses.reduce((total, course) => total + (course.progress || 0), 0) / 
                      (enrolledCourses.length || 1)
                    )}%
                  </h3>
                  <p className="text-muted mb-0">Average Progress</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-warning fa-2x" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{achievements.length}</h3>
                  <p className="text-muted mb-0">Achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* My Courses Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 fw-bold">My Courses</h5>
                <Link to="/my-courses" className="text-decoration-none">View All</Link>
              </div>
              <div className="card-body">
                {enrolledCourses.length > 0 ? (
                  <div className="my-courses-list">
                    {enrolledCourses.map((course, index) => (
                      <div key={course._id || index} className="card mb-3 border-0 shadow-sm">
                        <div className="row g-0">
                          <div className="col-md-3">
                            <img 
                              src={course.image || `/assets/images/course${index + 1}.jpg`} 
                              className="img-fluid rounded-start" 
                              alt={course.title} 
                              style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="card-body">
                              <h5 className="card-title">{course.title}</h5>
                              <div className="d-flex align-items-center mb-2">
                                <img
                                  src={course.instructor?.image || DEFAULT_AVATAR}
                                  className="rounded-circle me-2"
                                  width="25"
                                  height="25"
                                  alt="Instructor"
                                  onError={(e) => {
                                    e.target.src = DEFAULT_AVATAR;
                                  }}
                                />
                                <small>{course.instructor?.name || "Instructor"}</small>
                              </div>
                              <div className="progress mb-2" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  role="progressbar" 
                                  style={{ width: `${course.progress || 0}%` }} 
                                  aria-valuenow={course.progress || 0} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">{course.progress || 0}% Complete</small>
                                <Link to={`/course/${course._id}`} className="btn btn-sm btn-outline-primary">
                                  {course.progress === 100 ? 'Review' : course.progress > 0 ? 'Continue' : 'Start'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FontAwesomeIcon icon={faBook} className="text-muted mb-3" size="3x" />
                    <h5>No Enrolled Courses</h5>
                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Learning Path */}
            <div className="card border-0 shadow-sm mb-4 mb-lg-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Learning Path</h5>
              </div>
              <div className="card-body">
                <div className="learning-path">
                  <div className="d-flex align-items-center mb-4">
                    <div className="learning-path-icon completed me-3">
                      <FontAwesomeIcon icon={faGraduationCap} />
                    </div>
                    <div>
                      <h5 className="mb-1">Introduction to Data Science</h5>
                      <p className="mb-0 text-muted">Completed on Apr 28, 2025</p>
                    </div>
                    <div className="ms-auto">
                      <span className="badge bg-success">Completed</span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div className="learning-path-icon current me-3">
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </div>
                    <div>
                      <h5 className="mb-1">Data Analysis with Python</h5>
                      <p className="mb-0 text-muted">In progress - 65% complete</p>
                    </div>
                    <div className="ms-auto">
                      <span className="badge bg-primary">In Progress</span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <div className="learning-path-icon me-3">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <div>
                      <h5 className="mb-1">Machine Learning Fundamentals</h5>
                      <p className="mb-0 text-muted">Not started</p>
                    </div>
                    <div className="ms-auto">
                      <span className="badge bg-secondary">Upcoming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-lg-4">
            {/* Achievements Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 fw-bold">Achievements</h5>
                <Link to="/achievements" className="text-decoration-none">View All</Link>
              </div>
              <div className="card-body">
                {achievements.length > 0 ? (
                  <div className="achievements-list">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="achievement-item d-flex align-items-center mb-3 p-3 border rounded">
                        <div className="achievement-icon me-3">
                          <FontAwesomeIcon 
                            icon={achievement.icon || faMedal} 
                            className="text-warning" 
                            size="2x" 
                          />
                        </div>
                        <div>
                          <h6 className="mb-0">{achievement.title}</h6>
                          <small className="text-muted d-block">{achievement.description}</small>
                          <small className="text-muted">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FontAwesomeIcon icon={faTrophy} className="text-muted mb-3" size="3x" />
                    <h5>No Achievements Yet</h5>
                    <p className="text-muted">Complete courses to earn achievements.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommended Courses */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Recommended for You</h5>
              </div>
              <div className="card-body">
                <div className="recommended-course mb-3">
                  <div className="d-flex">
                    <img 
                      src="/assets/images/course4.jpg" 
                      className="rounded me-3" 
                      alt="UI/UX Design"
                      width="80"
                      height="60"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1">UI/UX Design Principles</h6>
                      <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStarHalfAlt} className="text-warning me-1" size="xs" />
                        <small className="ms-1">4.6 (3,214)</small>
                      </div>
                      <Link to="/course/4" className="btn btn-sm btn-outline-primary mt-1">View Course</Link>
                    </div>
                  </div>
                </div>
                
                <div className="recommended-course mb-3">
                  <div className="d-flex">
                    <img 
                      src="/assets/images/course5.jpg" 
                      className="rounded me-3" 
                      alt="JavaScript Course"
                      width="80"
                      height="60"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1">Modern JavaScript</h6>
                      <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <FontAwesomeIcon icon={faStar} className="text-warning me-1" size="xs" />
                        <small className="ms-1">5.0 (2,845)</small>
                      </div>
                      <Link to="/course/5" className="btn btn-sm btn-outline-primary mt-1">View Course</Link>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <Link to="/courses" className="btn btn-outline-primary btn-sm">See More Recommendations</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;