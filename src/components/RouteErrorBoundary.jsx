import { Component } from "react";
import { isChunkLoadError, reloadOnceForChunkError } from "../utils/chunkError.js";

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, chunkError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, chunkError: isChunkLoadError(error) };
  }

  // Ce boundary intercepte les erreurs AVANT l'ErrorBoundary global : il doit
  // donc lui-même recharger la page après un échec de chunk (nouveau déploiement).
  // Un simple « réessayer » n'y suffit pas : React.lazy garde le rejet en cache.
  componentDidCatch(error) {
    if (isChunkLoadError(error)) reloadOnceForChunkError();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isEn = typeof window !== 'undefined' && window.location.pathname.startsWith('/en');
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12, padding: 32,
        textAlign: "center", fontFamily: "'Hanken Grotesk', sans-serif",
        color: "var(--text)", background: "var(--bg)",
      }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 360, lineHeight: 1.6 }}>
          {isEn
            ? "This page could not be loaded. Please try again."
            : "Cette page n'a pas pu être chargée. Veuillez réessayer."}
        </p>
        <button
          onClick={() => (this.state.chunkError ? window.location.reload() : this.setState({ hasError: false }))}
          style={{
            padding: "9px 20px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--card-bg)", color: "var(--text)", fontSize: 14,
            cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif",
          }}
        >
          {isEn ? "Retry" : "Réessayer"}
        </button>
      </div>
    );
  }
}
