import { Component } from "react";
import { track } from "@vercel/analytics";

import { isChunkLoadError, reloadOnceForChunkError } from "../utils/chunkError.js";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    // Échec de chunk après un nouveau déploiement : un rechargement unique récupère
    // le nouvel index.html (et donc les bons noms de chunks). Garde anti-boucle.
    if (isChunkLoadError(error) && reloadOnceForChunkError()) return;
    // Remontée des erreurs réelles vers Sentry (si configuré) et Vercel Analytics.
    // Import dynamique : Sentry n'est ainsi jamais forcé dans le bundle critique
    // chargé sur chaque page, seulement téléchargé si une erreur survient réellement.
    import("@sentry/react")
      .then((Sentry) => { try { Sentry.captureException(error); } catch { /* Sentry indisponible */ } })
      .catch(() => { /* Sentry indisponible */ });
    try {
      track('client_error', {
        message: String(error?.message || error).slice(0, 200),
        name: String(error?.name || '').slice(0, 60),
        path: typeof window !== 'undefined' ? window.location.pathname : '',
      });
    } catch { /* analytics indisponible */ }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isEn = typeof window !== 'undefined' && window.location.pathname.startsWith('/en');
    const txt = isEn
      ? { title: 'Something went wrong', body: 'This page failed to load. This sometimes happens after a site update.', reload: 'Reload page', back: '← Back to home', href: '/en' }
      : { title: 'Une erreur est survenue', body: 'Le chargement de cette page a échoué. Cela arrive parfois après une mise à jour du site.', reload: 'Recharger la page', back: '← Retour à l\'accueil', href: '/' };
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600, margin: 0 }}>
          {txt.title}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 420, lineHeight: 1.6 }}>
          {txt.body}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid var(--border-gold)", background: "rgba(43,92,230,0.08)", color: "var(--gold)", fontSize: 14, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          {txt.reload}
        </button>
        <a href={txt.href} style={{ fontSize: 13, color: "var(--text-secondary)" }}>{txt.back}</a>
      </div>
    );
  }
}

