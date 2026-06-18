const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: generateToken(user._id), name: user.name });
};

// Inside backend/controllers/authController.js -> login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // 👇 MAKE SURE THIS LINE IS EXPLICITLY HERE
      role: user.role, 
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get all registered users directory
// @route   GET /api/auth/users
// @access  Private (Admin Only)
exports.getAllUsersList = async (req, res) => {
  try {
    // Find all users, exclude password hashes, sort by newest registered accounts first
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server compilation error while pulling users list', 
      error: error.message 
    });
  }
};

// 👇 ADD THESE TWO NEW HANDLERS BELOW

// 1. Get User Profile (Includes Address)
exports.getProfile = async (req, res) => {
  try {
    // req.user._id comes from your auth/protect middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

// 2. Update Shipping Address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Expecting req.body.address to contain { street, city, state, zip, country }
    user.address = req.body.address;
    
    await user.save();
    res.json({ message: 'Address updated successfully', address: user.address });
  } catch (error) {
    res.status(500).json({ message: 'Server error saving address', error: error.message });
  }
};