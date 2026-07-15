// Landing — écran 1 du parcours MVP, servie sur / aux visiteurs non
// connectés (les connectés voient le Dashboard). Proposition de valeur,
// démos interactives des 3 templates (le vrai CalculatorRenderer, pas des
// captures), pricing, CTA inscription. Copie sobre et pro, en français.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { TEMPLATES } from '../schema/templates';
import { DEFAULT_THEME } from '../schema/types';
import { t } from '../i18n';

export default function Landing() {
  const [demoId, setDemoId] = useState(TEMPLATES[0].id);
  // Valeurs jouées par visiteur, indépendantes par démo.
  const [demoValues, setDemoValues] = useState<Record<string, Record<string, number>>>({});
  const demo = TEMPLATES.find((tpl) => tpl.id === demoId) ?? TEMPLATES[0];

  return (
    <div>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <strong style={{ fontSize: 16 }}>Simfinly <span style={{ color: 'var(--primary)' }}>Builder</span></strong>
        <Link to="/login" className="btn" style={{ textDecoration: 'none' }}>{t('landing.signIn')}</Link>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: '0 0 16px' }}>{t('landing.heroTitle')}</h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '0 0 28px', lineHeight: 1.6 }}>{t('landing.heroSubtitle')}</p>
        <Link to="/login" className="btn primary" style={{ textDecoration: 'none', padding: '12px 26px', fontSize: 15, display: 'inline-block' }}>
          {t('landing.cta')}
        </Link>
      </section>

      {/* Démos interactives */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '24px 24px 48px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, margin: '0 0 6px' }}>{t('landing.demoTitle')}</h2>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>{t('landing.demoSubtitle')}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className="btn"
              style={demoId === tpl.id ? { background: 'var(--primary-soft)', borderColor: 'var(--primary)', color: 'var(--primary)' } : undefined}
              onClick={() => setDemoId(tpl.id)}
            >
              {tpl.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ boxShadow: '0 1px 4px rgba(15,24,40,0.07), 0 4px 16px rgba(15,24,40,0.05)', borderRadius: 14, width: '100%', maxWidth: 560 }}>
            <CalculatorRenderer
              calculator={{ title: demo.name, theme: DEFAULT_THEME, schema: demo.schema }}
              values={demoValues[demo.id] ?? {}}
              onChange={(fid, v) => setDemoValues((p) => ({ ...p, [demo.id]: { ...p[demo.id], [fid]: v } }))}
            />
          </div>
        </div>
        <p style={{ textAlign: 'center', margin: '22px 0 0' }}>
          <Link to="/modeles" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600 }}>{t('landing.seeModels')} →</Link>
        </p>
      </section>

      {/* Pricing — lancement gratuit, une seule carte */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '24px 24px 64px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, margin: '0 0 24px' }}>{t('landing.pricingTitle')}</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 10, borderColor: 'var(--primary)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t('landing.launch.name')}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', margin: '4px 0' }}>{t('landing.launch.price')}</div>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.9, flex: 1 }}>
              {t('landing.launch.features').split('·').map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>{t('landing.launch.note')}</p>
            <Link to="/login" className="btn primary" style={{ textAlign: 'center' }}>
              {t('landing.pricingCta')}
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '20px 24px 32px', fontSize: 12, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
        {t('landing.footer')}{' '}
        <a href="https://www.simfinly.com" style={{ color: 'var(--primary)' }}>simfinly.com</a>
      </footer>
    </div>
  );
}
