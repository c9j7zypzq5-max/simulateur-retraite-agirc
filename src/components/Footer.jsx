import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "32px 16px 48px",
      marginTop: 60,
    }}>
      <div style={{
        maxWidth: 760,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}>
        <p style={{ fontSize: 12, color: "#334155", letterSpacing: "0.04em" }}>
          © 2026 Simulateur Retraite Agirc-Arrco — Simulation non contractuelle
        </p>
        <nav style={{ display: "flex", gap: 24 }}>
          <Link to="/mentions-legales" style={{ fontSize: 12, color: "#475569", textDecoration: "none", letterSpacing: "0.04em" }}>
            Mentions légales
          </Link>
          <Link to="/politique-de-confidentialite" style={{ fontSize: 12, color: "#475569", textDecoration: "none", letterSpacing: "0.04em" }}>
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
