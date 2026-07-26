import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { useData } from '../context/DataContext';
import axiosInstance from '../axiosInstance';

const NewsPage = () => {
  const { categories } = useData();
  const [news, setNews] = useState([]);
  const [catFilter, setCatFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNews = async (cat = '') => {
    setLoading(true);
    try {
      const params = cat ? { category: cat } : {};
      const res = await axiosInstance.get('/news', { params });
      setNews(res.data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(catFilter); }, [catFilter]);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Latest News</h1>
        <p className="section-subtitle">Global progress updates, rankings releases, and policy developments</p>

        <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 200 }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          {catFilter && <button className="btn btn-outline btn-sm" onClick={() => setCatFilter('')}>✕ Clear</button>}
        </div>

        {loading ? <LoadingSpinner /> : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
            <p>No articles found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {news.map(a => <NewsCard key={a._id} article={a} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
