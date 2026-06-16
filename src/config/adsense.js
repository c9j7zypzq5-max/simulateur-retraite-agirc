// Configuration AdSense centralisée.
//
// AD_CLIENT : identifiant éditeur (« publisher ID »), déjà associé au compte.
export const AD_CLIENT = 'ca-pub-1297423880558120';

// Identifiants de blocs (« ad slots ») à créer dans le tableau de bord AdSense
// une fois le compte approuvé (Annonces → Par unité d'annonce). Tant qu'aucun ID
// numérique valide n'est fourni, AdUnit n'injecte AUCUNE annonce : cela évite les
// requêtes invalides (l'ancien data-ad-slot="auto" ne fonctionnait pas) et le
// décalage de mise en page (layout shift).
//
// Deux façons de renseigner les slots, sans toucher au code, via des variables
// d'environnement Vite (Vercel → Settings → Environment Variables) :
//
//   1. VITE_ADSENSE_SLOT   → un seul slot par défaut, réutilisé partout.
//                            Ex. : VITE_ADSENSE_SLOT=1234567890
//
//   2. VITE_ADSENSE_SLOTS  → des slots distincts par emplacement (meilleur suivi
//                            des perfs), au format CSV "emplacement:slot" :
//                            home:1234567890,article:0987654321,sim-mid:...,sim-bottom:...
//
// resolveAdSlot privilégie un slot explicite passé en prop, puis le slot de
// l'emplacement (placement), puis le slot par défaut.

const DEFAULT_SLOT = (import.meta.env.VITE_ADSENSE_SLOT || '').trim();

const NAMED_SLOTS = Object.fromEntries(
  (import.meta.env.VITE_ADSENSE_SLOTS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(pair => {
      const i = pair.indexOf(':');
      return i === -1 ? [pair, ''] : [pair.slice(0, i).trim(), pair.slice(i + 1).trim()];
    })
    .filter(([k, v]) => k && v)
);

// Un slot AdSense est un identifiant numérique (au moins 6 chiffres).
const isValidSlot = (s) => typeof s === 'string' && /^\d{6,}$/.test(s);

// Renvoie l'ID de slot à utiliser, ou null si aucun n'est valablement configuré.
export function resolveAdSlot(slot, placement) {
  if (isValidSlot(slot)) return slot;
  if (placement && isValidSlot(NAMED_SLOTS[placement])) return NAMED_SLOTS[placement];
  if (isValidSlot(DEFAULT_SLOT)) return DEFAULT_SLOT;
  return null;
}
