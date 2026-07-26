import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IndicatorCard from '../components/IndicatorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getFavorites, removeFavorite } from '../services/userService';
import axiosInstance from '../axiosInstance';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchFavs = async () => {
    setLoading(true);
    try {
      const [favRes, countriesRes] = await Promise.all([getFavorites(), axiosInstance.get('/countries')]);
      const favs = favRes.data.data || [];
      setFavorites(favs);
      const india = (countriesRes.data.data || []).find(c => c.code === 'IND');
      if (india && favs.length > 0) {
        const rankRes = await axiosInstance.get('/rankings', { params: { country: india._id, year: 2023 } });
        const map = {};
        (rankRes.data.data || []).forEach(r => { map[r.indicator?._id] = r; });
        setRankings(map);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchFavs(); }, []);

  const handleRemove = async (id) => {
    await removeFavorite(id);
    setFavorites(prev => prev.filter(f => f._id !== id));
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">❤️ My Favorites</h1>
        <p className="section-subtitle">Your saved indicators for quick access</p>

        {loading ? <LoadingSpinner /> : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
            <h3>No favorites yet</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Browse indicators and add them to your favorites</p>
            <Link to="/dashboard" className="btn btn-primary">Browse Indicators</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {favorites.map(ind => (
              <div key={ind._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <IndicatorCard indicator={ind} rank={rankings[ind._id]?.rank} score={rankings[ind._id]?.score} />
                </div>
                <button onClick={() => handleRemove(ind._id)} className="btn btn-danger btn-sm" title="Remove from favorites">💔</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
