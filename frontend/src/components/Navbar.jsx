import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

const CATEGORIES = [
  { slug: 'economy', label: 'Economy' }, { slug: 'society', label: 'Society' },
  { slug: 'governance', label: 'Governance' }, { slug: 'technology', label: 'Technology' },
  { slug: 'education', label: 'Education' }, { slug: 'healthcare', label: 'Healthcare' },
  { slug: 'environment', label: 'Environment' }, { slug: 'safety', label: 'Safety' },
  { slug: 'equality', label: 'Equality' }
];

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          <span className="brand-dot" />
          <span>🇮🇳 IndiaLens</span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
          <li><NavLink to="/dashboard" onClick={close}>Dashboard</NavLink></li>
          <li className="nav-dropdown" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <NavLink to="/categories/economy" onClick={close}>Categories ▾</NavLink>
            {catOpen && (
              <div className="nav-dropdown-menu">
                {CATEGORIES.map(c => (
                  <Link key={c.slug} to={`/categories/${c.slug}`} onClick={() => { close(); setCatOpen(false); }}>{c.label}</Link>
                ))}
              </div>
            )}
          </li>
          <li><NavLink to="/compare" onClick={close}>Compare</NavLink></li>
          <li><NavLink to="/world-map" onClick={close}>World Map</NavLink></li>
          <li><NavLink to="/trends" onClick={close}>Trends</NavLink></li>
          <li><NavLink to="/ai-insights" onClick={close}>AI Insights</NavLink></li>
          <li><NavLink to="/news" onClick={close}>News</NavLink></li>
          <li><NavLink to="/about" onClick={close}>About</NavLink></li>
          {currentUser ? (
            <>
              <li><NavLink to="/profile" onClick={close}>👤 Profile</NavLink></li>
              <li><NavLink to="/favorites" onClick={close}>❤️ Favorites</NavLink></li>
              {isAdmin && <li><NavLink to="/admin" onClick={close}>⚙️ Admin</NavLink></li>}
              <li><button onClick={handleLogout} style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--color-primary)', border: 'none', padding: '0.45rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500 }}>Logout</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" onClick={close}>Login</NavLink></li>
              <li><NavLink to="/signup" onClick={close} style={{ background: 'var(--color-primary)', padding: '0.45rem 0.9rem', borderRadius: 6, color: '#fff !important' }}>Sign Up</NavLink></li>
            </>
          )}
        </ul>

        <div className="navbar-right">
          <ThemeToggle />
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
