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

exports.login = async (req, res) => {
  console.log("--- BACKEND ATTEMPT ---");
  console.log("Received payload:", req.body);

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: generateToken(user._id), name: user.name });
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