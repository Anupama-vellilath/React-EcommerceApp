const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true, 
    lowercase: true 
  },
  // 🔗 Links directly to the parent Category collection
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }
}, { timestamps: true });

// Auto-slugify configuration safely before validation
subcategorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Subcategory', subcategorySchema);