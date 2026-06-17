const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

router.route('/')
  .post(protect, addToCart)
  .get(protect, getCart);

router.delete('/:productId', protect, removeFromCart);

module.exports = router;