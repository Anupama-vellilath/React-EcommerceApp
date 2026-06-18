const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // 👇 ADD THIS EXACT PIECE TO YOUR SCHEMA DEFINITION
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" }
  }
}, { timestamps: true });



userSchema.pre('save', async function() {
  if (!this.isModified('password')) return; 

  const bcrypt = require('bcryptjs'); // Make sure bcrypt is imported at the top!
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);