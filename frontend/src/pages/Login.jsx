import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace this dummy fetch with your actual API endpoint if different
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data); // Save user & token to context
        navigate('/products');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>
        <h1 style={styles.heading}>Sign in</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email or mobile phone number</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.signInButton}>
            Continue
          </button>
        </form>

        <p style={styles.privacyText}>
          By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>
      </div>

      <div style={styles.dividerContainer}>
        <span style={styles.dividerLine}></span>
        <span style={styles.dividerText}>New to Amazon?</span>
        <span style={styles.dividerLine}></span>
      </div>

      <Link to="/register" style={styles.registerButton}>
        Create your Amazon account
      </Link>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: 'calc(100vh - 60px)',
    paddingTop: '40px',
    fontFamily: 'Arial, sans-serif',
  },
  loginCard: {
    width: '350px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px 26px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '400',
    marginBottom: '20px',
    marginTop: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '14px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  input: {
    height: '31px',
    padding: '0 7px',
    border: '1px solid #a6a6a6',
    borderRadius: '3px',
    outline: 'none',
    fontSize: '13px',
    transition: 'border-color 0.1s linear',
  },
  signInButton: {
    backgroundColor: '#fffd2f4',
    background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
    borderColor: '#a88734 #9c7e31 #846a29',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    height: '31px',
    cursor: 'pointer',
    fontSize: '13px',
    marginTop: '10px',
    boxShadow: '0 1px 0 rgba(255,255,255,.4) inset',
  },
  privacyText: {
    fontSize: '12px',
    color: '#555',
    lineHeight: '1.5',
    marginTop: '18px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '350px',
    margin: '22px 0',
  },
  dividerLine: {
    flexGrow: 1,
    height: '1px',
    backgroundColor: '#e7e7e7',
  },
  dividerText: {
    color: '#767676',
    fontSize: '12px',
    padding: '0 8px',
  },
  registerButton: {
    width: '350px',
    boxSizing: 'border-box',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#111',
    backgroundColor: '#eff0f3',
    background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)',
    borderColor: '#adb1b8 #a2a6ac #8d9096',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    padding: '6px 0',
    fontSize: '13px',
    boxShadow: '0 1px 0 rgba(255,255,255,.6) inset',
  }
};