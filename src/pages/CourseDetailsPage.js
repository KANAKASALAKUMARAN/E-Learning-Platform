import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faStarHalfAlt,
  faClock,
  faSignal,
  faUsers,
  faCalendarAlt,
  faUser,
  faShoppingCart,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import CourseService from '../services/api/courseService';
import AuthService from '../services/api/authService';
import { useCart } from '../contexts/CartContext';

function CourseDetailsPage() {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const courseData = await CourseService.getCourseById(id);
        console.log('Course data received:', courseData); // Debug log
        
        // Create sample lessons if none exist
        let processedLessons = [];
        
        // Check if lessons exist and is an array
        if (Array.isArray(courseData.lessons)) {
          processedLessons = courseData.lessons;
        } else if (courseData.lessons && typeof courseData.lessons === 'object') {
          // If lessons is an object but not an array, convert it
          processedLessons = Object.values(courseData.lessons);
        } else {
          // Create sample lessons if none exist
          processedLessons = [
            {
              _id: '1',
              title: 'Introduction',
              description: 'Introduction to the course and overview of what you will learn.',
              duration: '15 min'
            },
            {
              _id: '2',
              title: 'Getting Started',
              description: 'Setting up your environment and first steps.',
              duration: '25 min'
            },
            {
              _id: '3',
              title: 'Core Concepts',
              description: 'Learning the fundamental concepts of the subject.',
              duration: '40 min'
            }
          ];
        }
        
        // Ensure the course data has required properties with defaults
        setCourse({
          ...courseData,
          rating: courseData.rating || 4.5,
          reviews: courseData.reviews || 0,
          students: courseData.students || 0,
          lessons: processedLessons,
          instructor: typeof courseData.instructor === 'string' 
            ? { name: courseData.instructor }
            : courseData.instructor || { name: 'Instructor' }
        });
        
        // Check if user is enrolled
        if (user) {
          try {
            const userProfile = await AuthService.getUserProfile();
            setIsEnrolled(userProfile.enrolledCourses.some(c => 
              (c._id === id || c === id)
            ));
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

  const handleAddToCart = async () => {
    if (!course) return;

    if (isInCart(course._id || course.id)) {
      setCartMessage('Course is already in your cart');
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }

    setAddingToCart(true);
    const result = addToCart({
      id: course._id || course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price || 0,
      thumbnail: course.thumbnail || course.image,
      level: course.level,
      duration: course.duration,
      rating: course.rating
    });

    if (result.success) {
      setCartMessage('Course added to cart successfully!');
    } else {
      setCartMessage(result.message);
    }

    setTimeout(() => setCartMessage(''), 3000);
    setAddingToCart(false);
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

  // Ensure lessons is always an array before rendering
  const courseLessons = Array.isArray(course.lessons) ? course.lessons : [];

  // Render fullStars and halfStar based on rating
  const rating = course.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const instructorName = course.instructor?.name || (typeof course.instructor === 'string' ? course.instructor : 'Instructor');

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
              <span className="ms-2 fw-bold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-muted">({(course.reviews || 0).toLocaleString()} reviews)</span>
          </div>
          
          <div className="d-flex flex-wrap mb-4">
            <div className="me-4 mb-2">
              <FontAwesomeIcon icon={faUsers} className="text-muted me-2" />
              <span>{(course.students || 0).toLocaleString()} students</span>
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
              <span>Last updated {course.lastUpdated || 'Recently'}</span>
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
                  <FontAwesomeIcon icon={faUser} className="text-secondary me-3" size="2x" />
                  <div>
                    <h6 className="mb-1">{instructorName}</h6>
                    <p className="small mb-0">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Curriculum */}
          <div className="mb-5">
            <h3 className="mb-4">Course Content</h3>
            
            <div className="mb-3">
              <span className="text-muted">{courseLessons.length} lessons • {course.duration} total</span>
            </div>
            
            <div className="accordion" id="courseContent">
              {courseLessons.map((lesson, index) => (
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
                          <span className="fw-bold">{index + 1}. {lesson.title || `Lesson ${index + 1}`}</span>
                        </div>
                        <span>{lesson.duration || '15 min'}</span>
                      </div>
                    </button>
                  </h2>
                  <div id={`lesson-${index}`} className="accordion-collapse collapse" data-bs-parent="#courseContent">
                    <div className="accordion-body">
                      <p>{lesson.description || 'No description available for this lesson.'}</p>
                      {isEnrolled ? (
                        <Link to={`/course/${id}/lesson/${lesson._id || index + 1}`} className="btn btn-sm btn-outline-primary">
                          Start Lesson
                        </Link>
                      ) : (
                        <div className="alert alert-info small">Enroll in this course to access this lesson.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show message if no lessons available */}
              {courseLessons.length === 0 && (
                <div className="alert alert-info">
                  No lessons are currently available for this course.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Course Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow sticky-lg-top" style={{ top: '2rem', zIndex: 100 }}>
            <div className="card-header bg-primary text-white py-3 text-center">
              <h5 className="mb-0">Course Information</h5>
            </div>
            
            <div className="card-body p-4">
              <div className="mb-3">
                <span className="h3 fw-bold">${(course.price || 0).toFixed(2)}</span>
                {course.originalPrice && course.originalPrice > course.price && (
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
                    className="btn btn-primary btn-lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>

                  <button
                    className={`btn btn-outline-primary ${isInCart(course._id || course.id) ? 'btn-success' : ''}`}
                    onClick={handleAddToCart}
                    disabled={addingToCart || isInCart(course._id || course.id)}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding to Cart...
                      </>
                    ) : isInCart(course._id || course.id) ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-2" />
                        In Cart
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  {cartMessage && (
                    <div className={`alert ${isInCart(course._id || course.id) ? 'alert-success' : 'alert-info'} small mt-2`}>
                      {cartMessage}
                    </div>
                  )}
                </div>
              )}
              
              <hr className="my-4" />
              
              {/* Instructor Info (Desktop) */}
              <div className="d-none d-lg-block">
                <h5 className="mb-3">Instructor</h5>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUser} className="text-secondary me-3" size="2x" />
                  <div>
                    <h6 className="mb-1">{instructorName}</h6>
                    <p className="small mb-0">Course Instructor</p>
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