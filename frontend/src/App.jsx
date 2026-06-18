import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import OrderTracking from './pages/OrderTracking';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <BrowserRouter>
          <Navbar /> 
          
          <Routes>
            {/* 🌐 Both clean root and explicitly typed /products render the same public storefront */}
            <Route path="/"         element={<Products />} />
            <Route path="/products" element={<Products />} />
            
            {/* Auth Routes */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 🔒 PROTECTED CUSTOMER PATHS */}
            <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/profile"  element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/orders/track/:orderId" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
            
            {/* 👑 PROTECTED ADMIN WORKSPACE */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}