import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import CategoryCard from '../components/CategoryCard';
import NewsCard from '../components/NewsCard';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LineChart from '../components/LineChart';
import { useData } from '../context/DataContext';
import axiosInstance from '../axiosInstance';
import '../styles/dashboard.css';

const FEATURED = [
  { slug: 'gdp-rank', icon: '💹', label: 'GDP Rank' },
  { slug: 'hdi', icon: '🌟', label: 'HDI' },
  { slug: 'global-innovation-index', icon: '💡', label: 'Innovation Index' },
  { slug: 'global-peace-index', icon: '🕊️', label: 'Peace Index' },
  { slug: 'ai-readiness-index', icon: '🤖', label: 'AI Readiness' },
  { slug: 'happiness-index', icon: '😊', label: 'Happiness Index' }
];

const HomePage = () => {
  const { categories, dataLoading } = useData();
  const [news, setNews] = useState([]);
  const [rankings, setRankings] = useState({});
  const [indiaHistory, setIndiaHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const [newsRes, countriesRes] = await Promise.all([
        axiosInstance.get('/news', { params: { limit: 5 } }),
        axiosInstance.get('/countries')
      ]);
      setNews(newsRes.data.data || []);

      // Get India country id
      const india = (countriesRes.data.data || []).find(c => c.code === 'IND');
      if (india) {
        // Fetch featured rankings
        const rankRes = await axiosInstance.get('/rankings', { params: { country: india._id, year: 2023 } });
        const rankMap = {};
        (rankRes.data.data || []).forEach(r => {
          rankMap[r.indicator?.slug] = r;
        });
        setRankings(rankMap);

        // Fetch HDI historical for chart
        try {
          const indRes = await axiosInstance.get('/indicators/hdi');
          const hdiId = indRes.data.data?._id;
          if (hdiId) {
            const histRes = await axiosInstance.get(`/rankings/historical/${hdiId}/${india._id}`);
            setIndiaHistory(histRes.data.data);
          }
        } catch {}
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const hdiChartData = indiaHistory ? {
    labels: indiaHistory.dataPoints.map(d => d.year),
    datasets: [{
      label: 'India HDI Score',
      data: indiaHistory.dataPoints.map(d => d.score),
      borderColor: '#FF6B35',
      backgroundColor: 'rgba(255,107,53,0.1)',
      fill: true,
      tension: 0.4
    }]
  } : null;

  if (loading || dataLoading) return (
    <div className="page-wrapper">
      <div className="hero" style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading IndiaLens..." />
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content fade-in">
          <h1>India's Global Progress<br /><span>at a Glance</span></h1>
          <p>Track India's rankings across 17+ global indices — Economy, Society, Governance, Technology & more.</p>
          <SearchBar placeholder="Search indicators, indices, rankings..." />
        </div>
      </section>

      <div className="container">
        {error && <ErrorMessage message={error} onRetry={fetchData} />}

        {/* Stats */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">India's Key Rankings</h2>
            <p className="section-subtitle">Latest global positions across major indices</p>
          </div>
          <div className="stats-grid">
            {FEATURED.map(f => {
              const r = rankings[f.slug];
              return (
                <StatCard key={f.slug} icon={f.icon} label={f.label}
                  value={r ? `#${r.rank}` : '—'} rank={r?.rank} slug={f.slug} />
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">Dive deep into each domain of India's global standing</p>
          </div>
          <div className="categories-grid">
            {categories.map(cat => <CategoryCard key={cat._id} category={cat} />)}
          </div>
        </section>

        {/* Chart */}
        {hdiChartData && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">India's HDI Trend</h2>
              <p className="section-subtitle">Human Development Index score over 5 years</p>
            </div>
            <LineChart data={hdiChartData} title="Human Development Index – India (2019–2023)" height={280} />
          </section>
        )}

        {/* Latest News */}
        <section className="section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="section-title">Latest Global Updates</h2>
              <p className="section-subtitle">Recent developments in India's global rankings</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/news')}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {news.length > 0 ? news.map(a => <NewsCard key={a._id} article={a} />) : (
              <p className="text-muted text-center">No news available.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
