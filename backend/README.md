# IndiaLens Backend API

Node.js + Express + MongoDB REST API for the IndiaLens dashboard.

## Setup

```bash
npm install
# Configure .env (already created with defaults)
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/indialens` |
| `JWT_SECRET` | Secret key for JWT signing | `indialens_super_secret_jwt_key_2026` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

## Seed Data

The database seeds automatically on first startup if empty:
- 10 countries (India, USA, China, Germany, Japan, UK, France, Brazil, Australia, Canada)
- 9 categories (Economy, Society, Governance, Technology, Education, Healthcare, Environment, Safety, Equality)
- 17 indicators with realistic India data
- 5 years of historical rankings (2019–2023) for all countries
- 7 sample news articles
- AI insights cache for all categories
- Admin user: admin@indialens.in / Admin@2026

## API Response Format

All responses follow this envelope:

```json
{ "success": true, "data": {} }
{ "success": false, "error": "message", "details": {} }
```
