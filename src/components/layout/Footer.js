import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // In a real app, this would call an API to subscribe the user
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h4 className="mb-3"><span className="text-primary">Learn</span>Hub</h4>
            <p>Empowering professionals with high-quality, accessible education to advance their careers and achieve their goals.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-2">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-2">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white me-2">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-3 col-6">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/courses" className="text-white text-decoration-none">Courses</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-3 col-6">
            <h5 className="mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li><Link to="/courses?category=data-science" className="text-white text-decoration-none">Data Science</Link></li>
              <li><Link to="/courses?category=web-development" className="text-white text-decoration-none">Web Development</Link></li>
              <li><Link to="/courses?category=business" className="text-white text-decoration-none">Business</Link></li>
              <li><Link to="/courses?category=design" className="text-white text-decoration-none">Design</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-3">Newsletter</h5>
            <p>Subscribe to get updates on new courses and features</p>
            {subscribed ? (
              <div className="alert alert-success" role="alert">
                Thank you for subscribing!
              </div>
            ) : (
              <form className="d-flex" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  className="form-control me-2" 
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            )}
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-md-0">© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/privacy" className="text-white text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-white text-decoration-none me-3">Terms of Service</Link>
            <Link to="/cookies" className="text-white text-decoration-none">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;