// Génération de slug pour l'URL publique — kebab-case ASCII, dérivé du titre.

export function slugify(text: string): string {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'calculateur';
}

// Suffixe court pour désambiguïser en cas de collision (retry côté appelant).
export function withSuffix(slug: string, n: number): string {
  return n <= 1 ? slug : `${slug}-${n}`;
}
