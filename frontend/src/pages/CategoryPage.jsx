import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import IndicatorCard from '../components/IndicatorCard';
import BarChart from '../components/BarChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer';
import { getCategoryInsights } from '../services/aiService';
import axiosInstance from '../axiosInstance';

const CategoryPage = ({ categorySlug }) => {
  const params = useParams();
  const slug = categorySlug || params.categorySlug;
  const [category, setCategory] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [rankings, setRankings] = useState({});
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError(null);
      try {
        const [catRes, countriesRes, insRes] = await Promise.all([
          axiosInstance.get(`/categories/${slug}`),
          axiosInstance.get('/countries'),
          getCategoryInsights(slug).catch(() => null)
        ]);
        setCategory(catRes.data.data.category);
        const inds = catRes.data.data.indicators || [];
        setIndicators(inds);
        if (insRes) setInsights(insRes.data.data);

        const india = (countriesRes.data.data || []).find(c => c.code === 'IND');
        if (india && inds.length > 0) {
          const rankRes = await axiosInstance.get('/rankings', { params: { country: india._id, year: 2023 } });
          const map = {};
          (rankRes.data.data || []).forEach(r => { map[r.indicator?._id] = r; });
          setRankings(map);
        }
      } catch (err) { setError(err.response?.data?.error || 'Failed to load category'); }
      finally { setLoading(false); }
    };
    if (slug) fetch();
  }, [slug]);

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;
  if (error) return <div className="page-wrapper"><div className="container"><ErrorMessage message={error} /></div></div>;

  const chartData = {
    labels: indicators.map(i => i.name.length > 20 ? i.name.substring(0, 20) + '...' : i.name),
    datasets: [{
      label: 'India Score',
      data: indicators.map(i => rankings[i._id]?.score || 0),
      backgroundColor: indicators.map((_, idx) => `hsl(${idx * 40 + 10}, 70%, 55%)`),
      borderRadius: 6
    }]
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <Link to="/dashboard">Dashboard</Link> / {category?.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem' }}>{category?.icon || '📊'}</span>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{category?.name}</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>{category?.description}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="grid-2">
          {/* Indicators */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Indicators ({indicators.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {indicators.map(ind => (
                <IndicatorCard key={ind._id} indicator={ind} rank={rankings[ind._id]?.rank} score={rankings[ind._id]?.score} />
              ))}
            </div>
          </div>

          {/* Chart + AI */}
          <div>
            {indicators.length > 0 && <div style={{ marginBottom: '1.5rem' }}>
              <BarChart data={chartData} title={`India's Scores – ${category?.name}`} height={260} />
            </div>}
            {insights && (
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>🤖 AI Category Insights</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{insights.content}</p>
                {insights.recommendations?.length > 0 && (
                  <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {insights.recommendations.map((r, i) => <li key={i} style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>{r}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
