import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article }) => {
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  return (
    <div className="news-card">
      {article.category?.name && <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{article.category.name}</span>}
      <div className="news-card-headline">
        <Link to={`/news/${article._id}`}>{article.headline}</Link>
      </div>
      {article.summary && <div className="news-card-summary">{article.summary}</div>}
      <div className="news-card-meta">
        {date && <span>📅 {date}</span>}
        {article.sourceName && <span>📰 {article.sourceName}</span>}
        <Link to={`/news/${article._id}`} style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Read more →</Link>
      </div>
    </div>
  );
};

export default NewsCard;
