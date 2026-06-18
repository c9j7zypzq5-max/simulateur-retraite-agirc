import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const FEATURES_FREE = [
  "25+ simulateurs financiers",
  "8 simulations sauvegardées",
  "Export PDF basique",
  "Partage par lien",
];

const FEATURES_PRO = [
  "Tout le gratuit",
  "50 simulations sauvegardées",
  "Rapport PDF Pro illimité (page de couverture, tableaux enrichis, graphique)",
  "Badge Pro dans la navigation",
  "Priorité pour les futures fonctionnalités",
];

export default function Pro() {
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const { isPro, user, email: proEmail, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portalBusy, setPortalBusy] = useState(false);

  useEffect(() => {
    document.title = "Simfinly Pro — 2,99 €/mois | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots?.setAttribute('content', 'index, follow');
  }, []);

  async function handleSubscribe() {
    // Un compte est requis pour lier l'abonnement et permettre sa gestion.
    if (!user) { navigate("/connexion?next=/pro"); return; }
    setLoading(true);
    setError("");
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/stripe?action=create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Une erreur est survenue. Réessayez.");
      }
    } catch {
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

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

  const card = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "28px 28px",
  };

  const checkItem = (txt, pro = false) => (
    <div key={txt} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 16, flexShrink: 0, color: pro ? "var(--gold)" : "var(--text-secondary)" }}>{pro ? "★" : "○"}</span>
      <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{txt}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Simfinly Pro</span>
        </div>

        <div style={{ padding: "20px 0 36px", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(184,147,74,0.12)", border: "1px solid var(--border-gold)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 20,
            fontSize: 12, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.06em",
          }}>★ SIMFINLY PRO</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px,6vw,48px)", fontWeight: 700, color: "var(--text)", margin: "0 0 12px" }}>
            Des outils pensés pour<br />vos vraies décisions
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Simfinly reste 100% gratuit. Pro vous donne accès à plus de sauvegardes et à un rapport PDF professionnel que vous pouvez présenter à votre conseiller.
          </p>
        </div>

        {isPro ? (
          <div style={{ ...card, border: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.06)", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>★</span>
              <div>
                <div style={{ fontWeight: 600, color: "var(--gold)", fontSize: 16 }}>Vous êtes membre Pro</div>
                {proEmail && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{proEmail}</div>}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
              Votre abonnement est actif. Toutes les fonctionnalités Pro sont débloquées sur cet appareil.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/" style={{
                display: "inline-block", padding: "9px 18px",
                background: "var(--gold)", color: "#1a1000", borderRadius: 10,
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                Retour aux simulateurs
              </Link>
              <button
                onClick={handleManageSubscription}
                disabled={portalBusy}
                style={{ padding: "9px 18px", background: "none", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text-secondary)", cursor: portalBusy ? "not-allowed" : "pointer" }}
              >
                {portalBusy ? "Ouverture…" : "Gérer mon abonnement"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
            {/* Gratuit */}
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", marginBottom: 8 }}>GRATUIT</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>0 €</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>pour toujours</div>
              <div>{FEATURES_FREE.map(f => checkItem(f, false))}</div>
            </div>

            {/* Pro */}
            <div style={{ ...card, border: "1.5px solid var(--border-gold)", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 0, right: 0,
                background: "var(--gold)", color: "#1a1000",
                fontSize: 10, fontWeight: 700, padding: "4px 12px 4px 16px",
                borderBottomLeftRadius: 10, letterSpacing: "0.05em",
              }}>RECOMMANDÉ</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.06em", marginBottom: 8 }}>PRO</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>2,99 €</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>par mois · sans engagement</div>
              <div style={{ marginBottom: 20 }}>{FEATURES_PRO.map(f => checkItem(f, true))}</div>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", borderRadius: 10,
                  background: loading ? "var(--border)" : "var(--gold)",
                  color: loading ? "var(--text-secondary)" : "#1a1000",
                  border: "none", fontSize: 14, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading ? "Redirection…" : user ? "S'abonner — 2,99 €/mois" : "Se connecter pour s'abonner"}
              </button>
              {!user && (
                <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8, textAlign: "center" }}>
                  Un compte permet de gérer et résilier votre abonnement à tout moment.
                </p>
              )}
              {error && <p style={{ fontSize: 12, color: "#c0392b", marginTop: 8 }}>{error}</p>}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 16, color: "var(--text)" }}>
            Questions fréquentes
          </h2>
          {[
            ["Comment l'abonnement fonctionne-t-il ?", "Paiement mensuel par carte bancaire via Stripe. Sans engagement, résiliable à tout moment depuis le portail Stripe. Aucune donnée de carte n'est stockée sur nos serveurs."],
            ["L'accès Pro fonctionne-t-il sur plusieurs appareils ?", "Oui. Votre abonnement est lié à votre compte : connectez-vous sur n'importe quel appareil pour retrouver vos fonctionnalités Pro."],
            ["Le rapport PDF Pro est-il différent du gratuit ?", "Oui : il inclut une page de couverture, des tableaux alternés, le graphique intégré, une section \"À retenir\" enrichie, et un pied de page professionnel sur chaque page."],
            ["Puis-je annuler à tout moment ?", "Oui, sans frais. L'accès Pro reste actif jusqu'à la fin de la période payée."],
          ].map(([q, a]) => (
            <div key={q} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 500, color: "var(--text)", marginBottom: 6, fontSize: 14 }}>{q}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, textAlign: "center" }}>
          Paiement sécurisé par Stripe · Simulation indicative, non contractuelle · Conformité RGPD
        </p>
      </div>

      <Footer />
    </div>
  );
}
