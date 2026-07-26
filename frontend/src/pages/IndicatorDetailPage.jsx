import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LineChart from '../components/LineChart';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import { getIndicatorInsights } from '../services/aiService';
import { exportPDF } from '../utils/exportUtils';
import axiosInstance from '../axiosInstance';

const IndicatorDetailPage = () => {
  const { slug } = useParams();
  const { currentUser } = useAuth();
  const [indicator, setIndicator] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [history, setHistory] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError(null);
      try {
        const indRes = await axiosInstance.get(`/indicators/${slug}`);
        const ind = indRes.data.data;
        setIndicator(ind);

        const [countriesRes, insightsRes] = await Promise.all([
          axiosInstance.get('/countries'),
          getIndicatorInsights(slug).catch(() => null)
        ]);
        if (insightsRes) setInsights(insightsRes.data.data);

        const india = (countriesRes.data.data || []).find(c => c.code === 'IND');
        if (india) {
          const [rankRes, histRes] = await Promise.all([
            axiosInstance.get('/rankings', { params: { indicator: ind._id, country: india._id, year: 2023 } }),
            axiosInstance.get(`/rankings/historical/${ind._id}/${india._id}`).catch(() => null)
          ]);
          setRanking((rankRes.data.data || [])[0] || null);
          if (histRes) setHistory(histRes.data.data);
        }

        // Check favorites
        if (currentUser) {
          const favRes = await userService.getFavorites();
          setIsFav((favRes.data.data || []).some(f => f._id === ind._id || f.slug === slug));
        }
      } catch (err) { setError(err.response?.data?.error || 'Failed to load indicator'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug, currentUser]);

  const toggleFav = async () => {
    if (!indicator) return;
    setFavLoading(true);
    try {
      if (isFav) { await userService.removeFavorite(indicator._id); setIsFav(false); }
      else { await userService.addFavorite(indicator._id); setIsFav(true); }
    } finally { setFavLoading(false); }
  };

  const handleExport = () => {
    if (!indicator) return;
    exportPDF(indicator.name, {
      rank: ranking?.rank, score: ranking?.score,
      totalCountries: ranking?.totalCountries,
      description: indicator.description,
      recommendations: insights?.recommendations
    });
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;
  if (error) return <div className="page-wrapper"><div className="container"><ErrorMessage message={error} /></div></div>;
  if (!indicator) return null;

  const percentile = ranking ? Math.round((1 - ranking.rank / (ranking.totalCountries || 195)) * 100) : null;

  const chartData = history ? {
    labels: history.dataPoints.map(d => d.year),
    datasets: [{
      label: 'Rank',
      data: history.dataPoints.map(d => d.rank),
      borderColor: '#FF6B35',
      backgroundColor: 'rgba(255,107,53,0.1)',
      fill: true
    }, {
      label: 'Score',
      data: history.dataPoints.map(d => d.score),
      borderColor: '#1a237e',
      backgroundColor: 'rgba(26,35,126,0.1)',
      fill: false,
      yAxisID: 'y1'
    }]
  } : null;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/dashboard">Dashboard</Link> / {indicator.category?.name && <><Link to={`/categories/${indicator.category.slug}`}>{indicator.category.name}</Link> / </>}{indicator.name}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{indicator.name}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {indicator.category?.name && <span className="badge badge-primary">{indicator.category.name}</span>}
              {indicator.source?.name && <span className="badge badge-warning">{indicator.source.name}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {currentUser && (
              <button onClick={toggleFav} className={`btn ${isFav ? 'btn-danger' : 'btn-outline'} btn-sm`} disabled={favLoading}>
                {isFav ? '💔 Remove Favorite' : '❤️ Add to Favorites'}
              </button>
            )}
            <button onClick={handleExport} className="btn btn-secondary btn-sm">📥 Export PDF</button>
          </div>
        </div>

        {/* Rank stats */}
        {ranking && (
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card"><div className="stat-card-icon">🏆</div><div className="stat-card-label">Global Rank</div><div className="stat-card-value">#{ranking.rank}</div><div className="stat-card-rank">out of {ranking.totalCountries || 195} countries</div></div>
            <div className="stat-card"><div className="stat-card-icon">📊</div><div className="stat-card-label">Score</div><div className="stat-card-value">{ranking.score}</div><div className="stat-card-rank">{indicator.unit}</div></div>
            <div className="stat-card"><div className="stat-card-icon">📈</div><div className="stat-card-label">Percentile</div><div className="stat-card-value">{percentile}%</div><div className="stat-card-rank">top {100 - percentile}%</div></div>
            <div className="stat-card"><div className="stat-card-icon">📅</div><div className="stat-card-label">Year</div><div className="stat-card-value">2023</div><div className="stat-card-rank">Latest data</div></div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="detail-grid">
          <div>
            {/* Chart */}
            {chartData && <div style={{ marginBottom: '1.5rem' }}>
              <LineChart data={chartData} title={`${indicator.name} – India Historical Trend`} height={280}
                options={{ scales: { y: { title: { display: true, text: 'Rank' }, reverse: true }, y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Score' } } } }} />
            </div>}

            {/* AI Insights */}
            {insights && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>🤖 AI Insights</h3>
                <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>{insights.content}</p>
                {insights.recommendations?.length > 0 && (
                  <>
                    <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Improvement Recommendations</h4>
                    <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {insights.recommendations.map((rec, i) => (
                        <li key={i} style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{rec}</li>
                      ))}
                    </ol>
                  </>
                )}
                {insights.generatedAt && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>Last updated: {new Date(insights.generatedAt).toLocaleDateString()}</p>}
              </div>
            )}
          </div>

          <div>
            {/* About */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>About this Indicator</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{indicator.description}</p>
            </div>
            {/* Methodology */}
            {indicator.methodology && (
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Methodology</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{indicator.methodology}</p>
              </div>
            )}
            {/* Source */}
            {indicator.source?.name && (
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Official Source</h3>
                <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{indicator.source.name}</p>
                {indicator.source.url && <a href={indicator.source.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }}>Visit Official Site ↗</a>}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IndicatorDetailPage;
