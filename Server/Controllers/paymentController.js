const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
const Order = require('../models/order');
const User = require('../models/User');
const { sendOrderReceipt } = require('../utils/mailer');

const createCheckoutSession = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Map cart items to Stripe line items
    const lineItems = items.map(item => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.name || 'Sneaker',
            images: [`http://localhost:5000${item.product.imageUrl}`],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe expects cents/paise
        },
        quantity: item.quantity,
      };
    });

    // Create a new pending order in our DB first
    const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const newOrder = new Order({
      user: req.userId,
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size
      })),
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending' // Wil update via webhook
    });

    await newOrder.save();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/orders?success=true&order_id=${newOrder._id}`,
      cancel_url: `http://localhost:5173/checkout?canceled=true`,
      metadata: {
        order_id: newOrder._id.toString()
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment setup failed." });
  }
};

const webhookHandler = async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_mock_key';

  let event;
  try {
    // If testing locally without real webhooks, we bypass verification
    if (process.env.STRIPE_SECRET_KEY) {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.order_id;
    
    try {
      const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' }).populate('user');
      
      // Trigger Nodemailer confirmation
      if (order && order.user && order.user.email) {
        await sendOrderReceipt(order.user.email, order._id.toString(), order.totalAmount);
      }
    } catch (err) {
      console.error("Webhook DB Update Error:", err);
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { createCheckoutSession, webhookHandler };
