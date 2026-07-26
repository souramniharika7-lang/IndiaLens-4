import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';
import { useData } from '../../context/DataContext';
import axiosInstance from '../../axiosInstance';

const AdminNewsPage = () => {
  const { categories } = useData();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ headline: '', summary: '', content: '', sourceName: '', sourceUrl: '', category: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchNews = async () => { setLoading(true); const res = await axiosInstance.get('/news'); setNews(res.data.data || []); setLoading(false); };
  useEffect(() => { fetchNews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const payload = { ...form, category: form.category || undefined };
      if (editId) { await axiosInstance.put(`/news/${editId}`, payload); setMsg('Updated.'); }
      else { await axiosInstance.post('/news', payload); setMsg('Article created.'); }
      setForm({ headline: '', summary: '', content: '', sourceName: '', sourceUrl: '', category: '' }); setEditId(null); fetchNews();
    } catch (err) { setMsg(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleEdit = (a) => { setEditId(a._id); setForm({ headline: a.headline, summary: a.summary || '', content: a.content || '', sourceName: a.sourceName || '', sourceUrl: a.sourceUrl || '', category: a.category?._id || '' }); };
  const handleDelete = async (id) => { if (!window.confirm('Delete article?')) return; await axiosInstance.delete(`/news/${id}`); fetchNews(); };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><Link to="/admin">Admin</Link> / News</div>
        <h1 className="section-title">📰 Manage News</h1>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>{editId ? 'Edit Article' : 'Add Article'}</h3>
          {msg && <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: msg.includes('Error') ? 'var(--color-accent-danger)' : 'var(--color-accent)' }}>{msg}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <input placeholder="Headline *" value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} required />
            <input placeholder="Summary" value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} />
            <textarea placeholder="Full content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} style={{ resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
              <input placeholder="Source name" value={form.sourceName} onChange={e => setForm(p => ({ ...p, sourceName: e.target.value }))} />
              <input placeholder="Source URL" value={form.sourceUrl} onChange={e => setForm(p => ({ ...p, sourceUrl: e.target.value }))} />
            </div>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              <option value="">Select category (optional)</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : (editId ? 'Update' : 'Publish')}</button>
              {editId && <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditId(null); setForm({ headline: '', summary: '', content: '', sourceName: '', sourceUrl: '', category: '' }); }}>Cancel</button>}
            </div>
          </form>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Headline</th><th>Category</th><th>Published</th><th>Actions</th></tr></thead>
                <tbody>
                  {news.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 500, maxWidth: 320 }}>{a.headline}</td>
                      <td>{a.category?.name ? <span className="badge badge-primary">{a.category.name}</span> : '—'}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '—'}</td>
                      <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(a)} className="btn btn-outline btn-sm">Edit</button>
                        <button onClick={() => handleDelete(a._id)} className="btn btn-danger btn-sm">Delete</button>
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

export default AdminNewsPage;
