import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faUsers,
  faClock,
  faBookmark,
  faPlayCircle,
  faLaptopCode,
  faChalkboardTeacher,
  faHeart,
  faCheckCircle,
  faPlay,
  faShoppingCart,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../contexts/CartContext';
import '../../assets/css/animations.css';

const CourseCard = ({ course, featured = false }) => {
  const { addToCart, isInCart } = useCart();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const cardRef = useRef(null);
  const playBtnRef = useRef(null);
  
  // Animation for card reveal
  useEffect(() => {
    const currentCardRef = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.target && entry.target.classList) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  // Default course data if not provided
  const defaultCourse = {
    id: 'default-course',
    title: 'Introduction to React Development',
    description: 'Learn the fundamentals of React development and build modern web applications.',
    instructor: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/100?img=12',
      verified: true
    },
    thumbnail: 'https://streamline-learning.com/wp-content/uploads/2024/10/online-courses-1024x537.png',
    rating: 4.8,
    ratingCount: 256,
    studentsEnrolled: 4295,
    duration: '12 hours',
    level: 'Beginner',
    price: 49.99,
    tags: ['Web Development', 'JavaScript', 'React'],
    lessons: 24,
    progress: 0 // For enrolled courses
  };

  // Use provided course or default
  const courseData = course || defaultCourse;

  // Safety check for courseData
  if (!courseData || !courseData.id) {
    return (
      <div className="course-card card border-0 h-100 shadow-sm">
        <div className="card-body d-flex align-items-center justify-content-center">
          <p className="text-muted">Course data not available</p>
        </div>
      </div>
    );
  }

  // Progress percentage calculation for enrolled courses
  const progressPercentage = courseData.progress ? courseData.progress : 0;

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);

    // Add animation class to the button with null check
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.add('animate__animated', 'animate__rubberBand');
      setTimeout(() => {
        if (e.currentTarget && e.currentTarget.classList) {
          e.currentTarget.classList.remove('animate__animated', 'animate__rubberBand');
        }
      }, 1000);
    }
  };
  
  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);

    // Add animation class with null check
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.add('animate__animated', 'animate__heartBeat');
      setTimeout(() => {
        if (e.currentTarget && e.currentTarget.classList) {
          e.currentTarget.classList.remove('animate__animated', 'animate__heartBeat');
        }
      }, 1000);
    }
  };
  
  // Get badge color based on course level
  const getLevelBadgeColor = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner':
        return 'rgba(25, 135, 84, 0.9)';
      case 'intermediate':
        return 'rgba(13, 110, 253, 0.9)';
      case 'advanced':
        return 'rgba(220, 53, 69, 0.9)';
      default:
        return 'rgba(108, 117, 125, 0.9)';
    }
  };
  
  // Get level icon based on course level
  const getLevelIcon = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner':
        return faChalkboardTeacher;
      case 'intermediate':
        return faLaptopCode;
      case 'advanced':
        return faPlayCircle;
      default:
        return faChalkboardTeacher;
    }
  };
  
  // Handle preview video button
  const handlePreviewClick = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a video modal
    alert('Video preview would open here!');
  };

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!courseData || !courseData.id) {
      setCartMessage('Course data not available');
      setTimeout(() => setCartMessage(''), 2000);
      return;
    }

    if (isInCart(courseData.id)) {
      setCartMessage('Already in cart');
      setTimeout(() => setCartMessage(''), 2000);
      return;
    }

    setAddingToCart(true);
    const result = addToCart(courseData);

    if (result.success) {
      setCartMessage('Added to cart!');
      // Add visual feedback animation with null check
      if (e.currentTarget && e.currentTarget.classList) {
        e.currentTarget.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
          if (e.currentTarget && e.currentTarget.classList) {
            e.currentTarget.classList.remove('animate__animated', 'animate__pulse');
          }
          setCartMessage('');
        }, 2000);
      } else {
        setTimeout(() => setCartMessage(''), 2000);
      }
    } else {
      setCartMessage(result.message);
      setTimeout(() => setCartMessage(''), 2000);
    }

    setAddingToCart(false);
  };

  return (
    <div
      ref={cardRef}
      className={`course-card card border-0 h-100 shadow-sm transition-all ${featured ? 'featured-card border-primary border-top border-4' : ''}`}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      <div className="position-relative img-hover-zoom">
        <Link 
          to={`/course/${courseData.id}`}
          className="card-img-link"
          onMouseEnter={() => setShowPlayButton(true)}
          onMouseLeave={() => setShowPlayButton(false)}
        >
          <img 
            src={courseData.thumbnail} 
            alt={courseData.title}
            className="card-img-top object-fit-cover"
            style={{ height: '180px' }} 
          />
          
          {/* Video Preview Button */}
          <div 
            ref={playBtnRef}
            className={`position-absolute top-50 start-50 translate-middle play-button-container transition-all ${showPlayButton ? 'active' : ''}`}
            style={{
              opacity: showPlayButton ? 1 : 0,
              transform: showPlayButton ? 'scale(1)' : 'scale(0.8)',
              zIndex: 2
            }}
          >
            <button
              className="btn btn-light rounded-circle pulse p-3 d-flex align-items-center justify-content-center shadow"
              style={{ width: '50px', height: '50px' }}
              onClick={handlePreviewClick}
            >
              <FontAwesomeIcon icon={faPlay} className="text-primary ms-1" />
            </button>
          </div>
          
          {/* Dark Overlay on Hover */}
          <div 
            className="hover-dark-overlay position-absolute top-0 start-0 w-100 h-100 transition-all"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0)', 
              opacity: showPlayButton ? 0.5 : 0,
              transition: 'opacity 0.3s ease, background-color 0.3s ease'
            }}
          ></div>
        </Link>
        
        {/* Course Level Badge */}
        <div 
          className="position-absolute top-0 start-0 m-3 badge rounded-pill slide-in-left"
          style={{ 
            backgroundColor: getLevelBadgeColor(courseData.level),
            backdropFilter: 'blur(4px)'
          }}
        >
          <FontAwesomeIcon icon={getLevelIcon(courseData.level)} className="me-1" />
          {courseData.level}
        </div>
        
        {/* Action Buttons Group */}
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
          {/* Like Button */}
          <button 
            className="btn btn-light rounded-circle p-2 shadow-sm hover-lift"
            style={{ width: '38px', height: '38px' }}
            onClick={toggleLike}
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className={`transition-colors ${isLiked ? 'text-danger' : 'text-muted'}`}
            />
          </button>
          
          {/* Bookmark Button */}
          <button 
            className="btn btn-light rounded-circle p-2 shadow-sm hover-lift"
            style={{ width: '38px', height: '38px' }}
            onClick={toggleBookmark}
          >
            <FontAwesomeIcon 
              icon={faBookmark} 
              className={`transition-colors ${isBookmarked ? 'text-warning' : 'text-muted'}`}
            />
          </button>
        </div>

        {featured && (
          <div className="position-absolute bottom-0 start-0 w-100 bg-primary text-white text-center py-1 slide-up">
            <small className="fw-bold">Featured Course</small>
          </div>
        )}
        
        {/* Progress Bar for Enrolled Courses */}
        {progressPercentage > 0 && (
          <div className="position-absolute bottom-0 start-0 w-100">
            <div className="progress rounded-0" style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-end px-2 py-1 bg-dark bg-opacity-75 text-white">
              <small>{progressPercentage}% Complete</small>
            </div>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        {/* Price and Rating */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="price-badge">
            {courseData.price > 0 ? (
              <span className="badge bg-gradient-primary text-white px-3 py-2 rounded-pill fw-bold shadow-sm">
                ${courseData.price.toFixed(2)}
              </span>
            ) : (
              <span className="badge bg-gradient-success text-white px-3 py-2 rounded-pill fw-bold shadow-sm">
                Free
              </span>
            )}
          </div>
          <div className="d-flex align-items-center rating-container">
            <div className="rating-stars me-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={star <= Math.round(courseData.rating || 0) ? "text-warning star-filled" : "text-muted opacity-25"}
                  style={{ fontSize: '13px', marginRight: '1px' }}
                />
              ))}
            </div>
            <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{courseData.rating || 0}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.85rem' }}>({courseData.reviews || courseData.ratingCount || 0})</span>
          </div>
        </div>
        
        {/* Course Title */}
        <h5 className="card-title mb-3 fw-bold lh-base" style={{ fontSize: '1.1rem', minHeight: '2.6rem' }}>
          <Link to={`/course/${courseData.id}`} className="text-decoration-none text-reset hover-primary transition-colors">
            {courseData.title}
          </Link>
        </h5>

        {/* Course Description - only show for the first 2-3 lines */}
        <p className="card-text text-muted mb-4 lh-sm" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontSize: '0.9rem',
          minHeight: '4rem'
        }}>
          {courseData.description}
        </p>
        
        {/* Stats Row */}
        <div className="course-stats d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
          <div className="stat-item d-flex align-items-center">
            <div className="stat-icon me-2 rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: 'var(--bs-primary)', width: '32px', height: '32px' }}>
              <FontAwesomeIcon icon={faUsers} style={{ color: 'white', fontSize: '0.8rem' }} />
            </div>
            <div>
              <div className="stat-value fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                {courseData.students ? courseData.students.toLocaleString() : '0'}
              </div>
              <div className="stat-label text-muted" style={{ fontSize: '0.75rem' }}>Students</div>
            </div>
          </div>
          <div className="stat-item d-flex align-items-center">
            <div className="stat-icon me-2 rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: 'var(--bs-success)', width: '32px', height: '32px' }}>
              <FontAwesomeIcon icon={faClock} style={{ color: 'white', fontSize: '0.8rem' }} />
            </div>
            <div>
              <div className="stat-value fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                {courseData.duration}
              </div>
              <div className="stat-label text-muted" style={{ fontSize: '0.75rem' }}>Duration</div>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-4 tags-container">
          {courseData.tags && courseData.tags.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {courseData.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="tag-badge px-2 py-1 rounded-pill transition-all"
                  style={{
                    backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)',
                    color: 'var(--bs-primary)',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    border: '1px solid rgba(var(--bs-primary-rgb), 0.2)'
                  }}
                >
                  {tag}
                </span>
              ))}
              {courseData.tags.length > 3 &&
                <span className="tag-badge px-2 py-1 rounded-pill bg-light text-muted"
                      style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                  +{courseData.tags.length - 3}
                </span>
              }
            </div>
          ) : (
            <span
              className="tag-badge px-2 py-1 rounded-pill transition-all"
              style={{
                backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)',
                color: 'var(--bs-primary)',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: '1px solid rgba(var(--bs-primary-rgb), 0.2)'
              }}
            >
              {courseData.category || 'General'}
            </span>
          )}
        </div>
        
        {/* Instructor & Action Buttons - Using mt-auto to push this to bottom */}
        <div className="card-footer-section mt-auto pt-4 border-top border-light">
          <div className="instructor-info d-flex align-items-center mb-3">
            <div className="position-relative">
              <img
                src={courseData.instructor && courseData.instructor.avatar ? courseData.instructor.avatar :
                     (courseData.instructorImage || 'https://i.pravatar.cc/100?img=12')}
                alt={courseData.instructor ? courseData.instructor.name : courseData.instructor}
                className="instructor-avatar rounded-circle me-3 border border-2 border-white shadow-sm"
                width="36" height="36"
                style={{ objectFit: 'cover' }}
              />
              {courseData.instructor && courseData.instructor.verified && (
                <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1"
                     style={{ transform: 'translate(25%, 25%)', zIndex: 2 }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-primary" style={{ fontSize: '0.7rem' }} />
                </div>
              )}
            </div>
            <div>
              <div className="instructor-name fw-medium text-dark" style={{ fontSize: '0.85rem' }}>
                {courseData.instructor && typeof courseData.instructor === 'object' ?
                  courseData.instructor.name : courseData.instructor}
              </div>
              <div className="instructor-title text-muted" style={{ fontSize: '0.75rem' }}>Instructor</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || isInCart(courseData.id)}
              className={`btn btn-sm rounded-pill flex-grow-1 transition-all ${
                isInCart(courseData.id)
                  ? 'btn-success'
                  : 'btn-outline-primary'
              }`}
              style={{ fontSize: '0.8rem', fontWeight: '600' }}
            >
              {addingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : isInCart(courseData.id) ? (
                <>
                  <FontAwesomeIcon icon={faCheck} className="me-1" />
                  In Cart
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                  Add to Cart
                </>
              )}
            </button>

            <Link
              to={`/course/${courseData.id}`}
              className="btn btn-primary btn-sm rounded-pill px-3"
              style={{ fontSize: '0.8rem', fontWeight: '600' }}
            >
              View Details
            </Link>
          </div>

          {/* Cart Message */}
          {cartMessage && (
            <div className={`mt-2 text-center small cart-message ${isInCart(courseData.id) ? 'text-success' : 'text-primary'}`}>
              {cartMessage}
            </div>
          )}
        </div>
      </div>
      
      <style jsx="true">{`
        .course-card.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .course-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.08);
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
        }

        .bg-gradient-primary {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #4f46e5 100%);
        }

        .bg-gradient-success {
          background: linear-gradient(135deg, var(--bs-success) 0%, #10b981 100%);
        }

        .price-badge .badge {
          font-size: 0.8rem;
          letter-spacing: 0.5px;
        }

        .rating-container {
          background: rgba(255, 193, 7, 0.1);
          padding: 4px 8px;
          border-radius: 8px;
        }

        .star-filled {
          filter: drop-shadow(0 1px 2px rgba(255, 193, 7, 0.3));
        }

        .course-stats {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .stat-item {
          flex: 1;
        }

        .stat-icon {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .tag-badge {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .tag-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.2);
        }

        .card-footer-section {
          background: linear-gradient(to bottom, transparent 0%, rgba(248, 249, 250, 0.5) 100%);
          margin: 0 -1.25rem -1.25rem -1.25rem;
          padding: 1.25rem 1.25rem 1.25rem 1.25rem;
        }

        .instructor-avatar {
          transition: transform 0.2s ease;
        }

        .instructor-info:hover .instructor-avatar {
          transform: scale(1.1);
        }
        
        .hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.05), rgba(0,0,0,0));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        
        .course-card:hover .hover-overlay {
          opacity: 1;
        }
        
        .course-card:hover .card-img-top {
          transform: scale(1.05);
        }
        
        .featured-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 1rem;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 50px 50px;
          border-color: transparent transparent var(--bs-primary) transparent;
          transform: rotate(0deg);
          z-index: 1;
        }
        
        .stats-icon-container {
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .hover-lift:hover .stats-icon-container {
          transform: translateY(-2px);
          background-color: rgba(var(--bs-primary-rgb), 0.2) !important;
        }
        
        .animate__animated {
          animation-duration: 0.8s;
        }
        
        @keyframes rubberBand {
          from { transform: scale3d(1, 1, 1); }
          30% { transform: scale3d(1.25, 0.75, 1); }
          40% { transform: scale3d(0.75, 1.25, 1); }
          50% { transform: scale3d(1.15, 0.85, 1); }
          65% { transform: scale3d(0.95, 1.05, 1); }
          75% { transform: scale3d(1.05, 0.95, 1); }
          to { transform: scale3d(1, 1, 1); }
        }
        
        .animate__rubberBand {
          animation-name: rubberBand;
        }
        
        @keyframes heartBeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.3); }
          70% { transform: scale(1); }
        }
        
        .animate__heartBeat {
          animation-name: heartBeat;
          animation-duration: 1.3s;
        }
        
        .play-button-container {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .play-button-container.active {
          animation: fadeInScale 0.4s ease;
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        .tags-container .badge {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .tags-container .badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(var(--bs-primary-rgb), 0.15);
        }
        
        /* Fix positioning for play button */
        .play-button-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Cart button animations */
        .btn:disabled {
          opacity: 0.7;
        }

        .btn-success {
          animation: successPulse 0.5s ease-in-out;
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        /* Add to cart button hover effect */
        .btn-outline-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.3);
        }

        /* Cart message animation */
        .cart-message {
          animation: slideInUp 0.3s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CourseCard;