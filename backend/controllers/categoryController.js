const Category = require('../models/Category');

// @desc    Get all categories (populated with parent details if they exist)
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate('parent', 'name slug');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories tree', error: error.message });
  }
};

// @desc    Create a new Category or Subcategory
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, parent, slug } = req.body;

    // Check if category name already exists at this hierarchy level
    const categoryExists = await Category.findOne({ name, parent: parent || null });
    if (categoryExists) {
      return res.status(400).json({ message: 'A category item with this name already exists here.' });
    }

    const category = new Category({
      name,
      parent: parent || null,
      slug // If blank, pre-save hook handles auto-generation
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: 'Invalid category setup configuration payload data', error: error.message });
  }
};