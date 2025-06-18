import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faShoppingCart,
  faStar,
  faClock,
  faUser,
  faArrowLeft,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { cartItems, cartCount, cartTotal, removeFromCart, clearCart, isEmpty } = useCart();

  const handleRemoveItem = (courseId) => {
    const result = removeFromCart(courseId);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to payment processing
    alert('Checkout functionality would be implemented here!');
  };

  if (isEmpty) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <FontAwesomeIcon icon={faShoppingCart} size="4x" className="text-muted" />
          </div>
          <h2 className="mb-3">Your cart is empty</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added any courses to your cart yet.
          </p>
          <Link to="/courses" className="btn btn-primary btn-lg rounded-pill px-4">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Browse Courses
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold">Shopping Cart</h1>
        <Link to="/courses" className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Continue Shopping
        </Link>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {cartCount} Course{cartCount !== 1 ? 's' : ''} in Cart
                </h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        src={item.thumbnail || 'https://via.placeholder.com/300x200?text=Course+Image'}
                        alt={item.title}
                        className="img-fluid rounded"
                        style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                      />
                    </Col>
                    <Col md={6}>
                      <h6 className="fw-bold mb-2">{item.title}</h6>
                      <div className="text-muted small mb-2">
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        {typeof item.instructor === 'object' ? item.instructor.name : item.instructor}
                      </div>
                      <div className="d-flex align-items-center text-muted small">
                        <span className="me-3">
                          <FontAwesomeIcon icon={faClock} className="me-1" />
                          {item.duration}
                        </span>
                        <span className="me-3">
                          <FontAwesomeIcon icon={faStar} className="me-1 text-warning" />
                          {item.rating || 'N/A'}
                        </span>
                        <span className="badge bg-light text-dark">{item.level}</span>
                      </div>
                    </Col>
                    <Col md={2} className="text-center">
                      <div className="fw-bold text-primary h5 mb-0">
                        ${item.price.toFixed(2)}
                      </div>
                    </Col>
                    <Col md={1} className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove from cart"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal ({cartCount} items):</span>
                <span className="fw-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Discount:</span>
                <span className="text-success">-$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5 fw-bold">Total:</span>
                <span className="h5 fw-bold text-primary">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCheckout}
                  className="rounded-pill"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">What you get:</h6>
                <ul className="list-unstyled small mb-0">
                  <li className="mb-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    Lifetime access to all courses
                  </li>
                  <li className="mb-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    Certificate of completion
                  </li>
                  <li className="mb-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    30-day money-back guarantee
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
