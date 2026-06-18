import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const UNLOCKED = [
  "50 simulations sauvegardées (vs 8)",
  "Rapport PDF Pro inclus sur tous les simulateurs",
  "Badge Pro dans la navigation",
];

export default function MerciPro() {
  const [theme, setTheme] = useTheme();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const { activatePro } = useAuth();

  const [status, setStatus] = useState("verifying"); // verifying | ok | error
  const [activatedEmail, setActivatedEmail] = useState("");

  useEffect(() => {
    document.title = "Bienvenue chez Simfinly Pro | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots?.setAttribute('content', 'index, follow');
  }, []);

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    fetch(`/api/verify-subscription?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.active) {
          activatePro(data.email || "");
          setActivatedEmail(data.email || "");
          setStatus("ok");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 16px 80px", textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, marginBottom: 12 }}>
              Activation de votre abonnement…
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Quelques secondes.</p>
          </>
        )}

        {status === "ok" && (
          <>
            <div style={{ fontSize: 56, marginBottom: 20 }}>★</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>
              Bienvenue dans Simfinly Pro
            </h1>
            {activatedEmail && (
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>{activatedEmail}</p>
            )}
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Votre abonnement est actif. Les fonctionnalités suivantes sont débloquées sur cet appareil :
            </p>

            <div style={{
              background: "rgba(184,147,74,0.08)", border: "1px solid var(--border-gold)",
              borderRadius: 14, padding: "20px 24px", marginBottom: 32, textAlign: "left",
            }}>
              {UNLOCKED.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(184,147,74,0.15)" }}>
                  <span style={{ color: "var(--gold)", fontSize: 16, flexShrink: 0 }}>★</span>
                  <span style={{ fontSize: 14, color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/" style={{
                display: "inline-block", padding: "12px 24px", borderRadius: 10,
                background: "var(--gold)", color: "#1a1000",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}>
                Découvrir les simulateurs
              </Link>
              <Link to="/pro" style={{
                display: "inline-block", padding: "12px 22px", borderRadius: 10,
                background: "var(--card-bg)", border: "1px solid var(--border)",
                color: "var(--text)", fontSize: 14, textDecoration: "none",
              }}>
                Gérer mon abonnement
              </Link>
            </div>

            <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 32, lineHeight: 1.6 }}>
              Pour accéder à vos fonctionnalités Pro sur un autre appareil, ouvrez l'email de confirmation Stripe
              et cliquez sur le lien de cette page.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, marginBottom: 12 }}>
              Activation impossible
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              L'abonnement n'a pas pu être vérifié. Si vous venez de vous abonner, patientez quelques secondes et rechargez la page. Sinon, contactez-nous avec votre ID de session.
            </p>
            {sessionId && (
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 20, fontFamily: "monospace" }}>
                ID : {sessionId}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 22px", borderRadius: 10,
                background: "var(--gold)", color: "#1a1000",
                border: "none", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginRight: 10,
              }}
            >
              Réessayer
            </button>
            <Link to="/pro" style={{
              display: "inline-block", padding: "12px 22px", borderRadius: 10,
              background: "var(--card-bg)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 14, textDecoration: "none",
            }}>
              Retour
            </Link>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
