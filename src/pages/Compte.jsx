import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Compte() {
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const { user, loading, isPro, email, profile, signOut, getAccessToken } = useAuth();
  const [portalBusy, setPortalBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Mon compte | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    return () => robots?.setAttribute("content", "index, follow");
  }, []);

  // Non connecté → redirection vers la connexion.
  useEffect(() => {
    if (!loading && !user) navigate("/connexion?next=/compte", { replace: true });
  }, [loading, user, navigate]);

  async function handleManageSubscription() {
    setPortalBusy(true); setError("");
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/stripe?action=portal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Impossible d'ouvrir le portail de gestion.");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setPortalBusy(false);
    }
  }

  async function handleSignOut() { await signOut(); navigate("/", { replace: true }); }

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
        Chargement…
      </div>
    );
  }

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" };
  const periodEnd = profile?.current_period_end ? new Date(profile.current_period_end).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Mon compte</span>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, margin: "16px 0 28px" }}>
          Mon compte
        </h1>

        {/* Identité */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>Connecté en tant que</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{email}</div>
        </div>

        {/* Abonnement */}
        <div style={{ ...card, marginBottom: 16, ...(isPro ? { border: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.06)" } : {}) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22, color: isPro ? "var(--gold)" : "var(--text-secondary)" }}>★</span>
            <div style={{ fontSize: 16, fontWeight: 600, color: isPro ? "var(--gold)" : "var(--text)" }}>
              {isPro ? "Abonnement Pro actif" : "Offre gratuite"}
            </div>
          </div>
          {isPro ? (
            <>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18, lineHeight: 1.6 }}>
                Toutes les fonctionnalités Pro sont débloquées sur tous vos appareils connectés.
                {periodEnd && <> Prochaine échéance : {periodEnd}.</>}
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={portalBusy}
                style={{ padding: "11px 20px", borderRadius: 10, background: "var(--gold)", color: "#1a1000", border: "none", fontSize: 14, fontWeight: 700, cursor: portalBusy ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                {portalBusy ? "Ouverture…" : "Gérer mon abonnement"}
              </button>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 10 }}>
                Résilier, changer de carte ou télécharger vos factures via le portail sécurisé Stripe.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18, lineHeight: 1.6 }}>
                Passez à Pro pour le rapport PDF professionnel, 50 simulations sauvegardées et le badge Pro.
              </p>
              <Link to="/pro" style={{ display: "inline-block", padding: "11px 20px", borderRadius: 10, background: "var(--gold)", color: "#1a1000", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Découvrir Pro — 2,99 €/mois
              </Link>
            </>
          )}
          {error && <p style={{ fontSize: 13, color: "#c0392b", marginTop: 12 }}>{error}</p>}
        </div>

        {/* Liens */}
        <div style={{ ...card, marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <Link to="/mes-simulations" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text)", fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>💾</span> Mes simulations sauvegardées
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          style={{ padding: "11px 20px", borderRadius: 10, background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
        >
          Se déconnecter
        </button>
      </div>
      <Footer />
    </div>
  );
}
