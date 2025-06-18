import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faYoutube,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);
  const newsletterRef = useRef(null);
  
  // Check if element is in viewport
  const useIntersectionObserver = (ref, options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      const currentRef = ref.current;
      if (!currentRef) return;

      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);

      observer.observe(currentRef);

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [options]);
    
    return isVisible;
  };
  
  const footerVisible = useIntersectionObserver(footerRef, { threshold: 0.1 });
  
  // CSS for custom styles using React hooks
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .hover-text-primary:hover {
        color: var(--bs-primary) !important;
        transform: translateX(5px);
      }
      
      .height-2px {
        height: 2px;
      }
      
      .scale-0 {
        transform: scaleX(0);
      }
      
      .nav-link:hover .scale-0 {
        transform: scaleX(1);
      }
      
      .footer-floating-shape {
        animation: float 8s infinite ease-in-out;
        opacity: 0;
        transition: opacity 0.5s ease-in;
      }
      
      .footer-floating-shape-2 {
        animation: float 6s infinite ease-in-out;
        animation-delay: 1s;
        opacity: 0;
        transition: opacity 0.5s ease-in;
      }
      
      .footer-floating-shape-3 {
        animation: float 4s infinite ease-in-out;
        animation-delay: 0.5s;
        opacity: 0;
        transition: opacity 0.5s ease-in;
      }
      
      .footer.active .footer-floating-shape,
      .footer.active .footer-floating-shape-2,
      .footer.active .footer-floating-shape-3 {
        opacity: 1;
      }
      
      .social-icon {
        transition: all 0.3s ease;
      }
      
      .social-icon:hover {
        transform: translateY(-5px);
        background-color: var(--bs-primary) !important;
      }
      
      .slide-in-right {
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.4s ease-out;
      }
      
      .footer.active .slide-in-right {
        opacity: 1;
        transform: translateX(0);
      }
      
      .reveal-footer {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
      }
      
      .footer.active .reveal-footer {
        opacity: 1;
        transform: translateY(0);
      }
      
      .footer-link-hover {
        position: relative;
        padding-left: 0;
        transition: all 0.3s ease;
      }
      
      .footer-link-hover::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 1px;
        background-color: var(--bs-primary);
        transition: all 0.3s ease;
      }
      
      .footer-link-hover:hover {
        padding-left: 8px;
      }
      
      .footer-link-hover:hover::before {
        width: 100%;
      }
      
      .newsletter-form input {
        transition: all 0.3s ease;
      }
      
      .newsletter-form input:focus {
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        transform: scale(1.02);
      }
      
      .btn-animated {
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
      }
      
      .btn-animated::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
        transition: all 0.5s ease;
      }
      
      .btn-animated:hover::after {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 1;
      }
      
      .hover-lift {
        transition: all 0.3s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1);
      }
      
      .transition-colors {
        transition: color 0.3s ease;
      }
      
      .transition-all {
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  useEffect(() => {
    if (footerVisible) {
      footerRef.current.classList.add('active');
    }
  }, [footerVisible]);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // In a real app, this would call an API to subscribe the user
      setSubscribed(true);
      setEmail('');
      
      // Reset the subscription notification after a delay
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer ref={footerRef} className="footer bg-dark text-white py-5 position-relative overflow-hidden" style={{ marginTop: '100px' }}>
      {/* Wave Shape Divider */}
      <div className="position-absolute top-0 start-0 w-100" style={{ marginTop: '-100px' }}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L80,80C160,96,320,128,480,122.7C640,117,800,75,960,64C1120,53,1280,75,1360,85.3L1440,96L1440,320L0,320Z" fill="#212529"></path>
        </svg>
      </div>
      
      <div className="container position-relative">
        <div className="row g-4">
          <div className="col-lg-4 reveal-footer" style={{ transitionDelay: '0.1s' }}>
            <h4 className="mb-3 d-flex align-items-center">
              <div className="brand-logo me-2 rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                  style={{ width: '35px', height: '35px', overflow: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-white bi bi-mortarboard-fill" viewBox="0 0 16 16">
                  <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                  <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
                </svg>
              </div>
              <div>
                <span className="text-primary fs-3 fw-bold me-1">Learn</span>
                <span className="fs-3 fw-bold">Hub</span>
              </div>
            </h4>
            <p className="mb-4 text-light">Empowering professionals with high-quality, accessible education to advance their careers and achieve their goals.</p>
            
            <div className="contact-info mb-4">
              <div className="mb-2 d-flex align-items-center hover-lift p-2 rounded transition-all" 
                   style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary me-3" />
                <span>123 Education Street, Learning City</span>
              </div>
              <div className="mb-2 d-flex align-items-center hover-lift p-2 rounded transition-all" 
                   style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <FontAwesomeIcon icon={faPhone} className="text-primary me-3" />
                <a href="tel:+15551234567" className="text-white text-decoration-none">+1 (555) 123-4567</a>
              </div>
              <div className="mb-3 d-flex align-items-center hover-lift p-2 rounded transition-all" 
                   style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <FontAwesomeIcon icon={faEnvelope} className="text-primary me-3" />
                <a href="mailto:info@learnhub.edu" className="text-white text-decoration-none">info@learnhub.edu</a>
              </div>
            </div>
            
            <div className="social-links d-flex">
              {[
                { icon: faFacebookF, url: 'https://facebook.com', color: '#4267B2' },
                { icon: faTwitter, url: 'https://twitter.com', color: '#1DA1F2' },
                { icon: faLinkedinIn, url: 'https://linkedin.com', color: '#0077B5' },
                { icon: faInstagram, url: 'https://instagram.com', color: '#E1306C' },
                { icon: faYoutube, url: 'https://youtube.com', color: '#FF0000' },
                { icon: faTiktok, url: 'https://tiktok.com', color: '#000000' }
              ].map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" 
                   className="social-icon d-flex align-items-center justify-content-center me-3 transition-all"
                   style={{
                     width: '38px',
                     height: '38px',
                     borderRadius: '50%',
                     backgroundColor: 'rgba(255,255,255,0.1)',
                     transitionDelay: `${0.05 * (index + 1)}s`,
                   }}>
                  <FontAwesomeIcon icon={social.icon} className="text-white fade-in" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="col-lg-2 col-md-3 col-6 reveal-footer" style={{ transitionDelay: '0.2s' }}>
            <h5 className="mb-4 pb-2 border-bottom border-primary border-2 d-inline-block">Quick Links</h5>
            <ul className="list-unstyled">
              {[
                { name: 'Home', path: '/' },
                { name: 'Courses', path: '/courses' },
                { name: 'About Us', path: '/about-us' },
                { name: 'Contact', path: '/contact' }
              ].map((link, i) => (
                <li key={link.name} className="mb-2 slide-in-right" style={{ transitionDelay: `${0.1 * (i + 1)}s` }}>
                  <Link to={link.path} 
                        className="text-white text-decoration-none footer-link-hover d-flex align-items-center">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2 text-primary" style={{ fontSize: '12px' }} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-3 col-6 reveal-footer" style={{ transitionDelay: '0.3s' }}>
            <h5 className="mb-4 pb-2 border-bottom border-primary border-2 d-inline-block">Categories</h5>
            <ul className="list-unstyled">
              {[
                { name: 'Data Science', param: 'data-science' },
                { name: 'Web Development', param: 'web-development' },
                { name: 'Business', param: 'business' },
                { name: 'Design', param: 'design' },
                { name: 'Marketing', param: 'marketing' }
              ].map((category, i) => (
                <li key={category.param} className="mb-2 slide-in-right" style={{ transitionDelay: `${0.15 * (i + 1)}s` }}>
                  <Link to={`/courses?category=${category.param}`} 
                        className="text-white text-decoration-none footer-link-hover d-flex align-items-center">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2 text-primary" style={{ fontSize: '12px' }} />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-6 reveal-footer" style={{ transitionDelay: '0.4s' }}>
            <h5 className="mb-4 pb-2 border-bottom border-primary border-2 d-inline-block">Newsletter</h5>
            <p className="mb-4 text-light">Subscribe to get updates on new courses and features</p>
            
            <div className="newsletter-container" ref={newsletterRef}>
              {subscribed ? (
                <div className="alert alert-success border-0 shadow-sm scale-in" role="alert">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-25 p-2 rounded-circle me-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    </div>
                    <div>
                      <strong>Thank you!</strong> You are now subscribed to our newsletter.
                    </div>
                  </div>
                </div>
              ) : (
                <form className="newsletter-form position-relative mb-4" onSubmit={handleSubscribe}>
                  <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
                    <input 
                      type="email" 
                      className="form-control border-0 ps-4 py-3" 
                      style={{ borderRadius: '50px 0 0 50px' }}
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-animated px-4"
                            style={{ borderRadius: '0 50px 50px 0', zIndex: 5 }}>
                      <span>Subscribe</span>
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            <div className="mt-4 rounded-lg bg-primary bg-opacity-10 p-4 border-start border-4 border-primary hover-lift transition-all">
              <h6 className="text-primary mb-2">Ready to start learning?</h6>
              <p className="mb-3 small">Join thousands of students already learning on LearnHub!</p>
              <div className="d-flex">
                <Link to="/signup" className="btn btn-primary btn-animated rounded-pill hover-lift px-4 me-2">
                  Get Started
                </Link>
                <Link to="/courses" className="btn btn-outline-light btn-animated rounded-pill hover-lift px-4">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-4 opacity-25" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-md-0 text-muted fade-in">© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
              <Link key={item} to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-muted text-decoration-none me-3 fade-in hover-text-primary transition-all"
                    style={{ transitionDelay: `${0.05 * (i + 1)}s` }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating shapes for decoration */}
      <div className="position-absolute footer-floating-shape" style={{ bottom: '20%', left: '5%', width: '60px', height: '60px', border: '10px solid rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
      <div className="position-absolute footer-floating-shape-2" style={{ top: '20%', right: '10%', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', transform: 'rotate(45deg)' }}></div>
      <div className="position-absolute footer-floating-shape-3" style={{ bottom: '30%', right: '5%', width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%' }}></div>
      
      <div className="position-absolute footer-floating-shape" style={{ top: '30%', left: '25%', width: '15px', height: '15px', backgroundColor: 'rgba(13,110,253,0.2)', borderRadius: '50%' }}></div>
      <div className="position-absolute footer-floating-shape-3" style={{ bottom: '20%', right: '25%', width: '25px', height: '25px', backgroundColor: 'rgba(13,110,253,0.15)', borderRadius: '6px', transform: 'rotate(15deg)' }}></div>
    </footer>
  );
}

export default Footer;