// Détection du pays du visiteur via l'en-tête géo injecté par Vercel
// (x-vercel-ip-country). Utilisé par le contexte devise côté client pour
// choisir la devise par défaut. Aucune donnée personnelle stockée.
export default function handler(req, res) {
  const country =
    req.headers['x-vercel-ip-country'] ||
    req.headers['x-country'] ||
    '';
  // Pas de cache : la réponse dépend de l'IP de l'appelant.
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({ country: String(country).toUpperCase().slice(0, 2) });
}
