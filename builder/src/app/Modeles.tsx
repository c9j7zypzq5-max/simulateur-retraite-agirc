// Galerie de modèles — pages marketing indexables (SEO) regroupant les
// templates par métier. /modeles = galerie, /modeles/:id = fiche d'un modèle
// avec démo interactive (le vrai CalculatorRenderer, pas une capture) et CTA
// inscription. Publiques, sans auth, chargées à la demande depuis main.tsx.

import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { TEMPLATES, templatesByMetier } from '../schema/templates';
import { DEFAULT_THEME } from '../schema/types';
import { t } from '../i18n';
import { usePageMeta } from './seo';

function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <strong style={{ fontSize: 16 }}>Simfinly <span style={{ color: 'var(--primary)' }}>Builder</span></strong>
      </Link>
      <Link to="/login" className="btn" style={{ textDecoration: 'none' }}>{t('landing.signIn')}</Link>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '20px 24px 32px', fontSize: 12, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
      {t('landing.footer')}{' '}
      <a href="https://www.simfinly.com" style={{ color: 'var(--primary)' }}>simfinly.com</a>
    </footer>
  );
}

// /modeles — galerie groupée par métier.
export function ModelesGallery() {
  usePageMeta(t('modeles.metaTitle'), t('modeles.metaDescription'));
  const groups = templatesByMetier();

  return (
    <div>
      <Header />
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 30, lineHeight: 1.2, margin: '0 0 14px' }}>{t('modeles.title')}</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 auto', maxWidth: 560, lineHeight: 1.6 }}>{t('modeles.subtitle')}</p>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: '8px 24px 48px' }}>
        {groups.map(({ metier, templates }) => (
          <div key={metier} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, margin: '0 0 14px', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>{metier}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {templates.map((tpl) => (
                <Link
                  key={tpl.id}
                  to={`/modeles/${tpl.id}`}
                  className="card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tpl.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{tpl.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>{t('modeles.tryIt')} →</div>
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
  // Le hook doit être appelé inconditionnellement : on calcule des chaînes sûres
  // même quand le modèle est introuvable (on redirige juste après).
  usePageMeta(
    tpl ? t('modeles.detailMetaTitle').replace('{name}', tpl.name) : t('modeles.metaTitle'),
    tpl ? tpl.description : t('modeles.metaDescription'),
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
        <div style={{ boxShadow: '0 1px 4px rgba(15,24,40,0.07), 0 4px 16px rgba(15,24,40,0.05)', borderRadius: 14 }}>
          <CalculatorRenderer
            calculator={{ title: tpl.name, theme: DEFAULT_THEME, schema: tpl.schema }}
            values={values}
            onChange={(fid, v) => setValues((p) => ({ ...p, [fid]: v }))}
          />
        </div>
      </section>

      <section style={{ maxWidth: 560, margin: '0 auto', padding: '20px 24px 56px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 14px' }}>{t('modeles.ctaHelp')}</p>
        <Link to="/login" className="btn primary" style={{ textDecoration: 'none', padding: '11px 24px', fontSize: 15, display: 'inline-block' }}>
          {t('modeles.cta')}
        </Link>
      </section>

      <Footer />
    </div>
  );
}
