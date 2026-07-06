import { useState } from "react";
import { track } from "@vercel/analytics";
import { useTranslation } from "../i18n/index.js";

// Capture email légère : construit un canal d'audience indépendant de Google.
// Stockage via /api/track?action=subscribe (Redis) — pas de nouvelle fonction
// serverless. `source` permet de savoir d'où vient l'inscription.
const T = {
  fr: {
    title: "Restez informé des barèmes 2026",
    desc: "Guides retraite, immobilier et fiscalité + alertes quand les barèmes officiels sont revalorisés. Gratuit, désinscription en un clic.",
    placeholder: "votre@email.fr",
    cta: "Je m'inscris",
    sending: "…",
    ok: "Merci ! Vous êtes inscrit·e. 🎉",
    err: "Adresse invalide — réessayez.",
    privacy: "Aucun spam. Vos données ne sont ni revendues ni partagées.",
  },
  en: {
    title: "Stay up to date with 2026 rates",
    desc: "Retirement, property and tax guides + alerts when official rates are updated. Free, one-click unsubscribe.",
    placeholder: "your@email.com",
    cta: "Subscribe",
    sending: "…",
    ok: "Thanks! You're subscribed. 🎉",
    err: "Invalid address — please try again.",
    privacy: "No spam. Your data is never sold or shared.",
  },
};

export default function NewsletterSignup({ source = "footer" }) {
  const { locale } = useTranslation();
  const t = T[locale] || T.fr;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error

  async function submit(e) {
    e.preventDefault();
    if (status === "sending" || status === "ok") return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const r = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscribe", email: value, source }),
      });
      if (!r.ok) throw new Error("bad");
      track("newsletter_signup", { source });
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section aria-label={t.title} style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 24px" }}>
      <div style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,4vw,24px)", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{t.title}</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 18px" }}>{t.desc}</p>

        {status === "ok" ? (
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--positive)" }}>{t.ok}</p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 460, margin: "0 auto" }}>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              aria-invalid={status === "error"}
              style={{ flex: "1 1 220px", minWidth: 0, padding: "12px 14px", borderRadius: 10, border: `1px solid ${status === "error" ? "var(--negative)" : "var(--border)"}`, background: "var(--surface)", color: "var(--text)", fontSize: 16, fontFamily: "inherit" }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ padding: "12px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: "var(--primary)", color: "#fff", whiteSpace: "nowrap" }}
            >
              {status === "sending" ? t.sending : t.cta}
            </button>
          </form>
        )}

        {status === "error" && <p style={{ fontSize: 13, color: "var(--negative)", marginTop: 10 }}>{t.err}</p>}
        {status !== "ok" && <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 12 }}>{t.privacy}</p>}
      </div>
    </section>
  );
}
