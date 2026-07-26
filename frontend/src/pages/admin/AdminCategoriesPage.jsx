import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';
import axiosInstance from '../../axiosInstance';

const AdminCategoriesPage = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchCats = async () => { setLoading(true); const res = await axiosInstance.get('/categories'); setCats(res.data.data || []); setLoading(false); };
  useEffect(() => { fetchCats(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      if (editId) { await axiosInstance.put(`/categories/${editId}`, form); setMsg('Updated.'); }
      else { await axiosInstance.post('/categories', form); setMsg('Created.'); }
      setForm({ name: '', slug: '', description: '', icon: '' }); setEditId(null); fetchCats();
    } catch (err) { setMsg(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleEdit = (c) => { setEditId(c._id); setForm({ name: c.name, slug: c.slug, description: c.description || '', icon: c.icon || '' }); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await axiosInstance.delete(`/categories/${id}`); fetchCats(); };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><Link to="/admin">Admin</Link> / Categories</div>
        <h1 className="section-title">📂 Manage Categories</h1>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>{editId ? 'Edit Category' : 'Add Category'}</h3>
          {msg && <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: msg.includes('Error') || msg.includes('already') ? 'var(--color-accent-danger)' : 'var(--color-accent)' }}>{msg}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <input placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            <input placeholder="Slug (e.g. economy)" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required />
            <input placeholder="Icon emoji" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
            <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : (editId ? 'Update' : 'Add')}</button>
            {editId && <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditId(null); setForm({ name: '', slug: '', description: '', icon: '' }); }}>Cancel</button>}
          </form>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Icon</th><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
                <tbody>
                  {cats.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontSize: '1.5rem' }}>{c.icon}</td>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td><span className="badge badge-primary">{c.slug}</span></td>
                      <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(c)} className="btn btn-outline btn-sm">Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm">Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminCategoriesPage;
