import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import RadarChart from '../components/RadarChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer';
import { generateCSV, downloadCSV } from '../utils/exportUtils';
import axiosInstance from '../axiosInstance';

const COLORS = ['#FF6B35', '#1a237e', '#4CAF50', '#FF9800', '#9C27B0'];

const CountryComparisonPage = () => {
  const { countries, indicators, categories } = useData();
  const [selected, setSelected] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [catFilter, setCatFilter] = useState('');
  const [chosenIndicator, setChosenIndicator] = useState('');

  const addCountry = (id) => {
    if (!id || selected.includes(id) || selected.length >= 5) return;
    setSelected(prev => [...prev, id]);
  };
  const removeCountry = (id) => setSelected(prev => prev.filter(c => c !== id));

  useEffect(() => {
    if (selected.length === 0) { setRankings({}); return; }
    const fetch = async () => {
      setLoading(true); setError(null);
      try {
        const res = await axiosInstance.get('/rankings', { params: { year: 2023 } });
        const map = {};
        (res.data.data || []).forEach(r => {
          const cid = r.country?._id;
          const iid = r.indicator?._id;
          if (!map[cid]) map[cid] = {};
          map[cid][iid] = r;
        });
        setRankings(map);
      } catch (err) { setError('Failed to load rankings'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [selected]);

  const filteredIndicators = catFilter ? indicators.filter(i => i.category?._id === catFilter) : indicators;
  const selectedCountries = countries.filter(c => selected.includes(c._id));

  // Bar chart for chosen indicator
  const barData = chosenIndicator ? {
    labels: selectedCountries.map(c => c.name),
    datasets: [{
      label: indicators.find(i => i._id === chosenIndicator)?.name || 'Score',
      data: selectedCountries.map(c => rankings[c._id]?.[chosenIndicator]?.score || 0),
      backgroundColor: COLORS.slice(0, selectedCountries.length),
      borderRadius: 6
    }]
  } : null;

  // Radar chart — top 6 indicators by first selected country rank
  const radarInds = filteredIndicators.slice(0, 6);
  const radarData = {
    labels: radarInds.map(i => i.name.length > 18 ? i.name.substring(0, 18) + '...' : i.name),
    datasets: selectedCountries.map((c, idx) => ({
      label: c.name,
      data: radarInds.map(i => {
        const r = rankings[c._id]?.[i._id];
        if (!r || !r.totalCountries) return 0;
        return Math.round((1 - r.rank / r.totalCountries) * 100);
      }),
      borderColor: COLORS[idx],
      backgroundColor: COLORS[idx] + '33',
      pointBackgroundColor: COLORS[idx]
    }))
  };

  const handleExport = () => {
    const rows = [];
    filteredIndicators.forEach(ind => {
      selectedCountries.forEach(c => {
        const r = rankings[c._id]?.[ind._id];
        rows.push({ Indicator: ind.name, Category: ind.category?.name || '', Ranking: r?.rank || '', Score: r?.score || '', Year: 2023, Source: ind.source?.name || '' });
      });
    });
    downloadCSV(generateCSV(rows), 'IndiaLens_Comparison.csv');
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 className="section-title">Country Comparison</h1>
            <p className="section-subtitle">Compare India with up to 4 other countries across all indicators</p>
          </div>
          {selected.length >= 2 && <button className="btn btn-outline btn-sm" onClick={handleExport}>📥 Export CSV</button>}
        </div>

        {/* Country selector */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Select Countries (max 5)</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select onChange={e => addCountry(e.target.value)} value="" style={{ width: 220 }}>
              <option value="">Add a country...</option>
              {countries.filter(c => !selected.includes(c._id)).map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {selectedCountries.map((c, i) => (
                <span key={c._id} style={{ background: COLORS[i] + '22', border: `1.5px solid ${COLORS[i]}`, color: COLORS[i], borderRadius: 20, padding: '0.3rem 0.9rem', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {c.name} <button onClick={() => removeCountry(c._id)} style={{ background: 'none', border: 'none', color: COLORS[i], cursor: 'pointer', fontSize: '1rem', padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {selected.length < 2 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-card)', borderRadius: 14, border: '2px dashed var(--color-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
            <h3>Select at least 2 countries to compare</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Use the dropdown above to add countries</p>
          </div>
        ) : (
          <>
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && (
              <>
                {/* Filters */}
                <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
                  <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 180 }}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <select value={chosenIndicator} onChange={e => setChosenIndicator(e.target.value)} style={{ width: 260 }}>
                    <option value="">Select indicator for bar chart...</option>
                    {filteredIndicators.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                  </select>
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="grid-2">
                  {barData && <BarChart data={barData} title="Score Comparison" height={280} />}
                  <RadarChart data={radarData} title="Multi-Indicator Radar (Percentile)" height={320} />
                </div>

                {/* Comparison table */}
                <div className="card">
                  <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Detailed Rankings Table</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Indicator</th>
                          <th>Category</th>
                          {selectedCountries.map(c => <th key={c._id}>{c.name}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIndicators.map(ind => (
                          <tr key={ind._id}>
                            <td style={{ fontWeight: 500 }}>{ind.name}</td>
                            <td><span className="badge badge-primary">{ind.category?.name}</span></td>
                            {selectedCountries.map((c, ci) => {
                              const r = rankings[c._id]?.[ind._id];
                              return (
                                <td key={c._id} style={{ color: ci === 0 ? 'var(--color-primary)' : 'var(--color-text)' }}>
                                  {r ? <><strong>#{r.rank}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({r.score})</span></> : '—'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Scorecard */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCountries.length}, 1fr)`, gap: '1rem', marginTop: '1.5rem' }}>
                  {selectedCountries.map((c, ci) => {
                    const countryRanks = filteredIndicators.map(i => rankings[c._id]?.[i._id]?.rank).filter(Boolean);
                    const avg = countryRanks.length ? Math.round(countryRanks.reduce((a, b) => a + b, 0) / countryRanks.length) : null;
                    return (
                      <div key={c._id} className="card" style={{ borderTop: `3px solid ${COLORS[ci]}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏳️</div>
                        <h4 style={{ fontWeight: 700 }}>{c.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Avg Rank: {avg ? `#${avg}` : '—'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{countryRanks.length} indicators</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CountryComparisonPage;
