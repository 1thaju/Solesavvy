import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getCart = async () => {
    const token = getAuthToken();
    if (!token) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://solesavvy.onrender.com/api/cart', {
        headers: { Authorization: token }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size = null) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'https://solesavvy.onrender.com/api/cart/add',
        { productId, quantity, size },
        { headers: { Authorization: token } }
      );
      setCart(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login to update cart');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `https://solesavvy.onrender.com/api/cart/update/${itemId}`,
        { quantity },
        { headers: { Authorization: token } }
      );
      setCart(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login to remove items from cart');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `https://solesavvy.onrender.com/api/cart/remove/${itemId}`,
        { headers: { Authorization: token } }
      );
      setCart(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login to clear cart');
    }

    setLoading(true);
    setError(null);
    try {
      await axios.delete('https://solesavvy.onrender.com/api/cart/clear', {
        headers: { Authorization: token }
      });
      setCart({ items: [], user: null });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      if (item.product && item.product.price) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    getCart();
  }, []);

  // Listen for token changes (login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        getCart();
      }
    };

    // Listen for storage events (when token is set/removed in other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for same-tab token changes
    const handleTokenChange = () => {
      getCart();
    };

    // Listen for custom token change events
    window.addEventListener('tokenChanged', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  const value = {
    cart,
    loading,
    error,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

