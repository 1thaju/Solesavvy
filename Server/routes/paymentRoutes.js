const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/authmiddleware');

// Create checkout session (must be logged in)
router.post('/create-session', verifyToken, paymentController.createCheckoutSession);

// Webhook for Stripe (public endpoint)
// Needs raw body, but we handle it parsed for simplicity in this demo environment
router.post('/webhook', paymentController.webhookHandler);

module.exports = router;
