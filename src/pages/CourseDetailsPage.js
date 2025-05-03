import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faStarHalfAlt,
  faClock,
  faSignal,
  faChalkboardTeacher,
  faUsers,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import CourseService from '../services/api/courseService';
import AuthService from '../services/api/authService';

function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const courseData = await CourseService.getCourseById(id);
        setCourse(courseData);
        
        // Check if user is enrolled
        if (user) {
          try {
            const userProfile = await AuthService.getUserProfile();
            setIsEnrolled(userProfile.enrolledCourses.some(c => c._id === id || c === id));
          } catch (err) {
            console.error('Failed to fetch user profile:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setEnrolling(true);
    try {
      await CourseService.enrollInCourse(id);
      setEnrollmentSuccess(true);
      setIsEnrolled(true);
      setTimeout(() => {
        setEnrollmentSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course. Please try again later.');
    } finally {
      setEnrolling(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading course details...</p>
      </div>
    );
  }

  // Render error state
  if (error || !course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Course not found'}</div>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  // Render fullStars and halfStar based on rating
  const rating = course.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="container py-5">
      {/* Course Header */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="display-5 fw-bold mb-3">{course.title}</h1>
          
          <p className="lead mb-4">{course.description}</p>
          
          <div className="d-flex align-items-center mb-3">
            <div className="me-3">
              {[...Array(fullStars)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
              ))}
              {hasHalfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-warning" />}
              <span className="ms-2 fw-bold">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted">({course.reviews.toLocaleString()} reviews)</span>
          </div>
          
          <div className="d-flex flex-wrap mb-4">
            <div className="me-4 mb-2">
              <FontAwesomeIcon icon={faUsers} className="text-muted me-2" />
              <span>{course.students.toLocaleString()} students</span>
            </div>
            <div className="me-4 mb-2">
              <FontAwesomeIcon icon={faClock} className="text-muted me-2" />
              <span>{course.duration}</span>
            </div>
            <div className="me-4 mb-2">
              <FontAwesomeIcon icon={faSignal} className="text-muted me-2" />
              <span>{course.level}</span>
            </div>
            <div className="me-4 mb-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-2" />
              <span>Last updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <span className="badge bg-primary me-2">{course.category}</span>
            {course.badge && <span className="badge bg-danger">{course.badge}</span>}
          </div>
          
          {/* Instructor Info (Mobile only) */}
          <div className="d-lg-none mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3">Instructor</h5>
                <div className="d-flex align-items-center">
                  <img 
                    src={course.instructor.image || 'https://via.placeholder.com/60'} 
                    alt={course.instructor.name}
                    className="rounded-circle me-3"
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1">{course.instructor.name}</h6>
                    <p className="small mb-0">{course.instructor.bio || 'Course Instructor'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Curriculum */}
          <div className="mb-5">
            <h3 className="mb-4">Course Content</h3>
            
            <div className="mb-3">
              <span className="text-muted">{course.lessons?.length || 0} lessons • {course.duration} total</span>
            </div>
            
            <div className="accordion" id="courseContent">
              {course.lessons?.map((lesson, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#lesson-${index}`}
                      aria-expanded="false" 
                      aria-controls={`lesson-${index}`}
                    >
                      <div className="d-flex justify-content-between w-100 me-3">
                        <div>
                          <span className="fw-bold">{index + 1}. {lesson.title}</span>
                        </div>
                        <span>{lesson.duration}</span>
                      </div>
                    </button>
                  </h2>
                  <div id={`lesson-${index}`} className="accordion-collapse collapse" data-bs-parent="#courseContent">
                    <div className="accordion-body">
                      <p>{lesson.description}</p>
                      {isEnrolled ? (
                        <Link to={`/course/${id}/lesson/${lesson._id}`} className="btn btn-sm btn-outline-primary">
                          Start Lesson
                        </Link>
                      ) : (
                        <div className="alert alert-info small">Enroll in this course to access this lesson.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Course Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow sticky-lg-top" style={{ top: '2rem', zIndex: 100 }}>
            <img 
              src={course.image || 'https://via.placeholder.com/800x450'} 
              className="card-img-top" 
              alt={course.title}
              style={{ height: '200px', objectFit: 'cover' }}
            />
            
            <div className="card-body p-4">
              <div className="mb-3">
                <span className="h3 fw-bold">${course.price.toFixed(2)}</span>
                {course.originalPrice && (
                  <>
                    <span className="text-muted text-decoration-line-through ms-2">${course.originalPrice.toFixed(2)}</span>
                    <span className="badge bg-danger ms-2">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
              
              {enrollmentSuccess ? (
                <div className="alert alert-success" role="alert">
                  Successfully enrolled! You can now access all course materials.
                </div>
              ) : isEnrolled ? (
                <div className="d-grid gap-2">
                  <Link to={`/course/${id}/lesson/1`} className="btn btn-success">
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              )}
              
              <hr className="my-4" />
              
              {/* Instructor Info (Desktop) */}
              <div className="d-none d-lg-block">
                <h5 className="mb-3">Instructor</h5>
                <div className="d-flex align-items-center">
                  <img 
                    src={course.instructor.image || 'https://via.placeholder.com/60'} 
                    alt={course.instructor.name}
                    className="rounded-circle me-3"
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1">{course.instructor.name}</h6>
                    <p className="small mb-0">{course.instructor.bio || 'Course Instructor'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsPage;