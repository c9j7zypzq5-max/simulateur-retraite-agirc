// Helper Pexels partagé (publish-article, generate-article, fix-article-images).
// Récupère un *pool* de photos libres de droits par catégorie puis en pioche
// une distincte selon un index, afin que deux articles d'une même catégorie
// n'aient pas systématiquement la même image.

const QUERIES = {
  'Épargne': 'savings money coins', 'Retraite': 'retirement senior couple',
  'Immobilier': 'real estate house keys', 'FIRE': 'financial freedom travel',
  'Budget': 'budget planning calculator', 'Fiscalité': 'tax documents calculator',
  'Finances': 'finance investing chart',
};

const PER_PAGE = 30;

// Récupère jusqu'à PER_PAGE photos paysage pour une catégorie.
export async function pexelsPool(category) {
  if (!process.env.PEXELS_API_KEY) return [];
  const q = QUERIES[category] || 'personal finance';
  try {
    const r = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${PER_PAGE}&orientation=landscape&size=medium`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    if (!r.ok) return [];
    return (await r.json()).photos || [];
  } catch { return []; }
}

// Met en forme une photo Pexels au format stocké dans l'article.
export function toImage(photo) {
  if (!photo) return null;
  return {
    image: photo.src?.large || photo.src?.medium,
    imageAlt: photo.alt || '',
    imageCredit: photo.photographer ? `Photo : ${photo.photographer} / Pexels` : 'Pexels',
  };
}

// Pioche une image distincte dans le pool selon `index` (ex. compteur d'articles).
export async function pexelsImage(category, index = 0) {
  const pool = await pexelsPool(category);
  if (!pool.length) return null;
  const i = ((index % pool.length) + pool.length) % pool.length;
  return toImage(pool[i]);
}
