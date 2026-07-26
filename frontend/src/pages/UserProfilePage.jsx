import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/userService';
import Footer from '../components/Footer';

const UserProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [form, setForm] = useState({ username: currentUser?.username || '', password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); setMsg(''); setError('');
    if (form.password && form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const payload = { username: form.username };
      if (form.password) payload.password = form.password;
      await updateMe(payload);
      setMsg('Profile updated successfully!');
      setForm(p => ({ ...p, password: '' }));
    } catch (err) { setError(err.response?.data?.error || 'Update failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 600 }}>
        <h1 className="section-title">User Profile</h1>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
              {currentUser?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontWeight: 700 }}>{currentUser?.username}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{currentUser?.email}</p>
              <span className={`badge ${currentUser?.role === 'admin' ? 'badge-warning' : 'badge-success'}`} style={{ marginTop: '0.25rem' }}>{currentUser?.role}</span>
            </div>
          </div>

          {msg && <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: 'var(--color-accent)', fontSize: '0.9rem' }}>{msg}</div>}
          {error && <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: 'var(--color-accent-danger)', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>New Password (optional)</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Leave blank to keep current" minLength={8} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Account Actions</h3>
          <button onClick={logout} className="btn btn-danger btn-sm">🚪 Sign Out</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
