import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

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
    try {
      await api.post('/cart', { productId: product._id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Product added successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 1. Large Fluid Hero Image Segment */}

<div style={styles.heroContainer}>
  <img 
    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=cover" 
    alt="Amazon Hero Banner" 
    style={styles.heroImage}
  />
  <div style={styles.heroGradient}></div>
</div>

      {/* 2. Overlapping Fluid Content Layer */}
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
    </div>
  );
}

const styles = {
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
    marginTop: '-260px', /* Negative margin pulls the cards up over the image banner */
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
    borderRadius: '0px', /* Clean flat edges just like the official site */
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
    marginTop: 'auto', /* Keeps all actions aligned along the card baseline */
  }
};