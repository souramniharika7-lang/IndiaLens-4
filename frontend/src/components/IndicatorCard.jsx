import React from 'react';
import { Link } from 'react-router-dom';

const IndicatorCard = ({ indicator, rank, score }) => (
  <Link to={`/indicators/${indicator.slug}`} className="indicator-card">
    <div className="indicator-card-left">
      <div className="indicator-card-name">{indicator.name}</div>
      <div className="indicator-card-meta">
        {indicator.category?.name && <span className="badge badge-primary">{indicator.category.name}</span>}
        {indicator.source?.name && <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{indicator.source.name}</span>}
      </div>
    </div>
    <div className="indicator-card-right">
      <div className="indicator-rank">#{rank ?? '—'}</div>
      <div className="indicator-rank-label">{score != null ? `Score: ${score}` : 'Global Rank'}</div>
    </div>
  </Link>
);

export default IndicatorCard;
