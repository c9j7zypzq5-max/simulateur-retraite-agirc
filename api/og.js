import { Resvg } from '@resvg/resvg-js';

// Image Open Graph dynamique (1200×630) générée à la volée à partir du résultat
// d'une simulation. Utilisée comme aperçu de partage social via /api/share.
//
// GET /api/og?t=<titre>&v=<valeur>&s=<sous-titre>&c=<catégorie>

const CAT_COLOR = {
  Retraite: '#818cf8', Immobilier: '#a855f7', 'Impôts': '#f97316',
  Finances: '#22c55e', FIRE: '#ef4444', Budget: '#14b8a6',
};

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function clip(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export default function handler(req, res) {
  const { t = '', v = '', s = '', c = '' } = req.query || {};
  const color = CAT_COLOR[c] || '#b8934a';
  const title = esc(clip(t, 46));
  const value = esc(clip(v, 22));
  const sub = esc(clip(s, 60));
  const cat = esc(clip(c, 20));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e8c06a"/><stop offset="1" stop-color="#b8934a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#060e1c"/>
  <rect x="0" y="0" width="1200" height="8" fill="url(#g)"/>
  <text x="64" y="92" font-family="DM Sans, Arial, sans-serif" font-size="30" font-weight="700" fill="#e8c06a">mesimulateurs.fr</text>
  ${cat ? `<rect x="64" y="120" rx="16" ry="16" width="${60 + cat.length * 13}" height="40" fill="${color}" opacity="0.15"/>
  <text x="84" y="147" font-family="DM Sans, Arial, sans-serif" font-size="22" font-weight="600" fill="${color}">${cat}</text>` : ''}
  <text x="64" y="248" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#f4f1ea">${title}</text>
  <text x="64" y="430" font-family="Georgia, serif" font-size="120" font-weight="700" fill="url(#g)">${value}</text>
  ${sub ? `<text x="64" y="492" font-family="DM Sans, Arial, sans-serif" font-size="30" fill="#9aa4b2">${sub}</text>` : ''}
  <text x="64" y="582" font-family="DM Sans, Arial, sans-serif" font-size="24" fill="#6b7280">Simulez gratuitement sur mesimulateurs.fr</text>
</svg>`;

  try {
    const png = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
      font: { loadSystemFonts: true },
      background: '#060e1c',
    }).render().asPng();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800');
    res.status(200).send(png);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
