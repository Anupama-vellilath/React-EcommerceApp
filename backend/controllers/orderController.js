const Stripe = require('stripe');
const Order = require('../models/Order');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  const { items } = req.body;               // [{ product, qty, price }]
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),        // cents
    currency: 'usd',
  });

  res.json({ clientSecret: paymentIntent.client_secret, total });
};

exports.saveOrder = async (req, res) => {
  const { items, total, stripePaymentId } = req.body;
  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    stripePaymentId,
    paymentStatus: 'paid',
  });
  res.status(201).json(order);
};