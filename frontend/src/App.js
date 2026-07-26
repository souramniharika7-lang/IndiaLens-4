import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { FilterProvider } from './context/FilterContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import IndicatorDetailPage from './pages/IndicatorDetailPage';
import CategoryPage from './pages/CategoryPage';
import CountryComparisonPage from './pages/CountryComparisonPage';
import WorldMapPage from './pages/WorldMapPage';
import HistoricalTrendsPage from './pages/HistoricalTrendsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfilePage from './pages/UserProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Category pages
import EconomyPage from './pages/categories/EconomyPage';
import SocietyPage from './pages/categories/SocietyPage';
import GovernancePage from './pages/categories/GovernancePage';
import TechnologyPage from './pages/categories/TechnologyPage';
import EducationPage from './pages/categories/EducationPage';
import HealthcarePage from './pages/categories/HealthcarePage';
import EnvironmentPage from './pages/categories/EnvironmentPage';
import SafetyPage from './pages/categories/SafetyPage';
import EqualityPage from './pages/categories/EqualityPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCountriesPage from './pages/admin/AdminCountriesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminIndicatorsPage from './pages/admin/AdminIndicatorsPage';
import AdminRankingsPage from './pages/admin/AdminRankingsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';

import './styles/global.css';
import './styles/responsive.css';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <DataProvider>
        <FilterProvider>
          <BrowserRouter>
            <Navbar />
            <ErrorBoundary>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/indicators/:slug" element={<IndicatorDetailPage />} />
                <Route path="/categories/:categorySlug" element={<CategoryPage />} />
                <Route path="/categories/economy" element={<EconomyPage />} />
                <Route path="/categories/society" element={<SocietyPage />} />
                <Route path="/categories/governance" element={<GovernancePage />} />
                <Route path="/categories/technology" element={<TechnologyPage />} />
                <Route path="/categories/education" element={<EducationPage />} />
                <Route path="/categories/healthcare" element={<HealthcarePage />} />
                <Route path="/categories/environment" element={<EnvironmentPage />} />
                <Route path="/categories/safety" element={<SafetyPage />} />
                <Route path="/categories/equality" element={<EqualityPage />} />
                <Route path="/compare" element={<CountryComparisonPage />} />
                <Route path="/world-map" element={<WorldMapPage />} />
                <Route path="/trends" element={<HistoricalTrendsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected routes */}
                <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                <Route path="/watchlists" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/countries" element={<AdminRoute><AdminCountriesPage /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
                <Route path="/admin/indicators" element={<AdminRoute><AdminIndicatorsPage /></AdminRoute>} />
                <Route path="/admin/rankings" element={<AdminRoute><AdminRankingsPage /></AdminRoute>} />
                <Route path="/admin/news" element={<AdminRoute><AdminNewsPage /></AdminRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </FilterProvider>
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
