import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faGraduationCap, 
  faUsers, 
  faStar, 
  faLaptop, 
  faCertificate,
  faPlay,
  faChartLine,
  faUserGraduate,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  const statsContainerRef = useRef(null);
  const featuresRef = useRef(null);

  // Counter animation function
  const animateCounters = (container) => {
    const counters = container.querySelectorAll('.counter-value');
    const speed = 200;

    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(',', '');
        const increment = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + increment).toLocaleString();
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      updateCount();
    });
  };

  // Initialize observers for scroll animations
  useEffect(() => {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && statsContainerRef.current) {
          animateCounters(statsContainerRef.current);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    if (statsContainerRef.current) {
      statsObserver.observe(statsContainerRef.current);
    }

    // Set up observers for feature items
    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          featuresObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    if (featuresRef.current) {
      featuresRef.current.querySelectorAll('.feature-card').forEach(item => {
        featuresObserver.observe(item);
      });
    }

    // Set up the rest of the reveal animations
    const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });

    return () => {
      statsObserver.disconnect();
      featuresObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section with Animated Gradient Background */}
      <section className="hero-section py-5 position-relative overflow-hidden" 
               style={{ 
                 background: 'linear-gradient(135deg, #4a6bff 0%, #6a11cb 100%)',
                 minHeight: '85vh',
                 display: 'flex',
                 alignItems: 'center'
               }}>
        {/* Animated Gradient Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%) 0 0, radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%) 25px 25px',
          backgroundSize: '50px 50px',
          opacity: 0.6,
          animation: 'gradientAnimation 4s linear infinite'
        }}></div>

        {/* Floating Shapes */}
        <div className="position-absolute" style={{ 
          top: '15%', 
          left: '10%', 
          width: '80px', 
          height: '80px', 
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="position-absolute" style={{ 
          bottom: '20%', 
          right: '15%', 
          width: '60px', 
          height: '60px', 
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: 'float 8s ease-in-out infinite'
        }}></div>

        <div className="container py-5 position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white reveal-left">
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill mb-3 slide-up">Ready To Learn?</span>
              <h1 className="display-4 fw-bold mb-4 slide-up">Unlock Your <span className="text-warning">Potential</span> With Our Courses</h1>
              <p className="lead mb-4 slide-up delay-1 opacity-75">Access a world of knowledge with our comprehensive online courses. Learn from industry experts and advance your career.</p>
              <div className="d-flex gap-3 slide-up delay-2">
                <Link to="/courses" className="btn btn-light btn-lg rounded-pill hover-lift">
                  Explore Courses <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Link>
                <Link to="/signup" className="btn btn-outline-light btn-lg rounded-pill hover-lift">
                  Join For Free
                </Link>
              </div>
              
              <div className="mt-5 d-flex gap-4 pt-3 slide-up delay-3">
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', borderRadius: '50%'}}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div>
                    <div className="fw-bold text-white">1000+</div>
                    <div className="small text-white opacity-75">Courses</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', borderRadius: '50%'}}>
                    <FontAwesomeIcon icon={faUserGraduate} />
                  </div>
                  <div>
                    <div className="fw-bold text-white">50K+</div>
                    <div className="small text-white opacity-75">Students</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', borderRadius: '50%'}}>
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <div>
                    <div className="fw-bold text-white">4.8</div>
                    <div className="small text-white opacity-75">Rating</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 reveal-right">
              <div className="position-relative">
                <div className="hero-image-container img-hover-zoom shadow-lg rounded-3 border border-5 border-white" style={{overflow: 'hidden', transform: 'rotate(2deg)'}}>
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                      alt="Students learning together" 
                      className="img-fluid rounded-3" 
                  />
                  
                  {/* Play button overlay */}
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <button className="btn btn-light rounded-circle btn-lg pulse" style={{width: '80px', height: '80px'}}>
                      <FontAwesomeIcon icon={faPlay} className="text-primary ms-1" />
                    </button>
                  </div>
                </div>
                
                {/* Floating card 1 */}
                <div className="position-absolute slide-up delay-2 bg-white p-3 rounded-3 shadow-lg" style={{top: '20%', left: '-10%', maxWidth: '180px'}}>
                  <div className="d-flex align-items-center">
                    <div className="avatar-group me-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="avatar" style={{
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          border: '2px solid white', 
                          backgroundImage: `url(https://i.pravatar.cc/100?img=${20+i})`,
                          backgroundSize: 'cover',
                          marginLeft: i > 1 ? '-10px' : '0'
                        }}></div>
                      ))}
                    </div>
                    <div className="text-primary">+28K</div>
                  </div>
                  <div className="small mt-1 fw-bold">Students this week</div>
                </div>
                
                {/* Floating card 2 */}
                <div className="position-absolute slide-up delay-3 bg-white p-3 rounded-3 shadow-lg" style={{bottom: '15%', right: '-5%', maxWidth: '200px'}}>
                  <div className="d-flex align-items-center mb-2">
                    <div className="rounded-circle bg-success bg-opacity-10 p-2 me-2">
                      <FontAwesomeIcon icon={faCertificate} className="text-success" />
                    </div>
                    <span className="fw-bold">Certified Courses</span>
                  </div>
                  <div className="small text-muted">Get industry recognized certification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-5 bg-light" ref={statsContainerRef}>
        <div className="container py-4">
          <div className="row g-4 text-center">
            {[
              { icon: faGraduationCap, value: 1000, label: 'Online Courses', color: '#4a6bff' },
              { icon: faUsers, value: 50000, label: 'Active Students', color: '#ff7a00' },
              { icon: faGlobe, value: 120, label: 'Countries', color: '#00c16e' },
              { icon: faLaptop, value: 9800, label: 'Online Lessons', color: '#6a11cb' }
            ].map((stat, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="card border-0 shadow-sm h-100 hover-lift">
                  <div className="card-body p-4">
                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: `${stat.color}20`, width: '70px', height: '70px' }}>
                      <FontAwesomeIcon icon={stat.icon} size="2x" style={{ color: stat.color }} />
                    </div>
                    <h3 className="counter-value fw-bold mb-1" data-target={stat.value}>0</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5" ref={featuresRef}>
        <div className="container py-5">
          <div className="row mb-5 text-center justify-content-center">
            <div className="col-lg-8">
              <h6 className="text-primary fw-bold mb-3 reveal">WHY CHOOSE US</h6>
              <h2 className="fw-bold mb-4 reveal">Learn With <span className="text-primary">LearnHub</span>: Where Knowledge Meets Innovation</h2>
              <p className="text-muted lead reveal">Our platform offers a comprehensive learning experience with features designed to help you succeed.</p>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { 
                icon: faGraduationCap, 
                title: 'Expert Instructors', 
                desc: 'Learn from industry professionals with years of experience in their fields.',
                color: '#4a6bff',
                delay: 0
              },
              { 
                icon: faLaptop, 
                title: 'Interactive Learning', 
                desc: 'Engage with interactive content, quizzes, and exercises that reinforce learning.',
                color: '#ff7a00',
                delay: 0.1
              },
              { 
                icon: faCertificate, 
                title: 'Certification', 
                desc: 'Earn industry-recognized certificates upon successful course completion.',
                color: '#00c16e',
                delay: 0.2
              },
              { 
                icon: faUsers, 
                title: 'Community Learning', 
                desc: 'Join a community of learners and share knowledge in discussion forums.',
                color: '#6a11cb',
                delay: 0
              },
              { 
                icon: faChartLine, 
                title: 'Progress Tracking', 
                desc: 'Monitor your learning progress with detailed analytics and reports.',
                color: '#e83e8c',
                delay: 0.1
              },
              { 
                icon: faGlobe, 
                title: 'Learn Anywhere', 
                desc: 'Access your courses anytime, anywhere, on any device with our mobile-friendly platform.',
                color: '#20c997',
                delay: 0.2
              }
            ].map((feature, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="feature-card card border-0 shadow-sm h-100 reveal" style={{ transitionDelay: `${feature.delay}s` }}>
                  <div className="card-body d-flex p-4">
                    <div className="feature-icon me-4 mt-2">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ backgroundColor: `${feature.color}15`, width: '60px', height: '60px' }}>
                        <FontAwesomeIcon icon={feature.icon} style={{ color: feature.color, fontSize: '24px' }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="h5 mb-3 fw-bold">{feature.title}</h4>
                      <p className="text-muted mb-0">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-lg-6">
              <h6 className="text-primary fw-bold mb-3 reveal-left">FEATURED COURSES</h6>
              <h2 className="fw-bold mb-4 reveal-left">Explore Our Most Popular Courses</h2>
            </div>
            <div className="col-lg-6 text-lg-end align-self-end reveal-right">
              <Link to="/courses" className="btn btn-primary btn-lg rounded-pill hover-lift px-4">
                View All Courses <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Link>
            </div>
          </div>
          
          <div className="text-center py-5 reveal">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading courses...</span>
            </div>
            <p className="mt-3">Loading featured courses...</p>
            <p className="text-muted">This is a placeholder. In a real implementation, course cards would be displayed here.</p>
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Background */}
      <section className="cta-section py-5 position-relative" style={{
        background: 'linear-gradient(45deg, rgba(106, 17, 203, 0.9) 0%, rgba(37, 117, 252, 0.9) 100%)',
        padding: '120px 0'
      }}>
        {/* Animated Particles */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          opacity: 0.5
        }}></div>
        
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h6 className="text-white opacity-75 fw-bold mb-3 reveal slide-up">GET STARTED TODAY</h6>
              <h2 className="text-white fw-bold display-5 mb-4 reveal slide-up">Ready to Start Your Learning Journey?</h2>
              <p className="lead text-white opacity-75 mb-5 reveal slide-up delay-1">Join thousands of students who are already learning and growing with our platform.</p>
              <div className="d-flex gap-3 justify-content-center reveal slide-up delay-2">
                <Link to="/signup" className="btn btn-light btn-lg rounded-pill hover-lift px-4 py-3">
                  Get Started Now <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Link>
                <Link to="/courses" className="btn btn-outline-light btn-lg rounded-pill hover-lift px-4 py-3">
                  Browse Courses
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-5 pt-4 reveal slide-up delay-3">
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <div className="bg-white bg-opacity-10 rounded-pill px-4 py-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faStar} className="text-warning me-2" />
                    <span className="text-white">Trusted by 50,000+ students</span>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-pill px-4 py-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCertificate} className="text-warning me-2" />
                    <span className="text-white">Industry recognized certification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom CSS */}
      <style jsx="true">{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        
        .hero-image-container {
          transition: transform 0.5s ease;
        }
        
        .hero-image-container:hover {
          transform: scale(1.02) rotate(0deg) !important;
        }
        
        .feature-card {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default HomePage;