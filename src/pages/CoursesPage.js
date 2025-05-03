import React, { useState, useEffect } from 'react';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import CourseService from '../services/api/courseService';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });

  useEffect(() => {
    // Fetch course categories
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await CourseService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch courses with applied filters
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const filteredCourses = await CourseService.getCourses(filters);
        setCourses(filteredCourses);
        setError(null);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchCourses();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-3 mb-4">
          <CourseFilters 
            categories={categories} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">All Courses</h1>
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Sort By
              </button>
              <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                <li><button className="dropdown-item" onClick={() => {}}>Most Popular</button></li>
                <li><button className="dropdown-item" onClick={() => {}}>Highest Rated</button></li>
                <li><button className="dropdown-item" onClick={() => {}}>Newest</button></li>
                <li><button className="dropdown-item" onClick={() => {}}>Price: Low to High</button></li>
                <li><button className="dropdown-item" onClick={() => {}}>Price: High to Low</button></li>
              </ul>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : courses.length === 0 ? (
            <div className="alert alert-info">No courses found. Try adjusting your filters.</div>
          ) : (
            <div className="row g-4">
              {courses.map(course => (
                <div className="col-md-6 col-xl-4" key={course._id}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;