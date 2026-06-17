const Cart = require('../models/Cart');

// 1. ADD OR UPDATE ITEM IN CART (POST /api/cart)
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Extracted by your protect middleware

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If no cart exists for user, create a brand new one
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already exists in user's cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product doesn't exist, push new item array object
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

// 2. GET USER CART (GET /api/cart)
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// 3. DELETE ITEM FROM CART (DELETE /api/cart/:productId)
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};