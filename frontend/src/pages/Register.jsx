import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sends data to your backend router.post('/register')
      await api.post('/auth/register', form);
      
      // Registration successful! Redirect directly to login page
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <h2>Register Account</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input 
          placeholder="Full Name" 
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        <br /><br />
        
        <input 
          placeholder="Email" 
          type="email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
        />
        <br /><br />
        
        <input 
          placeholder="Password" 
          type="password" 
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
          required 
        />
        <br /><br />
        
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}