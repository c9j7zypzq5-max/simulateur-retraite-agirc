import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";
import { useNoIndex } from "../hooks/useNoIndex.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const UNLOCKED = {
  fr: [
    "50 simulations sauvegardées (vs 8)",
    "Rapport PDF Pro inclus sur tous les simulateurs",
    "Badge Pro dans la navigation",
  ],
  en: [
    "50 saved simulations (vs 8)",
    "Pro PDF report included on all calculators",
    "Pro badge in the navigation",
  ],
};

export default function MerciPro() {
  const [theme, setTheme] = useTheme();
  useNoIndex();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const { refreshProfile, isPro } = useAuth();
  const { t, locale } = useTranslation();

  const [status, setStatus] = useState("verifying"); // verifying | ok | error
  const [activatedEmail, setActivatedEmail] = useState("");
  const pollRef = useRef(null);
  const isPendingRef = useRef(false);

  useEffect(() => {
    document.title = t("merciPro.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots?.setAttribute('content', 'index, follow');
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const SESSION_ID_RE = /^cs_(test|live)_[a-zA-Z0-9]{10,}$/;

  useEffect(() => {
    if (!sessionId || !SESSION_ID_RE.test(sessionId)) { setStatus("error"); return; }

    fetch(`/api/stripe?action=verify-subscription&session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.active) {
          setActivatedEmail(data.email || "");
          setStatus("ok");
          // Poll refreshProfile jusqu'à isPro confirmé (max 10 × 2s)
          let attempts = 0;
          pollRef.current = setInterval(async () => {
            if (isPendingRef.current) return;
            isPendingRef.current = true;
            attempts++;
            try { await refreshProfile(); } finally { isPendingRef.current = false; }
            if (attempts >= 10) { clearInterval(pollRef.current); pollRef.current = null; }
          }, 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPro && pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, [isPro]);

  const homePath = localePath("/", locale);
  const proPath = localePath("/pro", locale);
  const unlockedItems = UNLOCKED[locale] || UNLOCKED.fr;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 16px 80px", textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 600, marginBottom: 12 }}>
              {t("merciPro.verifyingTitle")}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("merciPro.verifyingDesc")}</p>
          </>
        )}

        {status === "ok" && (
          <>
            <div style={{ fontSize: 56, marginBottom: 20 }}>★</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>
              {t("merciPro.okTitle")}
            </h1>
            {activatedEmail && (
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>{activatedEmail}</p>
            )}
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              {t("merciPro.activeDesc")}
            </p>

            <div style={{
              background: "rgba(184,147,74,0.08)", border: "1px solid var(--border-gold)",
              borderRadius: 14, padding: "20px 24px", marginBottom: 32, textAlign: "left",
            }}>
              {unlockedItems.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(184,147,74,0.15)" }}>
                  <span style={{ color: "var(--gold)", fontSize: 16, flexShrink: 0 }}>★</span>
                  <span style={{ fontSize: 14, color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to={homePath} style={{
                display: "inline-block", padding: "12px 24px", borderRadius: 10,
                background: "var(--gold)", color: "#1a1000",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}>
                {t("merciPro.discoverSims")}
              </Link>
              <Link to={proPath} style={{
                display: "inline-block", padding: "12px 22px", borderRadius: 10,
                background: "var(--card-bg)", border: "1px solid var(--border)",
                color: "var(--text)", fontSize: 14, textDecoration: "none",
              }}>
                {t("merciPro.manageSubscription")}
              </Link>
            </div>

            <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 32, lineHeight: 1.6 }}>
              {t("merciPro.accountNote")}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 600, marginBottom: 12 }}>
              {t("merciPro.errorTitle")}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              {t("merciPro.errorDesc")}
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
                cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", marginRight: 10,
              }}
            >
              {t("merciPro.retry")}
            </button>
            <Link to={proPath} style={{
              display: "inline-block", padding: "12px 22px", borderRadius: 10,
              background: "var(--card-bg)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 14, textDecoration: "none",
            }}>
              {t("merciPro.back")}
            </Link>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
