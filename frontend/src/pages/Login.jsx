import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/restPage.css';
import { apiUrl } from '../utils/api';

export default function Login() {
  const [mode, setMode] = useState('member');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || '/';

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'admin' ? '/admin/login' : '/login';
      const payload = mode === 'admin'
        ? { username: form.username, password: form.password }
        : { email: form.email, password: form.password };

      const res = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (mode === 'admin') {
        localStorage.setItem('adminToken', data.token);
        localStorage.removeItem('userToken');
      } else {
        localStorage.setItem('userToken', data.token);
      }

      const destination = mode === 'admin' && redirectTo === '/' ? '/admin' : redirectTo;
      navigate('/transition', {
        state: {
          to: destination,
          message: mode === 'admin' ? 'Setting up admin board...' : 'Signing you in...',
          delay: 1100,
        },
      });
      return;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Login</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => setMode('member')}
          style={{ flex: 1, width: 'auto', marginTop: 0, padding: '8px 10px', opacity: mode === 'member' ? 1 : 0.7 }}
        >
          Member
        </button>
        <button
          type="button"
          onClick={() => setMode('admin')}
          style={{ flex: 1, width: 'auto', marginTop: 0, padding: '8px 10px', opacity: mode === 'admin' ? 1 : 0.7 }}
        >
          Admin
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === 'admin' ? (
          <input
            type="text" name="username" placeholder="Admin username"
            value={form.username} onChange={handleChange} required
          />
        ) : (
          <input
            type="email" name="email" placeholder="Registered email"
            value={form.email} onChange={handleChange} required
          />
        )}
        <input
          type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="form-error">{error}</p>}
        <p>New member? <Link to="/register">Create your account</Link></p>
        <p><Link to="/">← Back to Home</Link></p>
      </form>
    </div>
  );
}
