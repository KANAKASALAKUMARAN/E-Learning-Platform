import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';

function CourseFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    categories: { all: true },
    levels: { all: true },
    rating: 'all',
    durations: { all: true },
    price: 'all'
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle category filter changes
  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'all') {
      setFilters(prev => ({
        ...prev,
        categories: {
          all: checked,
          programming: checked,
          design: checked,
          business: checked,
          marketing: checked,
          photography: checked,
          music: checked
        }
      }));
    } else {
      const updatedCategories = {
        ...filters.categories,
        [name]: checked
      };
      
      // Update 'all' checkbox based on others
      const allSelected = Object.keys(updatedCategories)
        .filter(key => key !== 'all')
        .every(key => updatedCategories[key]);
      
      setFilters(prev => ({
        ...prev,
        categories: {
          ...updatedCategories,
          all: allSelected
        }
      }));
    }
  };

  // Handle level filter changes
  const handleLevelChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'all') {
      setFilters(prev => ({
        ...prev,
        levels: {
          all: checked,
          beginner: checked,
          intermediate: checked,
          advanced: checked
        }
      }));
    } else {
      const updatedLevels = {
        ...filters.levels,
        [name]: checked
      };
      
      // Update 'all' checkbox based on others
      const allSelected = Object.keys(updatedLevels)
        .filter(key => key !== 'all')
        .every(key => updatedLevels[key]);
      
      setFilters(prev => ({
        ...prev,
        levels: {
          ...updatedLevels,
          all: allSelected
        }
      }));
    }
  };

  // Handle duration filter changes
  const handleDurationChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'all') {
      setFilters(prev => ({
        ...prev,
        durations: {
          all: checked,
          short: checked,
          medium: checked,
          long: checked,
          extraLong: checked
        }
      }));
    } else {
      const updatedDurations = {
        ...filters.durations,
        [name]: checked
      };
      
      // Update 'all' checkbox based on others
      const allSelected = Object.keys(updatedDurations)
        .filter(key => key !== 'all')
        .every(key => updatedDurations[key]);
      
      setFilters(prev => ({
        ...prev,
        durations: {
          ...updatedDurations,
          all: allSelected
        }
      }));
    }
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      categories: { all: true },
      levels: { all: true },
      rating: 'all',
      durations: { all: true },
      price: 'all'
    });
  };

  return (
    <div className="course-filters">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">
          <FontAwesomeIcon icon={faFilter} className="me-2" />
          Filters
        </h5>
        <Button 
          variant="link" 
          className="p-0 text-decoration-none" 
          onClick={resetFilters}
        >
          <FontAwesomeIcon icon={faTimes} className="me-1" />
          Reset
        </Button>
      </div>
      
      {/* Categories Filter */}
      <Card className="mb-4">
        <Card.Header className="bg-light">Categories</Card.Header>
        <Card.Body>
          <Form>
            <Form.Check 
              type="checkbox" 
              id="category-all" 
              label="All Categories" 
              name="all" 
              checked={filters.categories.all} 
              onChange={handleCategoryChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="category-programming" 
              label="Programming" 
              name="programming" 
              checked={filters.categories.programming} 
              onChange={handleCategoryChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="category-design" 
              label="Design" 
              name="design" 
              checked={filters.categories.design} 
              onChange={handleCategoryChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="category-business" 
              label="Business" 
              name="business" 
              checked={filters.categories.business} 
              onChange={handleCategoryChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="category-marketing" 
              label="Marketing" 
              name="marketing" 
              checked={filters.categories.marketing} 
              onChange={handleCategoryChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="category-photography" 
              label="Photography" 
              name="photography" 
              checked={filters.categories.photography} 
              onChange={handleCategoryChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="category-music" 
              label="Music" 
              name="music" 
              checked={filters.categories.music} 
              onChange={handleCategoryChange}
            />
          </Form>
        </Card.Body>
      </Card>
      
      {/* Level Filter */}
      <Card className="mb-4">
        <Card.Header className="bg-light">Level</Card.Header>
        <Card.Body>
          <Form>
            <Form.Check 
              type="checkbox" 
              id="level-all" 
              label="All Levels" 
              name="all" 
              checked={filters.levels.all} 
              onChange={handleLevelChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="level-beginner" 
              label="Beginner" 
              name="beginner" 
              checked={filters.levels.beginner} 
              onChange={handleLevelChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="level-intermediate" 
              label="Intermediate" 
              name="intermediate" 
              checked={filters.levels.intermediate} 
              onChange={handleLevelChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="level-advanced" 
              label="Advanced" 
              name="advanced" 
              checked={filters.levels.advanced} 
              onChange={handleLevelChange}
            />
          </Form>
        </Card.Body>
      </Card>
      
      {/* Rating Filter */}
      <Card className="mb-4">
        <Card.Header className="bg-light">Rating</Card.Header>
        <Card.Body>
          <Form>
            <Form.Check 
              type="radio" 
              id="rating-all" 
              label="All Ratings" 
              name="rating" 
              value="all" 
              checked={filters.rating === 'all'} 
              onChange={handleRadioChange}
              className="mb-2"
            />
            <Form.Check 
              type="radio" 
              id="rating-4plus" 
              label={
                <div className="d-flex align-items-center">
                  <span className="me-1">4.0 & up</span>
                  <div className="d-flex">
                    {[...Array(4)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
                    ))}
                    <FontAwesomeIcon icon={faStar} className="text-muted" />
                  </div>
                </div>
              } 
              name="rating" 
              value="4plus" 
              checked={filters.rating === '4plus'} 
              onChange={handleRadioChange}
              className="mb-2"
            />
            <Form.Check 
              type="radio" 
              id="rating-3plus" 
              label={
                <div className="d-flex align-items-center">
                  <span className="me-1">3.0 & up</span>
                  <div className="d-flex">
                    {[...Array(3)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
                    ))}
                    {[...Array(2)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-muted" />
                    ))}
                  </div>
                </div>
              } 
              name="rating" 
              value="3plus" 
              checked={filters.rating === '3plus'} 
              onChange={handleRadioChange}
            />
          </Form>
        </Card.Body>
      </Card>
      
      {/* Duration Filter */}
      <Card className="mb-4">
        <Card.Header className="bg-light">Duration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Check 
              type="checkbox" 
              id="duration-all" 
              label="All Durations" 
              name="all" 
              checked={filters.durations.all} 
              onChange={handleDurationChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="duration-short" 
              label="Short (0-3 hours)" 
              name="short" 
              checked={filters.durations.short} 
              onChange={handleDurationChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="duration-medium" 
              label="Medium (3-6 hours)" 
              name="medium" 
              checked={filters.durations.medium} 
              onChange={handleDurationChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="duration-long" 
              label="Long (6-12 hours)" 
              name="long" 
              checked={filters.durations.long} 
              onChange={handleDurationChange}
              className="mb-2"
            />
            <Form.Check 
              type="checkbox" 
              id="duration-extra-long" 
              label="Extra Long (12+ hours)" 
              name="extraLong" 
              checked={filters.durations.extraLong} 
              onChange={handleDurationChange}
            />
          </Form>
        </Card.Body>
      </Card>
      
      {/* Price Filter */}
      <Card className="mb-4">
        <Card.Header className="bg-light">Price</Card.Header>
        <Card.Body>
          <Form>
            <Form.Check 
              type="radio" 
              id="price-all" 
              label="All Prices" 
              name="price" 
              value="all" 
              checked={filters.price === 'all'} 
              onChange={handleRadioChange}
              className="mb-2"
            />
            <Form.Check 
              type="radio" 
              id="price-free" 
              label="Free" 
              name="price" 
              value="free" 
              checked={filters.price === 'free'} 
              onChange={handleRadioChange}
              className="mb-2"
            />
            <Form.Check 
              type="radio" 
              id="price-paid" 
              label="Paid" 
              name="price" 
              value="paid" 
              checked={filters.price === 'paid'} 
              onChange={handleRadioChange}
            />
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

CourseFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired
};

export default CourseFilters;