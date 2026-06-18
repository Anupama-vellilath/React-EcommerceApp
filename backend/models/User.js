const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Make sure bcryptjs is imported at the top

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'employee', 'admin'], 
    default: 'user' 
  }
}, { timestamps: true });

// 👇 ADD THIS EXACT METHOD SO THE CONTROLLER CAN VALIDATE PASSWORDS
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔒 Optional auto-hash middleware block for standard registers (keeps passwords safe)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);