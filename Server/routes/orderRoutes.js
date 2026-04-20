const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const verifyToken = require('../middleware/authmiddleware');

// All order routes require authentication
router.use(verifyToken);

router.post('/create', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;

