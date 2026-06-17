// Proxy de logos d'entreprise — same-origin pour ne jamais "tainter" le canvas
// (indispensable pour que MediaRecorder.captureStream fonctionne dans la vidéo).
// Essaie plusieurs sources et renvoie les octets de la première qui répond.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const domain = String(req.query.domain || '').trim().toLowerCase();
  // Validation stricte : un nom de domaine simple, rien d'autre.
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain) || domain.length > 100) {
    return res.status(400).end();
  }

  // Google favicons en premier : rapide et fiable. Clearbit (API publique fermée
  // en 2025) en dernier, au cas où il revienne ou pour certains domaines.
  const sources = [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://logo.clearbit.com/${domain}?size=128&format=png`,
  ];

  for (const url of sources) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 2800);
      const resp = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; simfinly/1.0)' },
      });
      clearTimeout(timer);

      if (!resp.ok) continue;
      const ct = resp.headers.get('content-type') || '';
      if (!ct.startsWith('image/')) continue;

      const buf = Buffer.from(await resp.arrayBuffer());
      // Un favicon "globe" par défaut de Google fait ~100-300 octets ; on accepte
      // tout ce qui dépasse 70 octets pour rester permissif.
      if (buf.length < 70) continue;

      res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 's-maxage=2592000, stale-while-revalidate=86400'); // 30j CDN
      return res.status(200).send(buf);
    } catch {
      // source suivante
    }
  }

  res.status(404).end();
}
