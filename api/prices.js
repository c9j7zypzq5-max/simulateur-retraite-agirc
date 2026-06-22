export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { tickers, from, to } = req.query;
  if (!tickers) return res.status(400).json({ error: 'tickers manquant' });

  const tickerList = String(tickers).split(',').slice(0, 5).map(t => t.trim()).filter(Boolean);
  const fromStr = from || '2015-01';
  const toStr   = to   || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const [fy, fm] = fromStr.split('-').map(Number);
  const [ty, tm] = toStr.split('-').map(Number);

  const period1 = Math.floor(new Date(fy, fm - 1, 1).getTime() / 1000);
  const period2 = Math.floor(new Date(ty, tm, 0, 23, 59, 59).getTime() / 1000);

  const results = {};

  await Promise.all(tickerList.map(async (ticker) => {
    try {
      const url =
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
        `?interval=1mo&period1=${period1}&period2=${period2}&includeAdjustedClose=true`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let resp;
      try {
        resp = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; simfinly/1.0)' },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!resp.ok) {
        results[ticker] = { error: `HTTP ${resp.status}` };
        return;
      }

      const json = await resp.json();
      const result = json?.chart?.result?.[0];

      if (!result || !result.timestamp) {
        results[ticker] = { error: json?.chart?.error?.description || 'Ticker invalide ou données indisponibles' };
        return;
      }

      const timestamps = result.timestamp;
      const adjCloses  = result.indicators?.adjclose?.[0]?.adjclose;
      const rawCloses  = result.indicators?.quote?.[0]?.close;

      const pts = [];
      for (let i = 0; i < timestamps.length; i++) {
        const adj = adjCloses?.[i];
        const raw = rawCloses?.[i];
        const price = adj ?? raw;
        if (price == null || isNaN(price) || price <= 0) continue;
        const d = new Date(timestamps[i] * 1000);
        pts.push({
          date:     `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          adjClose: (adj != null && !isNaN(adj) && adj > 0) ? adj : (raw ?? null),
          close:    (raw != null && !isNaN(raw) && raw > 0) ? raw : null,
        });
      }

      results[ticker] = pts.length >= 2 ? pts : { error: 'Données insuffisantes pour cette période' };
    } catch (e) {
      results[ticker] = { error: e.message };
    }
  }));

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  res.json(results);
}
