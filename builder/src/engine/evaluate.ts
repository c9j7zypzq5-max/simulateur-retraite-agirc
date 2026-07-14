// Moteur d'évaluation des formules — expr-eval-fork (fork patché d'expr-eval :
// corrige la pollution de prototype et l'injection de code, sandboxé, pas
// d'accès au scope JS) enrichi des fonctions promises par le produit :
// IF/AND/OR/MIN/MAX/ROUND et BAREME(table, valeur) pour les barèmes
// progressifs français.
//
// Contrat d'erreur : une formule invalide ne jette jamais jusqu'à l'UI ;
// evaluateSchema renvoie NaN pour la valeur concernée et le message dans
// `errors` (affiché dans l'éditeur, silencieux sur la page publique).

import { Parser } from 'expr-eval-fork';
import type { CalculatorSchema, Tranche } from '../schema/types';

// Montant progressif : somme de (part de la valeur dans chaque tranche) × taux.
// C'est le calcul de l'impôt sur le revenu, des émoluments de notaire, etc.
// Cas limites : tableau vide → 0 ; valeur négative ou nulle → 0 ; tranches
// non bornées uniquement en dernière position (jusqua: null).
export function bareme(tranches: Tranche[], valeur: number): number {
  if (!Array.isArray(tranches) || tranches.length === 0) return 0;
  if (!Number.isFinite(valeur) || valeur <= 0) return 0;
  let total = 0;
  let plancher = 0;
  for (const t of tranches) {
    const plafond = t.jusqua == null ? Infinity : t.jusqua;
    if (plafond <= plancher) continue; // tranche mal ordonnée : ignorée
    const part = Math.min(valeur, plafond) - plancher;
    if (part > 0) total += part * t.taux;
    if (valeur <= plafond) break;
    plancher = plafond;
  }
  return total;
}

function buildParser(baremes: Record<string, Tranche[]>): Parser {
  // Défense en profondeur : les formules n'ont aucune raison d'assigner quoi
  // que ce soit (vecteur historique de pollution de prototype d'expr-eval).
  const parser = new Parser({ operators: { assignment: false } });
  const fns = parser.functions as Record<string, unknown>;
  fns.IF = (cond: number, a: number, b: number) => (cond ? a : b);
  fns.AND = (...args: number[]) => (args.every(Boolean) ? 1 : 0);
  fns.OR = (...args: number[]) => (args.some(Boolean) ? 1 : 0);
  fns.MIN = Math.min;
  fns.MAX = Math.max;
  fns.ROUND = (v: number, d = 0) => {
    const f = Math.pow(10, d);
    return Math.round(v * f) / f;
  };
  // Fonctions mathématiques usuelles pour les calculs financiers.
  fns.ABS = Math.abs;
  fns.SQRT = Math.sqrt;
  fns.POW = Math.pow;
  fns.FLOOR = Math.floor;
  fns.CEIL = Math.ceil;
  fns.LOG = Math.log; // logarithme naturel
  fns.MOD = (a: number, b: number) => (b === 0 ? NaN : a % b);
  // Les barèmes sont référencés par nom : BAREME("ir2026", revenu).
  fns.BAREME = (nom: string, valeur: number) => {
    const table = baremes[nom];
    if (!table) throw new Error(`Barème inconnu : "${nom}"`);
    return bareme(table, valeur);
  };
  return parser;
}

export interface EvaluationResult {
  // Toutes les valeurs nommées : champs + variables calculées.
  scope: Record<string, number>;
  // Valeurs du bloc résultats, dans l'ordre du schéma (NaN si erreur).
  results: number[];
  // Valeurs du graphique, dans l'ordre (vide si pas de graphique).
  chartValues: number[];
  // Messages d'erreur par formule fautive, clé = "variables.tva" | "results.0" | "chart.1".
  errors: Record<string, string>;
}

// Évalue le schéma complet pour un jeu de valeurs de champs.
// Les variables s'évaluent dans l'ordre du schéma et peuvent référencer les
// champs et les variables précédentes (modèle tableur, pas de résolution de
// dépendances : la simplicité prime, l'utilisateur ordonne ses variables).
export function evaluateSchema(
  schema: CalculatorSchema,
  values: Record<string, number>,
): EvaluationResult {
  const parser = buildParser(schema.baremes);
  const scope: Record<string, number> = {};
  for (const f of schema.fields) {
    const v = values[f.id];
    scope[f.id] = Number.isFinite(v) ? v : f.default;
  }
  const errors: Record<string, string> = {};

  const evalFormula = (formula: string, key: string): number => {
    try {
      const raw = parser.parse(formula).evaluate(scope as never);
      const n = Number(raw);
      if (!Number.isFinite(n)) throw new Error('résultat non fini (division par zéro ?)');
      return n;
    } catch (e) {
      errors[key] = e instanceof Error ? e.message : String(e);
      return NaN;
    }
  };

  for (const v of schema.variables) {
    scope[v.name] = evalFormula(v.formula, `variables.${v.name}`);
  }
  const results = schema.results.map((r, i) => evalFormula(r.formula, `results.${i}`));
  const chartValues = (schema.chart?.items ?? []).map((c, i) =>
    evalFormula(c.formula, `chart.${i}`),
  );

  return { scope, results, chartValues, errors };
}
