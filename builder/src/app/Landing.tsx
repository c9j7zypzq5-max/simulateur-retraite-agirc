// Landing — écran 1 du parcours MVP, servie sur / aux visiteurs non
// connectés (les connectés voient le Dashboard). Proposition de valeur,
// démos interactives des 3 templates (le vrai CalculatorRenderer, pas des
// captures), pricing, CTA inscription. DA alignée sur simfinly.com.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { TEMPLATES } from '../schema/templates';
import { DEFAULT_THEME } from '../schema/types';
import { t } from '../i18n';
import { usePageMeta } from './seo';
import { Header, Footer, Particles } from './Chrome';

export default function Landing() {
  usePageMeta(t('landing.metaTitle'), t('landing.metaDescription'), '/');
  const [demoId, setDemoId] = useState(TEMPLATES[0].id);
  // Valeurs jouées par visiteur, indépendantes par démo.
  const [demoValues, setDemoValues] = useState<Record<string, Record<string, number>>>({});
  const demo = TEMPLATES.find((tpl) => tpl.id === demoId) ?? TEMPLATES[0];

  return (
    <div>
      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', maxWidth: 760, margin: '0 auto', padding: '72px 24px 44px', textAlign: 'center' }}>
        <Particles />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ marginBottom: 24 }}>
            <span style={{ opacity: 0.7 }}>✦</span> {t('landing.badge')} <span style={{ opacity: 0.7 }}>✦</span>
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 700, margin: '0 0 18px' }}>
            {t('landing.heroTitle')} <span className="hero-em">{t('landing.heroTitleEm')}</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-secondary)', margin: '0 auto 30px', lineHeight: 1.65, maxWidth: 560 }}>
            {t('landing.heroSubtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/essai" className="btn primary" style={{ padding: '12px 26px', fontSize: 15 }}>
              {t('landing.cta')}
            </Link>
            <Link to="/modeles" className="btn" style={{ padding: '12px 24px', fontSize: 15 }}>
              {t('landing.seeModels')}
            </Link>
          </div>
          {/* Bandeau de confiance */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30, fontSize: 13, color: 'var(--text-secondary)' }}>
            {t('landing.trust').split('·').map((item) => (
              <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--positive)', fontWeight: 700 }}>✓</span> {item.trim()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Démos interactives */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '24px 24px 48px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, margin: '0 0 6px' }}>{t('landing.demoTitle')}</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 22px' }}>{t('landing.demoSubtitle')}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className={`btn chip${demoId === tpl.id ? ' active' : ''}`}
              onClick={() => setDemoId(tpl.id)}
            >
              {tpl.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', width: '100%', maxWidth: 560 }}>
            <CalculatorRenderer
              calculator={{ title: demo.name, theme: DEFAULT_THEME, schema: demo.schema }}
              values={demoValues[demo.id] ?? {}}
              onChange={(fid, v) => setDemoValues((p) => ({ ...p, [demo.id]: { ...p[demo.id], [fid]: v } }))}
            />
          </div>
        </div>
        <p style={{ textAlign: 'center', margin: '24px 0 0' }}>
          <Link to="/modeles" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{t('landing.seeModels')} →</Link>
        </p>
      </section>

      {/* Pricing — lancement gratuit, une seule carte */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '24px 24px 64px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, margin: '0 0 24px' }}>{t('landing.pricingTitle')}</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12, borderColor: 'var(--primary)', boxShadow: '0 8px 30px rgba(43,92,230,0.16)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t('landing.launch.name')}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 700, color: 'var(--primary)', margin: '4px 0', letterSpacing: '-0.02em' }}>{t('landing.launch.price')}</div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13.5, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {t('landing.launch.features').split('·').map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: 'var(--positive)', fontWeight: 700 }}>✓</span> {f.trim()}
                </li>
              ))}
            </ul>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t('landing.launch.note')}</p>
            <Link to="/essai" className="btn primary">{t('landing.pricingCta')}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
