import React from 'react';

const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
  <div style={{
    background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)',
    borderRadius: 12, padding: '2rem', textAlign: 'center', margin: '2rem 0'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
    <p style={{ color: 'var(--color-accent-danger)', fontWeight: 600, marginBottom: '0.5rem' }}>Error</p>
    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: onRetry ? '1rem' : 0 }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn btn-outline btn-sm">Try Again</button>
    )}
  </div>
);

export default ErrorMessage;
