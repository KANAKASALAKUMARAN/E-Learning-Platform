import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faThLarge, faList, faTimes } from '@fortawesome/free-solid-svg-icons';

// Import mock course data
import courseData from '../data/courseData';
import '../assets/css/animations.css';

const CoursesPage = () => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    levels: [],
    price: { min: 0, max: 200, free: false },
    ratings: 0,
  });
  
  const coursesPerPage = 12;

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setFilteredCourses(courseData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Filter courses based on search term
    if (term.trim() === '') {
      setFilteredCourses(courseData);
    } else {
      const results = courseData.filter(course => 
        course.title.toLowerCase().includes(term.toLowerCase()) || 
        course.description.toLowerCase().includes(term.toLowerCase()) ||
        course.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCourses(results);
    }
    
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Apply filters
  const applyFilters = (filters) => {
    setActiveFilters(filters);
    
    let results = [...courseData];
    
    // Filter by categories
    if (filters.categories.length > 0) {
      results = results.filter(course => 
        filters.categories.includes(course.category)
      );
    }
    
    // Filter by level
    if (filters.levels.length > 0) {
      results = results.filter(course => 
        filters.levels.includes(course.level)
      );
    }
    
    // Filter by price
    results = results.filter(course => 
      (course.price >= filters.price.min && course.price <= filters.price.max) ||
      (filters.price.free && course.price === 0)
    );
    
    // Filter by rating
    if (filters.ratings > 0) {
      results = results.filter(course => course.rating >= filters.ratings);
    }
    
    // Apply search term if present
    if (searchTerm.trim() !== '') {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCourses(results);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    
    let sortedCourses = [...filteredCourses];
    
    switch (sortValue) {
      case 'newest':
        // Assuming courses have a createdAt field (for demo we're just reversing)
        sortedCourses.reverse();
        break;
      case 'price-low':
        sortedCourses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedCourses.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedCourses.sort((a, b) => b.rating - a.rating);
        break;
      default: // popular
        sortedCourses.sort((a, b) => b.students - a.students);
    }
    
    setFilteredCourses(sortedCourses);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      levels: [],
      price: { min: 0, max: 200, free: false },
      ratings: 0,
    });
    setSearchTerm('');
    setFilteredCourses(courseData);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    count += activeFilters.categories.length;
    count += activeFilters.levels.length;
    count += activeFilters.ratings > 0 ? 1 : 0;
    count += activeFilters.price.free ? 1 : 0;
    return count;
  };

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <section className="hero-section py-5 mb-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container>
          <div className="text-center reveal">
            <h1 className="display-4 fw-bold mb-4 slide-up" style={{ color: '#2c3e50' }}>
              Explore Our Courses
            </h1>
            <p className="lead mb-5 text-muted slide-up delay-1" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Discover top-quality courses to enhance your skills and advance your career with expert instructors
            </p>

            {/* Search Bar */}
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6 position-relative slide-up delay-2">
                <div className="search-container position-relative">
                  <div className="input-group shadow-lg rounded-pill overflow-hidden bg-white">
                    <span className="input-group-text border-0 bg-white ps-4">
                      <FontAwesomeIcon icon={faSearch} className="text-primary" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 py-4 px-3"
                      placeholder="Search for courses, topics, or skills..."
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ fontSize: '1.1rem' }}
                    />
                    {searchTerm && (
                      <button
                        className="btn position-absolute end-0 top-0 h-100 px-4 bg-transparent border-0 z-index-2"
                        onClick={() => {
                          setSearchTerm('');
                          setFilteredCourses(courseData);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-muted" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Section */}
      <Container className="main-content">

        {/* Filters and Courses Section */}
        <Row className="g-4">
          {/* Filters Section - Collapsible on mobile */}
          <Col lg={3} className="mb-4">
            <div className="filter-sidebar-container">
              <div className={`filter-sidebar ${filterOpen ? 'filter-open' : ''}`}>
                <div className="filter-sidebar-header d-flex justify-content-between align-items-center p-4 bg-white rounded-top shadow-sm">
                  <div className="d-flex align-items-center">
                    <div className="filter-header-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                         style={{ backgroundColor: 'var(--bs-primary)', width: '36px', height: '36px' }}>
                      <FontAwesomeIcon icon={faFilter} className="text-white" style={{ fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-dark">Filters</h5>
                      {getActiveFilterCount() > 0 && (
                        <small className="text-muted">{getActiveFilterCount()} active</small>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill d-lg-none px-3"
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    {filterOpen ? 'Close' : 'Show'}
                  </button>
                </div>

                <div className={`filter-sidebar-body ${filterOpen ? 'show' : ''} bg-white rounded-bottom shadow-sm`}>
                  <div className="p-4">
                    <CourseFilters
                      activeFilters={activeFilters}
                      applyFilters={applyFilters}
                      clearFilters={clearFilters}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Courses Section */}
          <Col lg={9}>
            {/* Sort and View Options */}
            <div className="courses-header bg-white rounded-3 shadow-sm p-4 mb-4 reveal-left">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="results-info mb-3 mb-md-0">
                  <h4 className="mb-1 fw-bold text-dark">
                    {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    {searchTerm ? `Results for "${searchTerm}"` : 'All available courses'}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="sort-container d-flex align-items-center">
                    <FontAwesomeIcon icon={faSort} className="text-muted me-2" />
                    <select
                      className="form-select form-select-sm border-2 rounded-pill px-3 py-2"
                      value={sortBy}
                      onChange={handleSortChange}
                      style={{ minWidth: '160px', fontSize: '0.85rem' }}
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="view-toggle btn-group shadow-sm" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm px-3 py-2 ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setView('grid')}
                      title="Grid View"
                    >
                      <FontAwesomeIcon icon={faThLarge} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm px-3 py-2 ${view === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setView('list')}
                      title="List View"
                    >
                      <FontAwesomeIcon icon={faList} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="active-filters-container bg-white rounded-3 shadow-sm p-4 mb-4 reveal-left">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  <div className="active-filters-label mb-2 mb-md-0 me-md-3">
                    <h6 className="mb-0 fw-bold text-dark">Active Filters:</h6>
                  </div>

                  <div className="active-filters-tags d-flex flex-wrap align-items-center flex-grow-1">
                    {activeFilters.categories.map((category, index) => (
                      <span key={`cat-${index}`} className="filter-tag bg-primary text-white rounded-pill px-3 py-1 m-1 scale-in">
                        {category}
                      </span>
                    ))}

                    {activeFilters.levels.map((level, index) => (
                      <span key={`level-${index}`} className="filter-tag bg-info text-white rounded-pill px-3 py-1 m-1 scale-in">
                        {level}
                      </span>
                    ))}

                    {activeFilters.ratings > 0 && (
                      <span className="filter-tag bg-warning text-dark rounded-pill px-3 py-1 m-1 scale-in">
                        {activeFilters.ratings}+ Stars
                      </span>
                    )}

                    {activeFilters.price.free && (
                      <span className="filter-tag bg-success text-white rounded-pill px-3 py-1 m-1 scale-in">
                        Free
                      </span>
                    )}
                  </div>

                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 py-2 mt-2 mt-md-0"
                    onClick={clearFilters}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="loading-container">
                {/* Loading Header */}
                <div className="loading-header bg-white rounded-3 shadow-sm p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="loading-skeleton-text" style={{ width: '200px', height: '24px' }}></div>
                    <div className="loading-skeleton-text" style={{ width: '120px', height: '20px' }}></div>
                  </div>
                </div>

                {/* Loading Cards Grid */}
                <Row className="g-4">
                  {[...Array(6)].map((_, index) => (
                    <Col key={index} xs={12} md={6} xl={4} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="loading-card card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                        <div className="loading-skeleton-image" style={{ height: '180px', borderRadius: '16px 16px 0 0' }}></div>
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="loading-skeleton-text" style={{ width: '60px', height: '20px' }}></div>
                            <div className="loading-skeleton-text" style={{ width: '80px', height: '16px' }}></div>
                          </div>
                          <div className="loading-skeleton-text mb-2" style={{ width: '100%', height: '20px' }}></div>
                          <div className="loading-skeleton-text mb-3" style={{ width: '80%', height: '16px' }}></div>
                          <div className="loading-skeleton-text mb-3" style={{ width: '60%', height: '16px' }}></div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="loading-skeleton-text" style={{ width: '100px', height: '16px' }}></div>
                            <div className="loading-skeleton-text" style={{ width: '80px', height: '32px', borderRadius: '16px' }}></div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Loading Animation */}
                <div className="text-center mt-5">
                  <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <p className="mt-3 text-muted fw-medium">Loading amazing courses for you...</p>
                </div>
              </div>
            ) : (
              <>
                {/* No Results */}
                {filteredCourses.length === 0 ? (
                  <div className="empty-state-container">
                    <div className="empty-state bg-white rounded-3 shadow-sm p-5 text-center reveal">
                      <div className="empty-state-illustration mb-4">
                        <div className="empty-state-icon-container">
                          <div className="empty-state-icon">
                            <FontAwesomeIcon icon={faSearch} className="text-primary" />
                          </div>
                          <div className="empty-state-particles">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className="empty-state-content">
                        <h3 className="mb-3 fw-bold text-dark">No courses found</h3>
                        <p className="text-muted mb-4 lead" style={{ maxWidth: '400px', margin: '0 auto' }}>
                          {searchTerm
                            ? `We couldn't find any courses matching "${searchTerm}". Try different keywords or adjust your filters.`
                            : "No courses match your current filter criteria. Try adjusting your filters to see more results."
                          }
                        </p>

                        <div className="empty-state-actions">
                          {searchTerm && (
                            <button
                              className="btn btn-outline-primary rounded-pill px-4 py-2 me-3"
                              onClick={() => {
                                setSearchTerm('');
                                setFilteredCourses(courseData);
                              }}
                            >
                              Clear Search
                            </button>
                          )}
                          <button
                            className="btn btn-primary rounded-pill px-4 py-2"
                            onClick={clearFilters}
                          >
                            Reset All Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Course Grid
                  <>
                    <Row className="g-4">
                      {currentCourses.map((course, index) => (
                        <Col 
                          key={course.id} 
                          xs={12} 
                          md={view === 'grid' ? 6 : 12} 
                          xl={view === 'grid' ? 4 : 12}
                          className="fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CourseCard course={course} featured={index === 0} />
                        </Col>
                      ))}
                    </Row>

                    {/* Pagination */}
                    {filteredCourses.length > coursesPerPage && (
                      <nav className="mt-5 d-flex justify-content-center reveal">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(currentPage - 1)}
                              aria-label="Previous"
                            >
                              <span aria-hidden="true">&laquo;</span>
                            </button>
                          </li>
                          
                          {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }).map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                              <button 
                                className="page-link hover-primary transition-all" 
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                          
                          <li className={`page-item ${currentPage === Math.ceil(filteredCourses.length / coursesPerPage) ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(currentPage + 1)}
                              aria-label="Next"
                            >
                              <span aria-hidden="true">&raquo;</span>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .search-container {
          max-width: 100%;
        }

        .search-container .input-group {
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .search-container .input-group:focus-within {
          border-color: var(--bs-primary);
          transform: translateY(-2px);
        }

        .filter-sidebar-container {
          position: sticky;
          top: 20px;
        }

        .filter-sidebar {
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .filter-header-icon {
          box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.2);
        }

        .courses-header {
          border: 1px solid rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .courses-header:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }

        .sort-container .form-select {
          border-color: rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        .sort-container .form-select:focus {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
        }

        .view-toggle .btn {
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .active-filters-container {
          border: 1px solid rgba(0,0,0,0.08);
        }

        .filter-tag {
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        .filter-tag:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .hero-section {
            padding: 3rem 0;
          }

          .hero-section h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 992px) {
          .filter-sidebar-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s ease;
          }

          .filter-sidebar-body.show {
            max-height: 1500px;
          }

          .filter-sidebar-container {
            position: static;
          }

          .courses-header {
            padding: 1.5rem !important;
          }

          .courses-header .d-flex {
            gap: 1rem;
          }

          .sort-container .form-select {
            min-width: 140px !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 0;
          }

          .hero-section h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .hero-section p {
            font-size: 1rem;
            margin-bottom: 2rem;
          }

          .search-container .input-group {
            border-radius: 12px;
          }

          .search-container .form-control {
            padding: 1rem !important;
            font-size: 1rem !important;
          }

          .courses-header {
            padding: 1rem !important;
          }

          .courses-header h4 {
            font-size: 1.25rem;
          }

          .active-filters-container {
            padding: 1rem !important;
          }

          .filter-tag {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem !important;
          }

          .view-toggle .btn {
            padding: 0.5rem 0.75rem;
          }

          .empty-state {
            padding: 2rem !important;
            min-height: 300px;
          }

          .empty-state-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .empty-state h3 {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 576px) {
          .hero-section {
            padding: 1.5rem 0;
          }

          .hero-section h1 {
            font-size: 1.75rem;
          }

          .search-container .col-lg-8 {
            padding: 0 1rem;
          }

          .courses-header .d-flex {
            flex-direction: column;
            align-items: stretch !important;
            gap: 1rem;
          }

          .courses-header .d-flex > div:last-child {
            justify-content: space-between;
          }

          .sort-container {
            flex: 1;
          }

          .sort-container .form-select {
            width: 100%;
            min-width: auto !important;
          }

          .active-filters-container .d-flex {
            flex-direction: column;
            align-items: stretch !important;
          }

          .active-filters-tags {
            margin-bottom: 1rem;
          }

          .active-filters-container button {
            align-self: stretch;
          }

          .empty-state-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .empty-state-actions .btn {
            width: 100%;
            margin: 0 !important;
          }

          .loading-container .col-xl-4 {
            margin-bottom: 1rem;
          }
        }

        /* Touch-friendly interactions */
        @media (hover: none) and (pointer: coarse) {
          .category-pill,
          .filter-tag,
          .btn,
          .page-link {
            min-height: 44px;
            min-width: 44px;
          }

          .view-toggle .btn {
            padding: 0.75rem;
          }

          .sort-container .form-select {
            padding: 0.75rem 1rem;
          }
        }

        .courses-page .form-control:focus,
        .courses-page .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
          border-color: var(--bs-primary);
        }

        .page-link {
          transition: all 0.2s ease;
          border-radius: 8px;
          margin: 0 2px;
        }

        .page-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .pagination {
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.1));
        }

        .active .page-link {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
          box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.3);
        }

        .main-content {
          min-height: 60vh;
        }

        /* Loading States */
        .loading-skeleton-text {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .loading-skeleton-image {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
        }

        @keyframes loading-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .loading-spinner-container {
          position: relative;
          display: inline-block;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(var(--bs-primary-rgb), 0.1);
          border-top: 3px solid var(--bs-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 8px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background-color: var(--bs-primary);
          border-radius: 50%;
          animation: loading-bounce 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes loading-bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }

        /* Empty States */
        .empty-state {
          border: 1px solid rgba(0,0,0,0.08);
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .empty-state-icon-container {
          position: relative;
          display: inline-block;
        }

        .empty-state-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--bs-primary) 0%, #4f46e5 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          box-shadow: 0 8px 24px rgba(var(--bs-primary-rgb), 0.3);
          animation: empty-state-pulse 2s infinite;
        }

        .empty-state-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .empty-state-particles span {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: var(--bs-primary);
          border-radius: 50%;
          opacity: 0.6;
          animation: empty-state-float 3s infinite ease-in-out;
        }

        .empty-state-particles span:nth-child(1) {
          top: -60px;
          left: -20px;
          animation-delay: 0s;
        }

        .empty-state-particles span:nth-child(2) {
          top: -40px;
          right: -30px;
          animation-delay: 0.5s;
        }

        .empty-state-particles span:nth-child(3) {
          bottom: -50px;
          left: -25px;
          animation-delay: 1s;
        }

        .empty-state-particles span:nth-child(4) {
          bottom: -35px;
          right: -20px;
          animation-delay: 1.5s;
        }

        @keyframes empty-state-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes empty-state-float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
        }

        .empty-state-actions .btn {
          transition: all 0.3s ease;
        }

        .empty-state-actions .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;