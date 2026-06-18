import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const accountCards = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: "📦",
      route: "/orders"
    },
    {
      title: "Login & security",
      desc: "Edit login, name, and mobile number",
      icon: "🔐",
      route: "/profile/security"
    },
    {
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: "📍",
      route: "/checkout" // Reuses your interactive form address setup
    },
    {
      title: "Payment options",
      desc: "Edit or add payment methods",
      icon: "💳",
      route: "/profile/payments"
    }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>Your Account</h1>
      
      <div style={styles.grid}>
        {accountCards.map((card, idx) => (
          <div 
            key={idx} 
            style={styles.card} 
            onClick={() => navigate(card.route)}
          >
            <div style={styles.iconWrapper}>{card.icon}</div>
            <div style={styles.textColumn}>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'Arial, sans-serif'
  },
  mainHeading: {
    fontSize: '28px',
    fontWeight: '400',
    color: '#111',
    marginBottom: '25px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    display: 'flex',
    padding: '16px',
    border: '1px solid #d5d9d9',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'background-color 0.2s',
  },
  iconWrapper: {
    fontSize: '32px',
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center'
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 4px 0'
  },
  cardDesc: {
    fontSize: '13px',
    color: '#565959',
    margin: 0,
    lineHeight: '1.4'
  }
};