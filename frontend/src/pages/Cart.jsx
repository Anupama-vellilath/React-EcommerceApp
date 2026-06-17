import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch Cart Items on load
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user.token) return;
      try {
        const { data } = await api.get('/cart', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        // Assuming your backend response returns an array of items
        setCartItems(data.items || data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  // Handle Remove Item
  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Filter out deleted item immediately from UI
      setCartItems(cartItems.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <div style={{ padding: '20px' }}>Loading Shopping Cart...</div>;

  return (
    <div style={styles.cartPage}>
      {/* Left Column: List of Items */}
      <div style={styles.itemsContainer}>
        <h1 style={styles.heading}>Shopping Cart</h1>
        <div style={styles.divider}></div>

        {cartItems.length === 0 ? (
          <p>Your Amazon Cart is empty. Go add some <span style={{color: '#0066c0', cursor: 'pointer'}} onClick={() => navigate('/products')}>products</span>!</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.product._id} style={styles.cartItem}>
              <img src={item.product.image} alt={item.product.name} style={styles.itemImage} />
              
              <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{item.product.name}</h3>
                <p style={styles.stockText}>In Stock</p>
                <div style={styles.actions}>
                  <span style={styles.qtyText}>Qty: {item.quantity}</span>
                  <span style={styles.pipe}>|</span>
                  <button onClick={() => handleRemove(item.product._id)} style={styles.deleteBtn}>Delete</button>
                </div>
              </div>

              <div style={styles.itemPrice}>
                {item.product.price.toFixed(2)} AED
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Column: Checkout Sidebar Panel */}
      {cartItems.length > 0 && (
        <div style={styles.subtotalCard}>
          <p style={styles.subtotalText}>
            Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''}): <strong style={styles.priceStrong}>{totalPrice.toFixed(2)} AED</strong>
          </p>
          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  cartPage: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#eaeded', // Amazon gray body background
    minHeight: 'calc(100vh - 60px)',
    fontFamily: 'Arial, sans-serif',
    alignItems: 'flex-start'
  },
  itemsContainer: {
    flex: 3,
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '4px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '400',
    margin: '0 0 10px 0'
  },
  divider: {
    height: '1px',
    backgroundColor: '#ddd',
    marginBottom: '20px'
  },
  cartItem: {
    display: 'flex',
    padding: '15px 0',
    borderBottom: '1px solid #e7e7e7',
    justifyContent: 'space-between'
  },
  itemImage: {
    width: '120px',
    height: '120px',
    objectFit: 'contain'
  },
  itemDetails: {
    flex: 2,
    paddingLeft: '20px',
  },
  itemName: {
    fontSize: '18px',
    margin: '0 0 5px 0',
    color: '#0066c0'
  },
  stockText: {
    color: '#007600',
    fontSize: '12px',
    margin: '0 0 10px 0'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px'
  },
  qtyText: {
    color: '#565959'
  },
  pipe: {
    margin: '0 8px',
    color: '#ddd'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#0066c0',
    cursor: 'pointer',
    padding: 0,
    fontSize: '12px',
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#111'
  },
  subtotalCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column'
  },
  subtotalText: {
    fontSize: '18px',
    margin: '0 0 15px 0'
  },
  priceStrong: {
    fontWeight: '700'
  },
  checkoutBtn: {
    backgroundColor: '#ffd814',
    borderColor: '#fcd200',
    color: '#0f1111',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(213,217,217,.5)'
  }
};