import React, { useState, useEffect, useCallback, useRef } from 'react';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import CourseService from '../services/api/courseService';
import localCourseData from '../data/courseData';
import { Spinner, Alert, Button } from 'react-bootstrap';

function CoursesPage() {
  // State for course data and UI
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [filterChanging, setFilterChanging] = useState(false); // Only for filter changes
  const [error, setError] = useState(null);
  const [usingLocalData, setUsingLocalData] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Refs
  const isFirstRender = useRef(true);
  const prevFilters = useRef(filters);
  
  // Fetch courses function - with separated loading states
  const fetchCourses = useCallback(async (currentFilters, isInitialRequest = false) => {
    try {
      const filteredCourses = await CourseService.getCourses(currentFilters);
      
      // Update courses with a smooth transition
      setCourses(prev => {
        if (filteredCourses && filteredCourses.length > 0) {
          return filteredCourses;
        }
        return prev.length > 0 && !isInitialRequest ? prev : filteredCourses || [];
      });
      
      setUsingLocalData(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      
      // Create filtered local courses as fallback
      const localCoursesFiltered = localCourseData
        .filter(course => {
          if (currentFilters.category && course.category !== currentFilters.category) return false;
          if (currentFilters.level && course.level !== currentFilters.level) return false;
          if (currentFilters.search) {
            const term = currentFilters.search.toLowerCase();
            return course.title.toLowerCase().includes(term) || 
                  course.description.toLowerCase().includes(term);
          }
          return true;
        })
        .map(course => ({
          ...course,
          _id: `local-${course.id}`
        }));
      
      setCourses(localCoursesFiltered);
      setUsingLocalData(true);
      setError('Could not load courses from server. Showing offline data.');
    } finally {
      if (isInitialRequest) {
        setInitialLoading(false);
      } else {
        setFilterChanging(false);
      }
    }
  }, []);

  // Fetch categories - called only once on component mount
  const fetchCategories = useCallback(async () => {
    try {
      const categoryData = await CourseService.getCategories();
      setCategories(categoryData || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to local categories
      const localCategories = [...new Set(localCourseData.map(course => course.category))];
      setCategories(localCategories);
    }
  }, []);
  
  // Initial data load - only runs once
  useEffect(() => {
    fetchCategories();
    fetchCourses(filters, true);
    
    return () => {
      CourseService.clearCache();
    };
  }, [fetchCategories, fetchCourses]);
  
  // Handle filter changes with debounce
  useEffect(() => {
    // Skip the very first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevFilters.current = filters;
      return;
    }
    
    // Skip identical filter changes
    if (JSON.stringify(prevFilters.current) === JSON.stringify(filters)) {
      return;
    }
    
    prevFilters.current = filters;
    setFilterChanging(true);
    
    const timer = setTimeout(() => {
      fetchCourses(filters);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, fetchCourses]);

  // Update filters handler
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar with filters */}
        <div className="col-lg-3 mb-4">
          <CourseFilters 
            categories={categories} 
            filters={filters} 
            onFilterChange={handleFilterChange}
            disabled={filterChanging}
          />
          
          {usingLocalData && (
            <Alert variant="warning" className="mt-3">
              <small>
                <i className="fas fa-info-circle me-2"></i>
                Using offline course data.
              </small>
            </Alert>
          )}
        </div>
        
        {/* Main content area */}
        <div className="col-lg-9">
          {/* Header with title and view options */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">All Courses</h1>
            <div className="view-options">
              <Button 
                variant={viewMode === 'grid' ? "primary" : "outline-primary"} 
                className="me-2"
                onClick={() => toggleViewMode('grid')}
                disabled={filterChanging}
              >
                <i className="fas fa-th-large"></i>
              </Button>
              <Button 
                variant={viewMode === 'list' ? "primary" : "outline-primary"}
                onClick={() => toggleViewMode('list')}
                disabled={filterChanging}
              >
                <i className="fas fa-list"></i>
              </Button>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <Alert variant="danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
              <button 
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={() => {
                  setFilterChanging(true);
                  fetchCourses(filters);
                }}
              >
                Try Again
              </button>
            </Alert>
          )}
          
          {/* Initial loading spinner - only visible on first page load */}
          {initialLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading courses...</p>
            </div>
          ) : (
            <>
              {/* Small indicator for filter changes - without causing layout shifts */}
              {filterChanging && (
                <div className="filter-loading-indicator">
                  <div className="d-inline-block px-3 py-1 rounded-pill bg-light text-primary mb-3">
                    <small>
                      <Spinner animation="border" size="sm" role="status" className="me-2" />
                      Updating...
                    </small>
                  </div>
                </div>
              )}
              
              {/* Course list */}
              {courses.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No courses found. Try adjusting your filters.
                </Alert>
              ) : (
                <div className={viewMode === 'grid' ? "row g-4" : "list-view"}>
                  {courses.map(course => (
                    <div 
                      className={viewMode === 'grid' ? "col-md-6 col-xl-4 mb-4" : "mb-4"} 
                      key={course._id || course.id || `course-${Math.random()}`}
                    >
                      <CourseCard course={course} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;