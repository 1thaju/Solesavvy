import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';
import Footer from '../LandingPage/Footer/Footer';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalProducts: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: token } };
        
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(statsRes.data);

        const ordersRes = await axios.get('http://localhost:5000/api/admin/orders', config);
        setOrders(ordersRes.data);

      } catch (error) {
        console.error("Admin error:", error);
        if (error.response?.status === 403) {
          alert('Access denied. You do not have admin privileges.');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'status-green';
      case 'shipped': return 'status-blue';
      case 'processing': return 'status-orange';
      case 'cancelled': return 'status-red';
      default: return 'status-gray';
    }
  };

  if (loading) return <div className="admin-loading">Loading Admin Dashboard...</div>;

  return (
    <>
      <NavBar />
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₹{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Registered Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>

        <div className="orders-management">
          <h2>Order Management</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Email</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.user?.email || 'Guest'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`admin-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
