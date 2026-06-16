import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 1. Added Navigate
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 2. Add this line right here to handle the "/" path */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}