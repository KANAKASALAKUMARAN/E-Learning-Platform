import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
    <div className="courses-page py-5">
      <Container>
        {/* Hero Section */}
        <section className="mb-5 text-center reveal">
          <h1 className="display-4 fw-bold mb-3 slide-up">Explore Our Courses</h1>
          <p className="lead mb-5 text-muted slide-up delay-1">Discover top-quality courses to enhance your skills and advance your career</p>
          
          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-lg-6 position-relative slide-up delay-2">
              <div className="input-group mb-3 shadow-sm rounded-pill overflow-hidden">
                <span className="input-group-text border-0 bg-white ps-4">
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-3"
                  placeholder="Search for courses, topics, or skills..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button 
                    className="btn position-absolute end-0 top-0 h-100 px-3 bg-transparent border-0"
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
        </section>

        {/* Filters and Courses Section */}
        <Row>
          {/* Filters Section - Collapsible on mobile */}
          <Col lg={3} className="mb-4">
            <div className={`filter-sidebar card border-0 shadow-sm ${filterOpen ? 'filter-open' : ''}`}>
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="badge bg-primary rounded-pill ms-2">{getActiveFilterCount()}</span>
                  )}
                </h5>
                <button 
                  className="btn btn-sm btn-light rounded-pill d-lg-none"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  {filterOpen ? 'Close' : 'Show'}
                </button>
              </div>
              
              <div className={`card-body filter-body ${filterOpen ? 'show' : ''}`}>
                <CourseFilters 
                  activeFilters={activeFilters} 
                  applyFilters={applyFilters}
                  clearFilters={clearFilters}
                />
              </div>
            </div>
          </Col>

          {/* Courses Section */}
          <Col lg={9}>
            {/* Sort and View Options */}
            <div className="d-flex justify-content-between align-items-center mb-4 reveal-left">
              <div className="results-count">
                <p className="text-muted mb-0">
                  Showing <span className="fw-bold">{filteredCourses.length}</span> courses
                </p>
              </div>
              
              <div className="d-flex align-items-center">
                {/* Sort Dropdown */}
                <div className="me-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faSort} className="text-muted me-2" />
                  <select 
                    className="form-select form-select-sm border-0 bg-light rounded-pill"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
                
                {/* View Toggle */}
                <div className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setView('grid')}
                  >
                    <FontAwesomeIcon icon={faThLarge} />
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setView('list')}
                  >
                    <FontAwesomeIcon icon={faList} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="active-filters mb-3 p-3 bg-light rounded-3 reveal-left">
                <div className="d-flex flex-wrap align-items-center">
                  <span className="me-3 text-muted">Active Filters:</span>
                  
                  {activeFilters.categories.map((category, index) => (
                    <span key={`cat-${index}`} className="badge bg-primary rounded-pill m-1 scale-in">{category}</span>
                  ))}
                  
                  {activeFilters.levels.map((level, index) => (
                    <span key={`level-${index}`} className="badge bg-info text-dark rounded-pill m-1 scale-in">{level}</span>
                  ))}
                  
                  {activeFilters.ratings > 0 && (
                    <span className="badge bg-warning text-dark rounded-pill m-1 scale-in">{activeFilters.ratings}+ Stars</span>
                  )}
                  
                  {activeFilters.price.free && (
                    <span className="badge bg-success rounded-pill m-1 scale-in">Free</span>
                  )}
                  
                  <button 
                    className="btn btn-sm btn-light rounded-pill ms-auto"
                    onClick={clearFilters}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5 reveal">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 slide-up delay-1">Loading your courses...</p>
                <div className="loading-pulse mt-2">
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                </div>
              </div>
            ) : (
              <>
                {/* No Results */}
                {filteredCourses.length === 0 ? (
                  <Card className="text-center p-5 border-0 shadow-sm reveal">
                    <Card.Body className="p-5">
                      <div className="mb-4 scale-in">
                        <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted" />
                      </div>
                      <h3>No courses found</h3>
                      <p className="text-muted">Try adjusting your search or filter criteria</p>
                      <button className="btn btn-primary rounded-pill px-4" onClick={clearFilters}>
                        Reset All Filters
                      </button>
                    </Card.Body>
                  </Card>
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
        @media (max-width: 992px) {
          .filter-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s ease;
          }
          
          .filter-body.show {
            max-height: 1500px;
          }
        }
        
        .courses-page .form-control:focus,
        .courses-page .form-select:focus {
          box-shadow: none;
          border-color: var(--bs-primary);
        }
        
        .page-link {
          transition: all 0.2s ease;
        }
        
        .page-link:hover {
          transform: scale(1.1);
          z-index: 5;
        }
        
        .pagination {
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.1));
        }
        
        .active .page-link {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;