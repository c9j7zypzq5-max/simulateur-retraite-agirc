import { useParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useTranslation } from "../i18n/index.js";
import { Link } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import NotFound from "./NotFound.jsx";
import RecoSlot from "../components/RecoSlot.jsx";
import { OBJECTIFS_BY_SLUG } from "../data/objectifs.js";
import { useParcours, stepHref, objectifHref } from "../lib/parcours.js";

// Synthèse finale d'un parcours : récapitulatif consolidé des résultats
// capturés à chaque étape (via ShareBar → useParcoursCapture, sessionStorage
// uniquement). La page reste une vraie page prérendue et indexable : le contenu
// explicatif (H1 + intro) est statique, seul le récapitulatif est personnel.
export default function ObjectifSynthese() {
  const { slug } = useParams();
  const objectif = OBJECTIFS_BY_SLUG[slug];
  const [theme, setTheme] = useTheme();
  const { t, locale } = useTranslation();
  const parcours = useParcours();

  const content = objectif ? (locale === 'en' ? objectif.en : objectif.fr) : null;
  usePageMeta(content?.syntheseTitle, content?.syntheseMetaDescription);

  if (!objectif) return <NotFound />;

  const results = parcours?.slug === objectif.slug ? (parcours.results || {}) : {};
  const done = objectif.steps.filter(s => results[s.route]).length;
  const n = objectif.steps.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
        <Breadcrumbs items={[
          { label: t('parcours.breadcrumbHome'), to: locale === 'en' ? '/en' : '/' },
          { label: t('parcours.breadcrumbGoals'), to: locale === 'en' ? '/en/goals' : '/objectifs' },
          { label: content.label, to: objectifHref(objectif, locale) },
          { label: t('parcours.breadcrumbSynthese') },
        ]} />

        <div style={{ fontSize: 34, margin: "8px 0 4px" }} aria-hidden>{objectif.emoji}</div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
          {content.syntheseH1}
        </h1>
        <p style={{ fontSize: 15.5, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 26, maxWidth: 720 }}>
          {content.syntheseIntro}
        </p>

        {/* ── Message consolidé ── */}
        <div style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 16, padding: "16px 20px", marginBottom: 22, fontSize: 14.5, lineHeight: 1.6 }}>
          {done === 0
            ? <>{t('parcours.syntheseEmpty')}{' '}<Link to={objectifHref(objectif, locale)} style={{ color: "var(--gold)", fontWeight: 600 }}>{t('parcours.syntheseEmptyCta')}</Link></>
            : done < n
              ? t('parcours.synthesePartial').replace('{done}', done).replace('{n}', n)
              : t('parcours.syntheseComplete').replace('{n}', n)}
        </div>

        {/* ── Récapitulatif par étape ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {objectif.steps.map((step, i) => {
            const s = locale === 'en' ? step.en : step.fr;
            const r = results[step.route];
            return (
              <div key={step.route} style={{ display: "flex", gap: 16, alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px", flexWrap: "wrap" }}>
                <span aria-hidden style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: r ? "var(--primary)" : "var(--primary-soft)", color: r ? "#fff" : "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                  {r ? "✓" : i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{s.title}</div>
                  {r
                    ? <div style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 2 }}>{r.highlight.label}</div>
                    : <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{t('parcours.stepNotDone')}</div>}
                </div>
                {r
                  ? <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--gold)", whiteSpace: "nowrap" }}>{r.highlight.value}</div>
                  : <Link to={stepHref(objectif, i, locale, parcours?.slug === objectif.slug ? parcours : null)} style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", whiteSpace: "nowrap" }}>{t('parcours.doStep')} →</Link>}
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 14, lineHeight: 1.6 }}>
          {t('parcours.syntheseDisclaimer')}
        </p>

        {/* Capture email optionnelle : le bloc NewsletterSignup du Footer (présent
            sur toutes les pages) est réutilisé, avec une source « parcours-<slug> »
            pour l'attribution — pas de second bloc dupliqué sur la page. */}
        <div style={{ marginTop: 26 }}>
          <RecoSlot context={objectif.recoContext} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 22 }}>
          <Link to={objectifHref(objectif, locale)} style={{ fontSize: 14, fontWeight: 600, color: "var(--gold)" }}>
            ← {t('parcours.backToGoal')}
          </Link>
          <Link to={locale === 'en' ? '/en/goals' : '/objectifs'} style={{ fontSize: 14, fontWeight: 600, color: "var(--gold)" }}>
            {t('parcours.otherGoals')}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
