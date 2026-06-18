import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  // ✨ Updated activeTab options to include 'categories' 
  const [activeTab, setActiveTab] = useState('products'); 
  
  // State for Lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Holds top-level main departments
  const [subcategories, setSubcategories] = useState([]); // ✨ New state tracker for dedicated subcategory collection
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category / Subcategory Creation Inline State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParentCategory, setSelectedParentCategory] = useState(''); // Empty string means a top-level parent category

  // Form State for Adding/Editing Products
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', image: '', category: '', stock: ''
  });
  const [selectedMainCategory, setSelectedMainCategory] = useState(''); // Frontend state filter for subcategory dropdown tree
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
      
      // Concurrently load statistics data including both split endpoints
      const [prodRes, catRes, subCatRes, orderRes, userRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'), 
        api.get('/subcategories'), // ✨ Fetches dedicated subcategory data items from backend
        api.get('/orders', config), 
        api.get('/auth/users', config) 
      ]);

      setProducts(prodRes.data);
      setCategories(catRes.data || []);
      setSubcategories(subCatRes.data || []); // Save to subcategories state tracking engine
      setOrders(orderRes.data);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error("Error fetching administrative management scope:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ✨ UPDATED DEDICATED ROUTE ROUTING SUBMISSION ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    
    try {
      if (selectedParentCategory) {
        // ✨ Route A: Payload matches a distinct subcategory entity path
        const payload = { name: newCategoryName, category: selectedParentCategory };
        await api.post('/subcategories', payload, config);
      } else {
        // ✨ Route B: Standard top-level master department creation
        const payload = { name: newCategoryName };
        await api.post('/categories', payload, config);
      }

      alert('Category hierarchy updated successfully!');
      setNewCategoryName('');
      setSelectedParentCategory('');
      fetchAdminData(); 
    } catch (err) {
      alert(`Failed to add category: ${err.response?.data?.message || err.message}`);
    }
  };

  // --- PRODUCT MANAGEMENT OPERATIONS ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, productForm, config);
        alert('Product updated successfully!');
      } else {
        await api.post('/products', productForm, config);
        alert('Product added successfully!');
      }
      setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
      setSelectedMainCategory(''); 
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

  // --- ORDER STATUS LOGIC ---
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

  // --- ✨ Clean Dynamic Separation Array Mapping ---
  // Subcategories are now filtered based on their dedicated structural .category relationship key field!
  const subcategoriesForSelectedMain = subcategories.filter(sub => {
    const parentId = typeof sub.category === 'object' ? sub.category?._id : sub.category;
    return parentId === selectedMainCategory;
  });

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
        {/* ✨ ADDED: Category Navigation Registry Button Option */}
        <div 
          style={activeTab === 'categories' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('categories')}
        >
          🌿 Category Registry View
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
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', width: '100%' }}>
              
              {/* MAIN FORM PANEL INTERFACE */}
              <div style={{ flex: 1, minWidth: '320px' }}>
                <h1 style={styles.sectionTitle}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h1>
                <form onSubmit={handleProductSubmit} style={styles.productForm}>
                  <input type="text" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required style={styles.input} />
                  <input type="text" placeholder="Image URL String" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} required style={styles.input} />
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" placeholder="Price (AED)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required style={styles.input} />
                    <input type="number" placeholder="Stock Count Quantity" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required style={styles.input} />
                  </div>

                  {/* 🌲 Amazon Dropdown 1: Main Top-Level Category Node Selection */}
                  <select 
                    value={selectedMainCategory} 
                    onChange={e => { setSelectedMainCategory(e.target.value); setProductForm({...productForm, category: ''}); }}
                    style={styles.selectDropdownElement}
                    required
                  >
                    <option value="">Select Main Category Department...</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>

                  {/* 🌿 Amazon Dropdown 2: Subcategory Child Target Selection */}
                  <select 
                    value={typeof productForm.category === 'object' ? productForm.category?._id : productForm.category} 
                    onChange={e => setProductForm({...productForm, category: e.target.value})} 
                    disabled={!selectedMainCategory}
                    style={styles.selectDropdownElement}
                    required
                  >
                    <option value="">Select Target Subcategory...</option>
                    {subcategoriesForSelectedMain.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>

                  <textarea placeholder="Product Description Detail Text" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required style={{ ...styles.input, height: '80px' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={styles.amazonGoldBtn}>Save Product Config</button>
                    {editingProductId && <button type="button" onClick={() => { setEditingProductId(null); setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' }); setSelectedMainCategory(''); }} style={styles.cancelBtn}>Cancel</button>}
                  </div>
                </form>
              </div>

              {/* ✨ SIDEBAR MANAGEMENT COMPONENT: CATEGORY GENERATOR CREATOR UTILITY */}
              <div style={{ width: '320px' }}>
                <h1 style={styles.sectionTitle}>Create Categories Tree</h1>
                <form onSubmit={handleCategorySubmit} style={styles.productForm}>
                  <input 
                    type="text" 
                    placeholder="Category Node Title Name" 
                    value={newCategoryName} 
                    onChange={e => setNewCategoryName(e.target.value)} 
                    required 
                    style={styles.input} 
                  />
                  <select
                    value={selectedParentCategory}
                    onChange={e => setSelectedParentCategory(e.target.value)}
                    style={styles.selectDropdownElement}
                  >
                    <option value="">None (Top-Level Department Module)</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>Subcategory of → {cat.name}</option>
                    ))}
                  </select>
                  <button type="submit" style={{ ...styles.amazonGoldBtn, backgroundColor: '#f0c14b', borderColor: '#a88734' }}>
                    ➕ Create Category Entity
                  </button>
                </form>
              </div>

            </div>

            <h2 style={{ ...styles.sectionTitle, marginTop: '40px' }}>Current Inventory Catalog</h2>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Amazon Placement Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => {
                  // ✨ Calculate nested category path safely
                  const subcategoryName = prod.category?.name || 'Dynamic';
                  const parentCategoryName = prod.category?.category?.name || '';
                  const localizedDisplayTree = parentCategoryName 
                    ? `${subcategoryName} (${parentCategoryName})` 
                    : subcategoryName;

                  return (
                    <tr key={prod._id} style={styles.tableRow}>
                      <td style={styles.td}><img src={prod.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                      <td style={{ ...styles.td, fontWeight: 'bold' }}>{prod.name}</td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>
                          {localizedDisplayTree}
                        </span>
                      </td>
                      <td style={styles.td}>{prod.price} AED</td>
                      <td style={styles.td}>{prod.stock} units</td>
                      <td style={styles.td}>
                        <button style={styles.actionEdit} onClick={() => { 
                          setEditingProductId(prod._id); 
                          setProductForm(prod);
                          
                          // Handle mapping back up the chain for cascade editing selections
                          const parentRef = prod.category?.category;
                          if (parentRef) {
                            setSelectedMainCategory(typeof parentRef === 'object' ? parentRef._id : parentRef);
                          }
                        }}>Edit</button>
                        <button style={styles.actionDelete} onClick={() => deleteProduct(prod._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ✨ NEW TAB 4: CATEGORY REGISTRY VIEW MAPPING WINDOW */}
        {activeTab === 'categories' && (
          <div>
            <h1 style={styles.sectionTitle}>Main Departments & Subcategory Registry</h1>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '25px' }}>
              Review your structural marketplace tree mapping parent categories to their respective child subcategories.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {categories.map(mainCat => {
                const children = subcategories.filter(sub => {
                  const parentId = typeof sub.category === 'object' ? sub.category?._id : sub.category;
                  return parentId === mainCat._id;
                });

                return (
                  <div key={mainCat._id} style={styles.registryCard}>
                    <div style={styles.registryCardHeader}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#232f3e', fontWeight: 'bold' }}>
                        📁 {mainCat.name}
                      </h3>
                      <span style={styles.miniIdBadge}>ID: {mainCat._id.slice(-5)}</span>
                    </div>

                    {children.length > 0 ? (
                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {children.map(sub => (
                          <li key={sub._id} style={styles.registryListItem}>
                            <span style={{ color: '#111', fontWeight: '500' }}>🔹 {sub.name}</span>
                            <span style={{ fontSize: '11px', color: '#a6a6a6' }}>ID: {sub._id.slice(-5)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontStyle: 'italic', color: '#999', fontSize: '13px', padding: '5px 0' }}>
                        No child subcategories attached yet.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
  productForm: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  input: { width: '100%', padding: '10px', border: '1px solid #a6a6a6', borderRadius: '3px', fontSize: '14px', boxSizing: 'border-box' },
  selectDropdownElement: { width: '100%', padding: '10px', border: '1px solid #a6a6a6', borderRadius: '3px', fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer' },
  amazonGoldBtn: { backgroundColor: '#ffd814', borderColor: '#fcd200', color: '#0f1111', padding: '10px 20px', borderStyle: 'solid', borderWidth: '1px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', width: '100%' },
  cancelBtn: { backgroundColor: '#fff', border: '1px solid #d5d9d9', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', backgroundColor: '#fff', border: '1px solid #e7e7e7' },
  tableHeaderRow: { backgroundColor: '#f6f6f6', borderBottom: '1px solid #ddd' },
  th: { padding: '12px', textTransform: 'uppercase', fontSize: '11px', color: '#555', textAlign: 'left', fontWeight: 'bold' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px', fontSize: '13px', color: '#111' },
  actionEdit: { marginRight: '8px', padding: '4px 8px', backgroundColor: '#007185', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' },
  actionDelete: { padding: '4px 8px', backgroundColor: '#b12704', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' },
  selectDropdown: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #a6a6a6', fontSize: '13px', backgroundColor: '#fff' },
  categoryBadge: {
    backgroundColor: '#f3f3f3',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#555',
    fontWeight: '500',
    border: '1px solid #e0e0e0'
  },
  // Style Extensions for the Category Registry Layout Window:
  registryCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  registryCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #f0c14b',
    paddingBottom: '8px',
    marginBottom: '12px'
  },
  miniIdBadge: {
    fontSize: '10px',
    color: '#777',
    backgroundColor: '#f3f3f3',
    padding: '2px 5px',
    borderRadius: '3px'
  },
  registryListItem: {
    padding: '6px 10px',
    backgroundColor: '#fafafa',
    border: '1px solid #e7e7e7',
    borderRadius: '4px',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px'
  }
};