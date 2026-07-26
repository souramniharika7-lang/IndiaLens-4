import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

const AdminIndicatorsPage = () => (
  <div className="page-wrapper">
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><Link to="/admin">Admin</Link> / Indicators</div>
      <h1 className="section-title">📊 Manage Indicators</h1>
      <div className="card"><p>Indicator CRUD interface would go here. For MVP, indicators are managed via seed data.</p></div>
    </div>
    <Footer />
  </div>
);

export default AdminIndicatorsPage;
