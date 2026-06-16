const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { createPaymentIntent, saveOrder } = require('../controllers/orderController');
router.post('/payment-intent', protect, createPaymentIntent);
router.post('/', protect, saveOrder);
module.exports = router;