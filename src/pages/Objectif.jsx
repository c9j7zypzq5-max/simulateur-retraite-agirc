import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useTranslation } from "../i18n/index.js";
import { Link, LocaleLink } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import NotFound from "./NotFound.jsx";
import RecoSlot from "../components/RecoSlot.jsx";
import { NumInput } from "../components/ui.jsx";
import { OBJECTIFS_BY_SLUG } from "../data/objectifs.js";
import { startParcours, stepHref, syntheseHref, useParcours } from "../lib/parcours.js";

// Landing SEO d'un objectif : contenu longue traîne prérendu au build
// (api/_seo.js), aperçu des étapes, mini-formulaire optionnel dont les réponses
// préremplissent les simulateurs du parcours via leur mécanisme ?s= existant.
export default function Objectif() {
  const { slug } = useParams();
  const objectif = OBJECTIFS_BY_SLUG[slug];
  const [theme, setTheme] = useTheme();
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const parcours = useParcours();
  const [answers, setAnswers] = useState({});

  const content = objectif ? (locale === 'en' ? objectif.en : objectif.fr) : null;
  usePageMeta(content?.title, content?.metaDescription);

  if (!objectif) return <NotFound />;

  const resumable = parcours?.slug === objectif.slug && Object.keys(parcours.results || {}).length > 0;

  function commencer() {
    startParcours(objectif.slug, answers);
    navigate(stepHref(objectif, 0, locale, { answers, results: parcours?.slug === objectif.slug ? parcours.results : {} }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
        <Breadcrumbs items={[
          { label: t('parcours.breadcrumbHome'), to: locale === 'en' ? '/en' : '/' },
          { label: t('parcours.breadcrumbGoals'), to: locale === 'en' ? '/en/goals' : '/objectifs' },
          { label: content.label },
        ]} />

        <div style={{ fontSize: 34, margin: "8px 0 4px" }} aria-hidden>{objectif.emoji}</div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
          {content.h1}
        </h1>
        {content.intro.map((p, i) => (
          <p key={i} style={{ fontSize: 15.5, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 14, maxWidth: 720 }}>{p}</p>
        ))}

        {/* ── Aperçu des étapes ── */}
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, margin: "34px 0 16px" }}>
          {t('parcours.stepsHeading')}
        </h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {objectif.steps.map((step, i) => {
            const s = locale === 'en' ? step.en : step.fr;
            return (
              <li key={step.route} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 20px" }}>
                <span aria-hidden style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>{s.desc}</div>
                </div>
                <LocaleLink to={step.route} style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {t('parcours.openSim')} →
                </LocaleLink>
              </li>
            );
          })}
        </ol>

        {/* ── Démarrage du parcours : questions optionnelles + CTA ── */}
        <div style={{ marginTop: 34, background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "26px 24px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 600, margin: "0 0 6px" }}>
            {t('parcours.startHeading')}
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 18px" }}>
            {t('parcours.startHint')}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 18 }}>
            {objectif.questions.map(q => (
              <NumInput
                key={q.key}
                id={`parcours-${q.key}`}
                label={locale === 'en' ? q.en : q.fr}
                unit={q.suffix}
                value={answers[q.key] ?? null}
                onChange={v => setAnswers(prev => ({ ...prev, [q.key]: v }))}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={commencer}
              style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 15, borderRadius: 10, padding: "13px 26px" }}
            >
              {t('parcours.startCta')} →
            </button>
            {resumable && (
              <Link to={syntheseHref(objectif, locale)} style={{ fontSize: 14, fontWeight: 600, color: "var(--gold)" }}>
                {t('parcours.viewSynthese')}
              </Link>
            )}
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <RecoSlot context={objectif.recoContext} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
