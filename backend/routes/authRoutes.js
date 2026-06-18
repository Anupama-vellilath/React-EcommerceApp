const router = require('express').Router();
const { register, login, getProfile, updateAddress } = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // <-- Import your protect middleware here

router.post('/register', register);
router.post('/login', login);

// Protect these endpoints
router.get('/profile', protect, getProfile);
router.put('/profile/address', protect, updateAddress);

module.exports = router;