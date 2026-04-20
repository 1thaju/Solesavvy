import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import Footer from '../LandingPage/Footer/Footer';
import NavBar from '../Navbar/NavBar';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if coming from Stripe Checkout success
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("Payment successful! Your order will be processed shortly.");
      // Optionally clean the URL
      window.history.replaceState(null, '', '/orders');
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: token }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4caf50';
      case 'shipped':
        return '#2196f3';
      case 'processing':
        return '#ff9800';
      case 'pending':
        return '#9e9e9e';
      case 'cancelled':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <>
        <div className="orders-container">
          <div className="loading">Loading orders...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="orders-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>You have no orders yet</p>
            <button onClick={() => navigate('/')}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                    <span
                      className={`payment-status ${order.paymentStatus}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="order-items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <img
                        src={`http://localhost:5000${item.product?.imageUrl?.trim() || ''}`}
                        alt={item.product?.name || 'Product'}
                      />
                      <div className="order-item-info">
                        <h4>{item.product?.name || 'Product'}</h4>
                        <p>Quantity: {item.quantity}</p>
                        {item.size && <p>Size: {item.size}</p>}
                      </div>
                      <div className="order-item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>
                  {order.shippingAddress && (
                    <div className="shipping-address">
                      <strong>Shipping to:</strong>
                      <p>
                        {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Orders;

