import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import Login from './auth/Login';
import Landing from './Landing';
import './app.css';

// Active la palette sombre automatique (app.css) pour l'app builder seulement —
// l'entrée publique s.html ne pose pas cet attribut et reste claire.
document.documentElement.dataset.surface = 'app';

// Landing + Login restent dans le bundle initial (ce sont les points d'entrée,
// et la landing doit convertir vite). Les écrans authentifiés — plus lourds
// (éditeur, panneaux, couche données) — sont chargés à la demande : un visiteur
// de la landing ne télécharge plus le code de l'éditeur.
const Dashboard = lazy(() => import('./Dashboard'));
const Editor = lazy(() => import('./Editor'));
const Submissions = lazy(() => import('./Submissions'));
const Stats = lazy(() => import('./Stats'));
// Pages marketing indexables : séparées du bundle initial (un visiteur de la
// landing ne télécharge pas la galerie tant qu'il n'y va pas).
const ModelesGallery = lazy(() => import('./Modeles').then((m) => ({ default: m.ModelesGallery })));
const ModeleDetail = lazy(() => import('./Modeles').then((m) => ({ default: m.ModeleDetail })));

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomeGate />} />
            <Route path="/modeles" element={<ModelesGallery />} />
            <Route path="/modeles/:id" element={<ModeleDetail />} />
            <Route path="/editor/:id" element={<RequireAuth><Editor /></RequireAuth>} />
            <Route path="/submissions" element={<RequireAuth><Submissions /></RequireAuth>} />
            <Route path="/stats/:id" element={<RequireAuth><Stats /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
