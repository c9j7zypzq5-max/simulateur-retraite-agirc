// Galerie de modèles — pages marketing indexables (SEO) regroupant les
// templates par métier. /modeles = galerie, /modeles/:id = fiche d'un modèle
// avec démo interactive (le vrai CalculatorRenderer, pas une capture) et CTA
// inscription. Publiques, sans auth, chargées à la demande depuis main.tsx.

import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { TEMPLATES, templatesByMetier } from '../schema/templates';
import { DEFAULT_THEME } from '../schema/types';
import { t } from '../i18n';
import { usePageMeta, useJsonLd } from './seo';
import { Header, Footer, Particles } from './Chrome';

const ORIGIN = 'https://app.simfinly.com';

// /modeles — galerie groupée par métier.
export function ModelesGallery() {
  usePageMeta(t('modeles.metaTitle'), t('modeles.metaDescription'));
  // ItemList : aide Google à comprendre la galerie comme une liste de modèles.
  useJsonLd(
    useMemo(
      () => ({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: TEMPLATES.map((tpl, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: tpl.name,
          url: `${ORIGIN}/modeles/${tpl.id}`,
        })),
      }),
      [],
    ),
  );
  const groups = templatesByMetier();

  return (
    <div>
      <Header />
      <section style={{ position: 'relative', maxWidth: 960, margin: '0 auto', padding: '56px 24px 24px', textAlign: 'center' }}>
        <Particles />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ marginBottom: 20 }}>
            <span style={{ opacity: 0.7 }}>✦</span> {t('modeles.badge')} <span style={{ opacity: 0.7 }}>✦</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 40px)', margin: '0 0 14px' }}>{t('modeles.title')}</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '0 auto', maxWidth: 560, lineHeight: 1.6 }}>{t('modeles.subtitle')}</p>
        </div>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: '16px 24px 48px' }}>
        {groups.map(({ metier, templates }) => (
          <div key={metier} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>{metier}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {templates.map((tpl) => (
                <Link
                  key={tpl.id}
                  to={`/modeles/${tpl.id}`}
                  className="card interactive"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>{tpl.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{tpl.description}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>{t('modeles.tryIt')} →</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

// /modeles/:id — fiche d'un modèle avec démo interactive.
export function ModeleDetail() {
  const { id } = useParams();
  const tpl = TEMPLATES.find((x) => x.id === id);
  const [values, setValues] = useState<Record<string, number>>({});
  // Les hooks doivent être appelés inconditionnellement : on calcule des
  // valeurs sûres même quand le modèle est introuvable (on redirige juste après).
  usePageMeta(
    tpl ? t('modeles.detailMetaTitle').replace('{name}', tpl.name) : t('modeles.metaTitle'),
    tpl ? tpl.description : t('modeles.metaDescription'),
  );
  // Données structurées : l'outil (WebApplication gratuite) + le fil d'Ariane.
  useJsonLd(
    useMemo(
      () =>
        tpl
          ? {
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  name: `${tpl.name} — Simfinly Builder`,
                  description: tpl.description,
                  url: `${ORIGIN}/modeles/${tpl.id}`,
                  applicationCategory: 'FinanceApplication',
                  operatingSystem: 'Web',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
                  publisher: { '@type': 'Organization', name: 'Simfinly', url: 'https://www.simfinly.com' },
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: t('modeles.backToGallery'), item: `${ORIGIN}/modeles` },
                    { '@type': 'ListItem', position: 2, name: tpl.name, item: `${ORIGIN}/modeles/${tpl.id}` },
                  ],
                },
              ],
            }
          : null,
      [tpl],
    ),
  );
  if (!tpl) return <Navigate to="/modeles" replace />;

  return (
    <div>
      <Header />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 12px' }}>
        <Link to="/modeles" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>← {t('modeles.backToGallery')}</Link>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '18px 0 4px', fontWeight: 600 }}>{tpl.metier}</div>
        <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: '0 0 12px' }}>{tpl.name}</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{tpl.description}</p>
      </section>

      <section style={{ maxWidth: 560, margin: '0 auto', padding: '20px 24px 8px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <CalculatorRenderer
            calculator={{ title: tpl.name, theme: DEFAULT_THEME, schema: tpl.schema }}
            values={values}
            onChange={(fid, v) => setValues((p) => ({ ...p, [fid]: v }))}
          />
        </div>
      </section>

      <section style={{ maxWidth: 560, margin: '0 auto', padding: '20px 24px 56px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 14px' }}>{t('modeles.ctaHelp')}</p>
        <Link to={`/essai/${tpl.id}`} className="btn primary" style={{ textDecoration: 'none', padding: '11px 24px', fontSize: 15, display: 'inline-block' }}>
          {t('modeles.cta')}
        </Link>
        <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-secondary)' }}>{t('modeles.ctaNote')}</div>
      </section>

      <Footer />
    </div>
  );
}
