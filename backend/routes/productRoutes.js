const router = require('express').Router();
const { protect, isAdmin, isStaff } = require('../middleware/auth');

// 👇 Import your new controller handlers
const { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.post('/', protect, isStaff, createProduct);
router.put('/:id', protect, isStaff, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;