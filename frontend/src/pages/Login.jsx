import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/auth/login', form);
    login(data);
    navigate('/products');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Email"    value={form.email}
        onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({...form, password: e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
}