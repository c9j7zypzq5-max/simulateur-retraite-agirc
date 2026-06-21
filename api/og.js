import { ImageResponse } from '@vercel/og';

// Image Open Graph dynamique (1200×630) générée à la volée à partir du résultat
// d'une simulation, via @vercel/og (Edge runtime, sans module natif).
// Utilisée comme aperçu de partage social par /api/share.
//
// GET /api/og?t=<titre>&v=<valeur>&s=<sous-titre>&c=<catégorie>&l=<fr|en>

export const config = { runtime: 'edge' };

const CAT_COLOR = {
  Retraite: '#818cf8', Immobilier: '#a855f7', 'Impôts': '#f97316',
  Finances: '#22c55e', FIRE: '#ef4444', Budget: '#14b8a6',
};

function clip(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
const el = (style, children) => ({ type: 'div', props: { style, children } });

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const t = clip(searchParams.get('t'), 46);
  const v = clip(searchParams.get('v'), 22);
  const s = clip(searchParams.get('s'), 60);
  const c = clip(searchParams.get('c'), 20);
  const isEn = searchParams.get('l') === 'en';
  const color = CAT_COLOR[c] || '#b8934a';

  const footerText = isEn ? 'Calculate for free on simfinly.com' : 'Simulez gratuitement sur simfinly.com';

  // ── En-tête : marque + pastille de catégorie ──
  const header = [
    el({ display: 'flex', alignItems: 'center' }, [
      el({ width: 14, height: 14, borderRadius: 4, backgroundColor: '#e8c06a', marginRight: 14, display: 'flex' }, ''),
      el({ fontSize: 30, fontWeight: 700, color: '#e8c06a', display: 'flex' }, 'simfinly.com'),
    ]),
  ];
  if (c) {
    header.push(el({
      marginTop: 18, fontSize: 22, fontWeight: 600, color, display: 'flex',
      border: `2px solid ${color}`, borderRadius: 999, padding: '6px 18px', alignSelf: 'flex-start',
    }, c));
  }

  let middle;
  if (v) {
    // ── Carte de résultat : liseré d'accent + valeur mise en avant ──
    const inner = [];
    if (t) inner.push(el({ fontSize: 38, fontWeight: 600, color: '#c8cedb', marginBottom: 10, display: 'flex' }, t));
    inner.push(el({ fontSize: 110, fontWeight: 800, color: '#e8c06a', lineHeight: 1, display: 'flex' }, v));
    if (s) inner.push(el({ fontSize: 26, color: '#9aa4b2', marginTop: 14, display: 'flex' }, s));
    middle = el({
      display: 'flex', flexDirection: 'column',
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderLeft: `10px solid ${color}`,
      borderRadius: 20, padding: '40px 44px',
    }, inner);
  } else {
    // ── Carte de page : titre en grand ──
    const inner = [];
    if (t) inner.push(el({ fontSize: 64, fontWeight: 800, lineHeight: 1.1, display: 'flex', color: '#f4f1ea' }, t));
    if (s) inner.push(el({ fontSize: 28, color: '#9aa4b2', marginTop: 12, display: 'flex' }, s));
    middle = el({ display: 'flex', flexDirection: 'column' }, inner);
  }

  const tree = el(
    {
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      backgroundColor: '#060e1c', color: '#f4f1ea', padding: '64px',
      justifyContent: 'space-between', fontFamily: 'sans-serif',
    },
    [
      el({ display: 'flex', flexDirection: 'column' }, header),
      middle,
      el({ display: 'flex', alignItems: 'center' }, [
        el({ width: 28, height: 3, borderRadius: 2, backgroundColor: color, marginRight: 14, display: 'flex' }, ''),
        el({ fontSize: 22, color: '#6b7280', display: 'flex' }, footerText),
      ]),
    ]
  );

  return new ImageResponse(tree, {
    width: 1200,
    height: 630,
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800' },
  });
}
