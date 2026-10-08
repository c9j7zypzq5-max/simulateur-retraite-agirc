import { useEffect } from "react";
import { LocaleLink } from "../lib/router.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { useTranslation } from "../i18n/index.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Simulateurs mis en avant, par langue (les liens anglais pointent vers des
// pages traduites ; LocaleLink ajoute le préfixe /en).
const POPULAR = {
  fr: [
    { to: "/simulateurs/agirc-arrco", label: "Retraite Agirc-Arrco" },
    { to: "/simulateurs/emprunt-immobilier", label: "Emprunt immobilier" },
    { to: "/simulateurs/impot-revenu", label: "Impôt sur le revenu" },
    { to: "/simulateurs/epargne", label: "Épargne & intérêts composés" },
    { to: "/simulateurs/fire", label: "Indépendance financière (FIRE)" },
  ],
  en: [
    { to: "/simulateurs/fire", label: "FIRE calculator" },
    { to: "/simulateurs/epargne", label: "Compound interest" },
    { to: "/simulateurs/emprunt-immobilier", label: "Mortgage calculator" },
    { to: "/simulateurs/budget", label: "50/30/20 budget" },
    { to: "/simulateurs/cnav", label: "French state pension" },
  ],
};

export default function NotFound() {
  const [theme, setTheme] = useTheme();
  const { t, locale } = useTranslation();
  const popular = POPULAR[locale] || POPULAR.fr;

  useEffect(() => {
    document.title = t("notFound.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots && robots.setAttribute('content', 'index, follow');
  }, [t]);

  const linkStyle = { color: "var(--primary)", textDecoration: "underline", textUnderlineOffset: 2 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" tabIndex={-1}>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 16px 80px", textAlign: "center" }}>
        <div aria-hidden="true" style={{ fontSize: 80, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: 600, color: "var(--text)", margin: "12px 0 10px" }}>
          {t("notFound.title")}
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          {t("notFound.desc")}
        </p>

        <LocaleLink to="/" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 10, background: "var(--primary)", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
          {t("notFound.back")}
        </LocaleLink>

        <div style={{ marginTop: 40, textAlign: "left" }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14, textAlign: "center" }}>
            {t("notFound.popular")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {popular.map(p => (
              <LocaleLink key={p.to} to={p.to} style={{ display: "block", padding: "12px 16px", borderRadius: 12, textDecoration: "none", background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14 }}>
                {p.label} →
              </LocaleLink>
            ))}
          </div>
          <p style={{ marginTop: 18, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
            {locale === "en" ? (
              <>{t("notFound.orBrowse")} <LocaleLink to="/lexique" style={linkStyle}>{t("notFound.lexique")}</LocaleLink> {"or the"} <LocaleLink to="/comparatifs" style={linkStyle}>{t("notFound.guides")}</LocaleLink>.</>
            ) : (
              <>{t("notFound.orBrowse")} <LocaleLink to="/lexique" style={linkStyle}>{t("notFound.lexique")}</LocaleLink>, les <LocaleLink to="/guides" style={linkStyle}>{t("notFound.guides")}</LocaleLink> et le <LocaleLink to="/blog" style={linkStyle}>{t("notFound.blog")}</LocaleLink>.</>
            )}
          </p>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
}
