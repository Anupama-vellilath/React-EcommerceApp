import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual register API endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data); // Auto-login user after successful signup
        navigate('/products');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.registerCard}>
        <h1 style={styles.heading}>Create account</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Your name</label>
            <input 
              type="text" 
              placeholder="First and last name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile number or email</label>
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
              placeholder="At least 6 characters"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.signUpButton}>
            Create your Amazon account
          </button>
        </form>

        <p style={styles.privacyText}>
          By creating an account, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>

        <div style={styles.divider}></div>

        <p style={styles.loginRedirectText}>
          Already have an account? <Link to="/login" style={styles.signInLink}>Sign in</Link>
        </p>
      </div>
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
  registerCard: {
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
  },
  signUpButton: {
    backgroundColor: '#f0c14b',
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
    marginBottom: '0',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e7e7e7',
    margin: '22px 0 15px 0',
  },
  loginRedirectText: {
    fontSize: '13px',
    margin: '0',
  },
  signInLink: {
    color: '#0066c0',
    textDecoration: 'none',
    fontWeight: '500',
  }
};