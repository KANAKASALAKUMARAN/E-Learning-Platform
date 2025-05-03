import React from 'react';
import PropTypes from 'prop-types';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock, faUser } from '@fortawesome/free-solid-svg-icons';

function CourseCard({ course }) {
  // Calculate discount percentage
  const discountPercentage = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  return (
    <Card className="course-card h-100 shadow-sm">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={course.image} 
          alt={course.title}
          className="course-thumbnail"
        />
        {course.badge && (
          <Badge 
            bg="primary" 
            className="position-absolute top-0 start-0 m-3 py-2 px-3"
          >
            {course.badge}
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <Badge bg="light" text="dark" className="px-2 py-1">
            {course.category}
          </Badge>
          
          <div className="course-rating">
            <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
            <span className="fw-bold">{course.rating}</span>
            <span className="text-muted ms-1">({course.reviews.toLocaleString()})</span>
          </div>
        </div>
        
        <Card.Title className="course-title mb-2">
          <Link to={`/course/${course.id}`} className="text-decoration-none text-dark">
            {course.title}
          </Link>
        </Card.Title>
        
        <Card.Text className="course-description text-muted mb-3">
          {course.description.length > 100 
            ? `${course.description.substring(0, 100)}...` 
            : course.description}
        </Card.Text>
        
        <div className="d-flex align-items-center mb-3">
          <img 
            src={course.instructorImage} 
            alt={course.instructor}
            className="rounded-circle me-2"
            width="30"
            height="30"
          />
          <span className="instructor-name">{course.instructor}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faClock} className="text-muted me-2" />
            <span className="course-duration">{course.duration}</span>
          </div>
          
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="text-muted me-2" />
            <span>{course.level}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <div className="course-price">
              <span className="fw-bold fs-5">${course.price.toFixed(2)}</span>
              {course.originalPrice && course.originalPrice > course.price && (
                <>
                  <span className="text-muted text-decoration-line-through ms-2">
                    ${course.originalPrice.toFixed(2)}
                  </span>
                  <Badge bg="success" className="ms-2">
                    {discountPercentage}% off
                  </Badge>
                </>
              )}
            </div>
            
            <Link 
              to={`/course/${course.id}`} 
              className="btn btn-outline-primary btn-sm"
            >
              Details
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    badge: PropTypes.string,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    instructor: PropTypes.string.isRequired,
    instructorImage: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    level: PropTypes.string.isRequired
  }).isRequired
};

export default CourseCard;