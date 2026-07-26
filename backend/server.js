require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const seedDB = require('./utils/seed');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and logging middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/indicators', require('./routes/indicators'));
app.use('/api/countries', require('./routes/countries'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/rankings', require('./routes/rankings'));
app.use('/api/news', require('./routes/news'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date() } });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB, seed, then start server
connectDB().then(async () => {
  await seedDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 IndiaLens Backend running on http://localhost:${PORT}`);
    console.log(`   Admin login: admin@indialens.in / Admin@2026`);
    console.log(`   Demo login:  demo@indialens.in / Demo@2026\n`);
  });
});

module.exports = app;
