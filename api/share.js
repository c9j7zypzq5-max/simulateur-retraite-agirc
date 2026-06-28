// Page de partage : sert un HTML minimal portant les balises Open Graph/Twitter
// (avec une image de résultat générée par /api/og), puis redirige l'internaute
// vers le simulateur.
//
// GET  /api/share?to=...&t=...&v=...&s=...&c=...  → social preview HTML
// POST /api/share?action=create                   → créer un lien public court
// GET  /api/share?action=get&id=xxx               → lire les données d'un lien court

const BASE = 'https://www.simfinly.com';

function setCors(req, res) {
  const origin = req.headers['origin'] || '';
  if (origin === BASE || origin.endsWith('.simfinly.com')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function nanoid8() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

async function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key, { auth: { persistSession: false } });
}

const MAX_PARAMS_LENGTH = 8000;
const MAX_TITLE_LENGTH  = 300;

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const action = req.query?.action;

  // ── POST /api/share?action=create ─────────────────────────────────────────
  if (req.method === 'POST' && action === 'create') {
    let body = req.body;
    if (typeof body === 'string') {
      if (body.length > MAX_PARAMS_LENGTH + 1000) { res.status(413).json({ error: 'Payload too large' }); return; }
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { params, title, highlight } = body || {};
    if (!params) { res.status(400).json({ error: 'params required' }); return; }
    if (String(params).length > MAX_PARAMS_LENGTH) { res.status(400).json({ error: 'params too large' }); return; }
    if (title && String(title).length > MAX_TITLE_LENGTH) { res.status(400).json({ error: 'title too large' }); return; }

    const sb = await getSupabase();
    if (!sb) { res.status(503).json({ error: 'not configured' }); return; }

    const id = nanoid8();
    const { error } = await sb.from('public_links').insert({
      id,
      params: String(params),
      title: title || null,
      highlight: highlight || null,
    });
    if (error) { res.status(500).json({ error: error.message }); return; }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ id });
    return;
  }

  // ── GET /api/share?action=get&id=xxx ──────────────────────────────────────
  if (req.method === 'GET' && action === 'get') {
    const id = req.query?.id;
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    const sb = await getSupabase();
    if (!sb) { res.status(503).json({ error: 'not configured' }); return; }

    const { data, error } = await sb.from('public_links').select('params,title,highlight').eq('id', id).maybeSingle();
    if (error || !data) { res.status(404).json({ error: 'not found' }); return; }

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(data);
    return;
  }

  // ── GET /api/share (social preview HTML) ──────────────────────────────────
  const { to = '/', t = '', v = '', s = '', c = '', l = 'fr' } = req.query || {};
  const isEn = String(l) === 'en';

  let dest = String(to);
  if (dest.startsWith('http')) {
    dest = dest.startsWith(BASE) ? dest : BASE + '/';
  } else {
    dest = BASE + (dest.startsWith('/') ? '' : '/') + dest;
  }

  const q = new URLSearchParams({ t, v, s, c, l: isEn ? 'en' : 'fr' }).toString();
  const ogImg = `${BASE}/api/og?${q}`;
  const title = `${t}${v ? ` : ${v}` : ''} · simfinly.com`;
  const desc = s || (isEn
    ? 'Simulation made on simfinly.com — make yours for free.'
    : 'Simulation réalisée sur simfinly.com — faites la vôtre gratuitement.');
  const ogLocale = isEn ? 'en_US' : 'fr_FR';
  const redirectLine = isEn
    ? `Redirecting to the simulation… <a style="color:#e8c06a" href="${esc(dest)}">Continue</a>`
    : `Redirection vers la simulation… <a style="color:#e8c06a" href="${esc(dest)}">Continuer</a>`;

  const html = `<!DOCTYPE html><html lang="${isEn ? 'en' : 'fr'}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="simfinly.com">
<meta property="og:locale" content="${ogLocale}">
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
<p>${redirectLine}</p>
</body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(html);
}
