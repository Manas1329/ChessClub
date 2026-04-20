import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/homepage.css';
import '../styles/extraPages.css';
import { apiUrl, toArrayResponse } from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  };
}

// ── Sub-panels ────────────────────────────────────────────────

function ArticlesPanel() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', type: 'news', imageUrl: '', meta: '', featured: false });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadArticles(); }, []);

  async function loadArticles() {
    const r = await fetch(apiUrl('/articles'));
    const data = await r.json();
    setArticles(toArrayResponse(data));
  }

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = editId ? apiUrl(`/articles/${editId}`) : apiUrl('/articles');
    const method = editId ? 'PUT' : 'POST';
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, typeof value === 'boolean' ? String(value) : value);
    });
    if (imageFile) payload.append('imageFile', imageFile);

    const headers = { Authorization: authHeaders().Authorization };
    const r = await fetch(url, { method, headers, body: payload });
    if (r.ok) {
      setMsg(editId ? 'Article updated.' : 'Article added.');
      setForm({ title: '', body: '', type: 'news', imageUrl: '', meta: '', featured: false });
      setImageFile(null);
      setEditId(null);
      loadArticles();
    } else {
      const d = await r.json(); setMsg(d.error || 'Error');
    }
    setTimeout(() => setMsg(''), 2500);
  }

  function startEdit(a) {
    setEditId(a._id);
    setForm({ title: a.title, body: a.body, type: a.type, imageUrl: a.imageUrl || '', meta: a.meta || '', featured: a.featured || false });
    setImageFile(null);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this article?')) return;
    await fetch(apiUrl(`/articles/${id}`), { method: 'DELETE', headers: authHeaders() });
    loadArticles();
  }

  return (
    <div>
      <h3 className="admin-section-title">{editId ? 'Edit Article' : 'Add Article'}</h3>
      <div className="admin-form">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <select name="type" value={form.type} onChange={handleChange}>
              {['news','event','puzzle','workshop','achievement','strategy'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea name="body" placeholder="Article body..." value={form.body} onChange={handleChange} required />
          <div className="admin-form-row">
            <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />
            <input name="meta" placeholder="Meta e.g. April 20, 2025 • Club Events" value={form.meta} onChange={handleChange} />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            style={{ marginTop: 8, color: '#888' }}
          />
          <div style={{ color: '#888', fontSize: '12px', marginTop: 4 }}>
            Upload a local image for testing, or keep using the URL field above.
          </div>
          <label style={{ color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured (shows image)
          </label>
          <br />
          <button type="submit" className="admin-btn primary">{editId ? 'Update Article' : 'Add Article'}</button>
          {editId && (
            <button type="button" className="admin-btn" style={{ marginLeft: 8 }}
              onClick={() => { setEditId(null); setForm({ title: '', body: '', type: 'news', imageUrl: '', meta: '', featured: false }); }}>
              Cancel
            </button>
          )}
          {msg && <span style={{ marginLeft: 12, color: '#6dbf6d', fontSize: '13px' }}>{msg}</span>}
        </form>
      </div>

      <h3 className="admin-section-title">All Articles</h3>
      {articles.length === 0 ? <p className="empty-state">No articles yet.</p> : (
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Type</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {articles.map(a => (
              <tr key={a._id}>
                <td>{a.title}</td>
                <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                <td>{a.featured ? '✓' : '—'}</td>
                <td>
                  <button className="admin-btn" style={{ marginRight: 6 }} onClick={() => startEdit(a)}>Edit</button>
                  <button className="admin-btn danger" onClick={() => handleDelete(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function MembersPanel() {
  const [members, setMembers] = useState([]);
  const [eloEdits, setEloEdits] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => { loadMembers(); }, []);

  async function loadMembers() {
    const r = await fetch(apiUrl('/members'));
    const data = await r.json();
    setMembers(toArrayResponse(data));
  }

  async function updateMember(id, updates) {
    const r = await fetch(apiUrl(`/members/${id}`), {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(updates),
    });
    if (r.ok) { setMsg('Updated.'); loadMembers(); }
    setTimeout(() => setMsg(''), 2000);
  }

  async function deleteMember(id) {
    if (!window.confirm('Remove this member?')) return;
    await fetch(apiUrl(`/members/${id}`), { method: 'DELETE', headers: authHeaders() });
    loadMembers();
  }

  return (
    <div>
      <h3 className="admin-section-title">Members {msg && <span style={{ color: '#6dbf6d', fontSize: '13px', fontWeight: 'normal' }}>{msg}</span>}</h3>
      {members.length === 0 ? <p className="empty-state">No members yet.</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Age</th><th>ELO</th><th>Paid</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>{m.age}</td>
                <td>
                  <input
                    className="elo-input"
                    type="number"
                    defaultValue={m.eloRating}
                    onChange={e => setEloEdits(prev => ({ ...prev, [m._id]: e.target.value }))}
                  />
                  <button className="admin-btn primary" style={{ marginLeft: 6, padding: '3px 10px', fontSize: '11px' }}
                    onClick={() => updateMember(m._id, { eloRating: Number(eloEdits[m._id] ?? m.eloRating) })}>
                    Save
                  </button>
                </td>
                <td>
                  <span className={`paid-badge ${m.paid ? 'yes' : 'no'}`}>{m.paid ? 'YES' : 'NO'}</span>
                  <button className="admin-btn" style={{ marginLeft: 6, padding: '3px 10px', fontSize: '11px' }}
                    onClick={() => updateMember(m._id, { paid: !m.paid })}>
                    Toggle
                  </button>
                </td>
                <td>
                  <button className="admin-btn danger" onClick={() => deleteMember(m._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { loadEvents(); }, []);

  async function loadEvents() {
    const r = await fetch(apiUrl('/events'));
    const data = await r.json();
    setEvents(toArrayResponse(data));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const r = await fetch(apiUrl('/events'), { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    if (r.ok) { setMsg('Event added.'); setForm({ name: '', date: '', description: '' }); loadEvents(); }
    else { const d = await r.json(); setMsg(d.error || 'Error'); }
    setTimeout(() => setMsg(''), 2500);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    await fetch(apiUrl(`/events/${id}`), { method: 'DELETE', headers: authHeaders() });
    loadEvents();
  }

  return (
    <div>
      <h3 className="admin-section-title">Add Event</h3>
      <div className="admin-form">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <input name="name" placeholder="Event name" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input type="date" name="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
          </div>
          <input name="description" placeholder="Description (optional)" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <button type="submit" className="admin-btn primary">Add Event</button>
          {msg && <span style={{ marginLeft: 12, color: '#6dbf6d', fontSize: '13px' }}>{msg}</span>}
        </form>
      </div>
      <h3 className="admin-section-title">All Events</h3>
      {events.length === 0 ? <p className="empty-state">No events yet.</p> : (
        <table className="admin-table">
          <thead><tr><th>Event</th><th>Date</th><th>Description</th><th>Action</th></tr></thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev._id}>
                <td>{ev.name}</td>
                <td>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>{ev.description || '—'}</td>
                <td><button className="admin-btn danger" onClick={() => handleDelete(ev._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function GalleryPanel() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ imageUrl: '', caption: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { loadImages(); }, []);

  async function loadImages() {
    const r = await fetch(apiUrl('/gallery'));
    const data = await r.json();
    setImages(toArrayResponse(data));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const r = await fetch(apiUrl('/gallery'), { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    if (r.ok) { setMsg('Image added.'); setForm({ imageUrl: '', caption: '' }); loadImages(); }
    else { const d = await r.json(); setMsg(d.error || 'Error'); }
    setTimeout(() => setMsg(''), 2500);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this image?')) return;
    await fetch(apiUrl(`/gallery/${id}`), { method: 'DELETE', headers: authHeaders() });
    loadImages();
  }

  return (
    <div>
      <h3 className="admin-section-title">Add Gallery Image</h3>
      <div className="admin-form">
        <form onSubmit={handleSubmit}>
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} required />
          <input name="caption" placeholder="Caption (optional)" value={form.caption}
            onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} />
          <button type="submit" className="admin-btn primary">Add Image</button>
          {msg && <span style={{ marginLeft: 12, color: '#6dbf6d', fontSize: '13px' }}>{msg}</span>}
        </form>
      </div>
      <h3 className="admin-section-title">All Images</h3>
      {images.length === 0 ? <p className="empty-state">No images yet.</p> : (
        <table className="admin-table">
          <thead><tr><th>Preview</th><th>Caption</th><th>Action</th></tr></thead>
          <tbody>
            {images.map(img => (
              <tr key={img._id}>
                <td>
                  <img src={img.imageUrl} alt="gallery"
                    style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                </td>
                <td>{img.caption || '—'}</td>
                <td><button className="admin-btn danger" onClick={() => handleDelete(img._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Main Admin Dashboard ─────────────────────────────────────

const TABS = ['Articles', 'Members', 'Events', 'Gallery'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Articles');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/login');
  }, [navigate]);

  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/');
  }

  return (
    <div>
      <div className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 id="title">ChessClub</h2>
        </Link>
        <div className="navbuttons">
          <Link to="/" className="navbutton">← Home</Link>
          <ThemeToggle />
          <button className="navbutton" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="admin-page">
        <h2 className="section-title" style={{ borderBottom: 'none', marginBottom: 0 }}>
          Admin Dashboard
        </h2>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Articles' && <ArticlesPanel />}
        {tab === 'Members'  && <MembersPanel />}
        {tab === 'Events'   && <EventsPanel />}
        {tab === 'Gallery'  && <GalleryPanel />}
      </div>
    </div>
  );
}
