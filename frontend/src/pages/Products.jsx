import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // Snackbar tracking variables
  const [snackbar, setSnackbar] = useState({ visible: false, productName: '' });

  useEffect(() => {
    async function loadItems() {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error("Error loading products", err);
      }
    }
    loadItems();
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) return alert('Please sign in first');
    
    // Call the context layer to sync database and navigation values automatically
    await addToCart(product._id, 1);
    
    // Display our polished snackbar container notification box
    setSnackbar({ visible: true, productName: product.name });
    
    // Dissolve automatically after 3.5 seconds
    setTimeout(() => {
      setSnackbar({ visible: false, productName: '' });
    }, 3500);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Image Layout */}
      <div style={styles.heroContainer}>
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=cover" 
          alt="Amazon Hero Banner" 
          style={styles.heroImage}
        />
        <div style={styles.heroGradient}></div>
      </div>

      {/* Grid Content Container */}
      <div style={styles.contentLayer}>
        <div style={styles.gridContainer}>
          {products.map((product) => (
            <div key={product._id} style={styles.amazonCard}>
              <h3 style={styles.cardTitle}>{product.name}</h3>
              
              <div style={styles.imageFrame}>
                <img src={product.image} alt={product.name} style={styles.cardImg} />
              </div>

              <div style={styles.pricingRow}>
                <span style={styles.currencyLabel}>AED</span>
                <span style={styles.priceVal}>{product.price.toFixed(2)}</span>
              </div>
              
              <p style={styles.descText}>{product.description}</p>

              <button onClick={() => handleAddToCart(product)} style={styles.actionBtn}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AMAZON-STYLE SNACKBAR NOTIFICATION CONTAINER */}
      {snackbar.visible && (
        <div style={styles.snackbar}>
          <span style={styles.checkIcon}>✓</span>
          <div style={styles.snackbarMessage}>
            <strong style={{color: '#111'}}>Added to Cart</strong>
            <span style={styles.snackbarSub}>{snackbar.productName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Merge these additions into your existing component style declaration map object block:
const styles = {
  // ... Keep all your previous styles completely unmodified here ...
  pageWrapper: {
    width: '100%',
    backgroundColor: '#eaeded',
    position: 'relative',
    minHeight: '100vh',
  },
  heroContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    height: '450px',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '250px',
    background: 'linear-gradient(to bottom, rgba(234, 237, 237, 0) 0%, rgba(234, 237, 237, 1) 100%)',
  },
  contentLayer: {
    position: 'relative',
    zIndex: 2,
    marginTop: '-260px',
    padding: '0 20px 40px 20px',
    width: '100%',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    width: '100%',
  },
  amazonCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '0px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '21px',
    fontWeight: '700',
    color: '#0f1111',
    margin: '0 0 12px 0',
    letterSpacing: '-0.3px',
  },
  imageFrame: {
    width: '100%',
    height: '240px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: '15px',
  },
  cardImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  pricingRow: {
    display: 'flex',
    alignItems: 'baseline',
    margin: '5px 0 8px 0',
    color: '#0f1111',
  },
  currencyLabel: {
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '3px',
  },
  priceVal: {
    fontSize: '24px',
    fontWeight: '700',
  },
  descText: {
    fontSize: '13px',
    color: '#565959',
    lineHeight: '1.4',
    margin: '0 0 15px 0',
    height: '38px',
    overflow: 'hidden',
  },
  actionBtn: {
    backgroundColor: '#ffd814',
    borderColor: '#fcd200',
    color: '#0f1111',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '9px 0',
    borderRadius: '20px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '13px',
    fontWeight: '500',
    boxShadow: '0 2px 5px rgba(213,217,217,.5)',
    marginTop: 'auto',
  },

  // NEW SNACKBAR STYLES BELOW
  snackbar: {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderLeft: '6px solid #007600', // Amazon eco-green indicator tag accent edge
    borderRadius: '4px',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 9999,
    fontFamily: 'Arial, sans-serif',
    animation: 'slideIn 0.3s ease-out',
  },
  checkIcon: {
    color: '#007600',
    fontSize: '18px',
    fontWeight: 'bold',
    marginRight: '12px',
  },
  snackbarMessage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  snackbarSub: {
    color: '#565959',
    fontSize: '13px',
    maxWidth: '220px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
};