import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth with curly braces

export default function Navbar() {
  // 2. Destructure 'user' and 'logout' from useAuth()
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/products" style={styles.logoLink}>AmazonClone.ae</Link>
      </div>

      <div style={styles.navLinks}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>Cart</Link>
        
        {/* 3. Check 'user' instead of 'token' (since your state stores user data) */}
        {user ? (
          <>
            <span style={styles.welcome}>Hello, {user.name || 'User'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Keep your existing styles down here...
const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#131921', padding: '10px 20px', color: 'white' },
  logoLink: { color: '#ff9900', fontWeight: 'bold', textDecoration: 'none', fontSize: '20px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '15px' },
  link: { color: '#ffffff', textDecoration: 'none' },
  welcome: { color: '#cccccc', fontSize: '14px' },
  registerBtn: { color: '#131921', backgroundColor: '#f0c14b', padding: '5px 10px', borderRadius: '3px', textDecoration: 'none' },
  logoutBtn: { background: 'none', border: 'none', color: '#ff9900', cursor: 'pointer', textDecoration: 'underline' }
};