import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';
import Footer from '../LandingPage/Footer/Footer';
import NavBar from '../Navbar/NavBar';

function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to view your cart');
      navigate('/login');
    }
  }, [navigate]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating({ ...updating, [itemId]: true });
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading && !cart) {
    return (
      <>
        <div className="cart-container">
          <div className="loading">Loading cart...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <div className="cart-container">
          <h1>Your Cart</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const total = getCartTotal();

  return (
    <>
      <div className="cart-container">
        <h1>Your Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={`http://localhost:5000${item.product?.imageUrl?.trim() || ''}`}
                    alt={item.product?.name || 'Product'}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.product?.name || 'Product'}</h3>
                  <p>{item.product?.description || ''}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  <p className="item-price">₹{item.product?.price || 0}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={updating[item._id] || item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    disabled={updating[item._id]}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  <p>₹{(item.product?.price || 0) * item.quantity}</p>
                </div>
                <div className="item-remove">
                  <button onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="continue-shopping" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;

