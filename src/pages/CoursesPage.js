import React, { useState, useEffect, useRef, useMemo } from 'react';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import CourseService from '../services/api/courseService';
import localCourseData from '../data/courseData';
import { Spinner, Alert, Button } from 'react-bootstrap';

function CoursesPage() {
  // State for course data and UI
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingLocalData, setUsingLocalData] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Refs to handle API calls and prevent race conditions
  const isMounted = useRef(true);
  const lastFetchTimestamp = useRef(0);
  const fetchRequestId = useRef(0);
  const currentCoursesRef = useRef([]);
  const initialLoadComplete = useRef(false);
  
  // Pre-process local course data
  const localCategoriesData = useMemo(() => {
    return [...new Set(localCourseData.map(course => course.category))];
  }, []);

  // Prepare local courses with MongoDB-compatible IDs
  const preparedLocalCourseData = useMemo(() => {
    return localCourseData.map(course => ({
      ...course,
      _id: `local-${course.id}`
    }));
  }, []);
  
  // Filter local courses (performance optimized)
  const filterLocalCourses = useMemo(() => {
    if (!filters.category && !filters.level && !filters.search) {
      return preparedLocalCourseData;
    }
    
    return preparedLocalCourseData.filter(course => {
      // Category filter
      if (filters.category && course.category !== filters.category) {
        return false;
      }
      
      // Level filter
      if (filters.level && course.level !== filters.level) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return course.title.toLowerCase().includes(searchTerm) || 
               course.description.toLowerCase().includes(searchTerm);
      }
      
      return true;
    });
  }, [filters, preparedLocalCourseData]);

  // Fetch courses with optimized error handling and debouncing
  const fetchCourses = async (currentFilters) => {
    const requestId = ++fetchRequestId.current;
    const now = Date.now();
    
    // Implement request throttling (don't send requests too close together)
    if (now - lastFetchTimestamp.current < 300 && !initialLoading) {
      return;
    }
    
    lastFetchTimestamp.current = now;
    
    if (!initialLoading) {
      setLoading(true);
    }
    
    try {
      const filteredCourses = await CourseService.getCourses(currentFilters);
      
      // Prevent race conditions by checking if this is still the latest request
      if (requestId !== fetchRequestId.current || !isMounted.current) {
        return;
      }
      
      // Keep reference for stable rendering
      currentCoursesRef.current = filteredCourses || [];
      
      // Batch these state updates to avoid multiple renders
      if (isMounted.current) {
        // Immediately set courses to prevent flickering
        setCourses(currentCoursesRef.current);
        
        // These updates don't cause visual flicker, so they can be separate
        setUsingLocalData(false);
        setError(null);
      }
    } catch (error) {
      // Prevent race conditions
      if (requestId !== fetchRequestId.current || !isMounted.current) {
        return;
      }
      
      console.error('Error fetching courses:', error);
      
      // Keep reference for stable rendering
      currentCoursesRef.current = filterLocalCourses;
      
      // Batch these state updates
      if (isMounted.current) {
        setCourses(currentCoursesRef.current);
        setUsingLocalData(true);
      }
    } finally {
      if (isMounted.current) {
        // Use RAF to ensure loading state changes happen after rendering
        requestAnimationFrame(() => {
          // Then use a timeout to delay it a bit more for smoother transitions
          setTimeout(() => {
            if (isMounted.current) {
              setLoading(false);
              setInitialLoading(false);
            }
          }, 300);
        });
      }
    }
  };

  // Load data on component mount (only once)
  useEffect(() => {
    // Skip if already loaded
    if (initialLoadComplete.current) return;
    
    // Mark as loaded to prevent duplicate loading
    initialLoadComplete.current = true;
    
    // Reset refs
    isMounted.current = true;
    fetchRequestId.current = 0;
    currentCoursesRef.current = [];
    
    // First, set initial data immediately to reduce perceived loading time
    setCourses(preparedLocalCourseData);
    setCategories(localCategoriesData);
    
    // Then load data from API with timeout to prevent immediate loading state transitions
    setTimeout(async () => {
      if (!isMounted.current) return;
      
      try {
        // Start API calls in parallel for better performance
        const coursesPromise = CourseService.getCourses({}).catch(() => null);
        const categoriesPromise = CourseService.getCategories().catch(() => null);
        
        // Wait for both API calls
        const results = await Promise.allSettled([
          coursesPromise, 
          categoriesPromise
        ]);
        
        if (!isMounted.current) return;
        
        // Handle courses result
        if (results[0].status === 'fulfilled' && results[0].value) {
          currentCoursesRef.current = results[0].value;
          setCourses(results[0].value);
          setUsingLocalData(false);
        }
        
        // Handle categories result
        if (results[1].status === 'fulfilled' && results[1].value) {
          setCategories(results[1].value);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        if (isMounted.current) {
          // Use RAF for smoother transitions
          requestAnimationFrame(() => {
            setTimeout(() => {
              if (isMounted.current) {
                setInitialLoading(false);
              }
            }, 300);
          });
        }
      }
    }, 100);
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, [localCategoriesData, preparedLocalCourseData]);

  // Handle filter changes (with debouncing)
  useEffect(() => {
    // Skip initial render where filters are empty
    if (initialLoading) return;
    
    const timerId = setTimeout(() => {
      if (isMounted.current) {
        fetchCourses(filters);
      }
    }, 400); // 400ms debounce
    
    return () => clearTimeout(timerId);
  }, [filters, initialLoading]);

  // Update filters handler
  const handleFilterChange = (newFilters) => {
    // Prevent re-render if filters haven't changed
    setFilters(prev => {
      const isEqual = JSON.stringify(prev) === JSON.stringify({...prev, ...newFilters});
      if (isEqual) return prev;
      return { ...prev, ...newFilters };
    });
  };
  
  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Main render function for courses list - memoized to prevent re-renders
  const renderCoursesList = useMemo(() => {
    if (!courses || courses.length === 0) {
      return (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          No courses found. Try adjusting your filters.
        </Alert>
      );
    }

    return (
      <div className={viewMode === 'grid' ? "row g-4" : "list-view"}>
        {courses.map(course => (
          <div 
            className={viewMode === 'grid' ? "col-md-6 col-xl-4" : "mb-4"} 
            key={course._id || course.id || `course-${Math.random()}`}
          >
            <CourseCard course={course} viewMode={viewMode} />
          </div>
        ))}
      </div>
    );
  }, [courses, viewMode]);
  
  // Fixed position loading indicator
  const loadingIndicator = useMemo(() => {
    if (loading && !initialLoading) {
      return (
        <div className="loading-overlay position-fixed top-0 start-0 end-0 d-flex justify-content-center" 
             style={{zIndex: 1050, paddingTop: '15px'}}>
          <div className="bg-white py-1 px-3 rounded shadow d-flex align-items-center">
            <Spinner animation="border" size="sm" variant="primary" />
            <span className="ms-2">Loading...</span>
          </div>
        </div>
      );
    }
    return null;
  }, [loading, initialLoading]);

  return (
    <div className="container py-5">
      {loadingIndicator}
      
      <div className="row">
        {/* Filters sidebar */}
        <div className="col-lg-3 mb-4">
          <CourseFilters 
            categories={categories} 
            filters={filters} 
            onFilterChange={handleFilterChange}
            disabled={loading}
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">All Courses</h1>
            <div className="view-options">
              <Button 
                variant={viewMode === 'grid' ? "primary" : "outline-primary"} 
                className="me-2"
                onClick={() => toggleViewMode('grid')}
              >
                <i className="fas fa-th-large"></i>
              </Button>
              <Button 
                variant={viewMode === 'list' ? "primary" : "outline-primary"}
                onClick={() => toggleViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </Button>
            </div>
          </div>
          
          {initialLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading courses...</span>
              </Spinner>
              <p className="mt-3">Loading courses...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
              <button 
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={() => fetchCourses(filters)}
              >
                Try Again
              </button>
            </Alert>
          ) : (
            renderCoursesList
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;