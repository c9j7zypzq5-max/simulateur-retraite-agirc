// Visibilité conditionnelle d'un champ — logique partagée entre le moteur
// (neutralise les champs masqués) et le rendu (les cache). Une seule source de
// vérité pour éviter toute divergence entre calcul et affichage.

import type { Field } from './types';

export function fieldVisible(field: Field, scope: Record<string, number>): boolean {
  const cond = field.showIf;
  if (!cond) return true;
  const left = scope[cond.field];
  // Champ référencé inconnu (supprimé, faute de frappe) → on affiche : mieux
  // vaut montrer un champ de trop que d'en masquer un par erreur.
  if (!Number.isFinite(left)) return true;
  const right = cond.value;
  switch (cond.op) {
    case '==': return left === right;
    case '!=': return left !== right;
    case '>': return left > right;
    case '>=': return left >= right;
    case '<': return left < right;
    case '<=': return left <= right;
  }
}
