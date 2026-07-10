import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import Login from './auth/Login';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Editor from './Editor';
import Submissions from './Submissions';
import './app.css';

// / = landing (marketing, indexable) pour les visiteurs, dashboard pour les
// connectés — une seule URL d'entrée, pas de /app à retenir.
function HomeGate() {
  const { session, loading } = useAuth();
  if (loading) return null;
  return session ? <Dashboard /> : <Landing />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomeGate />} />
          <Route path="/editor/:id" element={<RequireAuth><Editor /></RequireAuth>} />
          <Route path="/submissions" element={<RequireAuth><Submissions /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
