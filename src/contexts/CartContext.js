import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize cart from localStorage on component mount
  useEffect(() => {
    initializeCart();
  }, []);

  // Update cart count whenever cart items change
  useEffect(() => {
    setCartCount(cartItems.length);
    // Save to localStorage whenever cart changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const initializeCart = () => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = (course) => {
    try {
      // Validate course data
      if (!course || !course.id) {
        return { success: false, message: 'Invalid course data' };
      }

      // Check if course is already in cart
      const existingItem = cartItems.find(item => item.id === course.id);

      if (existingItem) {
        // Course already in cart, don't add duplicate
        return { success: false, message: 'Course is already in your cart' };
      }

      // Create cart item
      const cartItem = {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        price: course.price || 0,
        thumbnail: course.thumbnail,
        level: course.level,
        duration: course.duration,
        rating: course.rating,
        addedAt: new Date().toISOString()
      };

      setCartItems(prevItems => [...prevItems, cartItem]);
      return { success: true, message: 'Course added to cart successfully' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add course to cart' };
    }
  };

  // Remove item from cart
  const removeFromCart = (courseId) => {
    try {
      setCartItems(prevItems => prevItems.filter(item => item.id !== courseId));
      return { success: true, message: 'Course removed from cart' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove course from cart' };
    }
  };

  // Clear entire cart
  const clearCart = () => {
    try {
      setCartItems([]);
      localStorage.removeItem('cart');
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  };

  // Check if course is in cart
  const isInCart = (courseId) => {
    if (!courseId) return false;
    return cartItems.some(item => item.id === courseId);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  // Get cart item by ID
  const getCartItem = (courseId) => {
    if (!courseId) return null;
    return cartItems.find(item => item.id === courseId);
  };

  const value = {
    // State
    cartItems: cartItems || [],
    cartCount: cartCount || 0,
    isLoading: isLoading || false,

    // Computed values
    cartTotal: getCartTotal(),
    isEmpty: !cartItems || cartItems.length === 0,

    // Methods
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItem,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
