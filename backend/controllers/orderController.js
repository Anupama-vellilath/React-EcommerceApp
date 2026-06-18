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

// 👇 ADD THESE TWO NEW HANDLERS FOR ADMIN & STAFF ACTIONS

// @desc    Get all orders across the entire platform
// @route   GET /api/orders
// @access  Private (Admin & Employee)
exports.getAllOrders = async (req, res) => {
  try {
    // Populate the user reference field with name and email data fields
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server failed to retrieve global order list', 
      error: error.message 
    });
  }
};

// @desc    Update order tracking status milestones
// @route   PUT /api/orders/:id/status
// @access  Private (Admin & Employee)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., 'packed', 'shipped', 'delivered'
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order snapshot reference not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to rewrite target order tracking status', 
      error: error.message 
    });
  }
};