import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your custom auth context
import api from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Destructure user context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Make sure your backend is running.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    // 1. Force guest users to log in first
    if (!user || !user.token) {
      alert('Please log in to add items to your cart!');
      navigate('/login');
      return;
    }

    try {
      // 2. Send request to backend cart database
      await api.post(
        '/cart', 
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } } // Pass user token
      );
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Could not add item to cart. Check backend setup.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Explore Our Products</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map((product) => (
          <div 
            key={product._id} 
            style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '15px', 
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.1rem', textAlign: 'left' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden', textAlign: 'left' }}>
                {product.description}
              </p>
            </div>
            
            <div>
              <div style={{ margin: '15px 0', fontWeight: 'bold', color: '#111', fontSize: '1.2rem', textAlign: 'left' }}>
                {product.price} AED
              </div>
              <button 
                onClick={() => handleAddToCart(product)}
                style={{
                  backgroundColor: '#f0c14b', // Amazon Yellow
                  color: '#111',
                  border: '1px solid #a88734',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: '500'
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}