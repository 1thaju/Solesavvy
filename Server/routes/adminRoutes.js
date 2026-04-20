const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authmiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/User');

// All admin routes must pass verifyToken AND isAdmin
router.use(verifyToken, isAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ paymentStatus: { $ne: 'failed' } });
    const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage global orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (pending -> shipped -> delivered)
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product globally
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted permanently' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
