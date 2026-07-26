import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon, label, value, rank, slug }) => {
  const navigate = useNavigate();
  return (
    <div className="stat-card" onClick={() => slug && navigate(`/indicators/${slug}`)} role={slug ? 'button' : undefined} tabIndex={slug ? 0 : undefined}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {rank && <div className="stat-card-rank">Global Rank #{rank}</div>}
    </div>
  );
};

export default StatCard;
