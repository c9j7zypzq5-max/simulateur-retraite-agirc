// OG dynamiques pour les crawlers sociaux (Facebook, Twitter/X, LinkedIn,
// Slack, WhatsApp…). Ces bots n'exécutent pas le JS : la SPA /s/:slug leur
// renverrait un <head> vide, donc un partage sans titre ni description. Le
// rewrite vercel.json route les user-agents de ces bots vers ce handler, qui
// rend un HTML minimal porteur des balises meta du calculateur.
//
// Les moteurs de recherche (Googlebot/bingbot) ne sont PAS routés ici : ils
// exécutent le JS et doivent voir la vraie page interactive (pas de cloaking).
//
// Env (exposées aux fonctions serverless même préfixées VITE_ — le préfixe ne
// concerne que le bundling client) : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Échappement pour contexte HTML (texte ET attribut entre guillemets doubles).
// Le titre est saisi par l'utilisateur : sans échappement, un titre du type
// `"><script>` serait une injection dans la page servie aux bots.
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fetchCalculator(slug) {
  if (!SUPABASE_URL || !ANON_KEY) return null;
  const params = new URLSearchParams({
    slug: `eq.${slug}`,
    status: 'eq.published',
    select: 'title,schema',
    limit: '1',
  });
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/builder_calculators?${params}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// Description dérivée des libellés de résultats du calculateur, sinon générique.
export function describe(calc) {
  const labels = (calc?.schema?.results ?? [])
    .map((r) => r?.label)
    .filter((l) => typeof l === 'string' && l.trim())
    .slice(0, 3);
  if (labels.length > 0) {
    return `Calculez ${labels.join(', ').toLowerCase()} en ligne. Simulateur gratuit propulsé par Simfinly.`;
  }
  return 'Simulateur interactif gratuit, propulsé par Simfinly.';
}

export default async function handler(req, res) {
  const slug = String(req.query.slug || '').slice(0, 200);
  const calc = slug ? await fetchCalculator(slug) : null;

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'app.simfinly.com';
  const pageUrl = `https://${host}/s/${encodeURIComponent(slug)}`;
  const imageUrl = `https://${host}/og-cover.png`;
  const title = calc?.title || 'Simulateur Simfinly';
  const description = describe(calc);

  const t = esc(title);
  const d = esc(description);
  const u = esc(pageUrl);
  const img = esc(imageUrl);

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${u}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Simfinly" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${u}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />
</head>
<body>
<h1>${t}</h1>
<p>${d}</p>
<p><a href="${u}">Ouvrir le simulateur</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache court côté CDN : les bots re-déréférencent, le titre peut changer.
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(html);
}
