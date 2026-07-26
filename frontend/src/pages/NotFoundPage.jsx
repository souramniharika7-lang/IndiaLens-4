import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <div className="fade-in" style={{ padding: '2rem' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🔭</div>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: 400 }}>
          This page doesn't exist. It may have been moved or the URL might be incorrect.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn btn-outline">← Go Back</button>
          <Link to="/" className="btn btn-primary">🏠 Home</Link>
          <Link to="/dashboard" className="btn btn-secondary">📊 Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
