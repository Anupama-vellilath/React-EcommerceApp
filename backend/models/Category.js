const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  slug:   { type: String, unique: true, lowercase: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

// ✨ Modern Mongoose approach: Compute fields synchronously before validation runs
categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and specials with dashes
      .replace(/(^-|-$)+/g, '');    // Clean trailing/leading dashes
  }
  
  // Guard clause to check if next is passed as a function parameter by older drivers
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Category', categorySchema);