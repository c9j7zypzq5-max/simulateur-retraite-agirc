import { useTheme } from "../hooks/useTheme.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useTranslation } from "../i18n/index.js";
import { Link } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import { OBJECTIFS } from "../data/objectifs.js";
import { objectifHref } from "../lib/parcours.js";

// Hub des parcours guidés par objectif : point d'entrée « par intention »
// (préparer sa retraite, acheter, investir) vers les simulateurs existants.
export default function Objectifs() {
  const [theme, setTheme] = useTheme();
  const { t, locale } = useTranslation();
  usePageMeta(t('parcours.hubTitle'), t('parcours.hubDescription'));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
        <Breadcrumbs items={[{ label: t('parcours.breadcrumbHome'), to: locale === 'en' ? '/en' : '/' }, { label: t('parcours.breadcrumbGoals') }]} />
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 700, margin: "12px 0 10px" }}>
          {t('parcours.hubH1')}
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 720, marginBottom: 34 }}>
          {t('parcours.hubIntro')}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {OBJECTIFS.map(o => {
            const content = locale === 'en' ? o.en : o.fr;
            return (
              <Link
                key={o.slug}
                to={objectifHref(o, locale)}
                style={{
                  display: "flex", flexDirection: "column", gap: 10, textDecoration: "none",
                  background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20,
                  padding: "26px 24px", transition: "border-color 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
              >
                <span style={{ fontSize: 34 }} aria-hidden>{o.emoji}</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>
                  {content.label}
                </span>
                <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, flex: 1 }}>
                  {content.tagline}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>
                  {t('parcours.stepsCount').replace('{n}', o.steps.length)} · {t('parcours.start')} →
                </span>
              </Link>
            );
          })}
        </div>

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 720, marginTop: 34 }}>
          {t('parcours.hubOutro')}{' '}
          <Link to="/simulateurs" style={{ color: "var(--gold)" }}>{t('parcours.hubAllSims')}</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
