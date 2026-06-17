export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { q } = req.query;
  if (!q || String(q).trim().length < 2) return res.json([]);

  try {
    const url =
      `https://query2.finance.yahoo.com/v1/finance/search` +
      `?q=${encodeURIComponent(q)}&lang=fr-FR&region=FR&quotesCount=8&newsCount=0&enableFuzzyQuery=true`;

    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; simfinly/1.0)' },
    });

    if (!resp.ok) return res.json([]);

    const json = await resp.json();
    const allowed = new Set(['EQUITY', 'ETF', 'CRYPTOCURRENCY', 'FUTURE', 'INDEX', 'MUTUALFUND']);

    const results = (json.quotes || [])
      .filter(item => allowed.has(item.quoteType))
      .slice(0, 8)
      .map(item => ({
        ticker:   item.symbol,
        label:    item.shortname || item.longname || item.symbol,
        exchange: item.exchange || '',
        type:     item.quoteType || '',
      }));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    res.json(results);
  } catch (e) {
    res.json([]);
  }
}
