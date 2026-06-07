import { ImageResponse } from '@vercel/og';

// Image Open Graph dynamique (1200×630) générée à la volée à partir du résultat
// d'une simulation, via @vercel/og (Edge runtime, sans module natif).
// Utilisée comme aperçu de partage social par /api/share.
//
// GET /api/og?t=<titre>&v=<valeur>&s=<sous-titre>&c=<catégorie>

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
  const color = CAT_COLOR[c] || '#b8934a';

  const header = [el({ fontSize: 30, fontWeight: 700, color: '#e8c06a', display: 'flex' }, 'mesimulateurs.fr')];
  if (c) header.push(el({ marginTop: 16, fontSize: 24, fontWeight: 600, color, display: 'flex' }, c));

  const middle = [];
  if (v) {
    // Carte de résultat : titre moyen + valeur en grand.
    if (t) middle.push(el({ fontSize: 44, fontWeight: 700, marginBottom: 6, display: 'flex' }, t));
    middle.push(el({ fontSize: 112, fontWeight: 800, color: '#e8c06a', display: 'flex' }, v));
    if (s) middle.push(el({ fontSize: 28, color: '#9aa4b2', marginTop: 8, display: 'flex' }, s));
  } else {
    // Carte de page : titre en grand.
    if (t) middle.push(el({ fontSize: 64, fontWeight: 800, lineHeight: 1.1, display: 'flex', color: '#f4f1ea' }, t));
    if (s) middle.push(el({ fontSize: 28, color: '#9aa4b2', marginTop: 12, display: 'flex' }, s));
  }

  const tree = el(
    {
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      backgroundColor: '#060e1c', color: '#f4f1ea', padding: '64px',
      justifyContent: 'space-between', fontFamily: 'sans-serif',
    },
    [
      el({ display: 'flex', flexDirection: 'column' }, header),
      el({ display: 'flex', flexDirection: 'column' }, middle),
      el({ fontSize: 22, color: '#6b7280', display: 'flex' }, 'Simulez gratuitement sur mesimulateurs.fr'),
    ]
  );

  return new ImageResponse(tree, {
    width: 1200,
    height: 630,
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800' },
  });
}
