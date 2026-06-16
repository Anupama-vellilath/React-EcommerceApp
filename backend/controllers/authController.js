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

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.matchPassword(password)))
//     return res.status(401).json({ message: 'Invalid credentials' });
//   res.json({ token: generateToken(user._id), name: user.name });
// };


exports.login = async (req, res) => {
  // 👇 ADD THESE TWO LINES HERE
  console.log("--- BACKEND ATTEMPT ---");
  console.log("Received payload:", req.body);

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: generateToken(user._id), name: user.name });
};

