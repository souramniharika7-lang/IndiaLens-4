import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import axiosInstance from '../axiosInstance';

const HistoricalTrendsPage = () => {
  const { indicators } = useData();
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [metric, setMetric] = useState('rank');
  const [startYear, setStartYear] = useState(2019);
  const [endYear, setEndYear] = useState(2023);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [indiaId, setIndiaId] = useState(null);

  useEffect(() => {
    axiosInstance.get('/countries').then(res => {
      const india = (res.data.data || []).find(c => c.code === 'IND');
      if (india) setIndiaId(india._id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (indicators.length > 0 && !selectedIndicator) setSelectedIndicator(indicators[0]._id);
  }, [indicators]);

  useEffect(() => {
    if (!selectedIndicator || !indiaId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/rankings/historical/${selectedIndicator}/${indiaId}`);
        setHistory(res.data.data);
      } catch { setHistory(null); }
      finally { setLoading(false); }
    };
    fetch();
  }, [selectedIndicator, indiaId]);

  const filteredPoints = history?.dataPoints?.filter(d => d.year >= startYear && d.year <= endYear) || [];
  const isLimited = filteredPoints.length <= 1;
  const selectedInd = indicators.find(i => i._id === selectedIndicator);

  const chartData = {
    labels: filteredPoints.map(d => d.year),
    datasets: [{
      label: metric === 'rank' ? 'India Rank' : 'India Score',
      data: filteredPoints.map(d => metric === 'rank' ? d.rank : d.score),
      borderColor: '#FF6B35',
      backgroundColor: 'rgba(255,107,53,0.15)',
      fill: true,
      tension: 0.4
    }]
  };

  const rankOptions = metric === 'rank' ? { scales: { y: { reverse: true, title: { display: true, text: 'Rank (lower is better)' } } } } : {};

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="section-title">Historical Trends</h1>
        <p className="section-subtitle">Track how India's rankings have changed over time</p>

        <div className="filters-bar" style={{ marginBottom: '2rem' }}>
          <select value={selectedIndicator} onChange={e => setSelectedIndicator(e.target.value)} style={{ minWidth: 260 }}>
            <option value="">Select indicator...</option>
            {indicators.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
          </select>
          <select value={metric} onChange={e => setMetric(e.target.value)} style={{ width: 140 }}>
            <option value="rank">Ranking</option>
            <option value="score">Score</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>From</label>
            <input type="number" value={startYear} min={2019} max={endYear} onChange={e => setStartYear(+e.target.value)} style={{ width: 80 }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>To</label>
            <input type="number" value={endYear} min={startYear} max={2023} onChange={e => setEndYear(+e.target.value)} style={{ width: 80 }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {isLimited && filteredPoints.length === 1 && (
              <div style={{ background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--color-accent-warn)' }}>
                ⚠️ Limited historical data available — showing single-year view as bar chart.
              </div>
            )}
            {filteredPoints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>No data for selected range</div>
            ) : isLimited ? (
              <BarChart data={chartData} title={`${selectedInd?.name || ''} – ${metric === 'rank' ? 'Ranking' : 'Score'}`} height={300} />
            ) : (
              <LineChart data={chartData} title={`${selectedInd?.name || ''} – India ${metric === 'rank' ? 'Ranking' : 'Score'} (${startYear}–${endYear})`} height={320} options={rankOptions} />
            )}

            {filteredPoints.length > 0 && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Data Table</h3>
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Year</th><th>Rank</th><th>Score</th></tr></thead>
                    <tbody>
                      {filteredPoints.map(d => (
                        <tr key={d.year}>
                          <td style={{ fontWeight: 600 }}>{d.year}</td>
                          <td>#{d.rank}</td>
                          <td>{d.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HistoricalTrendsPage;
