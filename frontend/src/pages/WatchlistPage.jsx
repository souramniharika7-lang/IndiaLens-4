import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getWatchlists, createWatchlist, removeFromWatchlist } from '../services/userService';

const WatchlistPage = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchWatchlists = async () => {
    setLoading(true);
    try {
      const res = await getWatchlists();
      setWatchlists(res.data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchWatchlists(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createWatchlist(newName.trim());
      setNewName('');
      fetchWatchlists();
    } finally { setCreating(false); }
  };

  const handleRemove = async (watchlistName, indicatorId) => {
    await removeFromWatchlist(watchlistName, indicatorId);
    setWatchlists(prev => prev.map(wl =>
      wl.name === watchlistName
        ? { ...wl, indicators: wl.indicators.filter(i => (i._id || i) !== indicatorId) }
        : wl
    ));
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">📋 My Watchlists</h1>
        <p className="section-subtitle">Track indicators you care about, grouped by watchlist</p>

        {/* Create new watchlist */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Create New Watchlist</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Watchlist name (e.g. Priority Indicators)"
              style={{ maxWidth: 320 }} required
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={creating}>
              {creating ? 'Creating...' : '+ Create'}
            </button>
          </form>
        </div>

        {loading ? <LoadingSpinner /> : watchlists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3>No watchlists yet</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Create a watchlist above, then add indicators from their detail pages</p>
            <Link to="/dashboard" className="btn btn-outline">Browse Indicators</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {watchlists.map(wl => (
              <div key={wl.name} className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-secondary)' }}>
                  📋 {wl.name}
                  <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                    ({wl.indicators?.length || 0} indicators)
                  </span>
                </h3>
                {!wl.indicators || wl.indicators.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    No indicators added yet. Visit an <Link to="/dashboard">indicator page</Link> to add to this watchlist.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {wl.indicators.map(ind => {
                      const indicator = typeof ind === 'object' ? ind : { _id: ind, name: ind, slug: '' };
                      return (
                        <div key={indicator._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--color-bg-secondary)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                          <Link to={`/indicators/${indicator.slug}`} style={{ fontWeight: 500, color: 'var(--color-text)' }}>{indicator.name}</Link>
                          <button onClick={() => handleRemove(wl.name, indicator._id)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.6rem' }}>Remove</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WatchlistPage;
