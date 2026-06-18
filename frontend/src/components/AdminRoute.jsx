import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // 1. If not logged in at all, kick them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the user role is either 'admin' or 'employee'
  const hasAccess = user.role === 'admin' || user.role === 'employee';

  // 3. If they don't have privileges, send them back to products storefront
  return hasAccess ? children : <Navigate to="/products" replace />;
}