import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PresentationsListPage from './pages/PresentationsListPage';
import PresentationPage from './pages/PresentationPage';
import CompanyPage from './pages/CompanyPage';
import CompanyPresentationsPage from './pages/CompanyPresentationsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import MaDecksPage from './pages/MaDecksPage';
import MaDeckViewerPage from './pages/MaDeckViewerPage';
import MigrationPage from './pages/MigrationPage';
import SequoiaPresentationPage from './pages/SequoiaPresentationPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import TemplatesPage from './pages/TemplatesPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="presentations" element={<PresentationsListPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="presentation/:id" element={<PresentationPage />} />
          <Route path="sequoia/:id" element={<SequoiaPresentationPage />} />
          <Route path="company/:symbol" element={<CompanyPage />} />
          <Route path="company/:symbol/presentations" element={<CompanyPresentationsPage />} />
          <Route path="ma-decks" element={<MaDecksPage />} />
          <Route path="ma-decks/:id" element={<MaDeckViewerPage />} />
          <Route path="admin" element={<AdminLoginPage />} />
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin/migration" element={<MigrationPage />} />
          
          {/* Slidebook specific routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="auth/:mode" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;