// Templates de calculateurs — convertis depuis les simulateurs du site
// principal (ne pas réécrire les règles : chaque schéma référence son
// fichier source). Servent au « Nouveau » du dashboard ET aux démos
// interactives de la landing.

import type { CalculatorSchema, Tranche } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  // Métier ciblé : sert à regrouper la galerie /modeles et à donner un angle
  // SEO (« calculateur pour <métier> »). Simple libellé, pas d'enum : la liste
  // de métiers est éditoriale, elle bougera plus souvent que le code.
  metier: string;
  schema: CalculatorSchema;
}

// Barème de l'impôt sur le revenu 2026 (src/data/tauxFiscaux.js du site
// principal) — partagé par les templates TJM et « Impôt sur le revenu ».
const IR2026: Tranche[] = [
  { jusqua: 11600, taux: 0 },
  { jusqua: 29579, taux: 0.11 },
  { jusqua: 84577, taux: 0.3 },
  { jusqua: 181917, taux: 0.41 },
  { jusqua: null, taux: 0.45 },
];

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
  baremes: { ir2026: IR2026 },
};

// 4. Capacité d'emprunt — inverse du calcul de mensualité (amortization.js) :
// on part de la mensualité maximale supportable (taux d'endettement 35 %,
// norme HCSF) pour remonter au capital empruntable. Cible : courtiers.
const CAPACITE: CalculatorSchema = {
  fields: [
    { id: 'revenu', type: 'slider', label: 'Revenus mensuels nets du foyer', default: 4000, min: 1000, max: 15000, step: 100, suffix: '€' },
    { id: 'charges', type: 'number', label: 'Charges de crédit déjà en cours', default: 0, min: 0, step: 50, suffix: '€' },
    { id: 'taux', type: 'number', label: 'Taux annuel', default: 3.5, min: 0, max: 20, step: 0.1, suffix: '%' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 20, min: 5, max: 25, step: 1, suffix: 'ans' },
  ],
  variables: [
    { name: 'mensualiteMax', formula: 'MAX(revenu * 0.35 - charges, 0)' },
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    {
      name: 'capacite',
      formula: 'IF(tauxMensuel == 0, mensualiteMax * nbMois, mensualiteMax * (1 - (1 + tauxMensuel)^(-nbMois)) / tauxMensuel)',
    },
  ],
  results: [
    { label: 'Capacité d\'emprunt', formula: 'capacite', format: 'eur', size: 'lg' },
    { label: 'Mensualité maximale', formula: 'mensualiteMax', format: 'eur', size: 'md' },
    { label: 'Coût total des intérêts', formula: 'mensualiteMax * nbMois - capacite', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Capital empruntable', formula: 'capacite' },
      { label: 'Intérêts', formula: 'mensualiteMax * nbMois - capacite' },
    ],
  },
  baremes: {},
};

// 5. Épargne & intérêts composés — capitalisation mensuelle d'un versement
// régulier + capital de départ. Cible : conseillers en gestion de patrimoine.
const EPARGNE: CalculatorSchema = {
  fields: [
    { id: 'capitalInitial', type: 'number', label: 'Capital de départ', default: 5000, min: 0, step: 500, suffix: '€' },
    { id: 'versement', type: 'slider', label: 'Versement mensuel', default: 200, min: 0, max: 2000, step: 10, suffix: '€' },
    { id: 'taux', type: 'number', label: 'Rendement annuel', default: 5, min: 0, max: 15, step: 0.1, suffix: '%' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 10, min: 1, max: 40, step: 1, suffix: 'ans' },
  ],
  variables: [
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    { name: 'facteur', formula: '(1 + tauxMensuel)^nbMois' },
    {
      name: 'valeurFinale',
      formula: 'IF(tauxMensuel == 0, capitalInitial + versement * nbMois, capitalInitial * facteur + versement * (facteur - 1) / tauxMensuel)',
    },
    { name: 'totalVerse', formula: 'capitalInitial + versement * nbMois' },
    { name: 'interets', formula: 'valeurFinale - totalVerse' },
  ],
  results: [
    { label: 'Capital final', formula: 'valeurFinale', format: 'eur', size: 'lg' },
    { label: 'Total versé', formula: 'totalVerse', format: 'eur', size: 'md' },
    { label: 'Intérêts gagnés', formula: 'interets', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Versements', formula: 'totalVerse' },
      { label: 'Intérêts', formula: 'interets' },
    ],
  },
  baremes: {},
};

// 6. Impôt sur le revenu 2026 — barème progressif appliqué au quotient
// familial (revenu / nombre de parts). Cible : experts-comptables, conseillers.
const IMPOT: CalculatorSchema = {
  fields: [
    { id: 'revenu', type: 'slider', label: 'Revenu net imposable du foyer', default: 30000, min: 0, max: 300000, step: 1000, suffix: '€' },
    { id: 'parts', type: 'number', label: 'Nombre de parts (quotient familial)', default: 1, min: 1, max: 10, step: 0.5 },
  ],
  variables: [
    { name: 'quotient', formula: 'revenu / parts' },
    { name: 'impot', formula: 'BAREME("ir2026", quotient) * parts' },
    { name: 'net', formula: 'revenu - impot' },
  ],
  results: [
    { label: 'Impôt sur le revenu', formula: 'impot', format: 'eur', size: 'lg' },
    { label: 'Revenu net après impôt', formula: 'net', format: 'eur', size: 'md' },
    { label: 'Taux moyen d\'imposition', formula: 'IF(revenu == 0, 0, impot / revenu * 100)', format: 'pct', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Net', formula: 'net' },
      { label: 'Impôt', formula: 'impot' },
    ],
  },
  baremes: { ir2026: IR2026 },
};

// 7. Devis peinture / rénovation — chiffrage au m² + forfait déplacement, TVA
// 10 % (rénovation logement >2 ans) ou 20 %. Cible : artisans du bâtiment.
const DEVIS: CalculatorSchema = {
  fields: [
    { id: 'surface', type: 'slider', label: 'Surface à traiter', default: 40, min: 1, max: 500, step: 1, suffix: 'm²' },
    { id: 'prixM2', type: 'number', label: 'Prix au m²', default: 25, min: 1, max: 200, step: 1, suffix: '€' },
    { id: 'deplacement', type: 'number', label: 'Forfait déplacement', default: 80, min: 0, step: 10, suffix: '€' },
    {
      id: 'tva',
      type: 'radio',
      label: 'TVA applicable',
      default: 0.1,
      options: [
        { label: 'Rénovation (10 %)', value: 0.1 },
        { label: 'Neuf / autre (20 %)', value: 0.2 },
      ],
    },
  ],
  variables: [
    { name: 'montantHT', formula: 'surface * prixM2 + deplacement' },
    { name: 'montantTva', formula: 'montantHT * tva' },
    { name: 'montantTTC', formula: 'montantHT + montantTva' },
  ],
  results: [
    { label: 'Total TTC', formula: 'montantTTC', format: 'eur', size: 'lg' },
    { label: 'Montant HT', formula: 'montantHT', format: 'eur', size: 'md' },
    { label: 'Dont TVA', formula: 'montantTva', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'bars',
    items: [
      { label: 'Main d\'œuvre', formula: 'surface * prixM2' },
      { label: 'Déplacement', formula: 'deplacement' },
      { label: 'TVA', formula: 'montantTva' },
    ],
  },
  baremes: {},
};

// 8. ROI publicitaire — d'un budget d'ads au chiffre d'affaires et au profit,
// via CPC, taux de conversion, panier moyen et marge. Cible : agences / marketeurs.
const ROI: CalculatorSchema = {
  fields: [
    { id: 'budget', type: 'slider', label: 'Budget publicitaire', default: 2000, min: 100, max: 50000, step: 100, suffix: '€' },
    { id: 'cpc', type: 'number', label: 'Coût par clic (CPC)', default: 0.8, min: 0.05, max: 20, step: 0.05, suffix: '€' },
    { id: 'conversion', type: 'number', label: 'Taux de conversion', default: 2, min: 0.1, max: 100, step: 0.1, suffix: '%' },
    { id: 'panier', type: 'number', label: 'Panier moyen', default: 60, min: 1, step: 5, suffix: '€' },
    { id: 'marge', type: 'slider', label: 'Marge brute', default: 40, min: 1, max: 100, step: 1, suffix: '%' },
  ],
  variables: [
    { name: 'clics', formula: 'budget / cpc' },
    { name: 'conversions', formula: 'clics * conversion / 100' },
    { name: 'chiffreAffaires', formula: 'conversions * panier' },
    { name: 'profit', formula: 'chiffreAffaires * marge / 100 - budget' },
  ],
  results: [
    { label: 'ROAS (retour sur dépense pub)', formula: 'chiffreAffaires / budget', format: 'number', size: 'lg' },
    { label: 'Chiffre d\'affaires estimé', formula: 'chiffreAffaires', format: 'eur', size: 'md' },
    { label: 'Profit net après pub', formula: 'profit', format: 'eur', size: 'md' },
    { label: 'Conversions attendues', formula: 'conversions', format: 'number', size: 'md' },
  ],
  chart: {
    type: 'bars',
    items: [
      { label: 'Budget pub', formula: 'budget' },
      { label: 'Chiffre d\'affaires', formula: 'chiffreAffaires' },
    ],
  },
  baremes: {},
};

export const TEMPLATES: Template[] = [
  {
    id: 'pret',
    name: 'Mensualités de prêt',
    description: 'Mensualité, coût total et part des intérêts d\'un crédit.',
    metier: 'Immobilier & crédit',
    schema: PRET,
  },
  {
    id: 'notaire',
    name: 'Frais de notaire',
    description: 'Frais d\'acquisition immobilière : droits, émoluments, débours (barèmes 2026).',
    metier: 'Immobilier & crédit',
    schema: NOTAIRE,
  },
  {
    id: 'capacite',
    name: 'Capacité d\'emprunt',
    description: 'Le capital empruntable à partir des revenus, au taux d\'endettement de 35 %.',
    metier: 'Immobilier & crédit',
    schema: CAPACITE,
  },
  {
    id: 'tjm',
    name: 'TJM freelance → net mensuel',
    description: 'Du taux journalier au revenu net après cotisations et impôt (micro-BNC).',
    metier: 'Freelance & indépendant',
    schema: TJM,
  },
  {
    id: 'epargne',
    name: 'Épargne & intérêts composés',
    description: 'La valeur future d\'un capital et de versements mensuels réguliers.',
    metier: 'Épargne & patrimoine',
    schema: EPARGNE,
  },
  {
    id: 'impot',
    name: 'Impôt sur le revenu 2026',
    description: 'Impôt et taux moyen selon le barème progressif et le quotient familial.',
    metier: 'Fiscalité',
    schema: IMPOT,
  },
  {
    id: 'devis',
    name: 'Devis travaux au m²',
    description: 'Chiffrage HT / TTC d\'un chantier au m² avec forfait et TVA rénovation.',
    metier: 'Artisan & BTP',
    schema: DEVIS,
  },
  {
    id: 'roi',
    name: 'ROI publicitaire',
    description: 'Du budget d\'ads au chiffre d\'affaires et au profit (CPC, conversion, marge).',
    metier: 'Marketing & agence',
    schema: ROI,
  },
];

// Ordre d'affichage des métiers dans la galerie /modeles (les métiers non
// listés viennent après, dans l'ordre d'apparition).
export const METIERS_ORDER = [
  'Immobilier & crédit',
  'Freelance & indépendant',
  'Épargne & patrimoine',
  'Fiscalité',
  'Artisan & BTP',
  'Marketing & agence',
];

// Regroupe les templates par métier en respectant METIERS_ORDER.
export function templatesByMetier(): { metier: string; templates: Template[] }[] {
  const groups = new Map<string, Template[]>();
  for (const tpl of TEMPLATES) {
    const list = groups.get(tpl.metier) ?? [];
    list.push(tpl);
    groups.set(tpl.metier, list);
  }
  const ordered = [...groups.keys()].sort((a, b) => {
    const ia = METIERS_ORDER.indexOf(a);
    const ib = METIERS_ORDER.indexOf(b);
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
  });
  return ordered.map((metier) => ({ metier, templates: groups.get(metier)! }));
}
