const router = require('express').Router();
const { protect, isAdmin, isStaff } = require('../middleware/auth');

// 👇 Ensure these are cleanly named and pulled from your controller
const { 
  createPaymentIntent, 
  saveOrder, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

router.post('/payment-intent', protect, createPaymentIntent);
router.post('/', protect, saveOrder);

// 🚚 Employees and Admins track and advance delivery statuses
router.get('/', protect, isStaff, getAllOrders);
router.put('/:id/status', protect, isStaff, updateOrderStatus);

module.exports = router;