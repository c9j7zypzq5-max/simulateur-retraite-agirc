import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
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

  const next = params.get("next") || "/compte";
  const [mode, setMode] = useState("signin"); // signin | signup | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Connexion | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    return () => robots?.setAttribute("content", "index, follow");
  }, []);

  // Déjà connecté → on redirige.
  useEffect(() => { if (user) navigate(next, { replace: true }); }, [user, next, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "reset") {
        const { error } = await resetPassword(email);
        if (error) setError(error.message);
        else setNotice("Si un compte existe, un email de réinitialisation vient d'être envoyé.");
        return;
      }
      const fn = mode === "signup" ? signUp : signIn;
      const { data, error } = await fn(email, password);
      if (error) { setError(error.message); return; }
      if (mode === "signup" && !data?.session) {
        setNotice("Compte créé. Vérifiez votre email pour confirmer votre adresse, puis connectez-vous.");
        setMode("signin");
        return;
      }
      navigate(next, { replace: true });
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true); setError("");
    const { error } = await signInGoogle();
    if (error) { setError(error.message); setBusy(false); }
    // Sinon : redirection vers Google.
  }

  const input = {
    width: "100%", padding: "11px 13px", borderRadius: 10,
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text)", fontSize: 14, marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 16px 80px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          {mode === "signup" ? "Créer un compte" : mode === "reset" ? "Mot de passe oublié" : "Connexion"}
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
          {mode === "signup"
            ? "Sauvegardez vos simulations et gérez votre abonnement."
            : mode === "reset"
              ? "Entrez votre email pour recevoir un lien de réinitialisation."
              : "Accédez à vos simulations et votre abonnement."}
        </p>

        {!isConfigured && (
          <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#c0392b", marginBottom: 20 }}>
            L'authentification n'est pas encore activée. Réessayez dans quelques minutes.
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
              <GoogleIcon /> Continuer avec Google
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 18px", color: "var(--text-secondary)", fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} /> ou <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={input} />
          {mode !== "reset" && (
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} style={input} />
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
            {busy ? "…" : mode === "signup" ? "Créer mon compte" : mode === "reset" ? "Envoyer le lien" : "Se connecter"}
          </button>
        </form>

        {error && <p style={{ fontSize: 13, color: "#c0392b", marginTop: 12, textAlign: "center" }}>{error}</p>}
        {notice && <p style={{ fontSize: 13, color: "var(--gold)", marginTop: 12, textAlign: "center", lineHeight: 1.6 }}>{notice}</p>}

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-secondary)", lineHeight: 2 }}>
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("reset"); setError(""); }} style={linkBtn}>Mot de passe oublié ?</button><br />
              Pas encore de compte ? <button onClick={() => { setMode("signup"); setError(""); }} style={linkBtn}>Créer un compte</button>
            </>
          )}
          {mode === "signup" && (<>Déjà un compte ? <button onClick={() => { setMode("signin"); setError(""); }} style={linkBtn}>Se connecter</button></>)}
          {mode === "reset" && (<button onClick={() => { setMode("signin"); setError(""); }} style={linkBtn}>← Retour à la connexion</button>)}
        </div>

        <p style={{ marginTop: 28, fontSize: 11, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.6 }}>
          En continuant, vous acceptez nos <Link to="/mentions-legales" style={{ color: "var(--gold)" }}>conditions</Link> et notre <Link to="/politique-de-confidentialite" style={{ color: "var(--gold)" }}>politique de confidentialité</Link>.
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
