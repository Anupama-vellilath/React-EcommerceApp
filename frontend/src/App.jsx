import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';// 1. Import CartProvider
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <AuthProvider>
      {/* 2. Wrap everything inside CartProvider */}
      <CartProvider> 
        <BrowserRouter>
          {/* Navbar sits outside Routes so it stays visible on all pages */}
          <Navbar /> 
          
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />

            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* PUBLIC ROUTE: Anyone can view products now */}
            <Route path="/products" element={<Products />} />
            
            {/* PRIVATE ROUTES: Only logged-in users can access */}
            <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}