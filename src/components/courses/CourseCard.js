import React from 'react';
import PropTypes from 'prop-types';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock, faUser } from '@fortawesome/free-solid-svg-icons';

function CourseCard({ course, viewMode }) {
  // Support both MongoDB _id and local id
  const courseId = course._id || course.id;
  
  // Get instructor name (handles both string and object formats)
  const instructorName = course.instructor?.name || course.instructor;
  
  // Calculate discount percentage
  const discountPercentage = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;
    
  // Select appropriate layout based on view mode
  const isListView = viewMode === 'list';

  return (
    <Card className={`course-card shadow-sm ${isListView ? 'list-card' : 'h-100'}`}>
      <div className={isListView ? "d-flex" : ""}>
        {/* Course badge now appears at the top of the card body */}
        <Card.Body className="d-flex flex-column">
          {course.badge && (
            <Badge 
              bg="primary" 
              className="align-self-start mb-2 py-2 px-3"
            >
              {course.badge}
            </Badge>
          )}
          
          <div className="d-flex justify-content-between mb-2">
            <Badge bg="light" text="dark" className="px-2 py-1">
              {course.category}
            </Badge>
            
            <div className="course-rating">
              <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
              <span className="fw-bold">{course.rating || 0}</span>
              <span className="text-muted ms-1">({(course.reviews || 0).toLocaleString()})</span>
            </div>
          </div>
          
          <Card.Title className="course-title mb-2">
            <Link to={`/course/${courseId}`} className="text-decoration-none text-dark">
              {course.title}
            </Link>
          </Card.Title>
          
          <Card.Text className="course-description text-muted mb-3">
            {course.description.length > (isListView ? 200 : 100)
              ? `${course.description.substring(0, isListView ? 200 : 100)}...` 
              : course.description}
          </Card.Text>
          
          <div className="d-flex align-items-center mb-3">
            <FontAwesomeIcon icon={faUser} className="text-muted me-2" />
            <span className="instructor-name">{instructorName}</span>
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
          
          <div className={isListView ? "d-flex justify-content-between mt-auto" : "mt-auto"}>
            <div className="course-price">
              <span className="fw-bold fs-5">${Number(course.price).toFixed(2)}</span>
              {course.originalPrice && course.originalPrice > course.price && (
                <>
                  <span className="text-muted text-decoration-line-through ms-2">
                    ${Number(course.originalPrice).toFixed(2)}
                  </span>
                  <Badge bg="success" className="ms-2">
                    {discountPercentage}% off
                  </Badge>
                </>
              )}
            </div>
            
            <div className={isListView ? "ms-3" : "mt-2 d-flex justify-content-end"}>
              <Link 
                to={`/course/${courseId}`} 
                className="btn btn-outline-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    _id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    badge: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    instructor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,
    duration: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    level: PropTypes.string.isRequired
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list'])
};

CourseCard.defaultProps = {
  viewMode: 'grid'
};

export default React.memo(CourseCard);