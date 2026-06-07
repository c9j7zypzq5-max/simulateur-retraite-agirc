// Page de partage : sert un HTML minimal portant les balises Open Graph/Twitter
// (avec une image de résultat générée par /api/og), puis redirige l'internaute
// vers le simulateur. Permet aux aperçus sociaux d'afficher le résultat alors
// que le site est une SPA pré-rendue par route (et non par paramètres).
//
// GET /api/share?to=<chemin simulateur+params>&t=<titre>&v=<valeur>&s=<sous-titre>&c=<catégorie>

const BASE = 'https://www.mesimulateurs.fr';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function handler(req, res) {
  const { to = '/', t = '', v = '', s = '', c = '' } = req.query || {};

  // Anti open-redirect : on ne redirige que vers notre propre domaine.
  let dest = String(to);
  if (dest.startsWith('http')) {
    dest = dest.startsWith(BASE) ? dest : BASE + '/';
  } else {
    dest = BASE + (dest.startsWith('/') ? '' : '/') + dest;
  }

  const q = new URLSearchParams({ t, v, s, c }).toString();
  const ogImg = `${BASE}/api/og?${q}`;
  const title = `${t}${v ? ` : ${v}` : ''} · mesimulateurs.fr`;
  const desc = s || 'Simulation réalisée sur mesimulateurs.fr — faites la vôtre gratuitement.';

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="mesimulateurs.fr">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta property="og:url" content="${esc(dest)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImg)}">
<link rel="canonical" href="${esc(dest)}">
<meta http-equiv="refresh" content="0;url=${esc(dest)}">
</head><body style="font-family:sans-serif;background:#060e1c;color:#f4f1ea;text-align:center;padding:80px 20px">
<script>location.replace(${JSON.stringify(dest)})</script>
<p>Redirection vers la simulation… <a style="color:#e8c06a" href="${esc(dest)}">Continuer</a></p>
</body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(html);
}
