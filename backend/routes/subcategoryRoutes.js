const express = require('express');
const router = express.Router();
const { getSubcategories, createSubcategory } = require('../controllers/subcategoryController');
const { protect, isAdmin } = require('../middleware/auth');

router.route('/')
  .get(getSubcategories)
  .post(protect, isAdmin, createSubcategory);

module.exports = router;