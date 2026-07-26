/**
 * IndiaLens – Standalone server using in-memory data (no MongoDB required).
 * Run with: node server-local.js
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('./utils/localDB');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'indialens_super_secret_jwt_key_2026';
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://indialens-frontend.onrender.com',
    /\.onrender\.com$/
  ],
  credentials: true
}));
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────
const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fail = (res, error, status = 400) => res.status(status).json({ success: false, error });

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return fail(res, 'Authentication required', 401);
  try { req.user = jwt.verify(header.split(' ')[1], JWT_SECRET); next(); }
  catch { return fail(res, 'Invalid or expired token', 401); }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return fail(res, 'Insufficient permissions', 403);
  next();
};

// ── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email?.toLowerCase());
  if (!user) return fail(res, 'Invalid email or password', 401);
  const match = await bcrypt.compare(password, user.password);
  if (!match) return fail(res, 'Invalid email or password', 401);
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return ok(res, { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return fail(res, 'All fields required', 400);
  if (password.length < 8) return fail(res, 'Validation failed', 400, { password: 'Min 8 characters' });
  if (db.users.find(u => u.email === email.toLowerCase())) return fail(res, 'Email already in use', 409);
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { _id: `u${Date.now()}`, username, email: email.toLowerCase(), password: hashed, role: 'user', favorites: [], watchlists: [], createdAt: new Date() };
  db.users.push(newUser);
  const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  return ok(res, { token, user: { id: newUser._id, username, email, role: 'user' } }, 201);
});

// ── CATEGORIES ────────────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => ok(res, db.categories));
app.get('/api/categories/:slug', (req, res) => {
  const cat = db.categories.find(c => c.slug === req.params.slug);
  if (!cat) return fail(res, 'Category not found', 404);
  const inds = db.indicators.filter(i => i.category.slug === req.params.slug);
  return ok(res, { category: cat, indicators: inds });
});

// ── COUNTRIES ─────────────────────────────────────────────────────────────────
app.get('/api/countries', (req, res) => ok(res, db.countries));
app.get('/api/countries/:code', (req, res) => {
  const c = db.countries.find(c => c.code === req.params.code.toUpperCase());
  if (!c) return fail(res, 'Country not found', 404);
  return ok(res, c);
});
app.post('/api/countries', auth, adminOnly, (req, res) => {
  const c = { _id: `c${Date.now()}`, ...req.body };
  db.countries.push(c); return ok(res, c, 201);
});
app.put('/api/countries/:id', auth, adminOnly, (req, res) => {
  const i = db.countries.findIndex(c => c._id === req.params.id);
  if (i === -1) return fail(res, 'Not found', 404);
  db.countries[i] = { ...db.countries[i], ...req.body };
  return ok(res, db.countries[i]);
});
app.delete('/api/countries/:id', auth, adminOnly, (req, res) => {
  const i = db.countries.findIndex(c => c._id === req.params.id);
  if (i === -1) return fail(res, 'Not found', 404);
  db.countries.splice(i, 1); return ok(res, { message: 'Deleted' });
});

// ── INDICATORS ────────────────────────────────────────────────────────────────
app.get('/api/indicators', (req, res) => {
  let inds = [...db.indicators];
  const { category, q } = req.query;
  if (category) inds = inds.filter(i => i.category._id === category || i.category.slug === category);
  if (q) inds = inds.filter(i => i.name.toLowerCase().includes(q.toLowerCase()) || i.description?.toLowerCase().includes(q.toLowerCase()));
  return ok(res, inds);
});
app.get('/api/indicators/:slug', (req, res) => {
  const ind = db.indicators.find(i => i.slug === req.params.slug);
  if (!ind) return fail(res, 'Indicator not found', 404);
  return ok(res, ind);
});

// ── RANKINGS ──────────────────────────────────────────────────────────────────
app.get('/api/rankings', (req, res) => {
  const { indicator, country, year } = req.query;
  const results = [];

  db.indicators.forEach(ind => {
    if (indicator && ind._id !== indicator) return;
    db.countries.forEach(c => {
      if (country && c._id !== country) return;
      // Get ranking data
      const indRankData = db.allRankingsData[ind._id];
      if (indRankData && indRankData[c._id]) {
        const [rank, score] = indRankData[c._id];
        results.push({ _id: `r_${ind._id}_${c._id}`, indicator: ind, country: c, year: 2026, rank, score, totalCountries: 195 });
      } else if (c.code === 'IND' && db.indiaRankings2023[ind._id]) {
        const { rank, score, totalCountries } = db.indiaRankings2023[ind._id];
        results.push({ _id: `r_${ind._id}_${c._id}`, indicator: ind, country: c, year: 2026, rank, score, totalCountries });
      }
    });
  });

  return ok(res, results);
});

app.get('/api/rankings/historical/:indicatorId/:countryId', (req, res) => {
  const { indicatorId, countryId } = req.params;
  const ind = db.indicators.find(i => i._id === indicatorId);
  const country = db.countries.find(c => c._id === countryId);
  if (!ind || !country) return fail(res, 'Not found', 404);

  const dataPoints = db.indiaHistorical[indicatorId];
  if (!dataPoints) {
    // Generate synthetic historical data from 2023 values
    const r2023 = db.indiaRankings2023[indicatorId];
    if (!r2023) return fail(res, 'No historical data', 404);
    const synth = [2021, 2022, 2023, 2024, 2025, 2026].map((year, i) => ({
      year, rank: Math.max(1, r2023.rank + (5 - i) * 2), score: parseFloat((r2023.score * (0.94 + i * 0.012)).toFixed(3))
    }));
    return ok(res, { indicator: ind, country, dataPoints: synth });
  }
  return ok(res, { indicator: ind, country, dataPoints });
});

// ── NEWS ──────────────────────────────────────────────────────────────────────
app.get('/api/news', (req, res) => {
  let articles = [...db.news];
  const { category, limit } = req.query;
  if (category) articles = articles.filter(a => a.category?._id === category);
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  if (limit) articles = articles.slice(0, parseInt(limit));
  return ok(res, articles);
});
app.get('/api/news/:id', (req, res) => {
  const a = db.news.find(n => n._id === req.params.id);
  if (!a) return fail(res, 'Not found', 404);
  return ok(res, a);
});
app.post('/api/news', auth, adminOnly, (req, res) => {
  if (!req.body.headline) return fail(res, 'Headline required', 400);
  const article = { _id: `n${Date.now()}`, ...req.body, publishedAt: new Date(), createdBy: req.user.id };
  db.news.push(article); return ok(res, article, 201);
});
app.put('/api/news/:id', auth, adminOnly, (req, res) => {
  const i = db.news.findIndex(n => n._id === req.params.id);
  if (i === -1) return fail(res, 'Not found', 404);
  db.news[i] = { ...db.news[i], ...req.body }; return ok(res, db.news[i]);
});
app.delete('/api/news/:id', auth, adminOnly, (req, res) => {
  const i = db.news.findIndex(n => n._id === req.params.id);
  if (i === -1) return fail(res, 'Not found', 404);
  db.news.splice(i, 1); return ok(res, { message: 'Deleted' });
});

// ── AI INSIGHTS ───────────────────────────────────────────────────────────────
app.get('/api/ai/insights/global', (req, res) => ok(res, db.aiInsights.global));
app.get('/api/ai/insights/category/:slug', (req, res) => {
  const ins = db.aiInsights[req.params.slug];
  if (!ins) return fail(res, 'No insights for this category', 404);
  return ok(res, ins);
});
app.get('/api/ai/insights/indicator/:slug', (req, res) => {
  const ins = db.aiInsights[req.params.slug] || db.aiInsights.global;
  return ok(res, ins);
});
app.post('/api/ai/insights/refresh', auth, adminOnly, (req, res) => ok(res, { message: 'Insights refreshed' }));

// ── USERS ─────────────────────────────────────────────────────────────────────
app.get('/api/users/me', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  if (!u) return fail(res, 'Not found', 404);
  const { password, ...safeUser } = u;
  return ok(res, { ...safeUser, favorites: u.favorites.map(fid => db.indicators.find(i => i._id === fid)).filter(Boolean) });
});
app.put('/api/users/me', auth, async (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  if (!u) return fail(res, 'Not found', 404);
  if (req.body.username) u.username = req.body.username;
  if (req.body.password) { if (req.body.password.length < 8) return fail(res, 'Min 8 chars', 400); u.password = await bcrypt.hash(req.body.password, 10); }
  return ok(res, { id: u._id, username: u.username, email: u.email });
});
app.get('/api/users/me/favorites', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  if (!u) return fail(res, 'Not found', 404);
  return ok(res, u.favorites.map(fid => db.indicators.find(i => i._id === fid)).filter(Boolean));
});
app.post('/api/users/me/favorites/:indicatorId', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  if (!u.favorites.includes(req.params.indicatorId)) u.favorites.push(req.params.indicatorId);
  return ok(res, { message: 'Added' });
});
app.delete('/api/users/me/favorites/:indicatorId', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  u.favorites = u.favorites.filter(id => id !== req.params.indicatorId);
  return ok(res, { message: 'Removed' });
});
app.get('/api/users/me/watchlists', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  return ok(res, u?.watchlists || []);
});
app.post('/api/users/me/watchlists', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  if (!req.body.name) return fail(res, 'Name required', 400);
  u.watchlists.push({ name: req.body.name, indicators: [] });
  return ok(res, u.watchlists, 201);
});
app.post('/api/users/me/watchlists/:name/indicators/:id', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  const wl = u.watchlists.find(w => w.name === req.params.name);
  if (!wl) return fail(res, 'Watchlist not found', 404);
  if (!wl.indicators.includes(req.params.id)) wl.indicators.push(req.params.id);
  return ok(res, wl);
});
app.delete('/api/users/me/watchlists/:name/indicators/:id', auth, (req, res) => {
  const u = db.users.find(u => u._id === req.user.id);
  const wl = u.watchlists.find(w => w.name === req.params.name);
  if (!wl) return fail(res, 'Watchlist not found', 404);
  wl.indicators = wl.indicators.filter(i => i !== req.params.id);
  return ok(res, wl);
});

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => ok(res, { status: 'ok', mode: 'local-memory', timestamp: new Date() }));

app.use((req, res) => fail(res, 'Route not found', 404));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ success: false, error: 'Internal server error' }); });

app.listen(PORT, () => {
  console.log('\n🚀 IndiaLens Backend (Local Mode) running on http://localhost:' + PORT);
  console.log('   ✅ No MongoDB required — using in-memory data store');
  console.log('   📊 17 indicators, 10 countries, 9 categories loaded');
  console.log('\n   Admin login: admin@indialens.in / Admin@2026');
  console.log('   Demo login:  demo@indialens.in / Demo@2026\n');
});
