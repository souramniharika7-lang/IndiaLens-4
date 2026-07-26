import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Debounced search bar. Fires navigation to /search?q= after 300ms.
 * Minimum 2 characters required.
 */
const SearchBar = ({ placeholder = 'Search indicators...', className = '' }) => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (value.length < 2) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [value, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.length >= 2) navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`hero-search ${className}`} style={{ display: 'flex', gap: '0.75rem' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search indicators"
      />
      <button type="submit" className="btn btn-primary" disabled={value.length < 2}>
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
