import React, { useState, useEffect, useRef, useMemo } from 'react';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import CourseService from '../services/api/courseService';
import localCourseData from '../data/courseData';
import { Spinner, Alert } from 'react-bootstrap';

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
  
  // Refs to handle API calls and prevent race conditions
  const isMounted = useRef(true);
  const lastFetchTimestamp = useRef(0);
  const fetchRequestId = useRef(0);
  const currentCoursesRef = useRef([]);
  
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
      setCourses(currentCoursesRef.current);
      setUsingLocalData(false);
      setError(null);
    } catch (error) {
      // Prevent race conditions
      if (requestId !== fetchRequestId.current || !isMounted.current) {
        return;
      }
      
      console.error('Error fetching courses:', error);
      
      // Keep reference for stable rendering
      currentCoursesRef.current = filterLocalCourses;
      
      // Batch these state updates
      setCourses(currentCoursesRef.current);
      setUsingLocalData(true);
    } finally {
      if (isMounted.current) {
        // Delay clearing the loading state slightly to prevent flickering
        setTimeout(() => {
          if (isMounted.current) {
            setLoading(false);
            setInitialLoading(false);
          }
        }, 100);
      }
    }
  };

  // Fetch categories (optimized)
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await CourseService.getCategories();
      if (isMounted.current) {
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (isMounted.current) {
        setCategories(localCategoriesData);
      }
    }
  };

  // Load data on component mount (only once)
  useEffect(() => {
    // Reset refs
    isMounted.current = true;
    fetchRequestId.current = 0;
    currentCoursesRef.current = [];
    
    // Load initial data and fallback immediately to local data if API fails
    const initializeData = async () => {
      // Start API calls in parallel for better performance
      const coursesPromise = CourseService.getCourses({}).catch(() => null);
      const categoriesPromise = CourseService.getCategories().catch(() => null);
      
      try {
        // Wait for both API calls with a timeout
        const results = await Promise.allSettled([
          coursesPromise,
          categoriesPromise
        ]);
        
        if (!isMounted.current) return;
        
        // Handle courses result
        if (results[0].status === 'fulfilled' && results[0].value) {
          currentCoursesRef.current = results[0].value;
          setCourses(currentCoursesRef.current);
          setUsingLocalData(false);
        } else {
          currentCoursesRef.current = preparedLocalCourseData;
          setCourses(currentCoursesRef.current);
          setUsingLocalData(true);
        }
        
        // Handle categories result
        if (results[1].status === 'fulfilled' && results[1].value) {
          setCategories(results[1].value);
        } else {
          setCategories(localCategoriesData);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        if (isMounted.current) {
          currentCoursesRef.current = preparedLocalCourseData;
          setCourses(currentCoursesRef.current);
          setCategories(localCategoriesData);
          setUsingLocalData(true);
        }
      } finally {
        if (isMounted.current) {
          // Small delay to ensure smoother transition
          setTimeout(() => {
            if (isMounted.current) {
              setInitialLoading(false);
            }
          }, 100);
        }
      }
    };
    
    initializeData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, [localCategoriesData, preparedLocalCourseData]);

  // Handle filter changes (with debouncing)
  useEffect(() => {
    // Skip initial render where filters are empty
    if (!initialLoading && Object.values(filters).some(v => v !== '')) {
      const timerId = setTimeout(() => {
        fetchCourses(filters);
      }, 400); // 400ms debounce
      
      return () => clearTimeout(timerId);
    }
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

  const renderCoursesList = () => {
    if (courses.length === 0) {
      return (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          No courses found. Try adjusting your filters.
        </Alert>
      );
    }

    return (
      <div className="row g-4">
        {courses.map(course => (
          <div className="col-md-6 col-xl-4" key={course._id || course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-5">
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
          </div>
          
          {initialLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading courses...</span>
              </Spinner>
              <p className="mt-3">Loading courses...</p>
            </div>
          ) : loading && courses.length === 0 ? (
            <div className="d-flex justify-content-center my-4">
              <Spinner animation="border" size="sm" variant="primary" />
              <span className="ms-2">Loading results...</span>
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
            <>
              {loading && (
                <div className="loading-indicator d-flex justify-content-center mb-3">
                  <Spinner animation="border" size="sm" variant="primary" />
                  <span className="ms-2">Updating...</span>
                </div>
              )}
              {renderCoursesList()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;