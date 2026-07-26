import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import axiosInstance from '../axiosInstance';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/news/${id}`)
      .then(res => setArticle(res.data.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;
  if (!article) return <div className="page-wrapper"><div className="container" style={{ paddingTop: '2rem' }}><p>Article not found. <Link to="/news">Back to News</Link></p></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 800 }}>
        <Link to="/news" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>← Back to News</Link>
        {article.category?.name && <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>{article.category.name}</span>}
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>{article.headline}</h1>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {article.publishedAt && <span>📅 {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          {article.sourceName && <span>📰 {article.sourceName}</span>}
        </div>
        {article.summary && <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic', borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>{article.summary}</p>}
        {article.content && <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{article.content}</div>}
        {article.sourceUrl && <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Official Source</p>
          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Read Full Article ↗</a>
        </div>}
      </div>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;
