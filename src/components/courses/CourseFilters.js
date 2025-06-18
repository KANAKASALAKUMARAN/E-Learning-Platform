import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Accordion, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faTag, 
  faGraduationCap, 
  faDollarSign, 
  faRedo, 
  faFilter,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/animations.css';

const CourseFilters = ({ activeFilters, applyFilters, clearFilters }) => {
  const [filters, setFilters] = useState({
    categories: [],
    levels: [],
    price: { min: 0, max: 200, free: false },
    ratings: 0,
  });
  const [filterChanged, setFilterChanged] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const filtersRef = useRef(null);

  // Popular categories
  const categories = [
    'Web Development', 'Data Science', 'Mobile Development',
    'Programming Languages', 'Game Development', 'Software Testing',
    'Database Design', 'UX/UI Design', 'DevOps', 'Cloud Computing'
  ];

  // Course levels
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  // Initialize filters
  useEffect(() => {
    setFilters(activeFilters);
    
    // Calculate active filter count
    let count = 0;
    count += activeFilters.categories.length;
    count += activeFilters.levels.length;
    count += activeFilters.ratings > 0 ? 1 : 0;
    count += activeFilters.price.free ? 1 : 0;
    count += (activeFilters.price.min > 0 || activeFilters.price.max < 200) ? 1 : 0;
    
    setActiveFilterCount(count);
    setFilterChanged(false);
  }, [activeFilters]);

  // Track filter changes
  useEffect(() => {
    // Check if filters differ from activeFilters
    const hasFilterChanged = () => {
      if (filters.categories.length !== activeFilters.categories.length ||
          filters.levels.length !== activeFilters.levels.length ||
          filters.ratings !== activeFilters.ratings ||
          filters.price.free !== activeFilters.price.free ||
          filters.price.min !== activeFilters.price.min ||
          filters.price.max !== activeFilters.price.max) {
        return true;
      }
      
      // Check categories array equality
      for (const category of filters.categories) {
        if (!activeFilters.categories.includes(category)) {
          return true;
        }
      }
      
      // Check levels array equality
      for (const level of filters.levels) {
        if (!activeFilters.levels.includes(level)) {
          return true;
        }
      }
      
      return false;
    };
    
    setFilterChanged(hasFilterChanged());
  }, [filters, activeFilters]);

  // Handle category toggle
  const handleCategoryToggle = (category) => {
    setFilters(prevFilters => {
      const updatedCategories = prevFilters.categories.includes(category)
        ? prevFilters.categories.filter(cat => cat !== category)
        : [...prevFilters.categories, category];
      
      return {
        ...prevFilters,
        categories: updatedCategories
      };
    });
  };

  // Handle level toggle
  const handleLevelToggle = (level) => {
    setFilters(prevFilters => {
      const updatedLevels = prevFilters.levels.includes(level)
        ? prevFilters.levels.filter(lev => lev !== level)
        : [...prevFilters.levels, level];
      
      return {
        ...prevFilters,
        levels: updatedLevels
      };
    });
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      price: {
        ...prevFilters.price,
        [name]: parseFloat(value)
      }
    }));
  };

  // Handle free courses toggle
  const handleFreeToggle = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      price: {
        ...prevFilters.price,
        free: !prevFilters.price.free
      }
    }));
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ratings: prevFilters.ratings === rating ? 0 : rating
    }));
  };

  // Apply all filters
  const handleApplyFilters = () => {
    applyFilters(filters);
    // Add animation to the apply button
    const applyButton = document.querySelector('.apply-filters-btn');
    if (applyButton) {
      applyButton.classList.add('animate-success');
      setTimeout(() => {
        applyButton.classList.remove('animate-success');
      }, 1000);
    }
    setShowMobileFilters(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    clearFilters();
    // Add animation to the reset button
    const resetButton = document.querySelector('.reset-filters-btn');
    if (resetButton) {
      resetButton.classList.add('animate-reset');
      setTimeout(() => {
        resetButton.classList.remove('animate-reset');
      }, 1000);
    }
  };

  // Remove a specific category filter
  const handleRemoveCategory = (category) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      categories: prevFilters.categories.filter(cat => cat !== category)
    }));
  };

  // Remove a specific level filter
  const handleRemoveLevel = (level) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      levels: prevFilters.levels.filter(lev => lev !== level)
    }));
  };

  // Reset rating filter
  const handleRemoveRating = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ratings: 0
    }));
  };

  // Reset price filter
  const handleResetPrice = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      price: { min: 0, max: 200, free: false }
    }));
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
    
    // Add animation when opening
    if (!showMobileFilters && filtersRef.current) {
      filtersRef.current.classList.add('slide-in-right');
      setTimeout(() => {
        filtersRef.current.classList.remove('slide-in-right');
      }, 500);
    }
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="d-block d-md-none mb-3">
        <Button 
          variant="outline-primary" 
          className="w-100 rounded-pill d-flex align-items-center justify-content-center"
          onClick={toggleMobileFilters}
        >
          <FontAwesomeIcon icon={faFilter} className="me-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge 
              bg="primary" 
              pill 
              className="ms-2 position-relative pulse-animation"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="active-filters mb-4 fade-in">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 fw-bold">Active Filters</h6>
            <Button 
              variant="link" 
              className="p-0 text-decoration-none text-muted"
              onClick={handleResetFilters}
            >
              <small>Clear All</small>
            </Button>
          </div>
          
          <div className="active-filter-chips">
            {/* Category filters */}
            {filters.categories.map((category, index) => (
              <span 
                key={`cat-${index}`} 
                className="filter-chip bg-light"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
                <button 
                  className="chip-remove-btn" 
                  onClick={() => handleRemoveCategory(category)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            ))}
            
            {/* Level filters */}
            {filters.levels.map((level, index) => (
              <span 
                key={`lvl-${index}`} 
                className="filter-chip bg-light"
                style={{ animationDelay: `${(index + filters.categories.length) * 0.05}s` }}
              >
                {level}
                <button 
                  className="chip-remove-btn"
                  onClick={() => handleRemoveLevel(level)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            ))}
            
            {/* Price filters */}
            {(filters.price.min > 0 || filters.price.max < 200) && (
              <span className="filter-chip bg-light">
                ${filters.price.min} - ${filters.price.max}
                <button 
                  className="chip-remove-btn"
                  onClick={handleResetPrice}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )}
            
            {/* Free courses filter */}
            {filters.price.free && (
              <span className="filter-chip bg-light">
                Free Courses
                <button 
                  className="chip-remove-btn"
                  onClick={handleFreeToggle}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )}
            
            {/* Rating filter */}
            {filters.ratings > 0 && (
              <span className="filter-chip bg-light">
                {filters.ratings}+ Stars
                <button 
                  className="chip-remove-btn"
                  onClick={handleRemoveRating}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
      
      <div 
        ref={filtersRef}
        className={`course-filters ${showMobileFilters ? 'show-mobile-filters' : ''} d-md-block`}
      >
        {/* Mobile Header */}
        <div className="filter-mobile-header d-block d-md-none">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">Filters</h5>
            <button 
              className="btn-close" 
              onClick={() => setShowMobileFilters(false)}
            ></button>
          </div>
        </div>
        
        {/* Categories Filter */}
        <div className="filter-section mb-4 fade-in">
          <div className="filter-section-header d-flex align-items-center justify-content-between p-3 bg-white rounded-top border">
            <div className="d-flex align-items-center">
              <div className="filter-icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                   style={{ backgroundColor: 'var(--bs-primary)', width: '32px', height: '32px' }}>
                <FontAwesomeIcon icon={faTag} className="text-white" style={{ fontSize: '0.8rem' }} />
              </div>
              <h6 className="mb-0 fw-bold text-dark">Categories</h6>
            </div>
            {filters.categories.length > 0 && (
              <Badge
                bg="primary"
                pill
                className="scale-in px-2 py-1"
                style={{ fontSize: '0.75rem' }}
              >
                {filters.categories.length}
              </Badge>
            )}
          </div>
          <div className="filter-section-body p-3 bg-white rounded-bottom border border-top-0">
            <div className="categories-grid">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`category-pill ${filters.categories.includes(category) ? 'active' : ''}`}
                  onClick={() => handleCategoryToggle(category)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="category-text">{category}</span>
                  {filters.categories.includes(category) && (
                    <span className="check-icon">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Filter */}
        <Accordion defaultActiveKey="0" className="mb-3 fade-in delay-1">
          <Accordion.Item eventKey="0" className="border-0 shadow-sm">
            <Accordion.Header className="filter-header">
              <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
              Level
              {filters.levels.length > 0 && (
                <Badge 
                  bg="primary" 
                  pill 
                  className="ms-2 scale-in"
                >
                  {filters.levels.length}
                </Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap">
                {levels.map((level, index) => (
                  <div 
                    key={index}
                    className={`level-badge scale-hover ${filters.levels.includes(level) ? 'active' : ''}`}
                    onClick={() => handleLevelToggle(level)}
                  >
                    {level}
                    {filters.levels.includes(level) && (
                      <div className="ms-1 fade-in">
                        <FontAwesomeIcon icon={faCheck} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Price Filter */}
        <Accordion defaultActiveKey="0" className="mb-3 fade-in delay-2">
          <Accordion.Item eventKey="0" className="border-0 shadow-sm">
            <Accordion.Header className="filter-header">
              <FontAwesomeIcon icon={faDollarSign} className="me-2 text-primary" />
              Price
              {(filters.price.min > 0 || filters.price.max < 200 || filters.price.free) && (
                <Badge 
                  bg="primary" 
                  pill 
                  className="ms-2 scale-in"
                >
                  {(filters.price.min > 0 || filters.price.max < 200 ? 1 : 0) + (filters.price.free ? 1 : 0)}
                </Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <div className="price-slider mb-3">
                <div className="d-flex justify-content-between mb-2 price-range-values">
                  <span className="price-bubble">${filters.price.min.toFixed(0)}</span>
                  <span className="price-bubble">${filters.price.max.toFixed(0)}</span>
                </div>
                <Form.Range 
                  min="0" 
                  max="200" 
                  step="5"
                  name="min"
                  value={filters.price.min}
                  onChange={handlePriceChange}
                  className="mb-3 custom-range"
                />
                <Form.Range 
                  min={filters.price.min} 
                  max="200" 
                  step="5"
                  name="max"
                  value={filters.price.max}
                  onChange={handlePriceChange}
                  className="custom-range"
                />
              </div>
              
              <Form.Check 
                type="switch"
                id="free-courses-switch"
                label="Free Courses Only"
                checked={filters.price.free}
                onChange={handleFreeToggle}
                className="custom-switch bounce-hover"
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Rating Filter */}
        <Accordion defaultActiveKey="0" className="mb-4 fade-in delay-3">
          <Accordion.Item eventKey="0" className="border-0 shadow-sm">
            <Accordion.Header className="filter-header">
              <FontAwesomeIcon icon={faStar} className="me-2 text-primary" />
              Rating
              {filters.ratings > 0 && (
                <Badge 
                  bg="primary" 
                  pill 
                  className="ms-2 scale-in"
                >
                  1
                </Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <div className="ratings">
                {[4, 3, 2, 1].map(rating => (
                  <div 
                    key={rating}
                    className={`rating-option d-flex align-items-center p-2 rounded cursor-pointer ${filters.ratings === rating ? 'active' : ''}`}
                    onClick={() => handleRatingChange(rating)}
                  >
                    <div className="stars me-2">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon 
                          key={i}
                          icon={faStar}
                          className={i < rating ? 'text-warning star-animated' : 'text-muted opacity-25'}
                        />
                      ))}
                    </div>
                    <span>&amp; Up</span>
                    {filters.ratings === rating && (
                      <div className="ms-auto fade-in">
                        <FontAwesomeIcon icon={faCheck} className="text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Filter Actions */}
        <div className="filter-actions d-flex mt-4 fade-in delay-4">
          <Button 
            variant={filterChanged ? "primary" : "outline-primary"} 
            className={`flex-grow-1 me-2 rounded-pill apply-filters-btn ${filterChanged ? 'pulse-on-hover" disabled="false' : ''}`}
            onClick={handleApplyFilters}
            disabled={!filterChanged}
          >
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            Apply Filters
          </Button>
          <Button 
            variant="outline-secondary" 
            className="rounded-pill rotate-hover reset-filters-btn"
            onClick={handleResetFilters}
          >
            <FontAwesomeIcon icon={faRedo} />
          </Button>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        /* Base Styles */
        .course-filters .accordion-button:not(.collapsed) {
          background-color: white;
          color: var(--bs-primary);
          box-shadow: none;
          font-weight: 600;
        }
        
        .course-filters .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(0,0,0,.125);
        }
        
        /* Mobile Styles */
        @media (max-width: 767.98px) {
          .course-filters {
            display: none;
            position: fixed;
            top: 0;
            right: 0;
            width: 320px;
            height: 100vh;
            background-color: white;
            z-index: 1050;
            padding: 0;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
          }
          
          .course-filters.show-mobile-filters {
            display: block;
          }
          
          .filter-mobile-header {
            position: sticky;
            top: 0;
            background-color: white;
            z-index: 1;
          }
          
          body.filters-open {
            overflow: hidden;
          }
        }
        
        /* Filter Sections */
        .filter-section {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .filter-section:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .filter-section-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .filter-icon-container {
          box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.2);
        }

        /* Category Pills */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }

        .category-pill {
          padding: 12px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(10px);
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .category-pill:hover {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border-color: rgba(var(--bs-primary-rgb), 0.3);
        }

        .category-pill.active {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #4f46e5 100%);
          color: white;
          border-color: var(--bs-primary);
          box-shadow: 0 4px 16px rgba(var(--bs-primary-rgb), 0.3);
        }

        .category-pill .category-text {
          flex: 1;
          text-align: center;
        }

        .category-pill .check-icon {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          font-size: 11px;
          opacity: 0;
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.2);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-pill.active .check-icon {
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
        }
        
        /* Level Badges */
        .level-badge {
          padding: 6px 12px;
          border-radius: 4px;
          margin-right: 8px;
          margin-bottom: 8px;
          background-color: #f1f1f1;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        
        .level-badge:hover {
          background-color: #e1e1e1;
          transform: translateY(-2px);
        }
        
        .level-badge.active {
          background-color: #cfe2ff;
          color: var(--bs-primary);
          font-weight: 500;
        }
        
        /* Rating Stars */
        .rating-option {
          transition: all 0.2s ease;
          cursor: pointer;
          margin-bottom: 8px;
        }
        
        .rating-option:hover {
          background-color: #f8f9fa;
        }
        
        .rating-option.active {
          background-color: #fff8e1;
        }
        
        .star-animated {
          animation: starPulse 2s infinite;
        }
        
        @keyframes starPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        /* Price Range */
        .price-range-values {
          position: relative;
          height: 30px;
        }
        
        .price-bubble {
          position: relative;
          background-color: var(--bs-primary);
          color: white;
          padding: 2px 8px;
          border-radius: 16px;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }
        
        .custom-range {
          height: 6px;
          cursor: pointer;
        }
        
        .custom-range::-webkit-slider-thumb {
          width: 18px;
          height: 18px;
          margin-top: -6px;
          background-color: var(--bs-primary);
          border: 2px solid white;
          transition: all 0.2s ease;
        }
        
        .custom-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        /* Form Elements */
        .custom-switch {
          padding-left: 2.5rem;
        }
        
        .form-check-input:checked {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
        
        .form-check-input {
          cursor: pointer;
        }
        
        /* Filter Header */
        .filter-header {
          transition: all 0.3s ease;
        }
        
        .filter-header:hover {
          color: var(--bs-primary);
        }
        
        /* Active Filters */
        .active-filters {
          background-color: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .active-filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .filter-chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          animation: chipSlideIn 0.3s ease forwards;
          opacity: 0;
          transform: translateX(-10px);
        }
        
        @keyframes chipSlideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .chip-remove-btn {
          border: none;
          background: transparent;
          margin-left: 6px;
          padding: 0;
          font-size: 0.8rem;
          color: #6c757d;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .chip-remove-btn:hover {
          background-color: #e9ecef;
          color: #dc3545;
        }
        
        /* Button Animations */
        .animate-success {
          animation: successPulse 1s;
        }
        
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); background-color: #198754; border-color: #198754; }
        }
        
        .animate-reset {
          animation: spinOnce 0.5s;
        }
        
        @keyframes spinOnce {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Badge Animations */
        .scale-in {
          animation: scaleIn 0.3s ease;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .pulse-animation {
          animation: pulsate 2s infinite;
        }
        
        @keyframes pulsate {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Mobile Filters Animation */
        .slide-in-right {
          animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        /* Cursor */
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default CourseFilters;