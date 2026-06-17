import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      {/* Top Main Nav Bar */}
      <div style={styles.topNav}>
        
        {/* Left: Brand Logo */}
        <div style={styles.leftContainer}>
          <Link to="/products" style={styles.logo}>
            AmazonClone<span style={styles.logoDot}>.ae</span>
          </Link>
        </div>

        {/* Center: Expandable Spacer or future search input */}
        <div style={styles.centerSpacer}></div>

        {/* Right: Actions/Navigation items */}
        <div style={styles.rightContainer}>
          <Link to="/products" style={styles.navLinkItem}>
            <span style={styles.lineOne}>Return to</span>
            <span style={styles.lineTwo}>Products</span>
          </Link>
          
          <Link to="/cart" style={styles.navLinkItem}>
            <span style={styles.lineOne}>Shopping</span>
            <span style={styles.lineTwo}>Cart</span>
          </Link>

          {user ? (
            <div style={styles.navLinkItem}>
              <span style={styles.lineOne}>Hello, {user.name || 'Anuz'}</span>
              <button onClick={logout} style={styles.logoutAction}>Logout</button>
            </div>
          ) : (
            <Link to="/login" style={styles.navLinkItem}>
              <span style={styles.lineOne}>Hello, Sign in</span>
              <span style={styles.lineTwo}>Account</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    width: '100%',
    backgroundColor: '#131921',
    display: 'flex',
    flexDirection: 'column',
  },
  topNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '60px',
    width: '100%',
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  logoDot: {
    color: '#febd69', /* Amazon Orange accent */
  },
  centerSpacer: {
    flexGrow: 1,
    margin: '0 20px',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLinkItem: {
    display: 'flex',
    flexDirection: 'column',
    color: '#ffffff',
    textDecoration: 'none',
    justifyContent: 'center',
  },
  lineOne: {
    fontSize: '12px',
    color: '#cccccc',
  },
  lineTwo: {
    fontSize: '14px',
    fontWeight: '700',
  },
  logoutAction: {
    background: 'none',
    border: 'none',
    color: '#febd69',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
  }
};