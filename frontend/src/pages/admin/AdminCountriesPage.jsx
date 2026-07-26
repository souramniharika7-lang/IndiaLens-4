import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';
import axiosInstance from '../../axiosInstance';

const AdminCountriesPage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', code: '', region: '', flagUrl: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchCountries = async () => {
    setLoading(true);
    const res = await axiosInstance.get('/countries');
    setCountries(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCountries(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      if (editId) { await axiosInstance.put(`/countries/${editId}`, form); setMsg('Country updated.'); }
      else { await axiosInstance.post('/countries', form); setMsg('Country created.'); }
      setForm({ name: '', code: '', region: '', flagUrl: '' }); setEditId(null);
      fetchCountries();
    } catch (err) { setMsg(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleEdit = (c) => { setEditId(c._id); setForm({ name: c.name, code: c.code, region: c.region || '', flagUrl: c.flagUrl || '' }); };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this country and all its rankings?')) return;
    await axiosInstance.delete(`/countries/${id}`);
    fetchCountries();
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><Link to="/admin">Admin</Link> / Countries</div>
        <h1 className="section-title">🌍 Manage Countries</h1>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>{editId ? 'Edit Country' : 'Add Country'}</h3>
          {msg && <p style={{ marginBottom: '1rem', color: msg.includes('Error') ? 'var(--color-accent-danger)' : 'var(--color-accent)', fontSize: '0.9rem' }}>{msg}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <input placeholder="Country name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            <input placeholder="ISO code (e.g. IND)" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} maxLength={3} required />
            <input placeholder="Region" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))} />
            <input placeholder="Flag URL" value={form.flagUrl} onChange={e => setForm(p => ({ ...p, flagUrl: e.target.value }))} />
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : (editId ? 'Update' : 'Add')}</button>
            {editId && <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditId(null); setForm({ name: '', code: '', region: '', flagUrl: '' }); }}>Cancel</button>}
          </form>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Name</th><th>Code</th><th>Region</th><th>Actions</th></tr></thead>
                <tbody>
                  {countries.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td><span className="badge badge-primary">{c.code}</span></td>
                      <td>{c.region}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(c)} className="btn btn-outline btn-sm">Edit</button>
                          <button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
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

export default AdminCountriesPage;
