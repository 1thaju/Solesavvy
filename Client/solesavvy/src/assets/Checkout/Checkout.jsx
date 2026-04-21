import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import './Checkout.css';
import Footer from '../LandingPage/Footer/Footer';
import NavBar from '../Navbar/NavBar';

function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://solesavvy.onrender.com/api/payment/create-session',
        { 
          shippingAddress: formData,
          items: cart.items 
        },
        { headers: { Authorization: token } }
      );

      // Redirect to Stripe Checkout Hosted Page
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error initializing payment gateway. Please try again.');
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <div className="checkout-container">
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/cart')}>Go to Cart</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const total = getCartTotal();

  return (
    <>
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Shipping Address</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
              </button>
            </form>
          </div>
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img
                    src={`http://localhost:5000${item.product?.imageUrl?.trim() || ''}`}
                    alt={item.product?.name || 'Product'}
                  />
                  <div className="order-item-details">
                    <h4>{item.product?.name || 'Product'}</h4>
                    <p>Quantity: {item.quantity}</p>
                    {item.size && <p>Size: {item.size}</p>}
                    <p>₹{(item.product?.price || 0) * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Checkout;

