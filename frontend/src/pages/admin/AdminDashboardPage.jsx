import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';
import axiosInstance from '../../axiosInstance';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ countries: 0, categories: 0, indicators: 0, rankings: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [c, cat, ind, rank, n] = await Promise.all([
          axiosInstance.get('/countries'), axiosInstance.get('/categories'),
          axiosInstance.get('/indicators'), axiosInstance.get('/rankings'),
          axiosInstance.get('/news')
        ]);
        setStats({
          countries: c.data.data?.length || 0,
          categories: cat.data.data?.length || 0,
          indicators: ind.data.data?.length || 0,
          rankings: rank.data.data?.length || 0,
          news: n.data.data?.length || 0
        });
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ background: 'var(--color-bg-hero)', borderRadius: 14, padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>⚙️ Admin Dashboard</h1>
          <p style={{ opacity: 0.85 }}>Manage all data for IndiaLens</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card"><div className="stat-card-icon">🌍</div><div className="stat-card-label">Countries</div><div className="stat-card-value">{stats.countries}</div></div>
              <div className="stat-card"><div className="stat-card-icon">📂</div><div className="stat-card-label">Categories</div><div className="stat-card-value">{stats.categories}</div></div>
              <div className="stat-card"><div className="stat-card-icon">📊</div><div className="stat-card-label">Indicators</div><div className="stat-card-value">{stats.indicators}</div></div>
              <div className="stat-card"><div className="stat-card-icon">🏆</div><div className="stat-card-label">Rankings</div><div className="stat-card-value">{stats.rankings}</div></div>
              <div className="stat-card"><div className="stat-card-icon">📰</div><div className="stat-card-label">News</div><div className="stat-card-value">{stats.news}</div></div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Management Sections</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  ['/admin/countries', '🌍', 'Countries', 'Manage country records'],
                  ['/admin/categories', '📂', 'Categories', 'Manage indicator categories'],
                  ['/admin/indicators', '📊', 'Indicators', 'Manage global indicators'],
                  ['/admin/rankings', '🏆', 'Rankings', 'Manage ranking data'],
                  ['/admin/news', '📰', 'News', 'Manage news articles']
                ].map(([path, icon, title, desc]) => (
                  <Link key={path} to={path} className="card" style={{ textAlign: 'center', padding: '1.25rem', textDecoration: 'none', color: 'var(--color-text)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
