import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrackerPage from './pages/TrackerPage';
import CommunityPage from './pages/CommunityPage';
import JobsPage from './pages/JobsPage';
import AlumniPage from './pages/AlumniPage';
import AIAnalyzerPage from './pages/AIAnalyzerPage';

function AppRoutes() {
  const { isLoggedIn, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  if (!isLoggedIn) return <LoginPage />;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: '#e0e0e0',
    }}>
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} style={{
        position: 'fixed', top: 16, left: 16, zIndex: 900,
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(26,26,46,0.95)', border: '1px solid rgba(255,215,0,0.2)',
        color: '#FFD700', fontSize: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}>☰</button>

      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={isAdmin ? <AdminDashboard /> : <Dashboard />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/ai-analyzer" element={<AIAnalyzerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
