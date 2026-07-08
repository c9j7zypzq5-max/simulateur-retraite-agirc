// Fabriques : calculateur vierge et exemple de démarrage de l'éditeur.

import type { Calculator, CalculatorSchema } from './types';
import { DEFAULT_THEME } from './types';

export function newId(): string {
  return crypto.randomUUID();
}

// Exemple chargé au premier lancement : mensualité de prêt, le cas d'usage n°1.
// Sert aussi de démonstration des variables et du graphique.
export const SAMPLE_SCHEMA: CalculatorSchema = {
  fields: [
    { id: 'montant', type: 'slider', label: 'Montant emprunté', default: 15000, min: 1000, max: 100000, step: 500, suffix: '€' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 5, min: 1, max: 15, step: 1, suffix: 'ans' },
    { id: 'taux', type: 'number', label: 'Taux annuel', default: 4.5, min: 0, max: 20, step: 0.1, suffix: '%' },
  ],
  variables: [
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    {
      name: 'mensualite',
      formula: 'IF(tauxMensuel == 0, montant / nbMois, montant * tauxMensuel / (1 - (1 + tauxMensuel)^(-nbMois)))',
    },
    { name: 'coutCredit', formula: 'mensualite * nbMois - montant' },
  ],
  results: [
    { label: 'Mensualité', formula: 'mensualite', format: 'eur', size: 'lg' },
    { label: 'Coût total du crédit', formula: 'coutCredit', format: 'eur', size: 'md' },
    { label: 'Total remboursé', formula: 'montant + coutCredit', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Capital', formula: 'montant' },
      { label: 'Intérêts', formula: 'coutCredit' },
    ],
  },
  baremes: {},
};

export function blankCalculator(title: string, schema?: CalculatorSchema): Calculator {
  const now = new Date().toISOString();
  return {
    id: newId(),
    slug: null,
    title,
    status: 'draft',
    theme: { ...DEFAULT_THEME },
    schema: schema ?? { fields: [], variables: [], results: [], baremes: {} },
    createdAt: now,
    updatedAt: now,
  };
}
