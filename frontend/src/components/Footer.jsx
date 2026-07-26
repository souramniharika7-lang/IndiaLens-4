import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--color-bg-footer)', color: 'rgba(255,255,255,0.8)', padding: '2.5rem 1.5rem 1.5rem', marginTop: '4rem' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>🇮🇳 IndiaLens</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.75 }}>AI-powered dashboard tracking India's global progress across 17+ international indices.</p>
        </div>
        <div>
          <h5 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>Navigation</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[['/', 'Home'], ['/dashboard', 'Dashboard'], ['/compare', 'Compare Countries'], ['/ai-insights', 'AI Insights'], ['/news', 'News']].map(([to, label]) => (
              <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h5 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>Categories</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[['economy', 'Economy'], ['society', 'Society'], ['governance', 'Governance'], ['technology', 'Technology'], ['education', 'Education']].map(([slug, label]) => (
              <Link key={slug} to={`/categories/${slug}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h5 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>Data Sources</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[['https://worldbank.org', 'World Bank'], ['https://undp.org', 'UNDP'], ['https://weforum.org', 'WEF'], ['https://wipo.int', 'WIPO'], ['https://transparency.org', 'Transparency Intl']].map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{label}</a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem', opacity: 0.65 }}>
        <span>© 2026 IndiaLens. Built for Lets Code Development Challenge 2026.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/about" style={{ color: 'inherit' }}>About</Link>
          <Link to="/contact" style={{ color: 'inherit' }}>Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
