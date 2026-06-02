import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "28px 24px 40px",
      marginTop: 60,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo-mark.svg" alt="" width={24} height={24} style={{ display: "block", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>
            mesimulateurs.fr
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link to="/blog" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            Blog
          </Link>
          <Link to="/a-propos" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            À propos
          </Link>
          <Link to="/mentions-legales" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            Mentions légales
          </Link>
          <Link to="/politique-de-confidentialite" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            Politique de confidentialité
          </Link>
          <a href="mailto:contact@mesimulateurs.fr" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            Contact
          </a>
        </nav>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
          © 2026 mesimulateurs.fr — Simulation non contractuelle
        </p>
      </div>
    </footer>
  );
}
