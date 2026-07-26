import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer';
import { getGlobalInsights, getCategoryInsights } from '../services/aiService';

const AIInsightsPage = () => {
  const { categories } = useData();
  const [global, setGlobal] = useState(null);
  const [catInsights, setCatInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError(null);
      try {
        const gRes = await getGlobalInsights();
        setGlobal(gRes.data.data);
        if (categories.length > 0) {
          const catResults = await Promise.allSettled(categories.map(c => getCategoryInsights(c.slug)));
          const map = {};
          catResults.forEach((res, i) => {
            if (res.status === 'fulfilled') map[categories[i].slug] = res.value.data.data;
          });
          setCatInsights(map);
        }
      } catch { setError('AI insights are currently unavailable. Please try again later.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [categories]);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div style={{ background: 'var(--color-bg-hero)', borderRadius: 16, padding: '2.5rem', marginBottom: '2rem', color: '#fff' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>🤖 AI Insights</h1>
          <p style={{ opacity: 0.85 }}>AI-generated analysis of India's global performance across all domains</p>
        </div>

        {loading ? <LoadingSpinner message="Generating AI insights..." /> : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              <button onClick={() => setActiveTab('global')} className={`btn btn-sm ${activeTab === 'global' ? 'btn-primary' : 'btn-outline'}`}>🌐 Global Overview</button>
              {categories.map(c => (
                <button key={c.slug} onClick={() => setActiveTab(c.slug)} className={`btn btn-sm ${activeTab === c.slug ? 'btn-primary' : 'btn-outline'}`}>{c.icon} {c.name}</button>
              ))}
            </div>

            {/* Global tab */}
            {activeTab === 'global' && global && (
              <div className="fade-in">
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ marginBottom: '1rem', fontWeight: 700 }}>India's Global Performance Summary</h2>
                  <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>{global.content}</p>
                  {global.generatedAt && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>Generated: {new Date(global.generatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                </div>

                {global.recommendations?.length > 0 && (
                  <div className="card">
                    <h2 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>🎯 Top Recommendations for India</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {global.recommendations.map((rec, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>{i + 1}</div>
                          <p style={{ lineHeight: 1.6, color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Category tabs */}
            {activeTab !== 'global' && catInsights[activeTab] && (
              <div className="fade-in">
                {(() => {
                  const cat = categories.find(c => c.slug === activeTab);
                  const ins = catInsights[activeTab];
                  return (
                    <>
                      <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '2.5rem' }}>{cat?.icon}</span>
                          <h2 style={{ fontWeight: 700 }}>{cat?.name} — AI Analysis</h2>
                        </div>
                        <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>{ins.content}</p>
                        {ins.generatedAt && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>Generated: {new Date(ins.generatedAt).toLocaleDateString()}</p>}
                      </div>
                      {ins.recommendations?.length > 0 && (
                        <div className="card">
                          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Recommendations</h3>
                          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {ins.recommendations.map((r, i) => (
                              <li key={i} style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab !== 'global' && !catInsights[activeTab] && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                <p>No insights available for this category yet.</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AIInsightsPage;
