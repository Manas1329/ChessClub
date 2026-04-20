import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/restPage.css';
import { apiUrl } from '../utils/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text" name="username" placeholder="Username"
          value={form.username} onChange={handleChange} required
        />
        <input
          type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="form-error">{error}</p>}
        <p>Not an admin? <Link to="/register">Register as member</Link></p>
        <p><Link to="/">← Back to Home</Link></p>
      </form>
    </div>
  );
}
