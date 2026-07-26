import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useFilter } from '../context/FilterContext';
import IndicatorCard from '../components/IndicatorCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer';
import { generateCSV, downloadCSV } from '../utils/exportUtils';
import axiosInstance from '../axiosInstance';

const DashboardPage = () => {
  const { indicators, dataLoading } = useData();
  const { filters } = useFilter();
  const [rankings, setRankings] = useState({});
  const [rankLoading, setRankLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await axiosInstance.get('/rankings', { params: { year: 2023 } });
        const map = {};
        (res.data.data || []).forEach(r => {
          if (r.country?.code === 'IND') map[r.indicator?._id] = r;
        });
        setRankings(map);
      } catch {} finally { setRankLoading(false); }
    };
    fetchRankings();
  }, []);

  const displayed = useMemo(() => {
    return indicators.filter(ind => {
      if (filters.category && ind.category?._id !== filters.category) return false;
      if (filters.query && !ind.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      return true;
    });
  }, [indicators, filters]);

  const handleExport = () => {
    const rows = displayed.map(ind => {
      const r = rankings[ind._id];
      return { Indicator: ind.name, Category: ind.category?.name || '', Ranking: r?.rank || '', Score: r?.score || '', Year: 2023, Source: ind.source?.name || '' };
    });
    downloadCSV(generateCSV(rows), 'IndiaLens_Dashboard.csv');
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="section-subtitle">India's rankings across {indicators.length} global indicators</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleExport}>📥 Export CSV</button>
        </div>

        <FilterPanel />

        {dataLoading || rankLoading ? <LoadingSpinner /> : (
          displayed.length === 0 ? (
            <ErrorMessage message="No indicators match your filters." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {displayed.map(ind => {
                const r = rankings[ind._id];
                return <IndicatorCard key={ind._id} indicator={ind} rank={r?.rank} score={r?.score} />;
              })}
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
