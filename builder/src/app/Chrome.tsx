// Éléments de chrome partagés — alignés sur la DA du site principal
// (simfinly.com) : marque (carré bleu dégradé + « S » + wordmark), en-tête
// collant translucide, pied de page, et particules bleues du hero.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { t } from '../i18n';

// Marque Simfinly Builder — reprend le logo du site principal (carré bleu à
// « S » blanc en Space Grotesk) suivi du wordmark « simfinly builder ».
export function Brand({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="brand" aria-label="Simfinly Builder">
      <span className="brand-mark">S</span>
      <span className="brand-name">simfinly <em>builder</em></span>
    </Link>
  );
}

export function Header({ right }: { right?: ReactNode }) {
  return (
    <header className="app-header">
      <Brand />
      {right ?? (
        <Link to="/login" className="btn">{t('landing.signIn')}</Link>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '28px 24px 36px', fontSize: 12.5, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
      {t('landing.footer')}{' '}
      <a href="https://www.simfinly.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>simfinly.com</a>
    </footer>
  );
}

// Particules bleues dérivant lentement — signature visuelle du hero du site
// principal, en version compacte. Purement décoratif.
const PARTICLES = [
  { cx: '10%', cy: '20%', r: 2.4, dur: '20s', dx: '28px', dy: '18px' },
  { cx: '24%', cy: '68%', r: 1.7, dur: '24s', dx: '-20px', dy: '30px' },
  { cx: '40%', cy: '30%', r: 2, dur: '26s', dx: '16px', dy: '-22px' },
  { cx: '58%', cy: '72%', r: 1.5, dur: '22s', dx: '-24px', dy: '14px' },
  { cx: '70%', cy: '22%', r: 2.6, dur: '25s', dx: '22px', dy: '20px' },
  { cx: '84%', cy: '60%', r: 1.6, dur: '19s', dx: '-18px', dy: '-18px' },
  { cx: '90%', cy: '32%', r: 2, dur: '28s', dx: '12px', dy: '26px' },
];

export function Particles() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 0 }}>
      <defs>
        {PARTICLES.map((p, i) => (
          <style key={i}>{`
            @keyframes bdrift-${i} {
              0% { transform: translate(0,0) scale(1); opacity: .5; }
              33% { transform: translate(${p.dx}, ${p.dy}) scale(1.3); opacity: .8; }
              66% { transform: translate(calc(${p.dx} * -0.5), calc(${p.dy} * 0.7)) scale(.9); opacity: .4; }
              100% { transform: translate(0,0) scale(1); opacity: .5; }
            }
          `}</style>
        ))}
      </defs>
      {PARTICLES.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(43,92,230,0.25)"
          style={{ animation: `bdrift-${i} ${p.dur} ease-in-out infinite`, animationDelay: `${(i * 1.4).toFixed(1)}s` }} />
      ))}
    </svg>
  );
}
