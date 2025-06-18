import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faPaperPlane,
  faCheckCircle,
  faExclamationTriangle,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

function ContactUsPage() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    document.title = 'Contact Us - LearnHub | Get In Touch With Our Team';
    
    // Pre-fill form for authenticated users
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.firstName || '',
        email: user.email || ''
      }));
    }
    
    return () => {
      document.title = 'LearnHub - Online Learning Platform';
    };
  }, [isAuthenticated, user]);

  const contactInfo = [
    {
      icon: faEnvelope,
      title: 'Email Us',
      details: ['support@learnhub.com', 'info@learnhub.com'],
      color: '#0d6efd'
    },
    {
      icon: faPhone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: '#198754'
    },
    {
      icon: faMapMarkerAlt,
      title: 'Visit Us',
      details: ['123 Learning Street', 'Education City, EC 12345'],
      color: '#dc3545'
    },
    {
      icon: faClock,
      title: 'Support Hours',
      details: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat-Sun: 10:00 AM - 4:00 PM'],
      color: '#fd7e14'
    }
  ];

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our course catalog, select the course you want, and click "Enroll Now". You can pay securely online and start learning immediately.'
    },
    {
      question: 'Are the courses self-paced?',
      answer: 'Yes! Most of our courses are self-paced, allowing you to learn at your own speed. Some courses may have suggested timelines, but you can take as long as you need.'
    },
    {
      question: 'Do I get a certificate upon completion?',
      answer: 'Yes, you will receive a certificate of completion for each course you finish. These certificates can be downloaded and shared on professional networks.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. We also offer payment plans for some courses to make learning more accessible.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with a course, you can request a full refund within 30 days of purchase.'
    },
    {
      question: 'How do I access course materials?',
      answer: 'Once enrolled, you can access all course materials through your student dashboard. Materials include videos, PDFs, quizzes, and assignments.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSubmitStatus('success');
      setFormData({
        name: isAuthenticated && user ? (user.name || user.firstName || '') : '',
        email: isAuthenticated && user ? (user.email || '') : '',
        subject: '',
        message: ''
      });
      setErrors({});
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page">
      {/* Hero Section */}
      <section className="hero-section py-5 position-relative overflow-hidden" 
               style={{ 
                 background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                 minHeight: '50vh'
               }}>
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4 slide-up">
                Get in Touch
              </h1>
              <p className="lead text-white mb-4 slide-up">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  
                  {submitStatus === 'success' && (
                    <div className="alert alert-success d-flex align-items-center mb-4">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                      <div>
                        <strong>Message sent successfully!</strong> We'll get back to you within 24 hours.
                      </div>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                      <div>
                        <strong>Error sending message.</strong> Please try again or contact us directly.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label">Subject *</label>
                        <select
                          className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="course">Course Question</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Payment</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                        </select>
                        {errors.subject && (
                          <div className="invalid-feedback">{errors.subject}</div>
                        )}
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="message" className="form-label">Message *</label>
                        <textarea
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help you..."
                        ></textarea>
                        {errors.message && (
                          <div className="invalid-feedback">{errors.message}</div>
                        )}
                      </div>
                      
                      <div className="col-12">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg px-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-lg-4">
              <div>
                <h3 className="fw-bold mb-4">Get in Touch</h3>
                <p className="text-muted mb-4">
                  We're here to help and answer any question you might have.
                  We look forward to hearing from you.
                </p>

                <div className="contact-info">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="d-flex align-items-start mb-4">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                           style={{
                             width: '50px',
                             height: '50px',
                             backgroundColor: `${info.color}15`,
                             color: info.color
                           }}>
                        <FontAwesomeIcon icon={info.icon} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{info.title}</h6>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted mb-0 small">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted lead">
                  Find answers to the most commonly asked questions about our platform and courses.
                </p>
              </div>

              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div key={index} className="accordion-item border-0 shadow-sm mb-3">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${expandedFaq === index ? '' : 'collapsed'} fw-semibold`}
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={expandedFaq === index}
                      >
                        <FontAwesomeIcon 
                          icon={faQuestionCircle} 
                          className="text-primary me-3" 
                        />
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse collapse ${expandedFaq === index ? 'show' : ''}`}
                    >
                      <div className="accordion-body pt-0">
                        <p className="text-muted mb-0">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUsPage;
