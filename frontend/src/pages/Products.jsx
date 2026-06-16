import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This hits your backend GET endpoint: http://localhost:5000/api/products
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

  if (loading) return <div style={{ padding: '20px' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Explore Our Products</h2>
      
      {/* Product Grid Container */}
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
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
            />
            <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.1rem' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>
              {product.description}
            </p>
            <div style={{ margin: '15px 0', fontWeight: 'bold', color: '#2c3e50', fontSize: '1.2rem' }}>
              ${product.price.toFixed(2)}
            </div>
            <button style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}