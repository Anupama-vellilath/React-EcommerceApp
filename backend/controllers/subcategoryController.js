const Subcategory = require('../models/Subcategory');

// @desc    Create a new Subcategory
// @route   POST /api/subcategories
// @access  Private/Admin
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    const exists = await Subcategory.findOne({ name, category });
    if (exists) {
      return res.status(400).json({ message: 'This subcategory already exists under this department.' });
    }

    const subcategory = new Subcategory({ name, category });
    const savedSubcategory = await subcategory.save();
    
    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating subcategory', error: error.message });
  }
};

// @desc    Get all Subcategories
// @route   GET /api/subcategories
// @access  Public
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).populate('category', 'name slug');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching subcategories', error: error.message });
  }
};