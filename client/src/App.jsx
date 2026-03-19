import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import Help from './pages/Help';
import { getToken, getIsVerified } from './api';
import './index.css';

function ProtectedRoute({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  // Require verification for main app pages if not already on verify
  if (!getIsVerified() && window.location.pathname !== '/verify') return <Navigate to="/verify" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isVerifyPage = location.pathname === '/verify';
  const isAuthenticated = !!getToken();

  return (
    <>
      <main className="main-content">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/verify" element={isAuthenticated ? (getIsVerified() ? <Navigate to="/dashboard" replace /> : <Verify />) : <Navigate to="/login" replace />} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
