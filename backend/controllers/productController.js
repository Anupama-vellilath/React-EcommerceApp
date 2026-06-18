const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    // ✨ Updated with Deep/Nested population mapping to fully hydration the split architecture tree
    const products = await Product.find({})
      .populate({
        path: 'category',          // Populates the Subcategory document block
        populate: {
          path: 'category',        // Deep populates the parent Category document inside Subcategory
          select: 'name slug'
        }
      });
      
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching products', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin & Employee)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock, countInStock } = req.body;

    // 💡 Resolves field naming variances between 'stock' and 'countInStock'
    const finalStockValue = stock !== undefined ? stock : countInStock;

    const product = new Product({
      name,
      description,
      price: Number(price),
      image,
      category, // Receives the Subcategory ObjectId string here safely
      stock: Number(finalStockValue) || 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data patterns', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin & Employee)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const finalStockValue = stock !== undefined ? stock : countInStock;

    // Dynamic field replacement updates
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    if (finalStockValue !== undefined) {
      product.stock = Number(finalStockValue);
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product schema parameters', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin Only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product item snapshot not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product removed successfully from the storage catalog' });
  } catch (error) {
    res.status(500).json({ message: 'Server compilation error during deletion', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};