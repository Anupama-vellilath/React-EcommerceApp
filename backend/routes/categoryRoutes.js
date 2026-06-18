const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');

// 🔒 Import your project's custom auth guard middlewares
// Destructure "isAdmin" instead of "admin" to match your authMiddleware file exactly
const { protect, isAdmin } = require('../middleware/auth');

router.route('/')
  .get(getCategories)                  // Publicly available
  .post(protect, isAdmin, createCategory); // Restricted to authorized admins

module.exports = router;