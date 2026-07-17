// Continuité du parcours d'activation — deux mécanismes de persistance locale
// (localStorage, pas de réseau) qui suppriment la friction « créer un compte
// juste pour voir » :
//
//  1. Brouillon d'essai (`localDraft`) : le calculateur travaillé en mode
//     invité (route /essai), autosauvé à chaque frappe pour survivre à un
//     rechargement. Une seule brouillon d'essai à la fois.
//
//  2. Intention en attente (`pendingIntent`) : ce que l'utilisateur voulait
//     faire au moment de s'inscrire — partir d'un modèle, ou publier son
//     brouillon d'essai. Posée avant la redirection vers /login, consommée
//     UNE fois par le Dashboard après connexion (y compris après le
//     aller-retour d'un lien magique / email de confirmation, d'où
//     localStorage et non sessionStorage).

import type { CalculatorSchema, Theme } from '../schema/types';

const DRAFT_KEY = 'builder:localDraft';
const INTENT_KEY = 'builder:pendingIntent';

export interface LocalDraft {
  title: string;
  schema: CalculatorSchema;
  theme: Theme;
  hideBadge: boolean;
  captureEmail: boolean;
  notifyEmail: boolean;
}

export type PendingIntent =
  | { type: 'template'; templateId: string }
  | { type: 'draft'; draft: LocalDraft };

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / mode privé : le mode invité reste utilisable, sans persistance */
  }
}

export function getLocalDraft(): LocalDraft | null {
  return read<LocalDraft>(DRAFT_KEY);
}

export function saveLocalDraft(draft: LocalDraft): void {
  write(DRAFT_KEY, draft);
}

export function clearLocalDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function setPendingIntent(intent: PendingIntent): void {
  write(INTENT_KEY, intent);
}

export function hasPendingIntent(): boolean {
  try {
    return localStorage.getItem(INTENT_KEY) !== null;
  } catch {
    return false;
  }
}

// Lit ET efface l'intention en attente : elle ne doit se rejouer qu'une fois.
export function consumePendingIntent(): PendingIntent | null {
  const intent = read<PendingIntent>(INTENT_KEY);
  try {
    localStorage.removeItem(INTENT_KEY);
  } catch {
    /* ignore */
  }
  return intent;
}
