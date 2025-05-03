import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faGraduationCap, faUsers, faStar } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 bg-primary text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Start Your Learning Journey Today</h1>
              <p className="lead mb-4">Access a world of knowledge with our comprehensive online courses. Learn from industry experts and advance your career.</p>
              <Link to="/courses" className="btn btn-light btn-lg">
                Explore Courses <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Link>
            </div>
            <div className="col-lg-6">
              <img src="/assets/images/hero-image.jpg" alt="Learning" className="img-fluid rounded-3 shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary text-white rounded-circle mb-3">
                    <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                  </div>
                  <h3 className="h4 mb-3">Expert Instructors</h3>
                  <p className="text-muted mb-0">Learn from industry professionals with years of experience.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary text-white rounded-circle mb-3">
                    <FontAwesomeIcon icon={faUsers} size="2x" />
                  </div>
                  <h3 className="h4 mb-3">Community Learning</h3>
                  <p className="text-muted mb-0">Join a community of learners and share knowledge together.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary text-white rounded-circle mb-3">
                    <FontAwesomeIcon icon={faStar} size="2x" />
                  </div>
                  <h3 className="h4 mb-3">Quality Content</h3>
                  <p className="text-muted mb-0">Access high-quality, curated courses designed for success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4">Featured Courses</h2>
              <p className="text-muted">Start your learning journey with our most popular courses</p>
            </div>
          </div>
          <div className="text-center">
            <Link to="/courses" className="btn btn-primary">
              View All Courses <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-4">Ready to Start Learning?</h2>
              <p className="lead text-muted mb-4">Join thousands of students who are already learning on our platform.</p>
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Now <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;