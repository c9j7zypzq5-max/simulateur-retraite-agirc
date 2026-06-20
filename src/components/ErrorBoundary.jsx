import { Component } from "react";
import { track } from "@vercel/analytics";

// Détecte les erreurs de chargement de module/chunk (fréquentes quand un onglet
// ouvert avant un déploiement demande un ancien chunk au nom de fichier disparu).
function isChunkLoadError(error) {
  const msg = `${error?.name || ''} ${error?.message || ''}`;
  return /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically/i.test(msg);
}

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
    if (isChunkLoadError(error) && !sessionStorage.getItem('chunk_reloaded')) {
      sessionStorage.setItem('chunk_reloaded', '1');
      window.location.reload();
      return;
    }
    // Remontée légère des erreurs réelles (monitoring) via Vercel Analytics.
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

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600, margin: 0 }}>
          Une erreur est survenue
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 420, lineHeight: 1.6 }}>
          Le chargement de cette page a échoué. Cela arrive parfois après une mise à jour du site.
        </p>
        <button
          onClick={() => { sessionStorage.removeItem('chunk_reloaded'); window.location.reload(); }}
          style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.1)", color: "var(--gold)", fontSize: 14, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          Recharger la page
        </button>
        <a href="/" style={{ fontSize: 13, color: "var(--text-secondary)" }}>← Retour à l'accueil</a>
      </div>
    );
  }
}

// Réinitialise le garde anti-boucle après un chargement réussi.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => sessionStorage.removeItem('chunk_reloaded'), 4000);
  });
}
