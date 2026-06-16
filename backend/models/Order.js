const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty:     Number,
    price:   Number,
  }],
  total:          Number,
  paymentStatus:  { type: String, default: 'pending' },
  stripePaymentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);