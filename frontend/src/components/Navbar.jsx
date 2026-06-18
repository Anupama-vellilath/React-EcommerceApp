import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // 1. Import the hook

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); // 2. Pull the live global counter
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      <span onClick={() => navigate('/products')} style={styles.logo}>
        AmazonClone<span style={{ color: '#febd69' }}>.ae</span>
      </span>
      
      <div style={styles.rightNav}>
        <span onClick={() => navigate('/products')} style={styles.navLink}>Return to Products</span>
        
        {/* Amazon-style Cart Layout */}
        <div onClick={() => navigate('/cart')} style={styles.cartContainer}>
          <div style={styles.iconWrapper}>
            {/* The Badge sits cleanly on top of the cart layout */}
            <span style={styles.cartBadge}>{cartCount}</span>
            <svg style={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <span style={styles.cartText}>Cart</span>
        </div>

        {user ? (
          <div style={styles.authGroup}>
            <span style={styles.userGreeting}>Hello, {user.name || 'User'}</span>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: '60px',
    backgroundColor: '#131921', // Dark Amazon Theme color
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    fontFamily: 'Arial, sans-serif',
  },
  logo: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  rightNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    cursor: 'pointer',
    position: 'relative',
    padding: '5px',
  },
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    width: '26px',
    height: '26px',
    stroke: '#ffffff',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    left: '10px',
    backgroundColor: '#131921',
    color: '#f08804', // Distinct Amazon Orange notification badge color
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '50%',
    padding: '0 4px',
    minWidth: '16px',
    textAlign: 'center',
  },
  cartText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    marginLeft: '2px',
  },
  authGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userGreeting: {
    color: '#ccc',
    fontSize: '12px',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    fontSize: '14px',
  },
  loginBtn: {
    backgroundColor: '#ffd814',
    border: '1px solid #fcd200',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};