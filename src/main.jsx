import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import * as Sentry from '@sentry/react'
import './styles.css'
import App from './App.jsx'

// Sentry : actif uniquement si VITE_SENTRY_DSN est défini (évite les erreurs en dev)
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [
      Sentry.browserTracingIntegration(),
      // Confidentialité : on masque tout le texte et on bloque les médias dans
      // les rejeux de session — les pages contiennent des données financières
      // saisies par l'utilisateur (salaire, patrimoine). RGPD by design.
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
    ignoreErrors: [
      'ChunkLoadError', 'Loading chunk', 'dynamically imported module',
      'ResizeObserver loop', 'Non-Error promise rejection',
    ],
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
