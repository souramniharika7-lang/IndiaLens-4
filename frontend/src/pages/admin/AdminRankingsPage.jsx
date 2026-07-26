import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

const AdminRankingsPage = () => (
  <div className="page-wrapper">
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><Link to="/admin">Admin</Link> / Rankings</div>
      <h1 className="section-title">🏆 Manage Rankings</h1>
      <div className="card"><p>Rankings CRUD interface would go here. Rankings are seeded for all 10 countries across 17 indicators for 5 years.</p></div>
    </div>
    <Footer />
  </div>
);

export default AdminRankingsPage;
