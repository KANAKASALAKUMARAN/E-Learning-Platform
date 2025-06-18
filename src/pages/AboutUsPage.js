import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faUsers,
  faGlobe,
  faChalkboardTeacher,
  faLightbulb,
  faHeart,
  faHandshake,
  faStar
} from '@fortawesome/free-solid-svg-icons';

function AboutUsPage() {
  useEffect(() => {
    document.title = 'About Us - LearnHub | Empowering Minds, Transforming Futures';
    
    return () => {
      document.title = 'LearnHub - Online Learning Platform';
    };
  }, []);

  const stats = [
    { icon: faGraduationCap, number: '1,000+', label: 'Courses' },
    { icon: faUsers, number: '50,000+', label: 'Students' },
    { icon: faGlobe, number: '120+', label: 'Countries' },
    { icon: faChalkboardTeacher, number: '500+', label: 'Instructors' }
  ];

  const values = [
    {
      icon: faLightbulb,
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and innovative teaching methods to deliver the best learning experience.',
      color: '#ffd700'
    },
    {
      icon: faHeart,
      title: 'Passion',
      description: 'Our passion for education drives us to create meaningful and impactful learning opportunities.',
      color: '#ff6b6b'
    },
    {
      icon: faHandshake,
      title: 'Community',
      description: 'We foster a supportive learning community where students and instructors can connect and grow together.',
      color: '#4ecdc4'
    },
    {
      icon: faStar,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course content to student support.',
      color: '#45b7d1'
    }
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="hero-section py-5 position-relative overflow-hidden" 
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 minHeight: '60vh'
               }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-white mb-4 slide-in-left">
                Empowering Minds, Transforming Futures
              </h1>
              <p className="lead text-white mb-4 slide-in-left">
                At LearnHub, we believe that education is the key to unlocking human potential. 
                Our mission is to make quality education accessible to everyone, everywhere.
              </p>
              <div className="d-flex gap-3 slide-in-left">
                <a href="/courses" className="btn btn-light btn-lg rounded-pill px-4">
                  Explore Courses
                </a>
                <a href="/contact" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Get in Touch
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center slide-in-right">
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-white" style={{ fontSize: '8rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-sm-6 text-center slide-up">
                <div className="card border-0 shadow-sm h-100 hover-lift">
                  <div className="card-body p-4">
                    <FontAwesomeIcon icon={stat.icon} className="text-primary mb-3" style={{ fontSize: '3rem' }} />
                    <h3 className="stats-counter text-primary fw-bold">{stat.number}</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 slide-in-left">
              <h2 className="fw-bold mb-4">Our Mission</h2>
              <p className="lead text-muted mb-4">
                To democratize education by providing high-quality, accessible, and affordable learning 
                opportunities that empower individuals to achieve their personal and professional goals.
              </p>
              <h2 className="fw-bold mb-4">Our Vision</h2>
              <p className="lead text-muted mb-4">
                To create a world where anyone, anywhere can transform their life through learning, 
                breaking down barriers and building bridges to success.
              </p>
              <blockquote className="blockquote">
                <p className="mb-0 fst-italic">"Education is the most powerful weapon which you can use to change the world."</p>
                <footer className="blockquote-footer mt-2">Nelson Mandela</footer>
              </blockquote>
            </div>
            <div className="col-lg-6 slide-in-right">
              <div className="position-relative">
                <div className="bg-primary bg-opacity-10 rounded-3 p-5 text-center">
                  <FontAwesomeIcon icon={faGlobe} className="text-primary mb-4" style={{ fontSize: '6rem' }} />
                  <h4 className="fw-bold text-primary">Global Impact</h4>
                  <p className="text-muted">
                    Connecting learners worldwide through innovative educational technology and 
                    expert-crafted content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-4 slide-up">Our Core Values</h2>
            <p className="lead text-muted slide-up">
              The principles that guide everything we do at LearnHub
            </p>
          </div>
          <div className="row g-4">
            {values.map((value, index) => (
              <div key={index} className="col-md-6 col-lg-3 slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card border-0 shadow-sm h-100 text-center hover-lift">
                  <div className="card-body p-4">
                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                         style={{ 
                           width: '80px', 
                           height: '80px', 
                           backgroundColor: `${value.color}15`,
                           color: value.color 
                         }}>
                      <FontAwesomeIcon icon={value.icon} style={{ fontSize: '2rem' }} />
                    </div>
                    <h5 className="fw-bold mb-3">{value.title}</h5>
                    <p className="text-muted small">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8 slide-up">
              <h2 className="fw-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
              <p className="lead text-white mb-4">
                Join thousands of learners who are already transforming their careers and lives with LearnHub.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <a href="/signup" className="btn btn-light btn-lg rounded-pill px-4">
                  Get Started Today
                </a>
                <a href="/courses" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Browse Courses
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
