import React, { useState, useEffect } from 'react';
import WorldMap, { normalizeScore, scoreToColor } from '../components/WorldMap';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { useData } from '../context/DataContext';
import axiosInstance from '../axiosInstance';
import '../styles/charts.css';

// Map ISO-3166 numeric id to country name for react-simple-maps
const COUNTRY_NAME_MAP = {
  'India': 'IND', 'United States of America': 'USA', 'China': 'CHN',
  'Germany': 'DEU', 'Japan': 'JPN', 'United Kingdom': 'GBR',
  'France': 'FRA', 'Brazil': 'BRA', 'Australia': 'AUS', 'Canada': 'CAN'
};

const WorldMapPage = () => {
  const { indicators } = useData();
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [rankings, setRankings] = useState([]);
  const [countryColorMap, setCountryColorMap] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (indicators.length > 0 && !selectedIndicator) {
      setSelectedIndicator(indicators[0]._id);
    }
  }, [indicators]);

  useEffect(() => {
    if (!selectedIndicator) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/rankings', { params: { indicator: selectedIndicator, year: 2023 } });
        const data = res.data.data || [];
        setRankings(data);

        const scores = data.map(r => r.score).filter(s => s != null);
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        const ind = indicators.find(i => i._id === selectedIndicator);
        const higherIsBetter = ind?.higherIsBetter !== false;

        const colorMap = {};
        data.forEach(r => {
          const name = r.country?.name;
          if (name) {
            const normalized = normalizeScore(r.score, min, max, higherIsBetter);
            colorMap[name] = scoreToColor(normalized);
          }
        });
        setCountryColorMap(colorMap);
      } finally { setLoading(false); }
    };
    fetch();
  }, [selectedIndicator, indicators]);

  const handleCountryClick = (geo) => {
    const name = geo.properties.name;
    const code = COUNTRY_NAME_MAP[name];
    const r = rankings.find(r => r.country?.name === name || r.country?.code === code);
    setSelectedCountry({ name, rank: r?.rank, score: r?.score });
  };

  const selectedInd = indicators.find(i => i._id === selectedIndicator);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Interactive World Map</h1>
        <p className="section-subtitle">Click any country to see its ranking for the selected indicator</p>

        <div className="world-map-container">
          <div className="world-map-controls">
            <select value={selectedIndicator} onChange={e => setSelectedIndicator(e.target.value)} style={{ minWidth: 280 }}>
              <option value="">Select an indicator...</option>
              {indicators.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
            {selectedInd && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <div className="map-legend">
                  <span>Poor</span>
                  <div className="legend-gradient" />
                  <span>Excellent</span>
                </div>
              </div>
            )}
          </div>

          {loading ? <LoadingSpinner message="Loading map data..." /> : (
            <div style={{ position: 'relative' }}>
              <WorldMap countryColorMap={countryColorMap} onCountryClick={handleCountryClick} />
              {selectedCountry && (
                <div className="map-info-panel">
                  <div className="map-info-country">🌍 {selectedCountry.name}</div>
                  {selectedCountry.rank ? (
                    <>
                      <div className="map-info-rank">Rank: <strong>#{selectedCountry.rank}</strong></div>
                      <div className="map-info-rank">Score: <strong>{selectedCountry.score}</strong></div>
                      <div className="map-info-rank" style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>{selectedInd?.name}</div>
                    </>
                  ) : <div className="map-info-rank" style={{ color: 'var(--color-text-muted)' }}>No data available</div>}
                </div>
              )}
            </div>
          )}
        </div>

        {rankings.length > 0 && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Top 10 Countries – {selectedInd?.name}</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Rank</th><th>Country</th><th>Score</th></tr></thead>
                <tbody>
                  {rankings.sort((a, b) => a.rank - b.rank).slice(0, 10).map(r => (
                    <tr key={r._id}>
                      <td><span className="rank-badge">#{r.rank}</span></td>
                      <td style={{ fontWeight: 500 }}>{r.country?.name}</td>
                      <td>{r.score}</td>
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

export default WorldMapPage;
