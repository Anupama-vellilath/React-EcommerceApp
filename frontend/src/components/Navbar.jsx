import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); 
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      {/* LEFT: LOGO (Now safely routes directly to clean root domain) */}
      <div onClick={() => navigate('/')} style={styles.logoContainer}>
        <span style={styles.logo}>
          AmazonClone<span style={{ color: '#febd69' }}>.ae</span>
        </span>
      </div>
      
      {/* RIGHT NAVIGATION GROUP */}
      <div style={styles.rightNav}>
        {/* Explicitly labeled route target is preserved here */}
        <span onClick={() => navigate('/products')} style={styles.navLink}>
          Products
        </span>

        {/* CONDITIONAL ADMIN CONSOLE LINK FOR PRIVILEGED ROLES */}
        {(user?.role === 'admin' || user?.role === 'employee') && (
          <span 
            onClick={() => navigate('/admin')} 
            style={{ ...styles.navLink, color: '#febd69' }}
          >
            Admin Console
          </span>
        )}
        
        {/* CENTER-RIGHT: AMAZON ACCOUNT & LISTS TWO-LINE BUTTON */}
        <div 
          onClick={() => navigate(user ? '/profile' : '/login')} 
          style={styles.accountDropdownTrigger}
        >
          <span style={styles.line1}>
            Hello, {user ? (user.name.length > 12 ? `${user.name.slice(0, 10)}...` : user.name) : 'sign in'}
          </span>
          <span style={styles.line2}>
            Account & Lists
          </span>
        </div>

        {/* LOGOUT INTERACTIVE TRIGGER (Show only if authenticated) */}
        {user && (
          <div onClick={logout} style={styles.logoutWrapper}>
            <span style={styles.line1}>Sign out of</span>
            <span style={styles.line2TextLink}>Session</span>
          </div>
        )}

        {/* RIGHT: CART BADGE LAYOUT */}
        <div onClick={() => navigate('/cart')} style={styles.cartContainer}>
          <div style={styles.iconWrapper}>
            <span style={styles.cartBadge}>{cartCount}</span>
            <svg style={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <span style={styles.cartText}>Cart</span>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: '60px',
    backgroundColor: '#131921', 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    fontFamily: 'Arial, sans-serif',
    userSelect: 'none'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '5px 8px',
    border: '1px solid transparent',
    borderRadius: '2px',
    transition: 'border 0.1s',
    ':hover': { border: '1px solid #fff' } 
  },
  logo: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  rightNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '10px 12px',
    border: '1px solid transparent',
    borderRadius: '2px',
  },
  accountDropdownTrigger: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '6px 12px',
    border: '1px solid transparent',
    borderRadius: '2px',
    color: '#ffffff'
  },
  logoutWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '6px 12px',
    border: '1px solid transparent',
    borderRadius: '2px',
    color: '#ffffff'
  },
  line1: {
    fontSize: '12px',
    color: '#cccccc',
    fontWeight: '400',
    lineHeight: '14px'
  },
  line2: {
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: '15px',
    display: 'flex',
    alignItems: 'center'
  },
  line2TextLink: {
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: '15px',
    color: '#febd69'
  },
  cartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    cursor: 'pointer',
    padding: '6px 12px',
    border: '1px solid transparent',
    borderRadius: '2px',
    color: '#ffffff'
  },
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  cartIcon: {
    width: '28px',
    height: '28px',
    stroke: '#ffffff',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    left: '12px',
    color: '#f08804', 
    fontSize: '16px',
    fontWeight: '700',
    minWidth: '16px',
    textAlign: 'center',
  },
  cartText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    marginLeft: '2px',
  }
};