import { Link, useLocation } from "../lib/router.jsx";
import { useTranslation } from "../i18n/index.js";
import { canonicalPath } from "../i18n/paths.js";
import { OBJECTIFS_BY_SLUG } from "../data/objectifs.js";
import { useParcours, quitParcours, stepHref, syntheseHref } from "../lib/parcours.js";

// Fil de progression du parcours par objectif. Monté une seule fois dans
// App.jsx (comme CountrySuggestionBanner) : il s'affiche uniquement quand un
// parcours est actif ET que la page courante est l'une de ses étapes — les
// pages simulateurs n'ont pas connaissance du parcours.
export default function ParcoursBanner() {
  const parcours = useParcours();
  const { pathname } = useLocation();
  const { t, locale } = useTranslation();

  if (!parcours) return null;
  const objectif = OBJECTIFS_BY_SLUG[parcours.slug];
  const route = canonicalPath(pathname);
  const index = objectif.steps.findIndex(s => s.route === route);
  if (index === -1) return null;

  const n = objectif.steps.length;
  const step = objectif.steps[index];
  const content = locale === 'en' ? objectif.en : objectif.fr;
  const isLast = index === n - 1;
  const nextTo = isLast ? syntheseHref(objectif, locale) : stepHref(objectif, index + 1, locale, parcours);
  const prevTo = index > 0 ? stepHref(objectif, index - 1, locale, parcours) : null;

  return (
    <div
      role="complementary"
      aria-label={`${content.label} — ${t('parcours.stepOf').replace('{i}', index + 1).replace('{n}', n)}`}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9998,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-gold)',
        boxShadow: '0 -2px 12px rgba(15,24,40,0.12)',
        padding: '10px 16px',
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontSize: 13,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{objectif.emoji}</span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-mid)' }}>
            {t('parcours.goal')} : {content.label} · {t('parcours.stepOf').replace('{i}', index + 1).replace('{n}', n)}
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{(locale === 'en' ? step.en : step.fr).title}</div>
          <div aria-hidden style={{ display: 'flex', gap: 4, marginTop: 5 }}>
            {objectif.steps.map((s, i) => (
              <span key={s.route} style={{ height: 3, flex: 1, maxWidth: 34, borderRadius: 2, background: i <= index ? 'var(--gold)' : 'var(--border)' }} />
            ))}
          </div>
        </div>
        {prevTo && (
          <Link to={prevTo} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
            ← {t('parcours.prev')}
          </Link>
        )}
        <Link
          to={nextTo}
          style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none', fontWeight: 600, borderRadius: 8, padding: '9px 16px', whiteSpace: 'nowrap' }}
        >
          {isLast ? t('parcours.toSynthese') : t('parcours.next')} →
        </Link>
        <button
          onClick={quitParcours}
          aria-label={t('parcours.quit')}
          title={t('parcours.quit')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 16, padding: 4, lineHeight: 1 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
