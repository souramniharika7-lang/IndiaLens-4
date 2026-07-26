# 🇮🇳 IndiaLens – AI Global Progress Dashboard

A professional full-stack web application that tracks India's global rankings across 17+ international indices with AI-generated insights, interactive charts, and country comparisons.

**Built for the Lets Code Development Challenge 2026.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# backend/.env (already created with defaults)
MONGO_URI=mongodb://localhost:27017/indialens
JWT_SECRET=indialens_super_secret_jwt_key_2026
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### 3. Start Backend

```bash
cd backend
npm start
# Server starts at http://localhost:5000
# Database seeds automatically on first run
```

### 4. Start Frontend

```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## 🔐 Default Accounts

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@indialens.in     | Admin@2026  |
| User  | demo@indialens.in      | Demo@2026   |

---

## 📁 Project Structure

```
indialens/
├── backend/                 # Node.js + Express + MongoDB API
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route definitions
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth, admin, error handling
│   ├── utils/               # Seed script, API response helpers
│   └── server.js            # Entry point
│
└── frontend/                # React.js SPA
    └── src/
        ├── components/      # Reusable UI components
        ├── pages/           # 25+ page components
        ├── context/         # Auth, Theme, Filter, Data contexts
        ├── services/        # Axios API service modules
        ├── utils/           # CSV/PDF export utilities
        └── styles/          # Pure CSS stylesheets
```

---

## 🌐 Pages

| Page | Route |
|------|-------|
| Home | `/` |
| Dashboard | `/dashboard` |
| Indicator Detail | `/indicators/:slug` |
| Category (Economy) | `/categories/economy` |
| Category (Society) | `/categories/society` |
| Category (Governance) | `/categories/governance` |
| Category (Technology) | `/categories/technology` |
| Category (Education) | `/categories/education` |
| Category (Healthcare) | `/categories/healthcare` |
| Category (Environment) | `/categories/environment` |
| Category (Safety) | `/categories/safety` |
| Category (Equality) | `/categories/equality` |
| Country Comparison | `/compare` |
| World Map | `/world-map` |
| Historical Trends | `/trends` |
| AI Insights | `/ai-insights` |
| Search Results | `/search?q=` |
| News | `/news` |
| News Detail | `/news/:id` |
| Login | `/login` |
| Signup | `/signup` |
| User Profile | `/profile` |
| Favorites | `/favorites` |
| Watchlists | `/watchlists` |
| About | `/about` |
| Contact | `/contact` |
| Admin Dashboard | `/admin` |

---

## 📊 Tracked Indicators

1. GDP Rank — World Bank
2. GDP per Capita — IMF
3. GDP Growth Rate — World Bank
4. Inflation Rate — IMF
5. Unemployment Rate — ILO
6. Human Development Index — UNDP
7. Happiness Index — UN SDSN
8. Education Index — UNDP
9. Healthcare Index — Numbeo
10. Global Innovation Index — WIPO
11. AI Readiness Index — Oxford Insights
12. Corruption Perception Index — Transparency International
13. E-Government Development Index — UN DESA
14. Environmental Performance Index — Yale University
15. Global Peace Index — Institute for Economics & Peace
16. Gender Gap Index — World Economic Forum
17. Press Freedom Index — Reporters Without Borders

---

## 🛠️ Tech Stack

### Frontend
- React.js 18 (CRA)
- React Router DOM v6
- Chart.js + react-chartjs-2
- Axios
- react-simple-maps
- jsPDF
- Pure CSS (no Tailwind/Bootstrap)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- cors, helmet, morgan

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/indicators` | — | List indicators (supports `?q=&category=`) |
| GET | `/api/indicators/:slug` | — | Get indicator by slug |
| GET | `/api/countries` | — | List all countries |
| GET | `/api/categories` | — | List all categories |
| GET | `/api/categories/:slug` | — | Get category + indicators |
| GET | `/api/rankings` | — | List rankings (supports `?indicator=&country=&year=`) |
| GET | `/api/rankings/historical/:indicatorId/:countryId` | — | Historical time-series |
| GET | `/api/news` | — | List news (supports `?category=&limit=`) |
| GET | `/api/news/:id` | — | Get single article |
| GET | `/api/ai/insights/global` | — | Global AI insights |
| GET | `/api/ai/insights/category/:slug` | — | Category AI insights |
| GET | `/api/ai/insights/indicator/:slug` | — | Indicator AI insights |
| GET | `/api/users/me` | JWT | Get profile |
| PUT | `/api/users/me` | JWT | Update profile |
| GET | `/api/users/me/favorites` | JWT | Get favorites |
| POST | `/api/users/me/favorites/:id` | JWT | Add favorite |
| DELETE | `/api/users/me/favorites/:id` | JWT | Remove favorite |
| POST | `/api/countries` | Admin | Create country |
| PUT | `/api/countries/:id` | Admin | Update country |
| DELETE | `/api/countries/:id` | Admin | Delete country |
| POST | `/api/news` | Admin | Create article |
| DELETE | `/api/news/:id` | Admin | Delete article |

---

## ✨ Features

- 📊 17+ global indicator dashboards with India rankings
- 🌍 Interactive world map with color-coded rankings
- 🤖 AI-generated insights and recommendations
- 📈 Historical trend charts (2019–2023)
- 🔍 Real-time search with debouncing
- 🌓 Dark/light mode with localStorage persistence
- 📥 Export data as CSV and PDF
- ❤️ Favorites and watchlists for authenticated users
- 🔐 JWT authentication with role-based access
- ⚙️ Admin dashboard for content management
- 📱 Fully responsive (mobile, tablet, desktop)

---

## 📜 License

MIT License — Free to use for educational and competition purposes.
