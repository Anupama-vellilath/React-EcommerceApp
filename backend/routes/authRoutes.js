const router = require('express').Router();
const { register, login, getProfile, updateAddress ,getAllUsersList} = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth'); // <-- Import your protect middleware here

router.post('/register', register);
router.post('/login', login);

// Protect these endpoints
router.get('/profile', protect, getProfile);
router.put('/profile/address', protect, updateAddress);
router.get('/users', protect, isAdmin, getAllUsersList);

module.exports = router;