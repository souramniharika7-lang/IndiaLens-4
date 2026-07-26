import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import IndicatorCard from '../components/IndicatorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import axiosInstance from '../axiosInstance';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q || q.length < 2) { setResults([]); return; }
    const fetch = async () => {
      setLoading(true); setError(null);
      try {
        const [indRes, countriesRes] = await Promise.all([
          axiosInstance.get('/indicators', { params: { q } }),
          axiosInstance.get('/countries')
        ]);
        const inds = indRes.data.data || [];
        setResults(inds);
        const india = (countriesRes.data.data || []).find(c => c.code === 'IND');
        if (india && inds.length > 0) {
          const rankRes = await axiosInstance.get('/rankings', { params: { country: india._id, year: 2023 } });
          const map = {};
          (rankRes.data.data || []).forEach(r => { map[r.indicator?._id] = r; });
          setRankings(map);
        }
      } catch { setError('Search failed. Please try again.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [q]);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Search Results</h1>
          {q && <p className="section-subtitle">Results for "<strong>{q}</strong>" — {results.length} indicator{results.length !== 1 ? 's' : ''} found</p>}
        </div>

        {loading && <LoadingSpinner />}
        {error && <p style={{ color: 'var(--color-accent-danger)' }}>{error}</p>}

        {!loading && q.length < 2 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>Type at least 2 characters to search</p>
          </div>
        )}

        {!loading && q.length >= 2 && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
            <h3>No results found for "{q}"</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try different keywords or <Link to="/dashboard">browse all indicators</Link></p>
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {results.map(ind => (
              <IndicatorCard key={ind._id} indicator={ind} rank={rankings[ind._id]?.rank} score={rankings[ind._id]?.score} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
