// Templates de calculateurs — convertis depuis les simulateurs du site
// principal (ne pas réécrire les règles : chaque schéma référence son
// fichier source). Servent au « Nouveau » du dashboard ET aux démos
// interactives de la landing.

import type { CalculatorSchema } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  schema: CalculatorSchema;
}

// 1. Mensualités de prêt — depuis src/utils/amortization.js (mensualite()).
const PRET: CalculatorSchema = {
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

// 2. Frais de notaire — depuis src/pages/simulateurs/FraisNotaire.jsx :
// barème des émoluments (arrêté du 28/02/2020), DMTO 2025 (hausse votée dans
// la majorité des départements), CSI 0,10 %, débours forfaitaires 1 000 €.
// Le radio « type de bien » porte directement le taux DMTO en valeur.
const NOTAIRE: CalculatorSchema = {
  fields: [
    { id: 'prix', type: 'slider', label: 'Prix du bien', default: 250000, min: 50000, max: 1000000, step: 5000, suffix: '€' },
    {
      id: 'tauxDmto',
      type: 'radio',
      label: 'Type de bien',
      default: 0.0632,
      options: [
        { label: 'Ancien', value: 0.0632 },
        { label: 'Ancien (départements sans hausse 2025)', value: 0.0581 },
        { label: 'Neuf', value: 0.00715 },
      ],
    },
    { id: 'mobilier', type: 'number', label: 'Mobilier inclus (déduit des droits)', default: 0, min: 0, step: 500, suffix: '€' },
  ],
  variables: [
    { name: 'assiette', formula: 'MAX(prix - mobilier, 0)' },
    { name: 'droits', formula: 'assiette * tauxDmto' },
    { name: 'emoluments', formula: 'BAREME("emoluments", assiette) * 1.2' },
    { name: 'csiDebours', formula: 'assiette * 0.001 + 1000' },
    { name: 'fraisTotal', formula: 'droits + emoluments + csiDebours' },
  ],
  results: [
    { label: 'Frais de notaire estimés', formula: 'fraisTotal', format: 'eur', size: 'lg' },
    { label: 'Droits de mutation', formula: 'droits', format: 'eur', size: 'md' },
    { label: 'Émoluments du notaire TTC', formula: 'emoluments', format: 'eur', size: 'md' },
    { label: 'Part du prix du bien', formula: 'fraisTotal / prix * 100', format: 'pct', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Droits de mutation', formula: 'droits' },
      { label: 'Émoluments TTC', formula: 'emoluments' },
      { label: 'CSI + débours', formula: 'csiDebours' },
    ],
  },
  baremes: {
    emoluments: [
      { jusqua: 6500, taux: 0.0387 },
      { jusqua: 17000, taux: 0.01596 },
      { jusqua: 60000, taux: 0.01064 },
      { jusqua: null, taux: 0.00799 },
    ],
  },
};

// 3. TJM freelance → net mensuel — micro-BNC depuis
// src/pages/simulateurs/FreelanceVsSalarie.jsx (cotisations 21,1 % du CA,
// abattement 34 %) + barème IR 2026 de src/data/tauxFiscaux.js.
const TJM: CalculatorSchema = {
  fields: [
    { id: 'tjm', type: 'slider', label: 'Taux journalier (TJM)', default: 500, min: 200, max: 1200, step: 10, suffix: '€' },
    { id: 'joursParMois', type: 'slider', label: 'Jours facturés par mois', default: 18, min: 1, max: 22, step: 1, suffix: 'j' },
  ],
  variables: [
    { name: 'caAnnuel', formula: 'tjm * joursParMois * 12' },
    { name: 'cotisations', formula: 'caAnnuel * 0.211' },
    { name: 'impot', formula: 'BAREME("ir2026", caAnnuel * 0.66)' },
    { name: 'netAnnuel', formula: 'caAnnuel - cotisations - impot' },
  ],
  results: [
    { label: 'Net mensuel après impôt', formula: 'netAnnuel / 12', format: 'eur', size: 'lg' },
    { label: 'CA annuel', formula: 'caAnnuel', format: 'eur', size: 'md' },
    { label: 'Cotisations sociales', formula: 'cotisations', format: 'eur', size: 'md' },
    { label: 'Impôt sur le revenu', formula: 'impot', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Net', formula: 'netAnnuel' },
      { label: 'Cotisations', formula: 'cotisations' },
      { label: 'Impôt', formula: 'impot' },
    ],
  },
  baremes: {
    ir2026: [
      { jusqua: 11600, taux: 0 },
      { jusqua: 29579, taux: 0.11 },
      { jusqua: 84577, taux: 0.3 },
      { jusqua: 181917, taux: 0.41 },
      { jusqua: null, taux: 0.45 },
    ],
  },
};

export const TEMPLATES: Template[] = [
  {
    id: 'pret',
    name: 'Mensualités de prêt',
    description: 'Mensualité, coût total et part des intérêts d\'un crédit.',
    schema: PRET,
  },
  {
    id: 'notaire',
    name: 'Frais de notaire',
    description: 'Frais d\'acquisition immobilière : droits, émoluments, débours (barèmes 2026).',
    schema: NOTAIRE,
  },
  {
    id: 'tjm',
    name: 'TJM freelance → net mensuel',
    description: 'Du taux journalier au revenu net après cotisations et impôt (micro-BNC).',
    schema: TJM,
  },
];
