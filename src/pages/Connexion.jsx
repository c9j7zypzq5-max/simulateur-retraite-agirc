import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 0 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41 36.5 44 30.8 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
);

export default function Connexion() {
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, isConfigured, signUp, signIn, signInGoogle, resetPassword } = useAuth();
  const { t, locale } = useTranslation();

  const next = params.get("next") || localePath("/compte", locale);
  const [mode, setMode] = useState("signin"); // signin | signup | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = t("auth.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    return () => robots?.setAttribute("content", "index, follow");
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (user) navigate(next, { replace: true }); }, [user, next, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "reset") {
        const { error } = await resetPassword(email);
        if (error) setError(error.message);
        else setNotice(t("auth.noticeReset"));
        return;
      }
      const fn = mode === "signup" ? signUp : signIn;
      const { data, error } = await fn(email, password);
      if (error) { setError(error.message); return; }
      if (mode === "signup" && !data?.session) {
        setNotice(t("auth.noticeVerify"));
        setMode("signin");
        return;
      }
      navigate(next, { replace: true });
    } catch {
      setError(locale === "en" ? "An error occurred. Please try again." : "Une erreur est survenue. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true); setError("");
    const { error } = await signInGoogle();
    if (error) { setError(error.message); setBusy(false); }
  }

  const legalPath = (path) => localePath(path, locale);

  const input = {
    width: "100%", padding: "11px 13px", borderRadius: 10,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text)", fontSize: 14, marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  const title = mode === "signup" ? t("auth.titleSignup") : mode === "reset" ? t("auth.titleReset") : t("auth.titleSignin");
  const subtitle = mode === "signup" ? t("auth.subtitleSignup") : mode === "reset" ? t("auth.subtitleReset") : t("auth.subtitleSignin");
  const submitLabel = busy ? "…" : mode === "signup" ? t("auth.submitSignup") : mode === "reset" ? t("auth.submitReset") : t("auth.submitSignin");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 16px 80px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          {title}
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
          {subtitle}
        </p>

        {!isConfigured && (
          <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#c0392b", marginBottom: 20 }}>
            {t("auth.notConfigured")}
          </div>
        )}

        {mode !== "reset" && (
          <>
            <button
              onClick={handleGoogle}
              disabled={busy || !isConfigured}
              style={{
                width: "100%", padding: "11px", borderRadius: 10, marginBottom: 18,
                background: "var(--card-bg)", border: "1px solid var(--border)",
                color: "var(--text)", fontSize: 14, fontWeight: 500,
                cursor: busy ? "not-allowed" : "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 10,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <GoogleIcon /> {t("auth.google")}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 18px", color: "var(--text-secondary)", fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} /> {t("auth.or")} <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={input} />
          {mode !== "reset" && (
            <input type="password" placeholder={t("auth.passwordPlaceholder")} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} style={input} />
          )}
          <button
            type="submit"
            disabled={busy || !isConfigured}
            style={{
              width: "100%", padding: "12px", borderRadius: 10,
              background: busy ? "var(--border)" : "var(--gold)",
              color: busy ? "var(--text-secondary)" : "#1a1000",
              border: "none", fontSize: 14, fontWeight: 700,
              cursor: busy ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {submitLabel}
          </button>
        </form>

        {error && <p style={{ fontSize: 13, color: "#c0392b", marginTop: 12, textAlign: "center" }}>{error}</p>}
        {notice && <p style={{ fontSize: 13, color: "var(--gold)", marginTop: 12, textAlign: "center", lineHeight: 1.6 }}>{notice}</p>}

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-secondary)", lineHeight: 2 }}>
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("reset"); setError(""); }} style={linkBtn}>{t("auth.forgotPassword")}</button><br />
              {t("auth.noAccount")} <button onClick={() => { setMode("signup"); setError(""); }} style={linkBtn}>{t("auth.createAccount")}</button>
            </>
          )}
          {mode === "signup" && (<>{t("auth.hasAccount")} <button onClick={() => { setMode("signin"); setError(""); }} style={linkBtn}>{t("auth.submitSignin")}</button></>)}
          {mode === "reset" && (<button onClick={() => { setMode("signin"); setError(""); }} style={linkBtn}>{t("auth.backToSignin")}</button>)}
        </div>

        <p style={{ marginTop: 28, fontSize: 11, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.6 }}>
          {t("auth.terms")} <Link to={legalPath("/mentions-legales")} style={{ color: "var(--gold)" }}>{t("auth.termsLink")}</Link> {locale === "en" ? "and our" : "et notre"} <Link to={legalPath("/politique-de-confidentialite")} style={{ color: "var(--gold)" }}>{t("auth.privacyLink")}</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
}

const linkBtn = {
  background: "none", border: "none", color: "var(--gold)",
  cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "'DM Sans', sans-serif",
};
