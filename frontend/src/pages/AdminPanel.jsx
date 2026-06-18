import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // options: products, orders, users
  
  // State for Lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding/Editing Products
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', image: '', category: '', countInStock: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // Fetch all admin parameters on mount
  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Concurrently load statistics data
      const [prodRes, orderRes, userRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders', config), // Ensure your backend orders route handles an admin check
        api.get('/auth/users', config) // Admin route to get all users
      ]);

      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error("Error fetching administrative management scope:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT MANAGEMENT OPERATIONS ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (editingProductId) {
        // Edit Mode
        await api.put(`/products/${editingProductId}`, productForm, config);
        alert('Product updated successfully!');
      } else {
        // Add Mode
        await api.post('/products', productForm, config);
        alert('Product added successfully!');
      }
      setProductForm({ name: '', description: '', price: '', image: '', category: '', countInStock: '' });
      setEditingProductId(null);
      fetchAdminData();
    } catch (err) {
      alert('Operation failed. Check terminal permissions.');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ORDER STATUS LOGIC (Updates Order Tracking Status) ---
  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(`Order status updated to: ${nextStatus}`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '30px', fontFamily: 'Arial' }}>Loading Admin Console...</div>;

  return (
    <div style={styles.adminContainer}>
      {/* LEFT SIDEBAR CONTROLS */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeader}>Admin Dashboard</h2>
        <div 
          style={activeTab === 'products' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('products')}
        >
          📦 Product Management
        </div>
        <div 
          style={activeTab === 'orders' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('orders')}
        >
          🚚 Order Tracking Center
        </div>
        <div 
          style={activeTab === 'users' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('users')}
        >
          👥 User Records
        </div>
      </div>

      {/* RIGHT MAIN WORKSPACE CONTENT */}
      <div style={styles.mainContent}>
        
        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            <h1 style={styles.sectionTitle}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleProductSubmit} style={styles.productForm}>
              <input type="text" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required style={styles.input} />
              <input type="text" placeholder="Image URL String" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} required style={styles.input} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" placeholder="Price (AED)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required style={styles.input} />
                <input type="number" placeholder="Stock Count Quantity" value={productForm.countInStock} onChange={e => setProductForm({...productForm, countInStock: e.target.value})} required style={styles.input} />
              </div>
              <input type="text" placeholder="Category" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required style={styles.input} />
              <textarea placeholder="Product Description Detail Text" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required style={{ ...styles.input, height: '80px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.amazonGoldBtn}>Save Product Config</button>
                {editingProductId && <button type="button" onClick={() => { setEditingProductId(null); setProductForm({ name: '', description: '', price: '', image: '', category: '', countInStock: '' }); }} style={styles.cancelBtn}>Cancel</button>}
              </div>
            </form>

            <h2 style={{ ...styles.sectionTitle, marginTop: '40px' }}>Current Inventory Catalog</h2>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod._id} style={styles.tableRow}>
                    <td style={styles.td}><img src={prod.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{prod.name}</td>
                    <td style={styles.td}>{prod.price} AED</td>
                    <td style={styles.td}>{prod.countInStock} units</td>
                    <td style={styles.td}>
                      <button style={styles.actionEdit} onClick={() => { setEditingProductId(prod._id); setProductForm(prod); }}>Edit</button>
                      <button style={styles.actionDelete} onClick={() => deleteProduct(prod._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ORDER FULFILLMENT & STATUS UPDATER */}
        {activeTab === 'orders' && (
          <div>
            <h1 style={styles.sectionTitle}>Global Order Delivery Management</h1>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Total Revenue</th>
                  <th style={styles.th}>Fulfillment Milestone</th>
                  <th style={styles.th}>Update Status Trigger</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={styles.tableRow}>
                    <td style={styles.td}>{order._id}</td>
                    <td style={styles.td}>{order.user?.name || 'Guest Checkout'}</td>
                    <td style={{ ...styles.td, color: '#b12704', fontWeight: 'bold' }}>{order.total?.toFixed(2)} AED</td>
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: order.status === 'delivered' ? '#e2f0d9' : '#fff3cd',
                        color: order.status === 'delivered' ? '#385723' : '#856404'
                      }}>
                        {order.status || 'ordered'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select 
                        value={order.status || 'ordered'} 
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={styles.selectDropdown}
                      >
                        <option value="ordered">Ordered</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: USER METRICS */}
        {activeTab === 'users' && (
          <div>
            <h1 style={styles.sectionTitle}>Registered Users Directory</h1>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>User ID Key</th>
                  <th style={styles.th}>Full Profile Name</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Administrative Privileges</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={styles.tableRow}>
                    <td style={styles.td}>{u._id}</td>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.isAdmin ? '🟢 Admin' : '⚪ Standard User'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  adminContainer: { display: 'flex', minHeight: 'calc(100vh - 60px)', fontFamily: 'Arial, sans-serif', backgroundColor: '#fcfcfc' },
  sidebar: { width: '260px', backgroundColor: '#232f3e', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' },
  sidebarHeader: { color: '#fff', fontSize: '18px', padding: '0 10px 15px 10px', borderBottom: '1px solid #3a4b5f', margin: '0 0 10px 0' },
  tabBtn: { padding: '12px 15px', color: '#ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
  activeTabBtn: { padding: '12px 15px', color: '#fff', backgroundColor: '#131921', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  mainContent: { flex: 1, padding: '30px 40px' },
  sectionTitle: { fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#111' },
  productForm: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px', backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
  input: { width: '100%', padding: '10px', border: '1px solid #a6a6a6', borderRadius: '3px', fontSize: '14px', boxSizing: 'border-box' },
  amazonGoldBtn: { backgroundColor: '#ffd814', borderColor: '#fcd200', color: '#0f1111', padding: '10px 20px', borderStyle: 'solid', borderWidth: '1px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  cancelBtn: { backgroundColor: '#fff', border: '1px solid #d5d9d9', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', backgroundColor: '#fff', border: '1px solid #e7e7e7' },
  tableHeaderRow: { backgroundColor: '#f6f6f6', borderBottom: '1px solid #ddd' },
  th: { padding: '12px', textTransform: 'uppercase', fontSize: '11px', color: '#555', textAlign: 'left', fontWeight: 'bold' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px', fontSize: '13px', color: '#111' },
  actionEdit: { marginRight: '8px', padding: '4px 8px', backgroundColor: '#007185', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' },
  actionDelete: { padding: '4px 8px', backgroundColor: '#b12704', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' },
  selectDropdown: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #a6a6a6', fontSize: '13px', backgroundColor: '#fff' }
};