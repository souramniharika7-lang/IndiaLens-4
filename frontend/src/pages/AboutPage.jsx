import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const SOURCES = [
  { name: 'World Bank', url: 'https://worldbank.org', desc: 'GDP, Growth Rate' },
  { name: 'IMF', url: 'https://imf.org', desc: 'GDP per Capita, Inflation' },
  { name: 'UNDP', url: 'https://undp.org', desc: 'Human Development Index, Education Index' },
  { name: 'World Economic Forum', url: 'https://weforum.org', desc: 'Gender Gap Index' },
  { name: 'WIPO', url: 'https://wipo.int', desc: 'Global Innovation Index' },
  { name: 'Transparency International', url: 'https://transparency.org', desc: 'Corruption Perception Index' },
  { name: 'IEP', url: 'https://visionofhumanity.org', desc: 'Global Peace Index' },
  { name: 'Yale University', url: 'https://epi.yale.edu', desc: 'Environmental Performance Index' },
  { name: 'UN DESA', url: 'https://publicadministration.un.org', desc: 'E-Government Development Index' },
  { name: 'Oxford Insights', url: 'https://oxfordinsights.com', desc: 'AI Readiness Index' },
  { name: 'Reporters Without Borders', url: 'https://rsf.org', desc: 'Press Freedom Index' },
  { name: 'ILO', url: 'https://ilo.org', desc: 'Unemployment Rate' }
];

const AboutPage = () => (
  <div className="page-wrapper">
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 900 }}>
      {/* Hero */}
      <div style={{ background: 'var(--color-bg-hero)', borderRadius: 16, padding: '3rem', marginBottom: '3rem', color: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇮🇳</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>IndiaLens</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: 600, margin: '0 auto' }}>
          AI Global Progress Dashboard — tracking India's position across the world's most important indices
        </p>
      </div>

      {/* Mission */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontWeight: 700 }}>🎯 Our Mission</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          IndiaLens is built to make India's global progress data accessible, visual, and actionable for everyone — 
          from students and researchers to policymakers and citizens. We aggregate rankings from 17+ global indices 
          and present them through interactive charts, AI-generated insights, and country comparisons.
        </p>
      </div>

      {/* Features */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>✨ Key Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            ['📊', 'Dashboard', '17+ global indices with India rankings'],
            ['🌍', 'World Map', 'Color-coded interactive global comparison'],
            ['🤖', 'AI Insights', 'AI-generated policy analysis and recommendations'],
            ['📈', 'Historical Trends', 'India\'s progress tracked over 5 years'],
            ['🔍', 'Compare', 'Side-by-side comparison with any country'],
            ['📰', 'News', 'Latest updates on India\'s global rankings'],
            ['❤️', 'Favorites', 'Save and monitor your key indicators'],
            ['📥', 'Export', 'Download data as PDF or CSV']
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{title}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>📚 Data Sources</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {SOURCES.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)', borderRadius: 8, border: '1px solid var(--color-border)', textDecoration: 'none' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>{s.name} ↗</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontWeight: 700 }}>🛠️ Technology Stack</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['React.js', 'React Router DOM v6', 'Chart.js', 'Axios', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcryptjs', 'react-simple-maps', 'jsPDF'].map(t => (
            <span key={t} className="badge badge-primary">{t}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Ready to explore India's global standing?</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">View Dashboard</Link>
          <Link to="/ai-insights" className="btn btn-outline">AI Insights</Link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default AboutPage;
