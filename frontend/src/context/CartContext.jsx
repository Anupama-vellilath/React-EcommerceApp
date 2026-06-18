import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user || !user.token) {
      setCartItems([]);
      return;
    }
    try {
      const { data } = await api.get('/cart', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCartItems(data.items || data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return alert('Please sign in first');
    try {
      await api.post('/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await fetchCart(); // Instantly update global count
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, fetchCart, addToCart, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}