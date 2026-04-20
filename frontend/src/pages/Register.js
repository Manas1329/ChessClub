import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/restPage.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', age: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Welcome to ChessClub! Your registration is complete.');
      setForm({ name: '', email: '', phone: '', age: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Join ChessClub</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text" name="name" placeholder="Full Name"
          value={form.name} onChange={handleChange} required
        />
        <input
          type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required
        />
        <input
          type="tel" name="phone" placeholder="Phone Number"
          value={form.phone} onChange={handleChange} required
        />
        <input
          type="number" name="age" placeholder="Age" min="5" max="100"
          value={form.age} onChange={handleChange} required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
        <p>Already a member? <Link to="/login">Admin Login</Link></p>
        <p><Link to="/">← Back to Home</Link></p>
      </form>
    </div>
  );
}
