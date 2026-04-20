const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');
const verifyToken = require('../middleware/authmiddleware');

// All cart routes require authentication
router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:itemId', cartController.updateCartItem);
router.delete('/remove/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;

