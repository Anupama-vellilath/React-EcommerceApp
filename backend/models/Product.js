const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, required: true },
  stock:       { type: Number, default: 0 },
  
  // 🔗 Links the product directly to your new Subcategory model
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);